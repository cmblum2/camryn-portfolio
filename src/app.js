import * as wh from './warehouse.js';
import { route, plan } from './engine.js';
import { renderAnswer, renderStack, renderCaseStudies } from './render.js';
import { buildGraph } from './graph.js';
import { loadStatus, renderStatus } from './status.js';
import { orderForLens } from './lens.js';

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let currentLens = 'AI';
let timer = null;

const QUESTION = {
  sell: 'how did you help sell a company?',
  engine: 'prove your AI made the right calls',
  dashboard: 'what did the exec dashboard do?',
  nl2sql: 'what is the NL→SQL agent?',
  dbt: 'show me the dbt / BigQuery project',
  voice: 'tell me about the voice AI agent',
  warehouse: 'show me the data warehouse',
  stack: "what's your stack?",
  deploy: 'what have you deployed?',
};
function firstQuestion(e) { return QUESTION[e.id] || e.headline; }

function renderChips() {
  const ordered = orderForLens(wh.entries, currentLens);
  document.getElementById('chips').innerHTML = ordered.map(e =>
    `<span class="chip" data-id="${e.id}">${esc(firstQuestion(e))}</span>`).join('');
}

function fire(id) {
  const entry = wh.entries.find(e => e.id === id) || route(id, wh.entries);
  const out = document.getElementById('out');
  clearTimeout(timer);
  out.innerHTML = renderAnswer(entry, plan(entry));
  const el = out.querySelector('.narr');
  const full = entry.narrative; let j = 0; el.textContent = '';
  (function typeNarr() { if (j <= full.length) { el.textContent = full.slice(0, j); j += 2; timer = setTimeout(typeNarr, 10); } })();
}

function runQuery() {
  const v = document.getElementById('q').value.trim();
  if (!v) return;
  fire(route(v, wh.entries).id);
}

function setLens(lens) {
  currentLens = lens;
  document.querySelectorAll('#lens button').forEach(b => b.classList.toggle('on', b.dataset.lens === lens));
  renderChips();
}

async function init() {
  renderChips();
  document.getElementById('chips').addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (c) { document.getElementById('q').value = firstQuestion(wh.entries.find(x => x.id === c.dataset.id)); fire(c.dataset.id); }
  });
  document.getElementById('go').addEventListener('click', runQuery);
  document.getElementById('q').addEventListener('keydown', e => { if (e.key === 'Enter') runQuery(); });
  document.getElementById('lens').addEventListener('click', e => { const b = e.target.closest('button[data-lens]'); if (b) setLens(b.dataset.lens); });

  document.getElementById('graph').innerHTML = buildGraph(wh.entries, { sources: wh.sources, groups: wh.graphGroups, beyond: wh.beyondIds });
  document.getElementById('graph').addEventListener('click', e => {
    const g = e.target.closest('.gnode');
    if (g) { fire(g.dataset.id); document.getElementById('out').scrollIntoView({ behavior: 'smooth' }); }
  });

  document.getElementById('cases').innerHTML = renderCaseStudies(wh.caseStudies, currentLens);
  document.getElementById('stack').innerHTML = renderStack(wh.stack);
  const l = wh.links;
  document.getElementById('footlinks').innerHTML =
    `<a href="${esc(l.github)}" target="_blank" rel="noopener">GitHub</a>
     <a href="${esc(l.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
     <a href="${esc(l.resume)}" target="_blank" rel="noopener">Résumé ↓</a>
     <a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`;

  const systems = await loadStatus((u) => fetch(u, { cache: 'no-store' }));
  document.getElementById('sys').innerHTML = renderStatus(systems);

  setTimeout(() => fire('sell'), 450);
}
document.addEventListener('DOMContentLoaded', init);
