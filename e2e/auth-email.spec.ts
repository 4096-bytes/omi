import { expect, test } from "@playwright/test";

test.describe("auth (email/password)", () => {
  test("signup shows verify notice; unverified cannot login", async ({
    page,
  }) => {
    const email = `e2e+${Date.now()}@example.com`;
    const password = "Password123!";

    await page.goto("/register");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/\/register\?notice=verify-email-sent/, {
      timeout: 30_000,
    });
    await expect(page.getByText("Verification email sent")).toContainText(
      email,
    );

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in with email" }).click();

    await expect(page.getByText("Email not verified")).toBeVisible();
  });

  test("login offers Google sign-in entry", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("button", { name: "Sign in with Google" }),
    ).toBeVisible();
  });
});
