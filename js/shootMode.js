let countdownInterval;
let showingQuizlet = true;
let timeLeft = 20;
let gameRunning = false;

function startShootMode(deckName, decks) {
  const app = document.getElementById("app");
  const gameArea = document.getElementById("gameArea");

  // Make the view full screen without breaking layout
  app.style.width = "100%";
  app.style.height = "100vh";
  app.style.maxWidth = "none";
  app.style.borderRadius = "0";
  app.style.padding = "0";

  gameArea.innerHTML = `
    <div id="overlayControls">
      <button id="stopLoopBtn">🛑 Stop</button>
      <div id="timerDisplay">Next switch in: 20s</div>
    </div>
    <div id="iframeWrapper">
      <iframe id="quizletFrame" class="iframeBox" src="https://quizlet.com/latest"></iframe>
      <iframe id="basketballFrame" class="iframeBox hidden" src="https://basketball-stars.io"></iframe>
    </div>
  `;

  const quizletFrame = document.getElementById("quizletFrame");
  const basketballFrame = document.getElementById("basketballFrame");
  const timerDisplay = document.getElementById("timerDisplay");
  const stopButton = document.getElementById("stopLoopBtn");

  function updateTimer() {
    timerDisplay.textContent = `Next switch in: ${timeLeft}s`;
  }

  function startCountdown() {
    clearInterval(countdownInterval);
    timeLeft = 20;
    updateTimer();
    countdownInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        toggleFrames();
        timeLeft = 20;
      }
    }, 1000);
  }

  function toggleFrames() {
    showingQuizlet = !showingQuizlet;
    quizletFrame.classList.toggle("hidden", !showingQuizlet);
    basketballFrame.classList.toggle("hidden", showingQuizlet);
  }

  stopButton.onclick = () => {
    clearInterval(countdownInterval);
    goBackFromGame();
  };

  // start the timer loop
  gameRunning = true;
  startCountdown();
}

function goBackFromGame() {
  const app = document.getElementById("app");
  const gameArea = document.getElementById("gameArea");
  const deckEditor = document.getElementById("deckEditor");

  gameRunning = false;
  clearInterval(countdownInterval);

  gameArea.classList.add("hidden");
  deckEditor.classList.remove("hidden");

  // restore layout
  app.style.width = "90%";
  app.style.maxWidth = "800px";
  app.style.borderRadius = "20px";
  app.style.padding = "20px";
}
