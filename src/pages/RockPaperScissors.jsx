// import { loadSettings } from "../logic/settings";
import { GameSection } from "../components/rps-game/GameSection";
import { HighScoresSection } from "../components/rps-game/HighScoresSection";
import { PlayerInfoCard } from "../components/rps-game/PlayerInfoCard";
import "../styles/RPS.css"; //
import { useNavigate } from "react-router-dom";
export function RPSGamePage() {
  const settings = JSON.parse(localStorage.getItem("rpsSettings")) || {};
  const navigate = useNavigate();
  const playerName = settings?.name || "Player";
  const playerAvatar = settings?.avatar || "assassin";
  const difficulty = settings?.difficulty || "normal";

  const handleBackToSettings = () => {
    console.log(`going back to the settings view`);
  };
  console.log(playerAvatar);
  return (
    <main className="rps-main">
      <header>
        <h2>Rock Paper Scissors</h2>
        <nav>
          <a onClick={() => navigate("/")} className="nav-link">
            ← Back to Lobby
          </a>
        </nav>
      </header>
      <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar} />
      <GameSection difficulty={difficulty} />
      <HighScoresSection />
    </main>
  );
}
