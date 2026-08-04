// Prerender build: warehouse.js (single source of truth) -> fully-populated index.html.
// Makes the entire story visible in the static HTML for AI scanners / no-JS crawlers and for
// a few-minute human skim. app.js still enhances the same DOM with the interactive query layer.
// Run: node build.js   (or: npm run build)
import { readFile, writeFile } from 'node:fs/promises';
import * as wh from './src/warehouse.js';
import { buildGraph } from './src/graph.js';

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
    knowsAbout: ['data warehousing', 'SQL', 'Python', 'ETL', 'LangGraph', 'RAG', 'RAGAS', 'dbt',
      'BigQuery', 'Power BI', 'DAX', 'machine learning', 'web scraping', 'causal inference',
      'out-of-sample backtesting', 'BI dashboards', 'n8n', 'Next.js'],
    description: "Built FHI Heat's multi-platform data warehouse from scratch (ERP, Amazon, TikTok Shop, "
      + "Shopify, shipping unified into one SQL source of truth), then built the ML and BI tools the company "
      + "ran on top of it: a creator-discovery ML system, an ad-spend decision engine with out-of-sample "
      + "backtesting, an n8n alerting workflow, and an executive BI dashboard.",
    sameAs: [wh.links.github].filter(u => u && u !== '#'),
    hasPart: projectsForLd,
  },
};
const headHtml = `<meta property="og:title" content="Camryn Blum — I built FHI Heat's data warehouse from scratch">
<meta property="og:description" content="Built FHI Heat's data warehouse from scratch, then the ML & BI tools the company ran on it. CS + Data Science, UW–Madison.">
<meta property="og:type" content="profile">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

// ---------- TL;DR band ----------
const tldrHtml = `<section class="tldr"><div class="wrap">
  <div class="tldr-lead"><strong>I built FHI Heat's data warehouse from scratch — by myself.</strong>
  Five disconnected systems — ERP, Amazon, TikTok Shop, Shopify, and shipping — unified into one SQL source
  of truth with nightly ingestion. Then the company built its tooling on top of my database: an ML
  creator-discovery system, an ad-spend decision engine (100% out-of-sample accuracy), an n8n automation,
  and the executive dashboard leadership ran on.</div>
  <div class="tldr-stats">
    <div><b>1</b><span>data warehouse, built solo from scratch</span></div>
    <div><b>5</b><span>source systems unified into it</span></div>
    <div><b>${builtOnCount}</b><span>tools the company built on it</span></div>
    <div><b>100%</b><span>out-of-sample decision accuracy</span></div>
  </div>
</div></section>`;

// ---------- Dossier (all entries, always visible) ----------
function article(e) {
  const lineage = (e.lineage || []).map(esc).join(' <span class="arw">→</span> ');
  const links = (e.links && e.links.length)
    ? `<div class="dz-l2">${e.links.map(l => `<a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])} →</a>`).join('')}</div>`
    : '';
  return `<article class="dz">
    <div class="dz-h"><h3>${esc(e.headline)}</h3><span class="dz-m">${esc(e.metric)}</span></div>
    <div class="dz-sub">${esc(e.mlabel)}</div>
    <p class="dz-n">${esc(e.narrative)}</p>
    <div class="dz-l">${lineage}</div>
    ${links}
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

// ---------- Fallback sections (also prerendered) ----------
const casesHtml = wh.caseStudies.map(c => `
  <div class="case">
    <div class="top"><span class="claim">${esc(c.claim)}</span><span class="val">${esc(c.value)}</span></div>
    <div class="body">
      <div class="row"><div class="lab">Method</div><div class="txt">${esc(c.method)}</div></div>
      <div class="row"><div class="lab">Result</div><div class="txt">${esc(c.result)}</div></div>
      <div class="row caveat"><div class="lab">Caveat</div><div class="txt">${esc(c.caveat)}</div></div>
    </div>
  </div>`).join('');

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
  .replace('<!--BUILD:TLDR-->', tldrHtml)
  .replace('<!--BUILD:GRAPH-->', graphHtml)
  .replace('<!--BUILD:DOSSIER-->', dossierHtml)
  .replace('<!--BUILD:CASES-->', casesHtml)
  .replace('<!--BUILD:STACK-->', stackHtml)
  .replace('<!--BUILD:FOOTLINKS-->', footHtml);

await writeFile(new URL('./index.html', import.meta.url), html, 'utf8');
console.log('build: index.html generated (' + wh.entries.length + ' entries, ' + builtOnCount + ' built-on-warehouse tools)');
