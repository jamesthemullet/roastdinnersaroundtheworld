import { test, expect } from "@playwright/test";

test("blog post page renders title, body content, and rating", async ({ page }) => {
  await page.goto("/swan-lion-tokyo-japan");

  const container = page.locator(".container");
  const title = container.locator("h2:not(.wp-block-heading)").first();
  await expect(title).toBeVisible();
  await expect(title).not.toBeEmpty();

  await expect(container.locator("div").first()).not.toBeEmpty();

  await expect(container).toContainText("Rating:");
  await expect(container).toContainText("Country:");
});
