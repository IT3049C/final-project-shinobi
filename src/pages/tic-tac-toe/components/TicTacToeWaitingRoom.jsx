import { useEffect, useState } from "react";
import { getPlayerId, getRoom, updateRoom } from "../../../logic/gameRoomApi";

export function TicTacToeWaitingRoom({ roomId, onGameStart, onBackToLobby }) {
  const [gameState, setGameState] = useState(null);
  const playerId = getPlayerId();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { gameState } = await getRoom(roomId);

        if (gameState.phase === "abandoned") {
          clearInterval(interval);
          alert("The room was closed.");
          onBackToLobby?.();
          return;
        }

        setGameState(gameState);

        if (gameState.phase === "playing") {
          clearInterval(interval);
          onGameStart(gameState);
        }
      } catch {}
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, onBackToLobby, onGameStart]);

  if (!gameState) {
    return (
      <div className="waiting-wrapper">
        <div className="waiting-card">
          <p className="waiting-title">Loading...</p>
        </div>
      </div>
    );
  }

  const players = gameState.players || [];
  const maxPlayers = gameState.maxPlayers || 2;
  const isHost = players[0]?.id === playerId;
  const canStart = players.length >= 2;

  const handleStart = async () => {
    await updateRoom(roomId, {
      ...gameState,
      phase: "playing",
      version: (gameState.version ?? 0) + 1,
    });
  };

  return (
    <div className="waiting-wrapper">
      <div className="waiting-card">
        <p className="waiting-title">
          Waiting ({players.length}/{maxPlayers})...
        </p>
        <p className="waiting-label">Share this room code</p>
        <div className="waiting-code">{roomId}</div>

        <div className="waiting-players">
          {players.map((player, index) => (
            <div key={player.id ?? index} className="waiting-player-item">
              <span>
                {index === 0 ? "X" : "O"} {player.name}
                {player.id === playerId && " (You)"}
              </span>
              <span className="waiting-ready">✓ Ready</span>
            </div>
          ))}
          {Array.from({ length: maxPlayers - players.length }).map((_, index) => (
            <div key={`empty-${index}`} className="waiting-player-item empty">
              <span>⋯ Waiting for player...</span>
            </div>
          ))}
        </div>

        {isHost ? (
          <button
            className="pg-btn pg-btn-guess"
            onClick={handleStart}
            disabled={!canStart}
            type="button"
          >
            {canStart
              ? `🎮 Start Game (${players.length} players)`
              : "Need at least 2 players"}
          </button>
        ) : (
          <p className="waiting-hint">Waiting for host to start the game...</p>
        )}

        <div className="waiting-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
