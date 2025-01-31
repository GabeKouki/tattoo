import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey ) {
  console.error('Supabase URL, anon key is missing in environment variables.');
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

