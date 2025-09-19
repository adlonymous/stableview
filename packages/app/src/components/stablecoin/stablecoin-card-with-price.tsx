'use client';

import { Stablecoin } from '@/types/stablecoin';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCompactNumber } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PriceData {
  stablecoinId: number;
  tokenAddress: string;
  name: string;
  token: string;
  price: number | null;
  priceChange24h: number | null;
  lastUpdated: string | null;
  updateUnixTime: number | null;
}

interface PegPriceData {
  stablecoinId: number;
  peggedAsset: string;
  name: string;
  pegPrice: number;
  lastUpdated: string;
  updateUnixTime: number;
}

interface StablecoinCardWithPriceProps {
  stablecoin: Stablecoin;
  priceData?: PriceData | null;
  priceLoading?: boolean;
  pegPriceData?: PegPriceData | null;
}

export function StablecoinCardWithPrice({ 
  stablecoin, 
  priceData, 
  priceLoading = false,
  pegPriceData
}: StablecoinCardWithPriceProps) {
  // Use real-time price if available, otherwise fall back to static price
  const staticPrice = (stablecoin.price === 'N/A' || stablecoin.price === '-1') ? null : parseFloat(stablecoin.price || '1.00');
  const displayPrice = priceData?.price ?? staticPrice;
  const priceChange24h = priceData?.priceChange24h ?? 0;
  const isPriceLoading = priceLoading;

  const formatPrice = (price: number | string | null) => {
    if (price === null || price === -1 || price === '-1') return 'N/A';
    return `$${price}`;
  };

  const formatPriceChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-neutral-400';
  };

  return (
    <Card className="overflow-hidden border-neutral-800 bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
      <CardHeader className="pb-1 px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden">
            {stablecoin.logoUrl ? (
              <Image
                src={stablecoin.logoUrl}
                alt={`${stablecoin.token} logo`}
                width={40}
                height={40}
                className="rounded-full"
                onError={(e) => {
                  // Fallback to token symbol if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.textContent = stablecoin.token.charAt(0);
                  }
                }}
              />
            ) : (
              <span className="text-sm font-bold text-neutral-300">
                {stablecoin.token.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-white">
              {stablecoin.name}
            </CardTitle>
            <CardDescription className="text-sm text-neutral-400">
              {stablecoin.token}
            </CardDescription>
          </div>
          <div className="ml-auto text-right">
            {isPriceLoading ? (
              <div className="h-5 w-16 bg-neutral-700 animate-pulse rounded" />
            ) : (
              <div className="text-lg font-bold text-white">
                {formatPrice(displayPrice)}
              </div>
            )}
            {priceChange24h !== 0 && !isPriceLoading && (
              <div className={`flex items-center gap-1 text-sm ${getPriceChangeColor(priceChange24h)}`}>
                {getPriceChangeIcon(priceChange24h)}
                <span>{formatPriceChange(priceChange24h)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 px-4 pt-2">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <div className="text-sm text-neutral-400">Total Supply</div>
              <div className="text-lg font-semibold text-white">
                {formatCompactNumber(parseFloat(stablecoin.totalSupply || '0'))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-sm text-neutral-400">30D Volume</div>
                <div className="text-sm font-medium text-white">
                  ${formatCompactNumber(parseFloat(stablecoin.transactionVolume30d || '0'))}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-neutral-400">Daily Transactions</div>
                <div className="text-sm font-medium text-white">
                  {formatCompactNumber(parseFloat(stablecoin.transactionCountDaily || '0'))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-neutral-400">Pegged to</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-white">
                {stablecoin.peggedAsset}
              </div>
              <div className="text-sm text-neutral-300">
                ({stablecoin.peggedAsset === 'USD' ? '$1.00' : pegPriceData?.pegPrice ? `$${pegPriceData.pegPrice}` : 'N/A'})
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-4 pb-4">
        <Link
          href={`/stablecoin/${stablecoin.slug}`}
          className="flex items-center justify-center gap-2"
        >
          <Button variant="outline" className="h-9 w-full">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
