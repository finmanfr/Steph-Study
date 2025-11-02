document.addEventListener("DOMContentLoaded", () => {

  // ---------- STRICT QUIZLET CHECK + BAN SYSTEM ----------

  const SECRET_ADMIN_CODE = "L3Bron";
  const BAN_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  function getBanExpires() {
    const v = localStorage.getItem("banExpires");
    return v ? Number(v) : null;
  }

  function isBanned() {
    const expires = getBanExpires();
    return expires && Date.now() < expires;
  }

  function applyBan() {
    const expiresAt = Date.now() + BAN_DURATION_MS;
    localStorage.setItem("banExpires", String(expiresAt));
    showBanOverlay();
  }

  function showBanOverlay() {
    if (document.getElementById("banOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "banOverlay";
    overlay.style = `
      position:fixed;inset:0;
      display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.6);z-index:9999;
    `;
    overlay.innerHTML = `
      <div style="background:white;padding:20px 30px;border-radius:12px;text-align:center;max-width:420px;">
        <h2>⚠️ Account Temporarily Suspended</h2>
        <p>Unauthorized website detected. You are banned for 5 minutes.</p>
        <p>To withdraw the ban, enter the admin code below:</p>
        <input id="banCodeInput" type="password" placeholder="Enter code" style="padding:8px;width:80%;" />
        <div style="margin-top:10px;">
          <button id="banSubmitBtn" style="padding:8px 16px;">Submit</button>
        </div>
        <p id="banMsg" style="margin-top:10px;color:red;font-weight:bold;"></p>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("banSubmitBtn").onclick = () => {
      const code = document.getElementById("banCodeInput").value.trim();
      if (code === SECRET_ADMIN_CODE) {
        localStorage.removeItem("banExpires");
        document.getElementById("banMsg").style.color = "green";
        document.getElementById("banMsg").textContent = "Ban lifted.";
        setTimeout(() => overlay.remove(), 1000);
      } else {
        document.getElementById("banMsg").textContent = "Incorrect code.";
      }
    };
  }

  if (isBanned()) showBanOverlay();

  // ✅ Strict Quizlet checker — only allows "https://quizlet.com" or "https://www.quizlet.com"
  function isQuizletLink(url) {
    const normalized = url.trim().toLowerCase();
    return (
      normalized.startsWith("https://quizlet.com/") ||
      normalized.startsWith("https://www.quizlet.com/")
    );
  }

  // ---------- Main button handler ----------
  beginBtn.onclick = () => {
    if (isBanned()) {
      showBanOverlay();
      return;
    }

    const link = input.value.trim();
    if (!link) return alert("Please insert a Quizlet link!");

    if (!isQuizletLink(link)) {
      // Not a quizlet link: apply ban and inform user
      applyBan();
      alert("Unauthorized website detected. Account suspended for 5 minutes.");
      return;
    }

    // Save history (only when it's valid)
    if (!linkHistory.includes(link)) {
      linkHistory.unshift(link);
      localStorage.setItem("quizletLinks", JSON.stringify(linkHistory));
    }

    startStudy(link);
  };

  // ---------- rest of your functions (unchanged, copied) ----------
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
    // Create layout only once
    if (!document.getElementById("quizFrame")) {
      document.body.innerHTML = `
        <iframe id="quizFrame" src="${link}" style="width:100%;height:100vh;border:none;"></iframe>
        <iframe id="gameFrame" src="https://basketball-stars.io"
          style="width:100%;height:100vh;border:none;display:none;"></iframe>
        <div id="timerDisplay" style="
          position: fixed; top: 20px; right: 30px;
          background: #2563eb; color: white;
          padding: 8px 14px; border-radius: 8px;
          font-weight: bold; font-size: 1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          z-index: 1000;">Next game in: 10s</div>
      `;
    }

    const quiz = document.getElementById("quizFrame");
    const game = document.getElementById("gameFrame");
    const timer = document.getElementById("timerDisplay");

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
        startGame(link);
      }
    }, 1000);
  }

});
