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

function showPage(activePageKey) {
  const pages = UI.pages;

  if (pages[activePageKey] == pages["game"] || pages[activePageKey] == pages["gameOver"]) {
    UI.navigation.navTag.style.display = "none";
  } else {
    UI.navigation.navTag.style.display = "flex";
  }
  for (const pageKey in pages) {
    if (!pages[pageKey]) continue;

    if (pageKey === activePageKey) {
      pages[pageKey].style.display = "flex";
    } else {
      pages[pageKey].style.display = "none";
    }
  }
}

function showAuthModal(userKey) {
  if (!userKey) UI.modal.auth.showModal();
  else UI.modal.auth.close();
}

function toggleAuthForm(userKey) {
  if (userKey) {
    UI.auth.header.innerText = "Login to your Account";
    UI.buttons.loginToggle.innerText = "Can't login?. create account";
  } else {
    UI.auth.header.innerText = "Create an Account";
    UI.buttons.loginToggle.innerText = "Have an account?.. login";
  }
  UI.auth.error.innerText = "";
}

export {
  showScore,
  showRandomBox,
  dangerRandomBox,
  hideRandomBox,
  showRandomBoxSuccess,
  createBoxes,
  showPage,
  showAuthModal,
  toggleAuthForm,
};
