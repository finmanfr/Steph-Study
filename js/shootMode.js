let loopInterval;
let countdownInterval;
let showingQuizlet = true;
let timeLeft = 10;

function startShootMode(deckName, decks) {
  const gameArea = document.getElementById("gameArea");

  function showTimer() {
    const timer = document.createElement("div");
    timer.id = "timerDisplay";
    timer.textContent = `Next switch in: ${timeLeft}s`;
    gameArea.appendChild(timer);
  }

  function updateTimer() {
    const timer = document.getElementById("timerDisplay");
    if (timer) timer.textContent = `Next switch in: ${timeLeft}s`;
  }

  function startCountdown() {
    clearInterval(countdownInterval);
    timeLeft = 10;
    updateTimer();
    countdownInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        toggleContent();
      }
    }, 1000);
  }

  function showQuizlet() {
    gameArea.innerHTML = `
      <button id="stopLoopBtn">🛑 Stop</button>
      <iframe src="https://quizlet.com/latest" class="iframeBox"></iframe>
    `;
    showTimer();
    startCountdown();
  }

  function showBasketball() {
    gameArea.innerHTML = `
      <button id="stopLoopBtn">🛑 Stop</button>
      <iframe src="https://basketball-stars.io" class="iframeBox"></iframe>
    `;
    showTimer();
    startCountdown();
  }

  function toggleContent() {
    showingQuizlet = !showingQuizlet;
    if (showingQuizlet) showQuizlet();
    else showBasketball();
  }

  // initial view
  showQuizlet();

  // stop button
  document.body.addEventListener("click", e => {
    if (e.target.id === "stopLoopBtn") stopGameLoop();
  });
}

function stopGameLoop() {
  clearInterval(loopInterval);
  clearInterval(countdownInterval);
  location.reload();
}
