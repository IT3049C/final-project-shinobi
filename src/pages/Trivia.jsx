import { useNavigate } from "react-router-dom";
import { TriviaGame } from "./trivia/TriviaGame";
import "../styles/PokemonGame.css";

export function Trivia() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";

  return (
    <div className="pg-wrapper">
      <header className="pg-header">
        <h2 className="pg-heading">Trivia</h2>
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

      <TriviaGame />
    </div>
  );
}

export default Trivia;
