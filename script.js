let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let currency = parseInt(localStorage.getItem("currency")) || 0;
let username = localStorage.getItem("username") || "";

const nameInput = document.getElementById("nameInput");
const loginBtn = document.getElementById("loginBtn");
const userInfo = document.getElementById("userInfo");
const usernameDisplay = document.getElementById("usernameDisplay");
const currencyDisplay = document.getElementById("currency");
const createBtn = document.getElementById("createBtn");
const flashcardArea = document.getElementById("flashcardArea");
const modeTitle = document.getElementById("modeTitle");

function renderFlashcards() {
  flashcardArea.innerHTML = "";

  if (flashcards.length === 0) {
    modeTitle.textContent = "No Flashcards Yet";
    return;
  }

  modeTitle.textContent = "Flashcards";
  flashcards.forEach((card, i) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("flashcard");

    cardEl.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">${card.term}</div>
        <div class="flashcard-back">${card.definition}</div>
      </div>
    `;

    cardEl.addEventListener("click", () => {
      cardEl.classList.toggle("flipped");
      currency += 5;
      currencyDisplay.textContent = currency;
      localStorage.setItem("currency", currency);
    });

    flashcardArea.appendChild(cardEl);
  });
}

createBtn.addEventListener("click", () => {
  const term = prompt("Enter term:");
  const definition = prompt("Enter definition:");
  if (term && definition) {
    flashcards.push({ term, definition });
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    renderFlashcards();
  }
});

loginBtn.addEventListener("click", () => {
  if (nameInput.value.trim() === "") return alert("Enter your name!");
  username = nameInput.value.trim();
  localStorage.setItem("username", username);
  nameInput.style.display = "none";
  loginBtn.style.display = "none";
  userInfo.classList.remove("hidden");
  usernameDisplay.textContent = `Hello, ${username}!`;
});

if (username) {
  nameInput.style.display = "none";
  loginBtn.style.display = "none";
  userInfo.classList.remove("hidden");
  usernameDisplay.textContent = `Hello, ${username}!`;
}

currencyDisplay.textContent = currency;
renderFlashcards();
