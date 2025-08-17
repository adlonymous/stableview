#!/usr/bin/env node

import { supabase } from '../db/index.js';
import { createArtemisClient } from './artemis-client.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

/**
 * Fetch metrics from Artemis API using the original client
 */
async function fetchMetricsFromArtemis(slug: string): Promise<MetricsData | null> {
  try {
    console.log(`📊 Fetching metrics for ${slug} from Artemis API...`);

    // Use the original Artemis client
    const artemis = createArtemisClient();

    // Build Artemis symbol (default to <slug>-sol like the old system)
    const symbol = `${slug}-sol`;

    console.log(`🔍 Using Artemis symbol: ${symbol}`);

    // Fetch metrics as per the original spec
    const [volume30d, dailyTxns, supply, dau] = await Promise.all([
      artemis.getTransferVolume30d(symbol),
      artemis.getDailyTransactions(symbol),
      artemis.getTotalSupply(symbol),
      artemis.getDailyActiveUsers(symbol),
    ]);

    console.log(`📈 Received metrics for ${slug}:`, {
      volume30d,
      dailyTxns,
      supply,
      dau,
    });

    return {
      slug,
      transactionVolume30d: volume30d,
      transactionCountDaily: dailyTxns,
      totalSupply: supply,
      dailyActiveUsers: dau,
    };
  } catch (error) {
    console.error(`Failed to fetch metrics from Artemis for ${slug}:`, error);
    return null;
  }
}

/**
 * Update metrics for a specific stablecoin
 */
async function updateStablecoinMetrics(slug: string, metrics: MetricsData) {
  try {
    const updateData = {
      transaction_volume_30d: metrics.transactionVolume30d.toString(),
      transaction_count_daily: metrics.transactionCountDaily.toString(),
      total_supply: metrics.totalSupply.toString(),
      daily_active_users: metrics.dailyActiveUsers.toString(),
      updated_at: new Date().toISOString(),
    };

    console.log(`📝 Updating ${slug} with data:`, updateData);

    const { error } = await supabase.from('stablecoins').update(updateData).eq('slug', slug);

    if (error) {
      console.error(`❌ Failed to update ${slug}:`, error.message);
      return false;
    }

    console.log(`✅ Successfully updated ${slug} with metrics`);
    return true;
  } catch (error) {
    console.error(`Error updating ${slug}:`, error);
    return false;
  }
}

/**
 * Get all stablecoins from database
 */
async function getStablecoinsFromDb(): Promise<DatabaseStablecoin[]> {
  try {
    console.log('🔍 Fetching all stablecoins from database...');

    const { data, error } = await supabase
      .from('stablecoins')
      .select('id, slug, name, token_address')
      .order('slug');

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('📋 No stablecoins found in database');
      return [];
    }

    console.log(`📋 Found ${data.length} stablecoins in database`);
    return data;
  } catch (error) {
    console.error('Failed to fetch stablecoins from database:', error);
    return [];
  }
}

/**
 * Main function to update all stablecoin metrics
 */
async function updateAllMetrics() {
  console.log('🚀 Starting metrics update from Artemis API...');

  // Get all stablecoins from database
  const stablecoins = await getStablecoinsFromDb();

  if (stablecoins.length === 0) {
    console.log('No stablecoins found in database to update');
    return;
  }

  console.log(`Found ${stablecoins.length} stablecoins to update`);

  let successCount = 0;
  let failureCount = 0;

  for (const stablecoin of stablecoins) {
    console.log(`\n📈 Processing ${stablecoin.slug} (${stablecoin.name})...`);

    const metrics = await fetchMetricsFromArtemis(stablecoin.slug);

    if (metrics) {
      const success = await updateStablecoinMetrics(stablecoin.slug, metrics);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    } else {
      console.log(`❌ No metrics data for ${stablecoin.slug}`);
      failureCount++;
    }

    // Add delay between API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n🎉 Metrics update complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
}

/**
 * Update metrics for a specific stablecoin
 */
async function updateSingleStablecoin(slug: string) {
  console.log(`🎯 Updating metrics for ${slug}...`);

  // Check if stablecoin exists in database
  const { data: stablecoin, error } = await supabase
    .from('stablecoins')
    .select('id, slug, name')
    .eq('slug', slug)
    .single();

  if (error || !stablecoin) {
    console.log(`❌ Stablecoin ${slug} not found in database`);
    return;
  }

  console.log(`✅ Found stablecoin: ${stablecoin.name} (${stablecoin.slug})`);

  const metrics = await fetchMetricsFromArtemis(slug);

  if (metrics) {
    const success = await updateStablecoinMetrics(slug, metrics);
    if (success) {
      console.log(`✅ Successfully updated ${slug}`);
    } else {
      console.log(`❌ Failed to update ${slug}`);
    }
  } else {
    console.log(`❌ No metrics data for ${slug}`);
  }
}

/**
 * List all stablecoins in database
 */
async function listDatabaseStablecoins() {
  try {
    const stablecoins = await getStablecoinsFromDb();

    if (stablecoins.length === 0) {
      return;
    }

    console.log('📋 Stablecoins in database:');
    stablecoins.forEach(coin => {
      console.log(`  - ${coin.slug} (${coin.name}) - ID: ${coin.id}`);
    });
  } catch (error) {
    console.error('Failed to list database stablecoins:', error);
  }
}

/**
 * Test Artemis API connection for a specific stablecoin
 */
async function testArtemisConnection(slug: string) {
  console.log(`🧪 Testing Artemis API connection for ${slug}...`);

  // Check if stablecoin exists in database
  const { data: stablecoin, error } = await supabase
    .from('stablecoins')
    .select('id, slug, name')
    .eq('slug', slug)
    .single();

  if (error || !stablecoin) {
    console.log(`❌ Stablecoin ${slug} not found in database`);
    return;
  }

  console.log(`📡 Testing connection to Artemis API for symbol: ${slug}-sol`);

  try {
    const metrics = await fetchMetricsFromArtemis(slug);

    if (metrics) {
      console.log(`✅ Artemis API connection successful for ${slug}`);
      console.log(`📊 Received metrics:`, metrics);
    } else {
      console.log(`❌ Failed to fetch metrics from Artemis for ${slug}`);
    }
  } catch (error) {
    console.error(`❌ Error testing Artemis connection for ${slug}:`, error);
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Update all stablecoins from database
    await updateAllMetrics();
  } else if (args[0] === '--slug' && args[1]) {
    // Update specific stablecoin
    await updateSingleStablecoin(args[1]);
  } else if (args[0] === '--list') {
    // List stablecoins in database
    await listDatabaseStablecoins();
  } else if (args[0] === '--test' && args[1]) {
    // Test Artemis API connection
    await testArtemisConnection(args[1]);
  } else {
    console.log('Usage:');
    console.log(
      '  node update-metrics.js                    # Update all stablecoins from database'
    );
    console.log('  node update-metrics.js --slug USDC        # Update specific stablecoin');
    console.log('  node update-metrics.js --list             # List stablecoins in database');
    console.log('  node update-metrics.js --test USDC        # Test Artemis API connection');
  }
}

// Run the script
main().catch(console.error);
