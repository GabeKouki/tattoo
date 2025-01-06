// src/Utils/Inquiries.js

import { supabase } from './SupabaseClient';
import { getUserRole } from './Auth';

/**
 * Fetch all inquiries, or only those belonging to the current artist.
 * @returns {Array} list of inquiry objects
 */
export const fetchInquiries = async () => {
  // 1) Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('No logged-in user found.');
  }

  // 2) Get the user role
  const role = await getUserRole();

  // 3) Build the query
  let query = supabase.from('inquiries').select('*');

  // If role === 'artist', only retrieve inquiries where artist_id matches user.id
  if (role === 'artist') {
    query = query.eq('artist_id', user.id);
  }

  // 4) Perform the query
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data; // array of inquiries
};
