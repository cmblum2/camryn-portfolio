import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderStatus, loadStatus } from '../src/status.js';

test('renderStatus counts non-down as live and marks idle + down states', () => {
  const html = renderStatus([{ name: 'a', state: 'up' }, { name: 'b', state: 'idle' }, { name: 'c', state: 'down' }]);
  assert.match(html, /2 \/ 3 live/);          // up + idle both count as live
  assert.match(html, /sysitem idle/);
  assert.match(html, /sysitem down/);
});

test('renderStatus tolerates the legacy up:boolean schema', () => {
  const html = renderStatus([{ name: 'a', up: true }, { name: 'b', up: false }]);
  assert.match(html, /1 \/ 2 live/);
  assert.match(html, /sysitem down/);
});

test('loadStatus uses the injected fetch and returns the systems array', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ systems: [{ name: 'x', state: 'idle' }] }) });
  const list = await loadStatus(fakeFetch, 'status.json');
  assert.deepEqual(list, [{ name: 'x', state: 'idle' }]);
});

test('loadStatus returns [] when fetch throws', async () => {
  const boom = async () => { throw new Error('offline'); };
  assert.deepEqual(await loadStatus(boom, 'status.json'), []);
});
