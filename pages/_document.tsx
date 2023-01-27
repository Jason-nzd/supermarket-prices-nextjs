import { Html, Head, Main, NextScript } from 'next/document';
import NavBar from '../components/NavBar';

export default function Document() {
  return (
    <Html lang='en' className=''>
      <Head />
      <body>
        <NavBar />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
