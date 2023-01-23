/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'supermarketpricewatch.blob.core.windows.net',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'd1hhwouzawkav1.cloudfront.net',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
