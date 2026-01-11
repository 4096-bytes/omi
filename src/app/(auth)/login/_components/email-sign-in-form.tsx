"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { authClient } from "~/server/better-auth/client";

export function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        try {
          const res = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
          });

          if (res.error) {
            setError(res.error.message ?? "Sign in failed");
            setIsPending(false);
            return;
          }
        } catch {
          setError("Sign in failed. Please try again.");
          setIsPending(false);
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        disabled={isPending}
        type="submit"
        variant="secondary"
      >
        {isPending ? "Signing in..." : "Sign in with email"}
      </Button>

      {error ? (
        <p className="text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-center text-sm text-white/70">
          Don’t have an account?{" "}
          <Link className="text-white underline underline-offset-4" href="/register">
            Create one
          </Link>
        </p>
      )}
    </form>
  );
}
