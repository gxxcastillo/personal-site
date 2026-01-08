import Link from 'next/link';

import styles from './PostSummaries.module.css';
import { ComponentType } from 'react';

export interface PostSummary {
  MdxContent: ComponentType;
  data: {
    title?: string;
    path: string;
    slug: string;
    excerpt?: string;
  };
}

export interface PostSummariesProps {
  posts: PostSummary[];
}

export function PostSummaries({ posts }: PostSummariesProps) {
  if (!posts) {
    return null;
  }

  return (
    <ol className={styles.PostSummaries}>
      {posts.map(({ MdxContent, data }) => {
        const { slug, path, title, excerpt } = data;
        return (
          <li key={slug} className={styles.PostSummary}>
            {title && (
              <h3 className={styles.postTitle}>
                <Link href={path}>{title}</Link>
              </h3>
            )}
            {excerpt ? (
              <p className={styles.postExcerpt}>{excerpt}</p>
            ) : (
              <div className={styles.postExcerpt}>
                <MdxContent />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default PostSummaries;
