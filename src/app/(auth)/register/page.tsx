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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16 text-white">
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

            <p className="text-center text-sm text-white/70">
              Already have an account?{" "}
              <Link className="text-white underline underline-offset-4" href="/login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
