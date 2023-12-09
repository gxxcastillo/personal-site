import matter, { GrayMatterFile } from 'gray-matter';

import { readdirSync, statSync } from 'node:fs';

import { type PostMetadata } from './types';
import {
  recursiveDirectoryRead,
  filePathToSlug,
  addExtraMetadata,
  POSTS_ROOT_PATH,
  isTrue,
} from './utils';
export * from './types';

export function getPostSlugs() {
  const absoluteFileNames = recursiveDirectoryRead(POSTS_ROOT_PATH);
  const startIndex = POSTS_ROOT_PATH.length + 1;

  return absoluteFileNames?.map((fileName) => {
    const lastSegment = fileName?.lastIndexOf('/');
    fileName =
      fileName.slice(lastSegment) === 'index'
        ? fileName.slice(0, lastSegment)
        : fileName;

    return filePathToSlug(fileName?.slice(startIndex));
  });
}

export function getPostStaticPaths() {
  return getPostSlugs().map((slug) => ({ params: { slug } }));
}

export function loadPosts(limit = 10) {
  const today = new Date();

  return readdirSync(POSTS_ROOT_PATH)
    .filter((fname) => /\.mdx?$/.test(fname))
    .filter((fname) => !fname.startsWith('.'))
    .map((path, index) => {
      const absoluteFilename = `${POSTS_ROOT_PATH}/${path}`;
      const isDirectory = statSync(absoluteFilename).isDirectory();
      if (isDirectory || index >= limit) {
        return undefined;
      }

      const source = matter.read(absoluteFilename);
      const data = addExtraMetadata(path, source.data);

      if (!isTrue(process.env.SHOW_ALL_POSTS)) {
        if (data.date > today || data.status !== 'PUBLISHED') {
          return undefined;
        }
      }

      source.data = data;
      return source;
    })
    .filter((p): p is GrayMatterFile<string> => !!p);
}

export function getRecentPosts(limit?: number) {
  return loadPosts(limit)
    .map(({ data, content }) => {
      if (!data.excerpt) {
        data.excerpt =
          content.length > 290 ? `${content.slice(0, 290)}\u2026` : content;
      }

      return data as PostMetadata;
    })
    .filter((d?): d is PostMetadata => !!d)
    .sort((dataA: PostMetadata, dataB: PostMetadata) => {
      return +new Date(dataB.date) - +new Date(dataA.date);
    })
    .slice(0, 10);
}
