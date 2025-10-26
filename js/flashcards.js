function startFlashcardMode(deckName, decks) {
  const gameArea = document.getElementById("gameArea");
  const cards = decks[deckName];
  let currentIndex = 0;
  let showingTerm = true;

  gameArea.innerHTML = `
    <div id="flashcard" class="flashcard">
      <h3 id="cardText"></h3>
    </div>
    <div class="controls">
      <button id="prevCard">⬅ Prev</button>
      <button id="flipCard">Flip</button>
      <button id="nextCard">Next ➡</button>
      <button id="stopBtn">🛑 Stop</button>
    </div>
  `;

  const cardText = document.getElementById("cardText");
  const flipBtn = document.getElementById("flipCard");
  const nextBtn = document.getElementById("nextCard");
  const prevBtn = document.getElementById("prevCard");

  function showCard() {
    const card = cards[currentIndex];
    cardText.textContent = showingTerm ? card.term : card.def;
  }

  flipBtn.onclick = () => {
    showingTerm = !showingTerm;
    showCard();
  };
  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showingTerm = true;
    showCard();
  };
  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showingTerm = true;
    showCard();
  };
  document.getElementById("stopBtn").onclick = () => location.reload();
  showCard();
}
