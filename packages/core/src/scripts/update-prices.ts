#!/usr/bin/env node

import { priceUpdater } from '../services/price-updater.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export the main update function for cron jobs
export async function updatePrices() {
  console.log('Starting scheduled price update...');
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    const results = await priceUpdater.updateAllPrices();

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`Price update completed:`);
    console.log(`- Total: ${results.length}`);
    console.log(`- Successful: ${successCount}`);
    console.log(`- Failed: ${errorCount}`);

    if (errorCount > 0) {
      console.log('Failed updates:');
      results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - Stablecoin ${r.stablecoinId}: ${r.error}`));
    }

    console.log('Scheduled price update finished');
    return {
      success: true,
      message: 'Price update completed successfully',
      results: {
        total: results.length,
        successful: successCount,
        failed: errorCount,
      },
    };
  } catch (error) {
    console.error('Error in scheduled price update:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updatePrices().catch(console.error);
}
