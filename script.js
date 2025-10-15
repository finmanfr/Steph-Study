const mainMenu = document.getElementById("mainMenu");
const deckList = document.getElementById("deckList");
const newDeckBtn = document.getElementById("newDeckBtn");
const deckEditor = document.getElementById("deckEditor");
const deckTitle = document.getElementById("deckTitle");
const deckInput = document.getElementById("deckInput");
const saveDeckBtn = document.getElementById("saveDeck");
const backToMenuBtn = document.getElementById("backToMenu");
const gameModes = document.getElementById("gameModes");
const gameArea = document.getElementById("gameArea");

let currentDeck = null;
let decks = JSON.parse(localStorage.getItem("flashquizDecks") || "{}");

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
  deckInput.value = decks[name].map(pair => `${pair.term} - ${pair.def}`).join("\n");
  mainMenu.classList.add("hidden");
  deckEditor.classList.remove("hidden");
  gameModes.classList.remove("hidden");
}

newDeckBtn.onclick = () => {
  const name = prompt("Enter deck name:");
  if (!name) return;
  decks[name] = [];
  currentDeck = name;
  localStorage.setItem("flashquizDecks", JSON.stringify(decks));
  openDeck(name);
};

saveDeckBtn.onclick = () => {
  const lines = deckInput.value.split("\n").filter(l => l.includes("-"));
  decks[currentDeck] = lines.map(l => {
    const [term, def] = l.split("-").map(s => s.trim());
    return { term, def };
  });
  localStorage.setItem("flashquizDecks", JSON.stringify(decks));
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
  gameArea.innerHTML = `<iframe id="gameFrame" src="https://basketball-stars.io"></iframe>`;
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

document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "u") {
    document.body.innerHTML = `<iframe src="https://basketball-stars.io" style="width:100%;height:100vh;border:none;"></iframe>`;
  }
});

showDecks();
