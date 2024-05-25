import { test, expect } from "@playwright/test";

test("meta is correct", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1")).toHaveText("Home");
});
