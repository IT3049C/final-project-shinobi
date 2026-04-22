import React from "react";

export function GameRoomHeader({ title, onBackToLobby, backLabel = "← Back to Lobby" }) {
  return (
    <header className="pg-header">
      <h2 className="pg-heading">{title}</h2>
      <nav>
        <button className="room-back-button" onClick={onBackToLobby} type="button">
          {backLabel}
        </button>
      </nav>
    </header>
  );
}
