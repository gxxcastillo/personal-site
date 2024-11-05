import { ReactNode } from 'react';

import styles from './ContentLayout.module.css';

export interface ContentLayoutProps {
  footer: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function ContentLayout({ header, footer, children }: ContentLayoutProps) {
  return (
    <div className={styles.SiteLayout}>
      <div className={styles.siteHeader}>{header}</div>
      <div className={styles.main}>{children}</div>
      <div className={styles.siteFooter}>{footer}</div>
    </div>
  );
}

export default ContentLayout;
