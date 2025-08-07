import { useState, useCallback } from 'react';
import { api } from '../lib/trpc';

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
  transactionCount30d: string;
  totalSupply: string;
  uniqueAddresses30d: string;
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

  const fetchStablecoins = useCallback(async (filters?: {
    search?: string;
    peggedAsset?: string;
    issuer?: string;
    tokenProgram?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, you would fetch from the API
      // const data = await api.get<Stablecoin[]>('stablecoins');
      
      // For now, use mock data
      const mockData: Stablecoin[] = [
        {
          id: 1,
          slug: 'usdc',
          name: 'USD Coin',
          token: 'USDC',
          peggedAsset: 'USD',
          issuer: 'Circle',
          tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          mintAuthority: 'CircleMintAuthority',
          transactionVolume30d: '50000000000',
          transactionCount30d: '1000000',
          totalSupply: '40000000000',
          uniqueAddresses30d: '250000',
          price: '1.00',
          executiveSummary: 'USDC is a fully-collateralized US dollar stablecoin.',
          logoUrl: 'https://example.com/usdc-logo.png',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          slug: 'usdt',
          name: 'Tether',
          token: 'USDT',
          peggedAsset: 'USD',
          issuer: 'Tether Operations Limited',
          tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          tokenAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          mintAuthority: 'TetherMintAuthority',
          transactionVolume30d: '80000000000',
          transactionCount30d: '1500000',
          totalSupply: '70000000000',
          uniqueAddresses30d: '300000',
          price: '1.00',
          executiveSummary: 'Tether (USDT) is a stablecoin pegged to the US dollar.',
          logoUrl: 'https://example.com/usdt-logo.png',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setStablecoins(mockData);
    } catch (err) {
      console.error('Error fetching stablecoins:', err);
      setError('Failed to load stablecoins');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stablecoins, isLoading, error, fetchStablecoins };
}

// Hook for fetching a single stablecoin by ID
export function useStablecoin(id: number) {
  const [stablecoin, setStablecoin] = useState<Stablecoin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStablecoin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, you would fetch from the API
      // const data = await api.get<Stablecoin>(`stablecoins/${id}`);
      
      // For now, use mock data
      const mockData: Stablecoin = {
        id: id,
        slug: id === 1 ? 'usdc' : 'usdt',
        name: id === 1 ? 'USD Coin' : 'Tether',
        token: id === 1 ? 'USDC' : 'USDT',
        peggedAsset: 'USD',
        issuer: id === 1 ? 'Circle' : 'Tether Operations Limited',
        tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        tokenAddress: id === 1 ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' : 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        mintAuthority: id === 1 ? 'CircleMintAuthority' : 'TetherMintAuthority',
        transactionVolume30d: id === 1 ? '50000000000' : '80000000000',
        transactionCount30d: id === 1 ? '1000000' : '1500000',
        totalSupply: id === 1 ? '40000000000' : '70000000000',
        uniqueAddresses30d: id === 1 ? '250000' : '300000',
        price: '1.00',
        executiveSummary: id === 1 ? 'USDC is a fully-collateralized US dollar stablecoin.' : 'Tether (USDT) is a stablecoin pegged to the US dollar.',
        logoUrl: `https://example.com/${id === 1 ? 'usdc' : 'usdt'}-logo.png`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setStablecoin(mockData);
    } catch (err) {
      console.error(`Error fetching stablecoin with ID ${id}:`, err);
      setError('Failed to load stablecoin');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { stablecoin, isLoading, error, fetchStablecoin };
}

// Hook for creating a new stablecoin
export function useCreateStablecoin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStablecoin = useCallback(async (data: Partial<Stablecoin>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // In a real implementation, you would post to the API
      // const result = await api.post<Stablecoin>('stablecoins', data);
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Created stablecoin (mock):', data);
      return { id: Math.floor(Math.random() * 1000), ...data };
    } catch (err) {
      console.error('Error creating stablecoin:', err);
      setError('Failed to create stablecoin');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createStablecoin, isSubmitting, error };
} 