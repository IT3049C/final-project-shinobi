export function HighScoresSection({ highScore, onClear }) {
  return (
    <section aria-labelledby="highscores-heading" className="card">
      <h2 id="highscores-heading">High Score</h2>
      <div className="highscore-display">
        {highScore ? (
          <div className="highscore-row">
            <span className="highscore-name">{highScore.name}</span>
            <span className="highscore-value">{highScore.score}</span>
          </div>
        ) : (
          <div className="highscore-empty">No high score yet.</div>
        )}
      </div>
      <button id="clear-highscores" type="button" onClick={onClear}>
        Clear High Score
      </button>
    </section>
  );
}
