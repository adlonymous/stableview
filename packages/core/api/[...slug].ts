// Vercel serverless function for stablecoin API
import dotenv from 'dotenv';
import { supabase } from '../src/db/index.js';

// Load environment variables
dotenv.config();

// Type definitions for Vercel (will be available at runtime)
interface VercelRequest {
  url?: string;
  method?: string;
  headers: Record<string, string>;
}

interface VercelResponse {
  setHeader: (name: string, value: string) => VercelResponse;
  status: (code: number) => VercelResponse;
  json: (data: any) => VercelResponse;
  end: () => VercelResponse;
}

// Helper function to transform database fields from snake_case to camelCase
function transformStablecoinData(dbData: any) {
  return {
    id: dbData.id,
    slug: dbData.slug,
    name: dbData.name,
    token: dbData.token,
    peggedAsset: dbData.pegged_asset,
    issuer: dbData.issuer,
    tokenProgram: dbData.token_program,
    tokenAddress: dbData.token_address,
    mintAuthority: dbData.mint_authority,
    bridgingMechanisms: dbData.bridging_mechanisms,
    networksLiveOn: dbData.networks_live_on,
    redemptionMechanisms: dbData.redemption_mechanisms,
    solscanLink: dbData.solscan_link,
    artemisLink: dbData.artemis_link,
    assetReservesLink: dbData.asset_reserves_link,
    transactionVolume30d: dbData.transaction_volume_30d,
    transactionCountDaily: dbData.transaction_count_daily,
    totalSupply: dbData.total_supply,
    dailyActiveUsers: dbData.daily_active_users,
    price: dbData.price,
    marketCap: parseFloat(dbData.price || '0') * parseFloat(dbData.total_supply || '0'),
    executiveSummary: dbData.executive_summary,
    logoUrl: dbData.logo_url,
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at,
  };
}

// Export the handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { pathname } = new URL(req.url || '', `https://${req.headers.host}`);

    // Health check endpoint
    if (pathname === '/api/health') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'stableview-core-api',
      });
    }

    // Health check endpoint (without /api prefix for compatibility)
    if (pathname === '/health') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'stableview-core-api',
      });
    }

    // Get all stablecoins
    if (pathname === '/api/stablecoins') {
      const { data, error } = await supabase
        .from('stablecoins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData = (data || []).map(transformStablecoinData);
      return res.status(200).json(transformedData);
    }

    // Get stablecoin by ID
    if (pathname.match(/^\/api\/stablecoins\/\d+$/)) {
      const id = pathname.split('/').pop();
      const { data, error } = await supabase
        .from('stablecoins')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return res.status(404).json({ error: 'Stablecoin not found' });
      }

      const transformedData = transformStablecoinData(data);
      return res.status(200).json(transformedData);
    }

    // Get stablecoins by currency peg
    if (pathname === '/api/stablecoins/by-currency-peg') {
      const { data, error } = await supabase
        .from('stablecoins')
        .select('pegged_asset, name, slug, token, total_supply, transaction_volume_30d')
        .order('pegged_asset')
        .order('name');

      if (error) {
        throw error;
      }

      const grouped = (data || []).reduce((acc: any, coin: any) => {
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
      }, {});

      return res.status(200).json(grouped);
    }

    // If no route matches, return 404
    return res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 