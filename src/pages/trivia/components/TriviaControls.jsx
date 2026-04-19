import React from "react";

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function TriviaControls({ categories, onStartGame, onSettingsChange, settings, status }) {
  const isStarting = status === "loading";

  return (
    <section className="trivia-controls">
      <div className="trivia-control-group">
        <label className="trivia-label" htmlFor="trivia-category">
          Category
        </label>
        <select
          id="trivia-category"
          className="trivia-select"
          value={settings.category}
          onChange={(event) => onSettingsChange({ category: event.target.value })}
          disabled={isStarting}
        >
          <option value="">Any Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="trivia-control-group">
        <span className="trivia-label">Difficulty</span>
        <div className="trivia-difficulty-row" role="radiogroup" aria-label="Difficulty">
          {DIFFICULTIES.map((difficulty) => (
            <label className="trivia-difficulty-chip" key={difficulty.value}>
              <input
                checked={settings.difficulty === difficulty.value}
                disabled={isStarting}
                onChange={() => onSettingsChange({ difficulty: difficulty.value })}
                type="radio"
                name="difficulty"
                value={difficulty.value}
              />
              <span>{difficulty.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="trivia-start-button" onClick={onStartGame} disabled={isStarting} type="button">
        {isStarting ? "Loading..." : "Start Trivia"}
      </button>
    </section>
  );
}
