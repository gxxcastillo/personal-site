import Link from 'next/link';

import styles from './PostSummaries.module.css';

export interface PostSummary {
  title?: string;
  path: string;
  slug: string;
  excerpt?: string;
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
      {posts.map(({ slug, path, title, excerpt }) => {
        return (
          <li key={slug} className={styles.post}>
            <div>
              {title && (
                <h5>
                  <Link href={path}>{title}</Link>
                </h5>
              )}
              <div>{excerpt}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default PostSummaries;
