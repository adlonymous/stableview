import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Stablecoin } from '@/types/stablecoin';
import { StablecoinFilter } from '@/components/stablecoin/stablecoin-filters';
import { SortOption, SortDirection } from '@/components/stablecoin/stablecoin-sort';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('en-US', options).format(value);
}

export function formatCurrency(value: number): string {
  // For values greater than or equal to 1 billion
  if (value >= 1000000000) {
    const billions = value / 1000000000;
    // Always show 2 decimal places for better precision
    return `$${billions.toFixed(2)}B`;
  }

  // For values greater than or equal to 1 million
  if (value >= 1000000) {
    const millions = value / 1000000;
    // Always show 2 decimal places for better precision
    return `$${millions.toFixed(2)}M`;
  }

  // For values greater than or equal to 1 thousand
  if (value >= 1000) {
    const thousands = value / 1000;
    // Show 1 decimal place for thousands
    return `$${thousands.toFixed(1)}K`;
  }

  // For values less than 1 thousand
  return formatNumber(value, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
}

export function formatCompactNumber(value: number): string {
  // For values greater than or equal to 1 billion
  if (value >= 1000000000) {
    const billions = value / 1000000000;
    // Always show 2 decimal places for better precision
    return `${billions.toFixed(2)}B`;
  }

  // For values greater than or equal to 1 million
  if (value >= 1000000) {
    const millions = value / 1000000;
    // Always show 2 decimal places for better precision
    return `${millions.toFixed(2)}M`;
  }

  // For values greater than or equal to 1 thousand
  if (value >= 1000) {
    const thousands = value / 1000;
    // Show 1 decimal place for thousands
    return `${thousands.toFixed(1)}K`;
  }

  // For values less than 1 thousand, show up to 2 decimal places
  return formatNumber(value, {
    notation: 'standard',
    maximumFractionDigits: 2,
  });
}

export function formatPercentage(value: number): string {
  return formatNumber(value, {
    style: 'percent',
    maximumFractionDigits: 2,
  });
}

export function filterStablecoins(
  stablecoins: Stablecoin[],
  filters: StablecoinFilter
): Stablecoin[] {
  return stablecoins.filter(stablecoin => {
    // Filter by token program
    if (
      filters.tokenProgram &&
      filters.tokenProgram.length > 0 &&
      !filters.tokenProgram.includes(stablecoin.tokenProgram)
    ) {
      return false;
    }

    // Filter by issuer
    if (
      filters.issuer &&
      filters.issuer.length > 0 &&
      !filters.issuer.includes(stablecoin.issuer)
    ) {
      return false;
    }

    // Filter by market cap (using total supply as proxy)
    if (filters.minMarketCap && parseFloat(stablecoin.totalSupply) < filters.minMarketCap) {
      return false;
    }

    // Filter by pegged asset
    if (
      filters.peggedAsset &&
      filters.peggedAsset.length > 0 &&
      !filters.peggedAsset.includes(stablecoin.peggedAsset)
    ) {
      return false;
    }

    return true;
  });
}

export function sortStablecoins(
  stablecoins: Stablecoin[],
  sortBy: SortOption,
  direction: SortDirection
): Stablecoin[] {
  return [...stablecoins].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'marketCap':
        comparison = parseFloat(a.totalSupply) - parseFloat(b.totalSupply);
        break;
      case 'uniqueAddresses':
        comparison = parseFloat(a.dailyActiveUsers) - parseFloat(b.dailyActiveUsers);
        break;
      case 'transactionVolume':
        comparison = parseFloat(a.transactionVolume30d) - parseFloat(b.transactionVolume30d);
        break;
      case 'dailyTransactions':
        comparison = parseFloat(a.transactionCountDaily) - parseFloat(b.transactionCountDaily);
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

export function getUniqueIssuers(stablecoins: Stablecoin[]): string[] {
  return Array.from(new Set(stablecoins.map(coin => coin.issuer)));
}

export function getUniquePeggedAssets(stablecoins: Stablecoin[]): string[] {
  return Array.from(new Set(stablecoins.map(coin => coin.peggedAsset)));
}
