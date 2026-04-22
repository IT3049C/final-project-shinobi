import { useState, useEffect } from "react";
import {
  createRoom,
  listRooms,
  getRoom,
  updateRoom,
  getPlayerId,
  getPlayerName,
} from "../../logic/gameRoomApi";
import { fetchRandomPokemon } from "../../logic/pokemonGame";

const POLL_INTERVAL = 3000;
const TILE_OPTIONS = [25, 36, 49, 64, 81];
const PLAYER_OPTIONS = [2, 3, 4];

export function LobbyScreen({ onJoinRoom, onLocalPlay }) {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [maxRounds, setMaxRounds] = useState(3);
  const [tileCount, setTileCount] = useState(25);

  const playerName = getPlayerName();
  const playerId = getPlayerId();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await listRooms();
        const open = data.filter(
          (r) =>
            r.gameState?.gameType === "pokemon" &&
            r.gameState?.phase === "waiting" &&
            (r.gameState?.players?.length ?? 0) <
              (r.gameState?.maxPlayers ?? 2),
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
    setError(null);
    try {
      const pokemon = await fetchRandomPokemon();
      const initialState = {
        gameType: "pokemon",
        roomName: roomName.trim(),
        players: [
          {
            id: playerId,
            name: playerName,
            score: 0,
            left: false,
            eliminated: false,
          },
        ],
        currentPlayerIndex: 0,
        tiles: Array(tileCount).fill(false),
        tileCount,
        maxPlayers,
        maxRounds,
        phase: "waiting",
        round: 1,
        roundWinner: null,
        lastAction: null,
        guessedPlayers: [],
        pokemon,
        version: 0,
      };
      const { roomId, gameState } = await createRoom(initialState);
      onJoinRoom(roomId, gameState, 0);
    } catch {
      setError("Failed to create room. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    setJoining(roomId);
    setError(null);
    try {
      const { gameState } = await getRoom(roomId);

      if (gameState.players.length >= (gameState.maxPlayers ?? 2)) {
        setError("Room is full.");
        return;
      }

      if (gameState.players.some((p) => p.id === playerId)) {
        setError("You're already in this room.");
        return;
      }

      const updatedPlayers = [
        ...gameState.players,
        {
          id: playerId,
          name: playerName,
          score: 0,
          left: false,
          eliminated: false,
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
              placeholder="Enter Room Name" // ← updated
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
            />
          </div>

          <div className="lobby-field">
            <label className="lobby-label">Number of Rounds</label>
            <div className="lobby-option-row">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`lobby-option-btn ${maxRounds === n ? "active" : ""}`}
                  onClick={() => setMaxRounds(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="lobby-field">
            <label className="lobby-label">Max Players</label>
            <div className="lobby-option-row">
              {PLAYER_OPTIONS.map((n) => (
                <button
                  key={n}
                  className={`lobby-option-btn ${maxPlayers === n ? "active" : ""}`}
                  onClick={() => setMaxPlayers(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="lobby-field">
            <label className="lobby-label">Difficulty (Tile Count)</label>
            <div className="lobby-option-row">
              {TILE_OPTIONS.map((n) => (
                <button
                  key={n}
                  className={`lobby-option-btn ${tileCount === n ? "active" : ""}`}
                  onClick={() => setTileCount(n)}
                >
                  {Math.sqrt(n)}×{Math.sqrt(n)}
                </button>
              ))}
            </div>
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
                      {room.gameState?.players?.length ?? 0}/
                      {room.gameState?.maxPlayers ?? 2} players ·{" "}
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
