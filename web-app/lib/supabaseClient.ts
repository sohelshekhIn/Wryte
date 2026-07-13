// creates supabase connection 

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (client) {
    return client;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // keeps user logged in across page reloads
      autoRefreshToken: true, // automatically refreshes the JWT when it expires
      detectSessionInUrl: true, // used for OAuth redirects like google acc, detects the session in the URL and sets it in the client
    },
  });
  return client;
};

export const supabase = getSupabaseClient();
