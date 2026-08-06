"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { LoginBrandingPanel } from "@/components/auth/login-branding-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getAuthErrorMessage,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/auth"
import { Eye, EyeOff } from "lucide-react"
import { GoogleIcon } from "@/components/auth/google-icon"

type FieldErrors = {
  email?: string
  password?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const busy = loading || oauthLoading
  const [error, setError] = useState<string | null>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Validate the form fields before calling the email sign-in flow.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const normalizedEmail = email.trim()
    const nextErrors: FieldErrors = {}

    if (!normalizedEmail) {
      nextErrors.email = "Enter your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Enter your password."
    }

    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      await signInWithEmail(normalizedEmail, password, rememberMe)
      router.push("/")
      return
    } catch (err) {
      setError(getAuthErrorMessage(err))
    }

    setLoading(false)
  }

  // Launch the Google OAuth sign-in flow with the current persistence preference.
  async function handleGoogleSignIn() {
    setError(null)
    setOauthLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth/callback`

      await signInWithGoogle(rememberMe, redirectTo)
    } catch (error) {
      setError(getAuthErrorMessage(error))
      setOauthLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh bg-background">
      <section
        aria-labelledby="login-heading"
        className="grid min-h-svh w-full overflow-hidden bg-card md:grid-cols-[minmax(15rem,2fr)_3fr] md:rounded-3xl md:border md:border-border lg:grid-cols-[2fr_3fr]"
      >
        <LoginBrandingPanel />

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-20">
          <div className="w-full max-w-md">
            <header className="mb-8">
              <h1
                id="login-heading"
                className="font-serif text-3xl leading-tight font-bold text-foreground sm:text-4xl"
              >
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Log in to keep working on your book.
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    // Clear the email field error if the user starts typing again
                    if (fieldErrors.email) {
                      setFieldErrors((current) => ({
                        ...current,
                        email: undefined,
                      }))
                    }
                  }}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                  className="h-12 rounded-md px-4 text-base"
                  disabled={busy}
                />

                {fieldErrors.email ? (
                  <p id="email-error" className="text-sm text-destructive">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)

                      if (fieldErrors.password) {
                        setFieldErrors((current) => ({
                          ...current,
                          password: undefined,
                        }))
                      }
                    }}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? "password-error" : undefined
                    }
                    className="h-12 rounded-md px-4 pr-12 text-base"
                    disabled={busy}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={busy}
                    className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="size-5" />
                    ) : (
                      <Eye aria-hidden="true" className="size-5" />
                    )}
                  </button>
                </div>

                {fieldErrors.password ? (
                  <p id="password-error" className="text-sm text-destructive">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    name="remember-me"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    disabled={busy}
                    className="size-5 rounded-md border-border accent-sage-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <span>Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-sage-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  Forgot password?
                </Link>
              </div>

              {error ? (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-12 w-full bg-sage-500 text-base font-semibold hover:bg-sage-600 active:bg-sage-700"
                disabled={busy}
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>

              <div className="flex items-center gap-3 py-1" aria-hidden="true">
                <span className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={busy}
                className="h-12 w-full border-border bg-white text-base font-medium text-foreground hover:bg-muted"
              >
                <GoogleIcon aria-hidden="true" className="size-5" />
                {oauthLoading
                  ? "Connecting to Google..."
                  : "Continue with Google"}
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              New to Wryte?{" "}
              <Link
                href="/signup"
                className="font-semibold text-sage-700 underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
