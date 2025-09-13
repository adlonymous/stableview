import { StablecoinCard } from '@/components/stablecoin/stablecoin-card';
import { StatsOverview } from '@/components/stablecoin/stats-overview';
import { WorldMap } from '@/components/ui/world-map';
import { fetchStablecoinsWithFallback, fetchDashboardStatsWithFallback } from '@/lib/api';
import { formatCompactNumber } from '@/lib/utils';

export default async function Home() {
  const [stablecoins, dashboardStats] = await Promise.all([
    fetchStablecoinsWithFallback(),
    fetchDashboardStatsWithFallback(),
  ]);

  // Sort stablecoins by market cap (totalSupply) in descending order
  const sortedByMarketCap = stablecoins.sort((a, b) => {
    const marketCapA = parseFloat(a.totalSupply || '0');
    const marketCapB = parseFloat(b.totalSupply || '0');
    return marketCapB - marketCapA; // Descending order (highest first)
  });

  // Get the 3rd, 4th, and 5th highest market cap stablecoins
  const popularStablecoins = sortedByMarketCap.slice(2, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 max-w-7xl">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 border border-blue-500/20 p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative text-center space-y-4">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Solana Stablecoin Dashboard
            </h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Track, analyze, and monitor stablecoins on the Solana blockchain with real-time data and insights
            </p>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{dashboardStats.stablecoinCount}</div>
                <div className="text-sm text-neutral-400">Active Stablecoins</div>
              </div>
              <div className="w-px h-12 bg-neutral-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">${formatCompactNumber(dashboardStats.totalMarketCap)}</div>
                <div className="text-sm text-neutral-400">Total Market Cap</div>
              </div>
              <div className="w-px h-12 bg-neutral-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">${formatCompactNumber(dashboardStats.totalTransactionVolume.monthly)}</div>
                <div className="text-sm text-neutral-400">Monthly Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Market Overview</h2>
            <p className="text-neutral-400">Key metrics and performance indicators</p>
          </div>
          <StatsOverview
            totalMarketCap={dashboardStats.totalMarketCap}
            totalTransactionVolume={dashboardStats.totalTransactionVolume}
            stablecoinCount={dashboardStats.stablecoinCount}
          />
        </div>

        {/* Enhanced World Map Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Global Distribution</h2>
            <p className="text-neutral-400">Stablecoin adoption across different regions</p>
          </div>
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-8">
            <WorldMap />
          </div>
        </div>

        {/* Enhanced Trending Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Trending Stablecoins</h2>
              <p className="text-neutral-400">Top performing stablecoins by market cap</p>
            </div>
            <a 
              href="/stablecoins" 
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              View all stablecoins
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularStablecoins.map(stablecoin => (
              <StablecoinCard key={stablecoin.id} stablecoin={stablecoin} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
