import { useEffect, useState } from "react";
import {
  createRoom,
  getPlayerId,
  getPlayerName,
  getRoom,
  listRooms,
  updateRoom,
} from "../../../logic/gameRoomApi";
import { createTicTacToeRoomState } from "../logic/ticTacToeRoom";

const POLL_INTERVAL = 3000;

export function TicTacToeLobby({ onJoinRoom, onLocalPlay }) {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState("");
  const [manualCode, setManualCode] = useState("");

  const playerName = getPlayerName();
  const playerId = getPlayerId();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await listRooms();
        const open = data.filter(
          (room) =>
            room.gameState?.gameType === "tictactoe" &&
            room.gameState?.phase === "waiting" &&
            (room.gameState?.players?.length ?? 0) <
              (room.gameState?.maxPlayers ?? 2),
        );
        setRooms(open);
      } catch {
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    setCreating(true);
    setError("");

    try {
      const initialState = createTicTacToeRoomState([
        { id: playerId, name: playerName },
      ]);

      const payload = {
        ...initialState,
        roomName: roomName.trim(),
      };

      const { roomId, gameState } = await createRoom(payload);
      onJoinRoom(roomId, gameState, 0);
    } catch {
      setError("Failed to create room. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    setJoining(roomId);
    setError("");

    try {
      const { gameState } = await getRoom(roomId);

      if (gameState.players.length >= (gameState.maxPlayers ?? 2)) {
        setError("Room is full.");
        return;
      }

      if (gameState.players.some((player) => player.id === playerId)) {
        setError("You're already in this room.");
        return;
      }

      const updatedPlayers = [
        ...gameState.players,
        {
          id: playerId,
          name: playerName,
          score: 0,
          eliminated: false,
          left: false,
          mark: "O",
        },
      ];

      const updatedState = {
        ...gameState,
        players: updatedPlayers,
        phase: "waiting",
        version: (gameState.version ?? 0) + 1,
      };

      await updateRoom(roomId, updatedState);
      onJoinRoom(roomId, updatedState, updatedPlayers.length - 1);
    } catch {
      setError("Failed to join room. It may be full or gone.");
    } finally {
      setJoining(null);
    }
  };

  const handleManualJoin = () => {
    if (manualCode.trim()) {
      handleJoinRoom(manualCode.trim().toUpperCase());
    }
  };

  return (
    <div className="lobby-wrapper">
      <div className="lobby-player-badge">
        <span className="lobby-player-label">Playing as</span>
        <span className="lobby-player-name">{playerName}</span>
      </div>

      <div className="lobby-columns">
        <div className="lobby-card">
          <p className="lobby-card-title">Create a Room</p>

          <div className="lobby-field">
            <label className="lobby-label">Room Name</label>
            <input
              className="lobby-input"
              type="text"
              placeholder="Enter Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
            />
          </div>

          <button
            className="pg-btn pg-btn-guess"
            onClick={handleCreateRoom}
            disabled={creating || !roomName.trim()}
            type="button"
          >
            {creating ? "Creating..." : "＋ Create Online Room"}
          </button>

          <div className="lobby-divider">or</div>

          <button
            className="pg-btn pg-btn-reveal"
            onClick={onLocalPlay}
            type="button"
          >
            🎮 Play Local 2 Player
          </button>
        </div>

        <div className="lobby-card">
          <p className="lobby-card-title">Join a Room</p>

          <div className="lobby-field">
            <label className="lobby-label">Enter Room Code</label>
            <div className="lobby-code-row">
              <input
                className="lobby-input"
                type="text"
                placeholder="e.g. ABC123"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleManualJoin()}
                maxLength={8}
              />
              <button
                className="pg-btn pg-btn-reveal"
                onClick={handleManualJoin}
                disabled={!manualCode.trim()}
                type="button"
              >
                Join
              </button>
            </div>
          </div>

          <div className="lobby-divider">or pick an open room</div>

          <div className="lobby-room-list">
            {loadingRooms ? (
              <p className="lobby-empty">Loading rooms...</p>
            ) : rooms.length === 0 ? (
              <p className="lobby-empty">No open rooms right now.</p>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="lobby-room-item">
                  <div className="lobby-room-info">
                    <span className="lobby-room-name">
                      {room.gameState?.roomName || room.id}
                    </span>
                    <span className="lobby-room-meta">
                      {room.gameState?.players?.length ?? 0}/
                      {room.gameState?.maxPlayers ?? 2} players ·{" "}
                      <span className="lobby-room-code">{room.id}</span>
                    </span>
                  </div>
                  <button
                    className="pg-btn pg-btn-guess"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={joining === room.id}
                    type="button"
                  >
                    {joining === room.id ? "Joining..." : "Join →"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {error ? <p className="lobby-error">{error}</p> : null}
    </div>
  );
}
