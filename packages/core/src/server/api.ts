import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { supabase } from '../db/index.js';

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
  price: string;
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

    return reply.send({
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
