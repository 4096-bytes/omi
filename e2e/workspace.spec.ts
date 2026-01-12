import fs from "node:fs";

import postgres from "postgres";
import { expect, test } from "@playwright/test";

function loadDotEnvIfNeeded() {
  if (process.env.DATABASE_URL) return;
  const envPath = `${process.cwd()}/.env`;
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line);
    if (!match) continue;

    const key = match[1]!;
    let value = match[2]!.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function markEmailVerified(email: string) {
  loadDotEnvIfNeeded();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Set it in the environment (or provide a local .env for e2e).",
    );
  }

  const sql = postgres(databaseUrl);
  try {
    await sql`update "user" set "email_verified" = true where "email" = ${email}`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

test.describe("workspace", () => {
  test("unauthenticated users are redirected to /login", async ({ page }) => {
    await page.goto("/workspace");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("verified email can login and land on /workspace", async ({ page }) => {
    const email = `e2e+${Date.now()}@example.com`;
    const password = "Password123!";
    const expectedName = email.split("@")[0]!;

    await page.goto("/register");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/register\?notice=verify-email-sent/);

    await markEmailVerified(email);

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in with email" }).click();

    await expect(page).toHaveURL(/\/workspace$/);
    await expect(
      page.getByRole("heading", { name: "Workspace" }),
    ).toBeVisible();

    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(
      header.getByRole("link", { name: "Go to workspace" }),
    ).toBeVisible();
    await expect(header.getByText(expectedName)).toBeVisible();
    await expect(header.getByLabel("User menu")).toBeVisible();
    await expect(header.getByRole("link", { name: "Try Free" })).toHaveCount(0);

    await header.getByLabel("User menu").click();
    await expect(header.getByRole("button", { name: "Sign out" })).toBeVisible();
    await header.getByRole("button", { name: "Sign out" }).click();
    await expect(header.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Try Free" })).toBeVisible();
    await expect(
      header.getByRole("link", { name: "Go to workspace" }),
    ).toHaveCount(0);
  });
});
