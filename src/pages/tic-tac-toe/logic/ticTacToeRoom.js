export function createTicTacToeRoomState(players, config = {}) {
  const maxPlayers = config.maxPlayers ?? 2;
  return {
    gameType: "tictactoe",
    players: players.map((player, index) => ({
      id: typeof player === "string" ? `${index}` : player.id,
      name: typeof player === "string" ? player : player.name,
      score: typeof player === "string" ? 0 : (player.score ?? 0),
      eliminated: false,
      left: false,
      mark: index === 0 ? "X" : "O",
    })),
    board: Array(9).fill(null),
    currentPlayerIndex: 0,
    round: 1,
    maxRounds: 1,
    maxPlayers,
    phase: "waiting",
    winnerId: null,
    winningLine: [],
    lastMove: null,
    version: 0,
  };
}

export function getBoardWinner(board) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line };
    }
  }

  return null;
}

export function isBoardFull(board) {
  return board.every(Boolean);
}

export function getCurrentMark(gameState) {
  return gameState.players[gameState.currentPlayerIndex]?.mark ?? "X";
}

export function getWinnerPlayer(gameState) {
  if (!gameState.winnerId) {
    return null;
  }

  return (
    gameState.players.find((player) => player.id === gameState.winnerId) ?? null
  );
}

export function playTicTacToeMove(gameState, tileIndex, playerId) {
  if (!gameState || gameState.phase !== "playing") {
    return null;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (!currentPlayer || currentPlayer.id !== playerId) {
    return null;
  }

  if (gameState.board[tileIndex]) {
    return null;
  }

  const nextBoard = [...gameState.board];
  nextBoard[tileIndex] = currentPlayer.mark;

  const winner = getBoardWinner(nextBoard);
  const nextPlayers = gameState.players.map((player, index) => {
    if (index !== gameState.currentPlayerIndex) {
      return player;
    }

    return {
      ...player,
      score: player.score,
    };
  });

  if (winner) {
    nextPlayers[gameState.currentPlayerIndex] = {
      ...nextPlayers[gameState.currentPlayerIndex],
      score: (nextPlayers[gameState.currentPlayerIndex].score ?? 0) + 1,
    };

    return {
      ...gameState,
      players: nextPlayers,
      board: nextBoard,
      phase: "gameOver",
      winnerId: currentPlayer.id,
      winningLine: winner.line,
      lastMove: { tileIndex, mark: currentPlayer.mark },
      currentPlayerIndex: gameState.currentPlayerIndex,
    };
  }

  if (isBoardFull(nextBoard)) {
    return {
      ...gameState,
      players: nextPlayers,
      board: nextBoard,
      phase: "gameOver",
      winnerId: null,
      winningLine: [],
      lastMove: { tileIndex, mark: currentPlayer.mark },
      currentPlayerIndex: gameState.currentPlayerIndex,
    };
  }

  return {
    ...gameState,
    players: nextPlayers,
    board: nextBoard,
    phase: "playing",
    winnerId: null,
    winningLine: [],
    lastMove: { tileIndex, mark: currentPlayer.mark },
    currentPlayerIndex:
      (gameState.currentPlayerIndex + 1) % gameState.players.length,
  };
}

export function resetTicTacToeMatch(gameState) {
  return {
    ...gameState,
    board: Array(9).fill(null),
    currentPlayerIndex: 0,
    round: 1,
    maxRounds: 1,
    phase: "playing",
    winnerId: null,
    winningLine: [],
    lastMove: null,
    version: (gameState.version ?? 0) + 1,
  };
}
