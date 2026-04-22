import { expect, test } from "@playwright/test";
import { gotoHome } from "./test-helpers";

test.describe("Hub", () => {
  test("loads landing page and lists games", async ({ page }) => {
    await gotoHome(page);

    await expect(page.getByRole("heading", { name: "Enter Your Name" })).toBeVisible();

    const gamePanel = page.locator(".game-list-panel");
    await expect(gamePanel.getByText("Rock Paper Scissors")).toBeVisible();
    await expect(gamePanel.getByText("Wordle")).toBeVisible();
    await expect(gamePanel.getByText("Tic Tac Toe")).toBeVisible();
    await expect(gamePanel.getByText("Trivia")).toBeVisible();
    await expect(gamePanel.getByText("Pokemon")).toBeVisible();
  });

  test("captures player name and unlocks game links", async ({ page }) => {
    await gotoHome(page);

    await page.getByPlaceholder("Player name...").fill("Kymani");
    await page.getByRole("button", { name: "Enter" }).click();

    await expect(page.getByText(/Welcome,\s*Kymani/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "Wordle" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Trivia" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Pokemon" }).first()).toBeVisible();
  });

  test("navigates from hub into key game pages and back with name shown", async ({ page }) => {
    await gotoHome(page);
    await page.getByPlaceholder("Player name...").fill("Kymani");
    await page.getByRole("button", { name: "Enter" }).click();
    await expect(page.getByText(/Welcome,\s*Kymani/i)).toBeVisible();

    const journeys = [
      { gameLink: "Wordle", gameHeading: "Wordle" },
      { gameLink: "Trivia", gameHeading: "Trivia" },
      { gameLink: "Pokemon", gameHeading: "Who's That Pokémon?" },
    ];

    for (const journey of journeys) {
      await page.getByRole("link", { name: journey.gameLink }).first().click();
      await expect(page.getByRole("heading", { name: journey.gameHeading })).toBeVisible();
      await expect(page.getByText("Playing as")).toBeVisible();
      await expect(page.getByText("Kymani")).toBeVisible();

      await page.getByText("Back to Lobby").first().click();
      await expect(page.getByRole("heading", { name: "Enter Your Name" })).toBeVisible();
    }
  });
});
