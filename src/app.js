import * as data from './data.js';
import { renderHero, renderProjects, renderCaseStudies, renderStack } from './render.js';

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function renderDemos() {
  return data.demos.map(d => `
    <div class="demo">
      ${d.live ? '<span class="badge">LIVE</span>' : ''}
      <h3>${esc(d.title)}</h3>
      <p>${esc(d.blurb)}</p>
      <a class="lk" href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.url)} →</a>
    </div>`).join('');
}

function renderLinks() {
  const l = data.links;
  return `
    <a href="${esc(l.github)}" target="_blank" rel="noopener">GitHub</a>
    <a href="${esc(l.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
    <a href="${esc(l.resume)}" target="_blank" rel="noopener">Résumé ↓</a>
    <a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`;
}

function isValidLens(x) { return data.LENSES.includes(x); }

function renderLens(lens) {
  document.getElementById('hero').innerHTML = renderHero(data.profile, data.metrics, lens);
  document.getElementById('cases').innerHTML = renderCaseStudies(data.caseStudies, lens);
  document.getElementById('projects').innerHTML = renderProjects(data.projects, lens);
  document.querySelectorAll('#lens button').forEach(b =>
    b.classList.toggle('on', b.dataset.lens === lens));
  history.replaceState(null, '', '#' + lens);
}

function init() {
  // static (lens-independent) sections
  document.getElementById('demo-cards').innerHTML = renderDemos();
  document.getElementById('stack').innerHTML = renderStack(data.stack);
  document.getElementById('links').innerHTML = renderLinks();

  // initial lens from URL hash, else default AI
  const fromHash = location.hash.replace('#', '');
  const initial = isValidLens(fromHash) ? fromHash : 'AI';
  renderLens(initial);

  document.getElementById('lens').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-lens]');
    if (btn) renderLens(btn.dataset.lens);
  });
}

document.addEventListener('DOMContentLoaded', init);
