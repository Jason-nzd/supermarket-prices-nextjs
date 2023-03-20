import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import { CssBaseline } from '@nextui-org/react';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles]),
    };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          {CssBaseline.flush()}
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png' />
        </Head>
        <body>
          <NavBar />
          <Main />
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
