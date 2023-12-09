import { readdirSync, statSync, promises, existsSync } from 'node:fs';
import * as path from 'node:path';
import { noCase } from 'change-case';
import { titleCase } from 'title-case';
import { serialize } from 'next-mdx-remote/serialize';

import { workspaceRoot } from '@nx/devkit';
import { type FrontMatterImageDeclaration, type FrontMatterImageMapping } from './types';
export * from './types';

const { readFile } = promises;

export const PAGES_ROOT_PATH = path.join(workspaceRoot, '/libs/blog/content/pages');
export const POSTS_ROOT_PATH = path.join(workspaceRoot, '/libs/blog/content/posts');
export const IMAGES_ROOT_PATH = path.join(workspaceRoot, '/libs/blog/assets/img');

export function isTrue(val?: string) {
  return val === 'true' || 'TRUE';
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

export async function loadRawPost(slug: string) {
  const postPath = `${POSTS_ROOT_PATH}/${slug}.md`;
  return await readFile(postPath, 'utf8');
}

export async function loadPost(slug: string) {
  const postText = await loadRawPost(slug);
  const mdxSource = await serialize(postText, {
    parseFrontmatter: true
  });

  const metadata = addExtraMetadata(slug, mdxSource.frontmatter);
  mdxSource.frontmatter = metadata;
  return mdxSource;
}

export function slugArrayToString(slugArray: string[]) {
  const file = slugArray?.at(-1) ?? 'index';
  const relativePath = slugArray.slice(0, -1)?.join('/');
  return relativePath ? `${relativePath}/${file}` : file;
}

export function addExtraMetadata<D extends Record<string, unknown>>(path: string, data: D) {
  const slug = filePathToSlug(path);
  const extraData = {
    path: `/post/${slug}`,
    title: data.title || titleCase(noCase(slug)),
    slug
  };

  return {
    ...data,
    ...extraData
  };
}

export function createImageLoader() {
  // Uses webpack custom context: https://webpack.js.org/guides/dependency-management/#require-context
  return (require as any).context('../../assets/img', false, /\.(png|jpe?g|svg|gif)$/);
}

export async function importImage(key: string) {
  const imageLoader = createImageLoader();
  return await imageLoader(`./${key}`).default;
}

export async function parseFrontMatterImages(images?: FrontMatterImageDeclaration) {
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
