import { supabase } from '../db/index.js';
import { createBirdeyeClient } from './birdeye-client.js';

interface PriceUpdateResult {
  stablecoinId: number;
  price: number | null;
  priceChange24h: number | null;
  lastUpdated: string;
  success: boolean;
  error?: string;
}

class PriceUpdater {
  private birdeyeClient: ReturnType<typeof createBirdeyeClient>;

  constructor() {
    this.birdeyeClient = createBirdeyeClient();
  }

  async updateAllPrices(): Promise<PriceUpdateResult[]> {
    console.log('Starting price update for all stablecoins...');

    try {
      // Fetch all stablecoins from database
      const { data: stablecoins, error } = await supabase
        .from('stablecoins')
        .select('id, token_address, name, token')
        .order('id');

      if (error) {
        console.error('Error fetching stablecoins:', error);
        throw error;
      }

      if (!stablecoins || stablecoins.length === 0) {
        console.log('No stablecoins found in database');
        return [];
      }

      console.log(`Found ${stablecoins.length} stablecoins to update`);

      // Extract token addresses
      const tokenAddresses = stablecoins
        .map(s => s.token_address)
        .filter(addr => addr && addr.trim() !== '');

      console.log(`Processing ${tokenAddresses.length} token addresses`);

      // Fetch prices from Birdeye API
      const priceMap = await this.birdeyeClient.getMultipleTokenPrices(tokenAddresses);

      // Update database with new prices
      const results: PriceUpdateResult[] = [];
      const updatePromises = stablecoins.map(async stablecoin => {
        try {
          const priceData = priceMap.get(stablecoin.token_address);

          if (priceData && priceData.price !== undefined && priceData.price !== null) {
            // Update database with new price
            const { error: updateError } = await supabase
              .from('stablecoins')
              .update({
                price: priceData.price.toString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', stablecoin.id);

            if (updateError) {
              console.error(`Error updating price for ${stablecoin.name}:`, updateError);
              results.push({
                stablecoinId: stablecoin.id,
                price: null,
                priceChange24h: null,
                lastUpdated: new Date().toISOString(),
                success: false,
                error: updateError.message,
              });
            } else {
              console.log(`Updated price for ${stablecoin.name}: $${priceData.price}`);
              results.push({
                stablecoinId: stablecoin.id,
                price: priceData.price,
                priceChange24h: priceData.priceChange24h,
                lastUpdated: priceData.lastUpdated,
                success: true,
              });
            }
          } else {
            console.log(`No price data available for ${stablecoin.name} - setting to N/A`);

            // Update database with N/A when no price data is available
            const { error: updateError } = await supabase
              .from('stablecoins')
              .update({
                price: 'N/A',
                updated_at: new Date().toISOString(),
              })
              .eq('id', stablecoin.id);

            if (updateError) {
              console.error(`Error updating price to N/A for ${stablecoin.name}:`, updateError);
              results.push({
                stablecoinId: stablecoin.id,
                price: null,
                priceChange24h: null,
                lastUpdated: new Date().toISOString(),
                success: false,
                error: updateError.message,
              });
            } else {
              console.log(`Set price to N/A for ${stablecoin.name}`);
              results.push({
                stablecoinId: stablecoin.id,
                price: null,
                priceChange24h: null,
                lastUpdated: new Date().toISOString(),
                success: true,
              });
            }
          }
        } catch (error) {
          console.error(`Error processing ${stablecoin.name}:`, error);
          results.push({
            stablecoinId: stablecoin.id,
            price: null,
            priceChange24h: null,
            lastUpdated: new Date().toISOString(),
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      await Promise.all(updatePromises);

      const successCount = results.filter(r => r.success).length;
      console.log(`Price update completed: ${successCount}/${results.length} successful`);

      return results;
    } catch (error) {
      console.error('Error in updateAllPrices:', error);
      throw error;
    }
  }

  async updateSinglePrice(stablecoinId: number): Promise<PriceUpdateResult | null> {
    try {
      // Fetch stablecoin from database
      const { data: stablecoin, error } = await supabase
        .from('stablecoins')
        .select('id, token_address, name, token')
        .eq('id', stablecoinId)
        .single();

      if (error || !stablecoin) {
        console.error(`Error fetching stablecoin ${stablecoinId}:`, error);
        return null;
      }

      if (!stablecoin.token_address) {
        console.log(`No token address for stablecoin ${stablecoin.name}`);
        return {
          stablecoinId,
          price: null,
          priceChange24h: null,
          lastUpdated: new Date().toISOString(),
          success: false,
          error: 'No token address available',
        };
      }

      // Fetch price from Birdeye API
      const priceData = await this.birdeyeClient.getTokenPrice(stablecoin.token_address);

      if (priceData && priceData.price !== undefined && priceData.price !== null) {
        // Update database with new price
        const { error: updateError } = await supabase
          .from('stablecoins')
          .update({
            price: priceData.price.toString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', stablecoinId);

        if (updateError) {
          console.error(`Error updating price for ${stablecoin.name}:`, updateError);
          return {
            stablecoinId,
            price: null,
            priceChange24h: null,
            lastUpdated: new Date().toISOString(),
            success: false,
            error: updateError.message,
          };
        }

        console.log(`Updated price for ${stablecoin.name}: $${priceData.price}`);
        return {
          stablecoinId,
          price: priceData.price,
          priceChange24h: priceData.priceChange24h,
          lastUpdated: priceData.lastUpdated,
          success: true,
        };
      } else {
        console.log(
          `No valid price data available for ${stablecoin.name} (price: ${priceData?.price}) - setting to N/A`
        );

        // Update database with N/A when no price data is available
        const { error: updateError } = await supabase
          .from('stablecoins')
          .update({
            price: 'N/A',
            updated_at: new Date().toISOString(),
          })
          .eq('id', stablecoinId);

        if (updateError) {
          console.error(`Error updating price to N/A for ${stablecoin.name}:`, updateError);
          return {
            stablecoinId,
            price: null,
            priceChange24h: null,
            lastUpdated: new Date().toISOString(),
            success: false,
            error: updateError.message,
          };
        }

        console.log(`Set price to N/A for ${stablecoin.name}`);
        return {
          stablecoinId,
          price: null,
          priceChange24h: null,
          lastUpdated: new Date().toISOString(),
          success: true,
        };
      }
    } catch (error) {
      console.error(`Error updating price for stablecoin ${stablecoinId}:`, error);
      return {
        stablecoinId,
        price: null,
        priceChange24h: null,
        lastUpdated: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getStablecoinPrice(stablecoinId: number): Promise<{
    price: number | null;
    priceChange24h: number | null;
    lastUpdated: string | null;
    isStale: boolean;
  }> {
    try {
      const { data: stablecoin, error } = await supabase
        .from('stablecoins')
        .select('price, updated_at')
        .eq('id', stablecoinId)
        .single();

      if (error || !stablecoin) {
        console.error(`Error fetching price for stablecoin ${stablecoinId}:`, error);
        return {
          price: null,
          priceChange24h: null,
          lastUpdated: null,
          isStale: true,
        };
      }

      const isStale =
        !stablecoin.updated_at ||
        Date.now() - new Date(stablecoin.updated_at).getTime() > 60 * 60 * 1000; // 1 hour

      return {
        price: stablecoin.price ? parseFloat(stablecoin.price) : null,
        priceChange24h: null, // We don't store price change in DB yet
        lastUpdated: stablecoin.updated_at,
        isStale,
      };
    } catch (error) {
      console.error(`Error getting price for stablecoin ${stablecoinId}:`, error);
      return {
        price: null,
        priceChange24h: null,
        lastUpdated: null,
        isStale: true,
      };
    }
  }

  async getAllStablecoinPrices(): Promise<
    Array<{
      stablecoinId: number;
      price: number | null;
      priceChange24h: number | null;
      lastUpdated: string | null;
      isStale: boolean;
    }>
  > {
    try {
      const { data: stablecoins, error } = await supabase
        .from('stablecoins')
        .select('id, price, updated_at')
        .order('id');

      if (error) {
        console.error('Error fetching stablecoin prices:', error);
        return [];
      }

      return stablecoins.map(stablecoin => {
        const isStale =
          !stablecoin.updated_at ||
          Date.now() - new Date(stablecoin.updated_at).getTime() > 60 * 60 * 1000; // 1 hour

        return {
          stablecoinId: stablecoin.id,
          price: stablecoin.price ? parseFloat(stablecoin.price) : null,
          priceChange24h: null, // We don't store price change in DB yet
          lastUpdated: stablecoin.updated_at,
          isStale,
        };
      });
    } catch (error) {
      console.error('Error getting all stablecoin prices:', error);
      return [];
    }
  }
}

export const priceUpdater = new PriceUpdater();
