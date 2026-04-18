import { useEffect, useMemo, useState } from "react";
import {
  MAX_GUESSES,
  VALID_WORDS,
  WORD_LENGTH,
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

function mergeLetterStates(previousStates, guess, evaluation) {
  const nextStates = { ...previousStates };

  for (let i = 0; i < guess.length; i += 1) {
    const letter = guess[i];
    const nextState = evaluation[i];
    const currentState = nextStates[letter];

    if (!currentState || LETTER_PRIORITY[nextState] > LETTER_PRIORITY[currentState]) {
      nextStates[letter] = nextState;
    }
  }

  return nextStates;
}

export function useWordleGame() {
  const [answer, setAnswer] = useState(() => pickRandomAnswer());
  const [guesses, setGuesses] = useState(emptyRows);
  const [evaluations, setEvaluations] = useState(emptyEvaluations);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState("playing");
  const [notice, setNotice] = useState("");
  const [letterStates, setLetterStates] = useState({});
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice("");
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const gameResult = useMemo(() => {
    if (status === "won") {
      return "You solved it!";
    }

    if (status === "lost") {
      return `Out of tries. The word was ${answer}.`;
    }

    return "";
  }, [answer, status]);

  const acceptGuess = () => {
    if (currentGuess.length < WORD_LENGTH) {
      setNotice(`Word must be ${WORD_LENGTH} letters`);
      return;
    }

    const normalizedGuess = currentGuess.toUpperCase();
    if (!VALID_WORDS.has(normalizedGuess.toLowerCase())) {
      setNotice("Word not in list");
      return;
    }

    const evaluation = evaluateGuess(normalizedGuess, answer);

    setGuesses((previousGuesses) => {
      const nextGuesses = [...previousGuesses];
      nextGuesses[currentRow] = normalizedGuess;
      return nextGuesses;
    });

    setEvaluations((previousEvaluations) => {
      const nextEvaluations = [...previousEvaluations];
      nextEvaluations[currentRow] = evaluation;
      return nextEvaluations;
    });

    setLetterStates((previousStates) =>
      mergeLetterStates(previousStates, normalizedGuess, evaluation),
    );

    if (normalizedGuess === answer) {
      setStatus("won");
      setCurrentGuess("");
      setStats((previousStats) => {
        const nextStats = recordWin(previousStats, currentRow + 1);
        saveStats(nextStats);
        return nextStats;
      });
      return;
    }

    if (currentRow === MAX_GUESSES - 1) {
      setStatus("lost");
      setCurrentGuess("");
      setStats((previousStats) => {
        const nextStats = recordLoss(previousStats);
        saveStats(nextStats);
        return nextStats;
      });
      return;
    }

    setCurrentRow((previousRow) => previousRow + 1);
    setCurrentGuess("");
  };

  const handleKeyInput = (key) => {
    if (status !== "playing") {
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
    setAnswer(pickRandomAnswer());
    setGuesses(emptyRows());
    setEvaluations(emptyEvaluations());
    setCurrentRow(0);
    setCurrentGuess("");
    setStatus("playing");
    setNotice("");
    setLetterStates({});
  };

  return {
    answer,
    currentGuess,
    currentRow,
    evaluations,
    gameResult,
    guesses,
    handleKeyInput,
    letterStates,
    maxGuesses: MAX_GUESSES,
    notice,
    startNewGame,
    status,
    stats,
    wordLength: WORD_LENGTH,
  };
}
