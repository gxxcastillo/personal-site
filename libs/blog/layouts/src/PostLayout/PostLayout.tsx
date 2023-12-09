import { ReactNode } from 'react';

import styles from './PostLayout.module.css';

export interface PostLayoutProps {
  footer: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function PostLayout({ header, footer, children }: PostLayoutProps) {
  return (
    <div className={styles.PostLayout}>
      <div className={styles.postHeader}>{header}</div>
      <div className={styles.postMain}>{children}</div>
      <div className={styles.postFooter}>{footer}</div>
    </div>
  );
}

export default PostLayout;
