'use client';

import { useState } from 'react';
import { useChartData } from '@/hooks/useChartData';
import { useDauData } from '@/hooks/useDauData';
import { StablecoinChart } from './stablecoin-chart';

export function AggregatedCharts() {
  const [chartRange, setChartRange] = useState('1M');

  const {
    data: supplyData,
    loading: supplyLoading,
    error: supplyError,
  } = useChartData({
    range: chartRange,
    enabled: true,
  });

  const {
    data: dauData,
    loading: dauLoading,
    error: dauError,
  } = useDauData({
    range: chartRange,
    enabled: true,
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Market Analytics</h2>
        <p className="text-neutral-400">Aggregated metrics across all stablecoins</p>
      </div>

      <div className="relative">
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-sm rounded-2xl border border-neutral-700/60">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <svg
                className="w-10 h-10 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-neutral-300 text-lg">
                Advanced aggregated analytics are in development
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                Stay tuned for comprehensive market insights
              </p>
            </div>
          </div>
        </div>

        {/* Chart with reduced opacity */}
        <div className="opacity-30 pointer-events-none">
          <StablecoinChart
            supplyData={supplyData}
            dauData={dauData}
            title="All Stablecoins Metrics"
            currentRange={chartRange}
            onRangeChange={setChartRange}
            loading={supplyLoading || dauLoading}
          />
        </div>
      </div>

      {(supplyError || dauError) && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">
            Error loading chart data: {supplyError || dauError}
          </p>
        </div>
      )}
    </div>
  );
}
