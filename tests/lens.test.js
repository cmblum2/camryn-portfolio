import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderForLens, taglineForLens } from '../src/lens.js';

test('orderForLens puts items matching the lens first, stable within groups', () => {
  const items = [
    { id: 'a', lenses: ['IB'] },
    { id: 'b', lenses: ['AI'] },
    { id: 'c', lenses: ['AI', 'IB'] },
  ];
  const out = orderForLens(items, 'AI');
  assert.deepEqual(out.map(i => i.id), ['b', 'c', 'a']);
});

test('orderForLens does not mutate the input array', () => {
  const items = [{ id: 'a', lenses: ['IB'] }, { id: 'b', lenses: ['AI'] }];
  orderForLens(items, 'AI');
  assert.deepEqual(items.map(i => i.id), ['a', 'b']);
});

test('orderForLens treats a missing lenses array as non-matching', () => {
  const items = [{ id: 'a' }, { id: 'b', lenses: ['BI'] }];
  const out = orderForLens(items, 'BI');
  assert.deepEqual(out.map(i => i.id), ['b', 'a']);
});

test('taglineForLens returns the lens value, or default when absent', () => {
  const p = { taglines: { AI: 'x', default: 'd' } };
  assert.equal(taglineForLens(p, 'taglines', 'AI'), 'x');
  assert.equal(taglineForLens(p, 'taglines', 'BI'), 'd');
});
