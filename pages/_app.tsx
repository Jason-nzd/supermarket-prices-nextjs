import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function App({ Component, pageProps }: AppProps) {
  const lightTheme = createTheme({
    type: 'light',
    theme: {
      // colors: {...}, // optional
    },
  });

  const darkTheme = createTheme({
    type: 'dark',
    theme: {
      // colors: {...}, // optional
    },
  });
  return (
    <>
      <Head>
        <title>KiwiPrice.xyz</title>
      </Head>
      <NextThemesProvider
        defaultTheme='system'
        attribute='class'
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <main>
            <Component {...pageProps} />
          </main>
        </NextUIProvider>
      </NextThemesProvider>
    </>
  );
}
