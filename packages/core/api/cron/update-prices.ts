// Vercel cron job for updating stablecoin prices every 30 minutes
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
    console.log('🔄 Starting price update...');
    
    // Import and run the update-prices script
    const { updatePrices } = await import('../../src/scripts/update-prices.js');
    
    const result = await updatePrices();
    
    if (result.success) {
      console.log('✅ Price update completed successfully');
      return res.status(200).json({ 
        success: true, 
        message: 'Price update completed successfully',
        timestamp: new Date().toISOString(),
        result 
      });
    } else {
      console.error('❌ Price update failed:', result.error);
      return res.status(500).json({ 
        success: false, 
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Price update error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
