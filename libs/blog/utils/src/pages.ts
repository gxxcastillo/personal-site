import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  getSlugs,
  loadContent,
  PAGES_ROOT_PATH,
  readFileMetaData,
  addExtraMetadata,
} from './utils';
import { ContentMetadata } from '@gxxc-blog/types';

export function getPageStaticParams() {
  return getSlugs('page').map((slug) => ({ slug: slug?.split('/') }));
}

export async function loadPage({ slug }: { slug: string[] }) {
  return loadContent('page', slug);
}

export type ProjectData = ContentMetadata<'page'> & {
  slug: string;
  path: string;
};

export async function getProjects(): Promise<ProjectData[]> {
  const projectsPath = join(PAGES_ROOT_PATH, 'project');

  const files = readdirSync(projectsPath).filter((fname) =>
    /\.mdx?$/.test(fname)
  );

  const projects = await Promise.all(
    files.map(async (filename) => {
      const absolutePath = join(projectsPath, filename);
      const source = readFileMetaData<'page'>(absolutePath);

      if (source.data.status !== 'PUBLISHED') {
        return null;
      }

      const data = await addExtraMetadata('page', `project/${filename}`, source);
      return data as ProjectData;
    })
  );

  return projects.filter((p): p is ProjectData => p !== null);
}
