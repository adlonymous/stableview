import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../../../src/db/index.js';

export async function GET() {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('stablecoins')
      .select('pegged_asset, name, slug, token, total_supply, transaction_volume_30d')
      .order('pegged_asset')
      .order('name');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stablecoins by currency peg' },
        { status: 500 }
      );
    }

    // Group by currency peg
    const grouped = (data || []).reduce(
      (
        acc: Record<
          string,
          Array<{
            name: string;
            slug: string;
            token: string;
            totalSupply: string | null;
            transactionVolume30d: string | null;
          }>
        >,
        coin: {
          pegged_asset: string;
          name: string;
          slug: string;
          token: string;
          total_supply: string | null;
          transaction_volume_30d: string | null;
        }
      ) => {
        const peg = coin.pegged_asset;
        if (!acc[peg]) {
          acc[peg] = [];
        }
        acc[peg].push({
          name: coin.name,
          slug: coin.slug,
          token: coin.token,
          totalSupply: coin.total_supply,
          transactionVolume30d: coin.transaction_volume_30d,
        });
        return acc;
      },
      {}
    );

    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Error fetching stablecoins by currency peg:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
