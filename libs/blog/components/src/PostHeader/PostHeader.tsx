import { ReactNode } from 'react';

import styles from './PostHeader.module.css';

export interface PostHeaderProps {
  postID: string;
  children: ReactNode;
}

export function PostHeader({ postID, children }: PostHeaderProps) {
  return (
    <header className={styles.PostHeader}>
      <h3 className="title">{children}</h3>
    </header>
  );
}

export default PostHeader;
