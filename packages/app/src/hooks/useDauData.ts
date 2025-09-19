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

export interface UseDauDataOptions {
  stablecoinId?: number;
  range?: string;
  enabled?: boolean;
}

export function useDauData({ stablecoinId, range = '1M', enabled = true }: UseDauDataOptions) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDauData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      let url: string;
      if (stablecoinId) {
        // Individual stablecoin chart - call core API directly
        const baseUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';
        url = `${baseUrl}/api/stablecoins/${stablecoinId}/charts/dau?range=${range}`;
      } else {
        // Aggregated chart - use frontend API route
        url = `/api/stablecoins/charts/dau/aggregated?range=${range}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch DAU data: ${response.statusText}`);
      }

      const result: ChartData = await response.json();
      setData(result.data || []);
    } catch (err) {
      console.error('Error fetching DAU data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch DAU data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, stablecoinId, range]);

  useEffect(() => {
    fetchDauData();
  }, [stablecoinId, range, enabled, fetchDauData]);

  return {
    data,
    loading,
    error,
    refetch: fetchDauData,
  };
}
