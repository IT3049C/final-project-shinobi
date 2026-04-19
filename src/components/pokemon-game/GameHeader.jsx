import { useNavigate } from "react-router-dom";
import {
  abandonRoom,
  updateRoom,
  getRoom,
  getPlayerId,
} from "../../logic/gameRoomApi";
import { playerLeft } from "../../logic/pokemonGame";

export function GameHeader({ mode, roomId, game, onBackToLobby }) {
  const navigate = useNavigate();
  const playerId = getPlayerId();

  const handleBack = async () => {
    if (
      mode === "online" &&
      roomId &&
      game &&
      game.phase !== "gameOver" &&
      game.phase !== "abandoned"
    ) {
      try {
        const { gameState: latest } = await getRoom(roomId);
        const remaining = latest.players.filter((p) => p.id !== playerId);

        if (remaining.length === 0) {
          await abandonRoom(roomId, latest);
        } else if (latest.phase === "waiting") {
          await updateRoom(roomId, {
            ...latest,
            players: remaining,
            version: (latest.version ?? 0) + 1,
          });
        } else {
          const activeOthers = latest.players.filter(
            (p) => !p.left && p.id !== playerId,
          ).length;
          if (activeOthers <= 1) {
            await abandonRoom(roomId, latest);
          } else {
            const next = playerLeft(latest, playerId);
            await updateRoom(roomId, {
              ...next,
              version: (latest.version ?? 0) + 1,
            });
          }
        }
      } catch {}
    }
    onBackToLobby?.() ?? navigate("/");
  };

  return (
    <header className="pg-header">
      <h2 className="pg-heading">Who's That Pokémon?</h2>
      <nav>
        <a onClick={handleBack} className="nav-link">
          ← Back to Lobby
        </a>
      </nav>
    </header>
  );
}
