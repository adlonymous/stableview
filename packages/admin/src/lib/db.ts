import { config } from './config';

// Core API configuration
const CORE_API_URL = config.coreApi.url;

// API client for communicating with the core package
export const coreApi = {
  // Get all stablecoins
  async getStablecoins() {
    const response = await fetch(`${CORE_API_URL}/api/stablecoins`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stablecoins: ${response.statusText}`);
    }
    return response.json();
  },

  // Get stablecoin by ID
  async getStablecoin(id: number) {
    const response = await fetch(`${CORE_API_URL}/api/stablecoins/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stablecoin: ${response.statusText}`);
    }
    return response.json();
  },

  // Get stablecoin by slug
  async getStablecoinBySlug(slug: string) {
    const response = await fetch(`${CORE_API_URL}/api/stablecoins/slug/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stablecoin: ${response.statusText}`);
    }
    return response.json();
  },

  // Create new stablecoin
  async createStablecoin(data: NewStablecoin) {
    const response = await fetch(`${CORE_API_URL}/api/stablecoins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create stablecoin: ${response.statusText}`);
    }
    return response.json();
  },

  // Update stablecoin
  async updateStablecoin(id: number, data: Partial<NewStablecoin>) {
    const response = await fetch(`${CORE_API_URL}/api/stablecoins/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update stablecoin: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete stablecoin
  async deleteStablecoin(id: number) {
    const response = await fetch(`${CORE_API_URL}/api/stablecoins/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete stablecoin: ${response.statusText}`);
    }
    return response.json();
  },
};

// Mock data for development/testing (fallback)
export const mockStablecoins = [
  {
    id: 1,
    slug: 'usdc',
    name: 'USD Coin',
    token: 'USDC',
    peggedAsset: 'USD',
    issuer: 'Circle',
    tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    mintAuthority: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    transactionVolume30d: '1000000000',
    transactionCountDaily: '50000',
    totalSupply: '50000000000',
    dailyActiveUsers: '100000',
    price: '1.00',
    executiveSummary: 'USD Coin (USDC) is a fully collateralized US dollar stablecoin.',
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    slug: 'usdt',
    name: 'Tether',
    token: 'USDT',
    peggedAsset: 'USD',
    issuer: 'Tether Limited',
    tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    tokenAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    mintAuthority: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    transactionVolume30d: '800000000',
    transactionCountDaily: '40000',
    totalSupply: '40000000000',
    dailyActiveUsers: '80000',
    price: '1.00',
    executiveSummary: 'Tether (USDT) is a stablecoin pegged to the US dollar.',
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Export types based on the mock data structure
export type Stablecoin = (typeof mockStablecoins)[0];
export type NewStablecoin = Omit<Stablecoin, 'id' | 'createdAt' | 'updatedAt'>;
