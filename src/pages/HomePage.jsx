import { Link } from "react-router-dom";
import { useState } from "react";
import { games } from "../data/gamesData";
import "../styles/HomePage.css";

export function HomePage() {
  const [inputName, setInputName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [hoveredGame, setHoveredGame] = useState(games[0]);

  const handleEnter = () => {
    if (inputName.trim()) setPlayerName(inputName.trim());
  };

  const renderPreview = () => {
    if (!hoveredGame) return null;
    if (typeof hoveredGame.preview === "function") {
      return hoveredGame.preview(true); // isActive is always true when this game is hovered
    }
    return hoveredGame.preview;
  };

  return (
    <section className="home-section">
      <div className="home-name-section">
        <h2 className="home-name-title">Enter Your Name</h2>
        <div className="home-name-row">
          <input
            className="home-name-input"
            type="text"
            placeholder="Player name..."
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
          />
          <button className="home-enter-btn" onClick={handleEnter}>
            Enter
          </button>
        </div>
        {playerName && (
          <div key={playerName} className="home-welcome">
            <p>
              Welcome, <span className="home-welcome-name">{playerName}</span>
            </p>
          </div>
        )}
      </div>

      <div className="game-frame">
        <div className="game-list-panel">
          <p className="game-list-label">Select Game</p>
          <ul className="game-list-ul">
            {games.map((game) => (
              <li key={game.key}>
                <Link
                  to={game.path}
                  className={`game-list-item${hoveredGame?.key === game.key ? " hovered" : ""}`}
                  onMouseEnter={() => setHoveredGame(game)}
                >
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                    {game.emoji}
                  </span>
                  <div>
                    <p
                      className="game-item-name"
                      style={{
                        color:
                          hoveredGame?.key === game.key
                            ? game.color
                            : "#cbd5e1",
                      }}
                    >
                      {game.name}
                    </p>
                    <p className="game-item-desc">{game.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="game-preview-panel"
          style={{
            background: `radial-gradient(ellipse at center, ${hoveredGame?.color}18 0%, transparent 70%)`,
          }}
        >
          {renderPreview()}
        </div>
      </div>
      <div className="game-frame-credits">
        <span className="credit-item">Apiwat Anachai</span>
        <span className="credit-divider">×</span>
        <span className="credit-item">Kymani Jarrett</span>
      </div>
    </section>
  );
}
