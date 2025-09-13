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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCompactNumber } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface StablecoinCardProps {
  stablecoin: Stablecoin;
}

export function StablecoinCard({ stablecoin }: StablecoinCardProps) {
  return (
    <Card className="group overflow-hidden border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex items-center gap-3">
          {stablecoin.logoUrl && (
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 group-hover:border-blue-500/50 transition-colors duration-300">
              <Image
                src={stablecoin.logoUrl}
                alt={`${stablecoin.name} logo`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
              {stablecoin.token}
            </CardTitle>
            <CardDescription className="text-neutral-400 text-sm">
              {stablecoin.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-neutral-700 text-neutral-300 bg-neutral-800/50 group-hover:border-blue-500/50 group-hover:text-blue-300 transition-colors duration-300">
            {stablecoin.tokenProgram}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-4">
        <div className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-3 border border-blue-500/20">
              <p className="text-xs font-medium text-blue-300 mb-1">Total Supply</p>
              <p className="font-bold text-white text-lg">
                {formatCompactNumber(parseFloat(stablecoin.totalSupply))}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-3 border border-green-500/20">
              <p className="text-xs font-medium text-green-300 mb-1">30-Day Volume</p>
              <p className="font-bold text-white text-lg">
                ${formatCompactNumber(parseFloat(stablecoin.transactionVolume30d))}
              </p>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/50">
              <p className="text-xs text-neutral-400 mb-1">Daily Transactions</p>
              <p className="font-semibold text-white text-sm">
                {formatCompactNumber(parseFloat(stablecoin.transactionCountDaily))}
              </p>
            </div>
            <div className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/50">
              <p className="text-xs text-neutral-400 mb-1">Active Users</p>
              <p className="font-semibold text-white text-sm">
                {formatCompactNumber(parseFloat(stablecoin.dailyActiveUsers))}
              </p>
            </div>
          </div>

          {/* Issuer and Price */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500 mb-1">Issuer</p>
              <p className="font-medium text-neutral-200 text-sm truncate">{stablecoin.issuer}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 mb-1">Price</p>
              <p className="font-bold text-green-400 text-sm">${stablecoin.price}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2.5 group/btn transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
          <Link href={`/stablecoin/${stablecoin.id}`} className="flex items-center justify-center gap-2">
            <span>View Details</span>
            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
