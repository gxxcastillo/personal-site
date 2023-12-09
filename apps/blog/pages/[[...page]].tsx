import Image from 'next/image';

import { PageHeader } from '@gxxc-blog/components';
import * as BlogComponents from '@gxxc-blog/components';
import { PageLayout } from '@gxxc-blog/layouts';
import { getPageStaticPaths, loadPage } from '@gxxc-blog/utils';
import { MDXRemote } from 'next-mdx-remote';
import { useRouter } from 'next/router';

export function Page({ source }) {
  const router = useRouter();
  const { page } = router.query;
  const Components = Object.assign({}, BlogComponents, { Image });

  return (
    <PageLayout header={<PageHeader>{source.frontmatter.title}</PageHeader>} footer={' '}>
      <MDXRemote {...source} components={Components} />
    </PageLayout>
  );
}

export async function getStaticProps({ params: { page = [] } }) {
  const source = await loadPage(page);
  return { props: { source } };
}

export function getStaticPaths() {
  const staticPaths = getPageStaticPaths();
  return {
    paths: staticPaths,
    fallback: false,
  };
}

export default Page;
