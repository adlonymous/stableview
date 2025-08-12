import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { createDb } from '../db/index.js';
import { stablecoins } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import type { Stablecoin, NewStablecoin } from '../db/schema.js';

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: true,
});

const port = Number(process.env.CORE_API_PORT) || 3004;

// Register CORS plugin
await fastify.register(cors, {
  origin: true,
});

// Create database connection
const db = createDb();
console.log('Database connection created, DATABASE_URL:', process.env.DATABASE_URL);

// GET /api/stablecoins - Get all stablecoins
fastify.get('/api/stablecoins', async (request, reply) => {
  try {
    const rows = await db.select().from(stablecoins);
    if (Array.isArray(rows)) {
      rows.sort((a: Stablecoin, b: Stablecoin) => (a.id ?? 0) - (b.id ?? 0));
      return reply.send(rows);
    }
    return reply.send([]);
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

    const rows = await db.select().from(stablecoins);
    if (Array.isArray(rows)) {
      const item = rows.find((r: Stablecoin) => r.id === numericId);
      if (!item) {
        return reply.status(404).send({ error: 'Not found' });
      }
      return reply.send(item);
    }
    return reply.status(404).send({ error: 'Not found' });
  } catch (error) {
    console.error('Error fetching stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to fetch stablecoin' });
  }
});

// POST /api/stablecoins - Create new stablecoin
fastify.post('/api/stablecoins', async (request, reply) => {
  try {
    const body = request.body as Partial<NewStablecoin>;

    // Create new stablecoin with generated ID and timestamps
    const newStablecoin = {
      slug: body.slug || '',
      name: body.name || '',
      token: body.token || '',
      peggedAsset: body.peggedAsset || '',
      issuer: body.issuer || '',
      tokenProgram: body.tokenProgram || '',
      tokenAddress: body.tokenAddress || '',
      mintAuthority: body.mintAuthority || '',
      bridgingMechanisms: body.bridgingMechanisms || [],
      networksLiveOn: body.networksLiveOn || [],
      redemptionMechanisms: body.redemptionMechanisms || [],
      solscanLink: body.solscanLink,
      artemisLink: body.artemisLink,
      assetReservesLink: body.assetReservesLink,
      transactionVolume30d: body.transactionVolume30d || '0',
      transactionCountDaily: body.transactionCountDaily || '0',
      totalSupply: body.totalSupply || '0',
      dailyActiveUsers: body.dailyActiveUsers || '0',
      price: body.price || '1.00',
      executiveSummary: body.executiveSummary,
      logoUrl: body.logoUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(stablecoins).values(newStablecoin).returning();

    if (result && result.length > 0) {
      return reply.status(201).send(result[0]);
    } else {
      return reply.status(500).send({ error: 'Failed to create stablecoin' });
    }
  } catch (error) {
    console.error('Error creating stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to create stablecoin' });
  }
});

// PUT /api/stablecoins/:id - Update stablecoin
fastify.put('/api/stablecoins/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const body = request.body as Partial<NewStablecoin>;
    const numericId = Number(id);

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await db
      .update(stablecoins)
      .set(updateData)
      .where(eq(stablecoins.id, numericId))
      .returning();

    if (result && result.length > 0) {
      return reply.send(result[0]);
    } else {
      return reply.status(404).send({ error: 'Stablecoin not found' });
    }
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

    const result = await db.delete(stablecoins).where(eq(stablecoins.id, numericId)).returning();

    if (result && result.length > 0) {
      return reply.send({ message: 'Stablecoin deleted successfully' });
    } else {
      return reply.status(404).send({ error: 'Stablecoin not found' });
    }
  } catch (error) {
    console.error('Error deleting stablecoin:', error);
    return reply.status(500).send({ error: 'Failed to delete stablecoin' });
  }
});

// GET /api/dashboard/stats - Get aggregated dashboard statistics
fastify.get('/api/dashboard/stats', async (request, reply) => {
  try {
    // Get aggregated statistics across all stablecoins
    const stats = await db
      .select({
        totalSupply: sql<string>`SUM(CAST(${stablecoins.totalSupply} AS DECIMAL))`,
        totalTransactionVolume: sql<string>`SUM(CAST(${stablecoins.transactionVolume30d} AS DECIMAL))`,
        totalDailyTransactions: sql<string>`SUM(CAST(${stablecoins.transactionCountDaily} AS DECIMAL))`,
        totalDailyActiveUsers: sql<string>`SUM(CAST(${stablecoins.dailyActiveUsers} AS DECIMAL))`,
        stablecoinCount: sql<number>`COUNT(*)`,
      })
      .from(stablecoins);

    if (stats.length === 0) {
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

    const result = stats[0];

    // Convert numeric strings to numbers for calculations
    const totalSupply = parseFloat(result.totalSupply || '0');
    const totalTransactionVolume = parseFloat(result.totalTransactionVolume || '0');
    const totalDailyTransactions = parseFloat(result.totalDailyTransactions || '0');
    const totalDailyActiveUsers = parseFloat(result.totalDailyActiveUsers || '0');
    const stablecoinCount = result.stablecoinCount || 0;

    // Calculate additional metrics
    const totalMarketCap = totalSupply; // Assuming price is $1 for stablecoins
    const percentageOfSolanaVolume = 42; // This would need external data to calculate accurately
    const yearOverYearGrowth = 35; // This would need historical data to calculate accurately

    // Find dominant stablecoin (highest supply)
    const allStablecoins = await db
      .select({
        name: stablecoins.name,
        totalSupply: stablecoins.totalSupply,
      })
      .from(stablecoins)
      .orderBy(sql`CAST(${stablecoins.totalSupply} AS DECIMAL) DESC`);

    const dominantStablecoin = allStablecoins.length > 0 ? allStablecoins[0].name : 'N/A';
    const dominantStablecoinShare =
      allStablecoins.length > 0 && totalSupply > 0
        ? Math.round((parseFloat(allStablecoins[0].totalSupply || '0') / totalSupply) * 100)
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

// Health check endpoint
fastify.get('/health', async (request, reply) => {
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
