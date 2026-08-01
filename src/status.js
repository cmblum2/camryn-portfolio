// Fetch same-origin status.json (written by the status workflow) and render an indicator.
export async function loadStatus(fetchImpl, url = 'status.json') {
  try {
    const res = await fetchImpl(url);
    if (!res || !res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.systems) ? data.systems : [];
  } catch {
    return [];
  }
}

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function renderStatus(systems) {
  if (!systems.length) return '<span class="sysdim">status unavailable</span>';
  const up = systems.filter(s => s.up).length;
  const dots = systems.map(s =>
    `<span class="sysitem ${s.up ? 'up' : 'down'}" title="${esc(s.name)}"><span class="sdot"></span>${esc(s.name)}</span>`
  ).join('');
  return `<span class="syscount"><span class="sdot"></span>${up} / ${systems.length} live</span>${dots}`;
}
