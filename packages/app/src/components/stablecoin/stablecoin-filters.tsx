'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export type StablecoinFilter = {
  tokenProgram?: string[];
  issuer?: string[];
  minMarketCap?: number;
  peggedAsset?: string[];
};

interface StablecoinFiltersProps {
  filters: StablecoinFilter;
  onFilterChange: (filters: StablecoinFilter) => void;
  peggedAssets: string[];
  issuers?: string[];
}

export function StablecoinFilters({
  filters,
  onFilterChange,
  peggedAssets,
}: StablecoinFiltersProps) {
  const handleTokenProgramChange = (program: string) => {
    const currentPrograms = filters.tokenProgram || [];
    const newPrograms = currentPrograms.includes(program)
      ? currentPrograms.filter(p => p !== program)
      : [...currentPrograms, program];
    
    onFilterChange({
      ...filters,
      tokenProgram: newPrograms.length > 0 ? newPrograms : undefined,
    });
  };

  const handleMarketCapChange = (minMarketCap: number | undefined) => {
    onFilterChange({
      ...filters,
      minMarketCap,
    });
  };

  const handlePeggedAssetChange = (peggedAsset: string) => {
    const currentAssets = filters.peggedAsset || [];
    const newAssets = currentAssets.includes(peggedAsset)
      ? currentAssets.filter(a => a !== peggedAsset)
      : [...currentAssets, peggedAsset];
    
    onFilterChange({
      ...filters,
      peggedAsset: newAssets.length > 0 ? newAssets : undefined,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs text-neutral-400 hover:text-white"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pegged Asset */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-400">Currency Peg</h4>
          <div className="flex flex-wrap gap-1.5">
            {peggedAssets.map(asset => (
              <Badge
                key={asset}
                variant={filters.peggedAsset?.includes(asset) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-neutral-800 text-xs px-2 py-1"
                onClick={() => handlePeggedAssetChange(asset)}
              >
                {asset}
              </Badge>
            ))}
          </div>
        </div>

        {/* Token Program */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-400">Token Program</h4>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={filters.tokenProgram?.includes('SPL Token') ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800 text-xs px-2 py-1"
              onClick={() => handleTokenProgramChange('SPL Token')}
            >
              SPL Token
            </Badge>
            <Badge
              variant={filters.tokenProgram?.includes('Token 2022') ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800 text-xs px-2 py-1"
              onClick={() => handleTokenProgramChange('Token 2022')}
            >
              Token 2022
            </Badge>
          </div>
        </div>

        {/* Market Cap */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-400">Market Cap</h4>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={filters.minMarketCap === 1000000000 ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800 text-xs px-2 py-1"
              onClick={() =>
                handleMarketCapChange(filters.minMarketCap === 1000000000 ? undefined : 1000000000)
              }
            >
              &gt; $1B
            </Badge>
            <Badge
              variant={filters.minMarketCap === 100000000 ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800 text-xs px-2 py-1"
              onClick={() =>
                handleMarketCapChange(filters.minMarketCap === 100000000 ? undefined : 100000000)
              }
            >
              &gt; $100M
            </Badge>
            <Badge
              variant={filters.minMarketCap === 10000000 ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800 text-xs px-2 py-1"
              onClick={() =>
                handleMarketCapChange(filters.minMarketCap === 10000000 ? undefined : 10000000)
              }
            >
              &gt; $10M
            </Badge>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Active:</span>
            <div className="flex flex-wrap gap-1.5">
              {filters.peggedAsset?.map(asset => (
                <Badge key={asset} className="bg-blue-600/20 text-blue-300 border-blue-500/30 flex items-center gap-1 text-xs px-2 py-1">
                  {asset}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-blue-100"
                    onClick={() => handlePeggedAssetChange(asset)}
                  />
                </Badge>
              ))}
              {filters.tokenProgram?.map(program => (
                <Badge key={program} className="bg-green-600/20 text-green-300 border-green-500/30 flex items-center gap-1 text-xs px-2 py-1">
                  {program}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-green-100"
                    onClick={() => handleTokenProgramChange(program)}
                  />
                </Badge>
              ))}
              {filters.minMarketCap && (
                <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 flex items-center gap-1 text-xs px-2 py-1">
                  {filters.minMarketCap === 1000000000
                    ? '> $1B'
                    : filters.minMarketCap === 100000000
                      ? '> $100M'
                      : '> $10M'}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-purple-100"
                    onClick={() => handleMarketCapChange(undefined)}
                  />
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
