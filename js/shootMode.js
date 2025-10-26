let loopInterval;
let showingQuizlet = true;

function startShootMode(deckName, decks) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = `<button id="stopLoopBtn">🛑 Stop</button>`;
  const stopBtn = document.getElementById("stopLoopBtn");

  stopBtn.onclick = stopGameLoop;

  function showQuizlet() {
    gameArea.innerHTML = `
      <button id="stopLoopBtn">🛑 Stop</button>
      <iframe src="https://quizlet.com/latest" class="iframeBox"></iframe>
    `;
  }

  function showBasketball() {
    gameArea.innerHTML = `
      <button id="stopLoopBtn">🛑 Stop</button>
      <iframe src="https://basketball-stars.io" class="iframeBox"></iframe>
    `;
  }

  function toggleContent() {
    if (showingQuizlet) showBasketball();
    else showQuizlet();
    showingQuizlet = !showingQuizlet;
  }

  showQuizlet();
  loopInterval = setInterval(toggleContent, 10000); // 10s each
}

function stopGameLoop() {
  clearInterval(loopInterval);
  location.reload();
}
