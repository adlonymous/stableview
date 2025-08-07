import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@stableview/core'],
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    // Handle Node.js modules that are imported in browser code
    if (!isServer) {
      // Polyfill Node.js modules for browser
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          path: false,
          os: false,
          crypto: false,
          stream: false,
          net: false,
          tls: false,
          child_process: false,
          perf_hooks: false,
        },
        extensionAlias: {
          '.js': ['.js', '.ts', '.tsx'],
        },
      };
      
      // Set browser flag for client-side code
      config.plugins = [
        ...config.plugins || [],
        new (require('webpack').DefinePlugin)({
          'process.env.BROWSER': JSON.stringify('true'),
        }),
      ];
    }
    
    return config;
  },
  // Completely exclude postgres from client bundle
  experimental: {
    serverComponentsExternalPackages: ['postgres'],
  },
};

export default nextConfig;
