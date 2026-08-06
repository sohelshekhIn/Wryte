"use client"

import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { GoogleIcon } from "@/components/auth/google-icon"
import { LoginBrandingPanel } from "@/components/auth/login-branding-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getAuthErrorMessage,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth"

type SignupFieldErrors = {
  fullName?: string
  email?: string
  password?: string
  confirmation?: string
}

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const busy = loading || oauthLoading

  // Validate the form and submit the new account request with client-side feedback.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const normalizedName = fullName.trim()
    const normalizedEmail = email.trim()
    const nextErrors: SignupFieldErrors = {}

    if (!normalizedName) {
      nextErrors.fullName = "Enter your full name."
    }

    if (!normalizedEmail) {
      nextErrors.email = "Enter your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Create a password."
    } else if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters."
    }

    if (!confirmation) {
      nextErrors.confirmation = "Confirm your password."
    } else if (password !== confirmation) {
      nextErrors.confirmation = "Passwords do not match."
    }

    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const { session } = await signUpWithEmail(
        normalizedName,
        normalizedEmail,
        password,
      )

      if (session) {
        router.replace("/")
        router.refresh()
        return
      }

      setSubmitted(true)
      setPassword("")
      setConfirmation("")
    } catch (error) {
      setError(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  // Start the Google OAuth flow and send users back to the auth callback route.
  async function handleGoogleSignUp() {
    setError(null)
    setOauthLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth/callback`

      await signInWithGoogle(true, redirectTo)
    } catch (error) {
      setError(getAuthErrorMessage(error))
      setOauthLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh bg-background">
      <section
        aria-labelledby="signup-heading"
        className="grid min-h-svh w-full overflow-hidden bg-card md:grid-cols-[minmax(15rem,2fr)_3fr] md:rounded-3xl md:border md:border-border lg:grid-cols-[2fr_3fr]"
      >
        <LoginBrandingPanel quote="Plan your book, manage chapters and scenes, and brainstorm with AI — all in one place." />

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-20">
          <div className="w-full max-w-md">
            {submitted ? (
              <div aria-live="polite">
                <h1
                  id="signup-heading"
                  className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
                >
                  Check your email
                </h1>

                <p className="mt-3 leading-relaxed text-muted-foreground">
                  If email confirmation is enabled, open the message from Wryte
                  to finish creating your account.
                </p>

                <Button asChild className="mt-8 h-12 w-full text-base">
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            ) : (
              <>
                <header className="mb-8">
                  <h1
                    id="signup-heading"
                    className="font-serif text-3xl leading-tight font-bold text-foreground sm:text-4xl"
                  >
                    Start your book
                  </h1>

                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Create an account and open a calm space to write.
                  </p>
                </header>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full name</Label>

                    <Input
                      id="full-name"
                      name="full-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value)

                        if (fieldErrors.fullName) {
                          setFieldErrors((current) => ({
                            ...current,
                            fullName: undefined,
                          }))
                        }
                      }}
                      aria-invalid={Boolean(fieldErrors.fullName)}
                      aria-describedby={
                        fieldErrors.fullName ? "full-name-error" : undefined
                      }
                      className="h-12 rounded-md px-4 text-base"
                      disabled={busy}
                    />

                    {fieldErrors.fullName ? (
                      <p
                        id="full-name-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.fullName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>

                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)

                        if (fieldErrors.email) {
                          setFieldErrors((current) => ({
                            ...current,
                            email: undefined,
                          }))
                        }
                      }}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={
                        fieldErrors.email ? "signup-email-error" : undefined
                      }
                      className="h-12 rounded-md px-4 text-base"
                      disabled={busy}
                    />

                    {fieldErrors.email ? (
                      <p
                        id="signup-email-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>

                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create a password"
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
                        aria-describedby={
                          fieldErrors.password
                            ? "signup-password-help signup-password-error"
                            : "signup-password-help"
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
                        className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff aria-hidden="true" className="size-5" />
                        ) : (
                          <Eye aria-hidden="true" className="size-5" />
                        )}
                      </button>
                    </div>

                    <p
                      id="signup-password-help"
                      className="text-sm text-muted-foreground"
                    >
                      Use at least 8 characters. A longer, unique passphrase is
                      stronger.
                    </p>

                    {fieldErrors.password ? (
                      <p
                        id="signup-password-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.password}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>

                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmation ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={confirmation}
                        onChange={(event) => {
                          setConfirmation(event.target.value)

                          if (fieldErrors.confirmation) {
                            setFieldErrors((current) => ({
                              ...current,
                              confirmation: undefined,
                            }))
                          }
                        }}
                        aria-invalid={Boolean(fieldErrors.confirmation)}
                        aria-describedby={
                          fieldErrors.confirmation
                            ? "confirmation-error"
                            : undefined
                        }
                        className="h-12 rounded-md px-4 pr-12 text-base"
                        disabled={busy}
                      />

                      <button
                        type="button"
                        aria-label={
                          showConfirmation
                            ? "Hide confirmed password"
                            : "Show confirmed password"
                        }
                        aria-pressed={showConfirmation}
                        onClick={() =>
                          setShowConfirmation((current) => !current)
                        }
                        disabled={busy}
                        className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {showConfirmation ? (
                          <EyeOff aria-hidden="true" className="size-5" />
                        ) : (
                          <Eye aria-hidden="true" className="size-5" />
                        )}
                      </button>
                    </div>

                    {fieldErrors.confirmation ? (
                      <p
                        id="confirmation-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.confirmation}
                      </p>
                    ) : null}
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
                    disabled={busy}
                    className="h-12 w-full bg-sage-500 text-base font-semibold hover:bg-sage-600 active:bg-sage-700"
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>

                  <div
                    className="flex items-center gap-3 py-1"
                    aria-hidden="true"
                  >
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-sm text-muted-foreground">or</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignUp}
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
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-sage-700 underline-offset-4 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
