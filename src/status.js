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

// Normalize each system to a three-state value: 'up' | 'idle' | 'down'.
// Tolerates the legacy { up: boolean } schema so the indicator keeps working
// until the workflow rewrites status.json with explicit states.
function stateOf(s) {
  if (s.state === 'up' || s.state === 'idle' || s.state === 'down') return s.state;
  return s.up ? 'up' : 'down';
}

const TITLE = { up: 'live', idle: 'idle · wakes on click (~30s)', down: 'down' };

// Each status badge links straight to its deployment, so a visitor can open any live system in one click.
const URLS = {
  site: 'https://github.com/cmblum2/camryn-portfolio',
  nl2sql: 'https://ask-your-warehouse.streamlit.app',
  rag: 'https://creator-insight-assistant.onrender.com',
  'dbt-ci': 'https://github.com/cmblum2/retail-analytics-dbt/actions',
};

export function renderStatus(systems) {
  if (!systems.length) return '<span class="sysdim">status unavailable</span>';
  const norm = systems.map(s => ({ name: s.name, state: stateOf(s) }));
  const live = norm.filter(s => s.state !== 'down').length;   // idle apps still work — they just nap
  const anyDown = norm.some(s => s.state === 'down');
  const anyIdle = norm.some(s => s.state === 'idle');
  const sumClass = anyDown ? 'down' : (anyIdle ? 'idle' : 'up');
  const dots = norm.map(s => {
    const url = URLS[s.name];
    const title = `${esc(s.name)} — ${TITLE[s.state]}${url ? ' · open ↗' : ''}`;
    const inner = `<span class="sdot"></span>${esc(s.name)}`;
    return url
      ? `<a class="sysitem ${s.state}" href="${esc(url)}" target="_blank" rel="noopener" title="${title}">${inner} <span class="sysarrow">↗</span></a>`
      : `<span class="sysitem ${s.state}" title="${title}">${inner}</span>`;
  }).join('');
  return `<span class="syscount ${sumClass}"><span class="sdot"></span>${live} / ${norm.length} live</span>${dots}`;
}
