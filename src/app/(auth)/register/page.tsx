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

export default async function RegisterPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/workspace");
  }

  const searchParams = await props.searchParams;
  const notice = searchParams?.notice;
  const noticeEmail =
    typeof searchParams?.email === "string" ? searchParams.email : undefined;

  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center [background-image:radial-gradient(120%_80%_at_50%_0%,rgba(212,175,55,0.12)_0%,rgba(11,11,12,0)_60%)] px-4 py-16">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Sign up with your email and verify to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {notice === "verify-email-sent" ? (
              <p className="border-border bg-card text-muted-foreground rounded-md border px-4 py-2 text-center text-sm">
                Verification email sent{noticeEmail ? ` to ${noticeEmail}` : ""}
                . Check your inbox to verify your account.
              </p>
            ) : null}

            <EmailSignUpForm />

            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                className="text-primary hover:text-primary/90 underline underline-offset-4"
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
