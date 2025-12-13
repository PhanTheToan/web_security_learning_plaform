import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-0a371eaab58e4c38876f01ff32a8fb2f.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'hackmd.io',
      },
      {
        protocol: 'https',
        hostname: 'tse3.mm.bing.net',
      }
    ],
  },
};

export default nextConfig;