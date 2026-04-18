import { useState } from "react";

export function HighScoresSection() {
  const [scores, setScores] = useState(() => {
    return JSON.parse(localStorage.getItem("rpsHighScores")) || [];
  });

  const handleClear = () => {
    localStorage.removeItem("rpsHighScores");
    setScores([]);
  };

  return (
    <section aria-labelledby="highscores-heading" className="card">
      <h2 id="highscores-heading">High Scores</h2>
      <ul id="highscores">
        {scores.length === 0 ? (
          <li
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              color: "#475569",
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              padding: "0.4rem 0",
            }}
          >
            No high scores yet.
          </li>
        ) : (
          scores.map((s, i) => (
            <li key={i}>
              {s.name}: {s.score}
            </li>
          ))
        )}
      </ul>
      <button id="clear-highscores" type="button" onClick={handleClear}>
        Clear High Scores
      </button>
    </section>
  );
}
