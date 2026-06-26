import { test, expect } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Roast Dinners Around The World", level: 1 }).first()).toHaveText("Roast Dinners Around The World");
});
