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
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16 text-white">
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
              <span className="text-xs text-white/50">or</span>
              <Separator className="flex-1" />
            </div>

            <EmailSignInForm />

            <div className="text-center">
              <Link
                className="text-sm text-white/80 underline underline-offset-4 hover:text-white"
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
