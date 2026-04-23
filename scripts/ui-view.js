import { UI } from "./ui-tree.js";
import { gameState } from "./game-state.js";

const COLORS = {
  active: "red",
  success: "green",
  default: "#222",
};

function showScore(score) {
  UI.game.score.innerText = score;
}

function showRandomBox(id) {
  UI.boxes[id].style.backgroundColor = COLORS.active;
}

function hideRandomBox(id) {
  UI.boxes[id].style.backgroundColor = COLORS.default;
}

function showRandomBoxSuccess(id) {
  UI.boxes[id].style.backgroundColor = COLORS.success;
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
export { showScore, showRandomBox, hideRandomBox, showRandomBoxSuccess, createBoxes };
