import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as data from '../src/warehouse.js';

// Base denylist: obvious tokens safe to name in a public repo as things to EXCLUDE.
const BASE_DENY = ['FHIHeat', 'FHIHeatDB', 'FHIHeatQuant'];

// Optional local denylist with the real private tokens (gitignored).
let localDeny = [];
try {
  ({ DENY: localDeny = [] } = await import('./denylist.local.js'));
} catch {
  console.warn('[safety] no denylist.local.js found — running with BASE_DENY only. ' +
    'Create tests/denylist.local.js exporting `export const DENY = [...]` with real private tokens.');
}

const DENY = [...BASE_DENY, ...localDeny].filter(Boolean);

function collectStrings(value, acc = []) {
  if (typeof value === 'string') acc.push(value);
  else if (Array.isArray(value)) value.forEach(v => collectStrings(v, acc));
  else if (value && typeof value === 'object') Object.values(value).forEach(v => collectStrings(v, acc));
  return acc;
}

test('no forbidden/private token appears anywhere in data.js', () => {
  const haystack = collectStrings(data).join('\n').toLowerCase();
  const hits = DENY.filter(tok => haystack.includes(tok.toLowerCase()));
  assert.deepEqual(hits, [], `Forbidden tokens found in site content: ${hits.join(', ')}`);
});
