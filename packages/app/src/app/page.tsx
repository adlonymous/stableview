import { StablecoinCard } from '@/components/stablecoin/stablecoin-card';
import { StatsOverview } from '@/components/stablecoin/stats-overview';
import { fetchStablecoinsWithFallback, fetchDashboardStatsWithFallback } from '@/lib/api';

export default async function Home() {
  const [stablecoins, dashboardStats] = await Promise.all([
    fetchStablecoinsWithFallback(),
    fetchDashboardStatsWithFallback(),
  ]);

  const popularStablecoins = stablecoins.slice(0, 3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Solana Stablecoin Dashboard</h1>
        <p className="text-neutral-400">Track and analyze stablecoins on the Solana blockchain</p>
      </div>

      <StatsOverview
        totalMarketCap={dashboardStats.totalMarketCap}
        totalUniqueUsers={parseInt(dashboardStats.totalDailyActiveUsers)}
        totalTransactionVolume={dashboardStats.totalTransactionVolume}
        stablecoinCount={dashboardStats.stablecoinCount}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Popular Stablecoins</h2>
          <a href="/stablecoins" className="text-sm text-blue-400 hover:underline">
            View all stablecoins →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularStablecoins.map(stablecoin => (
            <StablecoinCard key={stablecoin.id} stablecoin={stablecoin} />
          ))}
        </div>
      </div>
    </div>
  );
}
