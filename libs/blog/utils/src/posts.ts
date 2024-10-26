import { promises } from 'node:fs';
import { type ComponentType } from 'react';
import { evaluate } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import * as runtime from 'react/jsx-runtime';

import { type ContentMetadata, type ContentType } from '@gxxc-blog/types';
import { POSTS_ROOT_PATH, isEnvTrue, getSlugs, loadContent } from './utils';

const { readFile } = promises;

export function getPostStaticPaths() {
  return getSlugs('post', isDisplayable).map((slug) => ({ slug }));
}

export function isDisplayable<D extends ContentMetadata<ContentType>>(data: D) {
  const today = new Date();

  if (isEnvTrue(process.env.SHOW_PUBLISHED_ONLY, true)) {
    if (!data.date || data.date > today || data.status !== 'PUBLISHED') {
      return false;
    }
  }

  return true;
}

export async function loadRawPost(slug: string) {
  const postPath = `${POSTS_ROOT_PATH}/${slug}.md`;
  return await readFile(postPath, 'utf8');
}

export async function loadPost(params: { slug: string }) {
  const postText = await loadRawPost(params.slug);
  // @ts-expect-error hopefully this gets resolved with an upcoming update
  const { default: MdxContent, frontmatter } = await evaluate(postText, {
    ...runtime,
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  });

  return { MdxContent, frontmatter } as {
    MdxContent: ComponentType<{ [str: string]: unknown }>;
    frontmatter: ContentMetadata<'post'>;
  };
}

export function getRecentPosts(limit?: number) {
  const posts = loadContent('post', isDisplayable, limit).map(
    async ({ data, content }) => {
      if (!data.excerpt) {
        data.excerpt =
          content.length > 290 ? `${content.slice(0, 290)}\u2026` : content;
      }

      // @ts-expect-error hopefully this gets resolved with an upcoming update
      const { default: MdxContent } = (await evaluate(data.excerpt, {
        ...runtime,
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      })) as {
        MdxContent: ComponentType<{ [str: string]: unknown }>;
        frontmatter: ContentMetadata<'post'>;
      };

      return {
        MdxContent,
        data,
      };
    }
  );

  return Promise.all(posts);
}
