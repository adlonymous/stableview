import { z } from 'zod';
import { eq, like, and } from 'drizzle-orm';
import { stablecoins } from '../../db/schema.js';
import { router, publicProcedure } from '../trpc.js';

// Schema for filtering stablecoins
const filterStablecoinsSchema = z.object({
  search: z.string().optional(),
  peggedAsset: z.string().optional(),
  issuer: z.string().optional(),
  tokenProgram: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// Schema for creating a new stablecoin
const createStablecoinSchema = z.object({
  slug: z.string(),
  name: z.string(),
  token: z.string(),
  peggedAsset: z.string(),
  issuer: z.string(),
  tokenProgram: z.string(),
  tokenAddress: z.string(),
  mintAuthority: z.string(),
  bridgingMechanisms: z.array(z.string()).default([]),
  networksLiveOn: z.array(z.string()).default([]),
  redemptionMechanisms: z.array(z.string()).default([]),
  solscanLink: z.string().optional(),
  artemisLink: z.string().optional(),
  assetReservesLink: z.string().optional(),
  transactionVolume30d: z.number().optional(),
  transactionCount30d: z.number().optional(),
  totalSupply: z.number().optional(),
  uniqueAddresses30d: z.number().optional(),
  price: z.number().optional(),
  executiveSummary: z.string().optional(),
  logoUrl: z.string().optional(),
});

// Schema for updating a stablecoin
const updateStablecoinSchema = createStablecoinSchema.partial().extend({
  id: z.number(),
});

// Export the stablecoin router
export const stablecoinRouter = router({
  // Get all stablecoins with optional filtering
  getAll: publicProcedure.input(filterStablecoinsSchema).query(async ({ ctx, input }) => {
    const { search, peggedAsset, issuer, tokenProgram, limit, offset } = input;
    const whereConditions = [];

    if (search) {
      whereConditions.push(like(stablecoins.name, `%${search}%`));
    }

    if (peggedAsset) {
      whereConditions.push(eq(stablecoins.peggedAsset, peggedAsset));
    }

    if (issuer) {
      whereConditions.push(eq(stablecoins.issuer, issuer));
    }

    if (tokenProgram) {
      whereConditions.push(eq(stablecoins.tokenProgram, tokenProgram));
    }

    const query = ctx.db
      .select()
      .from(stablecoins)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .limit(limit)
      .offset(offset);

    return await query;
  }),

  // Get a single stablecoin by ID
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const result = await ctx.db
      .select()
      .from(stablecoins)
      .where(eq(stablecoins.id, input))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`Stablecoin with ID ${input} not found`);
    }

    return result[0];
  }),

  // Get a single stablecoin by slug
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const result = await ctx.db
      .select()
      .from(stablecoins)
      .where(eq(stablecoins.slug, input))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`Stablecoin with slug ${input} not found`);
    }

    return result[0];
  }),

  // Create a new stablecoin
  create: publicProcedure.input(createStablecoinSchema).mutation(async ({ ctx, input }) => {
    // Check if stablecoin with this slug already exists
    const existing = await ctx.db
      .select({ id: stablecoins.id })
      .from(stablecoins)
      .where(eq(stablecoins.slug, input.slug))
      .limit(1);

    if (existing.length > 0) {
      throw new Error(`Stablecoin with slug "${input.slug}" already exists`);
    }

    // Insert the new stablecoin
    const result = await ctx.db
      .insert(stablecoins)
      .values({
        slug: input.slug,
        name: input.name,
        token: input.token,
        peggedAsset: input.peggedAsset,
        issuer: input.issuer,
        tokenProgram: input.tokenProgram,
        tokenAddress: input.tokenAddress,
        mintAuthority: input.mintAuthority,
        bridgingMechanisms: input.bridgingMechanisms,
        networksLiveOn: input.networksLiveOn,
        redemptionMechanisms: input.redemptionMechanisms,
        solscanLink: input.solscanLink,
        artemisLink: input.artemisLink,
        assetReservesLink: input.assetReservesLink,
        transactionVolume30d: input.transactionVolume30d?.toString(),
        transactionCountDaily: input.transactionCount30d?.toString(),
        totalSupply: input.totalSupply?.toString(),
        dailyActiveUsers: input.uniqueAddresses30d?.toString(),
        price: input.price?.toString(),
        executiveSummary: input.executiveSummary,
        logoUrl: input.logoUrl,
      })
      .returning();

    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }
    throw new Error('Failed to create stablecoin');
  }),

  // Update an existing stablecoin
  update: publicProcedure.input(updateStablecoinSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;

    // Check if stablecoin exists
    const existing = await ctx.db
      .select({ id: stablecoins.id })
      .from(stablecoins)
      .where(eq(stablecoins.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new Error(`Stablecoin with ID ${id} not found`);
    }

    // Prepare update data
    const updateValues: Record<string, unknown> = {};

    // Only include fields that are provided
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        // Convert numeric fields to strings for database
        if (
          [
            'transactionVolume30d',
            'transactionCount30d',
            'totalSupply',
            'uniqueAddresses30d',
            'price',
          ].includes(key) &&
          typeof updateData[key as keyof typeof updateData] === 'number'
        ) {
          updateValues[key] = updateData[key as keyof typeof updateData]?.toString();
        } else {
          updateValues[key] = updateData[key as keyof typeof updateData];
        }
      }
    });

    // Update the stablecoin
    const result = await ctx.db
      .update(stablecoins)
      .set({
        ...updateValues,
        updatedAt: new Date(),
      })
      .where(eq(stablecoins.id, id))
      .returning();

    return result[0];
  }),

  // Delete a stablecoin
  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    // Check if stablecoin exists
    const existing = await ctx.db
      .select({ id: stablecoins.id })
      .from(stablecoins)
      .where(eq(stablecoins.id, input))
      .limit(1);

    if (existing.length === 0) {
      throw new Error(`Stablecoin with ID ${input} not found`);
    }

    // Delete the stablecoin
    await ctx.db.delete(stablecoins).where(eq(stablecoins.id, input));

    return { id: input, deleted: true };
  }),
});
