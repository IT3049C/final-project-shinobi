export function TileGrid({ revealedTiles }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridTemplateRows: "repeat(5, 1fr)",
        gap: 0,
        zIndex: 10,
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => {
        const isRevealed = revealedTiles.includes(i);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isRevealed ? "transparent" : "#000",
              color: "#818cf8",
              fontWeight: "bold",
              fontSize: "1.2rem",
              transition: "background 0.3s ease",
            }}
          >
            {!isRevealed && "?"}
          </div>
        );
      })}
    </div>
  );
}
