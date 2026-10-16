import { test, expect } from "@playwright/test";

test.describe("Currency conversion on League of Roasts", () => {
  test("converted price column renders £-prefixed, formatted values", async ({ page }) => {
    await page.goto("/league-of-roasts");

    const table = page.getByRole("table", { name: "Roast dinner reviews" });
    await expect(table.locator("tbody tr").first()).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Converted Price (GBP)" })
    ).toBeVisible();

    const convertedPriceCells = table.locator("tbody tr td:nth-child(4)");
    const cellTexts = await convertedPriceCells.allInnerTexts();

    expect(cellTexts.length).toBeGreaterThan(0);
    for (const text of cellTexts) {
      expect(text).toMatch(/^£\d+\.\d{2}$|^N\/A$/);
    }
    expect(cellTexts.some((text) => /^£\d+\.\d{2}$/.test(text))).toBe(true);
  });
});
