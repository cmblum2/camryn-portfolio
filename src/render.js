import { orderForLens, taglineForLens } from './lens.js';

const esc = (s) => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function renderHero(profile, metrics, lens) {
  const tagline = taglineForLens(profile, 'taglines', lens);
  const sub = taglineForLens(profile, 'subs', lens);
  const top = orderForLens(metrics, lens).slice(0, 3);
  const stats = top.map(m => `
    <div class="stat"><span class="k">${esc(m.label)}</span><span class="v g">${esc(m.value)}</span></div>
  `).join('');
  return `
    <div class="grid">
      <div>
        <div class="kicker">${esc(profile.kicker)}</div>
        <h1>${esc(tagline)}</h1>
        <p class="sub">${esc(sub)}</p>
        <div class="cta"><a class="btn p" href="#work">View the work</a><a class="btn g" href="#demos">Live demos →</a></div>
      </div>
      <div class="panel">
        <div class="ph"><span>DECISION ENGINE · OOS BACKTEST</span><span class="up">▲ ${esc(lens)}</span></div>
        <svg viewBox="0 0 300 96" style="width:100%;height:84px;margin-bottom:8px" aria-hidden="true">
          <polyline fill="none" stroke="#3fb950" stroke-width="2" points="0,78 40,70 80,73 120,58 160,42 200,46 240,26 300,12"/>
        </svg>
        ${stats}
      </div>
    </div>`;
}

export function renderProjects(projects, lens) {
  const cards = orderForLens(projects, lens).map(p => `
    <div class="demo">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.blurb)}</p>
      <div>${p.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      ${(p.repo || p.demo) ? `<div class="plinks">
        ${p.repo ? `<a class="lk" href="${esc(p.repo)}" target="_blank" rel="noopener">Repo →</a>` : ''}
        ${p.demo ? `<a class="lk" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo →</a>` : ''}
      </div>` : ''}
    </div>`).join('');
  return `<div class="demos">${cards}</div>`;
}

export function renderCaseStudies(caseStudies, lens) {
  return orderForLens(caseStudies, lens).map(c => `
    <div class="case">
      <div class="top"><span class="claim">${esc(c.claim)}</span><span class="val">${esc(c.value)}</span></div>
      <div class="body">
        <div class="row"><div class="lab">Method</div><div class="txt">${esc(c.method)}</div></div>
        <div class="row"><div class="lab">Result</div><div class="txt">${esc(c.result)}</div></div>
        <div class="row caveat"><div class="lab">Caveat</div><div class="txt">${esc(c.caveat)}</div></div>
      </div>
    </div>`).join('');
}

export function renderStack(stack) {
  return `<div class="stackgrid">${stack.map(col => `
    <div class="scol"><h4>${esc(col.group)}</h4>${col.items.map(i => `<div>${esc(i)}</div>`).join('')}</div>
  `).join('')}</div>`;
}

// Compose an answer card for one warehouse entry. Narrative is present in the HTML
// (SEO/no-JS safe); app.js may re-animate it with a streaming effect.
export function renderAnswer(entry, planText) {
  const nodes = (entry.lineage || []).map((n, i) =>
    `<span class="node ${i === entry.hot ? 'hot' : ''}">${esc(n)}</span>`
  ).join('<span class="arw">→</span>');
  const links = (entry.links && entry.links.length)
    ? `<div class="links">${entry.links.map(l => `<a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])} →</a>`).join('')}</div>`
    : '';
  return `
    <div class="plan">&gt; parsing intent… compiling query
&gt; ${esc(planText)}</div>
    <div class="answer">
      <div class="metric">${esc(entry.metric)}</div>
      <div class="mlabel">${esc(entry.mlabel)}</div>
      <h3>${esc(entry.headline)}</h3>
      <div class="narr">${esc(entry.narrative)}</div>
      <div class="lineage"><span class="ll">data lineage</span>${nodes}</div>
      ${links}
    </div>`;
}
