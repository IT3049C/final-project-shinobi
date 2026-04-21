import { expect, Page } from "@playwright/test";

export const APP_BASE = "/final-project-shinobi";

export async function gotoHome(page: Page) {
  await page.goto(`${APP_BASE}/`);
}

export async function seedPlayerName(page: Page, name = "Kymani") {
  await page.goto(`${APP_BASE}/`);
  await page.getByPlaceholder("Player name...").fill(name);
  await page.getByRole("button", { name: "Enter" }).click();
  await expect(page.getByText(new RegExp(`Welcome,\\s*${name}`, "i"))).toBeVisible();
}

export async function mockWordleApis(page: Page, answer = "crane") {
  const normalizedAnswer = answer.toLowerCase();

  await page.route("**/random-word-api.herokuapp.com/word**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([normalizedAnswer]),
    });
  });

  await page.route("**/api.dictionaryapi.dev/api/v2/entries/en/**", async (route) => {
    const url = route.request().url();
    const guessedWord = url.split("/").pop()?.toLowerCase() ?? "";
    const isValid = guessedWord.length === 5;

    await route.fulfill({
      status: isValid ? 200 : 404,
      contentType: "application/json",
      body: isValid
        ? JSON.stringify([
            {
              word: guessedWord,
              meanings: [{ partOfSpeech: "noun", definitions: [{ definition: "Mock definition" }] }],
            },
          ])
        : JSON.stringify({ title: "No Definitions Found" }),
    });
  });
}

export async function mockTriviaApis(
  page: Page,
  options?: {
    categories?: Array<{ id: number; name: string }>;
    questions?: Array<{
      category: string;
      type: "multiple";
      difficulty: "easy" | "medium" | "hard";
      question: string;
      correct_answer: string;
      incorrect_answers: string[];
    }>;
  },
) {
  const categories =
    options?.categories ??
    [
      { id: 9, name: "General Knowledge" },
      { id: 17, name: "Science & Nature" },
    ];

  const questions =
    options?.questions ??
    [
      {
        category: "General Knowledge",
        type: "multiple" as const,
        difficulty: "medium" as const,
        question: "What is the capital of France?",
        correct_answer: "Paris",
        incorrect_answers: ["Berlin", "Rome", "Madrid"],
      },
    ];

  await page.route("**/opentdb.com/api_category.php", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ trivia_categories: categories }),
    });
  });

  await page.route("**/opentdb.com/api.php**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ response_code: 0, results: questions }),
    });
  });
}

export async function mockPokemonApis(page: Page) {
  await page.route("**/pokeapi.co/api/v2/pokemon/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 25,
        name: "pikachu",
        sprites: {
          other: {
            "official-artwork": {
              front_default:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
            },
          },
        },
      }),
    });
  });

  await page.route("**/game-room-api.fly.dev/api/rooms", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ roomId: "ROOM1", gameState: {} }),
    });
  });

  await page.route("**/game-room-api.fly.dev/api/rooms/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ gameState: { phase: "waiting", players: [], maxPlayers: 2, version: 0 } }),
    });
  });
}
