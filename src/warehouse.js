// Single source of truth. PUBLIC-SAFE ONLY: employer generalized; no real FHI tokens.
export const LENSES = ['AI', 'ML', 'BI', 'IB'];

// Sources I connected into the warehouse (shown feeding in on the lineage graph).
export const sources = ['ERP', 'Amazon', 'TikTok Shop', 'Shopify', 'Shipping'];

// Production projects that ran on the warehouse, grouped by business function (right side of the graph).
export const graphGroups = [
  { key: 'finance', label: 'the sale · finance', ids: ['sell', 'fbt'] },
  { key: 'growth', label: 'affiliate growth engine', ids: ['discovery', 'engine', 'n8n'] },
  { key: 'bi', label: 'exec visibility', ids: ['dashboard'] },
  // Public rebuilds modeled on the SAME warehouse (synthetic data) — connected, but dashed to
  // mark them as shareable rebuilds rather than production systems.
  { key: 'rebuild', label: 'public rebuilds · modeled on the warehouse', ids: ['nl2sql', 'dbt'], dashed: true },
];
// Detached band: only the genuinely different domain (research-lab voice AI).
export const beyondIds = ['voice'];

// ---- Career warehouse: the query engine's entries ----
// root: 'warehouse' = ran on the production warehouse I built. 'public' = synthetic rebuild.
//       'lab' = separate domain. 'meta' = summary (off graph). `label` = short graph label.
export const entries = [
  { id: 'sell', root: 'warehouse', group: 'finance', label: 'the audit', lenses: ['IB', 'BI'],
    keywords: ['sell', 'sold', 'acquisition', 'acquire', 'diligence', '590', 'reconcile', 'books', 'gap', 'audit', 'red flag'],
    plan: "SELECT gap FROM acquisition WHERE flag = 'unmatched_carrier_spend' → resolved",
    metric: '$590K → 0.5%', mlabel: 'acquisition red flag, reconciled',
    headline: 'I resolved a $590K red flag during the company sale.',
    narrative: "When the company was being acquired, the buyer's team flagged ~$590K paid to a shipping carrier with no matching shipping labels — a potential missing-money problem. I loaded 570K+ shipping records into the warehouse I'd built and reconciled them line-by-line against the ERP payment ledger. The cause: two prepaid carrier wallets were both booked under a single vendor. Counting both, three years of spend matched payments to within ~0.5% — a bookkeeping mis-classification, not missing money. The correction was booked.",
    lineage: ['570K shipping records', 'reconciled vs ERP ledger', 'gap explained → correction booked'], hot: 1,
    links: [] },
  { id: 'fbt', root: 'warehouse', group: 'finance', label: 'build-vs-buy', lenses: ['IB', 'BI'],
    keywords: ['fbt', 'fulfilled-by-tiktok', 'fulfillment', 'build-vs-buy', 'build vs buy', 'shipping speed', 'rate card', '36k', 'simulation', 'natural experiment'],
    plan: "SELECT cost FROM fulfillment_sim(rate_card, 11.6K_orders) vs current → don't switch",
    metric: '−$36K/yr', mlabel: 'build-vs-buy call (I said no)',
    headline: 'A build-vs-buy call that saved ~$36K/yr — by saying no.',
    narrative: "TikTok pitched its Fulfilled-by-TikTok program. Instead of guessing, I simulated the exact rate card per-SKU across ~11.6K real orders, and ran a natural experiment showing customers didn't actually punish slower shipping. The numbers said don't switch — so I recommended against it, saving ~$36K a year. The harder part was making the case that the default 'yes' was wrong.",
    lineage: ['per-SKU rate-card simulation (11.6K orders)', 'natural experiment on shipping speed', 'recommend NO → ~$36K/yr saved'], hot: 0,
    links: [] },
  { id: 'discovery', root: 'warehouse', group: 'growth', label: 'creator ML', lenses: ['AI', 'ML'],
    keywords: ['discovery', 'creator', 'scrape', 'scraper', 'comment', 'buy-intent', 'buy intent', 'prospect', 'outreach', 'affiliate', 'bot-block', 'machine learning', 'ml system'],
    plan: "SELECT creator, buy_intent FROM scraped_comments ORDER BY buy_intent DESC → outreach list",
    metric: 'buy-intent ranked', mlabel: 'creator-discovery ML system',
    headline: 'The affiliate ML system that found who to actually pay.',
    narrative: "To grow the affiliate program you first have to find the right creators. I built a resilient TikTok scraper that mines public comment data at scale (rotating strategies so it keeps working past bot-blocking), then a machine-learning model that scores each creator's buy-intent from that comment signal. Instead of guessing who to recruit, outreach could target the highest-intent prospects first — the discovery layer that feeds the whole affiliate pipeline.",
    lineage: ['scrape public TikTok comments (bot-resilient)', 'buy-intent ML scorer', 'ranked creator prospects → outreach'], hot: 1,
    links: [] },
  { id: 'engine', root: 'warehouse', group: 'growth', label: 'decision engine', lenses: ['AI', 'ML', 'IB'],
    keywords: ['engine', 'decision', 'roi', 'roas', 'campaign', 'ad spend', 'adspend', 'backtest', 'breakeven', 'prove', 'accuracy', 'right'],
    plan: "SELECT verdict FROM ad_campaigns WHERE realized_roas < breakeven → 'cut'  (then backtest)",
    metric: '100% OOS', mlabel: 'out-of-sample decision accuracy',
    headline: 'An ad-spend decision engine that proved its own calls.',
    narrative: "Once creators were live, affiliate ad spend was scattered across dozens of TikTok campaigns with no read on which were actually profitable after margin. I built a decision engine — LangGraph + Claude over the SQL warehouse — that scores each campaign against its own margin breakeven and returns a verdict: scale, tune, or cut. Then I backtested it out of sample: recompute every verdict from data before a cutoff date, then check what actually happened after (no look-ahead). Across four cutoff windows it hit 100% profitable/unprofitable accuracy, flagging up to $197K of below-breakeven spend. (Honest caveat: the 'keep' side rested on few campaigns, so I lean on the robust 'stop' side.) A public, synthetic-data rebuild is linked below.",
    lineage: ['SQL warehouse', 'LangGraph decision engine', 'out-of-sample dollar backtest'], hot: 1,
    links: [['Repo (synthetic rebuild)', 'https://github.com/cmblum2/creator-insight-assistant'], ['Live demo', 'https://creator-insight-assistant.onrender.com']] },
  { id: 'n8n', root: 'warehouse', group: 'growth', label: 'n8n alerts', lenses: ['BI', 'AI'],
    keywords: ['n8n', 'workflow', 'automation', 'alert', 'no-code', 'low-code', 'watchdog', 'slack', 'discord', 'rpa'],
    plan: "ON schedule → diff(state) → IF changed → POST alert(Slack)",
    metric: 'auto-alerts', mlabel: 'no-code automation (n8n)',
    headline: 'A no-code watchdog on the affiliate system.',
    narrative: "The ML outputs are only useful if someone acts on them. I built an n8n workflow that runs on a schedule, watches the affiliate system for changes — new high-intent creators surfaced, campaign verdicts flipping, metric drift — diffs each run against the last, and posts an alert to Slack only when something actually changed. Low-code glue that turns the models' output into action without anyone babysitting a dashboard.",
    lineage: ['scheduled trigger', 'diff vs last run', 'alert on change → Slack'], hot: 1,
    links: [] },
  { id: 'dashboard', root: 'warehouse', group: 'bi', label: 'exec dash', lenses: ['BI', 'IB'],
    keywords: ['dashboard', 'exec', 'executive', 'revenue', 'chart', 'report', 'inflation', 'wholesale', '12x', 'visualiz'],
    plan: "SELECT revenue, margin, channel FROM exec_dashboard GROUP BY day → live view",
    metric: '~12× bug caught', mlabel: 'exec BI dashboard (Next.js)',
    headline: 'The exec dashboard leadership ran the business on.',
    narrative: "I built the executive BI dashboard — Next.js on top of the warehouse — that leadership used for daily revenue, margin, and channel views. It also caught a bug nobody had noticed: an upstream table was counting each intraday API snapshot (~12×/day) as a separate sale, silently inflating one channel's revenue ~12× for a month. I traced it and rebuilt the metric from deduplicated source data. The same dashboard surfaced that ~two-thirds of revenue sat in a wholesale channel every DTC-only report was ignoring.",
    lineage: ['warehouse', 'Next.js exec dashboard', 'caught a ~12× revenue-inflation bug'], hot: 1,
    links: [] },
  { id: 'nl2sql', root: 'public', label: 'NL→SQL', lenses: ['AI', 'BI'],
    keywords: ['nl2sql', 'text-to-sql', 'natural language', 'ask my', 'guardrail', 'self-repair', 'streamlit', 'role-scoped', 'sql agent'],
    plan: "-- \"show Q3 revenue by channel\"  →  SELECT ... (read-only, role-scoped)",
    metric: '5 roles', mlabel: 'governed NL→SQL agent · live',
    headline: 'Ask-Your-Warehouse: plain English → governed SQL.',
    narrative: "This is a public, shareable rebuild modeled on my own warehouse — same schema and roles, synthetic data — so the skill is visible without exposing anything private. A LangGraph agent turns a plain-English question into SQL, runs it, and answers with a chart, with real guardrails (not just prompts): it only writes read-only SELECTs, self-repairs when a query errors, and enforces role-based access at three layers — a CEO sees everything, an intern sees no dollar amounts. Ask it to 'delete all orders' and it refuses. Five role logins in the live demo.",
    lineage: ['plain-English question', 'LangGraph → guardrailed read-only SQL', 'chart + answer, or a refusal'], hot: 1,
    links: [['Repo', 'https://github.com/cmblum2/nl2sql-agent'], ['Live demo', 'https://ask-your-warehouse.streamlit.app']] },
  { id: 'dbt', root: 'public', label: 'dbt', lenses: ['BI', 'AI'],
    keywords: ['dbt', 'bigquery', 'analytics engineering', 'staging', 'marts', 'lineage', 'transform', 'ci', 'elt', 'data test'],
    plan: "dbt build → 3 seeds · 6 models · 22/22 tests passed (CI on every push)",
    metric: '22/22 tests', mlabel: 'dbt + BigQuery, CI-tested',
    headline: 'A retail warehouse, modeled the analytics-engineering way.',
    narrative: "A public, shareable rebuild that models my warehouse in dbt on BigQuery (synthetic data) — the named-stack, reproducible version of the modeling I did by hand in production. raw → staging → marts (fact and dimension tables), with data tests (not-null, unique, relationships), auto-generated lineage docs, and GitHub Actions CI that runs the full build + all tests on every push.",
    lineage: ['raw seeds', 'staging → marts (dbt)', '22 data tests, green in CI'], hot: 1,
    links: [['Repo', 'https://github.com/cmblum2/retail-analytics-dbt']] },
  { id: 'voice', root: 'lab', rootLabel: 'research lab', label: 'voice AI', lenses: ['AI', 'ML'],
    keywords: ['voice', 'realtime', 'audio', 'hands-free', 'speech', 'dictation', 'assistant', 'openai', 'stemy'],
    plan: "SELECT story FROM research_lab WHERE domain = 'voice-ai' → 1 row",
    metric: 'full-duplex', mlabel: 'realtime voice agent · co-authored',
    headline: 'A hands-free voice AI for the lab bench (SteMy).',
    narrative: "Different domain entirely — this ran nowhere near the commerce warehouse. I co-authored the voice layer of a research lab's AI assistant so a scientist can run workflows hands-free at the bench. It uses OpenAI's Realtime API for full-duplex speech (it can listen and talk at once), calls backend functions by voice, and gates any real action behind a spoken confirmation so it can't act on a mishearing. My part was the voice and tool-dispatch flow.",
    lineage: ['OpenAI Realtime (full-duplex speech)', 'voice → backend function calls', 'spoken confirmation before any action'], hot: 1,
    links: [] },
  { id: 'warehouse', root: 'warehouse', label: 'warehouse', lenses: ['BI', 'IB'],
    keywords: ['warehouse', 'data', 'pipeline', 'erp', 'source', 'database', 'backbone', 'infrastructure', 'ingestion', 'etl', 'from scratch'],
    plan: "SELECT * FROM (erp, amazon, tiktok_shop, shopify, shipping) → one_warehouse",
    metric: '5 sources → 1', mlabel: 'unified warehouse, built from scratch',
    headline: 'The data warehouse the whole business ran on.',
    narrative: "This is the foundation everything else stands on. I built a multi-platform data warehouse from scratch in SQL, pulling five siloed systems — the ERP, the Amazon and TikTok Shop marketplaces, the Shopify DTC store, and the shipping carrier — into one place, refreshed by nightly Python jobs. Before it, every question meant stitching exports together by hand. After, the whole company (sales, margin, inventory, fulfillment) could be queried from a single source of truth — and every project to the right of it on the graph is something I built on top.",
    lineage: ['ERP + Amazon + TikTok Shop + Shopify + shipping', 'nightly Python ingestion', 'one SQL warehouse'], hot: 2,
    links: [] },
  { id: 'stack', root: 'meta', label: 'stack', lenses: ['AI', 'ML', 'BI', 'IB'],
    keywords: ['stack', 'tool', 'tech', 'skill', 'langgraph', 'power bi', 'powerbi', 'python', 'languages'],
    plan: "SELECT tool, proof FROM stack WHERE shipped = true → each maps to a repo",
    metric: 'each → a repo', mlabel: 'tools, honestly earned',
    headline: 'The toolset — every tool tied to a shipped project.',
    narrative: 'AI / LLM: LangGraph agents, RAG (Chroma), RAGAS evaluation, Claude & OpenAI. Data: dbt + BigQuery, Python, SQL, Docker, GitHub Actions CI. Automation/BI: n8n, Power BI (star schema + DAX), Next.js dashboards. ML/Rigor: web scraping, buy-intent scoring, causal inference, out-of-sample backtesting, guardrails. Every item points to a project above, not a course checklist.',
    lineage: ['raw skills', 'staging (projects)', 'marts (shipped + evaluated)'], hot: 2,
    links: [['GitHub', 'https://github.com/cmblum2']] },
  { id: 'deploy', root: 'meta', label: 'deploy', lenses: ['AI', 'BI'],
    keywords: ['deploy', 'live', 'running', 'host', 'hosted', 'url', 'demo', 'production', 'uptime'],
    plan: "SELECT name, state FROM deployments WHERE state != 'down' → live",
    metric: '3 public apps', mlabel: 'deployed + reachable',
    headline: 'What is actually running right now.',
    narrative: "The NL→SQL agent (Streamlit), the decision-engine rebuild (Render), and the dbt warehouse with green CI — plus this site. The status bar at the top pings them every 30 minutes; the free-tier demos nap when idle and wake on the first click (~30s), which is why they sometimes show amber.",
    lineage: ['Streamlit · NL→SQL agent', 'Render · decision-engine rebuild', 'GitHub Actions · dbt CI'], hot: -1,
    links: [['NL→SQL', 'https://ask-your-warehouse.streamlit.app'], ['Decision engine', 'https://creator-insight-assistant.onrender.com']] },
];

export const DEFAULT_ENTRY = 'warehouse';

// ---- Fallback (scroll) content, carried from v1 ----
export const profile = { name: 'Camryn Blum', kicker: 'CS + Data Science · UW–Madison' };

export const caseStudies = [
  { id: 'engine', claim: "The AI engine's calls, validated in dollars", value: '100% OOS', lenses: ['AI', 'ML', 'IB'],
    method: 'Recompute every campaign verdict from data before a cutoff, then measure what actually happened after — same decision function as the live engine, no look-ahead.',
    result: '100% profitable/unprofitable accuracy across four cutoff windows. Flagged up to $197K of below-breakeven spend (~$119K avoidable margin loss); healthy campaigns ran ~3.7× ROAS.',
    caveat: 'The "keep" side rested on few campaigns in-window — I present it as directional and lean on the robust "stop" side. Adoption outcomes were above my intern access.' },
  { id: 'audit', claim: 'A $590K books gap on an acquisition — resolved', value: '0.5% var', lenses: ['IB', 'BI'],
    method: 'During diligence on a company sale, pulled 570K+ shipping records into the warehouse I built and reconciled them line-by-line against the ERP payment ledger.',
    result: 'Proved the gap was a bookkeeping mis-classification, not missing money: two prepaid carrier wallets booked under one vendor. Counting both, spend matched payments to within ~0.5% over three years; the correction was booked.',
    caveat: 'The CEO ran the investor-grade sales views; I built the warehouse they ran on and did the reconciliation. Further outcomes were confidential above my intern access.' },
];

export const stack = [
  { group: 'AI / LLM', items: ['LangGraph agents', 'RAG · Chroma', 'RAGAS eval', 'Claude / OpenAI'] },
  { group: 'Data / Eng', items: ['dbt · BigQuery', 'Python · SQL', 'web scraping', 'Docker · CI/CD'] },
  { group: 'ML / Rigor', items: ['buy-intent scoring', 'causal inference', 'OOS backtesting', 'guardrails · eval'] },
  { group: 'BI / Automation', items: ['Power BI · DAX', 'Next.js dashboards', 'n8n workflows', 'star-schema modeling'] },
];

export const links = {
  github: 'https://github.com/cmblum2', linkedin: '#', resume: '#', email: 'camrynblum@gmail.com',
};
