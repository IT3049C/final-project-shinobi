import HiddenPicturePreview from "../components/HiddenPicturePreview";

export const games = [
  {
    key: "rps",
    path: "/rps",
    name: "Rock Paper Scissors",
    description: "Challenge the machine. Choose wisely.",
    emoji: "✊",
    color: "#f472b6",
    preview: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "2rem", fontSize: "5rem" }}>
          <span style={{ animation: "float 2s ease-in-out infinite" }}>✊</span>
          <span style={{ animation: "float 2s ease-in-out infinite 0.3s" }}>
            ✋
          </span>
          <span style={{ animation: "float 2s ease-in-out infinite 0.6s" }}>
            ✌️
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            color: "#f472b6",
            letterSpacing: "0.2em",
            fontSize: "1rem",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Rock · Paper · Scissors
        </p>
      </div>
    ),
  },
  {
    key: "wordle",
    path: "/wordle",
    name: "Wordle",
    description: "Guess the word. Six chances only.",
    emoji: "📝",
    color: "#fbbf24",
    preview: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "0.6rem",
        }}
      >
        {[
          ["C", "R", "A", "N", "E"],
          ["S", "L", "A", "T", "E"],
          ["W", "O", "R", "D", "S"],
        ].map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: "6px" }}>
            {row.map((l, ci) => {
              const colors = [
                ["#6b7280", "#fbbf24", "#6b7280", "#34d399", "#6b7280"],
                ["#6b7280", "#6b7280", "#fbbf24", "#6b7280", "#34d399"],
                ["#34d399", "#34d399", "#34d399", "#34d399", "#34d399"],
              ];
              return (
                <div
                  key={ci}
                  style={{
                    width: 52,
                    height: 52,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: colors[ri][ci] + "22",
                    border: `2px solid ${colors[ri][ci]}`,
                    borderRadius: 6,
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: colors[ri][ci],
                  }}
                >
                  {l}
                </div>
              );
            })}
          </div>
        ))}
        <p
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            color: "#fbbf24",
            letterSpacing: "0.2em",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            marginTop: "0.5rem",
          }}
        >
          Wordle
        </p>
      </div>
    ),
  },
  {
    key: "tic-tac-toe",
    path: "/tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Three in a row. Classic never dies.",
    emoji: "⬛",
    color: "#818cf8",
    preview: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 70px)",
            gridTemplateRows: "repeat(3, 70px)",
            gap: "8px",
          }}
        >
          {["X", "O", "X", "", "X", "O", "O", "", "X"].map((cell, i) => (
            <div
              key={i}
              style={{
                width: 70,
                height: 70,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(129,140,248,0.08)",
                border: "1px solid rgba(129,140,248,0.25)",
                borderRadius: 8,
                fontSize: "1.8rem",
                fontFamily: "'Orbitron', sans-serif",
                color: cell === "X" ? "#818cf8" : "#f472b6",
                fontWeight: 700,
              }}
            >
              {cell}
            </div>
          ))}
        </div>
        <p
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            color: "#818cf8",
            letterSpacing: "0.2em",
            fontSize: "1rem",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Tic · Tac · Toe
        </p>
      </div>
    ),
  },
  {
    key: "trivia",
    path: "/trivia",
    name: "Trivia",
    description: "Test your knowledge. Beat the clock.",
    emoji: "🧠",
    color: "#34d399",
    preview: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "1.5rem",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: "4rem" }}>🧠</div>
        <div
          style={{
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.3)",
            borderRadius: 10,
            padding: "1rem 1.5rem",
            textAlign: "center",
            width: "100%",
            maxWidth: 320,
          }}
        >
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              color: "#34d399",
              fontSize: "1.1rem",
              margin: 0,
              fontWeight: 600,
            }}
          >
            What is the capital of France?
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Paris", "Berlin", "Rome", "Madrid"].map((opt, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.9rem",
                padding: "0.4rem 1rem",
                borderRadius: 6,
                background:
                  i === 0 ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${i === 0 ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.1)"}`,
                color: i === 0 ? "#34d399" : "#94a3b8",
                fontWeight: 600,
              }}
            >
              {opt}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "pokemon",
    path: "/pokemon",
    name: "Pokemon",
    description: "Reveal the image. Guess what's hiding.",
    emoji: "🖼️",
    color: "#c084fc",
    preview: (isActive) => <HiddenPicturePreview isActive={isActive} />,
  },
];
