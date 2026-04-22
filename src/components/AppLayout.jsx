import { Navigation } from "./Navigation";
import { Outlet } from "react-router-dom";

import "../App.css";

export function AppLayout() {
  return (
    <>
      <main
        style={{
          paddingTop: "64px",
          minHeight: "100vh",
          background: "#0a0a0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <header className="">
          <span className="text-lg font-semibold text-foreground">
            <Navigation />
          </span>
        </header>
        <Outlet />
      </main>
    </>
  );
}
