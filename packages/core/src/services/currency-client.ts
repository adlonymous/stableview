interface CurrencyExchangeResponse {
  [currency: string]: number;
}

interface CurrencyExchangeError {
  error: string;
  message: string;
}

interface ExchangeRateApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: { [currency: string]: number };
}

interface ExchangeRatePairResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
}

class CurrencyClient {
  private apiKey = process.env.EXCHANGE_RATE_API_KEY || '';
  private baseUrl = 'https://v6.exchangerate-api.com/v6';
  private cache = new Map<string, { data: CurrencyExchangeResponse; timestamp: number }>();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

  constructor() {
    if (!this.apiKey) {
      throw new Error('EXCHANGE_RATE_API_KEY environment variable is required');
    }
  }

  private async fetchExchangeRateData(baseCurrency: string): Promise<CurrencyExchangeResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`;
      console.log(`Fetching exchange rate data from: ${url}`);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'StableView/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as ExchangeRateApiResponse;

      if (data.result !== 'success') {
        throw new Error(`API returned error: ${data.result}`);
      }

      console.log(`Successfully fetched exchange rate data for ${baseCurrency}`);
      return data.conversion_rates;
    } catch (error) {
      console.error(`Error fetching exchange rate data for ${baseCurrency}:`, error);
      throw error;
    }
  }

  private async fetchExchangeRatePair(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/pair/${fromCurrency}/${toCurrency}`;
      console.log(`Fetching exchange rate pair from: ${url}`);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'StableView/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as ExchangeRatePairResponse;

      if (data.result !== 'success') {
        throw new Error(`API returned error: ${data.result}`);
      }

      console.log(
        `Successfully fetched exchange rate pair ${fromCurrency}/${toCurrency}: ${data.conversion_rate}`
      );
      return data.conversion_rate;
    } catch (error) {
      console.error(`Error fetching exchange rate pair ${fromCurrency}/${toCurrency}:`, error);
      throw error;
    }
  }

  private async fetchCurrencyData(baseCurrency: string): Promise<CurrencyExchangeResponse> {
    const cacheKey = `currency_${baseCurrency}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`Using cached currency data for ${baseCurrency}`);
      return cached.data;
    }

    try {
      const data = await this.fetchExchangeRateData(baseCurrency);
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Failed to fetch currency data for ${baseCurrency}:`, error);
      throw new Error(`Failed to fetch currency data for ${baseCurrency} from Exchange Rate API`);
    }
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string = 'USD'): Promise<number | null> {
    try {
      if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
        return 1.0; // Same currency, rate is 1
      }

      // Normalize currency codes
      const normalizedFrom = fromCurrency.toUpperCase();
      const normalizedTo = toCurrency.toUpperCase();

      console.log(`Getting exchange rate from ${normalizedFrom} to ${normalizedTo}`);

      // Use the pair endpoint for more efficient single rate fetching
      const rate = await this.fetchExchangeRatePair(normalizedFrom, normalizedTo);

      console.log(`Exchange rate ${normalizedFrom} to ${normalizedTo}: ${rate}`);
      return rate;
    } catch (error) {
      console.error(`Error getting exchange rate from ${fromCurrency} to ${toCurrency}:`, error);
      return null;
    }
  }

  async getMultipleExchangeRates(
    fromCurrencies: string[],
    toCurrency: string = 'USD'
  ): Promise<Record<string, number | null>> {
    const results: Record<string, number | null> = {};

    // Process currencies in batches to avoid overwhelming the API
    const batchSize = 3; // Reduced batch size for Exchange Rate API
    for (let i = 0; i < fromCurrencies.length; i += batchSize) {
      const batch = fromCurrencies.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async currency => {
          try {
            const rate = await this.getExchangeRate(currency, toCurrency);
            results[currency] = rate;
          } catch (error) {
            console.error(`Error getting rate for ${currency}:`, error);
            results[currency] = null;
          }
        })
      );

      // Add delay between batches to be respectful to the API
      if (i + batchSize < fromCurrencies.length) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Increased delay
      }
    }

    return results;
  }

  // Get all available currencies from Exchange Rate API
  async getAvailableCurrencies(): Promise<string[]> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/latest/USD`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = (await response.json()) as ExchangeRateApiResponse;
      if (data.result !== 'success') {
        throw new Error(`API returned error: ${data.result}`);
      }
      return Object.keys(data.conversion_rates);
    } catch (error) {
      console.error('Error fetching available currencies:', error);
      return [];
    }
  }

  // Clear cache (useful for testing or manual cache invalidation)
  clearCache(): void {
    this.cache.clear();
    console.log('Currency cache cleared');
  }
}

// Lazy instantiation to avoid environment variable issues during module import
let _currencyClient: CurrencyClient | null = null;

export function getCurrencyClient(): CurrencyClient {
  if (!_currencyClient) {
    _currencyClient = new CurrencyClient();
  }
  return _currencyClient;
}
export type { CurrencyExchangeResponse, CurrencyExchangeError };
