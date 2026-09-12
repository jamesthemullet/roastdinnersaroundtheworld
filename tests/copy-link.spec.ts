import { test, expect } from "@playwright/test";

test.describe("League of Roasts copy link", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("copies the page URL to the clipboard and reverts the button label", async ({ page }) => {
    await page.goto("/league-of-roasts");

    const copyButton = page.getByRole("button", { name: "Copy link" });
    await expect(copyButton).toBeVisible();

    await copyButton.click();

    await expect(page.getByRole("button", { name: "Link copied!" })).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(page.url());

    await expect(page.getByRole("button", { name: "Copy link" })).toBeVisible();
  });
});
