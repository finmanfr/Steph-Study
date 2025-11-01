let countdownInterval;
let showingQuizlet = true;
let timeLeft = 20;
let gameRunning = false;
let currency = parseInt(localStorage.getItem("currency") || "0");

function startShootMode(deckName, decks) {
  const app = document.getElementById("app");
  const gameArea = document.getElementById("gameArea");

  // Fullscreen layout
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
    <div id="currencyDisplay" style="
      position: fixed; bottom: 20px; right: 30px;
      background: #22c55e; color: white;
      padding: 8px 14px; border-radius: 10px;
      font-weight: bold; font-size: 1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      transition: transform 0.3s ease, opacity 0.3s ease;
    ">💰 $${currency}</div>
  `;

  const quizletFrame = document.getElementById("quizletFrame");
  const basketballFrame = document.getElementById("basketballFrame");
  const timerDisplay = document.getElementById("timerDisplay");
  const stopButton = document.getElementById("stopLoopBtn");
  const currencyDisplay = document.getElementById("currencyDisplay");

  function updateTimer() {
    timerDisplay.textContent = `Next switch in: ${timeLeft}s`;
  }

  function updateCurrencyDisplay() {
    currencyDisplay.textContent = `💰 $${currency}`;
  }

  function addCurrency(amount) {
    currency += amount;
    localStorage.setItem("currency", currency);
    updateCurrencyDisplay();

    // 💸 Animate gain
    currencyDisplay.style.transform = "scale(1.3)";
    currencyDisplay.style.opacity = "0.8";
    setTimeout(() => {
      currencyDisplay.style.transform = "scale(1)";
      currencyDisplay.style.opacity = "1";
    }, 300);
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

        // Reward $10 after each Quizlet session
        if (showingQuizlet) addCurrency(10);

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

  // Restore layout
  app.style.width = "90%";
  app.style.maxWidth = "800px";
  app.style.borderRadius = "20px";
  app.style.padding = "20px";
}
