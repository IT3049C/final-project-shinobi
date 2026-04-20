import React from "react";

export function TriviaSummary({
  gameState,
  onNextQuestion,
  onRestart,
  questionCount,
}) {
  const isLastQuestion = gameState.currentIndex >= questionCount - 1;
  const summaryLabel = gameState.finished
    ? "Trivia complete"
    : gameState.selectedAnswer
      ? "Answer locked in"
      : "Awaiting answer";

  return (
    <section className="trivia-card trivia-summary-card">
      <div className="trivia-score-stack">
        <div className="trivia-score-box">
          <span className="trivia-score-value">
            {Math.min(gameState.currentIndex + 1, questionCount)} /{" "}
            {questionCount}
          </span>
          <span className="trivia-score-label">Question</span>
        </div>

        <div className="trivia-score-box">
          <span className="trivia-score-value">
            {gameState.correctCount} / {questionCount}
          </span>
          <span className="trivia-score-label">Score</span>
        </div>
      </div>

      <p className="trivia-summary-label">{summaryLabel}</p>

      <div className="trivia-summary-actions">
        {gameState.finished ? (
          <button
            className="trivia-secondary-button"
            onClick={onRestart}
            type="button"
          >
            Play Again
          </button>
        ) : (
          <button
            className="trivia-secondary-button"
            disabled={!gameState.selectedAnswer}
            onClick={onNextQuestion}
            type="button"
          >
            {isLastQuestion ? "Finish Game" : "Next Question"}
          </button>
        )}
      </div>
    </section>
  );
}
