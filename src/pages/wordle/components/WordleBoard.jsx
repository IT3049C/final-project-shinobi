import React from "react";

function getTileClassName(state, hasLetter) {
  const classNames = ["wordle-tile"];

  if (hasLetter) {
    classNames.push("wordle-tile-filled");
  }

  if (state) {
    classNames.push(`wordle-tile-${state}`);
  }

  return classNames.join(" ");
}

export function WordleBoard({
  currentGuess,
  currentRow,
  evaluations,
  guesses,
  invalidAttemptCount,
  maxGuesses,
  revealCounts,
  status,
  wordLength,
}) {
  return (
    <section className="wordle-board" aria-label="Wordle board">
      {Array.from({ length: maxGuesses }, (_, rowIndex) => {
        const submittedGuess = guesses[rowIndex] || "";
        const rowStates = evaluations[rowIndex] || [];
        const isActiveRow = rowIndex === currentRow;
        const revealedTileCount = revealCounts[rowIndex] || 0;
        const isRevealingRow =
          status === "playing" && isActiveRow && submittedGuess.length > 0 && revealedTileCount > 0;

        let letters = submittedGuess.split("");
        if (isActiveRow && !submittedGuess) {
          letters = currentGuess.split("");
        }

        const rowClasses = ["wordle-row"];
        const rowKey = isActiveRow
          ? `row-${rowIndex}-attempt-${invalidAttemptCount}`
          : `row-${rowIndex}`;

        if (isActiveRow && invalidAttemptCount > 0) {
          rowClasses.push("animate__animated", "animate__headShake");
        }

        return (
          <div className={rowClasses.join(" ")} key={rowKey}>
            {Array.from({ length: wordLength }, (_, columnIndex) => {
              const letter = letters[columnIndex] || "";
              const state = rowStates[columnIndex] || null;
              const hasLetter = letter.length > 0;
              const shouldRevealTile = isRevealingRow && columnIndex < revealedTileCount;
              const isFinalizedTile = submittedGuess && state && !isRevealingRow;
              const shouldFlip = shouldRevealTile || isFinalizedTile;
              const tileState = shouldRevealTile || isFinalizedTile ? state : null;

              const tileClasses = [getTileClassName(tileState, hasLetter)];
              if (shouldFlip) {
                tileClasses.push("animate__animated", "animate__flipInX");
              }

              if (status === "won" && rowIndex === currentRow && shouldFlip) {
                tileClasses.push("wordle-win-tile");
              }

              return (
                <div
                  className={tileClasses.join(" ")}
                  key={`tile-${rowIndex}-${columnIndex}`}
                  style={
                    shouldRevealTile
                      ? {
                          animationDuration: "0.5s",
                          animationDelay: `${columnIndex * 0.13}s`,
                        }
                      : undefined
                  }
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
