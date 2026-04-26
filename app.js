import { UI } from "./scripts/ui-tree.js";
import { User } from "./scripts/auth-tree.js";
import { sfx } from "./scripts/sfx-tree.js";
import { gameState } from "./scripts/game-state.js";

import { validateAuthInput } from "./scripts/auth-actions.js";

import {
  firebaseConfig,
  initializeApp,
  getDatabase,
  ref,
  update,
  onValue,
} from "./scripts/db-firebase.js";

import {
  showScore,
  showRandomBox,
  dangerRandomBox,
  hideRandomBox,
  showRandomBoxSuccess,
  createBoxes,
  showPage,
  showAuthModal,
  toggleAuthForm,
  showAccountInfo,
} from "./scripts/ui-view.js";

import {
  decreaseTime,
  clearGameState,
  selectRandomBox,
  increaseScore,
  deSelectRandomBox,
} from "./scripts/game-engine.js";

import { getUserById, getUsers, createUser, updateUserScore } from "./scripts/db-actions.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =====================
// STATE & CONSTANTS
// =====================
let loginStatus = false;
let messages = [];
let userAccounts = null;

// =====================
// Listeners
// =====================
setupLeaderboards();
collectProfileData();

window.addEventListener("load", loadMessages);

UI.buttons.start.addEventListener("click", initializeGame);
UI.buttons.reset.addEventListener("click", resetGame);
UI.buttons.tutorial.addEventListener("click", () => showPage("tutorial"));
UI.buttons.goBack.addEventListener("click", resetGame);
UI.buttons.profile.addEventListener("click", () => showPage("account"));
UI.buttons.logout.addEventListener("click", () => {
  localStorage.removeItem("id");
  resetGame;
  location.reload();
});

UI.navigation.menu.addEventListener("click", resetGame);
UI.navigation.leaderboard.addEventListener("click", () => showPage("leaderboard"));
UI.navigation.credits.addEventListener("click", () => showPage("credits"));
UI.navigation.account.addEventListener("click", () => showPage("account"));

UI.game.container.addEventListener("click", (e) => handleClick(e));

// =====================
// AUTH LOGIC
// =====================

UI.buttons.submitAuth.addEventListener("click", () =>
  loginStatus ? loginAccount() : createAccount(),
);
UI.buttons.loginToggle.addEventListener("click", () => {
  console.log(loginStatus);
  loginStatus = !loginStatus;
  toggleAuthForm(loginStatus);
});

const userKey = localStorage.getItem("id");
showAuthModal(userKey);

async function createAccount() {
  const usernameInput = UI.auth.username.value;
  const passwordInput = UI.auth.password.value;

  const { success, error } = await validateAuthInput(usernameInput, passwordInput);

  if (success) {
    const { success, data } = await createUser(usernameInput, passwordInput);

    if (success) {
      localStorage.setItem("id", data);
      UI.modal.auth.close();
      collectProfileData();
    }
  } else {
    UI.auth.error.innerText = error;
    return;
  }
}

async function loginAccount(username, password) {
  const usernameInput = UI.auth.username.value;
  const passwordInput = UI.auth.password.value;

  const { data, error } = await getUsers();
  const foundUser = Object.entries(data).find(
    ([_, user]) => user.username === usernameInput && user.password === passwordInput,
  );

  if (foundUser) {
    localStorage.setItem("id", foundUser[0]);
    UI.modal.auth.close();
    UI.auth.error.innerText = "";
  } else {
    UI.auth.error.innerText = "Incorrect username or password";
  }
}

async function collectProfileData() {
  const userKey = localStorage.getItem("id");
  if (!userKey) return console.log("WTF");
  const { data, error } = await getUserById(userKey);
  console.log(data);

  User.name = data.username;
  User.score = data.score;
  showAccountInfo(User.name, User.score, User.attempts, userAccounts);

  console.log(User);
}

// =====================
// LEADERBOARD Websocket
// =====================
function setupLeaderboards() {
  onValue(ref(db, "users"), (snapshot) => {
    if (!snapshot.exists()) return;
    userAccounts = snapshot.val();
    console.log(userAccounts);
    const users = Object.entries(snapshot.val()).map(([id, user]) => ({ id, ...user }));
    users.sort((a, b) => b.score - a.score);
    renderLeaderboardSm(users);
    renderLeaderboardLg(users);
  });
}

function renderLeaderboardSm(users) {
  UI.game.leaderboardSm.innerHTML = "";
  let previousScore = null;
  let rank = 0;

  users.slice(0, 100).forEach((user) => {
    if (user.score !== previousScore) {
      rank++;
      previousScore = user.score;
    }
    const div = document.createElement("div");
    if (rank <= 3) div.classList.add(["first", "second", "third"][rank - 1]);
    div.innerHTML = `<span>${rank}. ${user.username}</span><span>${user.score}</span>`;
    UI.game.leaderboardSm.appendChild(div);
  });
}

function renderLeaderboardLg(users) {
  // UI.game.leaderboardLg.innerHTML = "";
  let previousScore = null;
  let rank = 0;

  // Ensure users is an array before calling .slice()
  if (!Array.isArray(users)) return;

  users.slice(0, 100).forEach((user) => {
    if (user.score !== previousScore) {
      rank++;
      previousScore = user.score;
    }
    const div = document.createElement("div");

    if (rank <= 3) div.classList.add(["first", "second", "third"][rank - 1]);
    div.innerHTML = `
      <span>${rank}.</span>
      <span>${user.username}</span>
      <span>${user.score}</span>
      <span>${user.attempts}</span>`;

    UI.game.leaderboardLg.appendChild(div);
  });
}
// =====================
// GAME CORE
// =====================
function resetGame() {
  showPage("menu");
  clearGameState();
}

function initializeGame() {
  showPage("game");
  createBoxes();
  gameLoop();
}

function gameLoop() {
  decreaseTime();
  increaseScore();
  showScore(gameState.score);
  selectRandomBox();
  showRandomBox(gameState.selectedBox);
  startTimer();
}

function handleClick(e) {
  if (e.target.id === gameState.selectedBox?.toString()) {
    clearTimeout(gameState.countDown);
    setTimeout(() => {
      hideRandomBox(gameState.selectedBox);
      deSelectRandomBox();
      gameLoop();
    }, 120);
    showRandomBoxSuccess(gameState.selectedBox);
  } else {
    hideRandomBox(gameState.selectedBox);
    clearTimeout(gameState.countDown);
    gameOver();
  }
}

function startTimer() {
  sfx.tick1.play();
  dangerRandomBox(gameState.selectedBox, gameState.time / 1000);

  gameState.countDown = setTimeout(() => {
    gameOver();
  }, gameState.time);
}

async function gameOver() {
  showPage("gameOver");
  UI.game.finalScore.innerText = gameState.score;
  sfx.success.play();

  UI.game.message.innerText = await getRandomMessage();
  const userKey = localStorage.getItem("id");
  console.log(await updateUserScore(userKey, gameState.score));
}

// =====================
// HELPERS
// =====================

async function loadMessages() {
  try {
    const res = await fetch("./messages.json");
    const data = await res.json();
    messages = data.messages;
  } catch (e) {
    messages = ["Game Over!"];
  }
}

async function getRandomMessage() {
  return messages.length > 0 ? messages[Math.floor(Math.random() * messages.length)] : "Good game!";
}
