import { UI } from "./ui-tree.js";
import { gameState } from "./game-state.js";

const COLORS = {
  active: "red",
  danger: "#902626",
  success: "green",
  default: "#222",
};

function showScore(score) {
  UI.game.score.innerText = score;
}

function showRandomBox(id) {
  UI.boxes[id].style.backgroundColor = COLORS.active;
}

function dangerRandomBox(id, countDown) {
  const box = UI.boxes[id];

  // 1. Reset everything and set starting color
  box.style.transition = "none";
  box.style.backgroundColor = "red";

  // 2. FORCE REFLOW: This tells the browser "Stop what you're doing and paint this red NOW"
  void box.offsetWidth;

  // 3. Start the transition immediately after the forced paint
  box.style.transition = `background-color ${countDown}s ease-out`;
  box.style.backgroundColor = COLORS.danger;
}

function hideRandomBox(id) {
  UI.boxes[id].style.backgroundColor = COLORS.default;
}

function showRandomBoxSuccess(id) {
  const box = UI.boxes[id];
  box.style.transition = "none";
  box.style.backgroundColor = COLORS.success;
}

function createBoxes() {
  UI.game.container.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");
    box.id = i;
    UI.game.container.appendChild(box);
    UI.boxes[i] = box;
  }
}
export {
  showScore,
  showRandomBox,
  dangerRandomBox,
  hideRandomBox,
  showRandomBoxSuccess,
  createBoxes,
};
