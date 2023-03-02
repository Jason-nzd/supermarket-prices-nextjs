import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from '@next/font/google';

const manropeFont = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={manropeFont.className}>
      <Component {...pageProps} />
    </main>
  );
}
