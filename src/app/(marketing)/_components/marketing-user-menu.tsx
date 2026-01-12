"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "~/app/_components/ui/button";
import { authClient } from "~/server/better-auth/client";

function getInitials(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "U";

  const words = trimmed.split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const second = words.length > 1 ? words[1]?.[0] ?? "" : "";
  const letters = `${first}${second}`.trim();
  return letters ? letters.toUpperCase() : trimmed.slice(0, 2).toUpperCase();
}

export type MarketingUserMenuProps = {
  displayName: string;
};

export function MarketingUserMenu({ displayName }: MarketingUserMenuProps) {
  const router = useRouter();
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <details className="relative" ref={detailsRef}>
      <summary
        aria-label="User menu"
        className="text-foreground hover:bg-accent focus-visible:outline-ring inline-flex cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden"
      >
        <span className="bg-secondary text-secondary-foreground inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
          {getInitials(displayName)}
        </span>
        <span className="max-w-40 truncate">{displayName}</span>
      </summary>

      <div className="bg-popover border-border absolute right-0 mt-2 w-56 rounded-md border p-1 shadow-sm">
        <Button
          className="w-full justify-start"
          disabled={isPending}
          onClick={async () => {
            setIsPending(true);
            setError(null);

            try {
              const res = await authClient.signOut();
              if (res?.error) {
                setError(res.error.message ?? "Sign out failed");
                setIsPending(false);
                return;
              }

              detailsRef.current?.removeAttribute("open");
              router.replace("/");
              router.refresh();
            } catch {
              setError("Sign out failed. Please try again.");
              setIsPending(false);
            }
          }}
          size="sm"
          variant="ghost"
        >
          {isPending ? "Signing out..." : "Sign out"}
        </Button>

        {error ? (
          <p className="text-destructive px-2 py-2 text-xs" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </details>
  );
}

