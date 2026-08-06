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

  useEffect(() => {
    if (!supabase) {
      return
    }

    const client = supabase
    let active = true

    async function finishAuthentication() {
      const searchParameters = new URLSearchParams(window.location.search)
      const hashParameters = new URLSearchParams(
        window.location.hash.replace(/^#/, ""),
      )

      const oauthError =
        searchParameters.get("error") ?? hashParameters.get("error")

      if (oauthError) {
        window.history.replaceState({}, "", window.location.pathname)

        if (active) {
          setError("Google sign-in was cancelled or could not be completed.")
        }

        return
      }

      const authorizationCode = searchParameters.get("code")
      const accessToken = hashParameters.get("access_token")
      const refreshToken = hashParameters.get("refresh_token")

      if (authorizationCode) {
        window.history.replaceState({}, "", window.location.pathname)

        const { error: exchangeError } =
          await client.auth.exchangeCodeForSession(authorizationCode)

        if (!active) {
          return
        }

        if (exchangeError) {
          setError("Google sign-in could not be completed. Please try again.")
          return
        }

        router.replace("/")
        router.refresh()
        return
      }

      if (accessToken && refreshToken) {
        window.history.replaceState({}, "", window.location.pathname)

        const { error: sessionError } = await client.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (!active) {
          return
        }

        if (sessionError) {
          setError("Google sign-in could not be completed. Please try again.")
          return
        }

        router.replace("/")
        router.refresh()
        return
      }

      const {
        data: { session },
        error: sessionError,
      } = await client.auth.getSession()

      if (!active) {
        return
      }

      if (sessionError || !session) {
        setError("No authentication session was returned. Please try again.")
        return
      }

      router.replace("/")
      router.refresh()
    }

    void finishAuthentication()

    return () => {
      active = false
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
