// dashboardUtils.js
import { supabase } from "./SupabaseClient";

export const fetchArtistData = async (artistEmail) => {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("email", artistEmail)
    .single();

  if (error) {
    throw error;
  }
  return { data };
};

export const fetchAllArtists = async () => {
  const { data, error } = await supabase.from("artists").select("*");
  if (error) {
    console.log(error);
    throw error;
  }
  return { data };
};

export const fetchArtistByFullName = async (artistId) => {
  const { data, error } = await supabase.from("artists").select("*").eq("id", artistId);
  if (error) {
    console.log(error);
    throw error;
  }
  return { data };
}
