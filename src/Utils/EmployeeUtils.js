import { createClient } from '@supabase/supabase-js';
import { supabase } from './SupabaseClient';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
// Initialize Supabase client
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey // Ensure this is the service role key
);

/**
 * Creates a new employee in the auth.users table.
 * @param {string} email - The employee's email.
 * @param {string} password - The employee's password.
 * @param {Object} metadata - Additional user metadata (e.g., name, role).
 * @returns {Promise<Object>} - The created user data or an error.
 */
export const createEmployee = async (email, password, metadata = {}) => {
  try {
    // Add user to auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (authError) {
      console.error('Error creating user in auth.users:', authError);
      return { error: authError };
    }

    console.log('User added to auth.users:', authUser);

    // Add user to users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authUser.user.id, // Match UUID from auth.users
          email,
          role: metadata.role || 'artist', // Default to 'artist'
          name: metadata.name || '', // Optional
          phone: metadata.phone || '', // Optional
        },
      ]);

    if (userError) {
      console.error('Error adding user to users table:', userError);
      return { error: userError };
    }

    console.log('User added to users table:', userData);
    return { data: { authUser, userData } };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
};

export const fetchEmployeeByEmail = async (email) => {
  if (!email) {
    return { error: 'Email is required to fetch an employee.' };
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return { error };
    }

    const employee = data.users.find((user) => user.email === email);

    if (!employee) {
      console.error('Employee with the provided email not found.');
      return { error: 'No employee found with the provided email.' };
    }

    console.log('Employee fetched:', employee);
    return { data: employee };
  } catch (err) {
    console.error('Unexpected error in fetchEmployeeByEmail:', err);
    return { error: err.message };
  }
};