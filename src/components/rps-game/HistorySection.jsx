const moveEmoji = { rock: "✊", paper: "✋", scissors: "✌️" };

export function HistorySection({ history }) {
  return (
    <ul id="history" aria-live="polite">
      {history.length === 0 ? (
        <li className="history-empty">No rounds played yet.</li>
      ) : (
        history.map((h, i) => (
          <li
            key={i}
            className={`history-item ${h.msg.includes("You win") ? "history-win" : h.msg.includes("CPU") ? "history-loss" : "history-tie"}`}
          >
            <div className="history-side">
              <span className="history-emoji">{moveEmoji[h.player]}</span>
              <div className="history-move-info">
                <span className="history-who">You</span>
                <span className="history-move-name">{h.player}</span>
              </div>
            </div>

            <span className="history-result">
              {h.msg.includes("You win")
                ? "WIN"
                : h.msg.includes("CPU")
                  ? "LOSS"
                  : "TIE"}
            </span>

            <div className="history-side history-side-right">
              <div className="history-move-info history-move-info-right">
                <span className="history-who">CPU</span>
                <span className="history-move-name">{h.cpu}</span>
              </div>
              <span className="history-emoji">{moveEmoji[h.cpu]}</span>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
