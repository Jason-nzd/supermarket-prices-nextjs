/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const moduleExports = {
  output: 'standalone',
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
    ],
  },
};

module.exports = withBundleAnalyzer(moduleExports);
