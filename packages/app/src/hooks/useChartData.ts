import { useState, useEffect, useCallback } from 'react';

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface ChartData {
  data: ChartDataPoint[];
  range: string;
  stablecoinId?: number;
  count: number;
}

export interface UseChartDataOptions {
  stablecoinId?: number;
  range?: string;
  enabled?: boolean;
}

export function useChartData({ stablecoinId, range = '1M', enabled = true }: UseChartDataOptions) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      let url: string;
      if (stablecoinId) {
        // Individual stablecoin chart - call core API directly
        const baseUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';
        url = `${baseUrl}/api/stablecoins/${stablecoinId}/charts/supply?range=${range}`;
      } else {
        // Aggregated chart - use frontend API route
        url = `/api/stablecoins/charts/supply/aggregated?range=${range}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`);
      }

      const result: ChartData = await response.json();
      setData(result.data || []);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, stablecoinId, range]);

  useEffect(() => {
    fetchChartData();
  }, [stablecoinId, range, enabled, fetchChartData]);

  return {
    data,
    loading,
    error,
    refetch: fetchChartData,
  };
}
