'use client';

import { Stablecoin } from '@/types/stablecoin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';
import { usePriceData } from '@/hooks/usePriceData';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Info, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StablecoinChart } from '@/components/charts/stablecoin-chart';
import { useChartData } from '@/hooks/useChartData';
import { useDauData } from '@/hooks/useDauData';
import { useState, useEffect, useRef } from 'react';

interface StablecoinDetailProps {
  stablecoin: Stablecoin;
}

export function StablecoinDetail({ stablecoin }: StablecoinDetailProps) {
  const [chartRange, setChartRange] = useState('1M');
  const hasRefreshed = useRef(false);

  const {
    data: supplyData,
    loading: supplyLoading,
    error: supplyError,
    refetch: refetchSupply,
  } = useChartData({
    stablecoinId: stablecoin.id,
    range: chartRange,
    enabled: true,
  });

  const {
    data: dauData,
    loading: dauLoading,
    error: dauError,
    refetch: refetchDau,
  } = useDauData({
    stablecoinId: stablecoin.id,
    range: chartRange,
    enabled: true,
  });

  const { priceData } = usePriceData(stablecoin.id);

  // Auto-refresh chart data once when component mounts
  useEffect(() => {
    if (!hasRefreshed.current && !supplyLoading && !dauLoading) {
      hasRefreshed.current = true;
      refetchSupply();
      refetchDau();
    }
  }, [stablecoin.id, supplyLoading, dauLoading, refetchSupply, refetchDau]);

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
                <div className="flex items-center gap-6">
                  {/* Current Price */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-400">Current Price</span>
                      {priceData && priceData.price !== null && priceData.price !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-400">
                            ${Number(priceData.price.toFixed(7))}
                          </span>
                          {priceData.priceChange24h !== null &&
                            priceData.priceChange24h !== undefined && (
                              <div className="flex items-center gap-1">
                                {priceData.priceChange24h >= 0 ? (
                                  <TrendingUp className="h-3 w-3 text-green-400" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-red-400" />
                                )}
                                <span
                                  className={`text-xs ${
                                    priceData.priceChange24h >= 0
                                      ? 'text-green-400'
                                      : 'text-red-400'
                                  }`}
                                >
                                  {priceData.priceChange24h >= 0 ? '+' : ''}
                                  {Number((priceData.priceChange24h * 100).toFixed(7))}%
                                </span>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-400">
                            {stablecoin.price === null ||
                            stablecoin.price === undefined ||
                            stablecoin.price === -1
                              ? 'N/A'
                              : `$${Number(stablecoin.price.toFixed(7))}`}
                          </span>
                          <span className="text-xs text-neutral-400">(Static)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Peg Price */}
                  {stablecoin.pegPrice && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-400">Peg Price</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-400">
                            ${stablecoin.pegPrice.toFixed(4)}
                          </span>
                          <span className="text-xs text-neutral-400">
                            ({stablecoin.peggedAsset})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                    <div className="flex items-center gap-2">
                      <p className="text-white">{stablecoin.peggedAsset}</p>
                      {stablecoin.pegPrice && (
                        <span className="text-sm text-neutral-300">(${stablecoin.pegPrice})</span>
                      )}
                    </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Peg Price</div>
                  <div className="text-2xl font-semibold text-white">
                    {stablecoin.pegPrice ? (
                      <div className="flex items-center gap-2">
                        <span>{stablecoin.pegPrice.toFixed(4)}</span>
                        <span className="text-sm text-neutral-400">{stablecoin.peggedAsset}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-500">N/A</span>
                    )}
                  </div>
                  {stablecoin.pegPriceUpdatedAt && (
                    <div className="text-xs text-neutral-500">
                      Updated {new Date(stablecoin.pegPriceUpdatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Current Price</div>
                  <div className="text-2xl font-semibold text-white">
                    ${stablecoin.price ? Number(stablecoin.price.toFixed(7)) : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <StablecoinChart
                  supplyData={supplyData}
                  dauData={dauData}
                  title="Stablecoin Metrics"
                  stablecoinName={stablecoin.name}
                  currentRange={chartRange}
                  onRangeChange={setChartRange}
                  loading={supplyLoading || dauLoading}
                />
                {(supplyError || dauError) && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                      Error loading chart data: {supplyError || dauError}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
