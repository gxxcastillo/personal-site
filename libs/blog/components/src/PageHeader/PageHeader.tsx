import { ReactNode } from 'react';

import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  children: ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className={styles.PageHeader}>
      <h3 className='title'>{children}</h3>
    </header>
  );
}

export default PageHeader;
