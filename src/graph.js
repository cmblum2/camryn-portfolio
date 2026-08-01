// Build an interactive lineage DAG as an SVG string.
// Root = the 'warehouse' entry (center); other entries arranged on a circle.
// Each node has data-id so app.js can wire clicks to fire that entry's query.
export function buildGraph(entries, opts = {}) {
  const W = opts.w || 900, H = opts.h || 340, cx = W / 2, cy = H / 2, R = opts.r || 120;
  const others = entries.filter(e => e.id !== 'warehouse');
  const pts = others.map((e, i) => {
    const a = (-Math.PI / 2) + (i * 2 * Math.PI / others.length);
    return { e, x: Math.round(cx + R * Math.cos(a)), y: Math.round(cy + R * Math.sin(a)) };
  });
  const edges = pts.map(p => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#232a34" stroke-width="1"/>`).join('');
  const leaf = pts.map(p => `
    <g class="gnode" data-id="${p.e.id}" style="cursor:pointer">
      <circle cx="${p.x}" cy="${p.y}" r="9" fill="#0e1219" stroke="#f0b429" stroke-width="1.5"/>
      <text x="${p.x}" y="${p.y + (p.y < cy ? -14 : 22)}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" fill="#aeb4bd">${escSvg(p.e.id)}</text>
    </g>`).join('');
  const root = `
    <g class="gnode" data-id="warehouse" style="cursor:pointer">
      <circle cx="${cx}" cy="${cy}" r="16" fill="#f0b429"/>
      <text x="${cx}" y="${cy + 34}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11" fill="#7c828c">warehouse</text>
    </g>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">${edges}${leaf}${root}</svg>`;
}

function escSvg(s) { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
