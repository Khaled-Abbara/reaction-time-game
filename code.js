// =====================
// SETUP / CONSTANTS
// =====================
const menuPage = document.getElementById("menu-page");
const gamePage = document.getElementById("game-page");

const scoreScreen = document.getElementById("score-screen");
const gameContainer = document.getElementById("game-container");
const startGameBtn = document.getElementById("start-game-btn");

const COLORS = {
    active: "red",
    success: "green",
    default: "white"
};

const gameState = {
    maxBoxCount: 9,
    score: -1,
    boxes: [],
    time: 1600,
    countDown: null,
    selectedBox: null
};


// =====================
// EVENT LISTENERS
// =====================
startGameBtn.addEventListener("click", initializeGame);


// =====================
// CORE GAME FLOW
// =====================
function initializeGame() {
    menuPage.style.display = "none";
    gameState.isActive = true;

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
    gamePage.style.display = "none";
    clearGameState();
    alert("Game over!!");
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
    gameState.selectedBox.addEventListener("click", () => {
        clearTimeout(gameState.countDown);
        gameState.selectedBox.style.backgroundColor = COLORS.success;

        setTimeout(() => {
            deSelectRandomBox();
            gameLoop();
        }, 100);


    }, { once: true });
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