import { useState, useEffect } from 'react';

export interface PegPriceData {
  stablecoinId: number;
  peggedAsset: string;
  name: string;
  pegPrice: number;
  lastUpdated: string;
  updateUnixTime: number;
}

interface PegPricesResponse {
  pegPrices: PegPriceData[];
}

const CORE_API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';

export function usePegPrices() {
  const [pegPrices, setPegPrices] = useState<PegPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPegPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${CORE_API_BASE_URL}/api/stablecoins/peg-prices`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PegPricesResponse = await response.json();
        setPegPrices(data.pegPrices || []);
      } catch (err) {
        console.error('Error fetching peg prices:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch peg prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPegPrices();
  }, []);

  const getPegPriceByStablecoinId = (stablecoinId: number): PegPriceData | null => {
    return pegPrices.find(price => price.stablecoinId === stablecoinId) || null;
  };

  return {
    pegPrices,
    loading,
    error,
    getPegPriceByStablecoinId,
  };
}
