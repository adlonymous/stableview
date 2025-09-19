interface PriceCacheEntry {
  price: number;
  timestamp: number;
  tokenAddress: string;
}

class PriceCache {
  private cache = new Map<string, PriceCacheEntry>();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  set(tokenAddress: string, price: number): void {
    this.cache.set(tokenAddress, {
      price,
      timestamp: Date.now(),
      tokenAddress,
    });
  }

  get(tokenAddress: string): number | null {
    const entry = this.cache.get(tokenAddress);
    
    if (!entry) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(tokenAddress);
      return null;
    }

    return entry.price;
  }

  has(tokenAddress: string): boolean {
    const entry = this.cache.get(tokenAddress);
    
    if (!entry) {
      return false;
    }

    // Check if cache is expired
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(tokenAddress);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  // Get all cached prices that are still valid
  getAllValidPrices(): Map<string, number> {
    const validPrices = new Map<string, number>();
    const now = Date.now();

    for (const [tokenAddress, entry] of this.cache.entries()) {
      if (now - entry.timestamp <= this.CACHE_DURATION) {
        validPrices.set(tokenAddress, entry.price);
      } else {
        this.cache.delete(tokenAddress);
      }
    }

    return validPrices;
  }

  // Get cache statistics
  getStats(): { totalEntries: number; validEntries: number; expiredEntries: number } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp <= this.CACHE_DURATION) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }
}

// Export a singleton instance
export const priceCache = new PriceCache();
