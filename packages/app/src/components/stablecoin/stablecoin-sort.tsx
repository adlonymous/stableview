"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowDownUp, ArrowUpAZ, ArrowUpDown, DollarSign, Users } from "lucide-react";

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
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Default to descending for market cap and volume, ascending for name
      const defaultDirection = sortBy === 'name' ? 'asc' : 'desc';
      onSortChange({
        sortBy,
        direction: defaultDirection
      });
    }
  };

  const getSortIcon = (sortOption: SortOption) => {
    if (sort.sortBy !== sortOption) {
      switch (sortOption) {
        case 'name':
          return <ArrowUpDown className="h-4 w-4" />;
        case 'marketCap':
          return <DollarSign className="h-4 w-4" />;
        case 'uniqueAddresses':
          return <Users className="h-4 w-4" />;
        case 'transactionVolume':
          return <ArrowDownUp className="h-4 w-4" />;
      }
    }

    // Active sort
    if (sortOption === 'name') {
      return sort.direction === 'asc' 
        ? <ArrowUpAZ className="h-4 w-4" /> 
        : <ArrowDownAZ className="h-4 w-4" />;
    } else {
      return sort.direction === 'asc' 
        ? <ArrowUpDown className="h-4 w-4" /> 
        : <ArrowDownUp className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={sort.sortBy === 'name' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSortChange('name')}
        className="flex items-center gap-1"
      >
        Name
        {getSortIcon('name')}
      </Button>
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
        variant={sort.sortBy === 'uniqueAddresses' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSortChange('uniqueAddresses')}
        className="flex items-center gap-1"
      >
        Holders
        {getSortIcon('uniqueAddresses')}
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