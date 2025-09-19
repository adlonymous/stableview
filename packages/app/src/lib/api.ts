import { Stablecoin } from '@/types/stablecoin';

const CORE_API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';

// Debug logging
console.log('🔧 API Configuration:', {
  NEXT_PUBLIC_CORE_API_URL: process.env.NEXT_PUBLIC_CORE_API_URL,
  CORE_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
});

// Helper function to get the full API URL
function getApiUrl(endpoint: string): string {
  // If the endpoint starts with http, use it as-is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }

  // Otherwise, prepend the base URL
  const fullUrl = `${CORE_API_BASE_URL}${endpoint}`;
  console.log(`🔗 API Call: ${endpoint} → ${fullUrl}`);
  return fullUrl;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(response.status, `API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Provide more helpful error messages for common issues
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error(`Network error when calling ${url}. This might be due to:`, {
        'CORS issues': 'Check if your backend allows requests from the ngrok domain',
        'Backend not running': 'Ensure your backend is running on localhost:3004',
        'Wrong API URL': `Current API base URL: ${CORE_API_BASE_URL}`,
        'Ngrok configuration': 'Make sure your ngrok is properly configured',
      });
    }
    throw error;
  }
}

export async function fetchStablecoins(): Promise<Stablecoin[]> {
  try {
    return await fetchApi<Stablecoin[]>('/api/stablecoins');
  } catch (error) {
    console.error('Failed to fetch stablecoins:', error);
    throw error;
  }
}

export async function fetchStablecoinById(id: number): Promise<Stablecoin> {
  try {
    return await fetchApi<Stablecoin>(`/api/stablecoins/${id}`);
  } catch (error) {
    console.error(`Failed to fetch stablecoin ${id}:`, error);
    throw error;
  }
}

export async function fetchStablecoinBySlug(slug: string): Promise<Stablecoin> {
  try {
    return await fetchApi<Stablecoin>(`/api/stablecoins/slug/${slug}`);
  } catch (error) {
    console.error(`Failed to fetch stablecoin ${slug}:`, error);
    throw error;
  }
}

// Fallback to mock data if API fails
export async function fetchStablecoinsWithFallback(): Promise<Stablecoin[]> {
  try {
    return await fetchStablecoins();
  } catch (error) {
    console.warn('API failed, falling back to mock data:', error);
    // Import mock data dynamically to avoid bundling in production
    const { mockStablecoins } = await import('./mock-data');
    return mockStablecoins;
  }
}

export async function fetchStablecoinByIdWithFallback(id: number): Promise<Stablecoin> {
  try {
    return await fetchStablecoinById(id);
  } catch (error) {
    console.warn(`API failed for stablecoin ${id}, falling back to mock data:`, error);
    const { mockStablecoins } = await import('./mock-data');
    const mockStablecoin = mockStablecoins.find(coin => coin.id === id);
    if (!mockStablecoin) {
      throw new Error(`Stablecoin ${id} not found`);
    }
    return mockStablecoin;
  }
}

export async function fetchStablecoinBySlugWithFallback(slug: string): Promise<Stablecoin> {
  try {
    return await fetchStablecoinBySlug(slug);
  } catch (error) {
    console.warn(`API failed for stablecoin ${slug}, falling back to mock data:`, error);
    const { mockStablecoins } = await import('./mock-data');
    const mockStablecoin = mockStablecoins.find(coin => coin.slug === slug);
    if (!mockStablecoin) {
      throw new Error(`Stablecoin ${slug} not found`);
    }
    return mockStablecoin;
  }
}

export async function fetchAllStablecoinPrices(): Promise<Record<string, number>> {
  try {
    const response = await fetchApi<{
      prices: Array<{ stablecoinId: number; price: number | null }>;
    }>('/api/stablecoins/prices');
    const priceMap: Record<string, number> = {};

    response.prices.forEach(priceData => {
      if (priceData.price !== null) {
        priceMap[priceData.stablecoinId.toString()] = priceData.price;
      }
    });

    return priceMap;
  } catch (error) {
    console.error('Failed to fetch stablecoin prices:', error);
    return {};
  }
}

export interface CurrencyPegStablecoins {
  [currency: string]: Array<{
    name: string;
    slug: string;
    token: string;
    totalSupply: string | null;
    transactionVolume30d: string | null;
  }>;
}

export async function fetchStablecoinsByCurrencyPeg(): Promise<CurrencyPegStablecoins> {
  try {
    return await fetchApi<CurrencyPegStablecoins>('/api/stablecoins/by-currency-peg');
  } catch (error) {
    console.error('Failed to fetch stablecoins by currency peg:', error);
    throw error;
  }
}

// Fallback to mock data if API fails
export async function fetchStablecoinsByCurrencyPegWithFallback(): Promise<CurrencyPegStablecoins> {
  try {
    return await fetchStablecoinsByCurrencyPeg();
  } catch (error) {
    console.warn('API failed, falling back to mock data:', error);
    // Import mock data dynamically to avoid bundling in production
    const { mockStablecoins } = await import('./mock-data');

    // Group mock data by currency peg
    const grouped = mockStablecoins.reduce((acc, coin) => {
      const peg = coin.peggedAsset;
      if (!acc[peg]) {
        acc[peg] = [];
      }
      acc[peg].push({
        name: coin.name,
        slug: coin.slug,
        token: coin.token,
        totalSupply: coin.totalSupply?.toString() || null,
        transactionVolume30d: coin.transactionVolume30d?.toString() || null,
      });
      return acc;
    }, {} as CurrencyPegStablecoins);

    return grouped;
  }
}

export interface DashboardStats {
  totalMarketCap: number;
  totalSupply: string;
  totalTransactionVolume: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  totalDailyTransactions: string;
  stablecoinCount: number;
  dominantStablecoin: string;
  dominantStablecoinShare: number;
  percentageOfSolanaVolume: number;
  yearOverYearGrowth: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    return await fetchApi<DashboardStats>('/api/dashboard/stats');
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}

// Fallback to mock data if API fails
export async function fetchDashboardStatsWithFallback(): Promise<DashboardStats> {
  try {
    return await fetchDashboardStats();
  } catch (error) {
    console.warn('API failed, falling back to mock data:', error);
    // Import mock data dynamically to avoid bundling in production
    const { solanaStablecoinStats } = await import('./mock-data');
    return {
      totalMarketCap: solanaStablecoinStats.totalMarketCap,
      totalSupply: solanaStablecoinStats.totalMarketCap.toString(),
      totalTransactionVolume: solanaStablecoinStats.totalTransactionVolume,
      totalDailyTransactions: (
        solanaStablecoinStats.totalTransactionVolume.daily / 1000
      ).toString(), // Convert to daily transactions
      stablecoinCount: solanaStablecoinStats.stablecoinCount,
      dominantStablecoin: solanaStablecoinStats.dominantStablecoin,
      dominantStablecoinShare: solanaStablecoinStats.dominantStablecoinShare,
      percentageOfSolanaVolume: solanaStablecoinStats.percentageOfSolanaVolume,
      yearOverYearGrowth: solanaStablecoinStats.yearOverYearGrowth,
    };
  }
}
