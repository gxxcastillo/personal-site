import { AppProps } from 'next/app';
import Head from 'next/head';

import { SiteHeader, SiteNav } from '@gxxc-blog/components';

import '@gxxc-blog/styles';

import styles from './_app.module.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Gabriel Castillo</title>
      </Head>
      <main>
        <div className={styles.siteHeader}>
          <SiteHeader nav={<SiteNav />}></SiteHeader>
        </div>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
