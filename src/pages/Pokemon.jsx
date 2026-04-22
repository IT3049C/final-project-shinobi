import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LobbyScreen } from "../components/pokemon-game/LobbyScreen";
import { WaitingRoom } from "../components/pokemon-game/WaitingRoom";
import { GameHeader } from "../components/pokemon-game/GameHeader";
import { ScoreBar } from "../components/pokemon-game/ScoreBar";
import { TileBoard } from "../components/pokemon-game/TileBoard";
import { ActionPanel } from "../components/pokemon-game/ActionPanel";
import { RoundResult } from "../components/pokemon-game/RoundResult";
import { useRoomPolling } from "../hooks/useRoomPolling";
import { useGameActions } from "../hooks/useGameActions";
import { createGameState, fetchRandomPokemon } from "../logic/pokemonGame";
import { getPlayerId } from "../logic/gameRoomApi";
import "../styles/PokemonGame.css";

export default function Pokemon() {
  const navigate = useNavigate();
  const playerId = getPlayerId();

  const [screen, setScreen] = useState("lobby");
  const [mode, setMode] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [game, setGame] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [guess, setGuess] = useState("");
  const [actionMode, setActionMode] = useState(null);

  const resetToLobby = () => {
    setScreen("lobby");
    setGame(null);
    setPokemon(null);
    setRoomId(null);
    setMode(null);
    setActionMode(null);
    setGuess("");
  };

  useRoomPolling({
    roomId,
    enabled: mode === "online" && screen === "game",
    onUpdate: (gameState) => {
      setGame(gameState);
      if (gameState.pokemon) setPokemon(gameState.pokemon);
    },
    onAbandoned: () => {
      alert("The game has ended — not enough players remaining.");
      resetToLobby();
    },
  });

  const { handleReveal, handleGuessSubmit, handleNextRound } = useGameActions({
    game,
    pokemon,
    mode,
    roomId,
    setGame,
    setPokemon,
    setLoadingPokemon,
    setActionMode,
    setGuess,
  });

  const handleJoinRoom = (rId, gameState) => {
    setRoomId(rId);
    setGame(gameState);
    if (gameState.pokemon) setPokemon(gameState.pokemon);
    setMode("online");
    setScreen("waiting");
  };

  const handleLocalPlay = async () => {
    setMode("local");
    const p = await fetchRandomPokemon();
    setPokemon(p);
    console.log(`🎮 Pokemon: ${p.name} (ID: ${p.id})`);
    setGame(
      createGameState(["Player 1", "Player 2"], {
        tileCount: 25,
        maxPlayers: 2,
      }),
    );
    setScreen("game");
  };

  const handleGameStart = (gameState) => {
    setGame(gameState);
    if (gameState.pokemon) setPokemon(gameState.pokemon);
    setScreen("game");
  };

  const isMyTurn =
    mode === "local"
      ? true
      : game?.players[game.currentPlayerIndex]?.id === playerId;
  const currentPlayer = game?.players[game?.currentPlayerIndex];
  const allTilesRevealed = game?.tiles.every(Boolean);
  const isRoundOver = game?.phase === "roundOver" || game?.phase === "gameOver";

  if (screen === "lobby") {
    return (
      <div className="pg-wrapper">
        <GameHeader mode={null} onBackToLobby={() => navigate("/")} />
        <LobbyScreen
          onJoinRoom={handleJoinRoom}
          onLocalPlay={handleLocalPlay}
        />
      </div>
    );
  }

  if (screen === "waiting") {
    return (
      <div className="pg-wrapper">
        <GameHeader
          mode="online"
          roomId={roomId}
          game={game}
          onBackToLobby={resetToLobby}
        />
        <WaitingRoom
          roomId={roomId}
          onGameStart={handleGameStart}
          onBackToLobby={resetToLobby}
        />
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="pg-wrapper">
      <GameHeader
        mode={mode}
        roomId={roomId}
        game={game}
        onBackToLobby={resetToLobby}
      />

      {mode === "online" && roomId && (
        <div className="pg-room-badge">
          Room: <span>{roomId}</span>
        </div>
      )}

      <ScoreBar game={game} isRoundOver={isRoundOver} />

      <div className="pg-board">
        <TileBoard
          pokemon={pokemon}
          tiles={isRoundOver ? Array(game.tileCount).fill(true) : game.tiles}
          tileCount={game.tileCount}
          isRoundOver={isRoundOver}
          actionMode={actionMode}
          isMyTurn={isMyTurn}
          loadingPokemon={loadingPokemon}
          onReveal={(i) => handleReveal(i, { playerId, actionMode })}
        />

        {!isRoundOver ? (
          <ActionPanel
            currentPlayer={currentPlayer}
            isMyTurn={isMyTurn}
            allTilesRevealed={allTilesRevealed}
            actionMode={actionMode}
            setActionMode={setActionMode}
            guess={guess}
            setGuess={setGuess}
            onGuessSubmit={() => handleGuessSubmit(guess)}
            game={game}
          />
        ) : (
          <RoundResult
            game={game}
            pokemon={pokemon}
            isMyTurn={isMyTurn}
            mode={mode}
            onNextRound={handleNextRound}
            onBackToLobby={resetToLobby}
          />
        )}
      </div>
    </div>
  );
}
