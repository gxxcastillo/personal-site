import { SiteHeader, SiteNav } from '@gxxc-blog/components';
import './global.css';

import styles from './layout.module.css';

export const metadata = {
  title: 'Welcome to blog',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.SiteHeader}>
          <SiteHeader nav={<SiteNav />} />
        </div>
        {children}
      </body>
    </html>
  );
}
