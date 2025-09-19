import { useState, useCallback } from 'react';
import { coreApi, NewStablecoin } from '../lib/db';

// Define types for stablecoin data
export interface Stablecoin {
  id: number;
  slug: string;
  name: string;
  token: string;
  peggedAsset: string;
  issuer: string;
  tokenProgram: string;
  tokenAddress: string;
  mintAuthority: string;
  transactionVolume30d: string;
  transactionCountDaily: string;
  totalSupply: string;
  dailyActiveUsers: string;
  price: string;
  executiveSummary?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Hook for fetching all stablecoins
export function useStablecoins() {
  const [stablecoins, setStablecoins] = useState<Stablecoin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MEMOIZE this function to prevent infinite loops
  const fetchStablecoins = useCallback(async () => {
    try {
      console.log('Fetching stablecoins from core API...');
      setIsLoading(true);
      setError(null);

      const data = await coreApi.getStablecoins();
      console.log('Received stablecoins data:', data);
      setStablecoins(data);
    } catch (err) {
      console.error('Error fetching stablecoins:', err);
      setError('Failed to load stablecoins');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array - function never changes

  return { stablecoins, isLoading, error, fetchStablecoins };
}

// Hook for fetching a single stablecoin by ID
export function useStablecoin(id: number) {
  const [stablecoin, setStablecoin] = useState<Stablecoin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MEMOIZE this function too
  const fetchStablecoin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await coreApi.getStablecoin(id);
      setStablecoin(data);
    } catch (err) {
      console.error(`Error fetching stablecoin with ID ${id}:`, err);
      setError('Failed to load stablecoin');
    } finally {
      setIsLoading(false);
    }
  }, [id]); // Only depends on id

  return { stablecoin, isLoading, error, fetchStablecoin };
}

// Hook for fetching a single stablecoin by slug
export function useStablecoinBySlug(slug: string) {
  const [stablecoin, setStablecoin] = useState<Stablecoin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MEMOIZE this function too
  const fetchStablecoin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await coreApi.getStablecoinBySlug(slug);
      setStablecoin(data);
    } catch (err) {
      console.error(`Error fetching stablecoin with slug ${slug}:`, err);
      setError('Failed to load stablecoin');
    } finally {
      setIsLoading(false);
    }
  }, [slug]); // Only depends on slug

  return { stablecoin, isLoading, error, fetchStablecoin };
}

// Hook for creating a new stablecoin
export function useCreateStablecoin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStablecoin = async (data: NewStablecoin) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const result = await coreApi.createStablecoin(data);
      return result;
    } catch (err) {
      console.error('Error creating stablecoin:', err);
      setError('Failed to create stablecoin');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createStablecoin, isSubmitting, error };
}
