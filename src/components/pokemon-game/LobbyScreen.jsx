import { useState, useEffect } from "react";
import {
  createRoom,
  listRooms,
  getPlayerId,
  getPlayerName,
} from "../../logic/gameRoomApi";
import { fetchRandomPokemon } from "../../logic/pokemonGame";

const POLL_INTERVAL = 3000;

export function LobbyScreen({ onJoinRoom, onLocalPlay }) {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const [manualCode, setManualCode] = useState("");

  const playerName = getPlayerName();
  const playerId = getPlayerId();

  useEffect(() => {
    let interval;

    const fetchRooms = async () => {
      try {
        const data = await listRooms();
        const open = data.filter(
          (r) =>
            r.gameState?.phase === "waiting" &&
            (r.gameState?.players?.length ?? 0) < 2,
        );
        setRooms(open);
      } catch {
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
    interval = setInterval(fetchRooms, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const pokemon = await fetchRandomPokemon();
      const initialState = {
        roomName: roomName.trim(),
        players: [{ id: playerId, name: playerName, ready: true }],
        currentPlayerIndex: 0,
        tiles: Array(25).fill(false),
        phase: "waiting",
        round: 1,
        maxRounds: 3,
        roundWinner: null,
        lastAction: null,
        guessedPlayers: [],
        pokemon,
        version: 0,
      };
      const { roomId, gameState } = await createRoom(initialState);
      onJoinRoom(roomId, gameState, 0);
    } catch (e) {
      setError("Failed to create room. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    setJoining(roomId);
    setError(null);
    try {
      const { gameState } = await import("../../logic/gameRoomApi").then(() =>
        import("../../logic/gameRoomApi").then((m) => m.getRoom(roomId)),
      );

      const updatedState = {
        ...gameState,
        players: [
          ...gameState.players,
          { id: playerId, name: playerName, ready: true },
        ],
        phase: "playing",
        version: (gameState.version ?? 0) + 1,
      };
      const { updateRoom } = await import("../../logic/gameRoomApi");
      await updateRoom(roomId, updatedState);
      onJoinRoom(roomId, updatedState, 1);
    } catch {
      setError("Failed to join room. It may be full or gone.");
    } finally {
      setJoining(null);
    }
  };

  const handleManualJoin = () => {
    if (manualCode.trim()) handleJoinRoom(manualCode.trim().toUpperCase());
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
              placeholder="e.g. Kymani's Room"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
            />
          </div>

          <button
            className="pg-btn pg-btn-guess"
            onClick={handleCreateRoom}
            disabled={creating || !roomName.trim()}
          >
            {creating ? "Creating..." : "＋ Create Online Room"}
          </button>

          <div className="lobby-divider">or</div>

          <button className="pg-btn pg-btn-reveal" onClick={onLocalPlay}>
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
                      {room.gameState?.players?.length ?? 0}/2 players ·{" "}
                      <span className="lobby-room-code">{room.id}</span>
                    </span>
                  </div>
                  <button
                    className="pg-btn pg-btn-guess"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={joining === room.id}
                  >
                    {joining === room.id ? "Joining..." : "Join →"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {error && <p className="lobby-error">{error}</p>}
    </div>
  );
}
