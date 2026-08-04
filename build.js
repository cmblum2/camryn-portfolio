// Prerender build: warehouse.js (single source of truth) -> fully-populated index.html.
// Makes the entire story visible in the static HTML for AI scanners / no-JS crawlers and for
// a few-minute human skim. app.js still enhances the same DOM with the interactive query layer.
// Run: node build.js   (or: npm run build)
import { readFile, writeFile } from 'node:fs/promises';
import * as wh from './src/warehouse.js';
import { buildGraph } from './src/graph.js';
import { renderViz } from './src/viz.js';

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const byId = Object.fromEntries(wh.entries.map(e => [e.id, e]));

// count of tools built ON the production warehouse (excludes the warehouse node itself)
const builtOnCount = wh.entries.filter(e => (e.root || '') === 'warehouse' && e.id !== 'warehouse').length;

// ---------- HEAD: JSON-LD + Open Graph ----------
const projectsForLd = wh.entries
  .filter(e => !['stack', 'deploy'].includes(e.id))
  .map(e => ({ '@type': 'CreativeWork', name: e.headline, abstract: e.mlabel, description: e.narrative }));

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Camryn Blum',
    jobTitle: 'Data & AI Intern',
    email: 'mailto:' + wh.links.email,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Wisconsin–Madison' },
    worksFor: { '@type': 'Organization', name: 'FHI Heat' },
    knowsAbout: ['data warehousing', 'data integration', 'ETL / ELT', 'dimensional modeling', 'SQL', 'Python',
      'Shopify', 'Amazon Seller Central', 'Amazon Vendor Central', 'Amazon Ads', 'TikTok Shop', 'TikTok Ads',
      'SAP', 'ShipStation', 'Attentive', 'Euka', 'LangGraph', 'RAG', 'RAGAS', 'dbt', 'BigQuery', 'Power BI',
      'DAX', 'machine learning', 'web scraping', 'causal inference', 'out-of-sample backtesting', 'BI dashboards', 'n8n', 'Next.js'],
    description: "Built FHI Heat's multi-platform data warehouse from scratch — unifying ~10 systems across the "
      + "US & EU (Shopify, TikTok Shop & Ads, Amazon Seller/Vendor Central & Ads, SAP, ShipStation, Attentive, Euka) "
      + "into one conformed SQL schema — then built most of the tools that ran on top of it: a creator-discovery "
      + "ML system, an ad-spend decision engine with out-of-sample backtesting, an n8n alerting workflow, and an "
      + "executive BI dashboard.",
    sameAs: [wh.links.github].filter(u => u && u !== '#'),
    hasPart: projectsForLd,
  },
};
const headHtml = `<meta property="og:title" content="Camryn Blum — I built FHI Heat's data warehouse from scratch">
<meta property="og:description" content="Built FHI Heat's data warehouse from scratch, then the ML & BI tools the company ran on it. CS + Data Science, UW–Madison.">
<meta property="og:type" content="profile">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

// ---------- Hero thesis (lede paragraph + stat strip; sits inside the hero) ----------
const thesisHtml = `<p class="lede">~10 siloed systems across the US &amp; EU — Shopify, TikTok Shop &amp; Ads,
  Amazon (Seller, Vendor, Ads), SAP, ShipStation, Attentive, Euka — unified into one SQL source of truth
  with nightly ingestion. On that foundation I built an ML creator-discovery system, an ad-spend decision
  engine (100% out-of-sample accuracy), an n8n automation, and the executive dashboard leadership ran on.</p>
  <div class="tldr-stats">
    <div><b>1</b><span>data warehouse, built from scratch</span></div>
    <div><b>10+</b><span>systems unified (US &amp; EU)</span></div>
    <div><b>${builtOnCount}</b><span>tools I built on top of it</span></div>
    <div><b>100%</b><span>out-of-sample decision accuracy</span></div>
  </div>`;

const navLinksHtml = `<a href="${esc(wh.links.github)}" target="_blank" rel="noopener">GitHub</a>`
  + `<a href="${esc(wh.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`
  + `<a href="${esc(wh.links.resume)}" target="_blank" rel="noopener">Résumé</a>`
  + `<a href="mailto:${esc(wh.links.email)}">Email</a>`;

// ---------- Dossier (all entries, always visible) ----------
function article(e) {
  const lineage = (e.lineage || []).map(esc).join(' <span class="arw">→</span> ');
  const links = (e.links && e.links.length)
    ? `<div class="dz-l2">${e.links.map(l => `<a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])} →</a>`).join('')}</div>`
    : '';
  const tech = (e.tech && e.tech.length)
    ? `<div class="dz-tk"><div class="dz-tkh">How it works</div><ul>${e.tech.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`
    : '';
  const viz = renderViz(e);
  return `<article class="dz${viz ? ' has-viz' : ''}">
    ${viz ? `<div class="dz-viz">${viz}</div>` : ''}
    <div class="dz-body">
      <div class="dz-h"><h3>${esc(e.headline)}</h3><span class="dz-m">${esc(e.metric)}</span></div>
      <div class="dz-sub">${esc(e.mlabel)}</div>
      <p class="dz-n">${esc(e.narrative)}</p>
      ${tech}
      <div class="dz-l">${lineage}</div>
      ${links}
    </div>
  </article>`;
}
function group(title, ids, note) {
  const arts = ids.map(id => byId[id]).filter(Boolean).map(article).join('');
  if (!arts) return '';
  return `<div class="dz-group"><div class="dz-gh">${esc(title)}${note ? ` <span class="dz-note">${esc(note)}</span>` : ''}</div>${arts}</div>`;
}
const dossierHtml = [
  group('The foundation — built from scratch', ['warehouse']),
  ...wh.graphGroups.map(g => group(g.label, g.ids, g.dashed ? '(synthetic rebuilds, public)' : '')),
  group('Another domain (separate from the warehouse)', wh.beyondIds, '(SteMy — a research lab)'),
  group('Live & tooling', ['deploy']),
].join('\n');

// ---------- Skills / stack (prerendered) ----------
const stackHtml = `<div class="stackgrid">${wh.stack.map(col =>
  `<div class="scol"><h4>${esc(col.group)}</h4>${col.items.map(i => `<div>${esc(i)}</div>`).join('')}</div>`).join('')}</div>`;

const l = wh.links;
const footHtml = `<a href="${esc(l.github)}" target="_blank" rel="noopener">GitHub</a>
  <a href="${esc(l.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
  <a href="${esc(l.resume)}" target="_blank" rel="noopener">Résumé ↓</a>
  <a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`;

const graphHtml = buildGraph(wh.entries, { sources: wh.sources, groups: wh.graphGroups, beyond: wh.beyondIds });

// ---------- Assemble ----------
let html = await readFile(new URL('./template.html', import.meta.url), 'utf8');
html = html
  .replace('<!--BUILD:HEAD-->', headHtml)
  .replace('<!--BUILD:NAVLINKS-->', navLinksHtml)
  .replace('<!--BUILD:THESIS-->', thesisHtml)
  .replace('<!--BUILD:GRAPH-->', graphHtml)
  .replace('<!--BUILD:DOSSIER-->', dossierHtml)
  .replace('<!--BUILD:STACK-->', stackHtml)
  .replace('<!--BUILD:FOOTLINKS-->', footHtml);

await writeFile(new URL('./index.html', import.meta.url), html, 'utf8');
console.log('build: index.html generated (' + wh.entries.length + ' entries, ' + builtOnCount + ' built-on-warehouse tools)');
