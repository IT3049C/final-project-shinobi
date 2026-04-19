import { useEffect, useRef } from "react";
import { getRoom } from "../logic/gameRoomApi";

export function useRoomPolling({ roomId, enabled, onUpdate, onAbandoned }) {
  const currentPokemonIdRef = useRef(null);

  useEffect(() => {
    if (!enabled || !roomId) return;

    const interval = setInterval(async () => {
      try {
        const { gameState } = await getRoom(roomId);

        if (gameState.phase === "abandoned") {
          clearInterval(interval);
          onAbandoned?.();
          return;
        }

        onUpdate(gameState);

        if (
          gameState.pokemon &&
          gameState.pokemon.id !== currentPokemonIdRef.current
        ) {
          currentPokemonIdRef.current = gameState.pokemon.id;
          console.log(
            `🎮 Pokemon: ${gameState.pokemon.name} (ID: ${gameState.pokemon.id})`,
          );
        }
      } catch {}
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, enabled]);
}
