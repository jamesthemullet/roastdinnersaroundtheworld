import { test, expect } from "@playwright/test";

test.describe("League of Roasts page", () => {
  test("renders the page, heading and roast table without a broken response", async ({
    page,
  }) => {
    const response = await page.goto("/league-of-roasts");

    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle("League Of Roasts Around The World");
    await expect(page.getByRole("heading", { name: "League Of Roasts:", level: 2 })).toBeVisible();

    const table = page.getByRole("table", { name: "Roast dinner reviews" });
    await expect(table).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "Restaurant" })).toBeVisible();
    await expect(table.locator("tbody tr").first()).toBeVisible();
  });

  test("sorting and filtering controls are interactive", async ({ page }) => {
    await page.goto("/league-of-roasts");

    const table = page.getByRole("table", { name: "Roast dinner reviews" });
    await expect(table.locator("tbody tr").first()).toBeVisible();

    await page.getByLabel("Sort by:").selectOption("country");
    await expect(page.getByRole("button", { name: /Sort Country/ })).toBeVisible();

    const rowCountBefore = await table.locator("tbody tr").count();
    await page.getByLabel("Rating (minimum): ").fill("10000");
    await expect(table.locator("tbody tr")).toHaveCount(0);

    await page.getByRole("button", { name: "Clear All Filters" }).click();
    await expect(table.locator("tbody tr")).toHaveCount(rowCountBefore);
  });
});
