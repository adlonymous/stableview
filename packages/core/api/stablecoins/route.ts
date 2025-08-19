import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '../../src/db/index.js';
import { CreateStablecoinRequest, DatabaseStablecoin } from '../../src/types';

export async function GET() {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.from('stablecoins').select('*').order('name');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch stablecoins' }, { status: 500 });
    }

    // Transform data from snake_case to camelCase
    const transformedData = data?.map((coin: DatabaseStablecoin) => ({
      id: coin.id,
      slug: coin.slug,
      name: coin.name,
      token: coin.token,
      peggedAsset: coin.pegged_asset,
      issuer: coin.issuer,
      tokenProgram: coin.token_program,
      tokenAddress: coin.token_address,
      mintAuthority: coin.mint_authority,
      bridgingMechanisms: coin.bridging_mechanisms,
      networksLiveOn: coin.networks_live_on,
      redemptionMechanisms: coin.redemption_mechanisms,
      solscanLink: coin.solscan_link,
      artemisLink: coin.artemis_link,
      assetReservesLink: coin.asset_reserves_link,
      transactionVolume30d: coin.transaction_volume_30d,
      transactionCountDaily: coin.transaction_count_daily,
      totalSupply: coin.total_supply,
      dailyActiveUsers: coin.daily_active_users,
      price: coin.price,
      executiveSummary: coin.executive_summary,
      logoUrl: coin.logo_url,
      createdAt: coin.created_at,
      updatedAt: coin.updated_at,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateStablecoinRequest;
    const supabase = createSupabaseClient();

    // Transform camelCase to snake_case for database
    const dbData = {
      slug: body.slug,
      name: body.name,
      token: body.token,
      pegged_asset: body.peggedAsset,
      issuer: body.issuer,
      token_program: body.tokenProgram,
      token_address: body.tokenAddress,
      mint_authority: body.mintAuthority,
      bridging_mechanisms: body.bridgingMechanisms,
      networks_live_on: body.networksLiveOn,
      redemption_mechanisms: body.redemptionMechanisms,
      solscan_link: body.solscanLink,
      artemis_link: body.artemisLink,
      asset_reserves_link: body.assetReservesLink,
      transaction_volume_30d: body.transactionVolume30d,
      transaction_count_daily: body.transactionCountDaily,
      total_supply: body.totalSupply,
      daily_active_users: body.dailyActiveUsers,
      price: body.price,
      executive_summary: body.executiveSummary,
      logo_url: body.logoUrl,
    };

    const { data, error } = await supabase.from('stablecoins').insert([dbData]).select().single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create stablecoin' }, { status: 500 });
    }

    // Transform response back to camelCase
    const transformedData = {
      id: data.id,
      slug: data.slug,
      name: data.name,
      token: data.token,
      peggedAsset: data.pegged_asset,
      issuer: data.issuer,
      tokenProgram: data.token_program,
      tokenAddress: data.token_address,
      mintAuthority: data.mint_authority,
      bridgingMechanisms: data.bridging_mechanisms,
      networksLiveOn: data.networks_live_on,
      redemptionMechanisms: data.redemption_mechanisms,
      solscanLink: data.solscan_link,
      artemisLink: data.artemis_link,
      assetReservesLink: data.asset_reserves_link,
      transactionVolume30d: data.transaction_volume_30d,
      transactionCountDaily: data.transaction_count_daily,
      totalSupply: data.total_supply,
      dailyActiveUsers: data.daily_active_users,
      price: data.price,
      executiveSummary: data.executive_summary,
      logoUrl: data.logo_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(transformedData, { status: 201 });
  } catch (error) {
    console.error('Error creating stablecoin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
