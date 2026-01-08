import { SiteFooter, SiteHeader, SiteNav } from '@gxxc-blog/components';
import './global.css';

import styles from './layout.module.css';

export const metadata = {
  title: process.env.BLOG_TITLE,
  description: process.env.BLOG_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.Layout}>
          <div className={styles.siteHeader}>
            <SiteHeader nav={<SiteNav />} />
          </div>
          <div className={styles.siteContent}>{children}</div>
          <div className={styles.siteFooter}>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
