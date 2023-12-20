export type FrontMatterImageDeclaration = Record<string, string>;
export type FrontMatterImageMapping = Record<string, string>;

export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface PostAuthor {
  name?: string;
  email?: string;
}

export type DateString = Date;

export interface PostMetadata {
  title?: string;
  slug: string;
  path: string;
  excerpt?: string;
  date: DateString;
  tags?: string[];
  author?: PostAuthor;
  status?: PostStatus;
  images?: FrontMatterImageDeclaration;
}
