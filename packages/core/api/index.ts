import { createClient } from '@supabase/supabase-js';

// Type definitions for Vercel serverless functions
interface VercelRequest {
  method: string;
  url: string;
  query: Record<string, string>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to transform database fields from snake_case to camelCase
function transformStablecoinData(dbData: Record<string, unknown>) {
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
    marketCap:
      parseFloat((dbData.price as string) || '0') *
      parseFloat((dbData.total_supply as string) || '0'),
    executiveSummary: dbData.executive_summary,
    logoUrl: dbData.logo_url,
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at,
  };
}

// Helper function to set CORS headers
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Health check endpoint
async function handleHealth(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'stableview-core-api',
  });
}

// Get all stablecoins
async function handleGetStablecoins(req: VercelRequest, res: VercelResponse) {
  try {
    setCorsHeaders(res);

    const { data, error } = await supabase
      .from('stablecoins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const transformedData = (data || []).map(transformStablecoinData);
    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoins:', error);
    res.status(500).json({ error: 'Failed to fetch stablecoins' });
  }
}

// Get stablecoin by ID
async function handleGetStablecoinById(req: VercelRequest, res: VercelResponse) {
  try {
    setCorsHeaders(res);

    const { id } = req.query;
    const { data, error } = await supabase.from('stablecoins').select('*').eq('id', id).single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ error: 'Stablecoin not found' });
      return;
    }

    const transformedData = transformStablecoinData(data);
    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoin:', error);
    res.status(500).json({ error: 'Failed to fetch stablecoin' });
  }
}

// Get stablecoins by currency peg
async function handleGetStablecoinsByCurrencyPeg(req: VercelRequest, res: VercelResponse) {
  try {
    setCorsHeaders(res);

    const { data, error } = await supabase
      .from('stablecoins')
      .select('pegged_asset, name, slug, token, total_supply, transaction_volume_30d')
      .order('pegged_asset')
      .order('name');

    if (error) {
      throw error;
    }

    const grouped = (data || []).reduce(
      (acc: Record<string, unknown[]>, coin: Record<string, unknown>) => {
        const peg = coin.pegged_asset as string;
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

    res.status(200).json(grouped);
  } catch (error) {
    console.error('Error fetching stablecoins by currency peg:', error);
    res.status(500).json({ error: 'Failed to fetch stablecoins by currency peg' });
  }
}

// Main handler function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(200).end();
    return;
  }

  // Route based on URL
  if (url === '/api/health') {
    return handleHealth(req, res);
  }

  if (url === '/api/stablecoins') {
    return handleGetStablecoins(req, res);
  }

  if (url && url.startsWith('/api/stablecoins/') && url !== '/api/stablecoins/by-currency-peg') {
    return handleGetStablecoinById(req, res);
  }

  if (url === '/api/stablecoins/by-currency-peg') {
    return handleGetStablecoinsByCurrencyPeg(req, res);
  }

  // 404 for unknown routes
  res.status(404).json({ error: 'Not found' });
}
