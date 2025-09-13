import { useState, useEffect } from 'react';

export interface LatestDataDate {
  latestDataDate: string | null;
  formattedDate: string;
}

export function useLatestDataDate() {
  const [data, setData] = useState<LatestDataDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('useLatestDataDate hook called');

  useEffect(() => {
    const fetchLatestDataDate = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = 'http://localhost:3004'; // Hardcoded for debugging
        console.log('Fetching latest data date from:', `${baseUrl}/api/latest-data-date`);

        const response = await fetch(`${baseUrl}/api/latest-data-date`);

        if (!response.ok) {
          throw new Error(`Failed to fetch latest data date: ${response.statusText}`);
        }

        const result: LatestDataDate = await response.json();
        console.log('Latest data date result:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching latest data date:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch latest data date');
        setData({
          latestDataDate: null,
          formattedDate: 'No data available',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDataDate();
  }, []);

  return {
    data,
    loading,
    error,
  };
}
