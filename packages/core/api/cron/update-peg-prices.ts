// Vercel cron job for updating stablecoin peg prices every 30 minutes
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
    console.log('🔄 Starting peg price update...');

    // Import and run the update-peg-prices script
    const { updatePegPrices } = await import('../../src/scripts/update-peg-prices.js');

    const result = await updatePegPrices();

    if (result.success) {
      console.log('✅ Peg price update completed successfully');
      return res.status(200).json({
        success: true,
        message: 'Peg price update completed successfully',
        timestamp: new Date().toISOString(),
        result,
      });
    } else {
      console.error('❌ Peg price update failed:', result.error);
      return res.status(500).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('❌ Peg price update error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
