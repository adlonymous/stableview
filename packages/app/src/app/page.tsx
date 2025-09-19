import { Suspense } from 'react';
import { StablecoinCard } from '@/components/stablecoin/stablecoin-card';
import { WorldMap } from '@/components/ui/world-map';
import { fetchStablecoinsWithFallback, fetchDashboardStatsWithFallback } from '@/lib/api';
import { generateDashboardMetadata, generateWebsiteStructuredData } from '@/lib/metadata';
import { formatCompactNumber } from '@/lib/utils';
import type { Metadata } from 'next';
import { AggregatedCharts } from '@/components/charts/aggregated-charts';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const metadata: Metadata = generateDashboardMetadata();


// Loading skeleton for stablecoin cards
function StablecoinCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  // Fetch data with better error handling
  let stablecoins = [];
  let dashboardStats = { stablecoinCount: 0, totalMarketCap: 0, totalTransactionVolume: { daily: 0, monthly: 0, yearly: 0 } };
  
  try {
    [stablecoins, dashboardStats] = await Promise.all([
      fetchStablecoinsWithFallback(),
      fetchDashboardStatsWithFallback(),
    ]);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Continue with empty data rather than crashing
  }

  const structuredData = generateWebsiteStructuredData();

  // Sort stablecoins by market cap (totalSupply) in descending order
  const sortedByMarketCap = stablecoins.sort((a, b) => {
    const marketCapA = parseFloat(a.totalSupply || '0');
    const marketCapB = parseFloat(b.totalSupply || '0');
    return marketCapB - marketCapA; // Descending order (highest first)
  });

  // Get the 3rd, 4th, and 5th highest market cap stablecoins
  const popularStablecoins = sortedByMarketCap.slice(2, 5);

  // Calculate additional metrics from stablecoins data
  const totalDailyActiveUsers = stablecoins.reduce((sum, coin) => sum + parseFloat(coin.dailyActiveUsers || '0'), 0);
  const totalDailyTransactions = stablecoins.reduce((sum, coin) => sum + parseFloat(coin.transactionCountDaily || '0'), 0);
  const currenciesSupported = new Set(stablecoins.map(coin => coin.peggedAsset)).size;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 max-w-7xl">
          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 border border-blue-500/20 p-6 sm:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
            <div className="relative text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Solana Stablecoin Dashboard
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
                Track, analyze, and monitor stablecoins on the Solana blockchain with real-time data
                and insights
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {dashboardStats.stablecoinCount}
                  </div>
                  <div className="text-sm text-neutral-400">Active Stablecoins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400">
                    ${formatCompactNumber(dashboardStats.totalMarketCap)}
                  </div>
                  <div className="text-sm text-neutral-400">Total Market Cap</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                    ${formatCompactNumber(dashboardStats.totalTransactionVolume.monthly)}
                  </div>
                  <div className="text-sm text-neutral-400">Monthly Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-400">
                    ${formatCompactNumber(dashboardStats.totalTransactionVolume.daily)}
                  </div>
                  <div className="text-sm text-neutral-400">Daily Volume</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                    {formatCompactNumber(totalDailyActiveUsers)}
                  </div>
                  <div className="text-sm text-neutral-400">Daily Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-pink-400">
                    {formatCompactNumber(totalDailyTransactions)}
                  </div>
                  <div className="text-sm text-neutral-400">Daily Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-400">
                    {currenciesSupported}
                  </div>
                  <div className="text-sm text-neutral-400">Currencies Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-400">
                    {dashboardStats.yearOverYearGrowth.toFixed(1)}%
                  </div>
                  <div className="text-sm text-neutral-400">YoY Growth</div>
                </div>
              </div>
            </div>
          </div>


          {/* Enhanced World Map Section - Lazy Loaded */}
          <ErrorBoundary fallback={<div className="text-red-400 text-center">Failed to load world map</div>}>
            <Suspense fallback={
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Global Distribution</h2>
                  <p className="text-neutral-400">Loading stablecoin adoption data...</p>
                </div>
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-8">
                  <Skeleton className="h-96 w-full" />
                </div>
              </div>
            }>
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Global Distribution</h2>
                  <p className="text-neutral-400">Stablecoin adoption across different regions</p>
                </div>
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-4 sm:p-8">
                  <WorldMap />
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>

          {/* Aggregated Charts */}
          <ErrorBoundary fallback={<div className="text-red-400 text-center">Failed to load charts</div>}>
            <Suspense fallback={
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Market Analytics</h2>
                  <p className="text-neutral-400">Loading aggregated metrics...</p>
                </div>
                <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
                  <Skeleton className="h-96 w-full" />
                </div>
              </div>
            }>
              <AggregatedCharts />
            </Suspense>
          </ErrorBoundary>

          {/* Enhanced Trending Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending Stablecoins</h2>
                <p className="text-neutral-400">Top performing stablecoins by market cap</p>
              </div>
              <a
                href="/stablecoins"
                className="group inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
              >
                View all stablecoins
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            <Suspense fallback={<StablecoinCardsSkeleton />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {popularStablecoins.map(stablecoin => (
                  <StablecoinCard key={stablecoin.id} stablecoin={stablecoin} />
                ))}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
