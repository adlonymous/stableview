'use client';

import { useState } from 'react';
import { trpc } from '../lib/trpc';

// Hook for fetching all stablecoins
export function useStablecoins() {
  const [isLoading, setIsLoading] = useState(true);
  const [stablecoins, setStablecoins] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchStablecoins = async () => {
    try {
      setIsLoading(true);
      const result = await trpc.stablecoin.getAll.query();
      setStablecoins(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching stablecoins:', err);
      setError('Failed to load stablecoins');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stablecoins,
    isLoading,
    error,
    fetchStablecoins,
  };
}

// Hook for creating a stablecoin
export function useCreateStablecoin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStablecoin = async (data: any) => {
    try {
      setIsSubmitting(true);
      const result = await trpc.stablecoin.create.mutate(data);
      setError(null);
      return result;
    } catch (err) {
      console.error('Error creating stablecoin:', err);
      setError('Failed to create stablecoin');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createStablecoin,
    isSubmitting,
    error,
  };
}

// Hook for getting a single stablecoin
export function useStablecoin(id: number) {
  const [isLoading, setIsLoading] = useState(true);
  const [stablecoin, setStablecoin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStablecoin = async () => {
    try {
      setIsLoading(true);
      const result = await trpc.stablecoin.getById.query(id);
      setStablecoin(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching stablecoin with ID ${id}:`, err);
      setError('Failed to load stablecoin');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stablecoin,
    isLoading,
    error,
    fetchStablecoin,
  };
} 