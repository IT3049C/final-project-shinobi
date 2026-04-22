import React from "react";

export function RoomPlayerBadge({ label = "Playing as", name }) {
  return (
    <div className="lobby-player-badge">
      <span className="lobby-player-label">{label}</span>
      <span className="lobby-player-name">{name}</span>
    </div>
  );
}
