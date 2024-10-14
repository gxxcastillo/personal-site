import Image from 'next/image';

import { PageHeader } from '@gxxc-blog/components';
import * as BlogComponents from '@gxxc-blog/components';
import { PageLayout } from '@gxxc-blog/layouts';
import {
  addExtraMetadata,
  getPageStaticParams,
  loadPage,
  parseFrontMatterImages,
  slugArrayToString,
} from '@gxxc-blog/utils';

export type PageProps = { params: { slug: string[] } };

export default async function Page({ params }: PageProps) {
  const components = Object.assign({}, BlogComponents, { Image });

  const { MdxContent, frontmatter } = await loadPage(params);
  const path = slugArrayToString(params.slug);
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
