import Image from 'next/image';

import { PageHeader } from '@gxxc-blog/components';
import * as BlogComponents from '@gxxc-blog/components';
import { PageLayout } from '@gxxc-blog/layouts';
import { getPageStaticParams, loadPage } from '@gxxc-blog/utils';

export type PageProps = { params: { slug: string[] } };

export default async function Page({ params }: PageProps) {
  const components = Object.assign({}, BlogComponents, { Image });

  const { MdxContent, data, images } = await loadPage(params);

  return (
    <PageLayout header={<PageHeader>{data.title}</PageHeader>} footer={' '}>
      <MdxContent components={components} {...data} images={images} />
    </PageLayout>
  );
}

export function generateStaticParams() {
  return getPageStaticParams();
}
