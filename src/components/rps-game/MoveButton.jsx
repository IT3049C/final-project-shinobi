import { capitalize } from "../../utils/string_formatting";

const moveEmoji = { rock: "✊", paper: "✋", scissors: "✌️" };

export function MoveButton({ label, onClick }) {
  return (
    <button data-move={label} onClick={onClick}>
      {moveEmoji[label]} {capitalize(label)}
    </button>
  );
}
