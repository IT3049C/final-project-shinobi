import { expect, test } from "@playwright/test";
import { APP_BASE, mockPokemonApis, seedPlayerName } from "./test-helpers";

test.describe("Pokemon", () => {
  test.beforeEach(async ({ page }) => {
    await mockPokemonApis(page);
    await seedPlayerName(page, "Kymani");
  });

  test("loads initial lobby state", async ({ page }) => {
    await page.goto(`${APP_BASE}/pokemon`);

    await expect(page.getByRole("heading", { name: "Who's That Pokémon?" })).toBeVisible();
    await expect(page.getByText("Create a Room")).toBeVisible();
    await expect(page.getByText("Join a Room")).toBeVisible();
    await expect(page.getByText("Playing as")).toBeVisible();
    await expect(page.getByText("Kymani")).toBeVisible();
  });

  test("supports local play interactions", async ({ page }) => {
    await page.goto(`${APP_BASE}/pokemon`);

    await page.getByRole("button", { name: /Play Local 2 Player/i }).click();

    await expect(page.getByRole("button", { name: /Reveal a Tile/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Make a Guess/i })).toBeVisible();

    await page.getByRole("button", { name: /Reveal a Tile/i }).click();
    await page.locator(".pg-tile").first().click();

    await expect(page.locator(".pg-tile-revealed")).toHaveCount(1);
  });

  test("can leave game view back to hub", async ({ page }) => {
    await page.goto(`${APP_BASE}/pokemon`);

    await page.getByRole("button", { name: /Play Local 2 Player/i }).click();
    await expect(page.getByRole("button", { name: /Make a Guess/i })).toBeVisible();

    await page.getByText("Back to Lobby").first().click();

    await expect(page.getByRole("heading", { name: "Enter Your Name" })).toBeVisible();
  });
});
