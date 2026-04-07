export function evaluateGuess(guess, answer) {
  const normalizedGuess = guess.toUpperCase();
  const normalizedAnswer = answer.toUpperCase();
  const result = Array.from(normalizedGuess, () => "absent");
  const answerChars = normalizedAnswer.split("");

  for (let i = 0; i < normalizedGuess.length; i += 1) {
    if (normalizedGuess[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = null;
    }
  }

  for (let i = 0; i < normalizedGuess.length; i += 1) {
    if (result[i] === "correct") {
      continue;
    }

    const foundIndex = answerChars.indexOf(normalizedGuess[i]);
    if (foundIndex !== -1) {
      result[i] = "present";
      answerChars[foundIndex] = null;
    }
  }

  return result;
}
