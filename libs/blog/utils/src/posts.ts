import { readdirSync, statSync, promises } from 'node:fs';
import { type ComponentType } from 'react';
import { evaluate } from '@mdx-js/mdx';
import matter, { GrayMatterFile } from 'gray-matter';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import * as runtime from 'react/jsx-runtime';

import { type PostMetadata } from '@gxxc-blog/types';
import {
  recursiveDirectoryRead,
  filePathToSlug,
  addExtraMetadata,
  POSTS_ROOT_PATH,
  isEnvTrue,
} from './utils';

const { readFile } = promises;

export type GrayMatterSource = GrayMatterFile<string> & { data: PostMetadata };

export function getPostSlugs() {
  const absoluteFileNames = recursiveDirectoryRead(POSTS_ROOT_PATH);
  const startIndex = POSTS_ROOT_PATH.length + 1;

  return absoluteFileNames
    ?.map((fileName) => {
      const source = readFileMetaData(fileName);
      if (!canShowPost(source.data)) {
        return undefined;
      }

      const lastSegment = fileName?.lastIndexOf('/');
      fileName =
        fileName.slice(lastSegment) === 'index'
          ? fileName.slice(0, lastSegment)
          : fileName;

      return filePathToSlug(fileName?.slice(startIndex));
    })
    .filter((result) => {
      return !!result;
    });
}

export function getPostStaticPaths() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function canShowPost(data: PostMetadata) {
  const today = new Date();

  if (isEnvTrue(process.env.SHOW_PUBLISHED_ONLY, true)) {
    if (!data.date || data.date > today || data.status !== 'PUBLISHED') {
      return false;
    }
  }

  return true;
}

export function readFileMetaData(absoluteFilename: string) {
  return matter.read(absoluteFilename) as GrayMatterSource;
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

export function loadPosts(limit = 10) {
  return readdirSync(POSTS_ROOT_PATH)
    .filter((fname) => /\.mdx?$/.test(fname))
    .filter((fname) => !fname.startsWith('.'))
    .map((path) => {
      const absoluteFilename = `${POSTS_ROOT_PATH}/${path}`;
      const isDirectory = statSync(absoluteFilename).isDirectory();
      if (isDirectory) {
        return undefined;
      }

      const source = readFileMetaData(absoluteFilename);
      if (typeof source.data.date !== 'object') {
        source.data.date = new Date(source.data.date);
      }

      if (!canShowPost(source.data)) {
        return undefined;
      }

      const data = addExtraMetadata('post', path, source.data);
      source.data = data;

      return source;
    })
    .filter((p): p is GrayMatterSource => !!p)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

export function getRecentPosts(limit?: number) {
  return loadPosts(limit).map(({ data, content }) => {
    if (!data.excerpt) {
      data.excerpt =
        content.length > 290 ? `${content.slice(0, 290)}\u2026` : content;
    }

    const recentPosts = {
      ...data,
      date: data.date.getTime(),
    };

    return recentPosts;
  });
}
