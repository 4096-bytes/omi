import Link from "next/link";

import { getSession } from "~/server/better-auth/server";

function linkButtonBase() {
  return "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
}

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4 px-4">
          <Link className="text-sm font-semibold tracking-tight" href="/">
            OMI
          </Link>

          <nav className="flex items-center gap-2">
            {session ? (
              <Link
                className={`${linkButtonBase()} bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 shadow-sm`}
                href="/workspace"
              >
                Go to workspace
              </Link>
            ) : (
              <>
                <Link
                  className={`${linkButtonBase()} text-muted-foreground hover:bg-accent hover:text-foreground px-3 py-2`}
                  href="/login"
                >
                  Sign in
                </Link>
                <Link
                  className={`${linkButtonBase()} bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 shadow-sm`}
                  href="/register"
                >
                  Try Free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
