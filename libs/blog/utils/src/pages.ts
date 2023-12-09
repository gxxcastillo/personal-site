import { statSync, promises, existsSync } from 'node:fs';
import { serialize } from 'next-mdx-remote/serialize';

import {
  recursiveDirectoryRead,
  filePathToSlug,
  parseFrontMatterImages,
  addExtraMetadata,
  slugArrayToString,
  PAGES_ROOT_PATH,
} from './utils';

import { type FrontMatterImageDeclaration } from './types';

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
    return slugArray.at(-1) === 'index' ? slugArray.slice(0, -1) : slugArray;
  });
}

export async function loadRawPage(page: string[]) {
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

export async function loadPage(page: string[]) {
  const pageText = await loadRawPage(page);
  const mdxSource = await serialize(pageText, { parseFrontmatter: true });

  const frontmatter = mdxSource?.frontmatter;
  mdxSource.scope.images = await parseFrontMatterImages(
    frontmatter?.images as FrontMatterImageDeclaration
  );
  mdxSource.frontmatter = addExtraMetadata(
    slugArrayToString(page),
    frontmatter
  );

  return mdxSource;
}

export function getPageStaticPaths() {
  return getPageSlugArrays().map((page) => ({ params: { page } }));
}
