import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import Head from 'next/head';
import { createContext, useState } from 'react';

const manropeFont = Manrope({ subsets: ['latin'] });

type DarkModeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <>
      <Head>
        <title>KiwiPrice.xyz</title>
      </Head>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <main className={manropeFont.className}>
          <Component {...pageProps} />
        </main>
      </DarkModeContext.Provider>
    </>
  );
}
