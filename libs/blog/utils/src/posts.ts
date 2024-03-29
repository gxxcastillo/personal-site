import matter, { GrayMatterFile } from 'gray-matter';

import { readdirSync, statSync } from 'node:fs';

import { type PostMetadata } from '@gxxc-blog/types';
import {
  recursiveDirectoryRead,
  filePathToSlug,
  addExtraMetadata,
  POSTS_ROOT_PATH,
  isEnvTrue,
} from './utils';

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
  return getPostSlugs().map((slug) => ({ params: { slug } }));
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

      const source = readFileMetaData(absoluteFilename);
      const data = addExtraMetadata(path, source.data);

      if (!canShowPost(data)) {
        return undefined;
      }

      source.data = data;
      return source;
    })
    .filter((p): p is GrayMatterSource => !!p);
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
