interface ArtemisDataPoint {
  val: number | string;
  [key: string]: unknown;
}

interface ArtemisSymbolData {
  [key: string]: ArtemisDataPoint[];
}

interface ArtemisResponse {
  data?: {
    symbols?: {
      [symbol: string]: ArtemisSymbolData;
    };
  };
}

export class ArtemisClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://data-svc.artemisxyz.com') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getTransferVolume30d(symbol: string, now: Date = new Date()): Promise<number> {
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const start = new Date(end);
    start.setUTCDate(end.getUTCDate() - 29);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    const data = await this.fetchMetric('STABLECOIN_TRANSFER_VOLUME', symbol, {
      startDate,
      endDate,
    });
    const rawSeries = this.extractSeries(data, symbol, 'STABLECOIN_TRANSFER_VOLUME');
    const series = Array.isArray(rawSeries) ? rawSeries : [];

    let sum = 0;
    for (const p of series) {
      const v = typeof p?.val === 'number' ? p.val : Number(p?.val);
      if (Number.isFinite(v)) sum += v;
    }
    return sum;
  }

  async getDailyTransactions(symbol: string): Promise<number> {
    const data = await this.fetchMetric('STABLECOIN_DAILY_TXNS', symbol);
    return this.getLatestNumeric(data, symbol, 'STABLECOIN_DAILY_TXNS');
  }

  async getTotalSupply(symbol: string): Promise<number> {
    const data = await this.fetchMetric('STABLECOIN_SUPPLY', symbol);
    return this.getLatestNumeric(data, symbol, 'STABLECOIN_SUPPLY');
  }

  async getDailyActiveUsers(symbol: string): Promise<number> {
    const data = await this.fetchMetric('STABLECOIN_DAU', symbol);
    return this.getLatestNumeric(data, symbol, 'STABLECOIN_DAU');
  }

  private getLatestNumeric(resp: ArtemisResponse, symbol: string, key: string): number {
    const rawSeries = this.extractSeries(resp, symbol, key);
    const series = Array.isArray(rawSeries) ? rawSeries : [];
    for (let i = series.length - 1; i >= 0; i--) {
      const val = series[i]?.val;
      const v = typeof val === 'number' ? val : Number(val);
      if (Number.isFinite(v)) return v;
    }
    return 0;
  }

  private async fetchMetric(
    metric: string,
    symbol: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<ArtemisResponse> {
    const url = new URL(`${this.baseUrl}/data/${metric}/`);
    url.searchParams.set('symbols', symbol);
    if (params?.startDate) url.searchParams.set('startDate', params.startDate);
    if (params?.endDate) url.searchParams.set('endDate', params.endDate);

    const res = await fetch(url.toString(), { method: 'GET' });
    if (!res.ok) {
      throw new Error(`Artemis API error ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<ArtemisResponse>;
  }

  private extractSeries(resp: ArtemisResponse, symbol: string, key: string): ArtemisDataPoint[] {
    return resp?.data?.symbols?.[symbol]?.[key] ?? [];
  }
}

export function createArtemisClient(baseUrl?: string): ArtemisClient {
  return new ArtemisClient(baseUrl);
}
