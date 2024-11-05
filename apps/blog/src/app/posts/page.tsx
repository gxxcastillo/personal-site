import { PageHeader, PostSummaries } from '@gxxc-blog/components';
import { ContentLayout } from '@gxxc-blog/layouts';
import { getRecentPosts } from '@gxxc-blog/utils';

export default async function PostsIndex() {
  const posts = await getRecentPosts();
  return (
    <ContentLayout header={<PageHeader>Recent Posts</PageHeader>} footer={' '}>
      <PostSummaries posts={posts} />
    </ContentLayout>
  );
}
