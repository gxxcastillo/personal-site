import { ReactNode } from 'react';

import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  children: ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className={styles.PageHeader}>
      <h2 className={styles.title}>{children}</h2>
    </header>
  );
}

export default PageHeader;
