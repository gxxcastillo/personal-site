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
        const { slug, path, title } = data;
        return (
          <li key={slug} className={styles.post}>
            <div>
              {title && (
                <h3>
                  <Link href={path}>{title}</Link>
                </h3>
              )}
              <div>
                <MdxContent />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default PostSummaries;
