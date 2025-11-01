let countdownInterval;
let showingQuizlet = true;
let timeLeft = 20;
let gameRunning = false;
let currency = parseInt(localStorage.getItem("currency") || "0");

function startShootMode(deckName, decks) {
  const app = document.getElementById("app");
  const gameArea = document.getElementById("gameArea");

  // Fullscreen setup
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
    <div id="currencyDisplay"
      style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #16a34a;
        color: white;
        padding: 10px 18px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 1.1rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        z-index: 9999;
        transition: transform 0.3s ease, opacity 0.3s ease;
      ">
      💰 $${currency}
    </div>
  `;

  const quizletFrame = document.getElementById("quizletFrame");
  const basketballFrame = document.getElementById("basketballFrame");
  const timerDisplay = document.getElementById("timerDisplay");
  const stopButton = document.getElementById("stopLoopBtn");
  const currencyDisplay = document.getElementById("currencyDisplay");

  function updateCurrencyDisplay() {
    currencyDisplay.textContent = `💰 $${currency}`;
  }

  function animateCurrencyGain(amount) {
    const gain = document.createElement("div");
    gain.textContent = `+ $${amount}`;
    gain.style.position = "fixed";
    gain.style.bottom = "60px";
    gain.style.right = "30px";
    gain.style.color = "#22c55e";
    gain.style.fontSize = "1.3rem";
    gain.style.fontWeight = "bold";
    gain.style.opacity = "1";
    gain.style.transition = "all 1s ease-out";
    gain.style.zIndex = "9999";
    document.body.appendChild(gain);

    setTimeout(() => {
      gain.style.transform = "translateY(-30px)";
      gain.style.opacity = "0";
    }, 50);

    setTimeout(() => {
      gain.remove();
    }, 1000);
  }

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

    // Reward when switching FROM Quizlet
    if (!showingQuizlet) {
      currency += 10;
      localStorage.setItem("currency", currency);
      updateCurrencyDisplay();
      animateCurrencyGain(10);
    }
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

  app.style.width = "90%";
  app.style.maxWidth = "800px";
  app.style.borderRadius = "20px";
  app.style.padding = "20px";
}
