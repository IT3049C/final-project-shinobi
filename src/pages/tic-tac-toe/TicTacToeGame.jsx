import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameRoomHeader } from "../../components/game-room/GameRoomHeader";
import { RoomPlayerBadge } from "../../components/game-room/RoomPlayerBadge";
import { ScoreBar } from "../../components/pokemon-game/ScoreBar";
import { useRoomPolling } from "../../hooks/useRoomPolling";
import {
  abandonRoom,
  getPlayerId,
  getPlayerName,
  safePush,
} from "../../logic/gameRoomApi";
import { TicTacToeLobby } from "./components/TicTacToeLobby";
import { TicTacToeBoard } from "./components/TicTacToeBoard";
import { TicTacToeResult } from "./components/TicTacToeResult";
import { TicTacToeWaitingRoom } from "./components/TicTacToeWaitingRoom";
import {
  createTicTacToeRoomState,
  playTicTacToeMove,
  resetTicTacToeMatch,
} from "./logic/ticTacToeRoom";
import "../../styles/PokemonGame.css";
import "../../styles/TicTacToe.css";

export function TicTacToeGame() {
  const navigate = useNavigate();
  const playerId = getPlayerId();
  const playerName = getPlayerName();

  const [screen, setScreen] = useState("lobby");
  const [mode, setMode] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [game, setGame] = useState(null);

  useRoomPolling({
    roomId,
    enabled: mode === "online" && screen === "game",
    onUpdate: (gameState) => {
      setGame(gameState);
    },
    onAbandoned: () => {
      resetToLobby();
    },
  });

  const resetToLobby = () => {
    setScreen("lobby");
    setMode(null);
    setRoomId(null);
    setGame(null);
  };

  const handleJoinRoom = (rId, gameState) => {
    setRoomId(rId);
    setGame(gameState);
    setMode("online");
    setScreen("waiting");
  };

  const handleLocalPlay = () => {
    const nextGame = {
      ...createTicTacToeRoomState([
        { id: "local-x", name: "Player 1" },
        { id: "local-o", name: "Player 2" },
      ]),
      phase: "playing",
      round: 1,
      maxRounds: 1,
    };

    setMode("local");
    setGame(nextGame);
    setScreen("game");
  };

  const handleGameStart = (gameState) => {
    setGame(gameState);
    setScreen("game");
  };

  const handleBackToLobby = async () => {
    if (mode === "online" && roomId && game && game.phase !== "abandoned") {
      try {
        await abandonRoom(roomId, game);
      } catch {}
    }
    resetToLobby();
  };

  const handleMove = async (tileIndex) => {
    if (!game || game.phase !== "playing") {
      return;
    }

    const activePlayerId =
      mode === "local"
        ? game.players[game.currentPlayerIndex]?.id
        : playerId;

    const nextGame = playTicTacToeMove(game, tileIndex, activePlayerId);
    if (!nextGame) {
      return;
    }

    if (mode === "online" && roomId) {
      try {
        const updated = await safePush(roomId, nextGame);
        setGame(updated);
      } catch {}
      return;
    }

    setGame(nextGame);
  };

  const handlePlayAgain = async () => {
    if (!game) return;

    const nextGame = resetTicTacToeMatch(game);

    if (mode === "online" && roomId) {
      try {
        const updated = await safePush(roomId, nextGame);
        setGame(updated);
      } catch {}
      return;
    }

    setGame(nextGame);
  };

  if (screen === "lobby") {
    return (
      <div className="ttt-page">
        <GameRoomHeader title="Tic Tac Toe" onBackToLobby={() => navigate("/")} />
        <TicTacToeLobby onJoinRoom={handleJoinRoom} onLocalPlay={handleLocalPlay} />
      </div>
    );
  }

  if (screen === "waiting") {
    return (
      <div className="ttt-page">
        <GameRoomHeader title="Tic Tac Toe" onBackToLobby={handleBackToLobby} />
        <RoomPlayerBadge name={playerName} />
        <TicTacToeWaitingRoom
          roomId={roomId}
          onGameStart={handleGameStart}
          onBackToLobby={handleBackToLobby}
        />
      </div>
    );
  }

  if (!game) {
    return null;
  }

  const isMyTurn = mode === "local" ? true : game.players[game.currentPlayerIndex]?.id === playerId;
  const isHost = game.players[0]?.id === playerId;
  const canPlayAgain = mode === "local" || isHost;
  const isGameOver = game.phase === "gameOver";

  return (
    <div className="ttt-page">
      <GameRoomHeader title="Tic Tac Toe" onBackToLobby={handleBackToLobby} />
      <RoomPlayerBadge name={playerName} />

      {roomId && mode === "online" ? (
        <div className="ttt-room-badge">
          Room: <span>{roomId}</span>
        </div>
      ) : null}

      <ScoreBar game={game} isRoundOver={isGameOver} />

      <div className="ttt-board-layout">
        <TicTacToeBoard game={game} isMyTurn={isMyTurn} onMove={handleMove} />

        {isGameOver ? (
          <TicTacToeResult
            game={game}
            onBackToLobby={handleBackToLobby}
            onPlayAgain={handlePlayAgain}
            canPlayAgain={canPlayAgain}
          />
        ) : (
          <section className="ttt-status-card">
            <p className="ttt-status-title">How to play</p>
            <p className="ttt-status-copy">
              Take turns placing X and O. First player to connect three in a row wins.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

export default TicTacToeGame;
