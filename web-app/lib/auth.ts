// abstraction layer for supabase auth functions

import type { AuthError } from "@supabase/supabase-js"
import { getSupabaseClient, setAuthPersistence } from "@/lib/supabaseClient"

// Sign in with email and password while honoring the user's persistence preference.
export async function signInWithEmail(
  email: string,
  password: string,
  remember: boolean,
) {
  setAuthPersistence(remember)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    await handleAuthError(error)
    throw error
  }

  // Guard: don't treat a session-less response as success
  if (!data?.user || !data?.session) {
    throw new Error("Sign in failed: no session returned.")
  }
  return data
}

// Start the Google OAuth flow and redirect back to the callback page after auth.
export async function signInWithGoogle(
  remember: boolean,
  redirectTo: string,
): Promise<void> {
  setAuthPersistence(remember)

  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  })

  if (error) {
    throw error
  }
}

export async function requestPasswordReset(
  email: string,
  redirectTo: string,
): Promise<void> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    throw error
  }
}

export async function updatePassword(newPassword: string): Promise<void> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw error
  }
}

// Clear stale auth state when Supabase reports a refresh-token issue.
export async function handleAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : ""
  if (message.includes("Refresh Token")) {
    const supabase = getSupabaseClient()
    await supabase?.auth.signOut() // clears storage, fires SIGNED_OUT
  }
}
// Create the user account in Supabase Auth and attach the full name to the profile data.
export async function signUpWithEmail(
  fullName: string,
  email: string,
  password: string,
) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

// clears the session and removes the JWT token from local storage, effectively logging the user out.
export async function signOut() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getSession() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return null
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  const authError = error as AuthError | undefined
  return authError?.message ?? "Something went wrong. Please try again."
}
