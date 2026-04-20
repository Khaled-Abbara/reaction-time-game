const UI = {
  pages: {
    menu: document.getElementById("menu-page"),
    game: document.getElementById("game-page"),
    gameOver: document.getElementById("game-over-page"),
    tutorial: document.getElementById("how-to-play-page"),
    signUp: document.getElementById("sign-up-pop-up"), // <dialog>
  },
  buttons: {
    start: document.getElementById("start-game-btn"),
    reset: document.getElementById("reset-btn"),
    goBack: document.getElementById("go-back-btn"),
    tutorial: document.getElementById("tutorial-btn"),
    createAccount: document.getElementById("create-account-btn"),
    loginToggle: document.getElementById("login-state-btn"),
  },
  game: {
    container: document.getElementById("game-container"),
    score: document.getElementById("score-screen"),
    finalScore: document.getElementById("game-over-score-screen"),
    message: document.getElementById("game-over-message"),
    leaderboard: document.getElementById("leaderboard-menu"),
  },
  auth: {
    header: document.getElementById("account-header"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    error: document.getElementById("error"),
  },
};

export { UI };
