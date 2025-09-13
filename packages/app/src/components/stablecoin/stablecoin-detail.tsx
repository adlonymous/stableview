'use client';

import { Stablecoin } from '@/types/stablecoin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Info, BarChart3, Users, DollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SupplyChart } from '@/components/charts/supply-chart';
import { useChartData } from '@/hooks/useChartData';
import { useState, useEffect, useRef } from 'react';

interface StablecoinDetailProps {
  stablecoin: Stablecoin;
}

export function StablecoinDetail({ stablecoin }: StablecoinDetailProps) {
  const [chartRange, setChartRange] = useState('1M');
  const hasRefreshed = useRef(false);

  const {
    data: chartData,
    loading: chartLoading,
    error: chartError,
    refetch,
  } = useChartData({
    stablecoinId: stablecoin.id,
    range: chartRange,
    enabled: true,
  });

  // Auto-refresh chart data once when component mounts
  useEffect(() => {
    if (!hasRefreshed.current && !chartLoading) {
      hasRefreshed.current = true;
      console.log('Auto-refreshing chart data for stablecoin:', stablecoin.id);
      refetch();
    }
  }, [stablecoin.id, chartLoading, refetch]);

  console.log('StablecoinDetail chart data:', {
    chartData,
    chartLoading,
    chartError,
    stablecoinId: stablecoin.id,
    range: chartRange,
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex items-center gap-6">
            {stablecoin.logoUrl && (
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-neutral-700 shadow-xl">
                <Image
                  src={stablecoin.logoUrl}
                  alt={`${stablecoin.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{stablecoin.name}</h1>
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 text-sm font-medium">
                  {stablecoin.token}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 bg-neutral-800/50 px-4 py-1.5 text-sm"
                >
                  {stablecoin.tokenProgram}
                </Badge>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">${stablecoin.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:ml-auto">
            {stablecoin.tokenAddress && (
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium px-6 py-2.5 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Link
                  href={`https://solscan.io/token/${stablecoin.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View on Solscan</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {stablecoin.artemisLink && (
              <Button
                asChild
                variant="outline"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500 px-6 py-2.5 transition-all duration-300"
              >
                <Link href={stablecoin.artemisLink} target="_blank" rel="noopener noreferrer">
                  <span>Artemis</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {stablecoin.assetReservesLink && (
              <Button
                asChild
                variant="outline"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500 px-6 py-2.5 transition-all duration-300"
              >
                <Link href={stablecoin.assetReservesLink} target="_blank" rel="noopener noreferrer">
                  <span>Reserves</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <CardHeader className="pb-4 px-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <div className="space-y-2">
                <CardDescription className="text-blue-300 font-medium">
                  Total Supply
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  {formatCompactNumber(parseFloat(stablecoin.totalSupply))}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="group bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
          <CardHeader className="pb-4 px-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="space-y-2">
                <CardDescription className="text-green-300 font-medium">
                  Daily Active Users
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  {formatCompactNumber(parseFloat(stablecoin.dailyActiveUsers))}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="group bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
          <CardHeader className="pb-4 px-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <div className="space-y-2">
                <CardDescription className="text-purple-300 font-medium">
                  Daily Transactions
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  {formatCompactNumber(parseFloat(stablecoin.transactionCountDaily))}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Enhanced Tabs for different data sections */}
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid grid-cols-2 bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-1">
          <TabsTrigger
            value="metrics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
          >
            Metrics
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
          >
            Token Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 shadow-xl">
            <CardContent className="pt-6 px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Token</h3>
                    <p className="text-white">{stablecoin.token}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Pegged Asset</h3>
                    <p className="text-white">{stablecoin.peggedAsset}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Issuer</h3>
                    <p className="text-white">{stablecoin.issuer}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Token Program</h3>
                    <p className="text-white">{stablecoin.tokenProgram}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-neutral-400 mb-1">Token Address</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-neutral-500" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-neutral-800 text-white border-neutral-700">
                            <p>Solana token address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-white font-mono text-sm truncate">
                      {stablecoin.tokenAddress}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Mint Authority</h3>
                    <p className="text-white">{stablecoin.mintAuthority}</p>
                  </div>

                  {/* Commented out as requested */}
                  {/* <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Networks Live On</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {stablecoin.networksLiveOn.map(network => (
                        <Badge
                          key={network}
                          variant="secondary"
                          className="bg-neutral-800 text-neutral-200"
                        >
                          {network}
                        </Badge>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>

              <Separator className="my-5 bg-neutral-800" />

              {/* Commented out as requested */}
              {/* <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Bridging Mechanisms</h3>
                  <div className="flex flex-wrap gap-2">
                    {stablecoin.bridgingMechanisms.map(mechanism => (
                      <Badge
                        key={mechanism}
                        variant="outline"
                        className="border-neutral-700 text-neutral-300"
                      >
                        {mechanism}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Redemption Mechanisms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stablecoin.redemptionMechanisms.map(mechanism => (
                      <Badge
                        key={mechanism}
                        variant="outline"
                        className="border-neutral-700 text-neutral-300"
                      >
                        {mechanism}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
            <CardHeader className="px-5 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-4 w-4 text-neutral-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Token Metrics</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Key quantitative data from the blockchain
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Total Supply</div>
                  <div className="text-2xl font-semibold text-white">
                    {formatCompactNumber(parseFloat(stablecoin.totalSupply))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Daily Active Users</div>
                  <div className="text-2xl font-semibold text-white">
                    {formatCompactNumber(parseFloat(stablecoin.dailyActiveUsers))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Daily Transaction Count</div>
                  <div className="text-2xl font-semibold text-white">
                    {formatCompactNumber(parseFloat(stablecoin.transactionCountDaily))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">30-Day Volume</div>
                  <div className="text-2xl font-semibold text-white">
                    {formatCurrency(parseFloat(stablecoin.transactionVolume30d))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <SupplyChart
                  data={chartData}
                  title="Total Supply Over Time"
                  stablecoinName={stablecoin.name}
                  currentRange={chartRange}
                  onRangeChange={setChartRange}
                  loading={chartLoading}
                />
                {chartError && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">Error loading chart data: {chartError}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Executive Summary */}
      <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
        <CardHeader className="px-5 pt-4 pb-2">
          <CardTitle className="text-white">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <p className="text-neutral-300 leading-relaxed">
            {stablecoin.executiveSummary || 'Coming soon'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
