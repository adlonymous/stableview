import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { supabase } from '../db/index.js';
import { priceUpdater } from '../services/price-updater.js';
import { pegPriceUpdater } from '../services/peg-price-updater.js';

// Load environment variables
dotenv.config();

// TypeScript interfaces for request bodies
interface CreateStablecoinBody {
  slug?: string;
  name?: string;
  token?: string;
  peggedAsset?: string;
  issuer?: string;
  tokenProgram?: string;
  tokenAddress?: string;
  mintAuthority?: string;
  bridgingMechanisms?: string[];
  networksLiveOn?: string[];
  redemptionMechanisms?: string[];
  solscanLink?: string;
  artemisLink?: string;
  assetReservesLink?: string;
  transactionVolume30d?: string;
  transactionCountDaily?: string;
  totalSupply?: string;
  dailyActiveUsers?: string;
  price?: string;
  executiveSummary?: string;
  logoUrl?: string;
}

// Database record interface for stablecoins
interface StablecoinDbRecord {
  id: number;
  slug: string;
  name: string;
  token: string;
  pegged_asset: string;
  issuer: string;
  token_program: string;
  token_address: string;
  mint_authority: string;
  bridging_mechanisms: string[];
  networks_live_on: string[];
  redemption_mechanisms: string[];
  solscan_link: string;
  artemis_link: string;
  asset_reserves_link: string;
  transaction_volume_30d: string;
  transaction_count_daily: string;
  total_supply: string;
  daily_active_users: string;
  price: number;
  peg_price?: number;
  peg_price_updated_at?: string;
  executive_summary: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

interface UpdateStablecoinBody {
  slug?: string;
  name?: string;
  token?: string;
  pegged_asset?: string;
  issuer?: string;
  token_program?: string;
  token_address?: string;
  mint_authority?: string;
  bridging_mechanisms?: string[];
  networks_live_on?: string[];
  redemption_mechanisms?: string[];
  solscan_link?: string;
  artemis_link?: string;
  asset_reserves_link?: string;
  transaction_volume_30d?: string;
  transaction_count_daily?: string;
  total_supply?: string;
  daily_active_users?: string;
  price?: string;
  executive_summary?: string;
  logo_url?: string;
}

const fastify = Fastify({
  logger: true,
});

const port = Number(process.env.CORE_API_PORT) || 3004;

// Register CORS plugin
await fastify.register(cors, {
  origin: true,
});

console.log('Supabase client created');

// Helper function to get date from range
function getDateFromRange(range: string): string {
  const today = new Date();
  switch (range) {
    case '1M':
      return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case '1Q':
      return new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case '1Y':
      return new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case 'ALL':
    default:
      return '2024-01-01';
  }
}

// Helper function to transform database fields from snake_case to camelCase
function transformStablecoinData(dbData: StablecoinDbRecord) {
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
    bridgingMechanisms: dbData.bridging_mechanisms || [],
    networksLiveOn: dbData.networks_live_on || [],
    redemptionMechanisms: dbData.redemption_mechanisms || [],
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
    executiveSummary: dbData.executive_summary,
    logoUrl: dbData.logo_url,
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at,
  };
}

// GET /api/stablecoins - Get all stablecoins
fastify.get('/api/stablecoins', async (request, reply) => {
  try {
    const { data, error } = await supabase.from('stablecoins').select('*').order('id');

    if (error) {
      throw error;
    }

    // Transform the data to camelCase for frontend compatibility
    const transformedData = (data || []).map(transformStablecoinData);
    return reply.send(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoins:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoins' });
  }
});

// GET /api/stablecoins/:id - Get stablecoin by ID
fastify.get('/api/stablecoins/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const numericId = Number(id);

    const { data, error } = await supabase
      .from('stablecoins')
      .select('*')
      .eq('id', numericId)
      .single();

    if (error) {
      return reply.status(404).send({ error: 'Not found' });
    }

    // Transform the data to camelCase for frontend compatibility
    const transformedData = transformStablecoinData(data);
    return reply.send(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoin' });
  }
});

// GET /api/stablecoins/slug/:slug - Get stablecoin by slug
fastify.get('/api/stablecoins/slug/:slug', async (request, reply) => {
  try {
    const { slug } = request.params as { slug: string };

    const { data, error } = await supabase
      .from('stablecoins')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      return reply.status(404).send({ error: 'Not found' });
    }

    // Transform the data to camelCase for frontend compatibility
    const transformedData = transformStablecoinData(data);
    return reply.send(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoin by slug:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoin' });
  }
});

// POST /api/stablecoins - Create new stablecoin
fastify.post('/api/stablecoins', async (request, reply) => {
  try {
    const body = request.body as CreateStablecoinBody;

    // Create new stablecoin with generated ID and timestamps
    const newStablecoin = {
      slug: body.slug || '',
      name: body.name || '',
      token: body.token || '',
      pegged_asset: body.peggedAsset || '',
      issuer: body.issuer || '',
      token_program: body.tokenProgram || '',
      token_address: body.tokenAddress || '',
      mint_authority: body.mintAuthority || '',
      bridging_mechanisms: body.bridgingMechanisms || [],
      networks_live_on: body.networksLiveOn || [],
      redemption_mechanisms: body.redemptionMechanisms || [],
      solscan_link: body.solscanLink,
      artemis_link: body.artemisLink,
      asset_reserves_link: body.assetReservesLink,
      transaction_volume_30d: body.transactionVolume30d || '0',
      transaction_count_daily: body.transactionCountDaily || '0',
      total_supply: body.totalSupply || '0',
      daily_active_users: body.dailyActiveUsers || '0',
      price: body.price || '1.00',
      executive_summary: body.executiveSummary,
      logo_url: body.logoUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('stablecoins')
      .insert(newStablecoin)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return reply.status(201).send(data);
  } catch (error) {
    console.error('Error creating stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to create stablecoin' });
  }
});

// PUT /api/stablecoins/:id - Update stablecoin
fastify.put('/api/stablecoins/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const body = request.body as UpdateStablecoinBody;
    const numericId = Number(id);

    const updateData = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('stablecoins')
      .update(updateData)
      .eq('id', numericId)
      .select()
      .single();

    if (error) {
      return reply.status(404).send({ error: 'Stablecoin not found' });
    }

    return reply.send(data);
  } catch (error) {
    console.error('Error updating stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to update stablecoin' });
  }
});

// DELETE /api/stablecoins/:id - Delete stablecoin
fastify.delete('/api/stablecoins/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const numericId = Number(id);

    const { error } = await supabase.from('stablecoins').delete().eq('id', numericId);

    if (error) {
      return reply.status(404).send({ error: 'Stablecoin not found' });
    }

    return reply.send({ message: 'Stablecoin deleted successfully' });
  } catch (error) {
    console.error('Error deleting stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to delete stablecoin' });
  }
});

// GET /api/dashboard/stats - Get aggregated dashboard statistics
fastify.get('/api/dashboard/stats', async (request, reply) => {
  try {
    // Get all stablecoins for calculations
    const { data: stablecoins, error } = await supabase.from('stablecoins').select('*');

    if (error) {
      throw error;
    }

    if (!stablecoins || stablecoins.length === 0) {
      return reply.send({
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

    return reply.send({
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
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return reply.status(500).send({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/stablecoins/by-currency-peg - Get stablecoins grouped by currency peg
fastify.get('/api/stablecoins/by-currency-peg', async (request, reply) => {
  try {
    const { data, error } = await supabase
      .from('stablecoins')
      .select('pegged_asset, name, slug, token, total_supply, transaction_volume_30d')
      .order('pegged_asset')
      .order('name');

    if (error) {
      throw error;
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

    return reply.send(grouped);
  } catch (error) {
    console.error('Error fetching stablecoins by currency peg:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoins by currency peg' });
  }
});

// GET /api/stablecoins/:id/charts/supply - Get supply chart data for a specific stablecoin
fastify.get('/api/stablecoins/:id/charts/supply', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const { range = '1M' } = request.query as { range?: string };

    const stablecoinId = parseInt(id);
    if (isNaN(stablecoinId)) {
      return reply.status(400).send({ error: 'Invalid stablecoin ID' });
    }

    const { data, error } = await supabase
      .from('stablecoin_supply_history')
      .select('date, total_supply, holders_count')
      .eq('stablecoin_id', stablecoinId)
      .gte('date', getDateFromRange(range))
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching supply chart data:', error);
      return reply.status(500).send({ error: 'Failed to fetch supply chart data' });
    }

    // Transform data for TradingView format
    const chartData = data.map((record: { date: string; total_supply: string | number }) => ({
      time: record.date,
      value: parseFloat(String(record.total_supply)),
    }));

    return reply.send({
      data: chartData,
      range,
      stablecoinId,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error in supply chart endpoint:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /api/stablecoins/charts/supply/aggregated - Get aggregated supply data for all stablecoins
fastify.get('/api/stablecoins/charts/supply/aggregated', async (request, reply) => {
  try {
    const { range = '1M' } = request.query as { range?: string };

    // Get the latest data date first to determine the actual end date
    const { data: latestData, error: latestError } = await supabase
      .from('stablecoin_supply_history')
      .select('date')
      .order('date', { ascending: false })
      .limit(1);

    if (latestError) {
      console.error('Error fetching latest data date:', latestError);
      return reply.status(500).send({ error: 'Failed to fetch latest data date' });
    }

    const latestDate =
      latestData && latestData.length > 0
        ? latestData[0].date
        : new Date().toISOString().split('T')[0];

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
      console.error('Error fetching stablecoins:', stablecoinsError);
      return reply.status(500).send({ error: 'Failed to fetch stablecoins' });
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
      console.error('Error fetching aggregated supply data:', error);
      return reply.status(500).send({ error: 'Failed to fetch aggregated supply data' });
    }

    // Group by date and check for complete data
    const dateGroups: Record<string, { totalSupply: number; stablecoinCount: number }> = {};

    data.forEach(
      (record: { date: string; total_supply: string | number; stablecoin_id: number }) => {
        const date = record.date;
        if (!dateGroups[date]) {
          dateGroups[date] = { totalSupply: 0, stablecoinCount: 0 };
        }
        dateGroups[date].totalSupply += parseFloat(String(record.total_supply));
        dateGroups[date].stablecoinCount += 1;
      }
    );

    // Filter data based on range - be more flexible for longer ranges
    const filteredData: Record<string, number> = {};

    for (const [date, group] of Object.entries(dateGroups)) {
      // For 1M and 1Q, require all stablecoins to have data
      // For 1Y and ALL, be more flexible and show data if at least 50% of stablecoins have data
      const requiredStablecoins =
        range === '1Y' || range === 'ALL'
          ? Math.max(1, Math.floor(totalStablecoins * 0.5))
          : totalStablecoins;

      if (group.stablecoinCount >= requiredStablecoins) {
        filteredData[date] = group.totalSupply;
      }
    }

    // Transform to TradingView format
    const chartData = Object.entries(filteredData).map(([date, totalSupply]) => ({
      time: date,
      value: totalSupply,
    }));

    return reply.send({
      data: chartData,
      range,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error in aggregated supply chart endpoint:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /api/stablecoins/:id/charts/dau - Get DAU chart data for a specific stablecoin
fastify.get('/api/stablecoins/:id/charts/dau', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const { range = '1M' } = request.query as { range?: string };

    const stablecoinId = parseInt(id);
    if (isNaN(stablecoinId)) {
      return reply.status(400).send({ error: 'Invalid stablecoin ID' });
    }

    // Get DAU data for the specific stablecoin
    const { data, error } = await supabase
      .from('stablecoin_supply_history')
      .select('date, holders_count')
      .eq('stablecoin_id', stablecoinId)
      .gte('date', getDateFromRange(range))
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching DAU data:', error);
      return reply.status(500).send({ error: 'Failed to fetch DAU data' });
    }

    // Transform to TradingView format
    const chartData = data.map(record => ({
      time: record.date,
      value: parseFloat(String(record.holders_count)),
    }));

    return reply.send({
      data: chartData,
      range,
      stablecoinId,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error in DAU chart endpoint:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /api/stablecoins/charts/dau/aggregated - Get aggregated DAU data for all stablecoins
fastify.get('/api/stablecoins/charts/dau/aggregated', async (request, reply) => {
  try {
    const { range = '1M' } = request.query as { range?: string };

    // Get the latest data date first to determine the actual end date
    const { data: latestData, error: latestError } = await supabase
      .from('stablecoin_supply_history')
      .select('date')
      .order('date', { ascending: false })
      .limit(1);

    if (latestError) {
      console.error('Error fetching latest data date:', latestError);
      return reply.status(500).send({ error: 'Failed to fetch latest data date' });
    }

    const latestDate =
      latestData && latestData.length > 0
        ? latestData[0].date
        : new Date().toISOString().split('T')[0];

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
      console.error('Error fetching stablecoins:', stablecoinsError);
      return reply.status(500).send({ error: 'Failed to fetch stablecoins' });
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
      console.error('Error fetching aggregated DAU data:', error);
      return reply.status(500).send({ error: 'Failed to fetch aggregated DAU data' });
    }

    // Group by date and check for complete data
    const dateGroups: Record<string, { totalDAU: number; stablecoinCount: number }> = {};

    data.forEach(
      (record: { date: string; holders_count: string | number; stablecoin_id: number }) => {
        const date = record.date;
        if (!dateGroups[date]) {
          dateGroups[date] = { totalDAU: 0, stablecoinCount: 0 };
        }
        dateGroups[date].totalDAU += parseFloat(String(record.holders_count));
        dateGroups[date].stablecoinCount += 1;
      }
    );

    // Filter data based on range - be more flexible for longer ranges
    const filteredData: Record<string, number> = {};

    for (const [date, group] of Object.entries(dateGroups)) {
      // For 1M and 1Q, require all stablecoins to have data
      // For 1Y and ALL, be more flexible and show data if at least 50% of stablecoins have data
      const requiredStablecoins =
        range === '1Y' || range === 'ALL'
          ? Math.max(1, Math.floor(totalStablecoins * 0.5))
          : totalStablecoins;

      if (group.stablecoinCount >= requiredStablecoins) {
        filteredData[date] = group.totalDAU;
      }
    }

    // Transform to TradingView format
    const chartData = Object.entries(filteredData).map(([date, totalDAU]) => ({
      time: date,
      value: totalDAU,
    }));

    return reply.send({
      data: chartData,
      range,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error in aggregated DAU chart endpoint:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /api/latest-data-date - Get the most recent data point date
fastify.get('/api/latest-data-date', async (request, reply) => {
  try {
    const { data, error } = await supabase
      .from('stablecoin_supply_history')
      .select('date')
      .order('date', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest data date:', error);
      return reply.status(500).send({ error: 'Failed to fetch latest data date' });
    }

    const latestDate = data && data.length > 0 ? data[0].date : null;

    return reply.send({
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
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /api/stablecoins/:id/price - Get price for a specific stablecoin from database
fastify.get('/api/stablecoins/:id/price', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const stablecoinId = parseInt(id);

    if (isNaN(stablecoinId)) {
      return reply.status(400).send({ error: 'Invalid stablecoin ID' });
    }

    // Get stablecoin data
    const { data: stablecoin, error: stablecoinError } = await supabase
      .from('stablecoins')
      .select('id, token_address, name, token, price, updated_at')
      .eq('id', stablecoinId)
      .single();

    if (stablecoinError || !stablecoin) {
      return reply.status(404).send({ error: 'Stablecoin not found' });
    }

    // Check if price is stale (older than 1 hour)
    const isStale =
      !stablecoin.updated_at ||
      Date.now() - new Date(stablecoin.updated_at).getTime() > 60 * 60 * 1000;

    // If price is stale, try to update it
    if (isStale && stablecoin.token_address) {
      console.log(`Price is stale for ${stablecoin.name}, updating...`);
      try {
        await priceUpdater.updateSinglePrice(stablecoinId);
        // Refetch the updated data
        const { data: updatedStablecoin } = await supabase
          .from('stablecoins')
          .select('id, token_address, name, token, price, updated_at')
          .eq('id', stablecoinId)
          .single();

        if (updatedStablecoin) {
          return reply.send({
            stablecoinId: updatedStablecoin.id,
            tokenAddress: updatedStablecoin.token_address,
            name: updatedStablecoin.name,
            token: updatedStablecoin.token,
            price: updatedStablecoin.price || null,
            priceChange24h: null, // We don't store price change in DB yet
            lastUpdated: updatedStablecoin.updated_at,
            updateUnixTime: updatedStablecoin.updated_at
              ? Math.floor(new Date(updatedStablecoin.updated_at).getTime() / 1000)
              : null,
          });
        }
      } catch (updateError) {
        console.error(`Failed to update price for ${stablecoin.name}:`, updateError);
        // Continue with stale data
      }
    }

    return reply.send({
      stablecoinId: stablecoin.id,
      tokenAddress: stablecoin.token_address,
      name: stablecoin.name,
      token: stablecoin.token,
      price: stablecoin.price || null,
      priceChange24h: null, // We don't store price change in DB yet
      lastUpdated: stablecoin.updated_at,
      updateUnixTime: stablecoin.updated_at
        ? Math.floor(new Date(stablecoin.updated_at).getTime() / 1000)
        : null,
    });
  } catch (error) {
    console.error('Error fetching stablecoin price:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /api/stablecoins/prices - Get prices for all stablecoins from database
fastify.get('/api/stablecoins/prices', async (request, reply) => {
  try {
    // Get all stablecoins with prices from database
    const { data: stablecoins, error } = await supabase
      .from('stablecoins')
      .select('id, token_address, name, token, price, updated_at')
      .order('id');

    if (error) {
      console.error('Error fetching stablecoins:', error);
      return reply.status(500).send({ error: 'Failed to fetch stablecoins' });
    }

    if (!stablecoins || stablecoins.length === 0) {
      return reply.send({ prices: [] });
    }

    // Check if any prices are stale and update them if needed
    const staleStablecoins = stablecoins.filter(
      coin => !coin.updated_at || Date.now() - new Date(coin.updated_at).getTime() > 60 * 60 * 1000
    );

    if (staleStablecoins.length > 0) {
      console.log(`Found ${staleStablecoins.length} stale prices, updating...`);
      try {
        await priceUpdater.updateAllPrices();
        // Refetch updated data
        const { data: updatedStablecoins } = await supabase
          .from('stablecoins')
          .select('id, token_address, name, token, price, updated_at')
          .order('id');

        if (updatedStablecoins) {
          const prices = updatedStablecoins.map(stablecoin => ({
            stablecoinId: stablecoin.id,
            tokenAddress: stablecoin.token_address,
            name: stablecoin.name,
            token: stablecoin.token,
            price: stablecoin.price || null,
            priceChange24h: null, // We don't store price change in DB yet
            lastUpdated: stablecoin.updated_at,
            updateUnixTime: stablecoin.updated_at
              ? Math.floor(new Date(stablecoin.updated_at).getTime() / 1000)
              : null,
          }));
          return reply.send({ prices });
        }
      } catch (updateError) {
        console.error('Failed to update prices:', updateError);
        // Continue with existing data
      }
    }

    // Return current prices from database
    const prices = stablecoins.map(stablecoin => ({
      stablecoinId: stablecoin.id,
      tokenAddress: stablecoin.token_address,
      name: stablecoin.name,
      token: stablecoin.token,
      price: stablecoin.price || null,
      priceChange24h: null, // We don't store price change in DB yet
      lastUpdated: stablecoin.updated_at,
      updateUnixTime: stablecoin.updated_at
        ? Math.floor(new Date(stablecoin.updated_at).getTime() / 1000)
        : null,
    }));

    return reply.send({ prices });
  } catch (error) {
    console.error('Error fetching stablecoin prices:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// POST /api/stablecoins/update-prices - Manually trigger price update for all stablecoins
fastify.post('/api/stablecoins/update-prices', async (request, reply) => {
  try {
    console.log('Manual price update triggered');
    const results = await priceUpdater.updateAllPrices();

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return reply.send({
      message: `Price update completed: ${successCount} successful, ${errorCount} failed`,
      total: results.length,
      successful: successCount,
      failed: errorCount,
      results: results,
    });
  } catch (error) {
    console.error('Error in manual price update:', error);
    return reply.status(500).send({
      error: 'Failed to update prices',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/stablecoins/:id/peg-price - Get peg price for a specific stablecoin
fastify.get('/api/stablecoins/:id/peg-price', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const stablecoinId = parseInt(id);

    if (isNaN(stablecoinId)) {
      return reply.status(400).send({ error: 'Invalid stablecoin ID' });
    }

    // Get stablecoin data
    const { data: stablecoin, error: stablecoinError } = await supabase
      .from('stablecoins')
      .select('id, pegged_asset, name, peg_price, peg_price_updated_at')
      .eq('id', stablecoinId)
      .single();

    if (stablecoinError || !stablecoin) {
      return reply.status(404).send({ error: 'Stablecoin not found' });
    }

    if (!stablecoin.pegged_asset) {
      return reply.send({
        stablecoinId: stablecoin.id,
        peggedAsset: null,
        pegPrice: null,
        pegPriceUpdatedAt: null,
        message: 'No pegged asset specified',
      });
    }

    // Check if peg price is stale (older than 24 hours)
    const isStale =
      !stablecoin.peg_price_updated_at ||
      Date.now() - new Date(stablecoin.peg_price_updated_at).getTime() > 24 * 60 * 60 * 1000;

    // If peg price is stale, try to update it
    if (isStale) {
      console.log(`Peg price is stale for ${stablecoin.name}, updating...`);
      try {
        const updateResult = await pegPriceUpdater.updateSinglePegPrice(stablecoinId);
        if (updateResult.success) {
          // Refetch the updated data
          const { data: updatedStablecoin } = await supabase
            .from('stablecoins')
            .select('id, pegged_asset, name, peg_price, peg_price_updated_at')
            .eq('id', stablecoinId)
            .single();

          if (updatedStablecoin) {
            return reply.send({
              stablecoinId: updatedStablecoin.id,
              peggedAsset: updatedStablecoin.pegged_asset,
              pegPrice: updatedStablecoin.peg_price,
              pegPriceUpdatedAt: updatedStablecoin.peg_price_updated_at,
              lastUpdated: updatedStablecoin.peg_price_updated_at,
              updateUnixTime: updatedStablecoin.peg_price_updated_at
                ? Math.floor(new Date(updatedStablecoin.peg_price_updated_at).getTime() / 1000)
                : null,
            });
          }
        }
      } catch (updateError) {
        console.error(`Failed to update peg price for ${stablecoin.name}:`, updateError);
        // Continue with stale data
      }
    }

    return reply.send({
      stablecoinId: stablecoin.id,
      peggedAsset: stablecoin.pegged_asset,
      pegPrice: stablecoin.peg_price,
      pegPriceUpdatedAt: stablecoin.peg_price_updated_at,
      lastUpdated: stablecoin.peg_price_updated_at,
      updateUnixTime: stablecoin.peg_price_updated_at
        ? Math.floor(new Date(stablecoin.peg_price_updated_at).getTime() / 1000)
        : null,
    });
  } catch (error) {
    console.error('Error fetching stablecoin peg price:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /api/stablecoins/peg-prices - Get peg prices for all stablecoins
fastify.get('/api/stablecoins/peg-prices', async (request, reply) => {
  try {
    // Get all stablecoins with peg prices from database
    const { data: stablecoins, error } = await supabase
      .from('stablecoins')
      .select('id, pegged_asset, name, peg_price, peg_price_updated_at')
      .order('id');

    if (error) {
      console.error('Error fetching stablecoins:', error);
      return reply.status(500).send({ error: 'Failed to fetch stablecoins' });
    }

    if (!stablecoins || stablecoins.length === 0) {
      return reply.send({ pegPrices: [] });
    }

    // Check if any peg prices are stale and update them if needed
    const staleStablecoins = stablecoins.filter(
      coin =>
        coin.pegged_asset &&
        (!coin.peg_price_updated_at ||
          Date.now() - new Date(coin.peg_price_updated_at).getTime() > 24 * 60 * 60 * 1000)
    );

    if (staleStablecoins.length > 0) {
      console.log(`Found ${staleStablecoins.length} stale peg prices, updating...`);
      try {
        await pegPriceUpdater.updateAllPegPrices();
        // Refetch updated data
        const { data: updatedStablecoins } = await supabase
          .from('stablecoins')
          .select('id, pegged_asset, name, peg_price, peg_price_updated_at')
          .order('id');

        if (updatedStablecoins) {
          const pegPrices = updatedStablecoins.map(stablecoin => ({
            stablecoinId: stablecoin.id,
            peggedAsset: stablecoin.pegged_asset,
            name: stablecoin.name,
            pegPrice: stablecoin.peg_price,
            lastUpdated: stablecoin.peg_price_updated_at,
            updateUnixTime: stablecoin.peg_price_updated_at
              ? Math.floor(new Date(stablecoin.peg_price_updated_at).getTime() / 1000)
              : null,
          }));
          return reply.send({ pegPrices });
        }
      } catch (updateError) {
        console.error('Failed to update peg prices:', updateError);
        // Continue with existing data
      }
    }

    // Return current peg prices from database
    const pegPrices = stablecoins.map(stablecoin => ({
      stablecoinId: stablecoin.id,
      peggedAsset: stablecoin.pegged_asset,
      name: stablecoin.name,
      pegPrice: stablecoin.peg_price,
      lastUpdated: stablecoin.peg_price_updated_at,
      updateUnixTime: stablecoin.peg_price_updated_at
        ? Math.floor(new Date(stablecoin.peg_price_updated_at).getTime() / 1000)
        : null,
    }));

    return reply.send({ pegPrices });
  } catch (error) {
    console.error('Error fetching stablecoin peg prices:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// POST /api/stablecoins/update-peg-prices - Manually trigger peg price update for all stablecoins
fastify.post('/api/stablecoins/update-peg-prices', async (request, reply) => {
  try {
    console.log('Manual peg price update triggered');
    const results = await pegPriceUpdater.updateAllPegPrices();

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return reply.send({
      message: `Peg price update completed: ${successCount} successful, ${errorCount} failed`,
      total: results.length,
      successful: successCount,
      failed: errorCount,
      results: results,
    });
  } catch (error) {
    console.error('Error in manual peg price update:', error);
    return reply.status(500).send({
      error: 'Failed to update peg prices',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Health check endpoint
fastify.get('/api/health', async (request, reply) => {
  return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Core API server running on port ${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();

export default fastify;
