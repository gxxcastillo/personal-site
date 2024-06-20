import { ReactNode } from 'react';

import styles from './PostFooter.module.css';

export interface PostFooterProps {
  tags?: string[];
  children: ReactNode;
}

export function PostFooter({ tags, children }: PostFooterProps) {
  return (
    <footer className={styles.PostFooter}>
      {children}
      {tags && (
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <div key={tag}>#{tag}</div>
          ))}
        </ul>
      )}
    </footer>
  );
}

export default PostFooter;
