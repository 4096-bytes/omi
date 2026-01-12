import { expect, test } from "@playwright/test";

test.describe("marketing", () => {
  test("home shows auth CTAs and no scaffold demo", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Create T3 App")).toHaveCount(0);

    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Try Free" })).toBeVisible();
    await expect(
      header.getByRole("link", { name: "Try Free" }),
    ).toHaveAttribute("href", "/register");
  });
});
