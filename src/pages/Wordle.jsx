import { useNavigate } from "react-router-dom";
import { WordleGame } from "./wordle/WordleGame";
import "../styles/PokemonGame.css";

export function Wordle() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";

  return (
    <div className="pg-wrapper">
      <header className="pg-header">
        <h2 className="pg-heading wordle-gradient">Wordle</h2>
        <nav>
          <a onClick={() => navigate("/")} className="nav-link">
            ← Back to Lobby
          </a>
        </nav>
      </header>

      <div className="lobby-player-badge">
        <span className="lobby-player-label">Playing as</span>
        <span className="lobby-player-name">{playerName}</span>
      </div>

      <WordleGame />
    </div>
  );
}
