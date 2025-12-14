document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("quizletLink");
  const beginBtn = document.getElementById("beginBtn");

  let cash = 0;

  beginBtn.onclick = () => {
    const id = input.value.trim();
    if (!id) return alert("Please insert a Quizlet ID!");
    startStudy(id);
  };

  function buildQuizletEmbed(id) {
    return `https://quizlet.com/${id}/test/embed?i=3va39x&x=1jj1`;
  }

  function startStudy(id) {
    const link = buildQuizletEmbed(id);

    if (!document.getElementById("quizFrame")) {
      document.body.innerHTML = `
        <iframe id="quizFrame" style="width:100%;height:100vh;border:none;"></iframe>

        <iframe id="gameFrame"
          src="https://basketball-stars.io/basketball-stars-2026.embed"
          style="width:100%;height:100vh;border:none;display:none;"
          scrolling="no"
          allowfullscreen
          allow="fullscreen; autoplay">
        </iframe>

        <div id="timerDisplay" style="
          position: fixed; top: 20px; right: 30px;
          background: #2563eb; color: white;
          padding: 8px 14px; border-radius: 8px;
          font-weight: bold; z-index: 1000;">
        </div>

        <div id="cashDisplay" style="
          position: fixed; top: 20px; left: 30px;
          background: #16a34a; color: white;
          padding: 8px 14px; border-radius: 8px;
          font-weight: bold; z-index: 1000;">
          Cash: $0
        </div>
      `;
    }

    const quiz = document.getElementById("quizFrame");
    const game = document.getElementById("gameFrame");
    const timer = document.getElementById("timerDisplay");

    quiz.src = link;
    quiz.style.display = "block";
    game.style.display = "none";

    let timeLeft = 20;
    timer.textContent = `Next game in: ${timeLeft}s`;

    const interval = setInterval(() => {
      timeLeft--;
      timer.textContent = `Next game in: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(interval);
        rewardCash();
        startGame(id);
      }
    }, 1000);
  }

  function startGame(id) {
    const quiz = document.getElementById("quizFrame");
    const game = document.getElementById("gameFrame");
    const timer = document.getElementById("timerDisplay");

    quiz.style.display = "none";
    game.style.display = "block";

    let timeLeft = 20;
    timer.textContent = `Next Quizlet in: ${timeLeft}s`;

    const interval = setInterval(() => {
      timeLeft--;
      timer.textContent = `Next Quizlet in: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(interval);
        startStudy(id);
      }
    }, 1000);
  }

  function rewardCash() {
    cash += 10;
    const cashDisplay = document.getElementById("cashDisplay");
    if (!cashDisplay) return;

    cashDisplay.textContent = `Cash: $${cash}`;

    const plus = document.createElement("div");
    plus.textContent = "+$10";
    plus.style.position = "fixed";
    plus.style.left = "50%";
    plus.style.top = "50%";
    plus.style.transform = "translate(-50%, -50%)";
    plus.style.fontSize = "2rem";
    plus.style.fontWeight = "bold";
    plus.style.color = "#16a34a";
    plus.style.transition = "all 1s ease";
    plus.style.zIndex = "2000";

    document.body.appendChild(plus);

    setTimeout(() => {
      plus.style.top = "30%";
      plus.style.opacity = "0";
    }, 50);

    setTimeout(() => plus.remove(), 1000);
  }
});
