
// abstraction layer for supabase auth functions

import type { AuthError } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function signInWithEmail(email: string, password: string) {
    const supabase = getSupabaseClient();

    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    // user enters email and password and Supabase validates the credentials against the database. 
    // If valid, it creates a session
    // and returns a JWT token if successful, or an error if not. 
    // The JWT token is then stored in the browser's local storage for future requests.
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}


//creates user in auth.users
// hashes password internally
// may send email verification (depending config)
// returns session or user object
export async function signUpWithEmail(email: string, password: string) {
    const supabase = getSupabaseClient();

    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}


// clears the session and removes the JWT token from local storage, effectively logging the user out.
export async function signOut() {
    const supabase = getSupabaseClient();

    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function getSession() {
    const supabase = getSupabaseClient();

    if (!supabase) {
        return null;
    }

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session;
}

export function getAuthErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    const authError = error as AuthError | undefined;
    return authError?.message ?? "Something went wrong. Please try again.";
}
