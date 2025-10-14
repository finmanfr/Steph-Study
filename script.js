// Global data & state
let data = JSON.parse(localStorage.getItem('stephData') || '{}');
// structure: { folderName: [ {id, term, def}, ... ] }
let currentFolder = null;
let studyState = null; // { mode, queue, index, known, unknown }
let testState = null;
let gameState = null;

function saveData(){
  localStorage.setItem('stephData', JSON.stringify(data));
}

/* ------------------ UI helpers ------------------ */
function $(id){ return document.getElementById(id) }
function show(element){ element.classList.remove('hidden') }
function hide(element){ element.classList.add('hidden') }
function clearChildren(el){ while(el.firstChild) el.removeChild(el.firstChild) }

/* ------------------ Initialization ------------------ */
function init(){
  renderFolderList();
  // hide all views except default
  hide($('folderView')); hide($('studyView')); hide($('testView')); hide($('gameView'));
  show($('folderView'));
}
document.addEventListener('DOMContentLoaded', init);

/* ------------------ Folders ------------------ */
function renderFolderList(){
  const list = $('folderList');
  clearChildren(list);
  for (const name in data){
    const div = document.createElement('div');
    div.className = 'folder-card';
    div.textContent = `${name} (${data[name].length})`;
    div.onclick = () => openFolder(name);
    list.appendChild(div);
  }
}

function openCreateFolder(){
  showModal(`
    <h3>Create Folder</h3>
    <input id="newFolderName" placeholder="Folder name" />
    <button onclick="createFolder()">Create</button>
    <button onclick="closeModal()">Cancel</button>
  `);
}

function createFolder(){
  const name = $('newFolderName').value.trim();
  if (!name) return alert('Name required');
  if (data[name]) return alert('Already exists');
  data[name] = [];
  saveData();
  closeModal();
  renderFolderList();
}

function openFolder(name){
  currentFolder = name;
  $('folderTitle').textContent = name;
  renderCardList();
  hide($('folderView'));
  show($('folderView'));
  // ensure appropriate views
  hide($('studyView')); hide($('testView')); hide($('gameView'));
  show($('folderView'));
}

function deleteFolder(){
  if (!currentFolder) return;
  if (!confirm(`Delete folder "${currentFolder}"?`)) return;
  delete data[currentFolder];
  saveData();
  currentFolder = null;
  renderFolderList();
  hide($('folderView'));
  show($('folderView'));
}

/* ------------------ Cards ------------------ */
function renderCardList(){
  const container = $('cardList');
  clearChildren(container);
  data[currentFolder].forEach((card,i)=>{
    const row = document.createElement('div');
    row.className = 'card-row';
    const left = document.createElement('div');
    left.innerHTML = `<div class="term">${card.term}</div><div class="def">${card.def}</div>`;
    const right = document.createElement('div');
    right.innerHTML = `<button onclick="editCard(${i})">Edit</button> <button onclick="deleteCard(${i})">Delete</button>`;
    row.appendChild(left);
    row.appendChild(right);
    container.appendChild(row);
  });
}

function openAddCard(){
  showModal(`
    <h3>Add Card to "${currentFolder}"</h3>
    <input id="cardTerm" placeholder="Term" />
    <textarea id="cardDef" placeholder="Definition"></textarea>
    <button onclick="addCard()">Add</button>
    <button onclick="closeModal()">Cancel</button>
  `);
}

function addCard(){
  const t = $('cardTerm').value.trim();
  const d = $('cardDef').value.trim();
  if (!t || !d) return alert('Enter both');
  data[currentFolder].push({ id: Date.now(), term: t, def: d });
  saveData();
  closeModal();
  renderCardList();
}

function editCard(i){
  const card = data[currentFolder][i];
  showModal(`
    <h3>Edit Card</h3>
    <input id="editTerm" value="${card.term}" />
    <textarea id="editDef">${card.def}</textarea>
    <button onclick="saveEdit(${i})">Save</button>
    <button onclick="closeModal()">Cancel</button>
  `);
}

function saveEdit(i){
  const t = $('editTerm').value.trim();
  const d = $('editDef').value.trim();
  if (!t || !d) return alert('Both fields needed');
  data[currentFolder][i].term = t;
  data[currentFolder][i].def = d;
  saveData();
  closeModal();
  renderCardList();
}

function deleteCard(i){
  if (!confirm('Delete this card?')) return;
  data[currentFolder].splice(i,1);
  saveData();
  renderCardList();
}

/* ------------------ Study / Sort Modes ------------------ */
function startMode(mode){
  if (!currentFolder) return alert('Select folder first');
  if (mode === 'game' && !basketballMode) return alert('Enable Basketball Mode first');
  studyState = { mode: mode, queue: shuffle([...data[currentFolder]]), index: 0 };
  if (mode === 'flashcard' || mode === 'sorting'){
    showStudy();
  } else if (mode === 'test'){
    startTest();
  } else if (mode === 'game'){
    startGame();
  }
}

function showStudy(){
  hide($('folderView')); hide($('testView')); hide($('gameView'));
  show($('studyView'));
  $('studyFolderName').textContent = currentFolder;
  renderStudyCard();
}

function renderStudyCard(){
  const card = studyState.queue[studyState.index];
  $('cardFront').textContent = card.term;
  $('cardBack').textContent = card.def;
  const flipEl = $('flipCard');
  flipEl.classList.remove('flipped');
}

function flipCard(){
  $('flipCard').classList.toggle('flipped');
}

function markKnow(){
  if (!studyState) return;
  studyState.index++;
  if (studyState.index >= studyState.queue.length) {
    endStudy();
  } else {
    renderStudyCard();
  }
}

function markDont(){
  if (!studyState) return;
  const card = studyState.queue[studyState.index];
  studyState.queue.push(card);
  studyState.index++;
  renderStudyCard();
}

function endStudy(){
  studyState = null;
  hide($('studyView'));
  show($('folderView'));
}

/* ------------------ Test Mode ------------------ */
function startTest(){
  testState = { pool: shuffle([...data[currentFolder]]), index: 0, score: 0, total: Math.min(10, data[currentFolder].length) };
  showTest();
}

function showTest(){
  hide($('folderView')); hide($('studyView')); hide($('gameView'));
  show($('testView'));
  $('testFolderName').textContent = currentFolder;
  nextTestQuestion();
}

function nextTestQuestion(){
  if (testState.index >= testState.total) {
    finishTest();
    return;
  }
  const q = testState.pool[testState.index];
  // pick distractors
  const others = data[currentFolder].filter(c => c.id !== q.id);
  const distract = shuffle(others).slice(0,3).map(c => c.def);
  const options = shuffle([q.def, ...distract]);
  const qEl = $('testQuestion');
  const optsEl = $('testOptions');
  qEl.textContent = `What is the definition of "${q.term}"?`;
  optsEl.innerHTML = '';
  options.forEach(opt=>{
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === q.def) testState.score++;
      testState.index++;
      nextTestQuestion();
    };
    optsEl.appendChild(btn);
  });
}

function finishTest(){
  alert(`Test done! Score: ${testState.score} / ${testState.total}`);
  endTest();
}

function endTest(){
  testState = null;
  hide($('testView'));
  show($('folderView'));
}

/* ------------------ Game / Basketball Mode ------------------ */
let basketballMode = false;
function toggleBasketballMode(){
  basketballMode = !basketballMode;
  const btn = $('gameModeBtn');
  btn.textContent = basketballMode ? '🏀 Basketball On' : '🎮 Basketball Off';
}

function startGame(){
  hide($('folderView')); hide($('studyView')); hide($('testView'));
  show($('gameView'));
  $('gameFolderName').textContent = currentFolder;
  gameState = { timeLeft: 10, interval: null };
  $('gameQuestionArea').classList.add('hidden');
  setGameBlocker(false);
  updateGameTimer();
  gameState.interval = setInterval(()=>{
    gameState.timeLeft--;
    updateGameTimer();
    if (gameState.timeLeft <= 0){
      clearInterval(gameState.interval);
      showGameQuestion();
    }
  }, 1000);
}

function updateGameTimer(){
  $('gameTimer').textContent = `${gameState.timeLeft}s`;
}

function showGameQuestion(){
  setGameBlocker(true);
  const pool = data[currentFolder];
  const q = pool[Math.floor(Math.random()*pool.length)];
  // distractors
  const others = pool.filter(c=>c.id !== q.id);
  const distract = shuffle(others).slice(0,3).map(c=>c.def);
  const options = shuffle([q.def, ...distract]);
  $('gameQuestionArea').innerHTML = `<div>What is the definition of "<strong>${q.term}</strong>"?</div>
    ${options.map(opt=>`<button onclick="answerGame('${opt}','${q.def}')">${opt}</button>`).join('')}`;
  $('gameQuestionArea').classList.remove('hidden');
}

function answerGame(selected, correct){
  if (selected === correct){
    // correct: resume 10s
    $('gameQuestionArea').classList.add('hidden');
    setGameBlocker(false);
    gameState.timeLeft = 10;
    updateGameTimer();
    gameState.interval = setInterval(()=>{
      gameState.timeLeft--;
      updateGameTimer();
      if (gameState.timeLeft <= 0){
        clearInterval(gameState.interval);
        showGameQuestion();
      }
    }, 1000);
  } else {
    alert('Wrong! Game over.');
    endGame();
  }
}

function setGameBlocker(state){
  const blk = $('gameBlocker');
  blk.style.display = state ? 'block' : 'none';
}

function endGame(){
  if (gameState && gameState.interval) clearInterval(gameState.interval);
  gameState = null;
  hide($('gameView'));
  show($('folderView'));
}

/* ------------------ Modal helper ------------------ */
function showModal(innerHTML){
  const m = $('modal');
  const c = $('modalContent');
  c.innerHTML = innerHTML;
  show(m);
}
function closeModal(){
  hide($('modal'));
}

/* ------------------ Export / Import ------------------ */
function exportData(){
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'steph-data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
function importModal(){
  showModal(`
    <h3>Import JSON</h3>
    <input type="file" id="importFile" accept="application/json"/>
    <button onclick="doImport()">Import</button>
    <button onclick="closeModal()">Cancel</button>
  `);
}
function doImport(){
  const f = document.getElementById('importFile').files[0];
  if (!f) return alert('Select file');
  const reader = new FileReader();
  reader.onload = function(e){
    try {
      data = JSON.parse(e.target.result);
      saveData();
      renderFolderList();
      closeModal();
      alert('Imported!');
    } catch(err){
      alert('Invalid file');
    }
  };
  reader.readAsText(f);
}

/* ------------------ Utility ------------------ */
function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

