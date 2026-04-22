import React from "react";

export function TriviaQuestion({ currentQuestion, gameState, onAnswer }) {
  if (!currentQuestion) {
    return (
      <section className="trivia-card trivia-question-card trivia-empty-state">
        <p className="trivia-empty-title">Ready for a round?</p>
        <p className="trivia-empty-copy">
          Choose a category and difficulty, then press Start Trivia to load a new question set.
        </p>
      </section>
    );
  }

  const hasAnswered = Boolean(gameState.selectedAnswer);

  return (
    <section className="trivia-card trivia-question-card">
      <div className="trivia-meta-row">
        <span>{currentQuestion.category}</span>
        <span>Difficulty: {currentQuestion.difficulty}</span>
      </div>
      <h3 className="trivia-question-text">{currentQuestion.question}</h3>

      <div className="trivia-options-grid" role="list" aria-label="Answer choices">
        {currentQuestion.options.map((option) => {
          const isSelected = gameState.selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          let className = "trivia-option-button";

          if (hasAnswered && isCorrect) {
            className += " trivia-option-correct";
          } else if (hasAnswered && isSelected && !isCorrect) {
            className += " trivia-option-wrong";
          }

          return (
            <button
              key={option}
              className={className}
              disabled={hasAnswered}
              onClick={() => onAnswer(option)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
