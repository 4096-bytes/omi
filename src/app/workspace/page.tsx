import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";

export default async function WorkspacePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="container py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Workspace</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This is a placeholder. We’ll build the core workspace features here
          next.
        </p>
      </div>
    </main>
  );
}
