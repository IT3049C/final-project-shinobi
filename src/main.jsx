import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { RockPaperScissors } from "./pages/RockPaperScissors";
import { TicTacToe } from "./pages/TicTacToe";
import { Trivia } from "./pages/Trivia";
import { Wordle } from "./pages/Wordle";
import AnotherGame from "./pages/AnotherGame";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/rps", element: <RockPaperScissors /> },
      { path: "/tic-tac-toe", element: <TicTacToe /> },
      { path: "/trivia", element: <Trivia /> },
      { path: "/wordle", element: <Wordle /> },
      { path: "/another-game", element: <AnotherGame /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
