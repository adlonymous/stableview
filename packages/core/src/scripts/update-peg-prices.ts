import { pegPriceUpdater } from '../services/peg-price-updater.js';

// Export the main update function for cron jobs
export async function updatePegPrices() {
  console.log('Starting scheduled peg price update...');
  try {
    const results = await pegPriceUpdater.updateAllPegPrices();
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(
      `Scheduled peg price update completed: ${successCount} successful, ${errorCount} failed.`
    );

    if (successCount > 0) {
      console.log('Successfully updated peg prices for:');
      results
        .filter(r => r.success)
        .forEach(result => {
          console.log(
            `  - Stablecoin ${result.stablecoinId} (${result.peggedAsset}): $${result.pegPrice}`
          );
        });
    }

    if (errorCount > 0) {
      console.error('Failed to update peg prices for:');
      results
        .filter(r => !r.success)
        .forEach(result => {
          console.error(
            `  - Stablecoin ${result.stablecoinId} (${result.peggedAsset}): ${result.error}`
          );
        });
    }

    return {
      success: true,
      message: 'Peg price update completed successfully',
      results: {
        total: results.length,
        successful: successCount,
        failed: errorCount,
      },
    };
  } catch (error) {
    console.error('Error during scheduled peg price update:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updatePegPrices().catch(console.error);
}
