import { DEFAULT_ENTRY } from './warehouse.js';

// Deterministically route a free-text question to one warehouse entry.
// Returns the matched entry object (defaults to the warehouse root on no match).
export function route(question, entries) {
  const q = String(question).toLowerCase();
  const hit = entries.find(e => (e.keywords || []).some(k => q.includes(k)));
  return hit || entries.find(e => e.id === DEFAULT_ENTRY) || entries[0];
}

// The query-plan line shown before an answer streams in.
export function plan(entry) {
  return entry && entry.plan ? entry.plan : 'SELECT * FROM career';
}
