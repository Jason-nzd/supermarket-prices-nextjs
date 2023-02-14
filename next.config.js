/** @type {import('next').NextConfig} */
module.exports = {
  // exportPathMap: async function(
  //   defaultPathMap,
  //   { dev, dir, outDir, distDir, buildId }
  // ){
  //   return {

  //   }
  // },
  // assetPrefix: './',
  // trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
