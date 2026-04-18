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
  maxGuesses,
  wordLength,
}) {
  return (
    <section className="wordle-board" aria-label="Wordle board">
      {Array.from({ length: maxGuesses }, (_, rowIndex) => {
        const submittedGuess = guesses[rowIndex] || "";
        const rowStates = evaluations[rowIndex] || [];
        const isActiveRow = rowIndex === currentRow;

        let letters = submittedGuess.split("");
        if (isActiveRow && !submittedGuess) {
          letters = currentGuess.split("");
        }

        return (
          <div className="wordle-row" key={`row-${rowIndex}`}>
            {Array.from({ length: wordLength }, (_, columnIndex) => {
              const letter = letters[columnIndex] || "";
              const state = rowStates[columnIndex] || null;
              const hasLetter = letter.length > 0;

              return (
                <div
                  className={getTileClassName(state, hasLetter)}
                  key={`tile-${rowIndex}-${columnIndex}`}
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
