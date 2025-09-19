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

      <StablecoinChart
        supplyData={supplyData}
        dauData={dauData}
        title="All Stablecoins Metrics"
        currentRange={chartRange}
        onRangeChange={setChartRange}
        loading={supplyLoading || dauLoading}
      />

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
