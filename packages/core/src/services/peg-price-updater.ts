import { currencyClient } from './currency-client.js';
import { supabase } from '../db/index.js';

interface PegPriceUpdateResult {
  success: boolean;
  stablecoinId: number;
  peggedAsset: string;
  pegPrice?: number;
  error?: string;
}

class PegPriceUpdater {
  // Currency mapping for common pegged assets
  private currencyMapping: Record<string, string> = {
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
    JPY: 'JPY',
    CHF: 'CHF',
    CAD: 'CAD',
    AUD: 'AUD',
    CNY: 'CNY',
    INR: 'INR',
    BRL: 'BRL',
    MXN: 'MXN',
    TRY: 'TRY',
    ZAR: 'ZAR',
    NGN: 'NGN',
    KRW: 'KRW',
    SGD: 'SGD',
    HKD: 'HKD',
    NZD: 'NZD',
    SEK: 'SEK',
    NOK: 'NOK',
    DKK: 'DKK',
    PLN: 'PLN',
    CZK: 'CZK',
    HUF: 'HUF',
    RUB: 'RUB',
    UAH: 'UAH',
    THB: 'THB',
    PHP: 'PHP',
    IDR: 'IDR',
    MYR: 'MYR',
    VND: 'VND',
    AED: 'AED',
    SAR: 'SAR',
    QAR: 'QAR',
    KWD: 'KWD',
    BHD: 'BHD',
    OMR: 'OMR',
    JOD: 'JOD',
    LBP: 'LBP',
    EGP: 'EGP',
    MAD: 'MAD',
    TND: 'TND',
    DZD: 'DZD',
    LYD: 'LYD',
    ETB: 'ETB',
    KES: 'KES',
    UGX: 'UGX',
    TZS: 'TZS',
    ZMW: 'ZMW',
    BWP: 'BWP',
    SZL: 'SZL',
    LSL: 'LSL',
    NAD: 'NAD',
    MUR: 'MUR',
    SCR: 'SCR',
    MVR: 'MVR',
    KMF: 'KMF',
    DJF: 'DJF',
    ERN: 'ERN',
    SOS: 'SOS',
    SLL: 'SLL',
    GMD: 'GMD',
    GNF: 'GNF',
    LRD: 'LRD',
    CDF: 'CDF',
    AOA: 'AOA',
    XAF: 'XAF',
    XOF: 'XOF',
    XPF: 'XPF',
    BTC: 'BTC',
    ETH: 'ETH',
    BNB: 'BNB',
    XRP: 'XRP',
    ADA: 'ADA',
    SOL: 'SOL',
    DOT: 'DOT',
    MATIC: 'MATIC',
    AVAX: 'AVAX',
    LINK: 'LINK',
    UNI: 'UNI',
    LTC: 'LTC',
    BCH: 'BCH',
    XLM: 'XLM',
    ATOM: 'ATOM',
    VET: 'VET',
    FIL: 'FIL',
    TRX: 'TRX',
    ETC: 'ETC',
    XMR: 'XMR',
    ZEC: 'ZEC',
    DASH: 'DASH',
    NEO: 'NEO',
    EOS: 'EOS',
    XTZ: 'XTZ',
    ALGO: 'ALGO',
    ICP: 'ICP',
    THETA: 'THETA',
    FTM: 'FTM',
    HBAR: 'HBAR',
    MANA: 'MANA',
    SAND: 'SAND',
    AXS: 'AXS',
    CHZ: 'CHZ',
    FLOW: 'FLOW',
    NEAR: 'NEAR',
    FTT: 'FTT',
    SUSHI: 'SUSHI',
    COMP: 'COMP',
    YFI: 'YFI',
    SNX: 'SNX',
    MKR: 'MKR',
    AAVE: 'AAVE',
    CRV: 'CRV',
    '1INCH': '1INCH',
    BAT: 'BAT',
    ZRX: 'ZRX',
    KNC: 'KNC',
    REN: 'REN',
    LRC: 'LRC',
    OMG: 'OMG',
    REP: 'REP',
    KAVA: 'KAVA',
    BAND: 'BAND',
    NMR: 'NMR',
    RLC: 'RLC',
    STORJ: 'STORJ',
    DNT: 'DNT',
    FUN: 'FUN',
    REQ: 'REQ',
    CVC: 'CVC',
    GNT: 'GNT',
    DGD: 'DGD',
    GNO: 'GNO',
    ICN: 'ICN',
    WINGS: 'WINGS',
    TRST: 'TRST',
    RAD: 'RAD',
    ANT: 'ANT',
    DCR: 'DCR',
    LSK: 'LSK',
    ARK: 'ARK',
    WAVES: 'WAVES',
    NXT: 'NXT',
    EMC: 'EMC',
    FCT: 'FCT',
    MAID: 'MAID',
    AMP: 'AMP',
    DOGE: 'DOGE',
    SHIB: 'SHIB',
    PEPE: 'PEPE',
    FLOKI: 'FLOKI',
    BONK: 'BONK',
    WIF: 'WIF',
    BOME: 'BOME',
    MYRO: 'MYRO',
    POPCAT: 'POPCAT',
    MEW: 'MEW',
    SLERF: 'SLERF',
    BODEN: 'BODEN',
    ACT: 'ACT',
    GOAT: 'GOAT',
    PNUT: 'PNUT',
    CHILLGUY: 'CHILLGUY',
    MOOD: 'MOOD',
    MEOW: 'MEOW',
    TURBO: 'TURBO',
    MEME: 'MEME',
    WOJAK: 'WOJAK',
    PONKE: 'PONKE',
  };

  async updateSinglePegPrice(stablecoinId: number): Promise<PegPriceUpdateResult> {
    try {
      // Get stablecoin data
      const { data: stablecoin, error: fetchError } = await supabase
        .from('stablecoins')
        .select('id, pegged_asset, name')
        .eq('id', stablecoinId)
        .single();

      if (fetchError || !stablecoin) {
        return {
          success: false,
          stablecoinId,
          peggedAsset: '',
          error: fetchError?.message || 'Stablecoin not found',
        };
      }

      if (!stablecoin.pegged_asset) {
        return {
          success: false,
          stablecoinId,
          peggedAsset: '',
          error: 'No pegged asset specified',
        };
      }

      // Special case: USD pegged assets always have a peg price of $1.00
      if (stablecoin.pegged_asset.toUpperCase() === 'USD') {
        const exchangeRate = 1.0;

        // Update database with peg price of $1.00
        const { error: updateError } = await supabase
          .from('stablecoins')
          .update({
            peg_price: exchangeRate,
            peg_price_updated_at: new Date().toISOString(),
          })
          .eq('id', stablecoinId);

        if (updateError) {
          return {
            success: false,
            stablecoinId,
            peggedAsset: stablecoin.pegged_asset,
            error: updateError.message,
          };
        }

        console.log(`Updated peg price for ${stablecoin.name} (USD): $${exchangeRate}`);
        return {
          success: true,
          stablecoinId,
          peggedAsset: stablecoin.pegged_asset,
          pegPrice: exchangeRate,
        };
      }

      // Map pegged asset to currency code for non-USD currencies
      const currencyCode = this.currencyMapping[stablecoin.pegged_asset.toUpperCase()];
      if (!currencyCode) {
        return {
          success: false,
          stablecoinId,
          peggedAsset: stablecoin.pegged_asset,
          error: `Unsupported pegged asset: ${stablecoin.pegged_asset}`,
        };
      }

      // Get exchange rate to USD from API
      const exchangeRate = await currencyClient.getExchangeRate(currencyCode, 'USD');
      if (exchangeRate === null) {
        return {
          success: false,
          stablecoinId,
          peggedAsset: stablecoin.pegged_asset,
          error: `Failed to get exchange rate for ${currencyCode}`,
        };
      }

      // Update database with new peg price
      const { error: updateError } = await supabase
        .from('stablecoins')
        .update({
          peg_price: exchangeRate,
          peg_price_updated_at: new Date().toISOString(),
        })
        .eq('id', stablecoinId);

      if (updateError) {
        return {
          success: false,
          stablecoinId,
          peggedAsset: stablecoin.pegged_asset,
          error: updateError.message,
        };
      }

      console.log(
        `Updated peg price for ${stablecoin.name} (${stablecoin.pegged_asset}): $${exchangeRate}`
      );
      return {
        success: true,
        stablecoinId,
        peggedAsset: stablecoin.pegged_asset,
        pegPrice: exchangeRate,
      };
    } catch (error) {
      console.error(`Error updating peg price for stablecoin ${stablecoinId}:`, error);
      return {
        success: false,
        stablecoinId,
        peggedAsset: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updateAllPegPrices(): Promise<PegPriceUpdateResult[]> {
    try {
      // Get all stablecoins with pegged assets
      const { data: stablecoins, error: fetchError } = await supabase
        .from('stablecoins')
        .select('id, pegged_asset, name')
        .not('pegged_asset', 'is', null)
        .not('pegged_asset', 'eq', '');

      if (fetchError) {
        console.error('Error fetching stablecoins for peg price update:', fetchError);
        return [];
      }

      if (!stablecoins || stablecoins.length === 0) {
        console.log('No stablecoins with pegged assets found to update.');
        return [];
      }

      console.log(`Updating peg prices for ${stablecoins.length} stablecoins...`);

      // Group by pegged asset to minimize API calls
      const assetGroups: Record<string, number[]> = {};
      stablecoins.forEach(coin => {
        const asset = coin.pegged_asset.toUpperCase();
        if (!assetGroups[asset]) {
          assetGroups[asset] = [];
        }
        assetGroups[asset].push(coin.id);
      });

      const results: PegPriceUpdateResult[] = [];

      // Process each unique pegged asset
      for (const [asset, coinIds] of Object.entries(assetGroups)) {
        try {
          let exchangeRate: number | null;

          // Special case: USD pegged assets always have a peg price of $1.00
          if (asset === 'USD') {
            exchangeRate = 1.0;
            console.log(`Setting peg price for ${coinIds.length} USD-pegged stablecoins to $1.00`);
          } else {
            // For non-USD currencies, get exchange rate from API
            const currencyCode = this.currencyMapping[asset];
            if (!currencyCode) {
              console.warn(`Unsupported pegged asset: ${asset}`);
              coinIds.forEach(id => {
                results.push({
                  success: false,
                  stablecoinId: id,
                  peggedAsset: asset,
                  error: `Unsupported pegged asset: ${asset}`,
                });
              });
              continue;
            }

            // Get exchange rate for this asset
            exchangeRate = await currencyClient.getExchangeRate(currencyCode, 'USD');

            if (exchangeRate === null) {
              console.warn(`Failed to get exchange rate for ${asset} (${currencyCode})`);
              coinIds.forEach(id => {
                results.push({
                  success: false,
                  stablecoinId: id,
                  peggedAsset: asset,
                  error: `Failed to get exchange rate for ${currencyCode}`,
                });
              });
              continue;
            }
          }

          // Update all stablecoins with this pegged asset
          const { error: updateError } = await supabase
            .from('stablecoins')
            .update({
              peg_price: exchangeRate,
              peg_price_updated_at: new Date().toISOString(),
            })
            .in('id', coinIds);

          if (updateError) {
            console.error(`Error updating peg prices for ${asset}:`, updateError);
            coinIds.forEach(id => {
              results.push({
                success: false,
                stablecoinId: id,
                peggedAsset: asset,
                error: updateError.message,
              });
            });
          } else {
            console.log(
              `Updated peg price for ${coinIds.length} stablecoins pegged to ${asset}: $${exchangeRate}`
            );
            coinIds.forEach(id => {
              results.push({
                success: true,
                stablecoinId: id,
                peggedAsset: asset,
                pegPrice: exchangeRate,
              });
            });
          }
        } catch (error) {
          console.error(`Error processing ${asset}:`, error);
          coinIds.forEach(id => {
            results.push({
              success: false,
              stablecoinId: id,
              peggedAsset: asset,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          });
        }

        // Add delay between different assets to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      return results;
    } catch (error) {
      console.error('Error in updateAllPegPrices:', error);
      return [
        {
          success: false,
          stablecoinId: 0,
          peggedAsset: '',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ];
    }
  }

  // Get current peg price for a stablecoin
  async getStablecoinPegPrice(stablecoinId: number): Promise<{
    pegPrice: number | null;
    lastUpdated: string | null;
    isStale: boolean;
  }> {
    try {
      const { data: stablecoin, error } = await supabase
        .from('stablecoins')
        .select('peg_price, peg_price_updated_at')
        .eq('id', stablecoinId)
        .single();

      if (error || !stablecoin) {
        console.error(`Error fetching peg price for stablecoin ${stablecoinId}:`, error);
        return {
          pegPrice: null,
          lastUpdated: null,
          isStale: true,
        };
      }

      const isStale =
        !stablecoin.peg_price_updated_at ||
        Date.now() - new Date(stablecoin.peg_price_updated_at).getTime() > 24 * 60 * 60 * 1000; // 24 hours

      return {
        pegPrice: stablecoin.peg_price,
        lastUpdated: stablecoin.peg_price_updated_at,
        isStale,
      };
    } catch (error) {
      console.error(`Error getting peg price for stablecoin ${stablecoinId}:`, error);
      return {
        pegPrice: null,
        lastUpdated: null,
        isStale: true,
      };
    }
  }

  // Get all stablecoin peg prices
  async getAllStablecoinPegPrices(): Promise<
    Array<{
      stablecoinId: number;
      peggedAsset: string;
      pegPrice: number | null;
      lastUpdated: string | null;
      isStale: boolean;
    }>
  > {
    try {
      const { data: stablecoins, error } = await supabase
        .from('stablecoins')
        .select('id, pegged_asset, peg_price, peg_price_updated_at')
        .order('id');

      if (error) {
        console.error('Error fetching stablecoin peg prices:', error);
        return [];
      }

      return stablecoins.map(stablecoin => {
        const isStale =
          !stablecoin.peg_price_updated_at ||
          Date.now() - new Date(stablecoin.peg_price_updated_at).getTime() > 24 * 60 * 60 * 1000; // 24 hours

        return {
          stablecoinId: stablecoin.id,
          peggedAsset: stablecoin.pegged_asset,
          pegPrice: stablecoin.peg_price,
          lastUpdated: stablecoin.peg_price_updated_at,
          isStale,
        };
      });
    } catch (error) {
      console.error('Error getting all stablecoin peg prices:', error);
      return [];
    }
  }
}

export const pegPriceUpdater = new PegPriceUpdater();
export type { PegPriceUpdateResult };
