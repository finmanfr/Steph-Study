function startStudy(link) {
  const app = document.getElementById("app");
  if (!app) {
    console.error("App container not found!");
    return;
  }

  // Create elements only once
  if (!document.getElementById("quizFrame")) {
    app.innerHTML = `
      <div id="overlayControls">
        <div id="timerDisplay">Next game in: 20s</div>
        <div id="cashCounter">💰 $0</div>
      </div>
      <div id="iframeWrapper">
        <iframe id="quizFrame" src="${link}" class="iframeBox"></iframe>
        <iframe id="gameFrame" src="https://basketball-stars.io" class="iframeBox hidden"></iframe>
      </div>
    `;
  }

  const quiz = document.getElementById("quizFrame");
  const game = document.getElementById("gameFrame");
  const timer = document.getElementById("timerDisplay");
  const cashCounter = document.getElementById("cashCounter");

  // Load and show saved cash
  let cash = parseInt(localStorage.getItem("cash") || "0");
  cashCounter.textContent = `💰 $${cash}`;

  quiz.classList.remove("hidden");
  game.classList.add("hidden");

  let timeLeft = 20;
  timer.textContent = `Next game in: ${timeLeft}s`;

  const interval = setInterval(() => {
    timeLeft--;
    timer.textContent = `Next game in: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      cash += 10;
      localStorage.setItem("cash", cash);
      animateCashCounter(cashCounter, cash);
      startGame(link);
    }
  }, 1000);
}

function startGame(link) {
  const quiz = document.getElementById("quizFrame");
  const game = document.getElementById("gameFrame");
  const timer = document.getElementById("timerDisplay");

  quiz.classList.add("hidden");
  game.classList.remove("hidden");

  let timeLeft = 20;
  timer.textContent = `Next Quizlet in: ${timeLeft}s`;

  const interval = setInterval(() => {
    timeLeft--;
    timer.textContent = `Next Quizlet in: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      startStudy(link);
    }
  }, 1000);
}

function animateCashCounter(el, amount) {
  el.textContent = `💰 $${amount}`;
  el.style.transform = "scale(1.3)";
  el.style.transition = "transform 0.3s ease";
  setTimeout(() => {
    el.style.transform = "scale(1)";
  }, 300);
}
