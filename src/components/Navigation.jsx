import { NavLink } from "react-router-dom";
import "./Navigation.css";

export function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          <h1 className="game-hub-title">Game Hub</h1>
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/trivia"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Trivia
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/rps"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Rock Paper Scissors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tic-tac-toe"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Tic Tac Toe
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/wordle"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Wordle
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/another-game"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Another Game
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
