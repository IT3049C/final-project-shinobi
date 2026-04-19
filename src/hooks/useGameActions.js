import {
  revealTile,
  makeGuess,
  startNextRound,
  fetchRandomPokemon,
} from "../logic/pokemonGame";
import { safePush } from "../logic/gameRoomApi";

export function useGameActions({
  game,
  pokemon,
  mode,
  roomId,
  setGame,
  setPokemon,
  setLoadingPokemon,
  setActionMode,
  setGuess,
}) {
  const pushGame = async (nextGame) => {
    if (mode === "local") {
      setGame(nextGame);
      return nextGame;
    }
    try {
      const updated = await safePush(roomId, nextGame);
      setGame(updated);
      if (updated.pokemon) setPokemon(updated.pokemon);
      return updated;
    } catch {
      setGame(nextGame);
      return nextGame;
    }
  };

  const loadPokemon = async () => {
    setLoadingPokemon(true);
    const p = await fetchRandomPokemon();
    console.log(`🎮 Pokemon: ${p.name} (ID: ${p.id})`);
    setLoadingPokemon(false);
    return p;
  };

  const handleReveal = async (i, { playerId, actionMode }) => {
    if (!game || game.phase !== "playing") return;
    if (game.tiles[i]) return;
    if (actionMode !== "reveal") return;
    if (
      mode === "online" &&
      game.players[game.currentPlayerIndex]?.id !== playerId
    )
      return;
    await pushGame(revealTile(game, i));
    setActionMode(null);
  };

  const handleGuessSubmit = async (guess) => {
    if (!guess.trim() || !pokemon) return;
    const allTilesRevealed = game.tiles.every(Boolean);
    const next = makeGuess(game, guess, pokemon.name, allTilesRevealed);
    await pushGame(next);
    setGuess("");
    setActionMode(null);
  };

  const handleNextRound = async () => {
    setActionMode(null);
    const p = await loadPokemon();
    const next = {
      ...startNextRound(game),
      pokemon: p,
      tiles: Array(game.tileCount ?? 25).fill(false),
    };
    await pushGame(next);
    setPokemon(p);
  };

  return {
    pushGame,
    loadPokemon,
    handleReveal,
    handleGuessSubmit,
    handleNextRound,
  };
}
