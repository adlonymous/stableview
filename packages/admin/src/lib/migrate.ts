import { db, stablecoins } from './db';

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // This will create the tables based on the schema
    // Note: In a real app, you'd use drizzle-kit for migrations
    console.log('Tables should be created automatically based on schema');
    
    // Test the connection by running a simple query
    const result = await db.select().from(stablecoins).limit(1);
    console.log('Database connection successful!');
    console.log('Current stablecoins count:', result.length);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations }; 