const menuPage = document.getElementById("menu-page")
const gamePage = document.getElementById("game-page")

const gameContainer = document.getElementById("game-container")
const startGameBtn = document.getElementById("start-game-btn")

const COLORS = {
    active: "red",
    success: "green",
    default: "white"
};

const gameState = {
    timer: 0,
    score: 0,
    boxes: []
}

startGameBtn.addEventListener("click", ()=> {
    startGame()
})

function startGame() {
    menuPage.style.display = "none"
    createBoxes(9)
    highlightRandomBox()
}

function createBoxes(maxBoxCount) {
    for (let c = 0; c < maxBoxCount; c++) {
        const box = document.createElement("div");
        box.id = c;
    
        gameContainer.appendChild(box);
        gameState.boxes.push(box);

    }
}

function highlightRandomBox() {
    const index = Math.floor(Math.random() * gameState.boxes.length);
    const box = gameState.boxes[index];

     box.style.backgroundColor = COLORS.active;


}