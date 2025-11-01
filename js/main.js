function startStudy(link) {
  // Create layout only once
  if (!document.getElementById("quizFrame")) {
    document.body.innerHTML = `
      <iframe id="quizFrame" src="${link}" style="width:100%;height:100vh;border:none;"></iframe>
      <iframe id="gameFrame" src="https://basketball-stars.io"
              style="width:100%;height:100vh;border:none;display:none;"></iframe>
      <div id="timerDisplay">Next game in: 20s</div>
      <div id="cashCounter">$0</div>
    `;
  }

  const quiz = document.getElementById("quizFrame");
  const game = document.getElementById("gameFrame");
  const timer = document.getElementById("timerDisplay");
  const cashCounter = document.getElementById("cashCounter");

  // Load saved cash
  let cash = parseInt(localStorage.getItem("cash") || "0");
  cashCounter.textContent = `$${cash}`;

  // Show Quizlet, hide game
  quiz.style.display = "block";
  game.style.display = "none";

  let timeLeft = 20;
  timer.textContent = `Next game in: ${timeLeft}s`;

  const interval = setInterval(() => {
    timeLeft--;
    timer.textContent = `Next game in: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(interval);

      // Add $10 when timer ends
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
  const cashCounter = document.getElementById("cashCounter");

  // Show game, hide Quizlet
  quiz.style.display = "none";
  game.style.display = "block";

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

// 💵 Little animation when money increases
function animateCashCounter(el, amount) {
  el.textContent = `$${amount}`;
  el.style.transform = "scale(1.3)";
  el.style.transition = "transform 0.2s ease";
  setTimeout(() => {
    el.style.transform = "scale(1)";
  }, 200);
}
