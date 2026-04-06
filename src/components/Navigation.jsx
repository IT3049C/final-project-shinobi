import { NavLink } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {` | `}
      <NavLink to="/trivia">Trivia</NavLink>
      {` | `}
      <NavLink to="/rps">Rock Paper Scissors</NavLink>
      {` | `}
      <NavLink to="/tic-tac-toe">Tic Tac Toe</NavLink>
      {` | `}
      <NavLink to="/wordle">Wordle</NavLink>
      {` | `}
      <NavLink to="/another-game">Another Game</NavLink>
    </nav>
  );
}
