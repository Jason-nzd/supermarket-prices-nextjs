/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};
