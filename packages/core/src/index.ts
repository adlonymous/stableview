import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export version information
export const VERSION = '0.1.0';

// Browser-safe exports
export const isBrowser = typeof globalThis !== 'undefined' && 
                         typeof process === 'undefined' || 
                         (typeof process !== 'undefined' && 
                          process.env?.BROWSER === 'true');

// Import and re-export database functions
export { createDb, schema } from './db/index.js';
export { stablecoins } from './db/schema.js';

// Import and re-export server functions
export * from './server/index.js';
export * from './services/index.js';
