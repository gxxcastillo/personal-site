import Image from 'next/image';

import { ContentLayout } from '@gxxc-blog/layouts';
import * as BlogComponents from '@gxxc-blog/components';
import { getPostStaticPaths, loadPost } from '@gxxc-blog/utils';

export type PostPageGetStaticPropsArgs = {
  params: {
    slug: string;
  };
};

const { PostFooter, PostHeader } = BlogComponents;

export default async function Post({ params }: PostPageGetStaticPropsArgs) {
  const { slug } = params;
  const components = Object.assign({}, BlogComponents, { Image });
  const { MdxContent, data, images } = await loadPost(params);

  if (!slug) {
    // @TODO - Will this ever happen? Can I just render the 404 page instead?
    return <div>404</div>;
  }

  return (
    <ContentLayout
      header={<PostHeader postID={slug.toString()}>{data.title}</PostHeader>}
      footer={<PostFooter tags={data.tags}> </PostFooter>}
    >
      <MdxContent components={components} {...data} images={images} />
    </ContentLayout>
  );
}

export function generateStaticParams() {
  return getPostStaticPaths();
}
