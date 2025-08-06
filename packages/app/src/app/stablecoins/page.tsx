'use client';

import { useState } from 'react';
import { StablecoinCard } from '@/components/stablecoin/stablecoin-card';
import { mockStablecoins } from '@/lib/mock-data';
import { StablecoinFilters, StablecoinFilter } from '@/components/stablecoin/stablecoin-filters';
import {
  StablecoinSort,
  StablecoinSort as StablecoinSortType,
} from '@/components/stablecoin/stablecoin-sort';
import {
  filterStablecoins,
  getUniqueIssuers,
  getUniqueNetworks,
  getUniquePeggedAssets,
  sortStablecoins,
} from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function StablecoinsPage() {
  const [filters, setFilters] = useState<StablecoinFilter>({});
  const [sort, setSort] = useState<StablecoinSortType>({
    sortBy: 'marketCap',
    direction: 'desc',
  });

  // Get unique values for filter options
  const issuers = getUniqueIssuers(mockStablecoins);
  const networks = getUniqueNetworks(mockStablecoins);
  const peggedAssets = getUniquePeggedAssets(mockStablecoins);

  // Apply filters and sorting
  const filteredStablecoins = filterStablecoins(mockStablecoins, filters);
  const sortedStablecoins = sortStablecoins(filteredStablecoins, sort.sortBy, sort.direction);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">All Stablecoins</h1>
        <p className="text-neutral-400">
          Comprehensive list of stablecoins on the Solana blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 sticky top-24">
            <StablecoinFilters
              filters={filters}
              onFilterChange={setFilters}
              issuers={issuers}
              networks={networks}
              peggedAssets={peggedAssets}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-neutral-400">
              {filteredStablecoins.length} stablecoins found
            </div>
            <StablecoinSort sort={sort} onSortChange={setSort} />
          </div>

          <Separator className="bg-neutral-800" />

          {filteredStablecoins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedStablecoins.map(stablecoin => (
                <StablecoinCard key={stablecoin.id} stablecoin={stablecoin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-400">No stablecoins match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
