/* ---------------- DOM REFERENCES ---------------- */

const elements = {
    mainMenu: document.getElementById("main-menu"),
    gameContainer: document.getElementById("game-container"),
    resultScreen: document.getElementById("result-screen"),
    start: document.getElementById("start"),
    counter: document.getElementById("counter"),
    average: document.getElementById("average"),
    length: document.getElementById("length"),
    difficulty: document.getElementById("difficulty"),
    reset: document.getElementById("reset"),
    pastScores: document.getElementById("past-scores"),
    resultPastScores: document.getElementById("result-past-scores")
};

/* ---------------- GAME STATE ---------------- */

const gameState = {
    boxes: [],
    times: [],
    averages: [],
    startTime: 0
};

/* ---------------- COLORS ---------------- */

const COLORS = {
    active: "red",
    success: "green",
    default: "#2c2c2c"
};

/* ---------------- EVENT LISTENERS ---------------- */

elements.start.addEventListener("click", startGame);
elements.reset.addEventListener("click", resetGame);
elements.pastScores.addEventListener("click", showPastScores)

/* ---------------- GAME FLOW ---------------- */

function startGame() {

    initializeGame();

    setTimeout(runGame, 2000);
}

function initializeGame() {

    elements.mainMenu.style.display = "none";
    elements.counter.style.display = "flex";

    const difficulty = Number(elements.difficulty.value);

    for (let i = 0; i < difficulty; i++) {
        createBox(i);
    }
}

function runGame() {

    const targetRounds = Number(elements.length.value);
    const currentRound = Number(elements.counter.textContent);

    if (currentRound === targetRounds) {
        showResults();
        return;
    }

    highlightRandomBox();
}

/* ---------------- BOX LOGIC ---------------- */

function createBox(id) {

    const box = document.createElement("div");
    box.id = id;

    elements.gameContainer.appendChild(box);
    gameState.boxes.push(box);
}

function highlightRandomBox() {

    const index = Math.floor(Math.random() * gameState.boxes.length);
    const box = gameState.boxes[index];

    box.style.backgroundColor = COLORS.active;

    startTimer();

    box.addEventListener("click", () => handleBoxClick(box), { once: true });
}

function handleBoxClick(box) {

    box.style.backgroundColor = COLORS.success;

    stopTimer();

    setTimeout(() => {
        box.style.backgroundColor = COLORS.default;
    }, 100);

    increaseCounter();

    setTimeout(runGame, 1000);
}

/* ---------------- TIMER ---------------- */

function startTimer() {
    gameState.startTime = performance.now();
}

function stopTimer() {

    const endTime = performance.now();
    const totalTime = Math.floor(endTime - gameState.startTime);

    gameState.times.push(totalTime);
}

/* ---------------- COUNTER ---------------- */

function increaseCounter() {

    const newValue = Number(elements.counter.textContent) + 1;
    elements.counter.textContent = newValue;
}

/* ---------------- RESULTS ---------------- */

function showResults() {

    elements.gameContainer.style.display = "none";
    elements.resultScreen.style.display = "flex";

    const sum = gameState.times.reduce((a, b) => a + b, 0);

    const avg = Math.floor(sum / Number(elements.length.value));

    elements.average.textContent = `${Math.round(avg)} ms`;

    gameState.averages.push(avg);
}

function showPastScores() {
    if (gameState.averages.length > 0) {

        var message = ""
        for (let i = 0; i < gameState.averages.length; i++) {
            message += `Game ${i + 1}: ${gameState.averages[i]} <br>`
        }
        elements.resultPastScores.innerHTML = message;

    } else {
        elements.resultPastScores.textContent = "You haven't played yet";
    }
}
/* ---------------- RESET ---------------- */

function resetGame() {

    gameState.times = [];
    gameState.boxes = [];

    elements.counter.textContent = "0";
    elements.average.textContent = "";
    elements.resultPastScores.textContent = "";

    elements.gameContainer.innerHTML = "";
    elements.gameContainer.style.display = "grid";

    elements.counter.style.display = "none";
    elements.resultScreen.style.display = "none";
    elements.mainMenu.style.display = "flex";
}
