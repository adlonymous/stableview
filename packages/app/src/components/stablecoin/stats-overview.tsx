"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowUpRight, BarChart3, Users, DollarSign, PieChart } from "lucide-react";

interface StatsOverviewProps {
  totalMarketCap: number;
  totalUniqueUsers: number;
  totalTransactionVolume: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  percentageOfSolanaVolume: number;
  stablecoinCount: number;
  dominantStablecoin: string;
  dominantStablecoinShare: number;
  yearOverYearGrowth: number;
}

export function StatsOverview({
  totalMarketCap,
  totalUniqueUsers,
  totalTransactionVolume,
  percentageOfSolanaVolume,
  stablecoinCount,
  dominantStablecoin,
  dominantStablecoinShare,
  yearOverYearGrowth,
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
          <CardContent className="px-4 pb-4 pt-0 pl-[60px]">
            <div className="text-sm text-emerald-400 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +{formatPercentage(yearOverYearGrowth / 100)} YoY
            </div>
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
            <div className="text-sm text-neutral-400">
              {formatPercentage(percentageOfSolanaVolume / 100)} of Solana volume
            </div>
          </CardContent>
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
            <div className="text-sm text-neutral-400">
              Across {stablecoinCount} stablecoins
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0 mt-0.5">
                <PieChart className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <CardDescription className="text-neutral-400">Market Share</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {dominantStablecoin}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 pl-[60px]">
            <div className="text-sm text-neutral-400">
              {formatPercentage(dominantStablecoinShare / 100)} market dominance
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0">
              <BarChart3 className="h-4 w-4 text-neutral-400" />
            </div>
            <div>
              <CardTitle className="text-white">Transaction Volume</CardTitle>
              <CardDescription className="text-neutral-400">
                Stablecoin transaction volume across different timeframes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-neutral-400">Daily</div>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(totalTransactionVolume.daily)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-neutral-400">Monthly</div>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(totalTransactionVolume.monthly)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-neutral-400">Yearly</div>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(totalTransactionVolume.yearly)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 