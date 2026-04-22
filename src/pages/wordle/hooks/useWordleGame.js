import { useEffect, useMemo, useState } from "react";
import {
  MAX_GUESSES,
  WORD_LENGTH,
  isValidGuessWord,
  pickRandomAnswer,
} from "../data/words";
import { evaluateGuess } from "../utils/evaluateGuess";
import {
  DEFAULT_STATS,
  loadStats,
  recordLoss,
  recordWin,
  saveStats,
} from "../utils/storage";

const LETTER_PRIORITY = {
  absent: 0,
  present: 1,
  correct: 2,
};

function emptyRows() {
  return Array.from({ length: MAX_GUESSES }, () => "");
}

function emptyEvaluations() {
  return Array.from({ length: MAX_GUESSES }, () => null);
}

function emptyRevealStates() {
  return Array.from({ length: MAX_GUESSES }, () => 0);
}

function sleep(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function mergeLetterStates(previousStates, guess, evaluation) {
  const nextStates = { ...previousStates };

  for (let i = 0; i < guess.length; i += 1) {
    const letter = guess[i];
    const nextState = evaluation[i];
    const currentState = nextStates[letter];

    if (
      !currentState ||
      LETTER_PRIORITY[nextState] > LETTER_PRIORITY[currentState]
    ) {
      nextStates[letter] = nextState;
    }
  }

  return nextStates;
}

export function useWordleGame() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState(emptyRows);
  const [evaluations, setEvaluations] = useState(emptyEvaluations);
  const [revealCounts, setRevealCounts] = useState(emptyRevealStates);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState("loading");
  const [isCheckingGuess, setIsCheckingGuess] = useState(false);
  const [isRevealingGuess, setIsRevealingGuess] = useState(false);
  const [invalidAttemptCount, setInvalidAttemptCount] = useState(0);
  const [letterStates, setLetterStates] = useState({});
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const setupNewAnswer = async () => {
    setStatus("loading");
    console.log("🎯 Wordle answer:", answer);
    setIsCheckingGuess(false);
    setIsRevealingGuess(false);
    setInvalidAttemptCount(0);
    setRevealCounts(emptyRevealStates());

    try {
      const nextAnswer = await pickRandomAnswer();
      setAnswer(nextAnswer);
      setStatus("playing");
    } catch {
      setStatus("playing");
      setAnswer("CRANE");
    }
  };

  useEffect(() => {
    setupNewAnswer();
  }, []);

  const gameResult = useMemo(() => {
    if (status === "won") {
      return "You solved it!";
    }

    if (status === "lost") {
      return `Out of tries. The word was ${answer}.`;
    }

    if (status === "loading") {
      return "Loading a new word...";
    }

    return "";
  }, [answer, status]);

  const acceptGuess = async () => {
    if (isCheckingGuess || isRevealingGuess || status !== "playing") {
      return;
    }

    if (currentGuess.length < WORD_LENGTH) {
      setInvalidAttemptCount((count) => count + 1);
      return;
    }

    const normalizedGuess = currentGuess.toUpperCase();
    setIsCheckingGuess(true);

    let isValidWord = false;
    try {
      isValidWord = await isValidGuessWord(normalizedGuess);
    } catch {
      isValidWord = false;
    }

    setIsCheckingGuess(false);

    if (!isValidWord) {
      setInvalidAttemptCount((count) => count + 1);
      return;
    }

    const evaluation = evaluateGuess(normalizedGuess, answer);
    const rowIndex = currentRow;

    setGuesses((previousGuesses) => {
      const nextGuesses = [...previousGuesses];
      nextGuesses[rowIndex] = normalizedGuess;
      return nextGuesses;
    });

    setEvaluations((previousEvaluations) => {
      const nextEvaluations = [...previousEvaluations];
      nextEvaluations[rowIndex] = evaluation;
      return nextEvaluations;
    });

    setIsRevealingGuess(true);

    for (let tileIndex = 1; tileIndex <= WORD_LENGTH; tileIndex += 1) {
      setRevealCounts((previousCounts) => {
        const nextCounts = [...previousCounts];
        nextCounts[rowIndex] = tileIndex;
        return nextCounts;
      });

      await sleep(120);
    }

    setLetterStates((previousStates) =>
      mergeLetterStates(previousStates, normalizedGuess, evaluation),
    );

    if (normalizedGuess === answer) {
      setStatus("won");
      setCurrentGuess("");
      setIsRevealingGuess(false);
      setStats((previousStats) => {
        const nextStats = recordWin(previousStats, rowIndex + 1);
        saveStats(nextStats);
        return nextStats;
      });
      return;
    }

    if (rowIndex === MAX_GUESSES - 1) {
      setStatus("lost");
      setCurrentGuess("");
      setIsRevealingGuess(false);
      setStats((previousStats) => {
        const nextStats = recordLoss(previousStats);
        saveStats(nextStats);
        return nextStats;
      });
      return;
    }

    setCurrentRow((previousRow) => previousRow + 1);
    setCurrentGuess("");
    setIsRevealingGuess(false);
  };

  const handleKeyInput = (key) => {
    if (status !== "playing" || isCheckingGuess || isRevealingGuess) {
      return;
    }

    if (key === "ENTER") {
      acceptGuess();
      return;
    }

    if (key === "BACKSPACE") {
      setCurrentGuess((previousGuess) => previousGuess.slice(0, -1));
      return;
    }

    if (!/^[A-Z]$/.test(key)) {
      return;
    }

    setCurrentGuess((previousGuess) => {
      if (previousGuess.length >= WORD_LENGTH) {
        return previousGuess;
      }
      return `${previousGuess}${key}`;
    });
  };

  const startNewGame = () => {
    setGuesses(emptyRows());
    setEvaluations(emptyEvaluations());
    setRevealCounts(emptyRevealStates());
    setCurrentRow(0);
    setCurrentGuess("");
    setStatus("loading");
    setIsCheckingGuess(false);
    setIsRevealingGuess(false);
    setInvalidAttemptCount(0);
    setLetterStates({});
    setupNewAnswer();
  };
  // console.log("🎯 Wordle answer:", answer);
  return {
    answer,
    currentGuess,
    currentRow,
    evaluations,
    gameResult,
    guesses,
    handleKeyInput,
    invalidAttemptCount,
    isCheckingGuess,
    isRevealingGuess,
    letterStates,
    maxGuesses: MAX_GUESSES,
    revealCounts,
    startNewGame,
    status,
    stats,
    wordLength: WORD_LENGTH,
  };
}
