import { supabaseAdmin } from './SupabaseClient';

// Fetch all users (no changes here)
export const fetchAllUsers = async () => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*');
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  return data;
};

// Create a new employee (using the service key for admin privileges)
export const createEmployee = async ({ email, password, role, name, phone }) => {
  if (!supabaseAdmin) {
    throw new Error('supabaseAdmin client is not initialized. Check your service role key.');
  }

  try {
    // Step 1: Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    });

    if (authError) {
      console.error('Error creating user in Auth:', authError);
      throw authError;
    }

    console.log('Auth User:', authUser); // Debug authUser here
    const newUserId = authUser?.id;

    if (!newUserId) {
      throw new Error('Auth user creation failed. ID is null or undefined.');
    }

    // Step 2: Insert the user into the `users` table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: newUserId,
          email,
          role,
          name,
          phone,
        },
      ]);

    if (userError) {
      console.error('Error inserting user into users table:', userError);
      throw userError;
    }

    console.log('User successfully created:', { authUser, userData });
    return { authUser, userData };
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Update an employee (both in Auth and `users` table)
export const updateEmployee = async ({ userId, email, password, role, name, phone }) => {
  try {
    // Update Auth user (only if email/password is provided)
    if (email || password) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email,
        password,
      });
      if (authError) {
        console.error('Error updating user in Auth:', authError);
        throw authError;
      }
    }

    // Update the `users` table
    const { data: updatedUser, error: userError } = await supabaseAdmin
      .from('users')
      .update({
        email,
        role,
        name,
        phone,
      })
      .eq('id', userId);
    if (userError) {
      console.error('Error updating user in users table:', userError);
      throw userError;
    }

    console.log('User successfully updated:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (userId) => {
  try {
    // Delete from Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('Error deleting user in Auth:', authError);
      throw authError;
    }

    // Delete from `users` table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);
    if (userError) {
      console.error('Error deleting user from users table:', userError);
      throw userError;
    }

    console.log(`User with ID ${userId} successfully deleted.`);
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};
