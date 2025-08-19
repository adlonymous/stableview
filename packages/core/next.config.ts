import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable static optimization since this is an API-only package
  output: 'standalone',
  
  // Only build API routes
  experimental: {
    appDir: true,
  },
};

export default nextConfig; 