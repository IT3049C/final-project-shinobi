import { Link } from "react-router-dom";
import { useState } from "react";
import { games } from "../data/gamesData";
import { avatars } from "../data/avatars";
import "../styles/HomePage.css";

const LEFT_WIDTH = 260;

export function HomePage() {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [inputName, setInputName] = useState("");
  const [playerName, setPlayerName] = useState(
    () => sessionStorage.getItem("playerName") || "",
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    () => sessionStorage.getItem("playerAvatar") || "assassin",
  );
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  const activeGame = games.find((g) => g?.key === hoveredGame) ?? games[0];
  const handleEnter = () => {
    if (inputName.trim()) {
      const trimmed = inputName.trim();
      setPlayerName(trimmed);
      sessionStorage.setItem("playerName", trimmed);
      sessionStorage.setItem("playerAvatar", selectedAvatar);
    }
  };

  const handleAvatarPick = (key) => {
    setSelectedAvatar(key);
    setAvatarPickerOpen(false);
    sessionStorage.setItem("playerAvatar", key);
  };

  const currentAvatar =
    avatars.find((a) => a.key === selectedAvatar) ?? avatars[0];
  const hasName = playerName.trim().length > 0;

  return (
    <section className="home-section">
      <div className="home-name-section">
        <h2 className="home-name-title">Enter Your Name</h2>
        <div className="home-name-row">
          <div className="avatar-picker-wrap">
            <button
              className="avatar-picker-btn"
              onClick={() => setAvatarPickerOpen((v) => !v)}
              type="button"
            >
              <img
                src={currentAvatar.image}
                alt={currentAvatar.key}
                className="avatar-img"
              />
            </button>
            {avatarPickerOpen && (
              <div className="avatar-picker-dropdown">
                {avatars.map((a) => (
                  <button
                    key={a.key}
                    className={`avatar-picker-option ${a.key === selectedAvatar ? "selected" : ""}`}
                    onClick={() => handleAvatarPick(a.key)}
                    type="button"
                  >
                    <img src={a.image} alt={a.key} className="avatar-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <li
                key={game.key}
                onMouseEnter={() => setHoveredGame(game.key)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                {hasName ? (
                  <Link to={game.path} className="game-list-item">
                    <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                      {game.emoji}
                    </span>
                    <div>
                      <p
                        className="game-item-name"
                        style={{ color: game.color }}
                      >
                        {game.name}
                      </p>
                      <p className="game-item-desc">{game.description}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="game-list-item game-list-item-disabled">
                    <span
                      style={{
                        fontSize: "1.4rem",
                        flexShrink: 0,
                        opacity: 0.3,
                      }}
                    >
                      {game.emoji}
                    </span>
                    <div>
                      <p
                        className="game-item-name"
                        style={{ color: "#334155" }}
                      >
                        {game.name}
                      </p>
                      <p className="game-item-desc">{game.description}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {!hasName && (
            <p className="game-list-locked">Enter your name to unlock games</p>
          )}
        </div>

        <div
          className="game-preview-panel"
          style={{
            background: `radial-gradient(ellipse at center, ${activeGame?.color}18 0%, transparent 70%)`,
          }}
        >
          {typeof activeGame?.preview === "function"
            ? activeGame.preview(hoveredGame === activeGame?.key)
            : activeGame?.preview}
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
