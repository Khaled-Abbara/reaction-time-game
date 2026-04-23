const gameState = {
  status: "MENU", // 'MENU', 'PLAYING', 'GAMEOVER'
  maxBoxCount: 9,
  score: -1,
  boxes: [],
  time: 1600,
  countDown: null,
  selectedBox: null,
};

export { gameState };
