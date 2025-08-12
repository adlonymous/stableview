import { Stablecoin } from '@/types/stablecoin';

const CORE_API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';

// Helper function to get the full API URL
function getApiUrl(endpoint: string): string {
  // If the endpoint starts with http, use it as-is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }

  // Otherwise, prepend the base URL
  return `${CORE_API_BASE_URL}${endpoint}`;
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

export interface DashboardStats {
  totalMarketCap: number;
  totalSupply: string;
  totalTransactionVolume: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  totalDailyTransactions: string;
  totalDailyActiveUsers: string;
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
      totalDailyActiveUsers: solanaStablecoinStats.totalUniqueUsers.toString(),
      stablecoinCount: solanaStablecoinStats.stablecoinCount,
      dominantStablecoin: solanaStablecoinStats.dominantStablecoin,
      dominantStablecoinShare: solanaStablecoinStats.dominantStablecoinShare,
      percentageOfSolanaVolume: solanaStablecoinStats.percentageOfSolanaVolume,
      yearOverYearGrowth: solanaStablecoinStats.yearOverYearGrowth,
    };
  }
}
