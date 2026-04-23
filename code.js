// =====================
// Firebase & Auth Imports
// =====================
import { firebaseConfig, initializeApp, getDatabase, ref, update, onValue } from "./firebase.js";
import { getSpecificUser, getUsers, setNewUser } from "./db.js";
import { UI } from "./Ui-tree.js";
import { sfx } from "./sfx.js";
import { gameState } from "./game-state.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =====================
// STATE & CONSTANTS
// =====================
let isLogin = false;
let messages = [];

const COLORS = {
  active: "red",
  success: "green",
  default: "#222",
};

// =====================
// INITIALIZATION
// =====================
checkIfUserIsLoggedIn();
startLeaderboardListener();

window.addEventListener("load", loadMessages);
UI.buttons.start.addEventListener("click", initializeGame);
UI.buttons.createAccount.addEventListener("click", createAccount);
UI.buttons.loginToggle.addEventListener("click", toggleAccountPopupContent);
UI.buttons.reset.addEventListener("click", resetGame);
UI.buttons.tutorial.addEventListener("click", () => showPage("tutorial"));
UI.buttons.goBack.addEventListener("click", resetGame);

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
function checkIfUserIsLoggedIn() {
  const userKey = localStorage.getItem("id");
  if (!userKey) UI.pages.signUp.showModal();
  else UI.pages.signUp.close();
}

function toggleAccountPopupContent() {
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

  const { success, data } = setNewUser(username, password);
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
function startLeaderboardListener() {
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
  updateScore();
  selectRandomBox();
  handleClick();
  startTimer();
}

function createBoxes() {
  UI.game.container.innerHTML = "";
  gameState.boxes = [];
  for (let i = 0; i < gameState.maxBoxCount; i++) {
    const box = document.createElement("div");
    box.id = i;
    UI.game.container.appendChild(box);
    gameState.boxes.push(box);
  }
}

function updateScore() {
  gameState.score++;
  UI.game.score.innerText = gameState.score;
}

function selectRandomBox() {
  const index = Math.floor(Math.random() * gameState.boxes.length);
  gameState.selectedBox = gameState.boxes[index];
  gameState.selectedBox.style.backgroundColor = COLORS.active;
}

function handleClick() {
  gameState.selectedBox.addEventListener(
    "click",
    () => {
      clearTimeout(gameState.countDown);
      gameState.selectedBox.style.backgroundColor = COLORS.success;
      sfx.tick2.play();
      setTimeout(() => {
        deSelectBox();
        gameLoop();
      }, 100);
    },
    { once: true },
  );
}

function startTimer() {
  sfx.tick1.play();
  gameState.countDown = setTimeout(gameOver, gameState.time);
}

async function gameOver() {
  showPage("gameOver");
  UI.game.finalScore.innerText = gameState.score;
  sfx.success.play();

  UI.game.message.innerText = await getRandomGameOverMessage();

  const userKey = localStorage.getItem("id");
  const { data } = await getSpecificUser(userKey);

  if (gameState.score > (data?.score || 0)) {
    await update(ref(db, "users/" + userKey), { score: gameState.score });
  }
}

// =====================
// HELPERS
// =====================
function deSelectBox() {
  if (gameState.selectedBox) {
    gameState.selectedBox.style.backgroundColor = COLORS.default;
    gameState.selectedBox = null;
  }
}

function decreaseTime() {
  if (gameState.score <= 8) gameState.time -= 40;
  else if (gameState.score <= 16) gameState.time -= 30;
  else if (gameState.score <= 32) gameState.time -= 20;
  else if (gameState.time > 260) gameState.time -= 10;
}

function clearGameState() {
  gameState.score = -1;
  gameState.time = 1600;
  clearTimeout(gameState.countDown);
  deSelectBox();
}

async function loadMessages() {
  try {
    const res = await fetch("./messages.json");
    const data = await res.json();
    messages = data.messages;
  } catch (e) {
    messages = ["Game Over!"];
  }
}

async function getRandomGameOverMessage() {
  return messages.length > 0 ? messages[Math.floor(Math.random() * messages.length)] : "Good game!";
}
