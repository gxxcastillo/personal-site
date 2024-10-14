import { SiteHeader, SiteNav } from '@gxxc-blog/components';
import './global.css';

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
        <SiteHeader nav={<SiteNav />} />
        {children}
      </body>
    </html>
  );
}
