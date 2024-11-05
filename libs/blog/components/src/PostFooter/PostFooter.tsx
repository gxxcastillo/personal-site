import { ReactNode } from 'react';

import styles from './PostFooter.module.css';
import { Tags } from '../Tags/Tag';

export interface PostFooterProps {
  tags?: string[];
  children: ReactNode;
}

export function PostFooter({ tags, children }: PostFooterProps) {
  return (
    <footer className={styles.PostFooter}>
      {children}
      {tags && <Tags tags={tags} />}
    </footer>
  );
}

export default PostFooter;
