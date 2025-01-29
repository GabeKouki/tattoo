// dashboardUtils.js
import { supabase } from './SupabaseClient';

export const fetchArtistData = async (artistEmail) => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('email', artistEmail)
    .single();
  return { data, error };
};

export const fetchAppointments = async (userId) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('artist_id', userId);
  return { data, error };
};

export const fetchAvailability = async (userId) => {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('artist_id', userId);
  return { data, error };
};

export const fetchTestimonials = async (userId) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('artist_id', userId);
  return { data, error };
};