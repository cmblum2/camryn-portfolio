// Screenshot-style UI mockups — one per project. Monochrome, on-brand, §8-SAFE:
// synthetic data only (no real FHI numbers / handles / system names), inline SVG (scanner-readable).
const INK = '#141414', G1 = '#4a4a4a', G2 = '#8a8a8a', G3 = '#bcbcbc', G4 = '#e2e2e2', LINE = '#e6e6e6', PANEL = '#f6f6f6';
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const M = (s) => `font-family="'JetBrains Mono',monospace" font-size="${s}"`;
const tx = (x, y, s, size, fill, anchor, w) => `<text x="${x}" y="${y}" ${M(size || 7)} fill="${fill || G2}"${w ? ` font-weight="${w}"` : ''} text-anchor="${anchor || 'start'}">${esc(s)}</text>`;
const box = (x, y, w, h, stroke, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r ?? 2}" fill="none" stroke="${stroke || LINE}"/>`;
const sol = (x, y, w, h, c, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r ?? 1}" fill="${c}"/>`;
const ln = (x1, y1, x2, y2, c, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c || LINE}" stroke-width="1"${dash ? ' stroke-dasharray="2.5 2.5"' : ''}/>`;

// window chrome + card frame
function shell(title, inner, label) {
  return `<svg viewBox="0 0 360 240" width="100%" style="display:block" role="img" aria-label="${esc(label || title)}">`
    + `<rect x="6" y="9" width="348" height="227" rx="8" fill="#000" opacity="0.05"/>`
    + `<rect x="2.5" y="2.5" width="351" height="229" rx="8" fill="#fff" stroke="#d7d7d7"/>`
    + `<rect x="3" y="3" width="349.5" height="22" fill="#fafafa"/>` + ln(3, 25, 352.5, 25, '#e8e8e8')
    + `<circle cx="15" cy="14" r="2.3" fill="none" stroke="#c6c6c6"/><circle cx="24" cy="14" r="2.3" fill="none" stroke="#c6c6c6"/><circle cx="33" cy="14" r="2.3" fill="none" stroke="#c6c6c6"/>`
    + tx(46, 16.5, title, 7, '#5c5c5c')
    + inner + `</svg>`;
}
const badge = (x, y, t, solid) => solid
  ? sol(x, y - 8, t.length * 4.6 + 10, 12, INK, 2) + tx(x + 5, y, t, 6.5, '#fff', 'start', 600)
  : box(x, y - 8, t.length * 4.6 + 10, 12, INK, 2) + tx(x + 5, y, t, 6.5, INK, 'start', 600);
// mini bar chart
function barChart(x, y, w, h, vals, hi) {
  const max = Math.max(...vals), bw = w / vals.length;
  let s = ln(x, y + h, x + w, y + h, G4);
  vals.forEach((v, i) => {
    const bh = Math.round((v / max) * (h - 4)), bx = x + i * bw + bw * 0.22, ww = bw * 0.56;
    s += (i === hi ? sol(bx, y + h - bh, ww, bh, INK) : sol(bx, y + h - bh, ww, bh, G3));
  });
  return s;
}

export function renderViz(e) {
  const map = {
    fanin: [warehouse, 'Warehouse ETL — ~15 sources unified into one schema', 'WAREHOUSE · ETL'],
    reconcile: [audit, 'Reconciliation report — shipping vs ledger, 0.5% variance', 'RECONCILIATION'],
    bars: [fbt, 'Build-vs-buy analysis — recommend against', 'BUILD-VS-BUY'],
    funnel: [discovery, 'Creator discovery — ranked prospects with buy-intent', 'CREATOR DISCOVERY'],
    curve: [backtest, 'Out-of-sample backtest — 100% accuracy', 'BACKTEST'],
    breakeven: [engine, 'Ad-spend decision engine — scale/cut verdicts, backtested', 'DECISION ENGINE'],
    dag: [dbt, 'dbt lineage — raw to staging to marts, tests passing', 'DBT DOCS · LINEAGE'],
    tiles: [dashboard, 'Executive BI dashboard — KPIs, anomaly flagged, actions', 'EXECUTIVE BI'],
    'flow-n8n': [n8n, 'n8n ops-alert workflow canvas', 'N8N · OPS ALERTS'],
    'flow-nl2sql': [nl2sql, 'NL to SQL agent — query console with guardrail', 'NL→SQL AGENT'],
    'flow-voice': [voice, 'Voice AI — transcript with confirmation gate', 'STEMY · VOICE'],
  };
  const v = e.viz && map[e.viz];
  return v ? shell(v[2], v[0](), v[1]) : '';
}

/* ---- WAREHOUSE: sources sidebar → schema tables ---- */
function warehouse() {
  let s = tx(12, 38, 'SOURCES', 6.5, G2, 'start', 600);
  const src = ['shopify', 'amazon', 'tiktok', 'meta ads', 'google', 'sap b1'];
  src.forEach((n, i) => { const y = 46 + i * 15; s += box(12, y, 96, 12) + sol(17, y + 4, 4, 4, i < 5 ? INK : G3) + tx(26, y + 8.5, n, 6.5, G1) + tx(101, y + 8.5, '✓', 6.5, INK, 'end'); });
  s += ln(108, 82, 150, 82, G3) + sol(150, 66, 60, 32, PANEL, 3) + box(150, 66, 60, 32, G3, 3) + tx(180, 79, 'WAREHOUSE', 6.5, INK, 'middle', 600) + tx(180, 90, 'raw→stg→marts', 5.5, G2, 'middle');
  s += ln(210, 82, 236, 60, G3) + ln(210, 82, 236, 104, G3);
  s += sol(236, 46, 104, 30, '#fff', 2) + box(236, 46, 104, 30, LINE) + tx(242, 56, 'fact_orders', 6.5, INK) + ln(242, 60, 334, 60, LINE) + tx(242, 68, 'sku · spend · ship', 5.5, G2);
  s += sol(236, 84, 104, 30, '#fff', 2) + box(236, 84, 104, 30, LINE) + tx(242, 94, 'dim_product', 6.5, INK) + ln(242, 98, 334, 98, LINE) + tx(242, 106, 'sku · channel · date', 5.5, G2);
  s += ln(12, 128, 348, 128, LINE) + tx(12, 141, 'NIGHTLY PYTHON ETL', 6, G2, 'start', 600) + tx(348, 141, '~15 SOURCES → 1', 6, INK, 'end', 600);
  for (let i = 0; i < 4; i++) { const y = 158 + i * 14; s += ln(12, y, 348, y, G4) + sol(12, y + 4, 40, 3, G4) + sol(60, y + 4, 90, 3, G4) + sol(160, y + 4, 40, 3, G4) + sol(220, y + 4, 60, 3, G4); }
  return s;
}

/* ---- AUDIT: reconciliation report table ---- */
function audit() {
  let s = tx(12, 40, 'RECONCILIATION', 7, INK, 'start', 600) + badge(258, 41, 'MATCHED', 1);
  s += tx(16, 56, 'CARRIER', 6, G2, 'start', 600) + tx(150, 56, 'SHIPPING', 6, G2, 'end', 600) + tx(250, 56, 'LEDGER', 6, G2, 'end', 600) + tx(344, 56, 'Δ', 6, G2, 'end', 600);
  s += ln(12, 60, 348, 60, G4);
  const rows = [[92, 90], [66, 66], [78, 77], [54, 55]];
  rows.forEach((r, i) => {
    const y = 72 + i * 20;
    s += tx(16, y + 4, 'wallet ' + (i + 1), 6.5, G1);
    s += sol(150 - r[0], y, r[0], 6, G3) + sol(250 - r[1], y, r[1], 6, INK);
    s += tx(344, y + 4.5, '✓', 6.5, INK, 'end') + ln(12, y + 12, 348, y + 12, G4);
  });
  s += sol(12, 166, 336, 28, PANEL, 3) + box(12, 166, 336, 28, G4, 3);
  s += tx(22, 178, '570K+ records reconciled line-by-line', 6.5, G1);
  s += tx(22, 188, 'to ≈0.5% variance — a bookkeeping mis-class, not missing money', 5.8, G2);
  return s;
}

/* ---- FBT: build-vs-buy bar report ---- */
function fbt() {
  let s = tx(12, 40, 'PER-SKU COST — BUILD VS BUY', 7, INK, 'start', 600);
  const base = 150;
  s += ln(40, base, 320, base, G4) + ln(40, 60, 40, base, G4) + tx(40, 56, 'cost / order', 5.5, G2);
  s += sol(90, base - 44, 44, 44, G3) + tx(112, base + 12, 'IN-HOUSE', 6, G1, 'middle');
  s += sol(200, base - 78, 44, 78, INK) + tx(222, base + 12, 'FBT', 6, INK, 'middle');
  s += box(272, 66, 66, 30, INK, 2) + tx(305, 78, 'VERDICT', 5.5, G2, 'middle') + tx(305, 89, 'DO NOT ADOPT', 6, INK, 'middle', 600);
  s += tx(12, 178, '~11.6K orders priced individually; FBT wins on only ~16%', 6, G2);
  s += tx(12, 190, 'delivery-speed natural experiment → no traffic lift', 6, G2);
  return s;
}

/* ---- DISCOVERY: ranked creator list ---- */
function discovery() {
  let s = tx(12, 40, 'CREATOR DISCOVERY', 7, INK, 'start', 600) + badge(268, 41, 'BUY-INTENT', 0);
  s += tx(16, 56, '#', 6, G2, 'start', 600) + tx(34, 56, 'CREATOR', 6, G2, 'start', 600) + tx(210, 56, 'SCORE', 6, G2, 'start', 600) + tx(344, 56, 'INTENT', 6, G2, 'end', 600);
  s += ln(12, 60, 348, 60, G4);
  const sc = [58, 46, 40, 33, 27, 20];
  sc.forEach((w, i) => {
    const y = 70 + i * 18, top = i === 0;
    s += tx(18, y + 8, String(i + 1), 6.5, top ? INK : G2, 'start', 600);
    s += `<circle cx="40" cy="${y + 5}" r="4.5" fill="none" stroke="${top ? INK : G3}"/>`;
    s += sol(52, y + 2, 44, 6, top ? INK : G4, 3);
    s += sol(210, y + 1, w * 1.6, 7, top ? INK : G3, 1) + tx(300, y + 7, (0.9 - i * 0.11).toFixed(2), 6, G2, 'start');
    s += tx(344, y + 7, top ? 'HIGH' : (i < 3 ? 'MED' : 'LOW'), 6, top ? INK : G3, 'end', top ? 600 : 400);
    s += ln(12, y + 13, 348, y + 13, G4);
  });
  s += tx(12, 192, 'anti-bot CDP scrape → transparent intent lexicon → rank', 6, G2);
  return s;
}

/* ---- BACKTEST: OOS accuracy curve ---- */
function backtest() {
  let s = tx(12, 40, 'OUT-OF-SAMPLE BACKTEST', 7, INK, 'start', 600) + badge(268, 41, '100% OOS', 1);
  s += ln(30, 150, 336, 150, G4) + ln(30, 54, 30, 150, G4);
  const pts = [[30, 140], [96, 118], [160, 92], [224, 72], [300, 50], [336, 44]];
  const ps = pts.map(p => p.join(',')).join(' ');
  s += `<polygon points="30,150 ${ps} 336,150" fill="rgba(0,0,0,0.05)"/>`;
  s += `<polyline points="${ps}" fill="none" stroke="${INK}" stroke-width="2"/>`;
  pts.slice(0, 5).forEach(p => s += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${INK}"/>`);
  s += tx(30, 168, 'CUT-1', 5.5, G2, 'middle') + tx(160, 168, 'CUT-3', 5.5, G2, 'middle') + tx(300, 168, 'CUT-4', 5.5, G2, 'middle');
  s += tx(12, 188, 'every verdict recomputed from pre-cutoff data — no look-ahead', 6, G2);
  return s;
}

/* ---- ENGINE: decision queue (campaigns → scale/cut) ---- */
function engine() {
  let s = tx(12, 40, 'CAMPAIGN DECISIONS', 7, INK, 'start', 600) + badge(268, 41, '100% OOS', 1);
  s += tx(16, 56, 'CAMPAIGN', 6, G2, 'start', 600) + tx(150, 56, 'ROAS', 6, G2, 'start', 600) + tx(344, 56, 'CALL', 6, G2, 'end', 600);
  s += ln(12, 60, 348, 60, G4);
  const rows = [['gmv-max a', 62, 'SCALE'], ['gmv-max b', 40, 'TUNE'], ['spark set', 22, 'CUT'], ['live cat', 50, 'SCALE'], ['auto promo', 18, 'CUT']];
  rows.forEach((r, i) => {
    const y = 70 + i * 20;
    s += sol(16, y, 44, 6, G4, 3);
    s += ln(150, y - 2, 150, y + 8, G3) + sol(150, y, r[1] * 1.3, 6, r[2] === 'CUT' ? G3 : INK, 1);
    s += `<line x1="205" y1="${y - 3}" x2="205" y2="${y + 9}" stroke="${INK}" stroke-dasharray="2 2"/>`;
    s += badge(298, y + 6, r[2], r[2] === 'SCALE');
    s += ln(12, y + 13, 348, y + 13, G4);
  });
  s += tx(150, 176, 'break-even', 5, INK, 'middle');
  s += tx(12, 192, 'ROAS vs margin break-even · self-scores its own calls (DiD)', 6, G2);
  return s;
}

/* ---- DBT: lineage docs viewer ---- */
function dbt() {
  let s = sol(3, 26, 74, 205, '#fafafa') + ln(77, 26, 77, 231, LINE);
  s += tx(11, 40, 'MODELS', 6, G2, 'start', 600);
  ['stg_orders', 'stg_lines', 'dim_product', 'fct_daily', 'fct_channel'].forEach((n, i) => { const y = 52 + i * 15; s += (i === 3 ? sol(8, y - 8, 62, 11, PANEL, 2) : '') + tx(15, y, n, 5.8, i === 3 ? INK : G1); });
  s += tx(92, 40, 'LINEAGE', 6, G2, 'start', 600) + badge(276, 41, '22/22 TESTS ✓', 0);
  s += ln(112, 96, 168, 76, G3) + ln(112, 96, 168, 116, G3) + ln(192, 76, 268, 76, G3) + ln(192, 116, 268, 116, G3) + ln(180, 116, 268, 76, G3);
  const node = (x, y, t) => sol(x - 22, y - 9, 44, 18, '#fff') + box(x - 22, y - 9, 44, 18, G3, 2) + tx(x, y + 2.5, t, 5.5, INK, 'middle');
  s += node(100, 96, 'raw') + node(180, 76, 'staging') + node(180, 116, 'staging') + node(280, 76, 'mart') + node(280, 116, 'mart');
  s += tx(92, 152, 'not_null · unique · relationships · accepted_values', 5.8, G2);
  s += tx(92, 166, 'dbt-bigquery · CI on every push', 5.8, G2);
  return s;
}

/* ---- DASHBOARD: exec BI ---- */
function dashboard() {
  let s = tx(12, 40, 'EXECUTIVE OVERVIEW', 7, INK, 'start', 600) + tx(344, 40, 'BY CHANNEL ▾', 6, G2, 'end');
  const tiles = ['REVENUE', 'MARGIN', 'AOV', 'AD SPEND'];
  tiles.forEach((t, i) => { const x = 12 + i * 84; s += sol(x, 50, 78, 34, PANEL, 3) + box(x, 50, 78, 34, G4, 3) + tx(x + 8, 62, t, 5.5, G2, 'start', 600) + sol(x + 8, 68, 40, 8, INK) + tx(x + 60, 76, '↑', 7, INK, 'middle'); });
  s += barChart(16, 100, 200, 56, [30, 38, 96, 34, 26, 30, 22], 2);
  s += box(66, 94, 34, 12, INK, 2) + tx(83, 103, '⚠ FLAG', 5.5, INK, 'middle', 600);
  s += sol(232, 100, 116, 56, '#fff') + box(232, 100, 116, 56, G4, 3) + tx(240, 112, 'ACTIONS', 6, INK, 'start', 600);
  ['cut · burner set', 'scale · winner', 'watch · stockout'].forEach((a, i) => { const y = 124 + i * 11; s += `<circle cx="242" cy="${y - 2}" r="1.8" fill="${INK}"/>` + tx(248, y, a, 5.6, G1); });
  s += tx(12, 178, 'reframed display → decision · caught a data-quality bug', 6, G2);
  return s;
}

/* ---- N8N: workflow canvas ---- */
function n8n() {
  let s = '';
  for (let gx = 12; gx < 348; gx += 16) for (let gy = 36; gy < 200; gy += 16) s += `<circle cx="${gx}" cy="${gy}" r="0.6" fill="#e0e0e0"/>`;
  const nd = (x, y, t) => sol(x, y, 58, 26, '#fff', 3) + box(x, y, 58, 26, G3, 3) + sol(x + 8, y + 9, 8, 8, INK, 2) + tx(x + 22, y + 15, t, 6, INK);
  s += ln(70, 65, 96, 65, G2) + ln(154, 65, 180, 65, G2) + ln(238, 65, 264, 65, G2);
  s += nd(12, 52, 'sched') + nd(96, 52, 'fetch') + nd(180, 52, 'diff') + nd(264, 52, 'alert');
  s += `<line x1="209" y1="78" x2="209" y2="120" stroke="${G3}" stroke-dasharray="2.5 2.5"/>`;
  s += nd(180, 120, 'stop') + tx(214, 116, 'no change', 5.5, G2);
  s += tx(12, 162, 'schedule → fetch → diff vs last run → alert only on change', 6, G2);
  s += tx(12, 176, 'error-handler branch · webhook from env var', 6, G2);
  s += tx(340, 44, 'daily 08:00', 5.5, G3, 'end');
  return s;
}

/* ---- NL2SQL: query console ---- */
function nl2sql() {
  let s = tx(12, 40, 'ASK YOUR WAREHOUSE', 7, INK, 'start', 600) + badge(276, 41, 'READ-ONLY', 0);
  s += sol(12, 50, 336, 18, PANEL, 3) + box(12, 50, 336, 18, G4, 3) + tx(20, 62, '›', 8, INK) + tx(30, 62, 'revenue by channel last 30 days', 6.5, G1);
  s += sol(12, 74, 336, 46, '#fff') + box(12, 74, 336, 46, G4, 3);
  ['SELECT channel, SUM(revenue)', 'FROM marts.fct_daily', 'WHERE date > … GROUP BY 1', 'LIMIT 100  -- forced'].forEach((c, i) => s += tx(20, 86 + i * 10, c, 6, i === 3 ? G2 : G1));
  s += tx(12, 136, 'RESULT', 5.5, G2, 'start', 600) + barChart(12, 142, 160, 40, [40, 62, 30, 22], 1);
  s += sol(190, 142, 158, 40, '#fff') + box(190, 142, 158, 40, INK, 3) + tx(198, 154, '⛔ "delete all orders"', 6, INK, 'start', 600) + tx(198, 166, 'blocked — read-only guard', 5.6, G2) + tx(198, 176, 'role-scoped views', 5.6, G2);
  return s;
}

/* ---- VOICE: transcript + confirm gate ---- */
function voice() {
  let s = tx(12, 40, 'STEMY — HANDS-FREE', 7, INK, 'start', 600) + badge(292, 41, '● LIVE', 0);
  const wf = [6, 12, 20, 30, 22, 34, 16, 26, 12, 20, 8, 14];
  wf.forEach((h, i) => { const x = 16 + i * 9; s += sol(x, 66 - h / 2, 3, h, i % 3 === 0 ? INK : G3, 1); });
  s += tx(130, 62, 'listening…', 6.5, G2);
  s += sol(12, 84, 200, 20, PANEL, 4) + box(12, 84, 200, 20, G4, 4) + tx(20, 97, '“log day 3 · replicate 2 · 4.2 mV”', 6, G1);
  s += sol(148, 110, 200, 20, '#fff', 4) + box(148, 110, 200, 20, G3, 4) + tx(156, 123, 'open Day 3, replicate 2 ✓', 6, INK);
  s += sol(12, 140, 336, 44, '#fff') + box(12, 140, 336, 44, INK, 3);
  s += tx(22, 153, 'CONFIRM BEFORE WRITING', 6, INK, 'start', 600) + tx(22, 165, 'set O₂ = 5% on Day 3, replicate 2 — say yes?', 6, G1);
  s += badge(22, 180, 'YES', 1) + badge(52, 180, 'NO', 0);
  s += tx(200, 177, 'realtime · webrtc ~700ms', 5.6, G3);
  return s;
}
