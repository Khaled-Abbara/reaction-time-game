const UI = {
  pages: {
    menu: document.getElementById("menu-page"),
    game: document.getElementById("game-page"),
    gameOver: document.getElementById("game-over-page"),
    tutorial: document.getElementById("how-to-play-page"),
    account: document.getElementById("account-page"),
    credits: document.getElementById("credits-page"),
    leaderboard: document.getElementById("leaderboard-page"),
  },
  modal: {
    auth: document.getElementById("auth-modal"),
  },
  navigation: {
    navTag: document.querySelector("nav"),
    menu: document.getElementById("menu-nav"),
    game: document.getElementById("game-nav"),
    account: document.getElementById("account-nav"),
    credits: document.getElementById("credits-nav"),
    leaderboard: document.getElementById("leaderboard-nav"),
  },

  buttons: {
    start: document.getElementById("start-game-btn"),
    reset: document.getElementById("reset-btn"),
    goBack: document.getElementById("go-back-btn"),
    tutorial: document.getElementById("tutorial-btn"),
    submitAuth: document.getElementById("submit-auth-btn"),
    loginToggle: document.getElementById("login-state-btn"),
    profile: document.getElementById("profile-btn"),
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
  account: {
    username: document.getElementById("account-username"),
    attempts: document.getElementById("account-attempts"),
    score: document.getElementById("account-score"),
  },
  boxes: {},
};

export { UI };
