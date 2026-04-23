import { gameState } from "./game-state.js";

function decreaseTime() {
  if (gameState.score <= 8) gameState.time -= 40;
  else if (gameState.score <= 16) gameState.time -= 30;
  else if (gameState.score <= 32) gameState.time -= 20;
  else if (gameState.time > 260) gameState.time -= 10;
}

function increaseScore() {
  gameState.score++;
}

function clearGameState() {
  gameState.score = -1;
  gameState.time = 1600;
  clearTimeout(gameState.countDown);
  deSelectBox();
}

function selectRandomBox() {
  const index = Math.floor(Math.random() * gameState.boxes.length);
  gameState.selectedBox = gameState.boxes[index];
}

export { decreaseTime, clearGameState, selectRandomBox, increaseScore };
