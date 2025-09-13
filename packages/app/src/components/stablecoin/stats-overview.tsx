'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, DollarSign } from 'lucide-react';

interface StatsOverviewProps {
  totalMarketCap: number;
  totalTransactionVolume: {
    daily: number;
    monthly: number;
    yearly: number;
  };
}

export function StatsOverview({ totalMarketCap, totalTransactionVolume }: StatsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Supply Card */}
        <Card className="group bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                    Total Supply
                  </div>
                </div>
                <div className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                  {formatCurrency(totalMarketCap)}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Monthly Volume Card */}
        <Card className="group bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
                    <BarChart3 className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                    Monthly Volume
                  </div>
                </div>
                <div className="text-3xl font-bold text-white group-hover:text-green-100 transition-colors duration-300">
                  {formatCurrency(totalTransactionVolume.monthly)}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Daily Volume Card */}
        <Card className="group bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                    Daily Volume
                  </div>
                </div>
                <div className="text-3xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">
                  {formatCurrency(totalTransactionVolume.daily)}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
