import { ReactNode } from 'react';
import Image from 'next/image';

import { PageHeader, ProjectList } from '@gxxc-blog/components';
import * as BlogComponents from '@gxxc-blog/components';
import { ContentLayout } from '@gxxc-blog/layouts';
import { getPageStaticParams, loadPage, getProjects } from '@gxxc-blog/utils';

type PageProps = { params: Promise<{ slug: string[] }> };

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const {
    MdxContent,
    data,
    images,
    shortcodes: usedShortcodes,
  } = await loadPage(resolvedParams);

  // Build shortcode elements based on what's used in the content
  const shortcodes: Record<string, ReactNode> = {};

  if (usedShortcodes.includes('projectList')) {
    const projects = await getProjects();
    shortcodes.projectList = <ProjectList projects={projects} />;
  }

  const components = { ...BlogComponents, Image };

  return (
    <ContentLayout header={<PageHeader>{data.title}</PageHeader>} footer={' '}>
      <MdxContent
        components={components}
        {...data}
        images={images}
        shortcodes={shortcodes}
      />
    </ContentLayout>
  );
}

export function generateStaticParams() {
  return getPageStaticParams();
}
