import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  
  return {
    name: 'StableView - Solana Stablecoin Dashboard',
    short_name: 'StableView',
    description: 'A comprehensive dashboard for stablecoins on Solana with real-time data, analytics, and insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['finance', 'productivity', 'utilities'],
    lang: 'en',
    orientation: 'portrait-primary',
  };
}
