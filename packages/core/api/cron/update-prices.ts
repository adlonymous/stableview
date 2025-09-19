// Vercel cron job for updating stablecoin prices and peg prices daily
import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests (Vercel cron jobs send POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the request is from Vercel cron
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Starting price and peg price update...');

    // Import and run both update scripts
    const { updatePrices } = await import('../../src/scripts/update-prices.js');
    const { updatePegPrices } = await import('../../src/scripts/update-peg-prices.js');

    // Run both updates in parallel
    const [priceResult, pegPriceResult] = await Promise.all([updatePrices(), updatePegPrices()]);

    const allSuccessful = priceResult.success && pegPriceResult.success;

    if (allSuccessful) {
      console.log('✅ Price and peg price update completed successfully');
      return res.status(200).json({
        success: true,
        message: 'Price and peg price update completed successfully',
        timestamp: new Date().toISOString(),
        results: {
          prices: priceResult,
          pegPrices: pegPriceResult,
        },
      });
    } else {
      console.error('❌ Price/peg price update failed:', { priceResult, pegPriceResult });
      return res.status(500).json({
        success: false,
        error: 'One or more updates failed',
        timestamp: new Date().toISOString(),
        results: {
          prices: priceResult,
          pegPrices: pegPriceResult,
        },
      });
    }
  } catch (error) {
    console.error('❌ Price/peg price update error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
