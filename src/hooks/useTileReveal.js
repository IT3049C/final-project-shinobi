import { useState, useRef } from "react";

export function useTileReveal() {
  const [revealedTiles, setRevealedTiles] = useState([]);
  const timerRef = useRef(null);

  const startReveal = () => {
    const indices = Array.from({ length: 25 }, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let i = 0;

    timerRef.current = setInterval(() => {
      setRevealedTiles((prev) => [...prev, indices[i]]);
      i++;

      if (i === indices.length) {
        clearInterval(timerRef.current);
        setRevealedTiles(indices);
      }
    }, 60);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setRevealedTiles([]);
  };

  return { revealedTiles, startReveal, reset, timerRef };
}
