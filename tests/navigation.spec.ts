import { test, expect } from "@playwright/test";

const CONTENT_PAGES = [
  { linkName: "About", path: "/about" },
  { linkName: "Countries", path: "/countries" },
  { linkName: "To-do List", path: "/to-do-list" },
  { linkName: "Where Should I Go?", path: "/where-should-i-go" },
];

test.describe("main navigation", () => {
  for (const { linkName, path } of CONTENT_PAGES) {
    test(`navigating to ${linkName} renders real CMS content`, async ({ page }) => {
      await page.goto("/");
      await page.locator("nav#nav-menu").getByRole("link", { name: linkName, exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`${path}/?$`));

      // A blank/error response from a broken GraphQL query would leave this
      // heading empty, so this catches API/query breakage that a bare
      // "navigation succeeded" check would miss.
      const heading = page.locator(".container h2").first();
      await expect(heading).toBeVisible();
      await expect(heading).not.toHaveText("");
    });
  }

  test("navigating to League Of Roasts renders CMS-sourced post data", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav#nav-menu").getByRole("link", { name: "League Of Roasts", exact: true }).click();

    await expect(page).toHaveURL(/\/league-of-roasts\/?$/);
    await expect(page.getByRole("heading", { name: "League Of Roasts:", level: 2 })).toBeVisible();

    const table = page.getByRole("table", { name: "Roast dinner reviews" });
    await expect(table).toBeVisible();
    await expect(table.locator("tbody tr").first()).toBeVisible();
  });
});
