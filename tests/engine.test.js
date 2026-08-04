import { test } from 'node:test';
import assert from 'node:assert/strict';
import { route, plan } from '../src/engine.js';
import { entries } from '../src/warehouse.js';

test('route matches the reconciliation story', () => {
  assert.equal(route('how did you reconcile the books discrepancy?', entries).id, 'sell');
});
test('route matches the decision engine / backtest story', () => {
  assert.equal(route('can you prove your AI was right?', entries).id, 'engine');
});
test('route matches the exec dashboard', () => {
  assert.equal(route('what did the exec dashboard do?', entries).id, 'dashboard');
});
test('route matches the NL->SQL agent', () => {
  assert.equal(route('what is the natural language to sql agent?', entries).id, 'nl2sql');
});
test('route matches the dbt project', () => {
  assert.equal(route('show me the dbt bigquery project', entries).id, 'dbt');
});
test('route matches the creator-discovery ML system', () => {
  assert.equal(route('the affiliate ml system where you scrape comments', entries).id, 'discovery');
});
test('route matches the n8n workflow', () => {
  assert.equal(route('tell me about the n8n workflow', entries).id, 'n8n');
});
test('route matches the build-vs-buy simulation', () => {
  assert.equal(route('the fulfilled-by-tiktok build vs buy call', entries).id, 'fbt');
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
  const e = entries.find(x => x.id === 'engine');
  assert.equal(plan(e), e.plan);
});
