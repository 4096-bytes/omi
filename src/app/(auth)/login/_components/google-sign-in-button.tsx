"use client";

import { useState } from "react";

import { Button } from "~/app/_components/ui/button";
import { authClient } from "~/server/better-auth/client";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      className="h-5 w-5"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.02 1.52 7.4 2.8l5.4-5.4C33.67 3.9 29.3 2 24 2 14.8 2 7 7.48 3.8 15.38l6.64 5.16C12.08 14.25 17.58 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46 24.5c0-1.64-.15-2.8-.47-4H24v8.06h12.47c-.25 2.03-1.6 5.1-4.62 7.15l7.08 5.5C43.2 37.32 46 31.56 46 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.44 28.54A14.96 14.96 0 0 1 9.66 24c0-1.57.27-3.1.76-4.54l-6.64-5.16A23.96 23.96 0 0 0 2 24c0 3.88.93 7.55 2.58 10.78l7.86-6.24z"
      />
      <path
        fill="#34A853"
        d="M24 46c6.3 0 11.6-2.08 15.47-5.67l-7.08-5.5c-1.9 1.32-4.47 2.24-8.39 2.24-6.36 0-11.86-4.3-13.52-10.17l-7.86 6.24C6.77 41.83 14.63 46 24 46z"
      />
    </svg>
  );
}

export function GoogleSignInButton() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Button
        className="w-full gap-3"
        disabled={isPending}
        variant="outline"
        onClick={async () => {
          setIsPending(true);
          setError(null);

          try {
            const res = await authClient.signIn.social({
              provider: "google",
              callbackURL: "/",
            });

            if (res.error) {
              setError(res.error.message ?? "Failed to start Google sign-in.");
              setIsPending(false);
            }
          } catch {
            setError("Failed to start Google sign-in. Please try again.");
            setIsPending(false);
          }
        }}
      >
        <GoogleIcon />
        {isPending ? "Redirecting..." : "Sign in with Google"}
      </Button>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
