import { useState, useEffect } from 'react';
import { fetchAllStablecoinPrices } from '@/lib/api';

export function useStablecoinPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const priceData = await fetchAllStablecoinPrices();
        setPrices(priceData);
      } catch (err) {
        console.error('Error loading stablecoin prices:', err);
        setError('Failed to load prices');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrices();

    // Refresh prices every 5 minutes
    const interval = setInterval(loadPrices, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getPrice = (stablecoinId: number): number | null => {
    return prices[stablecoinId.toString()] || null;
  };

  const formatPrice = (stablecoinId: number): string => {
    const price = getPrice(stablecoinId);
    if (price === null || price === -1 || price === '-1') return 'N/A';
    return `$${price}`;
  };

  return {
    prices,
    isLoading,
    error,
    getPrice,
    formatPrice,
    refetch: () => {
      const loadPrices = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const priceData = await fetchAllStablecoinPrices();
          setPrices(priceData);
        } catch (err) {
          console.error('Error loading stablecoin prices:', err);
          setError('Failed to load prices');
        } finally {
          setIsLoading(false);
        }
      };
      loadPrices();
    },
  };
}
