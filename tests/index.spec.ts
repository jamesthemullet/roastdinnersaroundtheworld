import { test, expect } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1")).toHaveText("Roast Dinners Around The World");
});
