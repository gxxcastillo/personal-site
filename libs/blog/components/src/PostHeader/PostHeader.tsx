import { ReactNode } from 'react';

import styles from './PostHeader.module.css';

export interface PostHeaderProps {
  postID: string;
  subTitle?: string;
  children: ReactNode;
}

export function PostHeader({ postID, subTitle, children }: PostHeaderProps) {
  return (
    <header className={styles.PostHeader}>
      <h2 className={styles.title}>{children}</h2>
      {subTitle && (
        <p className={styles.subTitle} role="doc-subtitle">
          {subTitle}
        </p>
      )}
    </header>
  );
}

export default PostHeader;
