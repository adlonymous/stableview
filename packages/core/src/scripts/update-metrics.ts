#!/usr/bin/env node

import { supabase } from '../db/index.js';
import { createTopLedgerClient } from './topledger-client.js';
import dotenv from 'dotenv';

// Safety: Fields that should NEVER be overwritten by automated updates
// const PROTECTED_FIELDS = [
//   'id',
//   'slug',
//   'name',
//   'token',
//   'pegged_asset',
//   'issuer',
//   'token_program',
//   'mint_authority',
//   'bridging_mechanisms',
//   'networks_live_on',
//   'redemption_mechanisms',
//   'solscan_link',
//   'artemis_link',
//   'asset_reserves_link',
//   'executive_summary',
//   'logo_url',
//   'created_at'
// ];

// Fields that are safe to update automatically (metrics only)
const SAFE_UPDATE_FIELDS = [
  'transaction_volume_30d',
  'transaction_count_daily',
  'total_supply',
  'daily_active_users',
  'price',
  'updated_at',
];

dotenv.config();

// Safety function to validate that we're only updating safe fields
function validateUpdateData(updateData: Record<string, unknown>): boolean {
  const updateFields = Object.keys(updateData);
  const unsafeFields = updateFields.filter(field => !SAFE_UPDATE_FIELDS.includes(field));

  if (unsafeFields.length > 0) {
    console.error(
      `❌ SAFETY VIOLATION: Attempting to update protected fields: ${unsafeFields.join(', ')}`
    );
    console.error(`Safe fields are: ${SAFE_UPDATE_FIELDS.join(', ')}`);
    return false;
  }

  return true;
}

interface MetricsData {
  slug: string;
  transactionVolume30d: number;
  transactionCountDaily: number;
  totalSupply: number;
  dailyActiveUsers: number;
}

interface DatabaseStablecoin {
  id: number;
  slug: string;
  name: string;
  token_address: string;
}

async function fetchMetricsFromTopLedger(slug: string): Promise<MetricsData | null> {
  try {
    const topledger = createTopLedgerClient();
    const mint = topledger.getMintFromSlug(slug);

    if (!mint) {
      console.warn(`No mint address found for slug: ${slug}`);
      return null;
    }

    const data = await topledger.getLatestDataForMint(mint);

    if (!data) {
      console.warn(`No data found for mint: ${mint} (slug: ${slug})`);
      return null;
    }

    return {
      slug,
      transactionVolume30d: data.volume30d,
      transactionCountDaily: data.transactionCount30d,
      totalSupply: data.totalSupply,
      dailyActiveUsers: data.dailyActiveUsers,
    };
  } catch (error) {
    console.error(`Failed to fetch metrics for ${slug}:`, error);
    return null;
  }
}

async function updateStablecoinMetrics(slug: string, metrics: MetricsData) {
  try {
    // Only update metrics fields - never touch other data
    const updateData = {
      transaction_volume_30d: metrics.transactionVolume30d.toString(),
      transaction_count_daily: metrics.transactionCountDaily.toString(),
      total_supply: metrics.totalSupply.toString(),
      daily_active_users: metrics.dailyActiveUsers.toString(),
      updated_at: new Date().toISOString(),
    };

    // Safety check: ensure we're only updating safe fields
    if (!validateUpdateData(updateData)) {
      console.error(`❌ Skipping update for ${slug} due to safety violation`);
      return false;
    }

    console.log(`Updating ${slug} with data:`, {
      volume: metrics.transactionVolume30d,
      count: metrics.transactionCountDaily,
      supply: metrics.totalSupply,
      users: metrics.dailyActiveUsers,
    });

    // Use a targeted update that only affects metrics fields
    const { data, error } = await supabase
      .from('stablecoins')
      .update(updateData)
      .eq('slug', slug)
      .select(
        'id, slug, transaction_volume_30d, transaction_count_daily, total_supply, daily_active_users, updated_at'
      );

    if (error) {
      console.error(`Failed to update ${slug}:`, error.message);
      return false;
    }

    if (data && data.length > 0) {
      console.log(`✅ Successfully updated ${slug} in database`);

      // Also update time-series data
      await updateTimeSeriesData(data[0].id, metrics);

      return true;
    } else {
      console.warn(`⚠️ No rows updated for ${slug} - stablecoin may not exist`);
      return false;
    }
  } catch (error) {
    console.error(`Error updating ${slug}:`, error);
    return false;
  }
}

async function updateTimeSeriesData(stablecoinId: number, metrics: MetricsData) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Insert or update time-series data for today
    const { error } = await supabase.from('stablecoin_supply_history').upsert({
      stablecoin_id: stablecoinId,
      date: today,
      total_supply: metrics.totalSupply,
      holders_count: metrics.dailyActiveUsers,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(
        `Failed to update time-series data for stablecoin ${stablecoinId}:`,
        error.message
      );
      return false;
    }

    console.log(`📊 Updated time-series data for stablecoin ${stablecoinId} on ${today}`);
    return true;
  } catch (error) {
    console.error(`Error updating time-series data for stablecoin ${stablecoinId}:`, error);
    return false;
  }
}

async function getStablecoinsFromDb(): Promise<DatabaseStablecoin[]> {
  try {
    const { data, error } = await supabase
      .from('stablecoins')
      .select('id, slug, name, token_address')
      .order('slug');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch stablecoins:', error);
    return [];
  }
}

async function syncStablecoinsWithApi() {
  try {
    const topledger = createTopLedgerClient();
    const apiStablecoins = await topledger.getAllAvailableStablecoins();
    const dbStablecoins = await getStablecoinsFromDb();

    console.log(
      `Found ${apiStablecoins.length} stablecoins in API, ${dbStablecoins.length} in database`
    );

    const dbSlugs = new Set(dbStablecoins.map(s => s.slug));
    // Filter out stablecoins that are already in DB and exclude VNXAU
    const newStablecoins = apiStablecoins.filter(
      s => !dbSlugs.has(s.slug) && s.slug !== 'vnxau' // Exclude VNXAU from being added
    );

    if (newStablecoins.length > 0) {
      console.log(`Adding ${newStablecoins.length} new stablecoins to database:`);

      for (const stablecoin of newStablecoins) {
        console.log(`  - ${stablecoin.slug} (${stablecoin.name})`);
        const success = await createStablecoinInDb(stablecoin);
        if (!success) {
          console.error(`Failed to create ${stablecoin.slug}, continuing with others...`);
        }
      }
    } else {
      console.log('No new stablecoins to add');
    }

    return apiStablecoins;
  } catch (error) {
    console.error('Failed to sync stablecoins with API:', error);
    return [];
  }
}

async function createStablecoinInDb(stablecoin: {
  slug: string;
  name: string;
  mint: string;
  totalSupply: number;
  holders: number;
}) {
  try {
    // First check if stablecoin already exists (double-check for race conditions)
    const { data: existing, error: checkError } = await supabase
      .from('stablecoins')
      .select('id, slug')
      .eq('slug', stablecoin.slug)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`Error checking for existing stablecoin ${stablecoin.slug}:`, checkError);
      return false;
    }

    if (existing) {
      console.log(`⚠️ Stablecoin ${stablecoin.slug} already exists, skipping creation`);
      return true; // Not an error, just already exists
    }

    // Only insert essential fields, leave others as NULL for manual configuration
    const { error } = await supabase.from('stablecoins').insert({
      slug: stablecoin.slug,
      name: stablecoin.name,
      token: stablecoin.name,
      token_address: stablecoin.mint,
      // Only set metrics data, leave other fields NULL for manual configuration
      transaction_volume_30d: '0',
      transaction_count_daily: '0',
      total_supply: stablecoin.totalSupply.toString(),
      daily_active_users: stablecoin.holders.toString(),
      price: 1.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`Failed to create stablecoin ${stablecoin.slug}:`, error.message);
      return false;
    }

    console.log(`✅ Created stablecoin: ${stablecoin.slug}`);
    return true;
  } catch (error) {
    console.error(`Error creating stablecoin ${stablecoin.slug}:`, error);
    return false;
  }
}

async function updateAllMetrics() {
  console.log('🔄 Starting update process...');

  // First sync with API to ensure we have all stablecoins
  console.log('🔄 Syncing with API...');
  await syncStablecoinsWithApi();

  // Get updated list from database
  console.log('🔄 Getting updated database list...');
  const stablecoins = await getStablecoinsFromDb();
  if (stablecoins.length === 0) {
    console.log('No stablecoins found in database');
    return;
  }

  console.log(`📊 Found ${stablecoins.length} stablecoins in database after sync`);

  let successCount = 0;
  let failureCount = 0;

  console.log(`\nUpdating metrics for ${stablecoins.length} stablecoins...`);

  for (const stablecoin of stablecoins) {
    console.log(`Processing ${stablecoin.slug}...`);
    const metrics = await fetchMetricsFromTopLedger(stablecoin.slug);
    if (metrics) {
      const success = await updateStablecoinMetrics(stablecoin.slug, metrics);
      if (success) {
        successCount++;
        console.log(`✅ Updated ${stablecoin.slug}`);
      } else {
        failureCount++;
        console.log(`❌ Failed to update ${stablecoin.slug}`);
      }
    } else {
      failureCount++;
      console.log(`❌ No data found for ${stablecoin.slug}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\nUpdate complete: ${successCount} success, ${failureCount} failed`);
}

async function updateSingleStablecoin(slug: string) {
  const { data: stablecoin, error } = await supabase
    .from('stablecoins')
    .select('id, slug, name')
    .eq('slug', slug)
    .single();

  if (error || !stablecoin) {
    console.log(`Stablecoin ${slug} not found`);
    return;
  }

  const metrics = await fetchMetricsFromTopLedger(slug);
  if (metrics) {
    const success = await updateStablecoinMetrics(slug, metrics);
    console.log(`${slug}: ${success ? 'Updated' : 'Failed'}`);
  }
}

async function listDatabaseStablecoins() {
  const stablecoins = await getStablecoinsFromDb();
  stablecoins.forEach(coin => {
    console.log(`${coin.slug} (${coin.name}) - ID: ${coin.id}`);
  });
}

async function testArtemisConnection(slug: string) {
  const { data: stablecoin, error } = await supabase
    .from('stablecoins')
    .select('id, slug, name')
    .eq('slug', slug)
    .single();

  if (error || !stablecoin) {
    console.log(`Stablecoin ${slug} not found`);
    return;
  }

  try {
    const metrics = await fetchMetricsFromTopLedger(slug);
    if (metrics) {
      console.log(`TopLedger API test successful for ${slug}:`, metrics);
    }
  } catch (error) {
    console.error(`TopLedger connection failed for ${slug}:`, error);
  }
}

async function backfillHistoricalData(slug?: string) {
  console.log('🔄 Starting historical data backfill...');

  const topledger = createTopLedgerClient();

  // Get stablecoins to backfill
  let stablecoins: DatabaseStablecoin[];
  if (slug) {
    const { data, error } = await supabase
      .from('stablecoins')
      .select('id, slug, name, token_address')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error(`Stablecoin ${slug} not found`);
      return;
    }
    stablecoins = [data];
  } else {
    stablecoins = await getStablecoinsFromDb();
  }

  console.log(`📊 Backfilling data for ${stablecoins.length} stablecoins...`);

  for (const stablecoin of stablecoins) {
    console.log(`Processing ${stablecoin.slug}...`);

    try {
      const mint = topledger.getMintFromSlug(stablecoin.slug);
      if (!mint) {
        console.warn(`No mint address found for ${stablecoin.slug}`);
        continue;
      }

      // Get historical supply data
      const supplyData = await topledger.getCirculatingSupplyData();
      const mintSupplyData = supplyData.filter(d => d.mint === mint);

      console.log(
        `Found ${mintSupplyData.length} historical supply records for ${stablecoin.slug}`
      );

      // Process and insert historical data
      let insertedCount = 0;
      for (const record of mintSupplyData) {
        const { error } = await supabase.from('stablecoin_supply_history').upsert({
          stablecoin_id: stablecoin.id,
          date: record.block_date,
          total_supply: record.token_supply || 0,
          holders_count: record.holders || 0,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error(
            `Failed to insert historical data for ${stablecoin.slug} on ${record.block_date}:`,
            error.message
          );
        } else {
          insertedCount++;
        }
      }

      console.log(`✅ Inserted ${insertedCount} historical records for ${stablecoin.slug}`);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error backfilling data for ${stablecoin.slug}:`, error);
    }
  }

  console.log('✅ Historical data backfill complete');
}

// Export the main update function for cron jobs
export async function updateMetrics() {
  try {
    await updateAllMetrics();
    return { success: true, message: 'All metrics updated successfully' };
  } catch (error) {
    console.error('Error updating metrics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await updateAllMetrics();
  } else if (args[0] === '--slug' && args[1]) {
    await updateSingleStablecoin(args[1]);
  } else if (args[0] === '--list') {
    await listDatabaseStablecoins();
  } else if (args[0] === '--test' && args[1]) {
    await testArtemisConnection(args[1]);
  } else if (args[0] === '--backfill') {
    await backfillHistoricalData(args[1]); // Optional slug parameter
  } else {
    console.log('Usage:');
    console.log('  node update-metrics.js                    # Update all stablecoins');
    console.log('  node update-metrics.js --slug USDC        # Update specific stablecoin');
    console.log('  node update-metrics.js --list             # List stablecoins');
    console.log('  node update-metrics.js --test USDC        # Test Artemis API');
    console.log(
      '  node update-metrics.js --backfill         # Backfill historical data for all stablecoins'
    );
    console.log(
      '  node update-metrics.js --backfill USDC    # Backfill historical data for specific stablecoin'
    );
  }
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
