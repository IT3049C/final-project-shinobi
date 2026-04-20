const BASE = "https://game-room-api.fly.dev";

export async function createRoom(initialState) {
  const res = await fetch(`${BASE}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initialState }),
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json();
}

export async function getRoom(roomId) {
  const res = await fetch(`${BASE}/api/rooms/${roomId}`);
  if (!res.ok) throw new Error("Room not found");
  return res.json();
}

export async function updateRoom(roomId, gameState) {
  const res = await fetch(`${BASE}/api/rooms/${roomId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameState }),
  });
  if (!res.ok) throw new Error("Failed to update room");
  return res.json();
}

export async function listRooms() {
  const res = await fetch(`${BASE}/api/rooms`);
  if (!res.ok) throw new Error("Failed to list rooms");
  return res.json();
}

export async function safePush(roomId, localGameState) {
  try {
    const latest = await getRoom(roomId);
    const serverVersion = latest.gameState?.version ?? 0;
    const next = { ...localGameState, version: serverVersion + 1 };
    const updated = await updateRoom(roomId, next);
    return updated.gameState;
  } catch {
    return localGameState;
  }
}

export async function abandonRoom(roomId, gameState) {
  const next = {
    ...gameState,
    phase: "abandoned",
    version: (gameState.version ?? 0) + 1,
  };
  await updateRoom(roomId, next);
}

export function getPlayerId() {
  let id = sessionStorage.getItem("playerId");
  if (!id) {
    id = Math.random().toString(36).slice(2);
    sessionStorage.setItem("playerId", id);
  }
  return id;
}

export function getPlayerName() {
  return sessionStorage.getItem("playerName") || "Player";
}
