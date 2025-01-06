// src/Utils/auth.js
import { supabase } from './SupabaseClient';

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
  // data has { user, session }
  return data;
};

/**
 * Get the role for the current logged-in user from the "users" table.
 * This assumes you have a "users" table in Supabase with a "role" column.
 */
export const getUserRole = async () => {
  // First, get the currently authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('No user found or error retrieving user.');
  }

  // Fetch the user's role from your "users" table
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    throw new Error('Error retrieving user role.');
  }

  return data.role; // 'artist' or 'admin'
};