import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('Supabase URL, anon key, or service role key is missing in environment variables.');
}

// console.log('Supabase URL:', supabaseUrl);
// console.log('Anon Key:', supabaseAnonKey);
// console.log('Service Role Key:', supabaseServiceRoleKey ? 'Loaded' : 'Not Loaded');

// Regular client (for general operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for privileged operations)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
