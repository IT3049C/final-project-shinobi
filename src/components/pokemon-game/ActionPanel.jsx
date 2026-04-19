export function ActionPanel({
  currentPlayer,
  isMyTurn,
  allTilesRevealed,
  actionMode,
  setActionMode,
  guess,
  setGuess,
  onGuessSubmit,
  game,
}) {
  const remainingGuesses = game.players.filter(
    (_, i) => !game.guessedPlayers.includes(i),
  ).length;

  return (
    <div className="pg-action-panel">
      <div className="pg-turn-indicator">
        <span className="pg-turn-label">
          {isMyTurn ? "Your turn" : "Waiting for"}
        </span>
        <span className="pg-turn-name">{currentPlayer?.name}</span>
      </div>

      {!isMyTurn && (
        <p className="pg-waiting-turn">
          Waiting for {currentPlayer?.name} to make a move...
        </p>
      )}

      {isMyTurn && !currentPlayer?.eliminated && (
        <>
          {allTilesRevealed ? (
            <div className="pg-guess-form">
              <p className="pg-prompt-text">
                All tiles revealed — {remainingGuesses} guess(es) remaining
              </p>
              <input
                className="pg-guess-input"
                type="text"
                placeholder="Enter Pokémon name..."
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onGuessSubmit()}
                autoFocus
              />
              <button className="pg-btn pg-btn-guess" onClick={onGuessSubmit}>
                Submit Guess
              </button>
            </div>
          ) : (
            <>
              {actionMode === null && (
                <div className="pg-action-buttons">
                  <button
                    className="pg-btn pg-btn-reveal"
                    onClick={() => setActionMode("reveal")}
                  >
                    🔲 Reveal a Tile
                  </button>
                  <button
                    className="pg-btn pg-btn-guess"
                    onClick={() => setActionMode("guess")}
                  >
                    💡 Make a Guess
                  </button>
                </div>
              )}

              {actionMode === "reveal" && (
                <div className="pg-action-prompt">
                  <p className="pg-prompt-text">
                    Click any hidden tile to reveal it
                  </p>
                  <button
                    className="pg-btn-cancel"
                    onClick={() => setActionMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {actionMode === "guess" && (
                <div className="pg-guess-form">
                  <input
                    className="pg-guess-input"
                    type="text"
                    placeholder="Enter Pokémon name..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onGuessSubmit()}
                    autoFocus
                  />
                  <div className="pg-guess-actions">
                    <button
                      className="pg-btn pg-btn-guess"
                      onClick={onGuessSubmit}
                    >
                      Submit
                    </button>
                    <button
                      className="pg-btn-cancel"
                      onClick={() => setActionMode(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {game.lastAction === "wrongGuess" && (
        <p className="pg-wrong-guess">Wrong guess! Turn passes.</p>
      )}
    </div>
  );
}
