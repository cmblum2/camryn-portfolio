// Build an interactive lineage DAG as an SVG string.
// Primary cluster: the 'warehouse' entry (center-left) with the work built ON it.
// Separate clusters: entries with their own `root` (e.g. the research-lab voice agent)
// are drawn detached from the warehouse — no edge between clusters — so lineage stays honest.
// Every clickable node has data-id so app.js can fire that entry's query.
export function buildGraph(entries, opts = {}) {
  const W = opts.w || 900, H = opts.h || 360;
  const esc = escSvg;

  // group children by root (default 'warehouse'); the warehouse entry itself is the primary root
  const primaryChildren = entries.filter(e => e.id !== 'warehouse' && (e.root || 'warehouse') === 'warehouse');
  const secondaryRoots = {};
  entries.filter(e => (e.root || 'warehouse') !== 'warehouse').forEach(e => {
    (secondaryRoots[e.root] = secondaryRoots[e.root] || { label: e.rootLabel || e.root, children: [] }).children.push(e);
  });

  // ---- primary (warehouse) cluster, left/center ----
  const cx = Math.round(W * 0.34), cy = Math.round(H / 2), R = 110;
  const pts = primaryChildren.map((e, i) => {
    const a = (-Math.PI / 2) + (i * 2 * Math.PI / primaryChildren.length);
    return { e, x: Math.round(cx + R * Math.cos(a)), y: Math.round(cy + R * Math.sin(a)) };
  });
  const pEdges = pts.map(p => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#232a34" stroke-width="1"/>`).join('');
  const pLeaves = pts.map(p => leaf(p.x, p.y, p.e.id, p.y < cy)).join('');
  const pRoot = `
    <g class="gnode" data-id="warehouse" style="cursor:pointer">
      <circle cx="${cx}" cy="${cy}" r="16" fill="#f0b429"/>
      <text x="${cx}" y="${cy + 34}" text-anchor="middle" ${TXT} fill="#7c828c">warehouse</text>
    </g>`;

  // ---- secondary clusters, right column (detached) ----
  const rootIds = Object.keys(secondaryRoots);
  const rx = Math.round(W * 0.82);
  let sSvg = '';
  rootIds.forEach((rid, gi) => {
    const g = secondaryRoots[rid];
    const ry = 96 + gi * 150;
    // synthetic (non-clickable) root node for the separate context
    sSvg += `
      <g>
        <circle cx="${rx}" cy="${ry}" r="12" fill="#0e1219" stroke="#6b7280" stroke-width="1.5" stroke-dasharray="3 3"/>
        <text x="${rx}" y="${ry - 18}" text-anchor="middle" ${TXT} fill="#7c828c">${esc(g.label)}</text>
      </g>`;
    g.children.forEach((c, ci) => {
      const yy = ry + 74 + ci * 66;
      sSvg += `<line x1="${rx}" y1="${ry}" x2="${rx}" y2="${yy}" stroke="#232a34" stroke-width="1"/>`;
      sSvg += leaf(rx, yy, c.id, false);
    });
  });

  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">${pEdges}${pLeaves}${pRoot}${sSvg}</svg>`;
}

const TXT = `font-family="'JetBrains Mono',monospace" font-size="10"`;

function leaf(x, y, id, labelAbove) {
  const ly = labelAbove ? y - 14 : y + 22;
  return `
    <g class="gnode" data-id="${id}" style="cursor:pointer">
      <circle cx="${x}" cy="${y}" r="9" fill="#0e1219" stroke="#f0b429" stroke-width="1.5"/>
      <text x="${x}" y="${ly}" text-anchor="middle" ${TXT} fill="#aeb4bd">${escSvg(id)}</text>
    </g>`;
}

function escSvg(s) { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
