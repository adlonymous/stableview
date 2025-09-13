interface TopLedgerDataPoint {
  block_date: string;
  mint: string;
  mint_name: string;
  holders: number;
  token_supply?: number;
  p2p_volume?: number;
  volume?: number;
  fee_payer?: number;
}

interface TopLedgerResponse {
  query_result: {
    data: {
      rows: TopLedgerDataPoint[];
    };
  };
}

export class TopLedgerClient {
  private baseUrl: string;
  private apiKey14115: string;
  private apiKey14117: string;

  constructor(
    baseUrl: string = 'https://analytics.topledger.xyz/solana/api',
    apiKey14115?: string,
    apiKey14117?: string
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey14115 = apiKey14115 || process.env.TOPLEDGER_API_KEY_14115 || '';
    this.apiKey14117 = apiKey14117 || process.env.TOPLEDGER_API_KEY_14117 || '';

    if (!this.apiKey14115) {
      throw new Error('TOPLEDGER_API_KEY_14115 environment variable is required');
    }
    if (!this.apiKey14117) {
      throw new Error('TOPLEDGER_API_KEY_14117 environment variable is required');
    }
  }

  async getCirculatingSupplyData(): Promise<TopLedgerDataPoint[]> {
    const url = `${this.baseUrl}/queries/14115/results.json?api_key=${this.apiKey14115}`;

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`TopLedger API error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as TopLedgerResponse;
    return data.query_result.data.rows;
  }

  async getVolumeData(): Promise<TopLedgerDataPoint[]> {
    const url = `${this.baseUrl}/queries/14117/results.json?api_key=${this.apiKey14117}`;

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`TopLedger API error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as TopLedgerResponse;
    return data.query_result.data.rows;
  }

  async getLatestDataForMint(mint: string): Promise<{
    totalSupply: number;
    holders: number;
    volume30d: number;
    transactionCount30d: number;
    dailyActiveUsers: number;
  } | null> {
    try {
      const [supplyData, volumeData] = await Promise.all([
        this.getCirculatingSupplyData(),
        this.getVolumeData(),
      ]);

      // Get the latest supply data for this mint
      const latestSupplyData = supplyData
        .filter(item => item.mint === mint)
        .sort((a, b) => new Date(b.block_date).getTime() - new Date(a.block_date).getTime())[0];

      if (!latestSupplyData) {
        console.warn(`No supply data found for mint: ${mint}`);
        return null;
      }

      // Get volume data for the last 30 days for this mint
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentVolumeData = volumeData.filter(
        item => item.mint === mint && new Date(item.block_date) >= thirtyDaysAgo
      );

      // Calculate 30-day volume and transaction count
      const volume30d = recentVolumeData.reduce((sum, item) => sum + (item.volume || 0), 0);
      const transactionCount30d = recentVolumeData.reduce(
        (sum, item) => sum + (item.fee_payer || 0),
        0
      );

      // Use holders as a proxy for daily active users (simplified)
      const dailyActiveUsers = latestSupplyData.holders;

      return {
        totalSupply: latestSupplyData.token_supply || 0,
        holders: latestSupplyData.holders,
        volume30d,
        transactionCount30d,
        dailyActiveUsers,
      };
    } catch (error) {
      console.error(`Failed to fetch data for mint ${mint}:`, error);
      return null;
    }
  }

  // Get all available stablecoins from the API
  async getAllAvailableStablecoins(): Promise<
    Array<{
      slug: string;
      name: string;
      mint: string;
      totalSupply: number;
      holders: number;
    }>
  > {
    try {
      const supplyData = await this.getCirculatingSupplyData();

      // Get the latest data for each mint
      const latestData = new Map<string, TopLedgerDataPoint>();

      for (const item of supplyData) {
        const existing = latestData.get(item.mint);
        if (!existing || new Date(item.block_date) > new Date(existing.block_date)) {
          latestData.set(item.mint, item);
        }
      }

      // Convert to our format and create slugs from mint names
      const stablecoins = Array.from(latestData.values()).map(item => ({
        slug: this.createSlugFromMintName(item.mint_name),
        name: item.mint_name,
        mint: item.mint,
        totalSupply: item.token_supply || 0,
        holders: item.holders,
      }));

      return stablecoins;
    } catch (error) {
      console.error('Failed to get all available stablecoins:', error);
      return [];
    }
  }

  // Create a slug from mint name (e.g., "USDC" -> "usdc")
  private createSlugFromMintName(mintName: string): string {
    return mintName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric characters
      .replace(/\*$/, '') // Remove trailing asterisk
      .replace(/^usd$/, 'usd*'); // Special case for USD*
  }

  // Helper method to get mint address from slug
  getMintFromSlug(slug: string): string | null {
    const mintMap: Record<string, string> = {
      usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      usdt: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      pyusd: '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
      fdusd: '9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u',
      usdy: 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6',
      usde: 'DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT',
      usds: 'USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA',
      usdp: 'HVbpJAQGNpkgBaYBZQBR1t7yFdvaYVp2vCQQfKKEN4tM',
      usdg: '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH',
      'usd*': 'BenJy1n3WTx9mTjEvy63e8Q1j4RqUc6E4VBMz3ir4Wo6',
      euroc: 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr',
      eurc: 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr',
      veur: 'C4Kkr9NZU3VbyedcgutU6LKmi6MKz81sx6gRmk5pX519',
      euroe: '2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg',
      vgbp: '5H4voZhzySsVvwVYDAKku8MZGuYBC7cXaBKDPW4YHWW1',
      vchf: 'AhhdRu5YZdjVkKR3wbnUDaymVQL2ucjMQ63sZ3LFHsch',
      vnxau: '9TPL8droGJ7jThsq4momaoz6uhTcvX2SeMqipoPmNa8R',
      brz: 'FtgGSFADXBtroxq8VCausXRr2of47QBf5AS1NtZCu4GD',
      ngn: '52GzcLDMfBveMRnWXKX7U3Pa5Lf7QLkWWvsJRDjWDBSk',
      tryb: 'A94X2fRy3wydNShU4dRaDyap2UuoeWJGWyATtyp61WZf',
      gyen: 'Crn4x1Y2HUKko7ox2EZMT6N2t2ZyH7eKtwkBGVnhEq1g',
      zusd: 'FrBfWJ4qE5sCzKm3k3JaAtqZcXUh4LvJygDeketsrsH4',
      mxne: '6zYgzrT7X2wi9a9NeMtUvUWLLmf2a8vBsbYkocYdB9wa',
      ausd: 'AUSD1jCcCyPLybk1YnvPWsHQSrZ46dxwoMniN4N2UEB9',
      susd: 'susdabGDNbhrnCa6ncrYo81u4s9GM8ecK2UwMyZiq4X',
      ggusd: 'GGUSDyBUPFg5RrgWwqEqhXoha85iYGs6cL57SyK4G2Y7',
      buidl: 'GyWgeqpy5GueU2YbkE8xqUeVEokCMMCEeUrfbtMw6phr',
      zarp: 'dngKhBQM3BGvsDHKhrLnjvRKfY5Q7gEnYGToj9Lk8rk',
      syrupusdc: 'AvZZF1YaZDziPY2RCK4oJrRVrbN3mTD9NL24hPeaZeUj',
    };

    return mintMap[slug.toLowerCase()] || null;
  }
}

export function createTopLedgerClient(
  baseUrl?: string,
  apiKey14115?: string,
  apiKey14117?: string
): TopLedgerClient {
  return new TopLedgerClient(baseUrl, apiKey14115, apiKey14117);
}
