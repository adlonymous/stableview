import { createDb } from '../db/index.js';
import { apiSources, stablecoins } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { createArtemisClient, StablecoinMetrics } from './artemis-client.js';

// Load environment variables
dotenv.config();

/**
 * MetricsFetcher class to handle fetching metrics from various APIs
 * and updating the database with the latest data
 */
export class MetricsFetcher {
  private db;
  
  constructor() {
    this.db = createDb();
  }
  
  /**
   * Fetch metrics for all stablecoins from configured API sources
   */
  public async fetchAllMetrics(): Promise<void> {
    try {
      console.log('Starting metrics fetch for all stablecoins...');
      
      // Get all active API sources
      const sources = await this.db
        .select()
        .from(apiSources)
        .where(eq(apiSources.isActive, true));
      
      if (sources.length === 0) {
        console.log('No active API sources found. Please configure API sources first.');
        return;
      }
      
      // Get all stablecoins
      const allStablecoins = await this.db.select().from(stablecoins);
      
      // Process each stablecoin
      for (const coin of allStablecoins) {
        console.log(`Fetching metrics for ${coin.name} (${coin.slug})...`);
        
        // Fetch metrics from each source
        for (const source of sources) {
          try {
            const metrics = await this.fetchMetricsFromSource(coin, source);
            
            if (metrics) {
              // Update the stablecoin with latest metrics
              await this.db
                .update(stablecoins)
                .set({
                  transactionVolume30d: metrics.transactionVolume.toString(),
                  transactionCount30d: metrics.transactionCount.toString(),
                  totalSupply: metrics.totalSupply.toString(),
                  uniqueAddresses30d: metrics.uniqueAddresses.toString(),
                  price: metrics.price.toString(),
                  updatedAt: new Date(),
                })
                .where(eq(stablecoins.id, coin.id));
              
              // Update the last fetched timestamp for the source
              await this.db
                .update(apiSources)
                .set({ lastFetched: new Date() })
                .where(eq(apiSources.id, source.id));
              
              console.log(`Updated metrics for ${coin.name} from ${source.name}`);
            }
          } catch (error) {
            console.error(`Error fetching metrics for ${coin.name} from ${source.name}:`, error);
          }
        }
      }
      
      console.log('Metrics fetch completed successfully.');
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }
  
  /**
   * Fetch metrics for a specific stablecoin from a specific API source
   */
  private async fetchMetricsFromSource(coin: any, source: any): Promise<StablecoinMetrics | null> {
    try {
      console.log(`Fetching metrics for ${coin.slug} from ${source.name}...`);
      
      if (source.name === 'Artemis') {
        return await this.fetchFromArtemis(coin, source);
      } else if (source.name === 'Solscan') {
        return await this.fetchFromSolscan(coin, source);
      } else {
        console.log(`No implementation for source: ${source.name}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return null;
    }
  }
  
  /**
   * Fetch metrics from Artemis API
   * 
   * @param coin The stablecoin to fetch metrics for
   * @param source The API source configuration
   * @returns Object containing metrics data or null if fetch failed
   */
  private async fetchFromArtemis(coin: any, source: any): Promise<StablecoinMetrics | null> {
    try {
      console.log(`Fetching data from Artemis for ${coin.slug}...`);
      
      // Get API key from source config or environment variable
      const apiKey = source.apiKey || process.env.ARTEMIS_API_KEY;
      
      if (!apiKey) {
        console.error('No API key provided for Artemis');
        return null;
      }
      
      // Create Artemis client
      const artemisClient = createArtemisClient(apiKey, source.url);
      
      // Fetch metrics
      const metrics = await artemisClient.getStablecoinMetrics(coin.slug);
      
      console.log(`Successfully fetched metrics for ${coin.slug} from Artemis`);
      return metrics;
    } catch (error) {
      console.error('Error fetching from Artemis:', error);
      return null;
    }
  }
  
  /**
   * Fetch metrics from Solscan API
   */
  private async fetchFromSolscan(coin: any, source: any): Promise<StablecoinMetrics | null> {
    // Implementation for Solscan API
    // Similar to Artemis implementation
    return null;
  }
}

/**
 * Create a new metrics fetcher instance
 */
export function createMetricsFetcher(): MetricsFetcher {
  return new MetricsFetcher();
} 