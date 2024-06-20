import { PageHeader, PostSummaries } from '@gxxc-blog/components';
import { PageLayout } from '@gxxc-blog/layouts';
import { getRecentPosts } from '@gxxc-blog/utils';

export default function PostIndex() {
  const posts = getRecentPosts();
  return (
    <PageLayout header={<PageHeader>Recent Posts</PageHeader>} footer={' '}>
      <PostSummaries posts={posts} />
    </PageLayout>
  );
}
