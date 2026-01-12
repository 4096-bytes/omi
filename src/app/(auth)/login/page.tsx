import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Separator } from "~/app/_components/ui/separator";
import { getSession } from "~/server/better-auth/server";

import { EmailSignInForm } from "./_components/email-sign-in-form";
import { GoogleSignInButton } from "./_components/google-sign-in-button";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/workspace");
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center [background-image:radial-gradient(120%_80%_at_50%_0%,rgba(212,175,55,0.12)_0%,rgba(11,11,12,0)_60%)] px-4 py-16">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign in to OMI</CardTitle>
            <CardDescription>
              Continue with Google or email to access your workspace.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <GoogleSignInButton />

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-xs">or</span>
              <Separator className="flex-1" />
            </div>

            <EmailSignInForm />

            <div className="text-center">
              <Link
                className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
                href="/"
              >
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
