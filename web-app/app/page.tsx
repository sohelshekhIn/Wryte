"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession, signOut } from "@/lib/auth";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const session = await getSession();
      setIsLoggedIn(Boolean(session));
      setLoading(false);
    }

    loadSession();
  }, []);

  async function handleLogout() {
    await signOut();
    setIsLoggedIn(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Wryte</CardTitle>
          <CardDescription>A simple Supabase-powered auth experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Checking session...</p>
          ) : isLoggedIn ? (
            <div className="space-y-4">
              <p className="text-lg font-medium">You are logged in</p>
              <Button onClick={handleLogout}>Log out</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
