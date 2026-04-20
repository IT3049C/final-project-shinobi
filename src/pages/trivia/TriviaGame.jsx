import React from "react";
import { TriviaControls } from "./components/TriviaControls";
import { TriviaQuestion } from "./components/TriviaQuestion";
import { TriviaSummary } from "./components/TriviaSummary";
import { useTriviaGame } from "./hooks/useTriviaGame";
import "./trivia.css";

export function TriviaGame() {
  const {
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
  } = useTriviaGame();

  return (
    <section className="trivia-page">
      <TriviaControls
        categories={categories}
        onStartGame={startGame}
        onSettingsChange={updateSettings}
        settings={settings}
        status={status}
      />

      {error ? (
        <div className="trivia-banner trivia-banner-error">{error}</div>
      ) : null}
      {feedback ? (
        <div className="trivia-banner trivia-banner-feedback">{feedback}</div>
      ) : null}

      <div className="trivia-layout">
        <TriviaQuestion
          currentQuestion={currentQuestion}
          gameState={gameState}
          onAnswer={submitAnswer}
        />

        <TriviaSummary
          gameState={gameState}
          onNextQuestion={nextQuestion}
          onRestart={restartGame}
          questionCount={questions.length}
        />
      </div>
    </section>
  );
}

export default TriviaGame;
