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
    timer: 0,
    score: 0,
    boxes: [],
    highlightedBox: ""
}

startGameBtn.addEventListener("click", ()=> {
    initializeGame()
})

function initializeGame() {
    menuPage.style.display = "none"
    createBoxes()
    runGame()
}

async function runGame() {
    highlightRandomBox()
    const result = new Promise.race([runTimer(), wrongBox()])

    if (result == true) {
        increaseScore()
        displayScore()
        deHighlightRandomBox()
        runGame()
    } else {
        gameOver()
    }
}

function createBoxes() {
    for (let c = 0; c < gameState.maxBoxCount; c++) {
        const box = document.createElement("div");
        box.id = c;
    
        gameContainer.appendChild(box);
        gameState.boxes.push(box);

    }
}

function increaseScore() {
    gameState.score += 1;
}

function displayScore() {
    scoreScreen.innerText = gameState.score;
}

function highlightRandomBox() {
    const index = Math.floor(Math.random() * gameState.boxes.length);
    const box = gameState.boxes[index];

    gameState.highlightedBox = box;
    box.style.backgroundColor = COLORS.active;


}

function deHighlightRandomBox() {
    gameState.highlightedBox.style.backgroundColor = COLORS.default
}

function gameOver() {
    gamePage.style.display = "none";
    alert("Game over!!")
}

function wrongBox() {
    return new Promise((resolve) => {
        gameState.boxes.forEach((box) => {
            if (box !== gameState.highlightedBox) {
                box.addEventListener("click", () => {
                    resolve(false);
                }, { once: true });
            }
        });
    });
}

function runTimer() {
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            resolve(false);
        }, 2000);

        gameState.highlightedBox.addEventListener("click", () => {
            clearTimeout(timer);
            resolve(true);
        }, { once: true });
    });
}