import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Stablecoin } from "@/types/stablecoin";
import { StablecoinFilter } from "@/components/stablecoin/stablecoin-filters";
import { SortOption, SortDirection } from "@/components/stablecoin/stablecoin-sort";

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
    return `$${billions.toFixed(Math.min(2, billions % 1 === 0 ? 0 : 1))}B`;
  }
  
  // For values greater than or equal to 1 million
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `$${millions.toFixed(Math.min(2, millions % 1 === 0 ? 0 : 1))}M`;
  }
  
  // For values greater than or equal to 1 thousand
  if (value >= 1000) {
    const thousands = value / 1000;
    return `$${thousands.toFixed(Math.min(1, thousands % 1 === 0 ? 0 : 1))}K`;
  }
  
  // For values less than 1 thousand
  return formatNumber(value, { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

export function formatCompactNumber(value: number): string {
  // For values greater than or equal to 1 billion
  if (value >= 1000000000) {
    const billions = value / 1000000000;
    return `${billions.toFixed(Math.min(2, billions % 1 === 0 ? 0 : 1))}B`;
  }
  
  // For values greater than or equal to 1 million
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions.toFixed(Math.min(2, millions % 1 === 0 ? 0 : 1))}M`;
  }
  
  // For values greater than or equal to 1 thousand
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${thousands.toFixed(Math.min(1, thousands % 1 === 0 ? 0 : 1))}K`;
  }
  
  // For values less than 1 thousand
  return formatNumber(value, { 
    notation: 'standard',
    maximumFractionDigits: 0
  });
}

export function formatPercentage(value: number): string {
  return formatNumber(value, { 
    style: 'percent',
    maximumFractionDigits: 2
  });
}

export function filterStablecoins(stablecoins: Stablecoin[], filters: StablecoinFilter): Stablecoin[] {
  return stablecoins.filter((stablecoin) => {
    // Filter by token program
    if (filters.tokenProgram && stablecoin.tokenProgram !== filters.tokenProgram) {
      return false;
    }

    // Filter by issuer
    if (filters.issuer && stablecoin.issuer !== filters.issuer) {
      return false;
    }

    // Filter by network
    if (filters.networksLiveOn && !stablecoin.networksLiveOn.includes(filters.networksLiveOn)) {
      return false;
    }

    // Filter by market cap
    if (filters.minMarketCap && stablecoin.marketCap < filters.minMarketCap) {
      return false;
    }
    
    // Filter by pegged asset
    if (filters.peggedAsset && stablecoin.peggedAsset !== filters.peggedAsset) {
      return false;
    }

    return true;
  });
}

export function sortStablecoins(stablecoins: Stablecoin[], sortBy: SortOption, direction: SortDirection): Stablecoin[] {
  return [...stablecoins].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'marketCap':
        comparison = a.marketCap - b.marketCap;
        break;
      case 'uniqueAddresses':
        comparison = a.uniqueAddresses - b.uniqueAddresses;
        break;
      case 'transactionVolume':
        comparison = a.transactionVolume.daily - b.transactionVolume.daily;
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

export function getUniqueIssuers(stablecoins: Stablecoin[]): string[] {
  return Array.from(new Set(stablecoins.map(coin => coin.issuer)));
}

export function getUniqueNetworks(stablecoins: Stablecoin[]): string[] {
  const allNetworks = stablecoins.flatMap(coin => coin.networksLiveOn);
  return Array.from(new Set(allNetworks));
}

export function getUniquePeggedAssets(stablecoins: Stablecoin[]): string[] {
  return Array.from(new Set(stablecoins.map(coin => coin.peggedAsset)));
}
