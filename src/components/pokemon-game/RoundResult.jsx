export function RoundResult({
  game,
  pokemon,
  isMyTurn,
  mode,
  onNextRound,
  onBackToLobby,
}) {
  const isGameOver = game.phase === "gameOver";

  const GameWinner = () => {
    const sorted = [...game.players].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0),
    );
    const isDraw = (sorted[0].score ?? 0) === (sorted[1]?.score ?? 0);
    return isDraw ? (
      <p className="pg-result-winner">🤝 It's a draw!</p>
    ) : (
      <p className="pg-result-winner">
        🥇 {sorted[0].name} wins with {sorted[0].score ?? 0} pts!
      </p>
    );
  };

  return (
    <div className="pg-round-result">
      {game.roundWinner !== null ? (
        <p className="pg-result-winner">
          🏆 {game.players[game.roundWinner]?.name} guessed it!
        </p>
      ) : (
        <p className="pg-result-winner">Nobody guessed it!</p>
      )}

      <p className="pg-result-pokemon">
        It was <span>{pokemon?.name}</span>!
      </p>

      {isGameOver ? (
        <div className="pg-game-over">
          <p className="pg-game-over-title">Game Over!</p>
          <GameWinner />
          <button className="pg-btn pg-btn-reveal" onClick={onBackToLobby}>
            ← Back to Game Lobby
          </button>
        </div>
      ) : isMyTurn || mode === "local" ? (
        <button className="pg-btn pg-btn-reveal" onClick={onNextRound}>
          Next Round →
        </button>
      ) : (
        <p className="pg-waiting-turn">Waiting for next round...</p>
      )}
    </div>
  );
}
