import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/blog-ssg-nextjs',
  assetPrefix: '/blog-ssg-nextjs/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
