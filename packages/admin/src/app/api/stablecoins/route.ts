import { NextResponse } from 'next/server';
import { config } from '../../../lib/config';

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

export async function GET() {
  try {
    // Try to get data from the core API first
    try {
      const response = await fetch(`${config.coreApi.url}/api/stablecoins`, {
        signal: AbortSignal.timeout(config.coreApi.timeout),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          console.log('Successfully fetched data from core API');
          return NextResponse.json(data);
        }
      }
    } catch (apiError) {
      console.warn('Core API failed, using mock data:', apiError);
    }

    // Fall back to mock data if core API is not available
    console.log('Using mock data for stablecoins');
    return NextResponse.json(mockStablecoins);
  } catch (error: unknown) {
    console.error('Error fetching stablecoins:', error);
    // Return mock data as fallback even if there's an error
    return NextResponse.json(mockStablecoins);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Try to save to core API first
    try {
      const response = await fetch(`${config.coreApi.url}/api/stablecoins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(config.coreApi.timeout),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Successfully created stablecoin via core API');
        return NextResponse.json(result, { status: 201 });
      }
    } catch (apiError) {
      console.warn('Core API failed, using mock storage:', apiError);
    }

    // Fall back to mock storage if core API is not available
    const newStablecoin = {
      ...body,
      id: mockStablecoins.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock data (in a real app, this would be temporary)
    mockStablecoins.push(newStablecoin);

    console.log('Created stablecoin using mock storage:', newStablecoin);
    return NextResponse.json(newStablecoin, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating stablecoin:', error);
    return NextResponse.json({ error: 'Failed to create stablecoin' }, { status: 500 });
  }
}
