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
  json: (data: unknown) => VercelResponse;
  end: () => VercelResponse;
}

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
      parseFloat(String(dbData.price || '0')) * parseFloat(String(dbData.total_supply || '0')),
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
    // Extract pathname from URL
    const url = req.url || '';
    const pathname = url.split('?')[0]; // Remove query parameters

    // Health check endpoints
    if (pathname === '/health' || pathname === '/api/health') {
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

    // Get stablecoin by ID - handle both /api/stablecoins/1 and /api/stablecoins/1/
    if (pathname.match(/^\/api\/stablecoins\/\d+\/?$/)) {
      const id = pathname.split('/').filter(Boolean).pop();
      const { data, error } = await supabase.from('stablecoins').select('*').eq('id', id).single();

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

      interface CurrencyPegStablecoin {
        name: string;
        slug: string;
        token: string;
        totalSupply: string | null;
        transactionVolume30d: string | null;
      }

      interface GroupedStablecoins {
        [currency: string]: CurrencyPegStablecoin[];
      }

      const grouped = (data || []).reduce(
        (acc: GroupedStablecoins, coin: Record<string, unknown>) => {
          const peg = coin.pegged_asset as string;
          if (!acc[peg]) {
            acc[peg] = [];
          }
          acc[peg].push({
            name: coin.name as string,
            slug: coin.slug as string,
            token: coin.token as string,
            totalSupply: coin.total_supply as string | null,
            transactionVolume30d: coin.transaction_volume_30d as string | null,
          });
          return acc;
        },
        {}
      );

      return res.status(200).json(grouped);
    }

    // Get dashboard statistics
    if (pathname === '/api/dashboard/stats') {
      const { data: stablecoins, error } = await supabase.from('stablecoins').select('*');

      if (error) {
        throw error;
      }

      if (!stablecoins || stablecoins.length === 0) {
        return res.status(200).json({
          totalMarketCap: 0,
          totalSupply: '0',
          totalTransactionVolume: {
            daily: 0,
            monthly: 0,
            yearly: 0,
          },
          totalDailyTransactions: '0',
          totalDailyActiveUsers: '0',
          stablecoinCount: 0,
          dominantStablecoin: 'N/A',
          dominantStablecoinShare: 0,
          percentageOfSolanaVolume: 0,
          yearOverYearGrowth: 0,
        });
      }

      // Calculate aggregated statistics
      const totalSupply = stablecoins.reduce((sum, coin) => {
        return sum + parseFloat(coin.total_supply || '0');
      }, 0);

      const totalTransactionVolume = stablecoins.reduce((sum, coin) => {
        return sum + parseFloat(coin.transaction_volume_30d || '0');
      }, 0);

      const totalDailyTransactions = stablecoins.reduce((sum, coin) => {
        return sum + parseFloat(coin.transaction_count_daily || '0');
      }, 0);

      const totalDailyActiveUsers = stablecoins.reduce((sum, coin) => {
        return sum + parseFloat(coin.daily_active_users || '0');
      }, 0);

      const stablecoinCount = stablecoins.length;

      // Calculate additional metrics
      const totalMarketCap = totalSupply; // Assuming price is $1 for stablecoins
      const percentageOfSolanaVolume = 42; // This would need external data to calculate accurately
      const yearOverYearGrowth = 35; // This would need historical data to calculate accurately

      // Find dominant stablecoin (highest supply)
      const sortedBySupply = stablecoins.sort((a, b) => {
        return parseFloat(b.total_supply || '0') - parseFloat(a.total_supply || '0');
      });

      const dominantStablecoin = sortedBySupply.length > 0 ? sortedBySupply[0].name : 'N/A';
      const dominantStablecoinShare =
        sortedBySupply.length > 0 && totalSupply > 0
          ? Math.round((parseFloat(sortedBySupply[0].total_supply || '0') / totalSupply) * 100)
          : 0;

      // Calculate daily volume (assuming 30-day volume divided by 30)
      const dailyVolume = totalTransactionVolume / 30;

      return res.status(200).json({
        totalMarketCap,
        totalSupply: totalSupply.toString(),
        totalTransactionVolume: {
          daily: dailyVolume,
          monthly: totalTransactionVolume,
          yearly: totalTransactionVolume * 12, // Rough estimate
        },
        totalDailyTransactions: totalDailyTransactions.toString(),
        totalDailyActiveUsers: totalDailyActiveUsers.toString(),
        stablecoinCount,
        dominantStablecoin,
        dominantStablecoinShare,
        percentageOfSolanaVolume,
        yearOverYearGrowth,
      });
    }

    // If no route matches, return 404
    return res.status(404).json({ error: 'Route not found', pathname });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
