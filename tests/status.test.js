import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderStatus, loadStatus } from '../src/status.js';

test('renderStatus counts live systems and marks down ones', () => {
  const html = renderStatus([{ name: 'a', up: true }, { name: 'b', up: false }, { name: 'c', up: true }]);
  assert.match(html, /2 \/ 3 live/);
  assert.match(html, /down/);
});

test('loadStatus uses the injected fetch and returns the systems array', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ systems: [{ name: 'x', up: true }] }) });
  const list = await loadStatus(fakeFetch, 'status.json');
  assert.deepEqual(list, [{ name: 'x', up: true }]);
});

test('loadStatus returns [] when fetch throws', async () => {
  const boom = async () => { throw new Error('offline'); };
  assert.deepEqual(await loadStatus(boom, 'status.json'), []);
});
