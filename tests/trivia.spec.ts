import { expect, test } from "@playwright/test";
import { APP_BASE, mockTriviaApis, seedPlayerName } from "./test-helpers";

test.describe("Trivia", () => {
  test.beforeEach(async ({ page }) => {
    await mockTriviaApis(page, {
      categories: [
        { id: 9, name: "General Knowledge" },
        { id: 17, name: "Science & Nature" },
      ],
      questions: [
        {
          category: "General Knowledge",
          type: "multiple",
          difficulty: "hard",
          question: "What is the capital of France?",
          correct_answer: "Paris",
          incorrect_answers: ["Berlin", "Rome", "Madrid"],
        },
      ],
    });

    await seedPlayerName(page, "Kymani");
  });

  test("loads initial state with controls", async ({ page }) => {
    await page.goto(`${APP_BASE}/trivia`);

    await expect(page.getByRole("heading", { name: "Trivia" })).toBeVisible();
    await expect(page.getByLabel("Category")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Trivia" })).toBeVisible();
    await expect(page.getByText(/Ready for a round\?/i)).toBeVisible();
  });

  test("plays through question and scores based on selected difficulty", async ({ page }) => {
    await page.goto(`${APP_BASE}/trivia`);

    await page.getByLabel("Category").selectOption("9");
    await page.getByText("Hard", { exact: true }).click();
    await page.getByRole("button", { name: "Start Trivia" }).click();

    await expect(page.getByText("What is the capital of France?")).toBeVisible();
    await page.getByRole("button", { name: "Paris" }).click();

    await expect(page.getByText("Correct answer.")).toBeVisible();
    await expect(page.getByText("Answer locked in")).toBeVisible();
    await expect(page.getByRole("button", { name: "Finish Game" })).toBeEnabled();
  });

  test("supports reset after finishing a round", async ({ page }) => {
    await page.goto(`${APP_BASE}/trivia`);

    await page.getByRole("button", { name: "Start Trivia" }).click();
    await page.getByRole("button", { name: "Paris" }).click();
    await page.getByRole("button", { name: "Finish Game" }).click();

    await expect(page.getByRole("button", { name: "Play Again" })).toBeVisible();
    await page.getByRole("button", { name: "Play Again" }).click();

    await expect(page.getByText(/Ready for a round\?/i)).toBeVisible();
  });
});
