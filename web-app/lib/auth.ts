
// abstraction layer for supabase auth functions

import type { AuthError } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function signInWithEmail(email: string, password: string) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        await handleAuthError(error);
        throw error;
    }
    
    // Guard: don't treat a session-less response as success
    if (!data?.user || !data?.session) {
        throw new Error("Sign in failed: no session returned.");
    }
    return data;

}

export async function handleAuthError(error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Refresh Token")) {
        const supabase = getSupabaseClient();
        await supabase?.auth.signOut(); // clears storage, fires SIGNED_OUT
    }
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
