import React from "react";

export function TriviaSummary({ gameState, onNextQuestion, onRestart, questionCount }) {
  const isLastQuestion = gameState.currentIndex >= questionCount - 1;
  const summaryLabel = gameState.finished ? "Trivia complete" : gameState.selectedAnswer ? "Answer locked in" : "Awaiting answer";

  return (
    <section className="trivia-card trivia-summary-card">
      <p className="trivia-summary-label">{summaryLabel}</p>
      <div className="trivia-summary-stats">
        <div>
          <span className="trivia-summary-value">{gameState.score}</span>
          <span className="trivia-summary-text">Score</span>
        </div>
        <div>
          <span className="trivia-summary-value">{gameState.correctCount}</span>
          <span className="trivia-summary-text">Correct</span>
        </div>
        <div>
          <span className="trivia-summary-value">{gameState.currentIndex + 1}</span>
          <span className="trivia-summary-text">Question</span>
        </div>
      </div>

      <div className="trivia-summary-actions">
        {gameState.finished ? (
          <button className="trivia-secondary-button" onClick={onRestart} type="button">
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
