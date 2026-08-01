import { test } from 'node:test';
import assert from 'node:assert/strict';
import { route, plan } from '../src/engine.js';
import { entries } from '../src/warehouse.js';

test('route matches the acquisition story', () => {
  assert.equal(route('how did you help sell a company?', entries).id, 'sell');
});
test('route matches the AI backtest story', () => {
  assert.equal(route('can you prove your AI was right?', entries).id, 'prove');
});
test('route matches deployments', () => {
  assert.equal(route('what have you deployed?', entries).id, 'deploy');
});
test('route matches the voice AI agent', () => {
  assert.equal(route('tell me about the voice AI agent', entries).id, 'voice');
});
test('route is case-insensitive', () => {
  assert.equal(route('SHOW ME THE DATA WAREHOUSE', entries).id, 'warehouse');
});
test('route falls back to the warehouse root on no match', () => {
  assert.equal(route('xyzzy nonsense', entries).id, 'warehouse');
});
test('plan returns the entry query-plan string', () => {
  const e = entries.find(x => x.id === 'prove');
  assert.equal(plan(e), e.plan);
});
