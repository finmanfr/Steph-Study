let countdownInterval;
let showingQuizlet = true;
let timeLeft = 20;
let gameRunning = false;
let currency = parseInt(localStorage.getItem("currency") || "0");

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
    <div id="currencyDisplay"
      style="
        position: fixed; bottom: 20px; right: 20px;
        background: #22c55e; color: white;
        padding: 10px 16px; border-radius: 20px;
        font-weight: bold; font-size: 1.1rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        z-index: 1000; transition: all 0.3s ease;
      ">
      💰 $${currency}
    </div>
  `;

  const quizletFrame = document.getElementById("quizletFrame");
  const basketballFrame = document.getElementById("basketballFrame");
  const timerDisplay = document.getElementById("timerDisplay");
  const stopButton = document.getElementById("stopLoopBtn");
  const currencyDisplay = document.getElementById("currencyDisplay");

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

    // When leaving Quizlet, give $10
    if (!showingQuizlet) {
      addCurrency(10);
    }
  }

  function addCurrency(amount) {
    currency += amount;
    localStorage.setItem("currency", currency);
    currencyDisplay.textContent = `💰 $${currency}`;

    // Create floating +$10 animation
    const floatText = document.createElement("div");
    floatText.textContent = `+$${amount}`;
    floatText.style.position = "fixed";
    floatText.style.bottom = "60px";
    floatText.style.right = "30px";
    floatText.style.color = "#22c55e";
    floatText.style.fontWeight = "bold";
    floatText.style.fontSize = "1.2rem";
    floatText.style.transition = "all 1s ease-out";
    floatText.style.opacity = "1";
    floatText.style.zIndex = "1100";
    document.body.appendChild(floatText);

    setTimeout(() => {
      floatText.style.transform = "translateY(-50px)";
      floatText.style.opacity = "0";
    }, 50);

    setTimeout(() => floatText.remove(), 1000);
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
