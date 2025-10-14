let folders = JSON.parse(localStorage.getItem("folders")) || {};
let currentFolder = null;
let currentMode = "flashcards";
let timerInterval;
let timeLeft = 10;
let currentQuestion = null;

function saveData() {
  localStorage.setItem("folders", JSON.stringify(folders));
}

function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function createFolder() {
  const name = prompt("Folder name:");
  if (!name) return;
  folders[name] = [];
  saveData();
  renderFolders();
}

function renderFolders() {
  const container = document.getElementById("folders");
  container.innerHTML = "";
  Object.keys(folders).forEach(name => {
    const div = document.createElement("div");
    div.className = "folder";
    div.innerHTML = `${name}<br><small>${folders[name].length} cards</small>`;
    div.onclick = () => openFolder(name);
    container.appendChild(div);
  });
}

function openFolder(name) {
  currentFolder = name;
  showSection("flashcard-section");
  document.getElementById("folder-name").innerText = name;
  renderFlashcards();
}

function renderFlashcards() {
  const container = document.getElementById("flashcards-container");
  container.innerHTML = "";
  folders[currentFolder].forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "flashcard";
    div.innerHTML = `<b>${card.term}</b><br>${card.definition}`;
    div.onclick = () => editFlashcard(i);
    container.appendChild(div);
  });
  saveData();
}

function addFlashcard() {
  const term = prompt("Term:");
  const def = prompt("Definition:");
  if (!term || !def) return;
  folders[currentFolder].push({ term, definition: def });
  renderFlashcards();
}

function editFlashcard(i) {
  const card = folders[currentFolder][i];
  const term = prompt("Edit term:", card.term);
  const def = prompt("Edit definition:", card.definition);
  if (term && def) {
    folders[currentFolder][i] = { term, definition: def };
  } else if (confirm("Delete this flashcard?")) {
    folders[currentFolder].splice(i, 1);
  }
  renderFlashcards();
}

function goBack() {
  currentFolder = null;
  showSection("folder-section");
  renderFolders();
}

function setMode(mode) {
  currentMode = mode;
  if (mode === "game") startGame();
}

function startGame() {
  if (!currentFolder || folders[currentFolder].length === 0) {
    alert("Select a folder with flashcards first!");
    return;
  }
  showSection("game-section");
  timeLeft = 10;
  document.getElementById("game-timer").textContent = timeLeft;
  document.getElementById("question-popup").classList.add("hidden");

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("game-timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showGameQuestion();
    }
  }, 1000);
}

function showGameQuestion() {
  const questionBox = document.getElementById("question-popup");
  questionBox.classList.remove("hidden");
  const cards = folders[currentFolder];
  currentQuestion = cards[Math.floor(Math.random() * cards.length)];
  document.getElementById("game-question").textContent = currentQuestion.term;
  document.getElementById("game-answer").value = "";
  document.getElementById("game-frame").style.pointerEvents = "none";
}

function checkGameAnswer() {
  const ans = document.getElementById("game-answer").value.trim().toLowerCase();
  const correct = currentQuestion.definition.trim().toLowerCase();
  if (ans === correct) {
    alert("✅ Correct! Keep playing!");
    document.getElementById("question-popup").classList.add("hidden");
    document.getElementById("game-frame").style.pointerEvents = "auto";
    startGame();
  } else {
    alert("❌ Wrong! Game Over!");
    goBack();
  }
}

// Initial render
renderFolders();
