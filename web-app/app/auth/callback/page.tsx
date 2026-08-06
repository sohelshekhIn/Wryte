"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { LoginBrandingPanel } from "@/components/auth/login-branding-panel"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabaseClient"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  const [error, setError] = useState<string | null>(null)

  // Wait for Supabase to expose the OAuth session and then redirect the user back into the app.
  useEffect(() => {
    if (!supabase) {
      return
    }

    let active = true

    function finishSignIn() {
      router.replace("/")
      router.refresh()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) {
        finishSignIn()
      }
    })

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) {
        return
      }

      if (sessionError) {
        setError("Google sign-in could not be completed. Please try again.")
        return
      }

      if (data.session) {
        finishSignIn()
        return
      }

      const searchParameters = new URLSearchParams(window.location.search)
      const hashParameters = new URLSearchParams(
        window.location.hash.replace(/^#/, ""),
      )

      const oauthError =
        searchParameters.get("error") ?? hashParameters.get("error")

      setError(
        oauthError
          ? "Google sign-in was cancelled or could not be completed."
          : "No authentication session was returned. Please try again.",
      )
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const displayedError = supabase
    ? error
    : "Google sign-in is unavailable because Supabase is not configured."

  return (
    <main className="flex min-h-svh bg-background">
      <section
        aria-labelledby="callback-heading"
        className="grid min-h-svh w-full overflow-hidden bg-card md:grid-cols-[minmax(15rem,2fr)_3fr] md:rounded-3xl md:border md:border-border lg:grid-cols-[2fr_3fr]"
      >
        <LoginBrandingPanel />

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-20">
          <div className="w-full max-w-md">
            <h1
              id="callback-heading"
              className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
            >
              {displayedError ? "Sign-in unsuccessful" : "Finishing sign-in"}
            </h1>

            {displayedError ? (
              <>
                <p
                  role="alert"
                  className="mt-3 text-sm leading-relaxed text-destructive"
                >
                  {displayedError}
                </p>

                <Button asChild className="mt-8 h-12 w-full text-base">
                  <Link href="/login">Return to login</Link>
                </Button>
              </>
            ) : (
              <p aria-live="polite" className="mt-3 text-muted-foreground">
                Please wait while we securely finish signing you in.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
