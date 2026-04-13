// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMcOgQeIhymv86NsISdP1WgQXPh19D_Hc",
  authDomain: "reaction-game-6ba73.firebaseapp.com",
  databaseURL:
    "https://reaction-game-6ba73-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reaction-game-6ba73",
  storageBucket: "reaction-game-6ba73.firebasestorage.app",
  messagingSenderId: "762088583051",
  appId: "1:762088583051:web:56a25eb3105b07b160498e",
  measurementId: "G-HZB097HP7H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const dbRef = ref(db, "users");

get(ref(db, "users")).then((snap) => {
  console.log(snap.val());
});
// =====================
// SETUP / CONSTANTS
// =====================
const menuPage = document.getElementById("menu-page");
const gamePage = document.getElementById("game-page");
const signUpPopUp = document.getElementById("sign-up-pop-up");

const scoreScreen = document.getElementById("score-screen");
const gameContainer = document.getElementById("game-container");
const startGameBtn = document.getElementById("start-game-btn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const error = document.getElementById("error");

const COLORS = {
  active: "red",
  success: "green",
  default: "white",
};

const gameState = {
  maxBoxCount: 9,
  score: -1,
  boxes: [],
  time: 1600,
  countDown: null,
  selectedBox: null,
};

const account = {
  username: "",
  password: "",
};

// =====================
// EVENT LISTENERS
// =====================
startGameBtn.addEventListener("click", initializeGame);
document.addEventListener("DOMContentLoaded", () => {
  signUpPopUp.showModal();
});

// =====================
// Create Account
// =====================
function createAccount() {
  if (username.value == "") {
    error.innerText = "Username is empty.";
  } else if (password.value == "") {
    error.innerText = "Password is empty.";
  } else if (username.value.length < 5) {
    error.innerText = "Username should be more than 5 characters";
  } else if (password.value.length < 5) {
    error.innerText = "Password should be more than 5 characters";
  } else if (username.value.includes(" ") || password.value.includes(" ")) {
    error.innerText = "Username or password contains spaces";
  } else {
    account.username = username.value;
    account.password = password.value;
  }

  console.log(account);
}

// =====================
// CORE GAME FLOW
// =====================
function initializeGame() {
  menuPage.style.display = "none";
  gamePage.style.display = "flex";

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

function gameOver() {
  // gamePage.style.display = "none";
  // clearGameState();
  // alert("Game over!!");
}

// =====================
// GAME MECHANICS
// =====================
function createBoxes() {
  gameContainer.innerHTML = "";

  for (let c = 0; c < gameState.maxBoxCount; c++) {
    const box = document.createElement("div");
    box.id = c;

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

      setTimeout(() => {
        deSelectRandomBox();
        gameLoop();
      }, 100);
    },
    { once: true },
  );
}

function startTimer() {
  gameState.countDown = setTimeout(() => {
    gameOver();
  }, gameState.time);
}

// =====================
// HELPERS / CLEANUP
// =====================
function deSelectRandomBox() {
  gameState.selectedBox.style.backgroundColor = COLORS.default;
  gameState.selectedBox = null;
}

function clearGameState() {
  gameState.score = -1;
  gameState.boxes = [];
  gameState.countDown = null;
  gameState.selectedBox = null;
}

function decreaseTime() {
  if (gameState.score <= 8) {
    gameState.time -= 50;
  } else if (gameState.score <= 16) {
    gameState.time -= 40;
  } else if (gameState.score <= 24) {
    gameState.time -= 30;
  } else if (gameState.score <= 32) {
    gameState.time -= 20;
  } else if (gameState.time > 260) {
    gameState.time -= 10;
  }
}
