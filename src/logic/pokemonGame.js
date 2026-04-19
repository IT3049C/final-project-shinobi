export function createGameState(players) {
  return {
    players: players.map((name, i) => ({
      id: i,
      name,
      score: 0,
      eliminated: false,
    })),
    currentPlayerIndex: 0,
    tiles: Array(25).fill(false),
    phase: "playing",
    round: 1,
    maxRounds: 3,
    roundWinner: null,
    lastAction: null,
    guessedPlayers: [],
  };
}

export function revealTile(state, tileIndex) {
  if (state.tiles[tileIndex]) return state;
  const tiles = [...state.tiles];
  tiles[tileIndex] = true;
  return {
    ...state,
    tiles,
    lastAction: "reveal",
    currentPlayerIndex: getNextPlayer(state.players, state.currentPlayerIndex),
  };
}

export function makeGuess(state, guess, pokemonName, allTilesRevealed) {
  const correct = guess.toLowerCase().trim() === pokemonName.toLowerCase();

  if (correct) {
    const revealedCount = state.tiles.filter(Boolean).length;
    const points = Math.max(25 - revealedCount * 2, 1);
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
    const guessedPlayers = [...state.guessedPlayers, state.currentPlayerIndex];
    const everyoneGuessed = state.players.every((_, i) =>
      guessedPlayers.includes(i),
    );

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
    tiles: Array(25).fill(false),
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
  while (players[next]?.eliminated && attempts < total) {
    next = (next + 1) % total;
    attempts++;
  }
  return next;
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
