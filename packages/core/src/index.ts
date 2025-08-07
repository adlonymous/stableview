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

// Create a safe export mechanism that doesn't try to load Node.js modules in the browser
// This approach completely avoids trying to import server-side modules in the browser
if (!isBrowser) {
  // Server-side only code
  try {
    // We need to use require instead of import to prevent bundling these modules
    // in the client-side code
    const serverModule = require('./server/index.js');
    const dbModule = require('./db/index.js');
    const servicesModule = require('./services/index.js');
    
    // Export all the server-side modules
    Object.assign(exports, serverModule);
    Object.assign(exports, dbModule);
    Object.assign(exports, servicesModule);
    
    // Export schema types directly for TypeScript
    Object.assign(exports, require('./db/schema.js'));
  } catch (error) {
    console.error('Error loading server-side modules:', error);
  }
} else {
  // Browser-side code
  console.warn('Running in browser environment, server-side modules are not available');
}
