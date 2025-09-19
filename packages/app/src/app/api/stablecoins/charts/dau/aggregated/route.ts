import { NextRequest, NextResponse } from 'next/server';

const CORE_API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '1M';

    const response = await fetch(
      `${CORE_API_BASE_URL}/api/stablecoins/charts/dau/aggregated?range=${range}`
    );

    if (!response.ok) {
      throw new Error(`Core API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching DAU aggregated chart data:', error);

    // Return error response
    return NextResponse.json({ error: 'Failed to fetch DAU chart data' }, { status: 500 });
  }
}
