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

let decks = loadDecks();
let currentDeck = null;

function showDecks() {
  deckList.innerHTML = "";
  Object.keys(decks).forEach(name => {
    const btn = createElement("button", "", name);
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
  saveDecks(decks);
  openDeck(name);
};

addCardBtn.onclick = () => {
  const term = termInput.value.trim();
  const def = defInput.value.trim();
  if (!term || !def) return alert("Fill out both fields!");
  decks[currentDeck].push({ term, def });
  saveDecks(decks);
  termInput.value = "";
  defInput.value = "";
  renderCards();
};

bulkAddBtn.onclick = () => {
  const bulkText = prompt("Paste terms and definitions (term - definition per line):");
  if (!bulkText) return;
  const lines = bulkText.split("\n").filter(l => l.includes("-"));
  lines.forEach(line => {
    const [term, def] = line.split("-").map(s => s.trim());
    if (term && def) decks[currentDeck].push({ term, def });
  });
  saveDecks(decks);
  renderCards();
};

function renderCards() {
  cardList.innerHTML = "";
  decks[currentDeck].forEach((card, i) => {
    const div = createElement("div", "cardItem", `
      <span><strong>${card.term}</strong> - ${card.def}</span>
      <div class="cardActions">
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
      </div>
    `);
    div.querySelector(".edit").onclick = () => editCard(i);
    div.querySelector(".delete").onclick = () => deleteCard(i);
    cardList.appendChild(div);
  });
}

function editCard(i) {
  const newTerm = prompt("Edit term:", decks[currentDeck][i].term);
  const newDef = prompt("Edit definition:", decks[currentDeck][i].def);
  if (newTerm && newDef) {
    decks[currentDeck][i] = { term: newTerm, def: newDef };
    saveDecks(decks);
    renderCards();
  }
}

function deleteCard(i) {
  if (confirm("Delete this card?")) {
    decks[currentDeck].splice(i, 1);
    saveDecks(decks);
    renderCards();
  }
}

saveDeckBtn.onclick = () => {
  saveDecks(decks);
  alert("Deck saved!");
  showDecks();
};

backToMenuBtn.onclick = () => {
  deckEditor.classList.add("hidden");
  mainMenu.classList.remove("hidden");
};

document.querySelectorAll(".modeBtn").forEach(btn => {
  btn.onclick = () => {
    const mode = btn.dataset.mode;
    deckEditor.classList.add("hidden");
    gameArea.classList.remove("hidden");
    gameArea.innerHTML = "";

    if (mode === "shoot") startShootMode(currentDeck, decks);
    else if (mode === "flashcards") startFlashcardMode(currentDeck, decks);
    else gameArea.innerHTML = `<h2>${mode} mode coming soon!</h2><button onclick="location.reload()">⬅ Back</button>`;
  };
});

function goBack() {
  gameArea.classList.add("hidden");
  deckEditor.classList.remove("hidden");
}

// 🎮 R + B simultaneous shortcut for Retro Bowl
document.addEventListener("keydown", e => {
  pressedKeys.add(e.key.toLowerCase());
  if (pressedKeys.has("r") && pressedKeys.has("b")) {
    if (!showingRetroBowl) {
      document.body.innerHTML = `<iframe src="https://basketball-stars.io" style="width:100%;height:100vh;border:none;"></iframe>`;
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
