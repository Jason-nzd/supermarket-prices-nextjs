import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from '@next/font/google';
import Head from 'next/head';
import { createContext, useState } from 'react';

const manropeFont = Manrope({ subsets: ['latin'] });

type ThemeContextType = 'light' | 'dark';

export const ThemeContext = createContext<ThemeContextType>('light');

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<ThemeContextType>('light');

  return (
    <>
      <Head>
        <title>KiwiPrice.xyz</title>
      </Head>
      <ThemeContext.Provider value={theme}>
        <main className={manropeFont.className}>
          <Component {...pageProps} />
        </main>
      </ThemeContext.Provider>
    </>
  );
}
