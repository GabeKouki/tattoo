import { supabase } from './SupabaseClient'

export default async function SignIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

