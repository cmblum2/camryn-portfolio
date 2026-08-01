// Pure, DOM-free helpers for the role-lens toggle.

// Return a NEW array with items whose `lenses` include `lens` first,
// preserving original order within each group (stable partition).
export function orderForLens(items, lens) {
  const match = [];
  const rest = [];
  for (const item of items) {
    if (Array.isArray(item.lenses) && item.lenses.includes(lens)) match.push(item);
    else rest.push(item);
  }
  return [...match, ...rest];
}

// Look up profile[field][lens], falling back to profile[field].default.
export function taglineForLens(profile, field, lens) {
  const map = profile[field] || {};
  return map[lens] ?? map.default ?? '';
}
