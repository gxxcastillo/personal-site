import Image from 'next/image';

import { PageHeader } from '@gxxc-blog/components';
import * as BlogComponents from '@gxxc-blog/components';
import { PageLayout } from '@gxxc-blog/layouts';
import {
  addExtraMetadata,
  getPageStaticParams,
  loadPageContent,
  parseFrontMatterImages,
  slugArrayToString,
} from '@gxxc-blog/utils';

export type PageProps = { params: { page: string[] } };

export default async function Page({ params }: PageProps) {
  const components = Object.assign({}, BlogComponents, { Image });
  const { MdxContent, frontmatter } = await loadPageContent(params.page);
  const path = slugArrayToString(params.page);
  const data = addExtraMetadata('page', path, frontmatter);
  const images = await parseFrontMatterImages(frontmatter?.images);

  return (
    <PageLayout header={<PageHeader>{data.title}</PageHeader>} footer={' '}>
      <MdxContent components={components} {...data} images={images} />
    </PageLayout>
  );
}

export function generateStaticParams() {
  return getPageStaticParams();
}
