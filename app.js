import { UI } from "./scripts/ui-tree.js";
import { sfx } from "./scripts/sfx-tree.js";
import { gameState } from "./scripts/game-state.js";

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
  hideRandomBox,
  showRandomBoxSuccess,
  createBoxes,
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
let isLogin = false;
let messages = [];

// =====================
// INITIALIZATION
// =====================
isLoggedIn();
setupLeaderboard();

window.addEventListener("load", loadMessages);
UI.buttons.start.addEventListener("click", initializeGame);
UI.buttons.createAccount.addEventListener("click", createAccount);
UI.buttons.loginToggle.addEventListener("click", toggleAuthForm);
UI.buttons.reset.addEventListener("click", resetGame);
UI.buttons.tutorial.addEventListener("click", () => showPage("tutorial"));
UI.buttons.goBack.addEventListener("click", resetGame);

UI.game.container.addEventListener("click", (e) => handleClick(e));

// =====================
// UI HELPERS
// =====================
function showPage(targetPageKey) {
  Object.keys(UI.pages).forEach((key) => {
    if (key !== "signUp") {
      // Dialogs are handled with .showModal()
      UI.pages[key].style.display = key === targetPageKey ? "flex" : "none";
    }
  });
}

// =====================
// AUTH LOGIC
// =====================
function isLoggedIn() {
  const userKey = localStorage.getItem("id");
  if (!userKey) UI.pages.signUp.showModal();
  else UI.pages.signUp.close();
}

function toggleAuthForm() {
  isLogin = !isLogin;
  UI.auth.header.innerText = isLogin ? "Login" : "Create an Account";
  UI.buttons.loginToggle.innerText = isLogin
    ? "Can't login?.. create account"
    : "Have an account?.. login";
  UI.auth.error.innerText = "";
}

async function createAccount() {
  const username = UI.auth.username.value;
  const password = UI.auth.password.value;

  if (!username || !password) return (UI.auth.error.innerText = "Fields cannot be empty.");
  if (username.length < 5 || password.length < 5)
    return (UI.auth.error.innerText = "Minimum 5 characters required.");
  if (username.includes(" ") || password.includes(" "))
    return (UI.auth.error.innerText = "No spaces allowed.");

  if (isLogin) return loginUser(username, password);

  const { success, data } = createUser(username, password);
  if (success) {
    localStorage.setItem("id", data);
    UI.pages.signUp.close();
  }
}

async function loginUser(username, password) {
  const users = await getUsers();
  const foundUser = Object.entries(users).find(
    ([_, user]) => user.username === username && user.password === password,
  );

  if (!foundUser) {
    UI.auth.error.innerText = "Wrong username or password";
    return;
  }

  localStorage.setItem("id", foundUser[0]);
  UI.pages.signUp.close();
}

// =====================
// LEADERBOARD
// =====================
function setupLeaderboard() {
  onValue(ref(db, "users"), (snapshot) => {
    if (!snapshot.exists()) return;
    const users = Object.entries(snapshot.val()).map(([id, user]) => ({ id, ...user }));
    users.sort((a, b) => b.score - a.score);
    renderLeaderboard(users);
  });
}

function renderLeaderboard(users) {
  UI.game.leaderboard.innerHTML = "";
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
    UI.game.leaderboard.appendChild(div);
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
    }, 100);
    showRandomBoxSuccess(gameState.selectedBox);
  } else {
    hideRandomBox(gameState.selectedBox);
    clearTimeout(gameState.countDown);
    gameOver();
  }
}

function startTimer() {
  sfx.tick1.play();
  gameState.countDown = setTimeout(gameOver, gameState.time);
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
