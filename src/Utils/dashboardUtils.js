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
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
    throw error;
  }
  return { data };
};

export const fetchArtistById = async (artistId) => {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", artistId);
  if (error) {
    console.log(error);
    throw error;
  }
  return { data };
};

export const fetchArtistByEmail = async (email) => {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("email", email);
  if (error) {
    console.log(error);
    throw error;
  }
  return { data };
};

export const logoutUser = async () => {
  const { data, error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    throw error;
  }
  return { data };
};

export const deleteArtist = async (artistId) => {
  const { data: artistsTableData, error: artistsTableError } = await supabase
    .from("artists")
    .delete()
    .eq("id", artistId);
  const {
    data: authTableData,
    error: authTableError,
  } = await supabase.auth.deleteUser(artistId);
  if (artistsTableError || authTableError) {
    console.log(artistsTableError || authTableError);
    throw artistsTableError || authTableError;
  }
  return { artistsTableData, authTableData };
};

export const createAuthUser = async ({
  email,
  password,
  first_name,
  last_name,
}) => {
  const displayName = `${first_name} ${last_name}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const createArtist = async ({
  email,
  first_name,
  last_name,
  completed_setup,
  role,
}) => {
  const { data, error } = await supabase
    .from("artists")
    .insert([{ email, first_name, last_name, completed_setup, role }]);
  if (error) throw error;
  return data;
};

export const fetchAppointmentsByArtistId = async (artistId) => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("artist_id", artistId)
  if (error) throw error;
  return data;
};
