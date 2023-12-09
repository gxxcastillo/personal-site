import { useRouter } from 'next/router';
import Image from 'next/image';

import { MDXRemote } from 'next-mdx-remote';

import { PostLayout } from 'libs/blog/layouts/src';
import * as BlogComponents from 'libs/blog/components/src';

import { getPostSlugs, getPostStaticPaths, loadPost } from '@gxxc-blog/utils';

const { PostFooter, PostHeader } = BlogComponents;

export default function PostPage({ source }) {
  const router = useRouter();
  const { slug } = router.query;
  const Components = Object.assign({}, BlogComponents, {
    Image,
  });

  if (!slug) {
    // @TODO - Will this ever happen? Can I just render the 404 page instead?
    return <div>404</div> 
  }

  return (
    <PostLayout
      header={
        <PostHeader postID={slug.toString()}>
          {source.frontmatter.title}
        </PostHeader>
      }
      footer={<PostFooter tags={source.frontmatter.tags}> </PostFooter>}
    >
      <MDXRemote {...source} components={Components} />
    </PostLayout>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const source = await loadPost(slug);

  return { props: { source } };
}

export async function getStaticPaths() {
  return {
    paths: getPostStaticPaths(),
    fallback: false,
  };
}
