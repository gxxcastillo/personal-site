import { type ComponentType } from 'react';
import { evaluate } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import * as runtime from 'react/jsx-runtime';

import { type ContentMetadata } from '@gxxc-blog/types';
import {
  getSlugs,
  loadFilteredContent,
  isDisplayable,
  loadContent,
} from './utils';

export function getPostStaticPaths() {
  return getSlugs('post', isDisplayable).map((slug) => ({ slug }));
}

export async function loadPost({ slug }: { slug: string }) {
  return loadContent('post', [slug]);
}

export async function getRecentPosts(limit?: number) {
  const posts = (await loadFilteredContent('post', isDisplayable, limit)).map(
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
