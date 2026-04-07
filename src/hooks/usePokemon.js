import { useState } from "react";

export function usePokemon() {
  const [pokemonImg, setPokemonImg] = useState(null);

  const fetchPokemon = async () => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await res.json();

    setPokemonImg(data.sprites.other["official-artwork"].front_default);
  };

  return { pokemonImg, fetchPokemon };
}
