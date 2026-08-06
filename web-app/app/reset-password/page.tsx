"use client"

import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"

import { LoginBrandingPanel } from "@/components/auth/login-branding-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage, updatePassword } from "@/lib/auth"
import { getSupabaseClient } from "@/lib/supabaseClient"

type PasswordErrors = {
  password?: string
  confirmation?: string
}

export default function ResetPasswordPage() {
  const supabase = getSupabaseClient()

  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<PasswordErrors>({})
  const [requestError, setRequestError] = useState<string | null>(() =>
    supabase
      ? null
      : "Password reset is unavailable because Supabase is not configured.",
  )
  const [checkingSession, setCheckingSession] = useState(() =>
    Boolean(supabase),
  )
  const [canResetPassword, setCanResetPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updated, setUpdated] = useState(false)

  // Listen for the recovery event and confirm that the reset link is valid before showing the form.
  useEffect(() => {
    if (!supabase) {
      return
    }

    let active = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) {
        return
      }

      if (event === "PASSWORD_RECOVERY" && session) {
        setCanResetPassword(true)
        setRequestError(null)
        setCheckingSession(false)
      }
    })
    // Listen for the session to be retrieved and update the UI accordingly.
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) {
        return
      }

      if (error) {
        setRequestError(getAuthErrorMessage(error))
      } else if (data.session) {
        setCanResetPassword(true)
      } else {
        setRequestError(
          "This password reset link is invalid or has expired. Request a new link.",
        )
      }

      setCheckingSession(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  // Validate the new password and submit it to Supabase once the reset link is accepted.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRequestError(null)

    const nextErrors: PasswordErrors = {}

    if (!password) {
      nextErrors.password = "Enter a new password."
    } else if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters."
    }

    if (!confirmation) {
      nextErrors.confirmation = "Confirm your new password."
    } else if (password !== confirmation) {
      nextErrors.confirmation = "Passwords do not match."
    }

    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      setUpdated(true)
      setPassword("")
      setConfirmation("")
    } catch (error) {
      setRequestError(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh bg-background">
      <section
        aria-labelledby="reset-password-heading"
        className="grid min-h-svh w-full overflow-hidden bg-card md:grid-cols-[minmax(15rem,2fr)_3fr] md:rounded-3xl md:border md:border-border lg:grid-cols-[2fr_3fr]"
      >
        <LoginBrandingPanel />

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-20">
          <div className="w-full max-w-md">
            {checkingSession ? (
              <div aria-live="polite">
                <h1
                  id="reset-password-heading"
                  className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
                >
                  Checking your reset link
                </h1>

                <p className="mt-3 text-muted-foreground">
                  Please wait a moment.
                </p>
              </div>
            ) : updated ? (
              <div aria-live="polite">
                <h1
                  id="reset-password-heading"
                  className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
                >
                  Password updated
                </h1>

                <p className="mt-3 text-muted-foreground">
                  Your new password is ready to use.
                </p>

                <Button asChild className="mt-8 h-12 w-full text-base">
                  <Link href="/">Continue to Wryte</Link>
                </Button>
              </div>
            ) : !canResetPassword ? (
              <div>
                <h1
                  id="reset-password-heading"
                  className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
                >
                  Reset link unavailable
                </h1>

                {requestError ? (
                  <p role="alert" className="mt-3 text-sm text-destructive">
                    {requestError}
                  </p>
                ) : null}

                <Button asChild className="mt-8 h-12 w-full text-base">
                  <Link href="/forgot-password">Request another link</Link>
                </Button>
              </div>
            ) : (
              <>
                <header className="mb-8">
                  <h1
                    id="reset-password-heading"
                    className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
                  >
                    Choose a new password
                  </h1>

                  <p className="mt-2 text-muted-foreground">
                    Use at least 8 characters.
                  </p>
                </header>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>

                    <div className="relative">
                      <Input
                        id="new-password"
                        name="new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
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
                          fieldErrors.password
                            ? "new-password-error"
                            : undefined
                        }
                        className="h-12 rounded-md px-4 pr-12 text-base"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((current) => !current)}
                        disabled={loading}
                        className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff aria-hidden="true" className="size-5" />
                        ) : (
                          <Eye aria-hidden="true" className="size-5" />
                        )}
                      </button>
                    </div>

                    {fieldErrors.password ? (
                      <p
                        id="new-password-error"
                        className="text-sm text-destructive"
                      >
                        {fieldErrors.password}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">
                      Confirm new password
                    </Label>

                    <div className="relative">
                      <Input
                        id="confirm-new-password"
                        name="confirm-new-password"
                        type={showConfirmation ? "text" : "password"}
                        autoComplete="new-password"
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
                        disabled={loading}
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
                        disabled={loading}
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

                  {requestError ? (
                    <p
                      role="alert"
                      aria-live="polite"
                      className="text-sm text-destructive"
                    >
                      {requestError}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full text-base"
                  >
                    {loading ? "Updating password..." : "Update password"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
