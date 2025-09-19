'use client';

import { useState, useEffect } from 'react';
import { StablecoinCardWithPrice } from '@/components/stablecoin/stablecoin-card-with-price';
import { StablecoinFilters, StablecoinFilter } from '@/components/stablecoin/stablecoin-filters';
import {
  StablecoinSort,
  StablecoinSort as StablecoinSortType,
} from '@/components/stablecoin/stablecoin-sort';
import { filterStablecoins, getUniquePeggedAssets, sortStablecoins } from '@/lib/utils';
import { fetchStablecoinsWithFallback } from '@/lib/api';
import { Stablecoin } from '@/types/stablecoin';
import { useAllPrices } from '@/hooks/usePriceData';
import { usePegPrices } from '@/hooks/usePegPrices';

export function StablecoinsClient() {
  const [stablecoins, setStablecoins] = useState<Stablecoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StablecoinFilter>({});
  const [sort, setSort] = useState<StablecoinSortType>({
    sortBy: 'marketCap',
    direction: 'desc',
  });

  // Fetch all prices at once for better performance
  const { prices: allPrices, loading: pricesLoading } = useAllPrices();

  // Fetch all peg prices at once for better performance
  const { pegPrices: allPegPrices } = usePegPrices();

  useEffect(() => {
    const loadStablecoins = async () => {
      try {
        setLoading(true);
        const data = await fetchStablecoinsWithFallback();
        setStablecoins(data);
      } catch (err) {
        setError('Failed to load stablecoins');
        console.error('Error loading stablecoins:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStablecoins();
  }, []);

  const filteredStablecoins = filterStablecoins(stablecoins || [], filters);
  const sortedStablecoins = sortStablecoins(filteredStablecoins, sort.sortBy, sort.direction);
  const uniquePeggedAssets = getUniquePeggedAssets(stablecoins || []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">All Stablecoins</h1>
            <p className="text-neutral-400">Loading stablecoins...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-neutral-700 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
                      <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-neutral-700 rounded w-16"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-neutral-700 rounded w-full"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-3 bg-neutral-700 rounded"></div>
                      <div className="h-3 bg-neutral-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-9 bg-neutral-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">All Stablecoins</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-3">All Stablecoins</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Explore and compare all stablecoins on the Solana blockchain. Filter by currency peg,
            sort by market cap, and discover the latest stablecoin projects.
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <StablecoinFilters
              peggedAssets={uniquePeggedAssets}
              filters={filters}
              onFilterChange={setFilters}
            />
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-400">Sort by:</span>
              <StablecoinSort sort={sort} onSortChange={setSort} />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-neutral-400">
            Showing {sortedStablecoins.length} of {stablecoins.length} stablecoins
          </p>
          {filters.peggedAsset && filters.peggedAsset.length > 0 && (
            <p className="text-sm text-blue-400">Filtered by: {filters.peggedAsset.join(', ')}</p>
          )}
        </div>

        {/* Stablecoins Grid */}
        {sortedStablecoins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStablecoins.map(stablecoin => {
              // Find the price data for this stablecoin
              const priceData = allPrices.find(p => p.stablecoinId === stablecoin.id);
              // Find the peg price data for this stablecoin
              const pegPriceData = allPegPrices.find(p => p.stablecoinId === stablecoin.id);
              return (
                <StablecoinCardWithPrice
                  key={stablecoin.id}
                  stablecoin={stablecoin}
                  priceData={priceData}
                  priceLoading={pricesLoading}
                  pegPriceData={pegPriceData}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-500 text-lg mb-2">No stablecoins found</div>
            <p className="text-neutral-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
