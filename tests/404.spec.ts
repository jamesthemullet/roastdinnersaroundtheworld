import { test, expect } from "@playwright/test";

test("unknown route renders the 404 page", async ({ page }) => {
  const response = await page.goto("/this-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404 - No roast dinner in this part of the world" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go home?" })).toHaveAttribute("href", "/");
});
