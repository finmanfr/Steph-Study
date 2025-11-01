let countdownInterval;
let showingQuizlet = true;
let timeLeft = 20;
let gameRunning = false;
let currency = parseInt(localStorage.getItem("currency") || "0");

function startShootMode(deckName, decks) {
  const app = document.getElementById("app");
  const gameArea = document.getElementById("gameArea");

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
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #22c55e;
      color: white;
      padding: 10px 18px;
      border-radius: 16px;
      font-weight: bold;
      font-size: 1.1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transition: transform 0.3s ease, opacity 0.3s ease;
      z-index: 1000;
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

  function addCurrency(amount) {
    currency += amount;
    localStorage.setItem("currency", currency);
    currencyDisplay.textContent = `💰 $${currency}`;

    // Animate a floating +$10
    const bonus = document.createElement("div");
    bonus.textContent = `+$${amount}`;
    bonus.style.position = "fixed";
    bonus.style.bottom = "60px";
    bonus.style.right = "30px";
    bonus.style.color = "#16a34a";
    bonus.style.fontSize = "1.3rem";
    bonus.style.fontWeight = "bold";
    bonus.style.opacity = "1";
    bonus.style.transition = "all 1s ease-out";
    bonus.style.zIndex = "1100";
    document.body.appendChild(bonus);

    setTimeout(() => {
      bonus.style.transform = "translateY(-40px)";
      bonus.style.opacity = "0";
    }, 100);

    setTimeout(() => bonus.remove(), 1000);
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
        if (!showingQuizlet) addCurrency(10);
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

  app.style.width = "90%";
  app.style.maxWidth = "800px";
  app.style.borderRadius = "20px";
  app.style.padding = "20px";
}
