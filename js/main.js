document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("quizletLink");
  const beginBtn = document.getElementById("beginBtn");
  const historyDiv = document.getElementById("history");

  let pressedKeys = new Set();
  let showingBasketball = false;

  // Load saved links
  let linkHistory = JSON.parse(localStorage.getItem("quizletLinks") || "[]");
  renderHistory();

  beginBtn.onclick = () => {
    const link = input.value.trim();
    if (!link) return alert("Please insert a Quizlet link!");
    if (!linkHistory.includes(link)) {
      linkHistory.unshift(link);
      localStorage.setItem("quizletLinks", JSON.stringify(linkHistory));
    }
    startStudy(link);
  };

  function renderHistory() {
    historyDiv.innerHTML = "";
    if (linkHistory.length > 0) {
      const label = document.createElement("p");
      label.textContent = "Recent Quizlet Links:";
      historyDiv.appendChild(label);
    }
    linkHistory.forEach(link => {
      const btn = document.createElement("button");
      btn.textContent = link.replace(/^https?:\/\//, "").slice(0, 40) + "...";
      btn.onclick = () => startStudy(link);
      historyDiv.appendChild(btn);
    });
  }

  function startStudy(link) {
    document.body.innerHTML = `
      <iframe id="quizFrame" src="${link}" 
        style="width:100%;height:100vh;border:none;"></iframe>
      <div id="timerDisplay"
        style="position:fixed;top:20px;right:30px;background:#2563eb;color:white;
               padding:8px 14px;border-radius:8px;font-weight:bold;font-size:1rem;
               box-shadow:0 4px 10px rgba(0,0,0,0.2);z-index:1000;">
        Next game in: 10s
      </div>`;
    let timeLeft = 10;
    const timer = document.getElementById("timerDisplay");
    const interval = setInterval(() => {
      timeLeft--;
      timer.textContent = `Next game in: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(interval);
        startGame(link);
      }
    }, 1000);
  }

  function startGame(link) {
    document.body.innerHTML = `
      <iframe src="https://basketball-stars.io"
        style="width:100%;height:100vh;border:none;"></iframe>
      <div id="timerDisplay"
        style="position:fixed;top:20px;right:30px;background:#2563eb;color:white;
               padding:8px 14px;border-radius:8px;font-weight:bold;font-size:1rem;
               box-shadow:0 4px 10px rgba(0,0,0,0.2);z-index:1000;">
        Next Quizlet in: 10s
      </div>`;
    let timeLeft = 10;
    const timer = document.getElementById("timerDisplay");
    const interval = setInterval(() => {
      timeLeft--;
      timer.textContent = `Next Quizlet in: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(interval);
        startStudy(link);
      }
    }, 1000);
  }

  // 🎮 R + B shortcut
  document.addEventListener("keydown", e => {
    pressedKeys.add(e.key.toLowerCase());
    if (pressedKeys.has("r") && pressedKeys.has("b")) {
      if (!showingBasketball) {
        document.body.innerHTML = `
          <iframe src="https://basketball-stars.io"
            style="width:100%;height:100vh;border:none;"></iframe>`;
        showingBasketball = true;
      }
    }
  });

  document.addEventListener("keyup", e => pressedKeys.delete(e.key.toLowerCase()));
});
