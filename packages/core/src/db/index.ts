import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client with service role key for admin operations
export function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required'
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('Supabase client created successfully with service role key');
  return supabase;
}

// Export a default client instance
export const supabase = createSupabaseClient();
