import { readdirSync, statSync } from 'node:fs';
import * as path from 'node:path';

import matter, { GrayMatterFile } from 'gray-matter';
import { noCase } from 'change-case';
import { titleCase } from 'title-case';

import {
  type FrontMatterImageDeclaration,
  type FrontMatterImageMapping,
  ContentType,
  ContentMetadata,
} from '@gxxc-blog/types';

export type GrayMatterSource<T extends ContentType> = GrayMatterFile<string> & {
  data: ContentMetadata<T>;
};

const WORKSPACE_ROOT = process.env.NX_WORKSPACE_ROOT as string;
export const PAGES_ROOT_PATH = path.join(
  WORKSPACE_ROOT,
  '/libs/blog/content/pages'
);
export const POSTS_ROOT_PATH = path.join(
  WORKSPACE_ROOT,
  '/libs/blog/content/posts'
);
export const IMAGES_ROOT_PATH = path.join(
  WORKSPACE_ROOT,
  '/libs/blog/assets/img'
);

export function isEnvTrue(val?: string, defaultValue?: boolean) {
  if (val === undefined) {
    return defaultValue;
  }

  return val === 'true' || val === 'TRUE';
}

export function recursiveDirectoryRead(path: string, fileNames: string[] = []) {
  const directoryFiles = readdirSync(path);

  directoryFiles?.forEach((file) => {
    if (file.startsWith('.')) return;

    const filePath = `${path}/${file}`;
    if (statSync(filePath).isDirectory()) {
      recursiveDirectoryRead(filePath, fileNames);
    } else {
      fileNames.push(filePath);
    }
  });

  return fileNames;
}

export function filePathToSlug(path: string) {
  return path.replace(/\.mdx?$/, '');
}

export function toSlugArray(slug: string) {
  return slug.split('/');
}

export function addExtraMetadata<T extends ContentType>(
  contentType: T,
  path: string,
  data = {} as ContentMetadata<T>
) {
  const slug = filePathToSlug(path);
  const extraData = {
    path: `/${contentType}/${slug}`,
    title: data.title || titleCase(noCase(slug)),
    slug,
  };

  return {
    ...data,
    ...extraData,
  };
}

export function createImageLoader() {
  // Uses webpack custom context: https://webpack.js.org/guides/dependency-management/#require-context
  return (require as any).context(
    '../../assets/img',
    false,
    /\.(png|jpe?g|svg|gif)$/
  );
}

export async function importImage(key: string) {
  const imageLoader = createImageLoader();
  return await imageLoader(`./${key}`).default;
}

export async function parseFrontMatterImages(
  images?: FrontMatterImageDeclaration
) {
  return typeof images === 'object'
    ? Object.entries(images).reduce(
        async (obj: Promise<FrontMatterImageMapping>, [name, value]) => {
          const resolved = await obj;
          resolved[name] = await importImage(value);
          return resolved;
        },
        Promise.resolve({})
      )
    : {};
}

export function loadContent<T extends ContentType>(
  contentType: T,
  filter: (data: ContentMetadata<T>) => boolean,
  limit = 10
) {
  const rootPath = contentType === 'post' ? POSTS_ROOT_PATH : PAGES_ROOT_PATH;

  return readdirSync(rootPath)
    .filter((fname) => /\.mdx?$/.test(fname))
    .filter((fname) => !fname.startsWith('.'))
    .map((path) => {
      const absoluteFilename = `${rootPath}/${path}`;
      const isDirectory = statSync(absoluteFilename).isDirectory();
      if (isDirectory) {
        return undefined;
      }

      const source = readFileMetaData<T>(absoluteFilename);
      if (typeof source.data.date !== 'object') {
        if (source.data.date) {
          const date = new Date(source.data.date);
          source.data.date = isNaN(date.getTime()) ? undefined : date;
        } else {
          source.data.date = undefined;
        }
      }

      if (!filter(source.data)) {
        return undefined;
      }

      const data = addExtraMetadata(contentType, path, source.data);
      source.data = data;

      return source;
    })
    .filter((p): p is GrayMatterSource<T> => !!p)
    .sort((a, b) => {
      if (!a.data.date) return 1;
      if (!b.data.date) return -1;
      return b.data.date.getTime() - a.data.date.getTime();
    })
    .slice(0, limit);
}

const contentPath: { post: string; page: string } = {
  post: POSTS_ROOT_PATH,
  page: PAGES_ROOT_PATH,
};

export function readFileMetaData<T extends ContentType>(
  absoluteFilename: string
) {
  return matter.read(absoluteFilename) as GrayMatterSource<T>;
}

export function getSlugs<T extends ContentType>(
  contentType: T,
  filter: (source: ContentMetadata<T>) => boolean = () => true
) {
  const rootPath = contentPath[contentType];
  const absoluteFileNames = recursiveDirectoryRead(rootPath);
  const startIndex = rootPath.length + 1;

  return absoluteFileNames
    ?.map((fileName) => {
      const source = readFileMetaData<T>(fileName);
      if (!filter?.(source.data)) {
        return undefined;
      }

      const lastSegment = fileName?.lastIndexOf('/');
      if (fileName.slice(lastSegment) === '/index.md') {
        fileName = fileName.slice(0, lastSegment);
      }

      return filePathToSlug(fileName?.slice(startIndex)) || '/';
    })
    .filter(Boolean);
}
