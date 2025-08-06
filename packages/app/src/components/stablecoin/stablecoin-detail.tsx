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

interface StablecoinDetailProps {
  stablecoin: Stablecoin;
}

export function StablecoinDetail({ stablecoin }: StablecoinDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex items-center gap-4">
          {stablecoin.logoUrl && (
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
              <Image
                src={stablecoin.logoUrl}
                alt={`${stablecoin.name} logo`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{stablecoin.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-neutral-800 text-white hover:bg-neutral-700">
                {stablecoin.token}
              </Badge>
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                {stablecoin.tokenProgram}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 md:ml-auto">
          <Button
            asChild
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <Link href={stablecoin.solscanLink} target="_blank" rel="noopener noreferrer">
              <span>Solscan</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <Link href={stablecoin.artemisLink} target="_blank" rel="noopener noreferrer">
              <span>Artemis</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <Link href={stablecoin.assetReservesLink} target="_blank" rel="noopener noreferrer">
              <span>Reserves</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0 mt-0.5">
                <DollarSign className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <CardDescription className="text-neutral-400">Market Cap</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {formatCurrency(stablecoin.marketCap)}
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
                <CardDescription className="text-neutral-400">Unique Addresses</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {formatCompactNumber(stablecoin.uniqueAddresses)}
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
                <CardDescription className="text-neutral-400">Daily Volume</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {formatCurrency(stablecoin.transactionVolume.daily)}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
        <CardHeader className="px-5 pt-4 pb-2">
          <CardTitle className="text-white">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <p className="text-neutral-300 leading-relaxed">{stablecoin.executiveSummary}</p>
        </CardContent>
      </Card>

      {/* Tabs for different data sections */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-2 bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="details" className="data-[state=active]:bg-neutral-800">
            Token Details
          </TabsTrigger>
          <TabsTrigger value="volume" className="data-[state=active]:bg-neutral-800">
            Volume Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
            <CardContent className="pt-4 px-5 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
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

                  <div>
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
                  </div>
                </div>
              </div>

              <Separator className="my-5 bg-neutral-800" />

              <div className="space-y-5">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="mt-4">
          <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all">
            <CardHeader className="px-5 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-neutral-800/50 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-4 w-4 text-neutral-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Transaction Volume</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Historical transaction volume across different timeframes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Daily</div>
                  <div className="text-2xl font-semibold text-white">
                    {formatCurrency(stablecoin.transactionVolume.daily)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Monthly</div>
                  <div className="text-2xl font-semibold text-white">
                    {formatCurrency(stablecoin.transactionVolume.monthly)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-neutral-400">Yearly</div>
                  <div className="text-2xl font-semibold text-white">
                    {formatCurrency(stablecoin.transactionVolume.yearly)}
                  </div>
                </div>
              </div>

              <div className="mt-6 h-64 w-full bg-neutral-800 rounded-md flex items-center justify-center">
                <p className="text-neutral-400">Transaction volume chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
