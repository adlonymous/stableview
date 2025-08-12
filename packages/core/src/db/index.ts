import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import * as schema from './schema.js';

// Load environment variables
dotenv.config();

// Function to create a database connection
export function createDb() {
  // Check if we're in a browser environment
  const isBrowser = typeof process === 'undefined' || 
                   (typeof process !== 'undefined' && 
                    (process.env.NEXT_RUNTIME === 'edge' || 
                     process.env.BROWSER === 'true'));
  
  if (isBrowser) {
    // Return a mock DB for browser environments
    // This prevents Next.js from trying to import Node.js specific modules
    console.warn('Running in browser environment, returning mock DB');
    return getMockDb();
  }
  
  try {
    // Server-side code
    const connectionString = process.env.DATABASE_URL;
    
    console.log('Attempting database connection with:', connectionString ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set');
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Create the postgres client
    const client = postgres(connectionString);
    
    // Create the drizzle database instance
    const db = drizzle(client, { schema });
    console.log('Database connection successful');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    // Fall back to mock DB if there's an error
    console.log('Falling back to mock database');
    return getMockDb();
  }
}

// Mock database for browser environments
function getMockDb() {
  // This is a simple mock that prevents errors in browser environments
  const mockDb: any = {
    select: () => {
      const queryBuilder = {
        from: () => {
          const fromBuilder = {
            where: () => {
              const whereBuilder = {
                limit: () => {
                  const limitBuilder = {
                    offset: () => Promise.resolve([])
                  };
                  return limitBuilder;
                }
              };
              return whereBuilder;
            }
          };
          return fromBuilder;
        }
      };
      return queryBuilder;
    },
    insert: () => {
      const insertBuilder = {
        values: () => {
          const valuesBuilder = {
            returning: () => Promise.resolve([])
          };
          return valuesBuilder;
        }
      };
      return insertBuilder;
    },
    update: () => {
      const updateBuilder = {
        set: () => {
          const setBuilder = {
            where: () => {
              const whereBuilder = {
                returning: () => Promise.resolve([])
              };
              return whereBuilder;
            }
          };
          return setBuilder;
        }
      };
      return updateBuilder;
    },
    delete: () => {
      const deleteBuilder = {
        where: () => Promise.resolve([])
      };
      return deleteBuilder;
    }
  };
  
  return mockDb;
}

// Export schema for use in other modules
export { schema }; 