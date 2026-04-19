export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

function normalizeWord(rawWord) {
  if (typeof rawWord !== "string") {
    return "";
  }

  const trimmed = rawWord.trim();
  if (!new RegExp(`^[A-Za-z]{${WORD_LENGTH}}$`).test(trimmed)) {
    return "";
  }

  return trimmed.toUpperCase();
}

export async function pickRandomAnswer() {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${WORD_LENGTH}`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch a random word.");
  }

  const payload = await response.json();
  const normalized = normalizeWord(payload?.[0]);

  if (!normalized) {
    throw new Error("Word API returned an invalid word.");
  }

  return normalized;
}

export async function isValidGuessWord(guess) {
  const normalized = normalizeWord(guess);
  if (!normalized) {
    return false;
  }

  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${normalized.toLowerCase()}`,
  );

  return response.ok;
}
