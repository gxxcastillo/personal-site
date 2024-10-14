import { statSync, promises, existsSync } from 'node:fs';
import { evaluate } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import * as runtime from 'react/jsx-runtime';

import { PAGES_ROOT_PATH, getSlugs } from './utils';

import { type ContentMetadata } from '@gxxc-blog/types';
import { ComponentType } from 'react';

export function getPageStaticParams() {
  return getSlugs('page').map((slug) => ({ slug: slug?.split('/') }));
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

export async function loadPage({ slug }: { slug: string[] }) {
  const pageText = await loadRawPage(slug);

  // @ts-expect-error hopefully this gets resolved with an upcoming update
  const { default: MdxContent, frontmatter } = await evaluate(pageText, {
    ...runtime,
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  });

  return { MdxContent, frontmatter } as {
    MdxContent: ComponentType<{ [str: string]: unknown }>;
    frontmatter: ContentMetadata<'page'>;
  };
}

export function slugArrayToString(slugArray: string[] = []) {
  const file = slugArray?.at(-1) ?? 'index';
  const relativePath = slugArray.slice(0, -1)?.join('/');
  return relativePath ? `${relativePath}/${file}` : file;
}
