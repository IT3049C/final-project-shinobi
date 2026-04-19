import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.css";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/trivia", label: "Trivia" },
    { to: "/rps", label: "Rock Paper Scissors" },
    { to: "/tic-tac-toe", label: "Tic Tac Toe" },
    { to: "/wordle", label: "Wordle" },
    { to: "/another-game", label: "Pokemon" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          <h1 className="game-hub-title">Game Hub</h1>
        </NavLink>
      </div>
      <ul className="navbar-links">
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

          return (
            <li key={item.to}>
              <button
                className={isActive ? "nav-link active nav-button" : "nav-link nav-button"}
                onClick={() => navigate(item.to)}
                type="button"
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
