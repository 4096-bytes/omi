import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { getSession } from "~/server/better-auth/server";

import { EmailSignUpForm } from "./_components/email-sign-up-form";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground [background-image:radial-gradient(120%_80%_at_50%_0%,rgba(212,175,55,0.12)_0%,rgba(11,11,12,0)_60%)]">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Sign up with your email and verify to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <EmailSignUpForm />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="text-primary underline underline-offset-4 hover:text-primary/90"
                href="/login"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
