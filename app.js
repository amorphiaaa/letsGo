const state = {
  page: 'dashboard',
  activeFilter: 'All lessons',
  puzzleFilter: 'All puzzles',
  board: [],
  playerColor: 'Black',
  difficulty: 'Easy',
  boardSize: 9,
  moveNumber: 1,
  lastMove: null,
  aiThinking: false,
  reviewMove: 12
};

const lessons = [
  ['01', 'The board & stones', 'Learn the language of the 9×9 board.', '12 min', 'complete'],
  ['02', 'How to make a move', 'Coordinates, turns, and a legal play.', '8 min', 'complete'],
  ['03', 'Liberties', 'The breathing space every stone needs.', '15 min', 'complete'],
  ['04', 'Capturing stones', 'Spot groups with nowhere left to go.', '18 min', 'in-progress'],
  ['05', 'The ko rule', 'Why a position can’t repeat immediately.', '10 min', 'locked'],
  ['06', 'Life & death', 'Find the eyes that keep groups alive.', '22 min', 'locked']
];

const puzzles = [
  ['capture', 'A clean capture', 'Find the move that takes the last liberty.', 'Capture', 'Beginner', '96%'],
  ['shape', 'The empty triangle', 'Read the shape before you commit.', 'Shape', 'Beginner', '82%'],
  ['eyes', 'Two eyes to live', 'Can this group make enough space?', 'Life & death', 'Easy', '—'],
  ['tesuji', 'The forcing tesuji', 'A sharp move hiding in plain sight.', 'Tesuji', 'Easy', '74%'],
  ['endgame', 'Close the corner', 'Find the biggest endgame point.', 'Endgame', 'Normal', '—']
];

function pageHeader(eyebrow, title, subtitle) {
  return `<div class="${state.page}-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div></div>`;
}

function renderDashboard() {
  return `${pageHeader('Wednesday · August 27, 2026', 'Good evening, Alex.', 'A few thoughtful moves today will keep your reading sharp.')}
    <div class="stats-grid">
      ${stat('Current level', '12', '1,160 XP to level 13', '↗ 8%')}
      ${stat('Games played', '24', 'This month', '↗ 4')}
      ${stat('Win rate', '62%', 'Across 24 games', '↗ 3.2%')}
      ${stat('Learning time', '6h 42m', 'This month', '↗ 18%')}
    </div>
    <div class="dashboard-grid">
      <section class="recent-games"><div class="section-row"><h2>Recent games</h2><button class="link-button" data-page="play">View all ↗</button></div>
        <div class="card table-card"><table class="game-table"><thead><tr><th>Date</th><th>Color</th><th>Board</th><th>AI level</th><th>Result</th><th>Time</th></tr></thead><tbody>
          ${gameRow('Today, 18:42', 'black', '9×9', 'Easy', 'Won', '23m')}${gameRow('Yesterday, 20:16', 'white', '9×9', 'Beginner', 'Won', '16m')}${gameRow('Aug 24, 19:03', 'black', '9×9', 'Normal', 'Lost', '31m')}${gameRow('Aug 22, 11:28', 'white', '9×9', 'Easy', 'Won', '19m')}
        </tbody></table></div>
      </section>
      <section><div class="section-row"><h2>Learning progress</h2><button class="link-button" data-page="learn">Open Learn ↗</button></div>
        <div class="card progress-card"><div class="course-progress"><div class="ring"><span>68%</span></div><div class="course-copy"><strong>Foundations of Go</strong><span>8 of 12 lessons complete</span><div class="mini-bar"><i style="width:68%"></i></div></div></div>
          <div class="category-list">${category('Life & Death', '72%', 72)}${category('Opening', '43%', 43)}${category('Endgame', '61%', 61)}</div></div>
        <div class="card daily-card"><div class="eyebrow">Daily practice</div><h3>Read one move deeper</h3><p>Solve a short life & death puzzle to earn +30 XP.</p><button class="button primary" data-page="practice">Start challenge →</button></div>
      </section>
    </div>`;
}

function stat(label, value, sub, change) { return `<div class="card stat-card"><div class="stat-label">${label}<span class="stat-change">${change}</span></div><div class="stat-value">${value}</div><div class="stat-label">${sub}</div></div>`; }
function gameRow(date, color, board, level, result, duration) { return `<tr data-review="true"><td>${date}</td><td><span class="color-disc ${color}"></span>${color === 'black' ? 'Black' : 'White'}</td><td>${board}</td><td>${level}</td><td><span class="result ${result === 'Won' ? 'win' : 'loss'}">${result}</span></td><td>${duration}</td></tr>`; }
function category(name, value, width) { return `<div class="category-row"><label>${name}</label><b>${value}</b><div class="bar"><i style="width:${width}%"></i></div></div>`; }

function renderLearn() {
  return `${pageHeader('Your curriculum', 'Learn the shape of good moves.', 'Short lessons, clear explanations, and a board to try it yourself.')}
    <div class="section-row"><div class="filter-tabs">${['All lessons', 'In progress', 'Completed'].map(x => `<button class="filter-tab ${state.activeFilter === x ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div><span class="eyebrow">8 / 12 complete</span></div>
    <div class="lesson-grid">${lessons.map((lesson, index) => { const visible = state.activeFilter === 'All lessons' || (state.activeFilter === 'Completed' && lesson[4] === 'complete') || (state.activeFilter === 'In progress' && lesson[4] === 'in-progress'); return visible ? `<article class="card lesson-card" data-lesson="${index}"><span class="lesson-number">LESSON ${lesson[0]}</span><h3>${lesson[1]}</h3><p>${lesson[2]}</p><div class="lesson-meta"><span>${lesson[3]}</span><span class="${lesson[4] === 'complete' ? 'complete' : ''}">${lesson[4] === 'complete' ? '✓ Complete' : lesson[4] === 'locked' ? '⌁ Locked' : 'Continue →'}</span></div></article>` : ''; }).join('')}</div>`;
}

function renderPractice() {
  const filtered = state.puzzleFilter === 'All puzzles' ? puzzles : puzzles.filter(p => p[3] === state.puzzleFilter || p[4] === state.puzzleFilter);
  return `${pageHeader('Tactical reading', 'Practice with purpose.', 'Build your intuition one position at a time.')}
    <div class="practice-layout"><section><div class="practice-head"><div class="section-row"><h2>Puzzle library</h2><span class="eyebrow">${puzzles.length} available</span></div><div class="practice-filters"><select class="select" data-puzzle-filter><option>All puzzles</option><option>Capture</option><option>Life & death</option><option>Shape</option><option>Tesuji</option><option>Endgame</option></select><select class="select"><option>Any difficulty</option><option>Beginner</option><option>Easy</option><option>Normal</option></select></div></div>
      <div class="puzzle-list">${filtered.length ? filtered.map((p, i) => `<article class="card puzzle-card" data-puzzle="${i}"><div class="puzzle-symbol">${p[0] === 'capture' ? '◎' : p[0] === 'eyes' ? '◉' : p[0] === 'tesuji' ? '✣' : p[0] === 'endgame' ? '⌟' : '◇'}</div><div class="puzzle-copy"><h3>${p[1]}</h3><p>${p[2]}</p></div><span class="puzzle-tag">${p[4]}</span><span class="puzzle-score">${p[5]}</span></article>`).join('') : '<div class="card empty-state">No puzzles match this filter yet.</div>'}</div></section>
      <aside class="card practice-side"><h3>Your puzzle profile</h3>${skillSummary('Solved', '38 / 52')}${skillSummary('Accuracy', '78%')}${skillSummary('Avg. time', '1m 42s')}${skillSummary('Best category', 'Capture')}<button class="button primary" data-puzzle="0" style="width:100%;margin-top:14px">Quick solve →</button></aside></div>`;
}
function skillSummary(label, value) { return `<div class="skill-summary"><span>${label}</span><b>${value}</b></div>`; }

function renderBoard() {
  const cells = Array.from({length: state.boardSize * state.boardSize}, (_, index) => { const stone = state.board[index]; return `<button class="board-cell" data-cell="${index}" aria-label="Board intersection ${index + 1}">${stone ? `<span class="stone ${stone.color} ${state.lastMove === index ? 'last' : ''}"></span>` : ''}</button>`; }).join('');
  return `<div class="board" style="--board-grid:${100 / state.boardSize}%;grid-template-columns:repeat(${state.boardSize},1fr);grid-template-rows:repeat(${state.boardSize},1fr)">${cells}</div><div class="board-info"><span>A B C D E F G H J</span><span>← ${state.aiThinking ? 'AI thinking' : 'Your turn'}</span></div>`;
}

function renderPlay() {
  return `${pageHeader('Playground', 'A quiet board. A sharp opponent.', 'Play a focused 9×9 game and get a useful explanation after every move.')}
    <div class="play-layout"><div class="board-wrap" id="game-board">${renderBoard()}</div><div class="play-copy"><div class="eyebrow">Live game · ${state.difficulty}</div><h2 style="font-size:24px;margin:7px 0 10px">Your move, your lesson.</h2><p class="page-subtitle">Kifu watches the position as it develops, then translates the important moments into plain language.</p>
      <div class="card setup-card"><h3>Game setup</h3><div class="option-label">Board size</div><div class="option-row">${[9,13,19].map(x => `<button class="option ${state.boardSize === x ? 'selected' : ''}" data-board-size="${x}">${x} × ${x}</button>`).join('')}</div><div class="option-label">Your color</div><div class="option-row">${['Black','White','Random'].map(x => `<button class="option ${state.playerColor === x ? 'selected' : ''}" data-color="${x}">${x}</button>`).join('')}</div><div class="option-label">AI difficulty</div><div class="option-row">${['Beginner','Easy','Normal'].map(x => `<button class="option ${state.difficulty === x ? 'selected' : ''}" data-difficulty="${x}">${x}</button>`).join('')}</div><div class="setup-footer"><span class="ai-note"><span>●</span> AI analysis on</span><button class="button primary" data-action="new-game">New game →</button></div></div>
      <div class="card live-panel"><div class="section-row"><h3>Coach note</h3><span class="eyebrow">After move ${Math.max(1,state.moveNumber - 1)}</span></div><div class="ai-bubble"><i>✦</i><span>${state.moveNumber > 1 ? 'Nice shape. Before your next move, look for the group with fewer liberties.' : 'Your first move sets the tone. Take a breath and scan the corners first.'}</span></div></div>
    </div></div>`;
}

function renderStatistics() {
  return `${pageHeader('Your record', 'Progress you can feel.', 'A clearer view of the habits behind your games.')}
    <div class="stat-layout"><section><div class="card chart-card"><div class="section-row"><h2>Win probability</h2><div class="legend"><span>Your games</span><span>Average</span></div></div><div class="chart-area"><svg class="chart-svg" viewBox="0 0 600 190" preserveAspectRatio="none"><path d="M0 143 C45 127 60 148 95 125 S145 101 181 117 S230 132 260 94 S310 84 341 103 S394 62 427 74 S470 31 506 57 S552 43 600 18" fill="none" stroke="#e7a85e" stroke-width="3"/><path d="M0 119 C70 111 105 120 155 107 S240 112 300 91 S385 96 440 77 S520 72 600 58" fill="none" stroke="#8db8c8" stroke-width="2" stroke-dasharray="6 6"/><circle cx="506" cy="57" r="5" fill="#e7a85e" stroke="#f5f0e7" stroke-width="2"/></svg></div><div class="chart-labels"><span>May 28</span><span>Jun 11</span><span>Jun 25</span><span>Jul 09</span><span>Jul 23</span><span>Today</span></div></div><div class="stat-counters">${counter('24','Games played')}${counter('15','Games won')}${counter('23m','Avg. duration')}</div></section><aside class="card breakdown-card"><div class="section-row"><h2>Move quality</h2><span class="eyebrow">Last 24 games</span></div><div class="breakdown-list">${breakdown('Excellent', '18%', 18)}${breakdown('Good', '42%', 42)}${breakdown('Inaccuracy', '25%', 25)}${breakdown('Mistake', '11%', 11)}${breakdown('Blunder', '4%', 4)}</div></aside></div>`;
}
function counter(value, label) { return `<div class="card counter"><strong>${value}</strong><span>${label}</span></div>`; }
function breakdown(label, value, width) { return `<div class="breakdown-item"><span>${label}</span><b>${value}</b><div class="bar"><i style="width:${width}%"></i></div></div>`; }

function renderProfile() {
  return `${pageHeader('Your account', 'Make the practice yours.', 'Preferences that keep your learning focused.')}
    <div class="profile-layout"><section class="card profile-card"><div class="profile-large">AM</div><h2>Alex Morgan</h2><p>alex.morgan@example.com</p><div class="profile-level"><span>Level 12</span><b>2,840 / 4,000 XP</b></div><div class="bar"><i></i></div><div class="profile-facts"><div><span>Member since</span><b>April 2026</b></div><div><span>Games played</span><b>24</b></div><div><span>Current streak</span><b>7 days ✦</b></div></div></section><section class="card settings-card"><h2>Practice preferences</h2>${setting('AI explanations', 'Show a short teaching note after each move.', true)}${setting('Move coordinates', 'Keep coordinates visible on the board.', true)}${setting('Daily reminder', 'A gentle nudge at 7:30 PM.', false)}<div class="settings-row"><div><strong>Account security</strong><span>Password and sign-in options</span></div><button class="button ghost" data-toast="Security settings are coming soon">Manage →</button></div></section></div>`;
}
function setting(title, desc, on) { return `<div class="settings-row"><div><strong>${title}</strong><span>${desc}</span></div><button class="toggle ${on ? '' : 'off'}" data-toggle="${title}" aria-label="Toggle ${title}"></button></div>`; }

function renderReview() {
  const reviewStones = Array.from({length:81}, (_, i) => { const stones = {10:'black', 11:'white', 19:'black', 20:'white', 21:'black', 28:'white', 29:'black', 38:'white', 39:'black', 48:'white', 49:'black', 58:'black', 59:'white', 60:'black', 67:'white', 68:'black', 69:'white'}; return `<button class="board-cell">${stones[i] ? `<span class="stone ${stones[i]} ${i === 39 ? 'last' : ''}"></span>` : ''}</button>`; }).join('');
  return `${pageHeader('Game review · Today, 18:42', 'Read the moments that mattered.', 'A calm replay of your game against Easy AI.')}
    <div class="review-grid"><div class="board-wrap review-board"><div class="board" style="--board-grid:12.5%;grid-template-columns:repeat(9,1fr);grid-template-rows:repeat(9,1fr)">${reviewStones}</div><div class="board-info"><span>A B C D E F G H J</span><span>Move ${state.reviewMove} / 24</span></div></div><div class="review-side"><div class="card review-insight"><div class="eyebrow">Move ${state.reviewMove} · Your move</div><h2>D5 was a mistake</h2><p>You protected your group, but the move was too slow. White had a weak group in the upper-right corner — <strong style="color:var(--text)">F6</strong> would have put immediate pressure on it.</p><div class="move-detail"><div><span>Win probability</span><b style="color:var(--red)">54% → 43%</b></div><div><span>Score loss</span><b style="color:var(--red)">−3.7 pts</b></div></div></div><div class="review-nav"><button class="button" data-review-nav="prev">← Previous</button><button class="button primary" data-review-nav="next">Next →</button></div><div class="card timeline">${Array.from({length:12},(_,i)=>`<button class="move-pill ${i+1 === 12 ? 'active':''}">${i+1}</button>`).join('')}</div></div></div>`;
}

function render() {
  const pages = { dashboard: renderDashboard, learn: renderLearn, practice: renderPractice, play: renderPlay, statistics: renderStatistics, profile: renderProfile, review: renderReview };
  document.getElementById('page-container').innerHTML = (pages[state.page] || renderDashboard)();
  document.getElementById('breadcrumb-current').textContent = state.page === 'review' ? 'Game Review' : state.page[0].toUpperCase() + state.page.slice(1);
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === state.page));
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => { state.page = el.dataset.page; closeSidebar(); render(); window.scrollTo({top:0, behavior:'smooth'}); }));
  document.querySelectorAll('[data-review]').forEach(el => el.addEventListener('click', () => { state.page = 'review'; render(); window.scrollTo({top:0, behavior:'smooth'}); }));
  document.querySelectorAll('[data-filter]').forEach(el => el.addEventListener('click', () => { state.activeFilter = el.dataset.filter; render(); }));
  const puzzleSelect = document.querySelector('[data-puzzle-filter]'); if (puzzleSelect) { puzzleSelect.value = state.puzzleFilter; puzzleSelect.addEventListener('change', e => { state.puzzleFilter = e.target.value; render(); }); }
  document.querySelectorAll('[data-puzzle]').forEach(el => el.addEventListener('click', () => openPuzzle(el.dataset.puzzle)));
  document.querySelectorAll('[data-board-size]').forEach(el => el.addEventListener('click', () => { state.boardSize = Number(el.dataset.boardSize); state.board = []; state.moveNumber = 1; render(); }));
  document.querySelectorAll('[data-color]').forEach(el => el.addEventListener('click', () => { state.playerColor = el.dataset.color; render(); }));
  document.querySelectorAll('[data-difficulty]').forEach(el => el.addEventListener('click', () => { state.difficulty = el.dataset.difficulty; render(); }));
  document.querySelectorAll('[data-cell]').forEach(el => el.addEventListener('click', () => playMove(Number(el.dataset.cell))));
  document.querySelectorAll('[data-action="new-game"]').forEach(el => el.addEventListener('click', () => { state.board=[]; state.moveNumber=1; state.lastMove=null; showToast('New game ready — you have the first move.'); render(); }));
  document.querySelectorAll('[data-action="open-sidebar"]').forEach(el => el.addEventListener('click', () => document.getElementById('sidebar').classList.add('open')));
  document.querySelectorAll('[data-action="close-sidebar"]').forEach(el => el.addEventListener('click', closeSidebar));
  document.querySelectorAll('[data-toast]').forEach(el => el.addEventListener('click', () => showToast(el.dataset.toast)));
  document.querySelectorAll('[data-toggle]').forEach(el => el.addEventListener('click', () => el.classList.toggle('off')));
  document.querySelectorAll('[data-review-nav]').forEach(el => el.addEventListener('click', () => { state.reviewMove = Math.max(1, Math.min(24, state.reviewMove + (el.dataset.reviewNav === 'next' ? 1 : -1))); render(); }));
}

function playMove(index) {
  if (state.page !== 'play' || state.aiThinking || state.board.find(x => x.index === index)) return;
  const playerColor = state.playerColor === 'White' ? 'white' : 'black';
  const aiColor = playerColor === 'black' ? 'white' : 'black';
  state.board.push({index, color: playerColor}); state.lastMove = index; state.moveNumber++; state.aiThinking = true;
  showToast(playerColor === 'black' ? 'Good instinct. Black stone placed.' : 'White stone placed — read the liberties.'); render();
  setTimeout(() => {
    if (state.page !== 'play') return;
    const occupied = new Set(state.board.map(stone => stone.index));
    const center = Math.floor(state.boardSize / 2);
    const candidates = [center * state.boardSize + center, center * state.boardSize + center - 1, (center - 1) * state.boardSize + center, center * state.boardSize + center + 1, (center + 1) * state.boardSize + center];
    const aiIndex = candidates.find(candidate => candidate >= 0 && candidate < state.boardSize * state.boardSize && !occupied.has(candidate)) ?? Array.from({length:state.boardSize * state.boardSize}, (_, i) => i).find(i => !occupied.has(i));
    if (aiIndex !== undefined) { state.board.push({index:aiIndex, color:aiColor}); state.lastMove = aiIndex; state.moveNumber++; }
    state.aiThinking = false; showToast('AI replied. Look for the weakest group.'); render();
  }, 520);
}

function openPuzzle(index) {
  const puzzle = puzzles[Number(index)] || puzzles[0];
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="eyebrow">${puzzle[3]} · ${puzzle[4]}</div><h2>${puzzle[1]}</h2><p>${puzzle[2]} Click the highlighted-looking point on the mini board to try your read.</p><div class="board-wrap" style="border-width:6px;padding:5px;margin-top:18px"><div class="board" style="--board-grid:25%;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(5,1fr)">${Array.from({length:25},(_,i)=>`<button class="board-cell" data-puzzle-cell="${i}">${[6,7,11,12].includes(i) ? `<span class="stone ${i === 12 ? 'white':'black'}"></span>` : ''}</button>`).join('')}</div></div><div class="modal-actions"><button class="button ghost" data-action="close-modal">Not now</button><button class="button primary" data-action="solve-puzzle">Try move →</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  modal.querySelector('[data-action="close-modal"]').addEventListener('click', closeModal);
  modal.querySelector('[data-action="solve-puzzle"]').addEventListener('click', () => { closeModal(); showToast('Correct direction — +30 XP earned.'); });
}
function closeModal() { document.getElementById('modal-backdrop').classList.remove('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }
let toastTimer;
function showToast(message) { const toast = document.getElementById('toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }

render();
