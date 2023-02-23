/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1hhwouzawkav1.cloudfront.net',
        port: '',
        pathname: '**',
      },
    ],
  },
};
