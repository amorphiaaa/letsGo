import test from 'node:test';
import assert from 'node:assert/strict';
import { COLORS, createGame, playMove, passMove, resignGame } from './goEngine.js';

test('black opens and turns alternate', () => {
  const initial = createGame(9);
  assert.equal(initial.currentPlayer, COLORS.BLACK);
  const result = playMove(initial, 40);
  assert.equal(result.error, undefined);
  assert.equal(result.game.currentPlayer, COLORS.WHITE);
  assert.equal(result.game.board[40], COLORS.BLACK);
});

test('occupied, suicide and ko moves are rejected', () => {
  let game = createGame(3, { board: [COLORS.WHITE, COLORS.WHITE, COLORS.BLACK, null, COLORS.BLACK, null, null, null, null], currentPlayer: COLORS.BLACK });
  assert.equal(playMove(game, 0).error, 'occupied');
  game = createGame(3, { board: [null, COLORS.BLACK, null, COLORS.BLACK, null, COLORS.BLACK, null, COLORS.BLACK, null], currentPlayer: COLORS.WHITE });
  assert.equal(playMove(game, 4).error, 'suicide');
  game = createGame(3, { board: [null, COLORS.WHITE, COLORS.BLACK, COLORS.WHITE, COLORS.BLACK, null, null, null, null], currentPlayer: COLORS.BLACK });
  const capture = playMove(game, 0);
  assert.equal(capture.error, undefined);
  assert.equal(capture.game.koIndex, 1);
  assert.equal(playMove(capture.game, 1).error, 'ko');
});

test('a move removes a surrounded group, including multiple groups', () => {
  let game = createGame(3, { board: [null, COLORS.WHITE, COLORS.BLACK, null, COLORS.BLACK, null, null, null, null], currentPlayer: COLORS.BLACK });
  let result = playMove(game, 0);
  assert.deepEqual(result.move.captured, [1]);
  assert.equal(result.game.board[1], null);
  assert.equal(result.game.captures.black, 1);
  game = createGame(3, { board: [null, COLORS.WHITE, COLORS.BLACK, COLORS.WHITE, COLORS.BLACK, null, COLORS.BLACK, null, null], currentPlayer: COLORS.BLACK });
  result = playMove(game, 0);
  assert.deepEqual(result.move.captured.sort((a, b) => a - b), [1, 3]);
  assert.equal(result.game.captures.black, 2);
});

test('two passes finish the game and resign awards the win', () => {
  let game = createGame(3);
  game = passMove(game).game;
  assert.equal(game.status, 'active');
  game = passMove(game).game;
  assert.equal(game.status, 'finished');
  assert.equal(resignGame(createGame(3)).game.winner, COLORS.WHITE);
});
