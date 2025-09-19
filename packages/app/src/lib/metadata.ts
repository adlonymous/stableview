import { Metadata } from 'next';
import { Stablecoin } from '@/types/stablecoin';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://stableview.vercel.app';
const siteName = 'StableView';
const siteDescription =
  'A comprehensive dashboard for Solana stablecoins with real-time data, analytics, and insights.';

export function generateStablecoinMetadata(stablecoin: Stablecoin): Metadata {
  const title = `${stablecoin.name} (${stablecoin.token}) - ${siteName}`;
  const description = `Track ${stablecoin.name} (${stablecoin.token}) on Solana. Real-time price, supply data, transaction volume, and analytics. ${stablecoin.executiveSummary || `A ${stablecoin.peggedAsset}-pegged stablecoin on Solana.`}`;

  const imageUrl = `${baseUrl}/api/og/stablecoin?slug=${stablecoin.slug}&name=${encodeURIComponent(stablecoin.name)}&token=${stablecoin.token}&supply=${stablecoin.totalSupply}&volume=${stablecoin.transactionVolume30d}`;

  return {
    title,
    description,
    keywords: [
      stablecoin.name,
      stablecoin.token,
      'Solana',
      'stablecoin',
      'cryptocurrency',
      'DeFi',
      'blockchain',
      stablecoin.peggedAsset,
      'price',
      'analytics',
      'dashboard',
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/stablecoin/${stablecoin.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `/stablecoin/${stablecoin.slug}`,
      title,
      description,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${stablecoin.name} (${stablecoin.token}) - Solana Stablecoin Analytics`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@stableview',
      site: '@stableview',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateDashboardMetadata(): Metadata {
  const title = `${siteName} - Solana Stablecoin Dashboard`;
  const description = `${siteDescription} Track real-time prices, supply data, transaction volumes, and analytics for all major stablecoins on Solana.`;

  const imageUrl = `${baseUrl}/api/og/dashboard`;

  return {
    title,
    description,
    keywords: [
      'Solana',
      'stablecoin',
      'dashboard',
      'cryptocurrency',
      'DeFi',
      'blockchain',
      'analytics',
      'USDC',
      'USDT',
      'PYUSD',
      'FDUSD',
      'price tracking',
      'market data',
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/',
      title,
      description,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'StableView - Solana Stablecoin Dashboard',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@stableview',
      site: '@stableview',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateStablecoinsListMetadata(): Metadata {
  const title = `All Stablecoins - ${siteName}`;
  const description = `Browse and compare all stablecoins on Solana. Real-time data, analytics, and insights for USDC, USDT, PYUSD, FDUSD, and more.`;

  const imageUrl = `${baseUrl}/api/og/stablecoins`;

  return {
    title,
    description,
    keywords: [
      'Solana',
      'stablecoin',
      'list',
      'cryptocurrency',
      'DeFi',
      'blockchain',
      'analytics',
      'USDC',
      'USDT',
      'PYUSD',
      'FDUSD',
      'comparison',
      'market data',
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/stablecoins',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/stablecoins',
      title,
      description,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'All Solana Stablecoins - StableView',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@stableview',
      site: '@stableview',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateStablecoinStructuredData(stablecoin: Stablecoin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: stablecoin.name,
    alternateName: stablecoin.token,
    description:
      stablecoin.executiveSummary || `A ${stablecoin.peggedAsset}-pegged stablecoin on Solana`,
    category: 'Cryptocurrency',
    provider: {
      '@type': 'Organization',
      name: stablecoin.issuer,
    },
    currency: stablecoin.peggedAsset,
    assetType: 'Stablecoin',
    blockchain: 'Solana',
    tokenAddress: stablecoin.tokenAddress,
    totalSupply: stablecoin.totalSupply,
    price: stablecoin.price,
    marketCap: parseFloat(stablecoin.price) * parseFloat(stablecoin.totalSupply),
    dailyActiveUsers: stablecoin.dailyActiveUsers,
    transactionVolume30d: stablecoin.transactionVolume30d,
    url: `${baseUrl}/stablecoin/${stablecoin.slug}`,
    image: stablecoin.logoUrl,
    sameAs: [stablecoin.solscanLink, stablecoin.artemisLink].filter(Boolean),
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description: siteDescription,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/stablecoins?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
  };
}
