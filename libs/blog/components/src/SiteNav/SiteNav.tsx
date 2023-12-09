import Link from 'next/link';

import styles from './SiteNav.module.css';

export function SiteNav() {
  return (
    <nav className={styles.SiteNav}>
      <div>
        <Link href="/posts">Posts</Link>
      </div>
      <div>
        <Link href="/projects">Projects</Link>
      </div>
    </nav>
  );
}

export default SiteNav;
