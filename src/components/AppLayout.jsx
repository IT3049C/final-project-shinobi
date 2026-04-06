import { Navigation } from "./Navigation";
import { Outlet } from "react-router-dom";

import "../App.css";

export function AppLayout() {
  return (
    <main>
      <header>
        <h1>Welcome to the Games Lobby</h1>
      </header>
      <Navigation />
      <Outlet />
    </main>
  );
}
