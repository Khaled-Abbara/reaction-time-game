// =====================
// Firebase
// =====================
import {
  firebaseConfig,
  initializeApp,
  getDatabase,
  ref,
  update,
  onValue,
} from "./firebase.js";

import { getSpecificUser, getUsers } from "./db.js";
import { setNewUser } from "./db.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =====================
// DOM
// =====================
const menuPage = document.getElementById("menu-page");
const gamePage = document.getElementById("game-page");
const signUpPopUp = document.getElementById("sign-up-pop-up");
const gameOverPage = document.getElementById("game-over-page");
const howToPlayPage = document.getElementById("how-to-play-page");
const leaderboardMenu = document.getElementById("leaderboard-menu");

const scoreScreen = document.getElementById("score-screen");
const gameOverScoreScreen = document.getElementById("game-over-score-screen");
const gameContainer = document.getElementById("game-container");

const createAccountBtn = document.getElementById("create-account-btn");
const startGameBtn = document.getElementById("start-game-btn");
const resetBtn = document.getElementById("reset-btn");
const loginStateBtn = document.getElementById("login-state-btn");
const tutorialBtn = document.getElementById("tutorial-btn");
const goBackBtn = document.getElementById("go-back-btn");

const accountHeader = document.getElementById("account-header");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const error = document.getElementById("error");

// =====================
// SOUNDS
// =====================

const tick1 = new Audio("assets/block-1.mp3");
const tick2 = new Audio("assets/block-2.mp3");
const success = new Audio("assets/success-chime.mp3");

// =====================
// STATE
// =====================
let isLogin = false;

const COLORS = {
  active: "red",
  success: "green",
  default: "#222",
};

const gameState = {
  maxBoxCount: 9,
  score: -1,
  boxes: [],
  time: 1600,
  countDown: null,
  selectedBox: null,
};

// =====================
// INIT
// =====================
checkIfUserIsLoggedIn();
startLeaderboardListener();

window.addEventListener("load", loadMessages);
startGameBtn.addEventListener("click", initializeGame);
createAccountBtn.addEventListener("click", createAccount);
loginStateBtn.addEventListener("click", toggleAccountPopupContent);
resetBtn.addEventListener("click", resetGame);
tutorialBtn.addEventListener("click", showTutorial);
goBackBtn.addEventListener("click", resetGame);

// =====================
// AUTH
// =====================

function showTutorial() {
  howToPlayPage.style.display = "flex";
  menuPage.style.display = "none";
}

function startLeaderboardListener() {
  onValue(ref(db, "users"), (snapshot) => {
    if (!snapshot.exists()) {
      return console.error("No Leaderboard data!");
    }

    const users = Object.entries(snapshot.val()).map(([id, user]) => ({
      id,
      username: user.username,
      score: user.score,
    }));

    users.sort((a, b) => b.score - a.score);

    renderLeaderboard(users);
  });
}

function renderLeaderboard(users) {
  leaderboardMenu.innerHTML = "";

  let previousScore = null;
  let rank = 0;
  let displayCount = 0;

  for (let i = 0; i < users.length && displayCount < 1000; i++) {
    const user = users[i];

    // Increase rank only when score changes (dense ranking)
    if (user.score !== previousScore) {
      rank++;
      previousScore = user.score;
    }

    const div = document.createElement("div");

    if (rank === 1) div.classList.add("first");
    else if (rank === 2) div.classList.add("second");
    else if (rank === 3) div.classList.add("third");

    div.innerHTML = `<span>${rank}. ${user.username}</span><span>${user.score}</span>`;

    leaderboardMenu.appendChild(div);

    displayCount++;
  }
}

function checkIfUserIsLoggedIn() {
  const userKey = localStorage.getItem("id");

  if (!userKey) {
    signUpPopUp.showModal();
  } else {
    signUpPopUp.close();
  }
}

// Toggle login/register mode
function toggleAccountPopupContent() {
  isLogin = !isLogin;

  if (isLogin) {
    accountHeader.innerText = "Login";
    loginStateBtn.innerText = "Can't login?.. create account";
  } else {
    accountHeader.innerText = "Create an Account";
    loginStateBtn.innerText = "Have an account?.. login";
  }

  error.innerText = "";
}

// Main button handler (decides login vs register)
async function createAccount() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  // validation
  if (!username) return (error.innerText = "Username is empty.");
  if (!password) return (error.innerText = "Password is empty.");
  if (username.length < 5)
    return (error.innerText = "Username must be 5+ characters");
  if (password.length < 5)
    return (error.innerText = "Password must be 5+ characters");
  if (username.includes(" ") || password.includes(" "))
    return (error.innerText = "No spaces allowed");

  // LOGIN FLOW
  if (isLogin) {
    return loginUser(username, password);
  }

  const { success, data } = setNewUser(username, password);

  if (success) {
    localStorage.setItem("id", data);
  }

  signUpPopUp.close();
}

// LOGIN FUNCTION
async function loginUser(username, password) {
  const users = await getUsers();

  const foundUser = Object.entries(users).find(
    ([key, user]) => user.username === username && user.password === password,
  );

  if (!foundUser) {
    error.innerText = "Wrong username or password";
    return;
  }

  const [userKey] = foundUser;

  localStorage.setItem("id", userKey);
  signUpPopUp.close();
}

// =====================
// GAME
// =====================

function resetGame() {
  menuPage.style.display = "flex";
  gamePage.style.display = "none";
  gameOverPage.style.display = "none";
  howToPlayPage.style.display = "none";

  clearGameState();
}

function initializeGame() {
  menuPage.style.display = "none";
  gamePage.style.display = "flex";
  gameOverPage.style.display = "none";

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

// =====================
// GAME LOGIC
// =====================
function createBoxes() {
  gameContainer.innerHTML = "";
  gameState.boxes = [];

  for (let i = 0; i < gameState.maxBoxCount; i++) {
    const box = document.createElement("div");
    box.id = i;

    gameContainer.appendChild(box);
    gameState.boxes.push(box);
  }
}

function updateScore() {
  gameState.score++;
  scoreScreen.innerText = gameState.score;
}

function selectRandomBox() {
  const index = Math.floor(Math.random() * gameState.boxes.length);
  const box = gameState.boxes[index];

  gameState.selectedBox = box;
  box.style.backgroundColor = COLORS.active;
}

function handleClick() {
  gameState.selectedBox.addEventListener(
    "click",
    () => {
      clearTimeout(gameState.countDown);
      gameState.selectedBox.style.backgroundColor = COLORS.success;
      tick2.play();

      setTimeout(() => {
        deSelectBox();
        gameLoop();
      }, 100);
    },
    { once: true },
  );
}

function startTimer() {
  tick1.play();
  gameState.countDown = setTimeout(() => {
    gameOver();
  }, gameState.time);
}

async function gameOver() {
  gameOverPage.style.display = "flex";
  gamePage.style.display = "none";

  gameOverScoreScreen.innerText = gameState.score;
  success.play();

  const message = await getRandomGameOverMessage();
  document.getElementById("game-over-message").innerText = message;

  const userKey = localStorage.getItem("id");
  const { data, error } = await getSpecificUser(userKey);

  if (error) {
    console.log(error);
  }

  if (gameState.score > data.score) {
    await update(ref(db, "users/" + userKey), {
      score: gameState.score,
    });
  }
}

// =====================
// HELPERS
// =====================
function deSelectBox() {
  gameState.selectedBox.style.backgroundColor = COLORS.default;
  gameState.selectedBox = null;
}

function decreaseTime() {
  if (gameState.score <= 8) gameState.time -= 40;
  else if (gameState.score <= 16) gameState.time -= 30;
  else if (gameState.score <= 24) gameState.time -= 30;
  else if (gameState.score <= 32) gameState.time -= 20;
  else if (gameState.time > 260) gameState.time -= 10;
}

function clearGameState() {
  gameState.score = 0;
  gameState.boxes = [];
  gameState.time = 1600;
  gameState.countDown = null;
  gameState.selectedBox = null;
}

let messages = [];

async function loadMessages() {
  const res = await fetch("./messages.json");
  const data = await res.json();
  messages = data.messages;
}

async function getRandomGameOverMessage() {
  const index = Math.floor(Math.random() * messages.length);
  console.log(messages[index]);
  return messages[index];
}
