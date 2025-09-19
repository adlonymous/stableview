import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  stablecoinId: number;
  tokenAddress: string;
  name: string;
  token: string;
  price: number | null;
  priceChange24h: number | null;
  lastUpdated: string | null;
  updateUnixTime: number | null;
}

interface UsePriceDataReturn {
  priceData: PriceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseAllPricesReturn {
  prices: PriceData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CORE_API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';

// Simple in-memory cache for price data
const priceCache = new Map<number, { data: PriceData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Rate limiting: Track last request time and implement minimum delay
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 25; // 25ms between requests (40 RPS max) - reduced for faster loading

// Queue for price requests to prevent overwhelming the API
const priceRequestQueue: Array<{
  stablecoinId: number;
  resolve: (data: PriceData | null) => void;
  reject: (error: Error) => void;
}> = [];

let isProcessingQueue = false;

// Process the queue with rate limiting
async function processPriceQueue() {
  if (isProcessingQueue || priceRequestQueue.length === 0) return;

  isProcessingQueue = true;

  while (priceRequestQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }

    const request = priceRequestQueue.shift();
    if (!request) break;

    try {
      lastRequestTime = Date.now();
      const response = await fetch(
        `${CORE_API_BASE_URL}/api/stablecoins/${request.stablecoinId}/price`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch price data: ${response.statusText}`);
      }

      const data = await response.json();

      // Only resolve with data if price is not null
      if (data.price !== null && data.price !== undefined) {
        request.resolve(data);
      } else {
        request.resolve(null);
      }
    } catch (error) {
      request.reject(error instanceof Error ? error : new Error('Failed to fetch price data'));
    }
  }

  isProcessingQueue = false;
}

export function usePriceData(stablecoinId: number): UsePriceDataReturn {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = priceCache.get(stablecoinId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`Using cached price data for stablecoin ${stablecoinId}`);
        setPriceData(cached.data);
        setLoading(false);
        return;
      }

      console.log(`Queueing price request for stablecoin ${stablecoinId}`);

      // Add request to queue
      const data = await new Promise<PriceData | null>((resolve, reject) => {
        priceRequestQueue.push({
          stablecoinId,
          resolve,
          reject,
        });

        // Start processing queue if not already running
        processPriceQueue();
      });

      console.log(`Price data received for stablecoin ${stablecoinId}:`, data);

      if (data) {
        console.log(`Setting price data for stablecoin ${stablecoinId}:`, data);
        // Cache the data
        priceCache.set(stablecoinId, { data, timestamp: Date.now() });
        setPriceData(data);
      } else {
        console.log(`Price data is null for stablecoin ${stablecoinId}, not updating`);
        // Don't update priceData, keep it as is to avoid triggering fallback
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price data';
      setError(errorMessage);
      console.error('Error fetching price data:', err);

      // Set price data to null to trigger fallback
      setPriceData(null);
    } finally {
      setLoading(false);
    }
  }, [stablecoinId]);

  useEffect(() => {
    console.log(`usePriceData useEffect called for stablecoin ${stablecoinId}`);
    if (stablecoinId) {
      fetchPriceData();
    }
  }, [stablecoinId, fetchPriceData]);

  return {
    priceData,
    loading,
    error,
    refetch: fetchPriceData,
  };
}

export function useAllPrices(): UseAllPricesReturn {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching all prices with rate limiting');

      // Add delay to respect rate limits
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;

      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve =>
          setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for all prices (reduced)

      lastRequestTime = Date.now();
      const response = await fetch(`${CORE_API_BASE_URL}/api/stablecoins/prices`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('All prices data received:', data);

      // Filter out prices with null values to avoid triggering fallbacks
      const validPrices = (data.prices || []).filter(
        (price: PriceData) => price.price !== null && price.price !== undefined
      );

      // Cache all valid prices
      validPrices.forEach((price: PriceData) => {
        priceCache.set(price.stablecoinId, { data: price, timestamp: Date.now() });
      });

      console.log(`Setting ${validPrices.length} valid prices`);
      setPrices(validPrices);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      console.error('Error fetching prices:', err);

      // Set prices to empty array to trigger fallback
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPrices();
  }, []);

  return {
    prices,
    loading,
    error,
    refetch: fetchAllPrices,
  };
}
