/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
