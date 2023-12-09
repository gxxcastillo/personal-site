import Link from 'next/link';
import { ReactNode } from 'react';

import styles from './SiteHeader.module.css';

export interface SiteHeaderProps {
  nav: ReactNode;
}

export function SiteHeader({ nav }: SiteHeaderProps) {
  return (
    <div className={styles.SiteHeader}>
      <h1 className={styles.home}>
        <Link href={'/'}>⌂</Link>
      </h1>
      <div className={styles.siteNav}>{nav}</div>
    </div>
  );
}

export default SiteHeader;
