import * as wh from './warehouse.js';
import { renderStack } from './render.js';
import { loadStatus, renderStatus } from './status.js?v=18';

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Role lens: dim the work cards that don't carry the selected lens ('all' clears it).
function setLens(lens) {
  document.querySelectorAll('#lens button').forEach(b => b.classList.toggle('on', b.dataset.lens === lens));
  document.querySelectorAll('#work details.dz-more[open]').forEach(d => { d.open = false; }); // reset expanded cards
  let shown = 0;
  document.querySelectorAll('#work article.dz').forEach(a => {
    const ls = (a.dataset.lenses || '').split(' ').filter(Boolean);
    const match = lens === 'all' || ls.includes(lens);
    a.classList.toggle('is-hidden', !match);
    if (match) shown++;
  });
  // hide any discipline group whose cards are all filtered out
  document.querySelectorAll('#work .dz-group').forEach(g => {
    const anyVisible = [...g.querySelectorAll('article.dz')].some(a => !a.classList.contains('is-hidden'));
    g.classList.toggle('is-hidden', !anyVisible);
  });
  const cnt = document.getElementById('lenscount');
  if (cnt) cnt.textContent = lens === 'all' ? '' : `${shown} ${lens} project${shown === 1 ? '' : 's'}`;
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
  // Graph is prerendered by build.js; just wire node clicks onto it (no re-render → cache-proof).
  const graphEl = document.getElementById('graph');
  if (graphEl) graphEl.addEventListener('click', e => {
    const g = e.target.closest('.gnode');
    if (g) jumpToCard(g.dataset.id);
  });

  const lens = document.getElementById('lens');
  if (lens) lens.addEventListener('click', e => {
    const b = e.target.closest('button[data-lens]');
    if (b) setLens(b.dataset.lens);
  });

  // Accordion: only one project dropdown open at a time; focus the card you open.
  const smooth = matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'auto';
  document.querySelectorAll('#work details.dz-more').forEach(d => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      document.querySelectorAll('#work details.dz-more[open]').forEach(o => { if (o !== d) o.open = false; });
      const card = d.closest('.dz');
      if (card) card.scrollIntoView({ behavior: smooth, block: 'start' });
    });
  });

  // Motion extras (JS-only so no-JS crawlers see full content; reduced-motion-safe).
  if (matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
    const graphEl = document.getElementById('graph');
    if (graphEl) graphEl.classList.add('anim');           // pre-hide graph parts for the self-draw
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.id === 'system' && graphEl) graphEl.classList.add('draw');  // signature: draw the lineage graph
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    document.querySelectorAll('.exp, #skills, #system, #work .dz-group, footer').forEach(t => {
      t.classList.add('reveal'); io.observe(t);
    });
    // count-up the hero stat numerals (1 / 15+ / 6 / 100%)
    document.querySelectorAll('.tldr-stats b').forEach(el => {
      const m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      const target = parseInt(m[1], 10), suffix = m[2];
      el.textContent = '0' + suffix;
      setTimeout(() => {
        const t0 = performance.now(), dur = 1100;
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(e * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, 720);
    });
  }

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
