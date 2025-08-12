#!/usr/bin/env node

import { createMetricsFetcher } from '../services/metrics-fetcher.js';

/**
 * Script to fetch metrics for all stablecoins
 * This script can be run as a scheduled job (e.g., using cron)
 */
async function main() {
  try {
    console.log('Starting metrics fetch job...');

    const metricsFetcher = createMetricsFetcher();
    await metricsFetcher.fetchAllMetrics();

    console.log('Metrics fetch job completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error in metrics fetch job:', error);
    process.exit(1);
  }
}

// Run the main function
main();
