"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient"; // adjust path to wherever yours lives

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Primary source of truth — fires INITIAL_SESSION on mount,
    // then SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED as they happen.
    // Replaces the old getSession() call completely.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === "SIGNED_OUT") {
          setSession(null);
        } else {
          setSession(newSession);
        }
        setLoading(false);
      }
    );

    // Safety net: never spin longer than 3s
    const timeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn("Auth init timed out; rendering as logged out");
        return false;
      });
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}