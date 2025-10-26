function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function createElement(tag, className, html) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html) el.innerHTML = html;
  return el;
}
