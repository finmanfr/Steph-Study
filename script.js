const mainMenu = document.getElementById("mainMenu");
const deckList = document.getElementById("deckList");
const newDeckBtn = document.getElementById("newDeckBtn");
const deckEditor = document.getElementById("deckEditor");
const deckTitle = document.getElementById("deckTitle");
const termInput = document.getElementById("termInput");
const defInput = document.getElementById("defInput");
const addCardBtn = document.getElementById("addCard");
const bulkAddBtn = document.getElementById("bulkAddBtn");
const saveDeckBtn = document.getElementById("saveDeck");
const backToMenuBtn = document.getElementById("backToMenu");
const cardList = document.getElementById("cardList");
const gameModes = document.getElementById("gameModes");
const gameArea = document.getElementById("gameArea");

let currentDeck = null;
let decks = JSON.parse(localStorage.getItem("stephStudyDecks") || "{}");
let showingRetroBowl = false;
let pressedKeys = new Set();

function showDecks() {
  deckList.innerHTML = "";
  Object.keys(decks).forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.onclick = () => openDeck(name);
    deckList.appendChild(btn);
  });
}

function openDeck(name) {
  currentDeck = name;
  deckTitle.textContent = name;
  renderCards();
  mainMenu.classList.add("hidden");
  deckEditor.classList.remove("hidden");
  gameModes.classList.remove("hidden");
}

newDeckBtn.onclick = () => {
  const name = prompt("Enter deck name:");
  if (!name) return;
  decks[name] = [];
  currentDeck = name;
  saveToStorage();
  openDeck(name);
};

addCardBtn.onclick = () => {
  const term = termInput.value.trim();
  const def = defInput.value.trim();
  if (!term || !def) return alert("Fill out both fields!");
  decks[currentDeck].push({ term, def });
  saveToStorage();
  termInput.value = "";
  defInput.value = "";
  renderCards();
};

// 🧩 Bulk add feature
bulkAddBtn.onclick = () => {
  const bulkText = prompt("Paste terms and definitions (term - definition per line):");
  if (!bulkText) return;
  const lines = bulkText.split("\n").filter(l => l.includes("-"));
  lines.forEach(line => {
    const [term, def] = line.split("-").map(s => s.trim());
    if (term && def) decks[currentDeck].push({ term, def });
  });
  saveToStorage();
  renderCards();
};

function renderCards() {
  cardList.innerHTML = "";
  decks[currentDeck].forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "cardItem";
    div.innerHTML = `
      <span><strong>${card.term}</strong> - ${card.def}</span>
      <div class="cardActions">
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
      </div>
    `;
    div.querySelector(".edit").onclick = () => editCard(index);
    div.querySelector(".delete").onclick = () => deleteCard(index);
    cardList.appendChild(div);
  });
}

function editCard(i) {
  const newTerm = prompt("Edit term:", decks[currentDeck][i].term);
  const newDef = prompt("Edit definition:", decks[currentDeck][i].def);
  if (newTerm && newDef) {
    decks[currentDeck][i] = { term: newTerm, def: newDef };
    saveToStorage();
    renderCards();
  }
}

function deleteCard(i) {
  if (confirm("Delete this card?")) {
    decks[currentDeck].splice(i, 1);
    saveToStorage();
    renderCards();
  }
}

function saveToStorage() {
  localStorage.setItem("stephStudyDecks", JSON.stringify(decks));
}

saveDeckBtn.onclick = () => {
  saveToStorage();
  alert("Deck saved!");
  showDecks();
};

backToMenuBtn.onclick = () => {
  deckEditor.classList.add("hidden");
  mainMenu.classList.remove("hidden");
};

document.querySelectorAll(".modeBtn").forEach(btn => {
  btn.onclick = () => startMode(btn.dataset.mode);
});

function startMode(mode) {
  deckEditor.classList.add("hidden");
  gameArea.classList.remove("hidden");
  gameArea.innerHTML = "";

  if (mode === "shoot") startShootMode();
  else gameArea.innerHTML = `<h2>${mode} mode coming soon!</h2><button onclick="goBack()">⬅ Back</button>`;
}

function startShootMode() {
  gameArea.innerHTML = `<iframe id="gameFrame" src="https://www.footballgames.org"></iframe>`;
  const frame = document.getElementById("gameFrame");
  let questionInterval = setInterval(askQuestion, 10000);

  function askQuestion() {
    const qa = decks[currentDeck][Math.floor(Math.random() * decks[currentDeck].length)];
    const choices = shuffle([qa.def, ...randomDefs(3, qa.def)]);
    const qBox = document.createElement("div");
    qBox.id = "questionBox";
    qBox.innerHTML = `<h3>${qa.term}</h3>`;
    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.onclick = () => {
        if (choice === qa.def) qBox.remove();
        else alert("Try again!");
      };
      qBox.appendChild(btn);
    });
    document.body.appendChild(qBox);
  }

  function randomDefs(count, exclude) {
    const defs = decks[currentDeck].map(d => d.def).filter(d => d !== exclude);
    return shuffle(defs).slice(0, count);
  }

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
}

function goBack() {
  gameArea.classList.add("hidden");
  deckEditor.classList.remove("hidden");
}

// 🎮 R + B simultaneous shortcut for Retro Bowl
document.addEventListener("keydown", e => {
  pressedKeys.add(e.key.toLowerCase());
  if (pressedKeys.has("r") && pressedKeys.has("b")) {
    if (!showingRetroBowl) {
      document.body.innerHTML = `<iframe src="https://www.symbaloo.com" style="width:100%;height:100vh;border:none;"></iframe>`;
      showingRetroBowl = true;
    } else {
      location.reload();
    }
  }
});

document.addEventListener("keyup", e => {
  pressedKeys.delete(e.key.toLowerCase());
});

showDecks();
