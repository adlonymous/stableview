'use client';

import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';

export type SortOption = 'name' | 'marketCap' | 'uniqueAddresses' | 'transactionVolume';
export type SortDirection = 'asc' | 'desc';

export type StablecoinSort = {
  sortBy: SortOption;
  direction: SortDirection;
};

interface StablecoinSortProps {
  sort: StablecoinSort;
  onSortChange: (sort: StablecoinSort) => void;
}

export function StablecoinSort({ sort, onSortChange }: StablecoinSortProps) {
  const handleSortChange = (sortBy: SortOption) => {
    if (sort.sortBy === sortBy) {
      // Toggle direction if same sort option
      onSortChange({
        sortBy,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Default to descending for market cap and volume
      onSortChange({
        sortBy,
        direction: 'desc',
      });
    }
  };

  const getSortIcon = (sortOption: SortOption) => {
    if (sort.sortBy !== sortOption) {
      return <ArrowDownUp className="h-4 w-4" />;
    }

    // Active sort
    return sort.direction === 'asc' ? (
      <ArrowDownUp className="h-4 w-4" />
    ) : (
      <ArrowDownUp className="h-4 w-4" />
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={sort.sortBy === 'marketCap' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSortChange('marketCap')}
        className="flex items-center gap-1"
      >
        Market Cap
        {getSortIcon('marketCap')}
      </Button>
      <Button
        variant={sort.sortBy === 'transactionVolume' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSortChange('transactionVolume')}
        className="flex items-center gap-1"
      >
        Volume
        {getSortIcon('transactionVolume')}
      </Button>
    </div>
  );
}
