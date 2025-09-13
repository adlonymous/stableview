import { useState, useEffect } from 'react';

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

export function useChartData({ 
  stablecoinId, 
  range = '1M', 
  enabled = true 
}: UseChartDataOptions) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';
      
      let url: string;
      if (stablecoinId) {
        // Individual stablecoin chart
        url = `${baseUrl}/api/stablecoins/${stablecoinId}/charts/supply?range=${range}`;
      } else {
        // Aggregated chart
        url = `${baseUrl}/api/stablecoins/charts/supply/aggregated?range=${range}`;
      }

      console.log('Fetching chart data from:', url);
      const response = await fetch(url);
      
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`);
      }

      const result: ChartData = await response.json();
      console.log('Chart data received:', result);
      console.log('Data length:', result.data?.length || 0);
      setData(result.data || []);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useChartData useEffect triggered:', { stablecoinId, range, enabled });
    console.log('Environment check:', { 
      NEXT_PUBLIC_CORE_API_URL: process.env.NEXT_PUBLIC_CORE_API_URL,
      enabled 
    });
    fetchChartData();
  }, [stablecoinId, range, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchChartData,
  };
}
