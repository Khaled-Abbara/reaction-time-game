const menuPage = document.getElementById("menu-page")
const gamePage = document.getElementById("game-page")

const gameContainer = document.getElementById("game-container")
const startGameBtn = document.getElementById("start-game-btn")


const gameStats = {
    timer: 0,
    score: 0
}

startGameBtn.addEventListener("click", ()=> {
     createBoxes(9)
})


function createBoxes(maxBoxCount) {
    for (let c = 0; c < maxBoxCount; c++) {
        const box = document.createElement("div");
        box.id = c;
    
        gameContainer.appendChild(box);
    }
}