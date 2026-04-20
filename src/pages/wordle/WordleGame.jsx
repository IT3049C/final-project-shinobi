import React, { useEffect } from "react";
import "animate.css";
import { WordleBoard } from "./components/WordleBoard";
import { WordleKeyboard } from "./components/WordleKeyboard";
import { useWordleGame } from "./hooks/useWordleGame";
import "./wordle.css";

function normalizeKeyboardInput(rawKey) {
  if (!rawKey) {
    return null;
  }

  if (rawKey === "Enter") {
    return "ENTER";
  }

  if (rawKey === "Backspace" || rawKey === "Delete") {
    return "BACKSPACE";
  }

  if (/^[a-zA-Z]$/.test(rawKey)) {
    return rawKey.toUpperCase();
  }

  return null;
}

function winRate(stats) {
  if (!stats.played) {
    return 0;
  }
  return Math.round((stats.wins / stats.played) * 100);
}

export function WordleGame() {
  const {
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
    maxGuesses,
    revealCounts,
    startNewGame,
    status,
    stats,
    wordLength,
  } = useWordleGame();

  useEffect(() => {
    function onKeyDown(event) {
      const normalizedKey = normalizeKeyboardInput(event.key);
      if (!normalizedKey) {
        return;
      }

      event.preventDefault();
      handleKeyInput(normalizedKey);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyInput]);

  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <section className="wordle-page">
      <WordleBoard
        currentGuess={currentGuess}
        currentRow={currentRow}
        evaluations={evaluations}
        guesses={guesses}
        invalidAttemptCount={invalidAttemptCount}
        maxGuesses={maxGuesses}
        revealCounts={revealCounts}
        status={status}
        wordLength={wordLength}
      />

      <WordleKeyboard
        disabled={status !== "playing" || isCheckingGuess || isRevealingGuess}
        letterStates={letterStates}
        onKeyPress={handleKeyInput}
      />

      <div className="wordle-actions">
        <button
          className="wordle-new-game"
          onClick={startNewGame}
          type="button"
        >
          New Game
        </button>
        {status === "loading" ? (
          <p className="wordle-answer">Loading word...</p>
        ) : null}
        {status === "won" || status === "lost" ? (
          <p className="wordle-answer">Answer: {answer}</p>
        ) : null}
        {status === "won" || status === "lost" ? (
          <p className="wordle-answer">{gameResult}</p>
        ) : null}
      </div>

      <section className="wordle-stats" aria-label="Wordle statistics">
        <h2>Stats</h2>
        <div className="wordle-stat-grid">
          <div>
            <span className="wordle-stat-value">{stats.played}</span>
            <span className="wordle-stat-label">Played</span>
          </div>
          <div>
            <span className="wordle-stat-value">{winRate(stats)}%</span>
            <span className="wordle-stat-label">Win Rate</span>
          </div>
          <div>
            <span className="wordle-stat-value">{stats.currentStreak}</span>
            <span className="wordle-stat-label">Streak</span>
          </div>
          <div>
            <span className="wordle-stat-value">{stats.maxStreak}</span>
            <span className="wordle-stat-label">Best Streak</span>
          </div>
        </div>

        <h3>Guess Distribution</h3>
        <div className="wordle-distribution">
          {stats.guessDistribution.map((count, index) => {
            const percent = Math.max(
              8,
              Math.round((count / maxDistribution) * 100),
            );
            return (
              <div
                className="wordle-distribution-row"
                key={`dist-${index + 1}`}
              >
                <span>{index + 1}</span>
                <div className="wordle-distribution-bar-wrap">
                  <div
                    className="wordle-distribution-bar"
                    style={{ width: `${percent}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
