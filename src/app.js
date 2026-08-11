import * as wh from './warehouse.js';
import { renderStack } from './render.js';
import { buildGraph } from './graph.js';
import { loadStatus, renderStatus } from './status.js';

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Role lens: dim the work cards that don't carry the selected lens ('all' clears it).
function setLens(lens) {
  document.querySelectorAll('#lens button').forEach(b => b.classList.toggle('on', b.dataset.lens === lens));
  document.querySelectorAll('#work article.dz').forEach(a => {
    const ls = (a.dataset.lenses || '').split(' ').filter(Boolean);
    a.classList.toggle('dim', lens !== 'all' && !ls.includes(lens));
  });
}

// Graph node → jump to that project's card, expand it, and flash it.
function jumpToCard(id) {
  const card = document.querySelector(`#work article[data-eid="${window.CSS && CSS.escape ? CSS.escape(id) : id}"]`);
  if (!card) return;
  const det = card.querySelector('details.dz-more');
  if (det) det.open = true;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('flash');
  setTimeout(() => card.classList.remove('flash'), 1300);
}

function init() {
  document.getElementById('graph').innerHTML = buildGraph(wh.entries, { sources: wh.sources, groups: wh.graphGroups, beyond: wh.beyondIds });
  document.getElementById('graph').addEventListener('click', e => {
    const g = e.target.closest('.gnode');
    if (g) jumpToCard(g.dataset.id);
  });

  const lens = document.getElementById('lens');
  if (lens) lens.addEventListener('click', e => {
    const b = e.target.closest('button[data-lens]');
    if (b) setLens(b.dataset.lens);
  });

  document.getElementById('stack').innerHTML = renderStack(wh.stack);
  const l = wh.links;
  document.getElementById('footlinks').innerHTML =
    `<a href="${esc(l.github)}" target="_blank" rel="noopener">GitHub</a>
     <a href="${esc(l.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
     <a href="${esc(l.resume)}" target="_blank" rel="noopener">Résumé ↓</a>
     <a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`;

  loadStatus((u) => fetch(u, { cache: 'no-store' })).then(systems => {
    document.getElementById('sys').innerHTML = renderStatus(systems);
  });
}
document.addEventListener('DOMContentLoaded', init);
