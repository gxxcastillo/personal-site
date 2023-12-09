export type FrontMatterImageDeclaration = Record<string, string>;
export type FrontMatterImageMapping = Record<string, string>;

export interface PostAuthor {
  name?: string;
  email?: string;
}

export type DateString = string;

export interface PostMetadata {
  title?: string;
  slug: string;
  path: string;
  excerpt?: string;
  date: DateString;
  tags?: string[];
  author?: PostAuthor;
}
