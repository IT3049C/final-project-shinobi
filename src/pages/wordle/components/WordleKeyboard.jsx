import React from "react";

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

function getKeyLabel(key) {
  if (key === "BACKSPACE") {
    return "DEL";
  }
  return key;
}

function getKeyClassName(key, state) {
  const classNames = ["wordle-key"];

  if (key === "ENTER" || key === "BACKSPACE") {
    classNames.push("wordle-key-wide");
  }

  if (state) {
    classNames.push(`wordle-key-${state}`);
  }

  return classNames.join(" ");
}

export function WordleKeyboard({ disabled, letterStates, onKeyPress }) {
  return (
    <section className="wordle-keyboard" aria-label="Wordle keyboard">
      {KEYBOARD_LAYOUT.map((row) => (
        <div className="wordle-key-row" key={row.join("-")}>
          {row.map((key) => {
            const letterState = letterStates[key];
            return (
              <button
                className={getKeyClassName(key, letterState)}
                disabled={disabled}
                key={key}
                onClick={() => onKeyPress(key)}
                type="button"
              >
                {getKeyLabel(key)}
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}
