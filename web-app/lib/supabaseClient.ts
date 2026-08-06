import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const PERSISTENCE_PREFERENCE_KEY = "wryte-auth-persistence"

type AuthPersistence = "local" | "session"

let client: SupabaseClient | null = null

// Resolve whether the current browser session should use local or session storage.
function getAuthPersistence(): AuthPersistence {
  if (typeof window === "undefined") {
    return "local"
  }

  return window.sessionStorage.getItem(PERSISTENCE_PREFERENCE_KEY) === "session"
    ? "session"
    : "local"
}

// Persist the user's preference for how auth tokens should be stored.
export function setAuthPersistence(remember: boolean): void {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    PERSISTENCE_PREFERENCE_KEY,
    remember ? "local" : "session",
  )
}

const authStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") {
      return null
    }

    const useLocalStorage = getAuthPersistence() === "local"
    const primaryStorage = useLocalStorage
      ? window.localStorage
      : window.sessionStorage
    const fallbackStorage = useLocalStorage
      ? window.sessionStorage
      : window.localStorage

    return primaryStorage.getItem(key) ?? fallbackStorage.getItem(key)
  },

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") {
      return
    }

    const useLocalStorage = getAuthPersistence() === "local"
    const targetStorage = useLocalStorage
      ? window.localStorage
      : window.sessionStorage
    const otherStorage = useLocalStorage
      ? window.sessionStorage
      : window.localStorage

    targetStorage.setItem(key, value)
    otherStorage.removeItem(key)
  },

  removeItem(key: string): void {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  },
}

// Create the shared Supabase client once and reuse it across the app.
export const getSupabaseClient = (): SupabaseClient | null => {
  if (client) {
    return client
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: authStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return client
}

export const supabase = getSupabaseClient()
