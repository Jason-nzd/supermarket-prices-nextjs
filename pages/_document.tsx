import { Html, Head, Main, NextScript } from 'next/document';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png' />
      </Head>
      <body>
        <NavBar />
        <Main />
        <NextScript />
      </body>
      <Footer />
    </Html>
  );
}
