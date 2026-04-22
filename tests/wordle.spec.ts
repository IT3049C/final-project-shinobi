import { expect, Page, test } from "@playwright/test";
import { APP_BASE, mockWordleApis, seedPlayerName } from "./test-helpers";

async function submitWordleWord(page: Page, word: string) {
  for (const letter of word.toUpperCase()) {
    await page.getByRole("button", { name: letter, exact: true }).click();
  }
  await page.getByRole("button", { name: "ENTER", exact: true }).click();
}

test.describe("Wordle", () => {
  test.beforeEach(async ({ page }) => {
    await mockWordleApis(page, "crane");
    await seedPlayerName(page, "Kymani");
  });

  test("loads initial state", async ({ page }) => {
    await page.goto(`${APP_BASE}/wordle`);

    await expect(page.getByRole("heading", { name: "Wordle" })).toBeVisible();
    await expect(page.getByRole("button", { name: "New Game" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Wordle board" })).toBeVisible();
  });

  test("accepts valid guess and resolves win state", async ({ page }) => {
    await page.goto(`${APP_BASE}/wordle`);

    await expect(page.getByRole("button", { name: "Q", exact: true })).toBeEnabled();

    await submitWordleWord(page, "crane");

    await expect(page.getByText("You solved it!")).toBeVisible();
    await expect(page.getByText("Answer: CRANE")).toBeVisible();
  });

  test("new game resets board back to initial state", async ({ page }) => {
    await page.goto(`${APP_BASE}/wordle`);

    await page.getByRole("button", { name: "C", exact: true }).click();
    await page.getByRole("button", { name: "R", exact: true }).click();

    await expect(page.locator(".wordle-tile-filled")).toHaveCount(2);

    await page.getByRole("button", { name: "New Game" }).click();

    await expect(page.locator(".wordle-tile-filled")).toHaveCount(0);
  });
});
