const TRIVIA_API_BASE = "https://opentdb.com";

export function decodeHtmlEntities(value) {
  if (typeof value !== "string") {
    return "";
  }

  const textArea = document.createElement("textarea");
  textArea.innerHTML = value;
  return textArea.value;
}

export async function fetchTriviaCategories() {
  const response = await fetch(`${TRIVIA_API_BASE}/api_category.php`);

  if (!response.ok) {
    throw new Error("Unable to load trivia categories.");
  }

  const data = await response.json();
  return (data.trivia_categories || []).map((category) => ({
    id: category.id,
    name: category.name,
  }));
}

export async function fetchTriviaQuestions({ amount = 10, category = "", difficulty = "" }) {
  const url = new URL(`${TRIVIA_API_BASE}/api.php`);
  url.searchParams.set("amount", String(amount));
  url.searchParams.set("type", "multiple");

  if (category) {
    url.searchParams.set("category", category);
  }

  if (difficulty) {
    url.searchParams.set("difficulty", difficulty);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to load trivia questions.");
  }

  const data = await response.json();
  if (data.response_code !== 0) {
    throw new Error("Trivia API returned no questions for the selected filters.");
  }

  return (data.results || []).map((question) => {
    const options = [
      ...question.incorrect_answers,
      question.correct_answer,
    ].map(decodeHtmlEntities);

    return {
      category: decodeHtmlEntities(question.category),
      correctAnswer: decodeHtmlEntities(question.correct_answer),
      difficulty: decodeHtmlEntities(question.difficulty),
      question: decodeHtmlEntities(question.question),
      options: shuffleArray(options),
    };
  });
}

function shuffleArray(items) {
  const nextItems = [...items];
  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }
  return nextItems;
}
