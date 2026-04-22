export function ScoreBar({ game, isRoundOver }) {
  return (
    <div className="pg-scorebar">
      <div className="pg-round">
        Round {game.round} / {game.maxRounds}
      </div>
      <div className="pg-scores">
        {game.players.map((p, i) => (
          <div
            key={i}
            className={[
              "pg-score-card",
              i === game.currentPlayerIndex && !isRoundOver && !p.left
                ? "pg-score-active"
                : "",
              p.left ? "pg-score-left" : "",
            ].join(" ")}
          >
            <span className="pg-score-name">
              {p.name} {p.left && "✕"}
            </span>
            <span className="pg-score-value">{p.score ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
