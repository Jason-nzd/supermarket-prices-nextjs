import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from '@next/font/google';
import Head from 'next/head';

const manropeFont = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KiwiPrice.xyz</title>
      </Head>
      <main className={manropeFont.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
