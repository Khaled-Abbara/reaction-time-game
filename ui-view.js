import { UI } from "./Ui-tree";
import { gameState } from "./game-state";

function showScore() {
  UI.game.score.innerText = gameState.score;
}

function showRandomBox() {
  gameState.selectedBox.style.backgroundColor = COLORS.active;
}

function hideRandomBox() {
  gameState.selectedBox.style.backgroundColor = COLORS.default;
}

export { showScore, showRandomBox, hideRandomBox };
