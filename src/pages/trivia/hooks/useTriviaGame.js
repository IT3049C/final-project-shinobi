import { useEffect, useMemo, useState } from "react";
import { fetchTriviaCategories, fetchTriviaQuestions } from "../utils/triviaApi";

const DEFAULT_AMOUNT = 10;

const DEFAULT_SETTINGS = {
  category: "",
  difficulty: "medium",
};

const FALLBACK_CATEGORIES = [
  { id: "9", name: "General Knowledge" },
  { id: "10", name: "Books" },
  { id: "11", name: "Film" },
  { id: "12", name: "Music" },
  { id: "14", name: "Television" },
  { id: "17", name: "Science & Nature" },
  { id: "18", name: "Computers" },
  { id: "21", name: "Sports" },
  { id: "22", name: "Geography" },
  { id: "23", name: "History" },
  { id: "24", name: "Politics" },
  { id: "27", name: "Animals" },
];

function loadSavedSettings() {
  try {
    const raw = window.localStorage.getItem("triviaSettings");
    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(raw);
    return {
      category: typeof parsed.category === "string" ? parsed.category : DEFAULT_SETTINGS.category,
      difficulty:
        typeof parsed.difficulty === "string" ? parsed.difficulty : DEFAULT_SETTINGS.difficulty,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  window.localStorage.setItem("triviaSettings", JSON.stringify(settings));
}

function emptyGameState() {
  return {
    currentIndex: 0,
    correctCount: 0,
    finished: false,
    selectedAnswer: "",
    score: 0,
  };
}

export function useTriviaGame() {
  const [settings, setSettings] = useState(loadSavedSettings);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [questions, setQuestions] = useState([]);
  const [gameState, setGameState] = useState(emptyGameState);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const apiCategories = await fetchTriviaCategories();
        if (mounted && apiCategories.length) {
          setCategories(apiCategories);
        }
      } catch {
        if (mounted) {
          setCategories(FALLBACK_CATEGORIES);
        }
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const currentQuestion = useMemo(() => questions[gameState.currentIndex] || null, [
    questions,
    gameState.currentIndex,
  ]);

  const progressLabel = useMemo(() => {
    if (!questions.length) {
      return "0/0";
    }
    return `${Math.min(gameState.currentIndex + 1, questions.length)}/${questions.length}`;
  }, [gameState.currentIndex, questions.length]);

  const startGame = async () => {
    setStatus("loading");
    setError("");
    setFeedback("");
    setQuestions([]);
    setGameState(emptyGameState());

    try {
      const nextQuestions = await fetchTriviaQuestions({
        amount: DEFAULT_AMOUNT,
        category: settings.category,
        difficulty: settings.difficulty,
      });

      setQuestions(nextQuestions);
      setStatus("playing");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to start trivia.");
      setStatus("error");
    }
  };

  const updateSettings = (nextSettings) => {
    setSettings((previous) => ({
      ...previous,
      ...nextSettings,
    }));
  };

  const submitAnswer = (answer) => {
    if (status !== "playing" || !currentQuestion || gameState.selectedAnswer) {
      return;
    }

    const isCorrect = answer === currentQuestion.correctAnswer;

    setGameState((previous) => ({
      ...previous,
      selectedAnswer: answer,
      correctCount: previous.correctCount + (isCorrect ? 1 : 0),
      score: previous.score + (isCorrect ? getScoreForDifficulty(settings.difficulty) : 0),
    }));

    setFeedback(isCorrect ? "Correct answer." : `Not quite. The answer was ${currentQuestion.correctAnswer}.`);
  };

  const nextQuestion = () => {
    if (status !== "playing") {
      return;
    }

    if (gameState.currentIndex >= questions.length - 1) {
      setStatus("finished");
      setGameState((previous) => ({
        ...previous,
        finished: true,
      }));
      return;
    }

    setFeedback("");
    setGameState((previous) => ({
      ...previous,
      currentIndex: previous.currentIndex + 1,
      selectedAnswer: "",
    }));
  };

  const restartGame = () => {
    setQuestions([]);
    setGameState(emptyGameState());
    setStatus("idle");
    setError("");
    setFeedback("");
  };

  return {
    categories,
    currentQuestion,
    error,
    feedback,
    gameState,
    nextQuestion,
    progressLabel,
    questions,
    restartGame,
    settings,
    startGame,
    status,
    submitAnswer,
    updateSettings,
  };
}

function getScoreForDifficulty(difficulty) {
  if (difficulty === "hard") {
    return 15;
  }

  if (difficulty === "easy") {
    return 8;
  }

  return 10;
}
