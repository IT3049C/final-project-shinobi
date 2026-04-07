import { useEffect } from "react";
import { usePokemon } from "../hooks/usePokemon";
import { useTileReveal } from "../hooks/useTileReveal";
import { TileGrid } from "./TileGrid";

function HiddenPicturePreview({ isActive }) {
  const { pokemonImg, fetchPokemon } = usePokemon();
  const { revealedTiles, startReveal, reset, timerRef } = useTileReveal();

  useEffect(() => {
    reset();

    if (isActive) {
      fetchPokemon();

      timerRef.current = setTimeout(() => {
        startReveal();
      }, 500);
    }

    return () => reset();
  }, [isActive]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 250, height: 250 }}>
        {pokemonImg ? (
          <img
            src={pokemonImg}
            alt="pokemon"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span>Loading...</span>
        )}

        <TileGrid revealedTiles={revealedTiles} />
      </div>

      <p style={{ color: "#c084fc", letterSpacing: "0.3em" }}>
        Who's That Pokémon?
      </p>
    </div>
  );
}

export default HiddenPicturePreview;
