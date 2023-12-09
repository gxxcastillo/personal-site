import { PageHeader, PostSummaries } from 'libs/blog/components/src';
import { PageLayout } from 'libs/blog/layouts/src';
import { getRecentPosts } from '@gxxc-blog/utils';

export default function PostIndex({ posts }) {
  return (
    <PageLayout header={<PageHeader>Recent Posts</PageHeader>} footer={' '}>
      <PostSummaries posts={posts} />
    </PageLayout>
  );
}

export async function getStaticProps() {
  const posts = getRecentPosts();

  return {
    props: {
      posts,
    },
  };
}
