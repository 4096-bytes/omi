import Link from "next/link";

import { getSession } from "~/server/better-auth/server";

export default async function MarketingHomePage() {
  const session = await getSession();

  return (
    <main className="[background-image:radial-gradient(120%_80%_at_50%_0%,rgba(212,175,55,0.10)_0%,rgba(11,11,12,0)_55%)]">
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold">Oh My Interior</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            A conversation-to-production workspace for interior designers
          </h1>
          <p className="text-muted-foreground mt-4 text-base">
            This is a minimal marketing placeholder. We’ll iterate on the full
            landing experience next.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {session ? (
              <Link
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                href="/workspace"
              >
                Go to workspace
              </Link>
            ) : (
              <>
                <Link
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/register"
                >
                  Try Free
                </Link>
                <Link
                  className="border-border bg-card text-foreground hover:bg-accent focus-visible:outline-ring inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/login"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
