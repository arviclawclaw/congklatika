#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const APP = path.resolve(__dirname, '..', 'app.js');
const src = fs.readFileSync(APP, 'utf8');
const start = src.indexOf('function initialGame(');
const end = src.indexOf('function selectGameMode(', start);
assert(start >= 0 && end > start, 'game functions must be present in app.js');
let gameBlock = src.slice(start, end).replace(
  /function wait\(ms\)\{return new Promise\(resolve=>setTimeout\(resolve,ms\)\)\}/,
  'function wait(ms){return __wait(ms)}'
);
function sum(pits) { return pits.reduce((a, b) => a + b, 0); }
function stable(value) { return JSON.parse(JSON.stringify(value)); }
function makeContext({delay = false, random = 0.5} = {}) {
  const nodes = new Map();
  function nodeFor(i) {
    if (!nodes.has(i)) nodes.set(i, {
      style: {}, isConnected: true,
      classList: {add() {}, remove() {}},
      getBoundingClientRect: () => ({left: 0, top: 0, width: 12, height: 12}),
      setAttribute() {}, remove() {},
    });
    return nodes.get(i);
  }
  const document = {
    querySelector(selector) {
      const m = selector.match(/data-(?:pit|store)="?(\d+)/);
      return m ? nodeFor(Number(m[1])) : null;
    },
    createElement() { return nodeFor(-1); },
    body: {append() {}},
  };
  const deterministicMath = Object.create(Math);
  deterministicMath.random = () => random;
  const context = {
    console, document,
    window: {scrollTo() {}, speechSynthesis: {cancel() {}}},
    requestAnimationFrame: fn => fn(),
    setTimeout() { return 0; }, clearTimeout() {},
    __wait: delay ? ms => new Promise(resolve => setTimeout(resolve, Math.min(ms, 15))) : () => Promise.resolve(),
    Math: deterministicMath,
    $: () => null, $$: () => [],
    state: {name: 'Tester', game: null, page: 'play'},
    seedDots: count => Array.from({length:Math.min(count,12)},()=>'<i></i>').join(''), esc: value => String(value),
    activeMoveSnapshot: null, moveGeneration: 0, aiGeneration: 0,
    render() {}, save() {}, toast() {}, playTone() {}, playEffect() {}, popConfetti() {}, reducedMotion: () => true,
  };
  vm.createContext(context);
  vm.runInContext(`${gameBlock}\nthis.api={initialGame,simulateMove,chooseAiMove,endGame,movePit,undoGameMove,runAiTurn,cancelInFlightMove};`, context, {filename: APP});
  return {context, api: context.api};
}
function validFixture() {
  const pits = Array(16).fill(0);
  for (const i of [...Array(7).keys(), ...Array.from({length: 7}, (_, j) => j + 8)]) pits[i] = 7;
  return pits;
}
function test(name, fn) { return Promise.resolve().then(fn).then(() => console.log(`PASS ${name}`)); }
(async () => {
  let checks = 0;
  for (const mode of ['two', 'ai']) {
    const {api} = makeContext(); assert.equal(sum(api.initialGame(mode).pits), 98); checks++;
  }
  await test('98 biji: papan awal dan 196 simulasi legal tetap konservatif', () => {
    for (let seed = 1; seed <= 98; seed++) {
      const pits = validFixture();
      const i0 = (seed - 1) % 7, i1 = 8 + ((seed * 3) % 7);
      const d0=seed%3,d1=seed%5;pits[i0]=7-d0;pits[i1]=7-d1;pits[15]=d0+d1;
      assert(sum(pits) === 98 && pits[15] >= 0);
      const {api} = makeContext();
      for (const [player, index] of [[0, i0], [1, i1]]) {
        const result = api.simulateMove(pits, index, player);
        assert.equal(sum(result.board), 98, `seed fixture ${seed}`);
        assert(result.last >= 0 && result.last < 16);
        checks++;
      }
    }
  });
  await test('aturan dasar: lumbung lawan dilewati', () => {
    const {api} = makeContext(); const pits = Array(16).fill(0); pits[14] = 11; pits[7] = 87;
    const result = api.simulateMove(pits, 14, 1);
    assert.equal(result.board[7], 87); assert.equal(sum(result.board), 98); checks++;
  });
  await test('capture: biji di lubang sendiri dan seberang masuk ke lumbung', async () => {
    const h = makeContext(); const pits = Array(16).fill(0); pits[5] = 1; pits[8] = 2; pits[15] = 95;
    h.context.state.game = {...h.api.initialGame('two'), pits, turn: 0};
    await h.api.movePit(5);
    assert.equal(h.context.state.game.pits[7], 3); assert.equal(h.context.state.game.pits[8], 0);
    assert.equal(sum(h.context.state.game.pits), 98); checks++;
  });
  await test('giliran ekstra: biji terakhir di lumbung sendiri', async () => {
    const h = makeContext(); h.context.state.game = h.api.initialGame('two');
    await h.api.movePit(0);
    assert.equal(h.context.state.game.pits[7], 1); assert.equal(h.context.state.game.turn, 0);
    assert.equal(sum(h.context.state.game.pits), 98); checks++;
  });
  await test('relay: lubang berisi diambil lalu sebar berlanjut', async () => {
    const h = makeContext(); const pits = Array(16).fill(0); pits[0] = 1; pits[1] = 1; pits[8] = 1; pits[15] = 95;
    h.context.state.game = {...h.api.initialGame('two'), pits, turn: 0};
    await h.api.movePit(0);
    assert.match(h.context.state.game.message, /disebar lanjut 1 kali/);
    assert.equal(sum(h.context.state.game.pits), 98); checks++;
  });
  await test('undo pemain memulihkan susunan dan giliran sebelumnya', async () => {
    const h = makeContext(); h.context.state.game = h.api.initialGame('two'); const before = stable(h.context.state.game);
    await h.api.movePit(0); h.api.undoGameMove();
    assert.deepEqual(stable(h.context.state.game.pits), before.pits); assert.equal(h.context.state.game.turn, 0);
    assert.equal(sum(h.context.state.game.pits), 98); checks++;
  });
  await test('undo lawan AI memulihkan pasangan giliran ke titik sebelum langkah manusia', async () => {
    const h = makeContext({random: 0.4}); h.context.state.game = h.api.initialGame('ai'); const before = stable(h.context.state.game);
    await h.api.movePit(0); await h.api.runAiTurn();
    assert.equal(h.context.state.game.turn, 0); assert.equal(sum(h.context.state.game.pits), 98);
    h.api.undoGameMove(); assert.deepEqual(stable(h.context.state.game.pits), before.pits);
    assert.equal(h.context.state.game.turn, 0); checks++;
  });
  await test('navigasi saat animasi membatalkan gerak dan mempertahankan 98 biji', async () => {
    const h = makeContext({delay: true}); h.context.state.game = h.api.initialGame('two'); const before = stable(h.context.state.game.pits);
    const moving = h.api.movePit(0); assert.equal(h.context.state.game.animating, true);
    h.api.cancelInFlightMove(); await moving;
    assert.equal(sum(h.context.state.game.pits), 98); assert.deepEqual(stable(h.context.state.game.pits), before);
    assert.equal(h.context.state.game.animating, false); checks++;
  });
  console.log(`PASS congklatika game regression (${checks} assertions)`);
})().catch(error => { console.error(`FAIL congklatika game regression: ${error.stack || error}`); process.exitCode = 1; });
