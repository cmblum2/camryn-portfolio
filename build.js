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
    jobTitle: 'AI & Data Engineer',
    email: 'mailto:' + wh.links.email,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Wisconsin–Madison' },
    worksFor: { '@type': 'Organization', name: 'FHI Heat' },
    affiliation: [
      { '@type': 'Organization', name: 'FHI Heat' },
      { '@type': 'ResearchOrganization', name: 'People and Robots Lab, University of Wisconsin–Madison' },
      { '@type': 'ResearchOrganization', name: 'Kamp Lab, University of Wisconsin–Madison' },
    ],
    knowsAbout: ['data warehousing', 'data integration', 'ETL / ELT', 'dimensional modeling', 'SQL', 'Python',
      'Shopify', 'Amazon Seller Central', 'Amazon Vendor Central', 'Amazon Ads', 'TikTok Shop', 'TikTok Ads',
      'Meta Ads', 'Google Ads', 'Google Analytics (GA4)', 'Google Search Console', 'Google Merchant Center',
      'SAP', 'ShipStation', 'Attentive', 'Euka', 'LangGraph', 'RAG', 'RAGAS', 'dbt', 'BigQuery', 'Power BI',
      'DAX', 'machine learning', 'web scraping', 'causal inference', 'out-of-sample backtesting', 'BI dashboards', 'n8n', 'Next.js'],
    description: "Built FHI Heat's multi-platform data warehouse from scratch — unifying ~15 systems across the "
      + "US & EU (Shopify, Amazon Seller/Vendor Central & Ads, TikTok Shop & Ads, Meta Ads, Google Ads/Analytics/"
      + "Search Console/Merchant Center, SAP, ShipStation, Attentive, Euka) into one conformed SQL schema — then "
      + "built most of the tools that ran on top of it: a creator-discovery "
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
const thesisHtml = `<p class="lede">~15 siloed systems across the US &amp; EU — Shopify, Amazon (Seller, Vendor, Ads),
  TikTok Shop &amp; Ads, Meta &amp; Google Ads, Google Analytics &amp; Search Console, SAP, ShipStation, Attentive, Euka —
  unified into one SQL source of truth with nightly ETL. On that foundation I built an ML creator-discovery
  system, an ad-spend decision engine (100% out-of-sample accuracy), an n8n automation, and the executive
  dashboard leadership ran on.</p>
  <div class="tldr-stats">
    <div><b>1</b><span>data warehouse, built from scratch</span></div>
    <div><b>15+</b><span>systems unified (US &amp; EU)</span></div>
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
  const skills = (e.skills && e.skills.length)
    ? `<div class="dz-sk">${e.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div>`
    : '';
  const step = e.step ? `<span class="dz-step">${esc(e.step)}</span>` : '';
  const lensAttr = esc((e.lenses || []).join(' '));
  const shot = e.shot ? `<figure class="dz-shot"><img loading="lazy" src="${esc(e.shot.src)}" alt="${esc(e.shot.cap)}"><figcaption>${esc(e.shot.cap)}</figcaption></figure>` : '';
  return `<article class="dz${viz ? ' has-viz' : ''}" data-eid="${esc(e.id)}" data-lenses="${lensAttr}">
    ${viz ? `<div class="dz-viz">${viz}</div>` : ''}
    <div class="dz-body">
      <div class="dz-h"><h3>${step}${esc(e.headline)}</h3><span class="dz-m">${esc(e.metric)}</span></div>
      <div class="dz-sub">${esc(e.mlabel)}</div>
      ${skills}
      <details class="dz-more">
        <summary><span class="dz-more-l"><span class="o">Read how it works</span><span class="c">Hide details</span></span></summary>
        ${shot}
        <p class="dz-n">${esc(e.narrative)}</p>
        ${tech}
        <div class="dz-l">${lineage}</div>
        ${links}
      </details>
    </div>
  </article>`;
}
function group(title, ids, note, blurb) {
  const arts = ids.map(id => byId[id]).filter(Boolean).map(article).join('');
  if (!arts) return '';
  const b = blurb ? `<div class="dz-gblurb">${esc(blurb)}</div>` : '';
  return `<div class="dz-group"><div class="dz-gh">${esc(title)}${note ? ` <span class="dz-note">${esc(note)}</span>` : ''}</div>${b}${arts}</div>`;
}
// Consolidated dossier groups (decoupled from the graph's finer bands): fewer, clearer buckets.
const gg = Object.fromEntries(wh.graphGroups.map(g => [g.key, g]));
const dossierHtml = [
  group('Data engineering — the warehouse, built from scratch', ['warehouse'], '',
    'The single SQL source of truth every tool below runs on.'),
  group(gg.growth.title, gg.growth.ids, '', gg.growth.blurb),
  group('Financial analytics, BI & decision support', ['sell', 'fbt', 'dashboard'], '',
    'Warehouse-powered decisions — a diligence reconciliation, a build-vs-buy call, and the executive dashboard leadership ran on.'),
  group('Public rebuilds & live deployments — analytics engineering + LLM tooling', ['nl2sql', 'dbt', 'deploy'],
    '(synthetic data · public repos)'),
  group('Voice-AI research — People and Robots Lab × Kamp Lab (UW–Madison)', wh.beyondIds,
    '(ongoing · co-authoring · NIH R01 scored highly)'),
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
