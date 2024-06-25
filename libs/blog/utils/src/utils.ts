import { readdirSync, statSync } from 'node:fs';
import * as path from 'node:path';

import { noCase } from 'change-case';
import { titleCase } from 'title-case';

import {
  type PostMetadata,
  type FrontMatterImageDeclaration,
  type FrontMatterImageMapping,
} from '@gxxc-blog/types';

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

export function slugArrayToString(slugArray: string[] = []) {
  const file = slugArray?.at(-1) ?? 'index';
  const relativePath = slugArray.slice(0, -1)?.join('/');
  return relativePath ? `${relativePath}/${file}` : file;
}

export function addExtraMetadata<D extends PostMetadata>(
  contentType: 'page' | 'post',
  path: string,
  data = {} as D
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
