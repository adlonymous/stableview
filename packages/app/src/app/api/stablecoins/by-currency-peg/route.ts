import { NextResponse } from 'next/server';

const CORE_API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';

export async function GET() {
  try {
    const response = await fetch(`${CORE_API_BASE_URL}/api/stablecoins/by-currency-peg`);

    if (!response.ok) {
      throw new Error(`Core API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stablecoins by currency peg:', error);

    // Return error response
    return NextResponse.json({ error: 'Failed to fetch stablecoin data' }, { status: 500 });
  }
}
