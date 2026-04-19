import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createGameState,
  revealTile,
  makeGuess,
  startNextRound,
  fetchRandomPokemon,
} from "../logic/pokemonGame";
import "../styles/PokemonGame.css";

export default function AnotherGame() {
  const navigate = useNavigate();
  const playerNames = ["Player 1", "Player 2"];
  const [game, setGame] = useState(() => createGameState(playerNames));
  const [pokemon, setPokemon] = useState(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [guess, setGuess] = useState("");
  const [actionMode, setActionMode] = useState(null);

  const loadPokemon = async () => {
    setLoadingPokemon(true);
    const p = await fetchRandomPokemon();
    setPokemon(p);
    console.log(`Pokemon: ${p.name}`);
    setLoadingPokemon(false);
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const handleReveal = (i) => {
    if (game.phase !== "playing") return;
    if (game.tiles[i]) return;
    if (game.players[game.currentPlayerIndex].eliminated) return;
    if (actionMode !== "reveal") return;
    if (allTilesRevealed) return;
    setGame((prev) => revealTile(prev, i));
    setActionMode(null);
  };

  const allTilesRevealed = game.tiles.every(Boolean);

  const handleGuessSubmit = () => {
    if (!guess.trim() || !pokemon) return;
    setGame((prev) => makeGuess(prev, guess, pokemon.name, allTilesRevealed));
    setGuess("");
    if (!allTilesRevealed) setActionMode(null);
  };

  const handleNextRound = () => {
    setActionMode(null);
    setGame((prev) => startNextRound(prev));
    loadPokemon();
  };

  const handlePlayAgain = () => {
    setGame(createGameState(playerNames));
    setActionMode(null);
    loadPokemon();
  };

  const currentPlayer = game.players[game.currentPlayerIndex];
  const isRoundOver = game.phase === "roundOver" || game.phase === "gameOver";

  return (
    <div className="pg-wrapper">
      <header className="pg-header">
        <h2 className="pg-heading">Who's That Pokémon?</h2>
        <nav>
          <a onClick={() => navigate("/")} className="nav-link">
            ← Back to Lobby
          </a>
        </nav>
      </header>

      <div className="pg-scorebar">
        <div className="pg-round">
          Round {game.round} / {game.maxRounds}
        </div>
        <div className="pg-scores">
          {game.players.map((p, i) => (
            <div
              key={i}
              className={`pg-score-card ${i === game.currentPlayerIndex && !isRoundOver ? "pg-score-active" : ""}`}
            >
              <span className="pg-score-name">{p.name}</span>
              <span className="pg-score-value">{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pg-board">
        <div className="pg-image-wrapper">
          {loadingPokemon ? (
            <div className="pg-loading">Loading...</div>
          ) : (
            <>
              {pokemon && (
                <img
                  src={pokemon.image}
                  alt="hidden pokemon"
                  className="pg-pokemon-img"
                  draggable={false}
                />
              )}
              <div className="pg-tile-grid">
                {game.tiles.map((revealed, i) => (
                  <div
                    key={i}
                    className={`pg-tile ${revealed && !isRoundOver ? "pg-tile-revealed" : ""} ${!revealed && actionMode === "reveal" ? "pg-tile-clickable" : ""}`}
                    onClick={() => handleReveal(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {!isRoundOver ? (
          <div className="pg-action-panel">
            <div className="pg-turn-indicator">
              <span className="pg-turn-label">Your turn</span>
              <span className="pg-turn-name">{currentPlayer.name}</span>
              {currentPlayer.eliminated && (
                <span className="pg-eliminated">Eliminated this round</span>
              )}
            </div>

            {!currentPlayer.eliminated && (
              <>
                {allTilesRevealed ? (
                  <div className="pg-guess-form">
                    <p className="pg-prompt-text">
                      All tiles revealed —{" "}
                      {
                        game.players.filter(
                          (_, i) => !game.guessedPlayers.includes(i),
                        ).length
                      }{" "}
                      guess(es) remaining
                    </p>
                    <input
                      className="pg-guess-input"
                      type="text"
                      placeholder="Enter Pokémon name..."
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleGuessSubmit()
                      }
                      autoFocus
                    />
                    <button
                      className="pg-btn pg-btn-guess"
                      onClick={handleGuessSubmit}
                    >
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
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleGuessSubmit()
                          }
                          autoFocus
                        />
                        <div className="pg-guess-actions">
                          <button
                            className="pg-btn pg-btn-guess"
                            onClick={handleGuessSubmit}
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
        ) : (
          <div className="pg-round-result">
            {game.roundWinner !== null ? (
              <>
                <p className="pg-result-winner">
                  🏆 {game.players[game.roundWinner].name} guessed it!
                </p>
                <p className="pg-result-pokemon">
                  It was <span>{pokemon?.name}</span>!
                </p>
              </>
            ) : (
              <>
                <p className="pg-result-winner">Nobody guessed it!</p>
                <p className="pg-result-pokemon">
                  It was <span>{pokemon?.name}</span>!
                </p>
              </>
            )}

            {game.phase === "roundOver" ? (
              <button
                className="pg-btn pg-btn-reveal"
                onClick={handleNextRound}
              >
                Next Round →
              </button>
            ) : (
              <div className="pg-game-over">
                <p className="pg-game-over-title">Game Over!</p>
                {(() => {
                  const top = [...game.players].sort(
                    (a, b) => b.score - a.score,
                  );
                  return (
                    <p className="pg-result-winner">
                      🥇 {top[0].name} wins with {top[0].score} pts!
                    </p>
                  );
                })()}
                <div className="pg-game-over-btns">
                  <button
                    className="pg-btn pg-btn-guess"
                    onClick={handlePlayAgain}
                  >
                    Play Again
                  </button>
                  <button
                    className="pg-btn-cancel"
                    onClick={() => navigate("/")}
                  >
                    Back to Lobby
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
