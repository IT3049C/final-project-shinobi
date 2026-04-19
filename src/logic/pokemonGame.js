export function createGameState(players, config = {}) {
  const tileCount = config.tileCount ?? 25;
  const maxPlayers = config.maxPlayers ?? players.length;
  return {
    players: players.map((p, i) => ({
      id: typeof p === "string" ? i : p.id,
      name: typeof p === "string" ? p : p.name,
      score: 0,
      eliminated: false,
      left: false,
    })),
    currentPlayerIndex: 0,
    tiles: Array(tileCount).fill(false),
    tileCount,
    maxPlayers,
    phase: "playing",
    round: 1,
    maxRounds: 3,
    roundWinner: null,
    lastAction: null,
    guessedPlayers: [],
    version: 0,
  };
}

export function revealTile(state, tileIndex) {
  if (state.tiles[tileIndex]) return state;
  const tiles = [...state.tiles];
  tiles[tileIndex] = true;
  return {
    ...state,
    tiles,
    lastAction: null,
    currentPlayerIndex: getNextPlayer(state.players, state.currentPlayerIndex),
  };
}

export function makeGuess(state, guess, pokemonName, allTilesRevealed) {
  const correct = guess.toLowerCase().trim() === pokemonName.toLowerCase();

  if (correct) {
    const tileCount = state.tileCount ?? 25;
    const revealedCount = state.tiles.filter(Boolean).length;
    const points = Math.max(
      Math.round(((tileCount - revealedCount) / tileCount) * 100),
      1,
    );
    const players = state.players.map((p, i) =>
      i === state.currentPlayerIndex ? { ...p, score: p.score + points } : p,
    );
    const isGameOver = state.round >= state.maxRounds;
    return {
      ...state,
      players,
      phase: isGameOver ? "gameOver" : "roundOver",
      roundWinner: state.currentPlayerIndex,
      lastAction: "correctGuess",
    };
  }

  if (allTilesRevealed) {
    const guessedPlayers = [
      ...state.guessedPlayers,
      state.players[state.currentPlayerIndex].id,
    ];
    const everyoneGuessed = state.players
      .filter((p) => !p.left)
      .every((p) => guessedPlayers.includes(p.id));

    if (everyoneGuessed) {
      const isGameOver = state.round >= state.maxRounds;
      return {
        ...state,
        guessedPlayers,
        phase: isGameOver ? "gameOver" : "roundOver",
        roundWinner: null,
        lastAction: "wrongGuess",
      };
    }

    const total = state.players.length;
    let next = (state.currentPlayerIndex + 1) % total;
    while (guessedPlayers.includes(next)) {
      next = (next + 1) % total;
    }

    return {
      ...state,
      guessedPlayers,
      currentPlayerIndex: next,
      lastAction: "wrongGuess",
    };
  }

  return {
    ...state,
    lastAction: "wrongGuess",
    currentPlayerIndex: getNextPlayer(state.players, state.currentPlayerIndex),
  };
}

export function startNextRound(state) {
  const isGameOver = state.round >= state.maxRounds;
  if (isGameOver) return { ...state, phase: "gameOver" };
  return {
    ...state,
    tiles: Array(state.tileCount ?? 25).fill(false),
    phase: "playing",
    round: state.round + 1,
    roundWinner: null,
    lastAction: null,
    guessedPlayers: [],
    currentPlayerIndex: state.roundWinner !== null ? state.roundWinner : 0,
    players: state.players.map((p) => ({ ...p, eliminated: false })),
  };
}

export function getNextPlayer(players, currentIndex) {
  const total = players.length;
  let next = (currentIndex + 1) % total;
  let attempts = 0;
  while (
    (players[next]?.eliminated || players[next]?.left) &&
    attempts < total
  ) {
    next = (next + 1) % total;
    attempts++;
  }
  return next;
}

export function playerLeft(state, playerId) {
  const players = state.players.map((p) =>
    p.id === playerId ? { ...p, left: true } : p,
  );
  const active = players.filter((p) => !p.left);

  if (active.length <= 1) {
    return { ...state, players, phase: "abandoned" };
  }

  let nextIndex = state.currentPlayerIndex;
  if (state.players[state.currentPlayerIndex]?.id === playerId) {
    nextIndex = getNextPlayer(players, state.currentPlayerIndex);
  }

  return { ...state, players, currentPlayerIndex: nextIndex };
}

export async function fetchRandomPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default,
  };
}
