import type { VercelRequest, VercelResponse } from '@vercel/node';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { supabase } from '../src/db/index.js';

// Load environment variables
dotenv.config();

// Create Fastify instance
const fastify = Fastify({
  logger: false, // Disable logging in serverless
});

// Register CORS plugin
await fastify.register(cors, {
  origin: true,
});

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

// Register routes
fastify.get('/api/health', async (request, reply) => {
  return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
});

fastify.get('/api/stablecoins', async (request, reply) => {
  try {
    const { data, error } = await supabase
      .from('stablecoins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const transformedData = (data || []).map(transformStablecoinData);
    return reply.send(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoins:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoins' });
  }
});

fastify.get('/api/stablecoins/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const { data, error } = await supabase
      .from('stablecoins')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return reply.status(404).send({ error: 'Stablecoin not found' });
    }

    const transformedData = transformStablecoinData(data);
    return reply.send(transformedData);
  } catch (error) {
    console.error('Error fetching stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoin' });
  }
});

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

    return reply.send(grouped);
  } catch (error) {
    console.error('Error fetching stablecoins by currency peg:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoins by currency peg' });
  }
});

// Export the handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
} 