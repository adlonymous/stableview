import { createDb } from '../db/index.js';
import { apiSources, stablecoins } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { createArtemisClient } from './artemis-client.js';

// Load environment variables
dotenv.config();

export class MetricsFetcher {
  private db;

  constructor() {
    this.db = createDb();
  }

  public async fetchAllMetrics(): Promise<void> {
    try {
      console.log('Starting metrics fetch for all stablecoins...');

      const sources = await this.db
        .select()
        .from(apiSources)
        .where(eq(apiSources.isActive, true));

      // Fallback to Artemis default if no sources configured
      const useDefaultArtemis = !Array.isArray(sources) || sources.length === 0;

      const allStablecoins = await this.db.select().from(stablecoins);

      for (const coin of Array.isArray(allStablecoins) ? allStablecoins : []) {
        console.log(`Fetching metrics for ${coin.name} (${coin.slug})...`);

        try {
          const baseUrl = useDefaultArtemis
            ? 'https://data-svc.artemisxyz.com'
            : (sources.find((s: any) => s.name?.toLowerCase().includes('artemis'))?.url || 'https://data-svc.artemisxyz.com');

          const artemis = createArtemisClient(baseUrl);

          // Build Artemis symbol (default to <slug>-sol)
          const symbol = `${coin.slug}-sol`;

          // Fetch metrics as per spec
          const [volume30d, dailyTxns, supply, dau] = await Promise.all([
            artemis.getTransferVolume30d(symbol),
            artemis.getDailyTransactions(symbol),
            artemis.getTotalSupply(symbol),
            artemis.getDailyActiveUsers(symbol),
          ]);

          await this.db
            .update(stablecoins)
            .set({
              transactionVolume30d: volume30d.toString(),
              transactionCountDaily: dailyTxns.toString(),
              totalSupply: supply.toString(),
              dailyActiveUsers: dau.toString(),
              updatedAt: new Date(),
            })
            .where(eq(stablecoins.id, coin.id));

          // Update the last fetched timestamp for the Artemis source if present
          if (!useDefaultArtemis) {
            const artemisSource = sources.find((s: any) => s.name?.toLowerCase().includes('artemis'));
            if (artemisSource) {
              await this.db
                .update(apiSources)
                .set({ lastFetched: new Date() })
                .where(eq(apiSources.id, artemisSource.id));
            }
          }

          console.log(`Updated metrics for ${coin.name}`);
        } catch (error) {
          console.error(`Error fetching metrics for ${coin.name}:`, error);
        }
      }

      console.log('Metrics fetch completed successfully.');
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }
}

export function createMetricsFetcher(): MetricsFetcher {
  return new MetricsFetcher();
} 