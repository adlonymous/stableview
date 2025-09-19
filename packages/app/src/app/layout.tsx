import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'StableView - Solana Stablecoin Dashboard',
    template: '%s | StableView',
  },
  description:
    'A comprehensive dashboard for stablecoins on Solana with real-time data, analytics, and insights. Track USDC, USDT, PYUSD, FDUSD, and more.',
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
  authors: [{ name: 'StableView' }],
  creator: 'StableView',
  publisher: 'StableView',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://stableview.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'StableView - Solana Stablecoin Dashboard',
    description:
      'A comprehensive dashboard for stablecoins on Solana with real-time data, analytics, and insights.',
    siteName: 'StableView',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StableView - Solana Stablecoin Dashboard',
    description:
      'A comprehensive dashboard for stablecoins on Solana with real-time data, analytics, and insights.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased bg-neutral-950 text-neutral-50 min-h-screen flex flex-col`}
      >
        <div className="fixed inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 z-[-1]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950/0 to-neutral-950/0 z-[-1]" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
