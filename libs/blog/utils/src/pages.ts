import { statSync, promises, existsSync } from 'node:fs';
import { evaluate } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import * as runtime from 'react/jsx-runtime';

import {
  recursiveDirectoryRead,
  filePathToSlug,
  PAGES_ROOT_PATH,
} from './utils';

import { PostMetadata } from '@gxxc-blog/types';
import { ComponentType } from 'react';

export function getFilePathArrays() {
  const absoluteFileNames = recursiveDirectoryRead(PAGES_ROOT_PATH);

  const startIndex = PAGES_ROOT_PATH.length + 1;
  return absoluteFileNames.map((fileName) =>
    fileName.slice(startIndex).split('/')
  );
}

export function getPageSlugs() {
  const absoluteFileNames = recursiveDirectoryRead(PAGES_ROOT_PATH);
  const startIndex = PAGES_ROOT_PATH.length + 1;

  return absoluteFileNames?.map((fileName) => {
    const lastSegment = fileName?.lastIndexOf('/');
    fileName =
      fileName.slice(lastSegment) === 'index'
        ? fileName.slice(0, lastSegment)
        : fileName;

    return filePathToSlug(fileName?.slice(startIndex));
  });
}

export function getPageSlugArrays() {
  const absoluteFileNames = recursiveDirectoryRead(PAGES_ROOT_PATH);

  const startIndex = PAGES_ROOT_PATH.length + 1;
  return absoluteFileNames?.map((fileName) => {
    const slugArray = filePathToSlug(fileName?.slice(startIndex)).split('/');
    if (slugArray.at(-1) === 'index') {
      slugArray.pop();
    }
    return slugArray;
  });
}

export async function loadRawPage(page: string[] = []) {
  const file = page?.at(-1) ?? 'index';
  const relativePath = page.slice(0, -1)?.join('/');
  const absolutePath = relativePath
    ? `${PAGES_ROOT_PATH}/${relativePath}`
    : `${PAGES_ROOT_PATH}`;

  const absoluteSlug = `${absolutePath}/${file}`;
  const fileName =
    existsSync(absoluteSlug) && statSync(absoluteSlug).isDirectory()
      ? `${absoluteSlug}/index.md`
      : `${absoluteSlug}.md`;

  const { readFile } = promises;
  return await readFile(fileName, 'utf8');
}

export async function loadPageContent(page: string[]) {
  const pageText = await loadRawPage(page);
  // @ts-expect-error hopefully this gets resolved with an upcoming update
  const { default: MdxContent, frontmatter } = await evaluate(pageText, {
    ...runtime,
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  });

  return { MdxContent, frontmatter } as {
    MdxContent: ComponentType<{ [str: string]: unknown }>;
    frontmatter: PostMetadata;
  };
}

export function getPageStaticParams() {
  return getPageSlugArrays().map((page) => ({ page }));
}
