document.addEventListener("DOMContentLoaded", () => {
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
      background:rgba(0,0,0,0.7);z-index:9999;
    `;
    overlay.innerHTML = `
      <div style="background:white;padding:20px 30px;border-radius:12px;text-align:center;max-width:420px;">
        <h2>⚠️ Account Temporarily Suspended</h2>
        <p>Unauthorized website detected. You are banned for 5 minutes.</p>
        <p>To withdraw the ban, enter the admin code below or press <b>R + B</b>.</p>
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
        unban();
      } else {
        document.getElementById("banMsg").textContent = "Incorrect code.";
      }
    };
  }

  function unban() {
    localStorage.removeItem("banExpires");
    const msg = document.getElementById("banMsg");
    if (msg) msg.style.color = "green", msg.textContent = "Ban lifted.";
    const overlay = document.getElementById("banOverlay");
    if (overlay) setTimeout(() => overlay.remove(), 800);
  }

  // ✅ Restore R + B shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") rPressed = true;
    if (e.key.toLowerCase() === "b" && rPressed) {
      unban();
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "r") rPressed = false;
  });
  let rPressed = false;

  if (isBanned()) showBanOverlay();

  // Strict Quizlet link check
  function isQuizletLink(url) {
    try {
      const u = new URL(url);
      return u.hostname.includes("quizlet.com");
    } catch {
      return false;
    }
  }

  // main logic
  beginBtn.onclick = () => {
    if (isBanned()) return showBanOverlay();
    const link = input.value.trim();
    if (!link) return alert("Please insert a Quizlet link!");

    if (!isQuizletLink(link)) {
      applyBan();
      alert("Unauthorized website detected. Account suspended for 5 minutes.");
      return;
    }

    if (!linkHistory.includes(link)) {
      linkHistory.unshift(link);
      localStorage.setItem("quizletLinks", JSON.stringify(linkHistory));
    }

    startStudy(link);
  };
});
