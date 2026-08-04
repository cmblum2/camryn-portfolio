// Compact, on-brand SVG schematics — one visual language per project.
// §8-safe (schematic, no real data), inline (no external images), scanner-readable (aria-label + text).
const A = '#f0b429', G = '#3fb950', RED = '#ff7b72', LINE = '#2a323e', DIM = '#8a909a', INK = '#cbd0d8', BLU = '#7f93b8';
const M = (s) => `font-family="'JetBrains Mono',monospace" font-size="${s}"`;
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function frame(inner, label) {
  return `<svg viewBox="0 0 340 150" width="100%" style="display:block" role="img" aria-label="${esc(label)}">`
    + `<rect x="0.5" y="0.5" width="339" height="149" rx="10" fill="#0a0d12" stroke="${LINE}"/>${inner}</svg>`;
}
const ln = (x1, y1, x2, y2, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${LINE}" stroke-width="1"${dash ? ' stroke-dasharray="3 3"' : ''}/>`;
const dot = (x, y, r, stroke) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0e1219" stroke="${stroke || A}" stroke-width="1.4"/>`;
const tx = (x, y, s, size, fill, anchor) => `<text x="${x}" y="${y}" ${M(size || 8)} fill="${fill || DIM}" text-anchor="${anchor || 'start'}">${esc(s)}</text>`;

export function renderViz(e) {
  const map = {
    fanin: [fanin, 'Data warehouse: five sources unified, then powering downstream tools'],
    reconcile: [reconcile, 'Reconciliation: shipping records vs the ERP ledger, matched to 0.5%'],
    bars: [bars, 'Build-vs-buy cost comparison — recommended against'],
    funnel: [funnel, 'Creator discovery funnel: comments to features to ranked prospects'],
    curve: [curve, 'Out-of-sample backtest accuracy across four cutoffs'],
    dag: [dag, 'dbt DAG: raw to staging to marts with data tests'],
    tiles: [tiles, 'Executive BI dashboard with a data-quality bug caught'],
    'flow-n8n': [() => flow(['trigger', 'diff', 'alert'], { from: 1, label: 'no change' }), 'n8n workflow: scheduled trigger, diff, alert only on change'],
    'flow-nl2sql': [() => flow(['ask', 'guard', 'SQL', 'chart'], { from: 1, label: 'refuse' }), 'NL to SQL agent with a guardrail refusal branch'],
    'flow-voice': [voice, 'Realtime voice loop with a confirmation gate'],
  };
  const v = e.viz && map[e.viz];
  return v ? frame(v[0](), v[1]) : '';
}

function fanin() {
  const sy = [18, 34, 50, 66, 82, 98, 114, 130];
  const hubX = 150, hubY = 74;
  let s = sy.map(y => ln(28, y, hubX, hubY) + dot(24, y, 3, DIM)).join('');
  s += `<circle cx="${hubX}" cy="${hubY}" r="12" fill="${A}"/>`;
  // right side = the conformed schema (facts + dimensions)
  s += ln(162, hubY, 246, 50) + ln(162, hubY, 246, 98);
  s += `<rect x="250" y="38" width="84" height="26" rx="4" fill="none" stroke="${A}"/>` + tx(292, 49, 'facts', 7, INK, 'middle') + tx(292, 59, 'orders·spend·ship', 6, DIM, 'middle');
  s += `<rect x="250" y="86" width="84" height="26" rx="4" fill="none" stroke="${LINE}"/>` + tx(292, 97, 'dims', 7, INK, 'middle') + tx(292, 107, 'sku·channel·date', 6, DIM, 'middle');
  s += tx(18, 146, '~10 systems · US + EU', 7, DIM) + tx(hubX, 100, 'warehouse', 7, INK, 'middle');
  return s;
}

function reconcile() {
  let s = tx(24, 34, 'shipping records', 7.5, DIM) + tx(24, 74, 'ERP ledger', 7.5, DIM);
  s += `<rect x="24" y="40" width="214" height="12" rx="3" fill="none" stroke="${A}"/>`;
  s += `<rect x="24" y="80" width="208" height="12" rx="3" fill="none" stroke="${A}"/>`;
  s += ln(238, 46, 238, 86) + ln(232, 86, 244, 86);
  s += tx(252, 62, '≈0.5%', 11, G) + tx(252, 78, 'variance', 7, DIM);
  s += tx(24, 120, 'reconciled line-by-line → matched', 7, DIM);
  return s;
}

function bars() {
  const base = 124;
  let s = ln(30, base, 310, base);
  s += `<rect x="86" y="${base - 52}" width="46" height="52" rx="2" fill="rgba(63,185,80,.14)" stroke="${G}"/>`;
  s += `<rect x="200" y="${base - 90}" width="46" height="90" rx="2" fill="rgba(255,123,114,.12)" stroke="${RED}"/>`;
  s += tx(109, base + 14, 'in-house', 7.5, DIM, 'middle') + tx(223, base + 14, 'FBT', 7.5, DIM, 'middle');
  s += tx(170, 20, 'build vs buy — per-SKU cost', 8, DIM, 'middle');
  s += `<circle cx="223" cy="24" r="12" fill="none" stroke="${RED}" stroke-width="1.4"/>` + tx(223, 27, 'NO', 8, RED, 'middle');
  return s;
}

function funnel() {
  let s = tx(170, 18, 'scrape → feature → rank', 8, DIM, 'middle');
  s += `<rect x="26" y="44" width="70" height="76" rx="3" fill="rgba(240,180,41,.06)" stroke="${LINE}"/>` + tx(61, 86, 'comments', 7, DIM, 'middle');
  s += `<rect x="120" y="56" width="64" height="52" rx="3" fill="rgba(240,180,41,.08)" stroke="${LINE}"/>` + tx(152, 85, 'features', 7, DIM, 'middle');
  s += `<rect x="208" y="66" width="56" height="32" rx="3" fill="rgba(240,180,41,.12)" stroke="${A}"/>` + tx(236, 85, 'scored', 7, INK, 'middle');
  s += ln(96, 82, 120, 82) + ln(184, 82, 208, 82);
  const oy = [58, 78, 98];
  s += oy.map((y, i) => dot(300, y, 4.5, i === 0 ? A : DIM)).join('') + tx(300, 118, 'ranked', 7, DIM, 'end');
  return s;
}

function curve() {
  let s = ln(30, 122, 320, 122) + ln(30, 122, 30, 24);
  const pts = '30,112 96,96 160,72 224,56 290,34 316,28';
  s += `<polygon points="30,122 ${pts} 316,122" fill="rgba(63,185,80,.12)"/>`;
  s += `<polyline points="${pts}" fill="none" stroke="${G}" stroke-width="2"/>`;
  s += [96, 160, 224, 290].map(x => ln(x, 118, x, 126)).join('');
  s += tx(316, 20, '100% OOS', 9, G, 'end') + tx(30, 140, '4 cutoff windows, no look-ahead', 7, DIM);
  return s;
}

function dag() {
  let s = ln(66, 76, 120, 52) + ln(66, 76, 120, 100) + ln(148, 52, 236, 52) + ln(148, 100, 236, 100);
  s += dot(54, 76, 8) + tx(54, 100, 'raw', 7, DIM, 'middle');
  s += dot(134, 52, 7) + tx(134, 36, 'staging', 7, DIM, 'middle') + dot(134, 100, 7);
  s += dot(250, 52, 7, A) + dot(250, 100, 7, A);
  s += tx(268, 55, '✓ tests', 7, G) + tx(268, 103, '✓ tests', 7, G);
  s += tx(250, 128, 'marts', 7, DIM, 'middle') + tx(170, 20, 'raw → staging → marts', 8, DIM, 'middle');
  return s;
}

function tiles() {
  let s = tx(30, 22, 'exec dashboard', 8, DIM);
  [30, 122, 214].forEach(x => { s += `<rect x="${x}" y="30" width="80" height="30" rx="4" fill="none" stroke="${LINE}"/>` + `<rect x="${x + 10}" y="42" width="34" height="6" rx="3" fill="${A}"/>`; });
  const bh = [26, 40, 30, 52, 18];
  bh.forEach((h, i) => { const x = 40 + i * 26; const isBug = i === 3; s += `<rect x="${x}" y="${118 - h}" width="16" height="${h}" rx="2" fill="none" stroke="${isBug ? A : LINE}"/>`; });
  s += ln(34, 118, 172, 118);
  s += `<path d="M118 60 l0 30" stroke="${A}" stroke-width="1" stroke-dasharray="2 2"/>` + tx(196, 92, '▲ bug caught', 7.5, A);
  return s;
}

function flow(stages, branch) {
  const y = 64, x0 = 42, x1 = 298;
  const n = stages.length;
  const xs = stages.map((_, i) => Math.round(x0 + (x1 - x0) * (n === 1 ? 0 : i / (n - 1))));
  let s = '';
  for (let i = 0; i < n - 1; i++) s += ln(xs[i] + 8, y, xs[i + 1] - 8, y);
  s += stages.map((st, i) => dot(xs[i], y, 8, i === n - 1 ? A : A) + tx(xs[i], y + 22, st, 7, INK, 'middle')).join('');
  if (branch) {
    const bx = xs[branch.from], by = 116;
    s += `<line x1="${bx}" y1="${y + 8}" x2="${bx}" y2="${by - 8}" stroke="${BLU}" stroke-width="1" stroke-dasharray="3 3"/>`;
    s += dot(bx, by, 7, BLU) + tx(bx + 14, by + 3, branch.label, 7, BLU);
  }
  s += tx(170, 20, stages.join(' → '), 8, DIM, 'middle');
  return s;
}

function voice() {
  const stages = ['listen', 'model', 'call', 'confirm'];
  const y = 60, xs = [50, 130, 210, 290];
  let s = '';
  for (let i = 0; i < 3; i++) s += ln(xs[i] + 8, y, xs[i + 1] - 8, y);
  s += stages.map((st, i) => dot(xs[i], y, 8, i === 3 ? G : A) + tx(xs[i], y + 22, st, 7, INK, 'middle')).join('');
  s += `<path d="M290 68 q 8 40 -120 40 q -128 0 -120 -40" fill="none" stroke="${LINE}" stroke-width="1" stroke-dasharray="3 3"/>`;
  s += tx(170, 116, 'full-duplex loop', 7, DIM, 'middle');
  s += tx(290, 44, '✓ gate', 7, G, 'middle') + tx(170, 20, 'realtime voice · confirm before acting', 8, DIM, 'middle');
  return s;
}
