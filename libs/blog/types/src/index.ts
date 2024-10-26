export type UnknownRecord = Record<string, unknown>;

export type FrontMatterImageDeclaration = Record<string, string>;
export type FrontMatterImageMapping = Record<string, string>;

export type PostStatus = 'DRAFT' | 'PUBLISHED';
export type ContentType = 'post' | 'page';

export interface PostAuthor {
  name?: string;
  email?: string;
}

export type DateString = Date;
export type EmptyRecord = Record<string, never>;

export type ContentMetadata<T extends ContentType> = (T extends 'post'
  ? { date?: DateString }
  : EmptyRecord) & {
  title?: string;
  slug: string;
  path: string;
  excerpt?: string;
  tags?: string[];
  author?: PostAuthor;
  status?: PostStatus;
  images?: FrontMatterImageDeclaration;
};
