import { ReactNode } from 'react';

import styles from './PageLayout.module.css';

export interface PageLayoutProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function PageLayout({ header, footer, children }: PageLayoutProps) {
  return (
    <div className={styles.PageLayout}>
      <div className={styles.pageHeader}>{header}</div>
      <div>{children}</div>
      <div>{footer}</div>
    </div>
  );
}

export default PageLayout;
