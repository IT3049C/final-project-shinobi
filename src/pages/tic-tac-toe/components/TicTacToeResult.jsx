import React from "react";

export function TicTacToeResult({ game, onBackToLobby, onPlayAgain, canPlayAgain }) {
  const winner = game.players.find((player) => player.id === game.winnerId) || null;
  const isDraw = game.phase === "gameOver" && !winner;

  return (
    <section className="ttt-result-card">
      <p className="ttt-result-title">Game Over</p>
      <p className="ttt-result-text">
        {winner ? `${winner.name} won the match.` : isDraw ? "The match ended in a draw." : "The match is complete."}
      </p>

      <div className="ttt-result-actions">
        {canPlayAgain ? (
          <button className="ttt-action-btn ttt-action-primary" onClick={onPlayAgain} type="button">
            Play Again
          </button>
        ) : null}
        <button className="ttt-action-btn ttt-action-secondary" onClick={onBackToLobby} type="button">
          Back to Lobby
        </button>
      </div>
    </section>
  );
}
