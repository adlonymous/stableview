'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export type StablecoinFilter = {
  tokenProgram?: string;
  issuer?: string;
  minMarketCap?: number;
  peggedAsset?: string;
};

interface StablecoinFiltersProps {
  filters: StablecoinFilter;
  onFilterChange: (filters: StablecoinFilter) => void;
  issuers: string[];
  peggedAssets: string[];
}

export function StablecoinFilters({
  filters,
  onFilterChange,
  issuers,
  peggedAssets,
}: StablecoinFiltersProps) {
  const handleTokenProgramChange = (program: string | undefined) => {
    onFilterChange({
      ...filters,
      tokenProgram: filters.tokenProgram === program ? undefined : program,
    });
  };

  const handleIssuerChange = (issuer: string) => {
    onFilterChange({
      ...filters,
      issuer: filters.issuer === issuer ? undefined : issuer,
    });
  };

  const handleMarketCapChange = (minMarketCap: number | undefined) => {
    onFilterChange({
      ...filters,
      minMarketCap,
    });
  };

  const handlePeggedAssetChange = (peggedAsset: string) => {
    onFilterChange({
      ...filters,
      peggedAsset: filters.peggedAsset === peggedAsset ? undefined : peggedAsset,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 text-xs text-neutral-400 hover:text-white"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-400">Pegged Asset</h4>
          <div className="flex flex-wrap gap-2">
            {peggedAssets.map(asset => (
              <Badge
                key={asset}
                variant={filters.peggedAsset === asset ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-neutral-800"
                onClick={() => handlePeggedAssetChange(asset)}
              >
                {asset}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-400">Token Program</h4>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.tokenProgram === 'SPL Token' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800"
              onClick={() => handleTokenProgramChange('SPL Token')}
            >
              SPL Token
            </Badge>
            <Badge
              variant={filters.tokenProgram === 'Token 2022' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800"
              onClick={() => handleTokenProgramChange('Token 2022')}
            >
              Token 2022
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-400">Issuer</h4>
          <div className="flex flex-wrap gap-2">
            {issuers.map(issuer => (
              <Badge
                key={issuer}
                variant={filters.issuer === issuer ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-neutral-800"
                onClick={() => handleIssuerChange(issuer)}
              >
                {issuer}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-neutral-400">Market Cap</h4>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.minMarketCap === 1000000000 ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800"
              onClick={() =>
                handleMarketCapChange(filters.minMarketCap === 1000000000 ? undefined : 1000000000)
              }
            >
              &gt; $1B
            </Badge>
            <Badge
              variant={filters.minMarketCap === 100000000 ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800"
              onClick={() =>
                handleMarketCapChange(filters.minMarketCap === 100000000 ? undefined : 100000000)
              }
            >
              &gt; $100M
            </Badge>
            <Badge
              variant={filters.minMarketCap === 10000000 ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-800"
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
        <div className="pt-2">
          <h4 className="text-xs font-medium text-neutral-400 mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.peggedAsset && (
              <Badge className="bg-neutral-800 text-white flex items-center gap-1">
                {filters.peggedAsset}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handlePeggedAssetChange(filters.peggedAsset as string)}
                />
              </Badge>
            )}
            {filters.tokenProgram && (
              <Badge className="bg-neutral-800 text-white flex items-center gap-1">
                {filters.tokenProgram}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    handleTokenProgramChange(filters.tokenProgram as string)
                  }
                />
              </Badge>
            )}
            {filters.issuer && (
              <Badge className="bg-neutral-800 text-white flex items-center gap-1">
                {filters.issuer}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleIssuerChange(filters.issuer as string)}
                />
              </Badge>
            )}
            {filters.minMarketCap && (
              <Badge className="bg-neutral-800 text-white flex items-center gap-1">
                {filters.minMarketCap === 1000000000
                  ? '> $1B'
                  : filters.minMarketCap === 100000000
                    ? '> $100M'
                    : '> $10M'}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleMarketCapChange(undefined)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
