"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"

import { LoginBrandingPanel } from "@/components/auth/login-branding-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage, requestPasswordReset } from "@/lib/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Validate the email address and request a reset link for the account.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEmailError(null)
    setRequestError(null)

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setEmailError("Enter your email address.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError("Enter a valid email address.")
      return
    }

    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/reset-password`

      await requestPasswordReset(normalizedEmail, redirectTo)
      setSubmitted(true)
    } catch (error) {
      setRequestError(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh bg-background">
      <section
        aria-labelledby="forgot-password-heading"
        className="grid min-h-svh w-full overflow-hidden bg-card md:grid-cols-[minmax(15rem,2fr)_3fr] md:rounded-3xl md:border md:border-border lg:grid-cols-[2fr_3fr]"
      >
        <LoginBrandingPanel />

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-20">
          <div className="w-full max-w-md">
            {submitted ? (
              <div aria-live="polite">
                <h1
                  id="forgot-password-heading"
                  className="font-serif text-3xl leading-tight font-bold text-foreground sm:text-4xl"
                >
                  Check your email
                </h1>

                <p className="mt-3 leading-relaxed text-muted-foreground">
                  If an account exists for that email address, we sent password
                  reset instructions.
                </p>

                <Button asChild className="mt-8 h-12 w-full text-base">
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            ) : (
              <>
                <header className="mb-8">
                  <h1
                    id="forgot-password-heading"
                    className="font-serif text-3xl leading-tight font-bold text-foreground sm:text-4xl"
                  >
                    Reset your password
                  </h1>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Enter your email and we&apos;ll send you instructions to
                    choose a new password.
                  </p>
                </header>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)

                        if (emailError) {
                          setEmailError(null)
                        }
                      }}
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={
                        emailError ? "forgot-email-error" : undefined
                      }
                      className="h-12 rounded-md px-4 text-base"
                      disabled={loading}
                    />

                    {emailError ? (
                      <p
                        id="forgot-email-error"
                        className="text-sm text-destructive"
                      >
                        {emailError}
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
                    className="h-12 w-full bg-sage-500 text-base font-semibold hover:bg-sage-600 active:bg-sage-700"
                  >
                    {loading ? "Sending instructions..." : "Send instructions"}
                  </Button>
                </form>

                <p className="mt-7 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-sage-700 underline-offset-4 hover:underline"
                  >
                    Return to login
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
