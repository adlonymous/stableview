import { z } from 'zod';
import { supabase } from '../../db/index.js';
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
  getAll: publicProcedure.input(filterStablecoinsSchema).query(async ({ input }) => {
    const { search, peggedAsset, issuer, tokenProgram, limit, offset } = input;

    let query = supabase
      .from('stablecoins')
      .select('*')
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (peggedAsset) {
      query = query.eq('pegged_asset', peggedAsset);
    }

    if (issuer) {
      query = query.eq('issuer', issuer);
    }

    if (tokenProgram) {
      query = query.eq('token_program', tokenProgram);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch stablecoins: ${error.message}`);
    }

    return data || [];
  }),

  // Get stablecoins grouped by currency peg
  getByCurrencyPeg: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('stablecoins')
      .select('pegged_asset, name, slug, total_supply, transaction_volume_30d')
      .order('pegged_asset')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch stablecoins by currency peg: ${error.message}`);
    }

    // Group by currency peg
    const grouped = (data || []).reduce(
      (
        acc: Record<
          string,
          Array<{
            name: string;
            slug: string;
            totalSupply: string | null;
            transactionVolume30d: string | null;
          }>
        >,
        coin: {
          pegged_asset: string;
          name: string;
          slug: string;
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
          totalSupply: coin.total_supply,
          transactionVolume30d: coin.transaction_volume_30d,
        });
        return acc;
      },
      {}
    );

    return grouped;
  }),

  // Get a single stablecoin by ID
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    const { data, error } = await supabase.from('stablecoins').select('*').eq('id', input).single();

    if (error) {
      throw new Error(`Stablecoin with ID ${input} not found`);
    }

    return data;
  }),

  // Get a single stablecoin by slug
  getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await supabase
      .from('stablecoins')
      .select('*')
      .eq('slug', input)
      .single();

    if (error) {
      throw new Error(`Stablecoin with slug ${input} not found`);
    }

    return data;
  }),

  // Create a new stablecoin
  create: publicProcedure.input(createStablecoinSchema).mutation(async ({ input }) => {
    // Check if stablecoin with this slug already exists
    const { data: existing } = await supabase
      .from('stablecoins')
      .select('id')
      .eq('slug', input.slug)
      .single();

    if (existing) {
      throw new Error(`Stablecoin with slug "${input.slug}" already exists`);
    }

    // Insert the new stablecoin
    const { data, error } = await supabase
      .from('stablecoins')
      .insert({
        slug: input.slug,
        name: input.name,
        token: input.token,
        pegged_asset: input.peggedAsset,
        issuer: input.issuer,
        token_program: input.tokenProgram,
        token_address: input.tokenAddress,
        mint_authority: input.mintAuthority,
        bridging_mechanisms: input.bridgingMechanisms,
        networks_live_on: input.networksLiveOn,
        redemption_mechanisms: input.redemptionMechanisms,
        solscan_link: input.solscanLink,
        artemis_link: input.artemisLink,
        asset_reserves_link: input.assetReservesLink,
        transaction_volume_30d: input.transactionVolume30d?.toString(),
        transaction_count_daily: input.transactionCount30d?.toString(),
        total_supply: input.totalSupply?.toString(),
        daily_active_users: input.uniqueAddresses30d?.toString(),
        price: input.price?.toString(),
        executive_summary: input.executiveSummary,
        logo_url: input.logoUrl,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create stablecoin: ${error.message}`);
    }

    return data;
  }),

  // Update an existing stablecoin
  update: publicProcedure.input(updateStablecoinSchema).mutation(async ({ input }) => {
    const { id, ...updateData } = input;

    // Check if stablecoin exists
    const { data: existing } = await supabase
      .from('stablecoins')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      throw new Error(`Stablecoin with ID ${id} not found`);
    }

    // Prepare update data
    const updateValues: Record<string, unknown> = {};

    // Only include fields that are provided
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        // Convert field names to snake_case for database
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

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
          updateValues[dbKey] = updateData[key as keyof typeof updateData]?.toString();
        } else {
          updateValues[dbKey] = updateData[key as keyof typeof updateData];
        }
      }
    });

    // Update the stablecoin
    const { data, error } = await supabase
      .from('stablecoins')
      .update({
        ...updateValues,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update stablecoin: ${error.message}`);
    }

    return data;
  }),

  // Delete a stablecoin
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    // Check if stablecoin exists
    const { data: existing } = await supabase
      .from('stablecoins')
      .select('id')
      .eq('id', input)
      .single();

    if (!existing) {
      throw new Error(`Stablecoin with ID ${input} not found`);
    }

    // Delete the stablecoin
    const { error } = await supabase.from('stablecoins').delete().eq('id', input);

    if (error) {
      throw new Error(`Failed to delete stablecoin: ${error.message}`);
    }

    return { id: input, deleted: true };
  }),
});
