import { getSlugs, loadContent } from './utils';

export function getPageStaticParams() {
  return getSlugs('page').map((slug) => ({ slug: slug?.split('/') }));
}

export async function loadPage({ slug }: { slug: string[] }) {
  return loadContent('page', slug);
}
