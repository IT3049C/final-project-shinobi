import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { RPSGamePage } from "./pages/RockPaperScissors";
import { TicTacToe } from "./pages/TicTacToe";
import { Trivia } from "./pages/Trivia";
import { Wordle } from "./pages/Wordle";
import Pokemon from "./pages/Pokemon";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/rps", element: <RPSGamePage /> },
        { path: "/tic-tac-toe", element: <TicTacToe /> },
        { path: "/trivia", element: <Trivia /> },
        { path: "/wordle", element: <Wordle /> },
        { path: "/pokemon", element: <Pokemon /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
