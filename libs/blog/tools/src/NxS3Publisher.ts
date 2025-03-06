import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createReadStream, existsSync, ReadStream } from 'node:fs';
import path, { relative } from 'node:path';
import { spawn } from 'node:child_process';

import { S3 } from '@aws-sdk/client-s3';
import { readCachedProjectGraph } from '@nx/devkit';
import { Upload } from '@aws-sdk/lib-storage';
import { load as loadYaml, dump as dumpYaml } from 'js-yaml';
import { createHash } from 'crypto';

import { glob } from 'glob';
import dotenv from 'dotenv';

export interface INxS3Publisher {
  /**
   * The path to the built content that is to be published.
   * Relative to NX_WORKSPACE_ROOT
   */
  publishPath: string;

  /**
   * The name of the target that builds the content
   */
  buildTarget: string;

  /**
   * The name of the project that contains the application
   * that gets built
   */
  appProject: string;

  /**
   * The name of the project that contains the content that
   * is used by the application being built
   */
  contentProject: string;

  /**
   * General options
   */
  options: Options;
}

export type FilePublishState = {
  hash: string;
  date_published: string;
  date_modified: string;
};

export type PublishState = {
  [filePath: string]: FilePublishState;
};

export type Options = {
  /**
   * A regex that filters for all content files.
   */
  contentFilter: RegExp;

  /**
   * The file extension that is added to all published content
   */
  fileExtension: string;
};

export type FileUpload = {
  filename: string;
  readStream: ReadStream;
  contentType?: string;
};

export const CONTENT_CONFIG_FOLDER = '.publish';
export const PUBLISH_CONFIG_FILE = 'state.yml';
export const contentTypeMap: Record<string, string> = {
  txt: 'text/plain',
  html: 'text/html',
  js: 'application/javascript',
  css: 'text/css',
};

export class NxS3Publisher {
  private readonly workspaceRoot: string;
  private readonly publishPath: string;
  private readonly configPath: string;
  private readonly bucketName: string;
  private readonly buildTarget: string;
  private readonly nxProject: string;
  private readonly options: Options;
  private readonly s3Client: S3;

  constructor({
    publishPath,
    buildTarget,
    appProject,
    contentProject,
    options,
  }: INxS3Publisher) {
    dotenv.config();

    if (!publishPath || !buildTarget || !appProject || !contentProject) {
      throw new Error('Missing required arguments');
    }

    this.workspaceRoot = process.env.NX_WORKSPACE_ROOT as string;
    this.publishPath = path.join(this.workspaceRoot, publishPath);

    const projectGraph = readCachedProjectGraph();
    const contentPath = projectGraph.nodes[contentProject].data.root;
    if (!contentPath) {
      throw new Error(`Project ${contentPath} not found`);
    }

    const configPath = `${contentPath}/${CONTENT_CONFIG_FOLDER}/${PUBLISH_CONFIG_FILE}`;
    this.configPath = path.join(this.workspaceRoot, configPath);
    this.bucketName = process.env.S3_BUCKET_NAME as string;
    this.buildTarget = buildTarget;
    this.nxProject = appProject;
    this.options = options;

    if (!this.bucketName) {
      throw new Error('Missing required environment variable: S3_BUCKET_NAME');
    }

    this.s3Client = new S3({});
  }

  private async getFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const stream = createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (error) => reject(error));
    });
  }

  private normalizeName(relativePath: string): string {
    const isContentFile = this.options.contentFilter.test(relativePath);
    if (!isContentFile) {
      return relativePath;
    }

    const fileSplit = relativePath.split('.');
    const lastIndex = fileSplit.length - 1;
    const fileExtension = lastIndex > -1 ? fileSplit[lastIndex] : undefined;

    const shouldHaveFileExtension = !!this.options.fileExtension;
    const hasFileExtension = !!fileExtension;

    if (
      shouldHaveFileExtension &&
      fileExtension === this.options.fileExtension
    ) {
      fileSplit[lastIndex] = this.options.fileExtension;
    }

    if (!shouldHaveFileExtension && hasFileExtension) {
      fileSplit.pop();
    }

    return fileSplit.join('.');
  }

  private async loadPublishState(): Promise<PublishState> {
    if (!existsSync(this.configPath)) {
      return {};
    }
    const content = await readFile(this.configPath, 'utf-8');
    return (loadYaml(content) as PublishState) || {};
  }

  /**
   * Concurrently upload files to S3
   */
  private async syncToS3(fileUploads: FileUpload[]) {
    console.log(`\nUploading ${fileUploads.length} files to S3...`);

    const uploadPromises = fileUploads.map(
      async ({ filename, readStream, contentType }) => {
        const upload = new Upload({
          client: this.s3Client,
          params: {
            Bucket: this.bucketName,
            Key: filename,
            Body: readStream,
            ContentType: contentType,
          },
        });

        await upload.done();
        console.log(`Uploaded: ${filename}`);
      }
    );

    await Promise.all(uploadPromises);
    console.log('\nAll files uploaded successfully!');
  }

  private async uploadFiles(
    files: { hasChanged: boolean; filePath: string }[]
  ) {
    if (files.length > 0) {
      const fileUploads: FileUpload[] = [];
      for (const { filePath, hasChanged } of files) {
        const relativePath = relative(this.publishPath, filePath);
        if (hasChanged) {
          const fileExtension = getFileExtension(filePath);
          fileUploads.push({
            filename: this.normalizeName(relativePath),
            readStream: createReadStream(filePath),
            contentType: fileExtension
              ? contentTypeMap[fileExtension]
              : undefined,
          });
        } else {
          console.log(`Skipping [unchanged]: ${relativePath}`);
        }
      }

      if (fileUploads.length > 0) {
        await this.syncToS3(fileUploads);
      }
    } else {
      console.log(
        `The source folder, ${this.publishPath}, does not contain any files`
      );
    }
  }

  async buildAssets() {
    console.log('\nBuilding blog assets...');
    return new Promise<void>((resolve, reject) => {
      const build = spawn('pnpm', ['nx', this.buildTarget, this.nxProject], {
        cwd: this.workspaceRoot,
        stdio: 'inherit', // This will pipe stdout/stderr directly to the parent process
      });

      build.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build process exited with code ${code}`));
        }
      });

      build.on('error', (err) => {
        reject(err);
      });
    });
  }

  async getFiles() {
    const publishState = await this.loadPublishState();

    // Find all files in build directory
    const files = await glob('**/*', {
      cwd: this.publishPath,
      nodir: true,
      absolute: true,
    });

    const promise = files.map(async (file) => {
      const relPath = path.relative(this.publishPath, file);
      const fileHash = await this.getFileHash(file);
      const fileState = publishState[relPath];

      const hasChanged = !fileState || fileState.hash !== fileHash;
      const now = new Date().toISOString();
      const state = hasChanged
        ? {
            hash: fileHash,
            date_published: fileState?.date_published || now,
            date_modified: now,
          }
        : fileState;

      return {
        filePath: file,
        relativePath: relative(this.publishPath, file),
        hasChanged,
        state,
      };
    });

    return Promise.all(promise);
  }

  async updatePublishState(publishState: PublishState) {
    // Ensure CONTENT_CONFIG_FOLDER exists
    await mkdir(path.dirname(this.configPath), { recursive: true });

    const header = `# This file is auto-generated. Do not edit manually.
# Last updated: ${new Date().toISOString()}`;
    const yaml = dumpYaml(publishState);
    await writeFile(this.configPath, `${header}\n${yaml}`);

    console.log(`\nPublish state location: ${this.configPath}`);
  }

  async publish(): Promise<void> {
    await this.buildAssets();
    const files = await this.getFiles();

    await this.uploadFiles(files);

    const publishState = files.reduce((newState: PublishState, file) => {
      newState[file.relativePath] = file.state;
      return newState;
    }, {});

    await this.updatePublishState(publishState);
  }
}

export function getFileExtension(filePath: string): string | undefined {
  const lastDotIndex = filePath.lastIndexOf('.');
  return lastDotIndex > -1 ? filePath.slice(lastDotIndex + 1) : undefined;
}
