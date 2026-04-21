import { getCurrentMark, getWinnerPlayer } from "../logic/ticTacToeRoom";

export function TicTacToeBoard({ game, isMyTurn, onMove }) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const winnerPlayer = getWinnerPlayer(game);
  const statusText =
    game.phase === "gameOver"
      ? winnerPlayer
        ? `${winnerPlayer.name} wins the match!`
        : "It's a draw!"
      : `Next turn: ${currentPlayer?.name} (${getCurrentMark(game)})`;

  return (
    <section className="ttt-board-shell">
      <div className="ttt-status-banner" aria-live="polite">
        <span>{statusText}</span>
        <span className={isMyTurn && game.phase === "playing" ? "ttt-status-turn" : "ttt-status-idle"}>
          {isMyTurn && game.phase === "playing" ? "Your move" : "Waiting"}
        </span>
      </div>

      <div className="ttt-grid" role="grid" aria-label="Tic Tac Toe board">
        {game.board.map((cell, index) => {
          const isWinningSquare = game.winningLine?.includes(index);
          const classNames = [
            "ttt-square",
            cell === "X" ? "ttt-square-x" : "",
            cell === "O" ? "ttt-square-o" : "",
            isWinningSquare ? "ttt-square-winning" : "",
          ].join(" ");

          return (
            <button
              key={index}
              className={classNames}
              type="button"
              onClick={() => onMove(index)}
              disabled={
                game.phase !== "playing" || !!cell || !isMyTurn
              }
              aria-label={`Square ${index + 1}${cell ? `, ${cell}` : ""}`}
            >
              {cell}
            </button>
          );
        })}
      </div>
    </section>
  );
}
