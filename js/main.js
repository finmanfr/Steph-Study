document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("quizletLink");
  const beginBtn = document.getElementById("beginBtn");
  const historyDiv = document.getElementById("history");

  let pressedKeys = new Set();
  let showingBasketball = false;

  // Load saved links
  let linkHistory = JSON.parse(localStorage.getItem("quizletLinks") || "[]");
  renderHistory();

  // ---------- BAN / LINK CHECK CONFIG ----------
  // NOTE: This secret code is required to withdraw the client-side ban.
  // Do NOT show this value in the UI. (You provided "L3Bron" to be used.)
  const SECRET_ADMIN_CODE = "L3Bron";

  const BAN_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  // Utility: check if there is an active ban
  function getBanExpires() {
    const v = localStorage.getItem("banExpires");
    return v ? Number(v) : null;
  }
  function isBanned() {
    const expires = getBanExpires();
    return expires && Date.now() < expires;
  }

  // Show an overlay that blocks UI and shows ban message + code input
  function showBanOverlay() {
    // already exists?
    if (document.getElementById("banOverlay")) return;

    const expires = getBanExpires();
    const remainingSec = expires ? Math.max(0, Math.ceil((expires - Date.now()) / 1000)) : 0;

    const overlay = document.createElement("div");
    overlay.id = "banOverlay";
    overlay.style = `
      position: fixed; inset: 0;
      display:flex; align-items:center; justify-content:center;
      background: rgba(0,0,0,0.6); z-index: 9999;
    `;

    overlay.innerHTML = `
      <div style="max-width:520px; width:90%; background:white; padding:20px; border-radius:12px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <h2 style="margin:0 0 10px 0;">Account temporarily suspended</h2>
        <p id="banMessage" style="margin:0 0 12px 0;">
          Trying to use unauthorized websites. Your account is suspended for another <span id="banCountdown">${remainingSec}</span>s.
        </p>
        <p style="font-size:0.9rem; color:#555; margin-bottom:12px;">
          To withdraw the suspension, enter the admin code below. (The code will not be shown here.)
        </p>
        <input id="banCodeInput" placeholder="Enter admin code" style="padding:8px 10px; width:70%; margin-bottom:8px;" />
        <div style="margin-top:10px;">
          <button id="banTryBtn" style="padding:8px 12px; margin-right:8px;">Submit code</button>
          <button id="banCloseAttemptBtn" style="padding:8px 12px;">Close (can't proceed while banned)</button>
        </div>
        <p id="banFeedback" style="margin-top:10px; color:#b00; font-weight:bold;"></p>
      </div>
    `;
    document.body.appendChild(overlay);

    // countdown update
    const countdownEl = document.getElementById("banCountdown");
    const feedback = document.getElementById("banFeedback");
    const tryBtn = document.getElementById("banTryBtn");
    const codeInput = document.getElementById("banCodeInput");

    let timer = setInterval(() => {
      const expiresNow = getBanExpires();
      if (!expiresNow || Date.now() >= expiresNow) {
        clearInterval(timer);
        removeBanOverlay();
        return;
      }
      const remaining = Math.ceil((expiresNow - Date.now()) / 1000);
      countdownEl.textContent = remaining;
    }, 500);

    tryBtn.onclick = () => {
      const attempt = codeInput.value.trim();
      if (!attempt) {
        feedback.textContent = "Please enter a code.";
        return;
      }
      // Compare. We DO NOT reveal the secret anywhere in the UI.
      if (attempt === SECRET_ADMIN_CODE) {
        // Remove ban
        localStorage.removeItem("banExpires");
        feedback.style.color = "green";
        feedback.textContent = "Code accepted — ban removed.";
        setTimeout(removeBanOverlay, 800);
      } else {
        feedback.style.color = "#b00";
        feedback.textContent = "Invalid code.";
      }
    };

    document.getElementById("banCloseAttemptBtn").onclick = () => {
      // keep overlay visible but allow them to click the button (maybe to copy code elsewhere)
      feedback.style.color = "#555";
      feedback.textContent = "You cannot proceed while suspended.";
    };
  }

  function removeBanOverlay() {
    const el = document.getElementById("banOverlay");
    if (el) el.remove();
  }

  function applyBan() {
    const expiresAt = Date.now() + BAN_DURATION_MS;
    localStorage.setItem("banExpires", String(expiresAt));
    showBanOverlay();
  }

  // Check ban on load
  if (isBanned()) showBanOverlay();

  // ---------- Link checking ----------
  function isQuizletLink(url) {
    if (!url) return false;
    // Try to normalize
    try {
      // Accept http(s) only
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      const host = parsed.hostname.toLowerCase();
      // Accept quizlet.com and any subdomains (like www.quizlet.com) or quizlet.app links
      if (host === "quizlet.com" || host.endsWith(".quizlet.com") || host === "quizlet.app") {
        return true;
      }
      // Also allow short Quizlet share links like ql.tl or quizlet.some? (if you know other domains, add them)
      // Example: allow URLs that include "quizlet" in hostname:
      if (host.includes("quizlet")) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  // ---------- Main button handler ----------
  beginBtn.onclick = () => {
    // If currently banned, show overlay and stop
    if (isBanned()) {
      showBanOverlay();
      return;
    }

    const link = input.value.trim();
    if (!link) return alert("Please insert a Quizlet link!");

    if (!isQuizletLink(link)) {
      // Not a quizlet link: apply ban and inform user
      applyBan();
      // show immediate message as well
      alert("Trying to use unauthorized websites. Your account has been suspended for 5 minutes.");
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

  function startGame(link) {
    const quiz = document.getElementById("quizFrame");
    const game = document.getElementById("gameFrame");
    const timer = document.getElementById("timerDisplay");

    // Show game, hide Quizlet
    quiz.style.display = "none";
    game.style.display = "block";

    let timeLeft = 20;
    timer.textContent = `Next Quizlet in: ${timeLeft}s`;

    const interval = setInterval(() => {
      timeLeft--;
      timer.textContent = `Next Quizlet in: ${timeLeft}s`;
      if (timeLeft <= 0) {
        console.log("gameover");
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
