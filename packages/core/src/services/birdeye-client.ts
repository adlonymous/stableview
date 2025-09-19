interface BirdeyePriceResponse {
  data: {
    isScaledUiToken: boolean;
    value: number;
    updateUnixTime: number;
    updateHumanTime: string;
    priceChange24h: number;
    priceInNative: number;
  };
  success: boolean;
}

import { priceCache } from './price-cache.js';

interface PriceData {
  price: number;
  priceChange24h: number;
  lastUpdated: string;
  updateUnixTime: number;
}

export class BirdeyeClient {
  private apiKey: string;
  private baseUrl = 'https://public-api.birdeye.so';
  private lastRequestTime = 0;
  private readonly minRequestInterval = 100; // 100ms = 10 RPS max

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const delay = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${delay}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  async getTokenPrice(tokenAddress: string): Promise<PriceData | null> {
    try {
      // Check cache first
      const cachedPrice = priceCache.get(tokenAddress);
      if (cachedPrice !== null) {
        console.log(`Using cached price for ${tokenAddress}: $${cachedPrice}`);
        return {
          price: cachedPrice,
          priceChange24h: 0, // We don't cache price change, so return 0
          lastUpdated: new Date().toISOString(),
          updateUnixTime: Math.floor(Date.now() / 1000),
        };
      }

      // Wait for rate limit before making request
      await this.waitForRateLimit();

      const response = await fetch(
        `${this.baseUrl}/defi/price?address=${tokenAddress}&ui_amount_mode=raw`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-chain': 'solana',
            'X-API-KEY': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        console.error(`Birdeye API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = (await response.json()) as BirdeyePriceResponse;

      if (!data.success || !data.data) {
        console.error('Birdeye API returned unsuccessful response:', data);
        return null;
      }

      const priceData = {
        price: data.data.value,
        priceChange24h: data.data.priceChange24h,
        lastUpdated: data.data.updateHumanTime,
        updateUnixTime: data.data.updateUnixTime,
      };

      // Cache the price
      priceCache.set(tokenAddress, data.data.value);
      console.log(`Cached price for ${tokenAddress}: $${data.data.value}`);

      return priceData;
    } catch (error) {
      console.error(`Error fetching price for token ${tokenAddress}:`, error);
      return null;
    }
  }

  async getMultipleTokenPrices(tokenAddresses: string[]): Promise<Map<string, PriceData>> {
    const priceMap = new Map<string, PriceData>();

    console.log(`Processing ${tokenAddresses.length} token prices with rate limiting`);

    // Process one at a time to avoid rate limiting
    for (let i = 0; i < tokenAddresses.length; i++) {
      const address = tokenAddresses[i];

      try {
        console.log(`Fetching price for token ${i + 1}/${tokenAddresses.length}: ${address}`);
        const priceData = await this.getTokenPrice(address);
        if (priceData) {
          priceMap.set(address, priceData);
          console.log(`Successfully fetched price for ${address}: $${priceData.price}`);
        } else {
          console.log(`No price data available for ${address}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch price for ${address}:`, error);
        // Continue with next token instead of failing completely
      }

      // Additional delay between requests (rate limiting is already handled in getTokenPrice)
      if (i < tokenAddresses.length - 1) {
        const delay = 50; // Additional 50ms delay for extra safety
        console.log(`Additional delay: waiting ${delay}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(
      `Completed fetching prices. Got ${priceMap.size} valid prices out of ${tokenAddresses.length} requests`
    );
    return priceMap;
  }
}

export function createBirdeyeClient(): BirdeyeClient {
  const apiKey = process.env.BIRDEYE_API_KEY || 'b46c9d874f0240108466c5e77c1f2c9e';
  return new BirdeyeClient(apiKey);
}
