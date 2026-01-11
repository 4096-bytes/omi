import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home(props: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getSession();
  const notice = props.searchParams?.notice;
  const noticeEmail =
    typeof props.searchParams?.email === "string"
      ? props.searchParams.email
      : undefined;

  if (session) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground [background-image:radial-gradient(120%_80%_at_50%_0%,rgba(212,175,55,0.10)_0%,rgba(11,11,12,0)_55%)]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl">{hello ? hello.greeting : "Loading tRPC query..."}</p>

            {notice === "verify-email-sent" ? (
              <p className="rounded-md border border-border bg-card px-4 py-2 text-center text-sm text-muted-foreground">
                Verification email sent{noticeEmail ? ` to ${noticeEmail}` : ""}
                . Please verify your email to sign in.
              </p>
            ) : null}

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-lg text-muted-foreground">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              {!session ? (
                <Link
                  className="rounded-full bg-primary px-10 py-3 font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
                  href="/login"
                >
                  Go to login
                </Link>
              ) : (
                <form>
                  <button
                    className="rounded-full bg-secondary px-10 py-3 font-semibold text-secondary-foreground no-underline transition-colors hover:bg-secondary/80"
                    formAction={async () => {
                      "use server";
                      await auth.api.signOut({
                        headers: await headers(),
                      });
                      redirect("/");
                    }}
                  >
                    Sign out
                  </button>
                </form>
              )}
            </div>
          </div>

          {session?.user && <LatestPost />}
        </div>
      </main>
    </HydrateClient>
  );
}
