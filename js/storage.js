function loadDecks() {
  return JSON.parse(localStorage.getItem("stephStudyDecks") || "{}");
}

function saveDecks(decks) {
  localStorage.setItem("stephStudyDecks", JSON.stringify(decks));
}
