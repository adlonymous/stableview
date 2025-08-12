import { NextResponse } from 'next/server';
import { config } from '../../../../lib/config';

// Mock data as fallback
const mockStablecoins = [
  {
    id: 1,
    slug: 'usdc',
    name: 'USD Coin',
    transactionVolume30d: '50000000000',
    transactionCount30d: '1000000',
    totalSupply: '40000000000',
    uniqueAddresses30d: '250000',
    price: '1.00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    slug: 'usdt',
    name: 'Tether',
    transactionVolume30d: '80000000000',
    transactionCount30d: '1500000',
    totalSupply: '70000000000',
    uniqueAddresses30d: '300000',
    price: '1.00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    
    // Try to get data from the core API first
    try {
      const response = await fetch(`${config.coreApi.url}/api/stablecoins/${numericId}`, {
        signal: AbortSignal.timeout(config.coreApi.timeout),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully fetched stablecoin ${numericId} from core API`);
        return NextResponse.json(data);
      }
    } catch (apiError) {
      console.warn('Core API failed, using mock data:', apiError);
    }
    
    // Fall back to mock data if core API is not available
    const mockItem = mockStablecoins.find(coin => coin.id === numericId);
    if (mockItem) {
      console.log(`Using mock data for stablecoin ID ${numericId}`);
      return NextResponse.json(mockItem);
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error: any) {
    console.error('Error fetching stablecoin by id:', error);
    
    // Try to return mock data as last resort
    try {
      const { id } = await params;
      const numericId = Number(id);
      const mockItem = mockStablecoins.find(coin => coin.id === numericId);
      if (mockItem) {
        return NextResponse.json(mockItem);
      }
    } catch (paramError) {
      console.error('Error parsing params:', paramError);
    }
    
    return NextResponse.json({ error: 'Failed to fetch stablecoin' }, { status: 500 });
  }
} 