import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  images: { loader: 'custom', loaderFile: './src/lib/image-loader.ts', deviceSizes: [480,768,1024,1536], imageSizes: [480] },
};
export default config;
