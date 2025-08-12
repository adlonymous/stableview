'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';
import { BarChart3, Users, DollarSign } from 'lucide-react';

interface StatsOverviewProps {
  totalMarketCap: number;
  totalUniqueUsers: number;
  totalTransactionVolume: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  stablecoinCount: number;
}

export function StatsOverview({
  totalMarketCap,
  totalUniqueUsers,
  totalTransactionVolume,
  stablecoinCount,
}: StatsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0 mt-0.5">
                <DollarSign className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <CardDescription className="text-neutral-400">Total Market Cap</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {formatCurrency(totalMarketCap)}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <CardDescription className="text-neutral-400">Monthly Volume</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {formatCurrency(totalTransactionVolume.monthly)}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <CardDescription className="text-neutral-400">Unique Users</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {formatCompactNumber(totalUniqueUsers)}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 pl-[60px]">
            <div className="text-sm text-neutral-400">Across {stablecoinCount} stablecoins</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <CardDescription className="text-neutral-400">Daily Volume</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {formatCurrency(totalTransactionVolume.daily)}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 pl-[60px]">
            <div className="text-sm text-neutral-400">Daily transaction volume</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
