let countdownInterval;
let showingQuizlet = true;
let timeLeft = 10;

function startShootMode(deckName, decks) {
  const app = document.getElementById("app");
  const gameArea = document.getElementById("gameArea");

  // Go fullscreen
  app.style.width = "100%";
  app.style.height = "100vh";
  app.style.maxWidth = "none";
  app.style.borderRadius = "0";
  app.style.padding = "0";

  gameArea.innerHTML = `
    <div id="overlayControls">
      <button id="stopLoopBtn">🛑 Stop</button>
      <div id="timerDisplay">Next switch in: 10s</div>
    </div>
    <iframe id="gameFrame" class="iframeBox"></iframe>
  `;

  const frame = document.getElementById("gameFrame");

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
    frame.src = "https://quizlet.com/latest";
    showingQuizlet = true;
    timeLeft = 10;
    updateTimer();
    startCountdown();
  }

  function showBasketball() {
    frame.src = "https://basketball-stars.io";
    showingQuizlet = false;
    timeLeft = 10;
    updateTimer();
    startCountdown();
  }

  function toggleContent() {
    if (showingQuizlet) showBasketball();
    else showQuizlet();
  }

  // Initial state
  showQuizlet();

  // Stop button
  document.getElementById("stopLoopBtn").onclick = () => {
    clearInterval(countdownInterval);
    goBackFromGame();
  };
}

function goBackFromGame() {
  const app = document.getElementById("app");
  const gameArea = document.getElementById("gameArea");
  gameArea.classList.add("hidden");
  document.getElementById("deckEditor").classList.remove("hidden");

  // restore app styling
  app.style.width = "90%";
  app.style.maxWidth = "800px";
  app.style.borderRadius = "20px";
  app.style.padding = "20px";
}
