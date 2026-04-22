export function TileBoard({
  pokemon,
  tiles,
  tileCount,
  isRoundOver,
  actionMode,
  isMyTurn,
  loadingPokemon,
  onReveal,
}) {
  const gridSize = Math.sqrt(tileCount ?? tiles.length);

  return (
    <div className="pg-image-wrapper">
      {loadingPokemon ? (
        <div className="pg-loading">Loading...</div>
      ) : (
        <>
          {pokemon && (
            <img
              src={pokemon.image}
              alt="hidden pokemon"
              className="pg-pokemon-img"
              draggable={false}
            />
          )}
          <div
            className="pg-tile-grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {tiles.map((revealed, i) => (
              <div
                key={i}
                className={[
                  "pg-tile",
                  revealed ? "pg-tile-revealed" : "",
                  !revealed && actionMode === "reveal" && isMyTurn
                    ? "pg-tile-clickable"
                    : "",
                ].join(" ")}
                onClick={() => onReveal(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
