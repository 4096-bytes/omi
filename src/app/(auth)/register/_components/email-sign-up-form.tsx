"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { authClient } from "~/server/better-auth/client";

function generateNameFromEmail(email: string) {
  const localPart = email.split("@")[0]?.trim();
  return localPart ?? "User";
}

export function EmailSignUpForm() {
  const router = useRouter();
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
          const res = await authClient.signUp.email({
            name: generateNameFromEmail(email),
            email,
            password,
            callbackURL: "/workspace",
          });

          if (res.error) {
            setError(res.error.message ?? "Sign up failed");
            setIsPending(false);
            return;
          }

          const params = new URLSearchParams({
            notice: "verify-email-sent",
            email,
          });
          router.replace(`/register?${params.toString()}`);
          router.refresh();
        } catch {
          setError("Sign up failed. Please try again.");
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
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-muted-foreground text-xs">Minimum 8 characters.</p>
      </div>

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Creating account..." : "Create account"}
      </Button>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
