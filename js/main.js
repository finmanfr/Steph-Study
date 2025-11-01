document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("quizletLink");
  const beginBtn = document.getElementById("beginBtn");
  const historyDiv = document.getElementById("history");

  let linkHistory = JSON.parse(localStorage.getItem("quizletLinks") || "[]");
  renderHistory();

  beginBtn.onclick = () => {
    const link = input.value.trim();
    if (!link) return alert("Please insert a Quizlet link!");

    // Save link if new
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
    // Load your shoot mode (game + quizlet switcher)
    if (typeof startShootMode === "function") {
      startShootMode(link);
    } else {
      // fallback – basic iframe view
      document.body.innerHTML = `
        <iframe src="${link}" style="width:100%;height:100vh;border:none;"></iframe>
      `;
    }
  }
});
