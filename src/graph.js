// Build the career-lineage DAG, left → right, as an SVG string:
//   sources (left)  →  the warehouse (center)  →  what it powered (right, grouped by function)
//   ...and a detached "beyond the warehouse" band for public rebuilds + the research-lab domain.
// Only production work (root === 'warehouse') branches off the warehouse. Every project node
// carries data-id so app.js can fire that entry's query on click.
export function buildGraph(entries, opts = {}) {
  const { sources = [], groups = [], beyond = [] } = opts;
  const byId = Object.fromEntries(entries.map(e => [e.id, e]));
  const W = 1000, H = 560, whX = 330, whY = 190;

  // sources column (left) → warehouse
  const sx = 104, sTop = 70, sSpan = 260;
  const sGap = sources.length > 1 ? sSpan / (sources.length - 1) : 0;
  let srcEdges = '', srcNodes = '';
  sources.forEach((s, i) => {
    const y = Math.round(sTop + i * sGap);
    srcEdges += `<line x1="${sx}" y1="${y}" x2="${whX}" y2="${whY}" stroke="#1f2630" stroke-width="1"/>`;
    srcNodes += `<g><circle cx="${sx}" cy="${y}" r="5" fill="#0e1219" stroke="#3a4553" stroke-width="1.2"/>`
      + `<text x="${sx - 13}" y="${y + 3}" text-anchor="end" ${MONO(9)} fill="#8a909a">${esc(s)}</text></g>`;
  });

  // projects (right), grouped by business function; a `dashed` group = public rebuilds of the warehouse
  let prodEdges = '', prodNodes = '', grpLabels = '';
  const gTop = 60, gSpan = 320;
  const gGap = groups.length > 1 ? gSpan / (groups.length - 1) : 0;
  groups.forEach((g, gi) => {
    const gy = Math.round(gTop + gi * gGap);
    const labelColor = g.dashed ? '#8aa0c0' : '#f0b429';
    grpLabels += `<text x="590" y="${gy - 22}" ${MONO(10)} fill="${labelColor}" letter-spacing="1">${esc(g.label)}</text>`;
    g.ids.forEach((id, j) => {
      const e = byId[id]; if (!e) return;
      const x = 612 + j * 155, y = gy;
      const edge = g.dashed
        ? `<line x1="${whX}" y1="${whY}" x2="${x}" y2="${y}" stroke="#33405c" stroke-width="1" stroke-dasharray="4 4"/>`
        : `<line x1="${whX}" y1="${whY}" x2="${x}" y2="${y}" stroke="#232a34" stroke-width="1"/>`;
      prodEdges += edge;
      prodNodes += projNode(x, y, id, e.label || id, null, g.dashed);
    });
  });

  // warehouse root
  const wh = `<g class="gnode" data-id="warehouse" style="cursor:pointer">`
    + `<circle cx="${whX}" cy="${whY}" r="18" fill="#f0b429"/>`
    + `<text x="${whX}" y="${whY + 37}" text-anchor="middle" ${MONO(11)} fill="#7c828c">warehouse · built from scratch</text></g>`;

  // detached band: a genuinely separate domain (research-lab voice AI), not on the warehouse
  const bandY = 452;
  let beyondSvg = `<line x1="60" y1="${bandY}" x2="940" y2="${bandY}" stroke="#1a1f27" stroke-width="1" stroke-dasharray="4 4"/>`
    + `<text x="60" y="${bandY - 10}" ${MONO(10)} fill="#7c828c" letter-spacing="1">A SEPARATE ENGAGEMENT — UW RESEARCH LAB · VOICE AI (NOT FHI)</text>`;
  beyond.forEach((id, i) => {
    const e = byId[id]; if (!e) return;
    const x = 190 + i * 230, y = bandY + 58;
    beyondSvg += projNode(x, y, id, e.label || id, e.rootLabel);
  });

  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" role="img" aria-label="Career lineage: sources to warehouse to projects">`
    + `${srcEdges}${prodEdges}${grpLabels}${srcNodes}${prodNodes}${wh}${beyondSvg}</svg>`;
}

function projNode(x, y, id, label, tag, muted) {
  const t = tag ? `<text x="${x}" y="${y + 33}" text-anchor="middle" ${MONO(8)} fill="#6b7280">${esc(tag)}</text>` : '';
  const stroke = muted ? '#6b86b0' : '#f0b429';
  return `<g class="gnode" data-id="${id}" style="cursor:pointer">`
    + `<circle cx="${x}" cy="${y}" r="8" fill="#0e1219" stroke="${stroke}" stroke-width="1.5"/>`
    + `<text x="${x}" y="${y + 20}" text-anchor="middle" ${MONO(9.5)} fill="#c9cdd4">${esc(label)}</text>${t}</g>`;
}

function MONO(size) { return `font-family="'JetBrains Mono',monospace" font-size="${size}"`; }
function esc(s) { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
