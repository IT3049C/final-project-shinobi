import { GameSection } from "../components/rps-game/GameSection";
import { HighScoresSection } from "../components/rps-game/HighScoresSection";
import { PlayerInfoCard } from "../components/rps-game/PlayerInfoCard";
import "../styles/RPS.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function RPSGamePage() {
  const settings = JSON.parse(localStorage.getItem("rpsSettings")) || {};
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";
  const playerAvatar = sessionStorage.getItem("playerAvatar") || "assassin";
  const difficulty = settings?.difficulty || "normal";

  const [highScore, setHighScore] = useState(
    () => JSON.parse(localStorage.getItem("rpsHighScore")) || null,
  );

  const handleGameReset = (finalScore) => {
    if (finalScore.player === 0) return;

    if (highScore && finalScore.player <= highScore.score) return;

    const newEntry = {
      name: playerName,
      score: finalScore.player,
      date: new Date().toISOString(),
    };

    setHighScore(newEntry);
    localStorage.setItem("rpsHighScore", JSON.stringify(newEntry));
  };

  const handleClearHighScore = () => {
    localStorage.removeItem("rpsHighScore");
    setHighScore(null);
  };

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
      <GameSection difficulty={difficulty} onGameReset={handleGameReset} />
      <HighScoresSection highScore={highScore} onClear={handleClearHighScore} />
    </main>
  );
}
