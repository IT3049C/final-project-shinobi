import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navigation.css";

export function Navigation() {
  const [hasName, setHasName] = useState(() =>
    Boolean(sessionStorage.getItem("playerName")),
  );

  // Re-check on navigation & storage changes
  useEffect(() => {
    const check = () =>
      setHasName(Boolean(sessionStorage.getItem("playerName")));
    window.addEventListener("storage", check);
    window.addEventListener("focus", check);
    const interval = setInterval(check, 500);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("focus", check);
      clearInterval(interval);
    };
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/rps", label: "Rock Paper Scissors" },
    { to: "/wordle", label: "Wordle" },
    { to: "/tic-tac-toe", label: "Tic Tac Toe" },
    { to: "/trivia", label: "Trivia" },
    { to: "/pokemon", label: "Pokemon" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          <h1 className="game-hub-title">Game Hub</h1>
        </NavLink>
      </div>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.to}>
            {hasName || link.to === "/" ? (
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <span
                className="nav-link nav-link-disabled"
                title="Enter your name on Home to unlock"
              >
                {link.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
