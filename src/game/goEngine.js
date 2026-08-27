export const EMPTY = null;
export const COLORS = { BLACK: 'black', WHITE: 'white' };

export function otherColor(color) {
  return color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
}

export function createGame(size = 9, options = {}) {
  const board = options.board ? [...options.board] : Array(size * size).fill(EMPTY);
  return {
    size,
    board,
    currentPlayer: options.currentPlayer || COLORS.BLACK,
    koIndex: options.koIndex ?? null,
    consecutivePasses: 0,
    captures: { black: 0, white: 0 },
    moveNumber: 1,
    status: 'active',
    winner: null,
    history: []
  };
}

export function neighbors(index, size) {
  const row = Math.floor(index / size);
  const col = index % size;
  return [
    row > 0 ? index - size : null,
    row < size - 1 ? index + size : null,
    col > 0 ? index - 1 : null,
    col < size - 1 ? index + 1 : null
  ].filter((value) => value !== null);
}

export function collectGroup(board, size, start) {
  const color = board[start];
  if (!color) return { stones: new Set(), liberties: new Set() };
  const stones = new Set([start]);
  const liberties = new Set();
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    for (const next of neighbors(current, size)) {
      if (!board[next]) liberties.add(next);
      else if (board[next] === color && !stones.has(next)) {
        stones.add(next);
        queue.push(next);
      }
    }
  }
  return { stones, liberties };
}

function simulateMove(game, index) {
  const board = [...game.board];
  const player = game.currentPlayer;
  const opponent = otherColor(player);
  board[index] = player;
  const captured = [];
  for (const next of neighbors(index, game.size)) {
    if (board[next] === opponent) {
      const group = collectGroup(board, game.size, next);
      if (group.liberties.size === 0) {
        group.stones.forEach((stone) => {
          board[stone] = EMPTY;
          captured.push(stone);
        });
      }
    }
  }
  const ownGroup = collectGroup(board, game.size, index);
  return { board, captured, ownGroup };
}

export function validateMove(game, index) {
  if (game.status !== 'active') return { legal: false, reason: 'game_finished' };
  if (!Number.isInteger(index) || index < 0 || index >= game.board.length) return { legal: false, reason: 'outside_board' };
  if (game.board[index]) return { legal: false, reason: 'occupied' };
  if (game.koIndex === index) return { legal: false, reason: 'ko' };
  const simulation = simulateMove(game, index);
  if (simulation.ownGroup.liberties.size === 0 && simulation.captured.length === 0) return { legal: false, reason: 'suicide' };
  return { legal: true, ...simulation };
}

export function playMove(game, index) {
  const validation = validateMove(game, index);
  if (!validation.legal) return { game, error: validation.reason };
  const player = game.currentPlayer;
  const nextGroup = validation.ownGroup;
  const nextKo = validation.captured.length === 1 && nextGroup.stones.size === 1 && nextGroup.liberties.size === 1 ? validation.captured[0] : null;
  return {
    game: {
      ...game,
      board: validation.board,
      currentPlayer: otherColor(player),
      koIndex: nextKo,
      consecutivePasses: 0,
      captures: { ...game.captures, [player]: game.captures[player] + validation.captured.length },
      moveNumber: game.moveNumber + 1,
      history: [...game.history, { type: 'move', index, player, captured: validation.captured }]
    },
    move: { index, player, captured: validation.captured }
  };
}

export function passMove(game) {
  if (game.status !== 'active') return { game, error: 'game_finished' };
  const passes = game.consecutivePasses + 1;
  const finished = passes >= 2;
  const score = finished ? scorePosition(game.board, game.size, game.captures) : null;
  return {
    game: {
      ...game,
      currentPlayer: otherColor(game.currentPlayer),
      koIndex: null,
      consecutivePasses: passes,
      moveNumber: game.moveNumber + 1,
      status: finished ? 'finished' : 'active',
      winner: finished ? (score.black > score.white ? COLORS.BLACK : score.white > score.black ? COLORS.WHITE : 'draw') : null,
      history: [...game.history, { type: 'pass', player: game.currentPlayer }]
    },
    score
  };
}

export function resignGame(game) {
  if (game.status !== 'active') return { game, error: 'game_finished' };
  return { game: { ...game, status: 'resigned', winner: otherColor(game.currentPlayer), history: [...game.history, { type: 'resign', player: game.currentPlayer }] } };
}

export function scorePosition(board, size, captures = { black: 0, white: 0 }) {
  const score = { black: captures.black, white: captures.white };
  const visited = new Set();
  board.forEach((stone, index) => { if (stone) score[stone] += 1; });
  board.forEach((stone, index) => {
    if (stone || visited.has(index)) return;
    const region = new Set([index]);
    const borders = new Set();
    const queue = [index];
    visited.add(index);
    while (queue.length) {
      const current = queue.shift();
      for (const next of neighbors(current, size)) {
        if (!board[next] && !visited.has(next)) { visited.add(next); region.add(next); queue.push(next); }
        else if (board[next]) borders.add(board[next]);
      }
    }
    if (borders.size === 1) score[[...borders][0]] += region.size;
  });
  return score;
}

export function findAiMove(game) {
  const center = Math.floor(game.size / 2);
  const candidates = [center * game.size + center, center * game.size + center - 1, (center - 1) * game.size + center, center * game.size + center + 1, (center + 1) * game.size + center];
  const ordered = [...candidates, ...game.board.map((_, index) => index)];
  return ordered.find((index, position) => ordered.indexOf(index) === position && validateMove(game, index).legal) ?? null;
}
