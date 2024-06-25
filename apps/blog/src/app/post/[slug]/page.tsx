import Image from 'next/image';

import { PostLayout } from '@gxxc-blog/layouts';
import * as BlogComponents from '@gxxc-blog/components';

import {
  addExtraMetadata,
  getPostStaticPaths,
  loadPost,
  parseFrontMatterImages,
} from '@gxxc-blog/utils';

export type PostPageGetStaticPropsArgs = {
  params: {
    slug: string;
  };
};

const { PostFooter, PostHeader } = BlogComponents;

export default async function Post({ params }: PostPageGetStaticPropsArgs) {
  const { slug } = params;
  const components = Object.assign({}, BlogComponents, { Image });
  const { MdxContent, frontmatter } = await loadPost(slug);

  if (!slug) {
    // @TODO - Will this ever happen? Can I just render the 404 page instead?
    return <div>404</div>;
  }

  const data = addExtraMetadata('post', slug, frontmatter);
  const images = await parseFrontMatterImages(frontmatter?.images);

  return (
    <PostLayout
      header={
        <PostHeader postID={slug.toString()}>{frontmatter.title}</PostHeader>
      }
      footer={<PostFooter tags={frontmatter.tags}> </PostFooter>}
    >
      <MdxContent components={components} {...data} images={images} />
    </PostLayout>
  );
}

export function generateStaticParams() {
  return getPostStaticPaths();
}
