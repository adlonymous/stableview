"use client";

import { Stablecoin } from "@/types/stablecoin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface StablecoinCardProps {
  stablecoin: Stablecoin;
}

export function StablecoinCard({ stablecoin }: StablecoinCardProps) {
  return (
    <Card className="overflow-hidden border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-all hover:shadow-lg hover:shadow-neutral-900/20">
      <CardHeader className="pb-1 px-4 pt-4">
        <div className="flex items-center gap-2">
          {stablecoin.logoUrl && (
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
              <Image
                src={stablecoin.logoUrl}
                alt={`${stablecoin.name} logo`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <CardTitle className="text-xl text-white">{stablecoin.token}</CardTitle>
            <CardDescription className="text-neutral-400">{stablecoin.name}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto border-neutral-700 text-neutral-300">
            {stablecoin.tokenProgram}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-4 pt-2">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-neutral-400">Market Cap</p>
              <p className="font-medium text-white text-sm truncate">{formatCurrency(stablecoin.marketCap)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Holders</p>
                <p className="font-medium text-white text-sm">{formatCompactNumber(stablecoin.uniqueAddresses)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Daily Volume</p>
                <p className="font-medium text-white text-sm truncate">{formatCurrency(stablecoin.transactionVolume.daily)}</p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-neutral-400">Issuer</p>
            <p className="font-medium text-white text-sm truncate">{stablecoin.issuer}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-4">
        <Button asChild className="w-full bg-neutral-800 hover:bg-neutral-700 text-white group">
          <Link href={`/stablecoin/${stablecoin.id}`} className="flex items-center justify-between">
            <span>View Details</span>
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 