import { supabase } from './SupabaseClient';


export const insertAppointment = async (appointmentParams) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentParams])
      .select()

    if (error) throw error;

    return data;
  } catch (err) {
    console.error('Error inserting appointment:', err);
    throw err;
  }
}