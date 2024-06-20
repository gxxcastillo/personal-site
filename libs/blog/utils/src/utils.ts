import { readdirSync, statSync, promises } from 'node:fs';
import * as path from 'node:path';
import { compile, run, evaluate, UseMdxComponents } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import * as runtime from 'react/jsx-runtime';

import { noCase } from 'change-case';
import { titleCase } from 'title-case';

import {
  type PostMetadata,
  type FrontMatterImageDeclaration,
  type FrontMatterImageMapping,
} from '@gxxc-blog/types';
import { ComponentType } from 'react';

const { readFile } = promises;

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
  // @ts-expect-error hopefully this gets resolved with an upcoming update
  const { default: MdxContent, frontmatter } = await evaluate(postText, {
    ...runtime,
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  });

  return { MdxContent, frontmatter } as {
    MdxContent: ComponentType<{ [str: string]: unknown }>;
    frontmatter: PostMetadata;
  };
}

export function slugArrayToString(slugArray: string[] = []) {
  const file = slugArray?.at(-1) ?? 'index';
  const relativePath = slugArray.slice(0, -1)?.join('/');
  return relativePath ? `${relativePath}/${file}` : file;
}

export function addExtraMetadata<D extends PostMetadata>(
  path: string,
  data: D
) {
  const slug = filePathToSlug(path);
  const extraData = {
    path: `/post/${slug}`,
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
