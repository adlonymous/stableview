import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '../../../src/db/index.js';
import { UpdateStablecoinRequest, DatabaseStablecoin } from '../../../src/types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase.from('stablecoins').select('*').eq('id', id).single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Stablecoin not found' }, { status: 404 });
    }

    // Transform data from snake_case to camelCase
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

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = (await request.json()) as UpdateStablecoinRequest;
    const supabase = createSupabaseClient();

    // Transform camelCase to snake_case for database
    const updateData: Partial<DatabaseStablecoin> = {};
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.token !== undefined) updateData.token = body.token;
    if (body.peggedAsset !== undefined) updateData.pegged_asset = body.peggedAsset;
    if (body.issuer !== undefined) updateData.issuer = body.issuer;
    if (body.tokenProgram !== undefined) updateData.token_program = body.tokenProgram;
    if (body.tokenAddress !== undefined) updateData.token_address = body.tokenAddress;
    if (body.mintAuthority !== undefined) updateData.mint_authority = body.mintAuthority;
    if (body.bridgingMechanisms !== undefined)
      updateData.bridging_mechanisms = body.bridgingMechanisms;
    if (body.networksLiveOn !== undefined) updateData.networks_live_on = body.networksLiveOn;
    if (body.redemptionMechanisms !== undefined)
      updateData.redemption_mechanisms = body.redemptionMechanisms;
    if (body.solscanLink !== undefined) updateData.solscan_link = body.solscanLink;
    if (body.artemisLink !== undefined) updateData.artemis_link = body.artemisLink;
    if (body.assetReservesLink !== undefined)
      updateData.asset_reserves_link = body.assetReservesLink;
    if (body.transactionVolume30d !== undefined)
      updateData.transaction_volume_30d = body.transactionVolume30d;
    if (body.transactionCountDaily !== undefined)
      updateData.transaction_count_daily = body.transactionCountDaily;
    if (body.totalSupply !== undefined) updateData.total_supply = body.totalSupply;
    if (body.dailyActiveUsers !== undefined) updateData.daily_active_users = body.dailyActiveUsers;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.executiveSummary !== undefined) updateData.executive_summary = body.executiveSummary;
    if (body.logoUrl !== undefined) updateData.logo_url = body.logoUrl;

    const { data, error } = await supabase
      .from('stablecoins')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update stablecoin' }, { status: 500 });
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

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error updating stablecoin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const supabase = createSupabaseClient();

    const { error } = await supabase.from('stablecoins').delete().eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete stablecoin' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Stablecoin deleted successfully' });
  } catch (error) {
    console.error('Error deleting stablecoin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
