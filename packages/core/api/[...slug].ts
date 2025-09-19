// Vercel serverless function for stablecoin API
import dotenv from 'dotenv';
import { supabase } from '../src/db/index.js';
import { createBirdeyeClient } from '../src/services/birdeye-client.js';
import { currencyClient } from '../src/services/currency-client.js';

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
    pegPrice: dbData.peg_price,
    pegPriceUpdatedAt: dbData.peg_price_updated_at,
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

    // Get stablecoin by slug - handle both /api/stablecoins/slug/usdc and /api/stablecoins/slug/usdc/
    if (pathname.match(/^\/api\/stablecoins\/slug\/[^/]+\/?$/)) {
      const slug = pathname.split('/').filter(Boolean).pop();
      const { data, error } = await supabase
        .from('stablecoins')
        .select('*')
        .eq('slug', slug)
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
        stablecoinCount,
        dominantStablecoin,
        dominantStablecoinShare,
        percentageOfSolanaVolume,
        yearOverYearGrowth,
      });
    }

    // Chart data endpoints
    if (
      pathname.startsWith('/api/stablecoins/') &&
      pathname.includes('/charts/supply') &&
      req.method === 'GET'
    ) {
      const stablecoinIdMatch = pathname.match(/\/api\/stablecoins\/(\d+)\/charts\/supply/);
      const isAggregated = pathname.includes('/charts/supply/aggregated');

      if (stablecoinIdMatch || isAggregated) {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const range = url.searchParams.get('range') || '1M';

        // Helper function to get date from range
        const getDateFromRange = (range: string): string => {
          const today = new Date();
          switch (range) {
            case '1M':
              return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
            case '1Q':
              return new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
            case '1Y':
              return new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
            case 'ALL':
            default:
              return '2024-01-01';
          }
        };

        if (isAggregated) {
          // Get the latest data date first to determine the actual end date
          const { data: latestData, error: latestError } = await supabase
            .from('stablecoin_supply_history')
            .select('date')
            .order('date', { ascending: false })
            .limit(1);

          if (latestError) {
            return res.status(500).json({ error: 'Failed to fetch latest data date' });
          }

          const latestDate = latestData && latestData.length > 0 ? latestData[0].date : new Date().toISOString().split('T')[0];
          
          // Calculate the actual start date based on the latest available data
          const endDate = new Date(latestDate);
          const startDate = new Date(endDate);
          
          switch (range) {
            case '1M':
              startDate.setMonth(startDate.getMonth() - 1);
              break;
            case '1Q':
              startDate.setMonth(startDate.getMonth() - 3);
              break;
            case '1Y':
              startDate.setFullYear(startDate.getFullYear() - 1);
              break;
            case 'ALL':
              startDate.setFullYear(2024, 0, 1); // January 1, 2024
              break;
          }

          // Get all stablecoins to check for complete data
          const { data: stablecoins, error: stablecoinsError } = await supabase
            .from('stablecoins')
            .select('id');

          if (stablecoinsError) {
            return res.status(500).json({ error: 'Failed to fetch stablecoins' });
          }

          const totalStablecoins = stablecoins.length;

          // Get aggregated supply data by date within the calculated range
          const { data, error } = await supabase
            .from('stablecoin_supply_history')
            .select('date, total_supply, stablecoin_id')
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', latestDate)
            .order('date', { ascending: true });

          if (error) {
            return res.status(500).json({ error: 'Failed to fetch aggregated supply data' });
          }

          // Group by date and check for complete data
          const dateGroups: Record<string, { totalSupply: number; stablecoinCount: number }> = {};
          
          data.forEach((record: { date: string; total_supply: string | number; stablecoin_id: number }) => {
            const date = record.date;
            if (!dateGroups[date]) {
              dateGroups[date] = { totalSupply: 0, stablecoinCount: 0 };
            }
            dateGroups[date].totalSupply += parseFloat(String(record.total_supply));
            dateGroups[date].stablecoinCount += 1;
          });

          // Filter out dates that don't have data for all stablecoins
          const filteredData: Record<string, number> = {};
          
          for (const [date, group] of Object.entries(dateGroups)) {
            if (group.stablecoinCount === totalStablecoins) {
              filteredData[date] = group.totalSupply;
            }
          }

          // Transform to TradingView format
          const chartData = Object.entries(filteredData).map(([date, totalSupply]) => ({
            time: date,
            value: totalSupply,
          }));

          return res.status(200).json({
            data: chartData,
            range,
            count: chartData.length,
          });
        } else {
          // Get specific stablecoin data
          const stablecoinId = parseInt(stablecoinIdMatch![1]);

          const { data, error } = await supabase
            .from('stablecoin_supply_history')
            .select('date, total_supply, holders_count')
            .eq('stablecoin_id', stablecoinId)
            .gte('date', getDateFromRange(range))
            .order('date', { ascending: true });

          if (error) {
            return res.status(500).json({ error: 'Failed to fetch supply chart data' });
          }

          // Transform data for TradingView format
          const chartData = data.map((record: { date: string; total_supply: string | number }) => ({
            time: record.date,
            value: parseFloat(String(record.total_supply)),
          }));

          return res.status(200).json({
            data: chartData,
            range,
            stablecoinId,
            count: chartData.length,
          });
        }
      }
    }

    // Chart data endpoints for Daily Active Users
    console.log('Checking DAU route:', pathname, req.method);
    if (
      pathname.startsWith('/api/stablecoins/') &&
      pathname.includes('/charts/dau') &&
      req.method === 'GET'
    ) {
      console.log('DAU route matched!');
      const stablecoinIdMatch = pathname.match(/\/api\/stablecoins\/(\d+)\/charts\/dau/);
      const isAggregated = pathname.includes('/charts/dau/aggregated');

      if (stablecoinIdMatch || isAggregated) {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const range = url.searchParams.get('range') || '1M';

        // Helper function to get date from range
        const getDateFromRange = (range: string): string => {
          const today = new Date();
          switch (range) {
            case '1M':
              return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
            case '1Q':
              return new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
            case '1Y':
              return new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
            case 'ALL':
            default:
              return '2024-01-01';
          }
        };

        if (isAggregated) {
          // Get the latest data date first to determine the actual end date
          const { data: latestData, error: latestError } = await supabase
            .from('stablecoin_supply_history')
            .select('date')
            .order('date', { ascending: false })
            .limit(1);

          if (latestError) {
            return res.status(500).json({ error: 'Failed to fetch latest data date' });
          }

          const latestDate = latestData && latestData.length > 0 ? latestData[0].date : new Date().toISOString().split('T')[0];
          
          // Calculate the actual start date based on the latest available data
          const endDate = new Date(latestDate);
          const startDate = new Date(endDate);
          
          switch (range) {
            case '1M':
              startDate.setMonth(startDate.getMonth() - 1);
              break;
            case '1Q':
              startDate.setMonth(startDate.getMonth() - 3);
              break;
            case '1Y':
              startDate.setFullYear(startDate.getFullYear() - 1);
              break;
            case 'ALL':
              startDate.setFullYear(2024, 0, 1); // January 1, 2024
              break;
          }

          // Get all stablecoins to check for complete data
          const { data: stablecoins, error: stablecoinsError } = await supabase
            .from('stablecoins')
            .select('id');

          if (stablecoinsError) {
            return res.status(500).json({ error: 'Failed to fetch stablecoins' });
          }

          const totalStablecoins = stablecoins.length;

          // Get aggregated DAU data by date within the calculated range
          const { data, error } = await supabase
            .from('stablecoin_supply_history')
            .select('date, holders_count, stablecoin_id')
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', latestDate)
            .order('date', { ascending: true });

          if (error) {
            return res.status(500).json({ error: 'Failed to fetch aggregated DAU data' });
          }

          // Group by date and check for complete data
          const dateGroups: Record<string, { totalDAU: number; stablecoinCount: number }> = {};
          
          data.forEach((record: { date: string; holders_count: string | number; stablecoin_id: number }) => {
            const date = record.date;
            if (!dateGroups[date]) {
              dateGroups[date] = { totalDAU: 0, stablecoinCount: 0 };
            }
            dateGroups[date].totalDAU += parseFloat(String(record.holders_count));
            dateGroups[date].stablecoinCount += 1;
          });

          // Filter out dates that don't have data for all stablecoins
          const filteredData: Record<string, number> = {};
          
          for (const [date, group] of Object.entries(dateGroups)) {
            if (group.stablecoinCount === totalStablecoins) {
              filteredData[date] = group.totalDAU;
            }
          }

          // Transform to TradingView format
          const chartData = Object.entries(filteredData).map(([date, totalDAU]) => ({
            time: date,
            value: totalDAU,
          }));

          return res.status(200).json({
            data: chartData,
            range,
            count: chartData.length,
          });
        } else {
          // Get specific stablecoin DAU data
          const stablecoinId = parseInt(stablecoinIdMatch![1]);

          const { data, error } = await supabase
            .from('stablecoin_supply_history')
            .select('date, holders_count')
            .eq('stablecoin_id', stablecoinId)
            .gte('date', getDateFromRange(range))
            .order('date', { ascending: true });

          if (error) {
            return res.status(500).json({ error: 'Failed to fetch DAU chart data' });
          }

          // Transform data for TradingView format
          const chartData = data.map(
            (record: { date: string; holders_count: string | number }) => ({
              time: record.date,
              value: parseFloat(String(record.holders_count)),
            })
          );

          return res.status(200).json({
            data: chartData,
            range,
            stablecoinId,
            count: chartData.length,
          });
        }
      }
    }

    // GET /api/latest-data-date - Get the most recent data point date
    if (pathname === '/api/latest-data-date' && req.method === 'GET') {
      try {
        const { data, error } = await supabase
          .from('stablecoin_supply_history')
          .select('date')
          .order('date', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching latest data date:', error);
          return res.status(500).json({ error: 'Failed to fetch latest data date' });
        }

        const latestDate = data && data.length > 0 ? data[0].date : null;

        return res.status(200).json({
          latestDataDate: latestDate,
          formattedDate: latestDate
            ? new Date(latestDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'No data available',
        });
      } catch (error) {
        console.error('Error in latest data date endpoint:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // GET /api/stablecoins/:id/price - Get live price for a specific stablecoin
    const priceMatch = pathname.match(/^\/api\/stablecoins\/(\d+)\/price$/);
    if (priceMatch && req.method === 'GET') {
      try {
        const stablecoinId = parseInt(priceMatch[1]);

        if (isNaN(stablecoinId)) {
          return res.status(400).json({ error: 'Invalid stablecoin ID' });
        }

        // Get stablecoin data
        const { data: stablecoin, error: stablecoinError } = await supabase
          .from('stablecoins')
          .select('id, token_address, name, token')
          .eq('id', stablecoinId)
          .single();

        if (stablecoinError || !stablecoin) {
          return res.status(404).json({ error: 'Stablecoin not found' });
        }

        if (!stablecoin.token_address) {
          return res.status(400).json({ error: 'Token address not available' });
        }

        // Fetch live price from Birdeye
        const birdeye = createBirdeyeClient();
        const priceData = await birdeye.getTokenPrice(stablecoin.token_address);

        if (!priceData) {
          return res.status(200).json({
            stablecoinId,
            tokenAddress: stablecoin.token_address,
            name: stablecoin.name,
            token: stablecoin.token,
            price: null,
            priceChange24h: null,
            lastUpdated: null,
            updateUnixTime: null,
            error: 'Price data not available',
          });
        }

        return res.status(200).json({
          stablecoinId,
          tokenAddress: stablecoin.token_address,
          name: stablecoin.name,
          token: stablecoin.token,
          price: priceData.price,
          priceChange24h: priceData.priceChange24h,
          lastUpdated: priceData.lastUpdated,
          updateUnixTime: priceData.updateUnixTime,
        });
      } catch (error) {
        console.error('Error fetching stablecoin price:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // GET /api/stablecoins/prices - Get live prices for all stablecoins
    if (pathname === '/api/stablecoins/prices' && req.method === 'GET') {
      try {
        // Get all stablecoins with token addresses
        const { data: stablecoins, error } = await supabase
          .from('stablecoins')
          .select('id, token_address, name, token')
          .not('token_address', 'is', null);

        if (error) {
          console.error('Error fetching stablecoins:', error);
          return res.status(500).json({ error: 'Failed to fetch stablecoins' });
        }

        if (!stablecoins || stablecoins.length === 0) {
          return res.status(200).json({ prices: [] });
        }

        // Fetch prices for all stablecoins
        const birdeye = createBirdeyeClient();
        const tokenAddresses = stablecoins.map(s => s.token_address).filter(Boolean) as string[];
        const priceMap = await birdeye.getMultipleTokenPrices(tokenAddresses);

        // Combine stablecoin data with price data
        const prices = stablecoins.map(stablecoin => {
          const priceData = priceMap.get(stablecoin.token_address);
          return {
            stablecoinId: stablecoin.id,
            tokenAddress: stablecoin.token_address,
            name: stablecoin.name,
            token: stablecoin.token,
            price: priceData?.price || null,
            priceChange24h: priceData?.priceChange24h || null,
            lastUpdated: priceData?.lastUpdated || null,
            updateUnixTime: priceData?.updateUnixTime || null,
          };
        });

        return res.status(200).json({ prices });
      } catch (error) {
        console.error('Error fetching stablecoin prices:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // Update peg prices for all stablecoins
    if (pathname === '/api/stablecoins/update-peg-prices' && req.method === 'POST') {
      try {
        // Use the imported currencyClient directly

        // Get all stablecoins with their pegged assets
        const { data: stablecoins, error: fetchError } = await supabase
          .from('stablecoins')
          .select('id, pegged_asset')
          .not('pegged_asset', 'is', null);

        if (fetchError) {
          throw new Error(`Failed to fetch stablecoins: ${fetchError.message}`);
        }

        if (!stablecoins || stablecoins.length === 0) {
          return res.json({
            message: 'No stablecoins found',
            updated: 0,
            errors: [],
          });
        }

        // Get unique currency codes
        const currencyCodes = [...new Set(stablecoins.map(s => s.pegged_asset).filter(Boolean))];
        console.log(`Updating peg prices for currencies: ${currencyCodes.join(', ')}`);

        // Process each currency individually to get proper exchange rates
        const updatePromises = stablecoins.map(async stablecoin => {
          const currencyCode = stablecoin.pegged_asset;
          if (!currencyCode) return null;

          try {
            const rate = await currencyClient.getExchangeRate(currencyCode, 'USD');
            if (rate === null || rate === undefined) {
              console.warn(`No exchange rate found for ${currencyCode}`);
              return { id: stablecoin.id, error: `No exchange rate found for ${currencyCode}` };
            }

            // Update the stablecoin with peg price
            const { error: updateError } = await supabase
              .from('stablecoins')
              .update({
                peg_price: rate,
                peg_price_updated_at: new Date().toISOString(),
              })
              .eq('id', stablecoin.id);

            if (updateError) {
              console.error(
                `Failed to update peg price for stablecoin ${stablecoin.id}:`,
                updateError
              );
              return { id: stablecoin.id, error: updateError.message };
            }

            return { id: stablecoin.id, pegPrice: rate, currency: currencyCode };
          } catch (error) {
            console.error(`Error getting rate for ${currencyCode}:`, error);
            return {
              id: stablecoin.id,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        });

        const results = await Promise.all(updatePromises);
        const successful = results.filter(r => r && !r.error);
        const errors = results.filter(r => r && r.error);

        console.log(`Updated peg prices for ${successful.length} stablecoins`);

        return res.json({
          message: `Updated peg prices for ${successful.length} stablecoins`,
          updated: successful.length,
          errors: errors,
          results: successful,
        });
      } catch (error) {
        console.error('Error updating peg prices:', error);
        return res.status(500).json({
          error: 'Failed to update peg prices',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Get peg price for a specific stablecoin
    if (
      pathname.startsWith('/api/stablecoins/') &&
      pathname.endsWith('/peg-price') &&
      req.method === 'GET'
    ) {
      try {
        const id = pathname.split('/')[3];

        const { data: stablecoin, error } = await supabase
          .from('stablecoins')
          .select('id, pegged_asset, peg_price, peg_price_updated_at')
          .eq('id', parseInt(id))
          .single();

        if (error) {
          return res.status(404).json({ error: 'Stablecoin not found' });
        }

        if (!stablecoin.pegged_asset) {
          return res.json({
            stablecoinId: stablecoin.id,
            peggedAsset: null,
            pegPrice: null,
            pegPriceUpdatedAt: null,
            message: 'No pegged asset specified',
          });
        }

        return res.json({
          stablecoinId: stablecoin.id,
          peggedAsset: stablecoin.pegged_asset,
          pegPrice: stablecoin.peg_price,
          pegPriceUpdatedAt: stablecoin.peg_price_updated_at,
        });
      } catch (error) {
        console.error('Error fetching peg price:', error);
        return res.status(500).json({
          error: 'Failed to fetch peg price',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // If no route matches, return 404
    return res.status(404).json({ error: 'Route not found', pathname });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
