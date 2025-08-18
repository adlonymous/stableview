#!/usr/bin/env node

import { supabase } from '../db/index.js';
import { createArtemisClient } from './artemis-client.js';
import dotenv from 'dotenv';

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

async function fetchMetricsFromArtemis(slug: string): Promise<MetricsData | null> {
  try {
    const artemis = createArtemisClient();
    const symbol = `${slug}-sol`;

    const [volume30d, dailyTxns, supply, dau] = await Promise.all([
      artemis.getTransferVolume30d(symbol),
      artemis.getDailyTransactions(symbol),
      artemis.getTotalSupply(symbol),
      artemis.getDailyActiveUsers(symbol),
    ]);

    return {
      slug,
      transactionVolume30d: volume30d,
      transactionCountDaily: dailyTxns,
      totalSupply: supply,
      dailyActiveUsers: dau,
    };
  } catch (error) {
    console.error(`Failed to fetch metrics for ${slug}:`, error);
    return null;
  }
}

async function updateStablecoinMetrics(slug: string, metrics: MetricsData) {
  try {
    const updateData = {
      transaction_volume_30d: metrics.transactionVolume30d.toString(),
      transaction_count_daily: metrics.transactionCountDaily.toString(),
      total_supply: metrics.totalSupply.toString(),
      daily_active_users: metrics.dailyActiveUsers.toString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('stablecoins').update(updateData).eq('slug', slug);

    if (error) {
      console.error(`Failed to update ${slug}:`, error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error updating ${slug}:`, error);
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

async function updateAllMetrics() {
  const stablecoins = await getStablecoinsFromDb();
  if (stablecoins.length === 0) return;

  let successCount = 0;
  let failureCount = 0;

  for (const stablecoin of stablecoins) {
    const metrics = await fetchMetricsFromArtemis(stablecoin.slug);
    if (metrics) {
      const success = await updateStablecoinMetrics(stablecoin.slug, metrics);
      success ? successCount++ : failureCount++;
    } else {
      failureCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`Updated: ${successCount} success, ${failureCount} failed`);
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

  const metrics = await fetchMetricsFromArtemis(slug);
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
    const metrics = await fetchMetricsFromArtemis(slug);
    if (metrics) {
      console.log(`Artemis API test successful for ${slug}:`, metrics);
    }
  } catch (error) {
    console.error(`Artemis connection failed for ${slug}:`, error);
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
  } else {
    console.log('Usage:');
    console.log('  node update-metrics.js                    # Update all stablecoins');
    console.log('  node update-metrics.js --slug USDC        # Update specific stablecoin');
    console.log('  node update-metrics.js --list             # List stablecoins');
    console.log('  node update-metrics.js --test USDC        # Test Artemis API');
  }
}

main().catch(console.error);
