// Single source of truth. PUBLIC-SAFE ONLY: employer generalized; no real FHI tokens.
export const LENSES = ['AI', 'ML', 'BI', 'IB'];

// Sources I connected into the warehouse (shown feeding in on the lineage graph).
export const sources = ['Shopify', 'TikTok Shop', 'TikTok Ads', 'Amazon', 'Amazon Vendor', 'Amazon Ads', 'SAP', 'ShipStation', 'Attentive', 'Euka'];

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
    keywords: ['reconcile', 'reconciliation', 'books', 'discrepancy', 'gap', 'audit', 'carrier', 'shipping spend', 'ledger', 'variance'],
    viz: 'reconcile',
    plan: "SELECT gap FROM carrier_spend WHERE flag = 'unmatched' → bookkeeping mis-classification",
    metric: '→ 0.5% variance', mlabel: 'six-figure discrepancy, reconciled',
    headline: 'Six-figure books reconciliation',
    narrative: "Reconciled 570K+ shipping records against the ERP payment ledger to resolve a six-figure carrier-spend discrepancy leadership flagged. Traced it to a many-to-one vendor mis-booking (two prepaid wallets under one vendor) and proved spend matched payments to within ~0.5% — not missing money; the correction was booked.",
    skills: ['Data reconciliation', 'SQL', 'Root-cause analysis', 'Financial data'],
    tech: [
      "Reconciled 570K+ shipping records against the ERP payment ledger with SQL joins and aggregation.",
      "Root-caused the gap to a many-to-one vendor mapping — two prepaid carrier wallets booked under one vendor.",
      "Three-year variance analysis brought spend vs payments to within ~0.5%, proving a bookkeeping mis-classification, not missing money.",
    ],
    lineage: ['570K shipping records', 'reconciled vs ERP ledger', 'six-figure gap → bookkeeping fix'], hot: 1,
    links: [] },
  { id: 'fbt', root: 'warehouse', group: 'finance', label: 'build-vs-buy', lenses: ['IB', 'BI'],
    keywords: ['fbt', 'fulfilled-by-tiktok', 'fulfillment', 'build-vs-buy', 'build vs buy', 'shipping speed', 'rate card', 'simulation', 'natural experiment'],
    viz: 'bars',
    plan: "SELECT cost FROM fulfillment_sim(rate_card, per_sku) vs current → don't switch",
    metric: 'a firm "no"', mlabel: 'build-vs-buy, backed by data',
    headline: 'Fulfilled-by-TikTok build-vs-buy analysis',
    narrative: "Simulated TikTok's fulfillment rate card per-SKU across thousands of orders and ran a natural experiment showing no customer penalty for slower shipping — recommended against adopting the program, avoiding a five-figure annual cost and winning the case against the default 'yes.'",
    skills: ['Cost modeling', 'Natural experiment', 'Decision analysis', 'SQL'],
    tech: [
      "Simulated the carrier's exact rate card per-SKU (weight and dimensional-weight tiers) across thousands of historical orders from the warehouse.",
      "Ran a natural experiment across shipping-speed cohorts — no measurable penalty in customer behavior for slower shipping.",
      "Framed it as build-vs-buy: in-house fulfillment cost vs the program's per-order economics → recommend against switching.",
    ],
    lineage: ['per-SKU rate-card simulation', 'natural experiment on shipping speed', 'recommend NO → cost avoided'], hot: 0,
    links: [] },
  { id: 'discovery', root: 'warehouse', group: 'growth', label: 'creator ML', lenses: ['AI', 'ML'],
    keywords: ['discovery', 'creator', 'scrape', 'scraper', 'comment', 'buy-intent', 'buy intent', 'prospect', 'outreach', 'affiliate', 'bot-block', 'machine learning', 'ml system'],
    viz: 'funnel',
    plan: "SELECT creator, buy_intent FROM scraped_comments ORDER BY buy_intent DESC → outreach list",
    metric: 'buy-intent ranked', mlabel: 'creator-discovery ML system',
    headline: 'Creator-discovery ML pipeline',
    narrative: "Built a resilient TikTok comment scraper (rotating strategies to beat bot-blocking) plus a supervised ML model that scores creator buy-intent from comment signals — ranking prospects so affiliate outreach targeted the highest-intent creators instead of guessing. The discovery layer that feeds the whole affiliate pipeline.",
    skills: ['Machine learning', 'Web scraping', 'NLP features', 'Ranking', 'Python'],
    tech: [
      "Resilient scraper for public TikTok comments: rotating request strategies, pacing, and retry/backoff to survive bot-blocking, with pagination and de-duplication.",
      "Feature-engineered buy-intent signals from comment text (purchase-intent language, engagement).",
      "A supervised ML model scores each creator's buy-intent; creators are ranked so outreach hits the highest-intent prospects first.",
    ],
    lineage: ['scrape public TikTok comments (bot-resilient)', 'buy-intent ML scorer', 'ranked creator prospects → outreach'], hot: 1,
    links: [] },
  { id: 'engine', root: 'warehouse', group: 'growth', label: 'decision engine', lenses: ['AI', 'ML', 'IB'],
    keywords: ['engine', 'decision', 'roi', 'roas', 'campaign', 'ad spend', 'adspend', 'backtest', 'breakeven', 'prove', 'accuracy', 'right'],
    viz: 'curve',
    plan: "SELECT verdict FROM ad_campaigns WHERE realized_roas < breakeven → 'cut'  (then backtest)",
    metric: '100% OOS', mlabel: 'out-of-sample decision accuracy',
    headline: 'Affiliate ad-spend decision engine',
    narrative: "Built a LangGraph + Claude engine over the warehouse that scores each TikTok GMV Max campaign's realized ROAS against its margin breakeven and calls scale/tune/cut — then validated it with an out-of-sample backtest (temporal split, no look-ahead): 100% profitable/unprofitable accuracy across four cutoffs. Code decides; the LLM narrates. (Caveat: the 'keep' side rested on few campaigns, so I lean on the robust 'stop' side.)",
    skills: ['LLM agents (LangGraph)', 'Unit economics', 'Causal validation', 'Out-of-sample backtest', 'SQL'],
    tech: [
      "Inputs — per-campaign ad spend and attributed GMV/orders from the warehouse (TikTok's automated GMV Max affiliate campaigns), joined to product-level contribution margin and affiliate commission.",
      "Decision — a LangGraph state-machine computes each campaign's realized ROAS against its margin-derived breakeven (breakeven ROAS = 1 ÷ contribution-margin % after commission) and emits scale / tune / cut. Code decides; the LLM only narrates.",
      "Validation — an out-of-sample backtest: a temporal split decides from pre-cutoff data and scores realized post-cutoff outcomes with no look-ahead, running the exact live decision function.",
      "Result — 100% profitable/unprofitable classification accuracy across four cutoff windows.",
    ],
    lineage: ['SQL warehouse', 'LangGraph decision engine', 'out-of-sample dollar backtest'], hot: 1,
    links: [['Repo (synthetic rebuild)', 'https://github.com/cmblum2/creator-insight-assistant'], ['Live demo', 'https://creator-insight-assistant.onrender.com']] },
  { id: 'n8n', root: 'warehouse', group: 'growth', label: 'n8n alerts', lenses: ['BI', 'AI'],
    keywords: ['n8n', 'workflow', 'automation', 'alert', 'no-code', 'low-code', 'watchdog', 'slack', 'discord', 'rpa'],
    viz: 'flow-n8n',
    plan: "ON schedule → diff(state) → IF changed → POST alert(Slack)",
    metric: 'auto-alerts', mlabel: 'no-code automation (n8n)',
    headline: 'n8n alerting automation',
    narrative: "Built an n8n workflow that runs on a schedule, diffs the affiliate system's state against the last run, and posts Slack alerts only on change — new high-intent creators, flipped campaign verdicts, metric drift — turning model output into action with no dashboard-watching.",
    skills: ['Workflow automation (n8n)', 'Change detection', 'Alerting', 'Low-code'],
    tech: [
      "Scheduled n8n workflow queries the current state, diffs it against the last run's stored snapshot, and alerts only on change (no alert fatigue).",
      "Conditional branches post formatted Slack alerts for new high-intent creators, flipped campaign verdicts, or metric drift.",
      "Stateful, idempotent glue that turns model output into action with no dashboard-watching.",
    ],
    lineage: ['scheduled trigger', 'diff vs last run', 'alert on change → Slack'], hot: 1,
    links: [] },
  { id: 'dashboard', root: 'warehouse', group: 'bi', label: 'exec dash', lenses: ['BI', 'IB'],
    keywords: ['dashboard', 'exec', 'executive', 'revenue', 'chart', 'report', 'bug', 'data quality', 'channel', 'visualiz'],
    viz: 'tiles',
    plan: "SELECT revenue, margin, channel FROM exec_dashboard GROUP BY day → live view",
    metric: 'caught a data bug', mlabel: 'exec BI dashboard (Next.js)',
    headline: 'Executive BI dashboard',
    narrative: "Built a Next.js dashboard over the warehouse — daily revenue, gross margin, AOV, and ad spend by channel, marketplace, and region — that leadership ran on. Caught a data-quality bug (a marketplace's intraday snapshots double-counted, overstating revenue) and surfaced a major wholesale channel every DTC-only report was missing.",
    skills: ['BI / dashboards', 'Next.js / React', 'Data-quality / anomaly detection', 'SQL'],
    tech: [
      "Inputs — the warehouse's conformed marts (orders, ad spend, margin) across every channel: Amazon, TikTok Shop, Shopify DTC, and wholesale, US & EU.",
      "Views — Next.js/React with server-side fetching: daily revenue, gross margin, AOV, and ad spend, sliced by channel, marketplace, and region for leadership.",
      "Data-quality — caught a bug via anomaly investigation: a marketplace's intraday API snapshots were being counted as separate sales, overstating that channel's revenue; rebuilt the metric from de-duplicated source data.",
      "Surfaced a major wholesale revenue channel that DTC-only reports had been ignoring.",
    ],
    lineage: ['warehouse', 'Next.js exec dashboard', 'caught an upstream revenue-inflation bug'], hot: 1,
    links: [] },
  { id: 'nl2sql', root: 'public', label: 'NL→SQL', lenses: ['AI', 'BI'],
    keywords: ['nl2sql', 'text-to-sql', 'natural language', 'ask my', 'guardrail', 'self-repair', 'streamlit', 'role-scoped', 'sql agent'],
    viz: 'flow-nl2sql',
    plan: "-- \"show Q3 revenue by channel\"  →  SELECT ... (read-only, role-scoped)",
    metric: '5 roles', mlabel: 'governed NL→SQL agent · live',
    headline: 'NL→SQL analytics agent (governed)',
    narrative: "A LangGraph agent that turns plain-English questions into governed SQL — read-only, self-repairing, with role-based access enforced in three layers (schema-scoped prompt, a guard, and per-role DuckDB views). Public rebuild on synthetic data modeled on my warehouse; live demo with five role logins (ask it to 'delete all orders' and it refuses).",
    skills: ['LLM agents (LangGraph)', 'Text-to-SQL', 'Guardrails / governance', 'Evaluation'],
    tech: [
      "LangGraph agent: NL → SQL → execute → chart, with a guardrail node (read-only SELECT only, forced LIMIT, blocks DML) and a self-repair loop (catch SQL error → feed it back → retry).",
      "Role-based access in three layers: a schema-scoped prompt, a guard that rejects out-of-scope columns, and per-role DuckDB views as a physical backstop (hidden columns literally absent).",
      "DuckDB engine, Streamlit UI, and an evaluation harness — on synthetic data modeled on my real warehouse schema.",
    ],
    lineage: ['plain-English question', 'LangGraph → guardrailed read-only SQL', 'chart + answer, or a refusal'], hot: 1,
    links: [['Repo', 'https://github.com/cmblum2/nl2sql-agent'], ['Live demo', 'https://ask-your-warehouse.streamlit.app']] },
  { id: 'dbt', root: 'public', label: 'dbt', lenses: ['BI', 'AI'],
    keywords: ['dbt', 'bigquery', 'analytics engineering', 'staging', 'marts', 'lineage', 'transform', 'ci', 'elt', 'data test'],
    viz: 'dag',
    plan: "dbt build → 3 seeds · 6 models · 22/22 tests passed (CI on every push)",
    metric: '22/22 tests', mlabel: 'dbt + BigQuery, CI-tested',
    headline: 'dbt + BigQuery analytics warehouse',
    narrative: "A retail warehouse modeled in dbt on BigQuery (raw → staging → marts) with data tests, lineage docs, and GitHub Actions CI running the full build + 22 tests on every push. Public rebuild on synthetic data — the named-stack, reproducible version of my production modeling.",
    skills: ['Analytics engineering (dbt)', 'BigQuery', 'Data testing', 'CI/CD'],
    tech: [
      "dbt on BigQuery: raw → staging (clean and type) → marts (fact_daily_revenue, dim_product with unit margin, channel rollups).",
      "Data tests (not_null, unique, relationships, accepted_values) plus auto-generated lineage docs.",
      "GitHub Actions CI runs the full dbt build and tests in an isolated dataset on every push (service-account auth).",
    ],
    lineage: ['raw seeds', 'staging → marts (dbt)', '22 data tests, green in CI'], hot: 1,
    links: [['Repo', 'https://github.com/cmblum2/retail-analytics-dbt']] },
  { id: 'voice', root: 'lab', rootLabel: 'research lab', label: 'voice AI', lenses: ['AI', 'ML'],
    keywords: ['voice', 'realtime', 'audio', 'hands-free', 'speech', 'dictation', 'assistant', 'openai', 'stemy'],
    viz: 'flow-voice',
    plan: "SELECT story FROM research_lab WHERE domain = 'voice-ai' → 1 row",
    metric: 'full-duplex', mlabel: 'realtime voice agent · co-authored',
    headline: 'Realtime voice AI (co-authored)',
    narrative: "Co-authored the voice layer of a research lab's AI assistant (SteMy): OpenAI Realtime full-duplex speech with function-calling and a spoken confirmation gate before any real action. A separate domain from the commerce warehouse; my part was the voice and tool-dispatch flow.",
    skills: ['Voice AI (OpenAI Realtime)', 'Function-calling', 'Human-in-the-loop', 'Real-time systems'],
    tech: [
      "OpenAI Realtime API for full-duplex speech (listen and talk at once) with function-calling into backend tools.",
      "Confirmation gates before any side-effecting action — the model proposes, a spoken confirmation commits — so it cannot act on a mishearing.",
      "My part: the voice loop and tool-dispatch flow (a co-authored project).",
    ],
    lineage: ['OpenAI Realtime (full-duplex speech)', 'voice → backend function calls', 'spoken confirmation before any action'], hot: 1,
    links: [] },
  { id: 'warehouse', root: 'warehouse', label: 'warehouse', lenses: ['BI', 'IB'],
    keywords: ['warehouse', 'data', 'pipeline', 'erp', 'source', 'database', 'backbone', 'infrastructure', 'ingestion', 'etl', 'from scratch'],
    viz: 'fanin',
    plan: "SELECT * FROM (shopify, tiktok_shop+ads, amazon_seller+vendor+ads, sap, shipstation, attentive, euka) → conformed_schema",
    metric: '10+ systems → 1', mlabel: 'unified warehouse, built from scratch',
    headline: 'Multi-source data warehouse — built from scratch',
    narrative: "Designed and built FHI Heat's SQL warehouse from zero: nightly Python ETL unifying ~10 systems across the US & EU (Shopify, TikTok Shop & Ads, Amazon Seller/Vendor/Ads, SAP, ShipStation, Attentive, Euka) into one conformed dimensional schema — the single source of truth every downstream tool ran on.",
    skills: ['Data engineering', 'ETL', 'Dimensional modeling', 'SQL', 'Python', 'API integration'],
    tech: [
      "Ingestion — ~10 source systems across the US & EU, each via its own API: Shopify (DTC), TikTok Shop Seller Center + TikTok Ads, Amazon Seller Central, Vendor Central + Amazon Ads, SAP (ERP), ShipStation, and the marketing tools Attentive and Euka.",
      "Schema — normalized them into one dimensional model: fact tables for orders, order-lines, ad spend, and shipments, conformed to shared dimensions (SKU/product, channel, marketplace & region, date, customer), with cross-marketplace SKU mapping and USD/EUR normalization.",
      "Reliability — incremental, idempotent upserts, schema-drift handling, and de-duplication of intraday API snapshots so no sale or ad-spend is double-counted; Seller vs Vendor and ads vs orders reconciled into one revenue-and-margin view.",
    ],
    lineage: ['Shopify · TikTok · Amazon · SAP · ShipStation · Attentive · Euka', 'nightly Python ingestion', 'one conformed SQL schema'], hot: 2,
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
    headline: 'Live deployments',
    narrative: "Three public apps you can hit right now — the NL→SQL agent (Streamlit), the decision-engine rebuild (Render), and the dbt warehouse with green CI — plus this site. The status bar pings them every 30 minutes; free-tier demos nap when idle and wake on first click.",
    skills: ['Deployment', 'CI/CD', 'GitHub Pages · Streamlit · Render'],
    lineage: ['Streamlit · NL→SQL agent', 'Render · decision-engine rebuild', 'GitHub Actions · dbt CI'], hot: -1,
    links: [['NL→SQL', 'https://ask-your-warehouse.streamlit.app'], ['Decision engine', 'https://creator-insight-assistant.onrender.com']] },
];

export const DEFAULT_ENTRY = 'warehouse';

// ---- Fallback (scroll) content, carried from v1 ----
export const profile = { name: 'Camryn Blum', kicker: 'CS + Data Science · UW–Madison' };

export const caseStudies = [
  { id: 'engine', claim: 'The AI engine\'s calls, validated out of sample', value: '100% OOS', lenses: ['AI', 'ML', 'IB'],
    method: 'Recompute every campaign verdict from data before a cutoff, then measure what actually happened after — same decision function as the live engine, no look-ahead.',
    result: '100% profitable/unprofitable accuracy across four cutoff windows — every campaign it flagged to stop was genuinely below breakeven, and the ones it called healthy were solidly profitable.',
    caveat: 'The "keep" side rested on few campaigns in-window — I present it as directional and lean on the robust "stop" side. Downstream adoption was above my intern access.' },
  { id: 'audit', claim: 'A six-figure books discrepancy — reconciled to 0.5%', value: '0.5% var', lenses: ['IB', 'BI'],
    method: 'Pulled 570K+ shipping records into the warehouse I built and reconciled them line-by-line against the ERP payment ledger.',
    result: 'Proved it was a bookkeeping mis-classification, not missing money: two prepaid carrier wallets booked under one vendor. Counting both, spend matched payments to within ~0.5%; the correction was booked.',
    caveat: 'I built the warehouse and did the reconciliation myself; some downstream financials were confidential above my intern access.' },
];

export const stack = [
  { group: 'AI / LLM', items: ['LangGraph agents', 'RAG · Chroma', 'RAGAS eval', 'Claude / OpenAI'] },
  { group: 'Data / Eng', items: ['multi-source ETL', 'dimensional modeling', 'dbt · BigQuery', 'Python · SQL'] },
  { group: 'ML / Rigor', items: ['buy-intent scoring', 'causal inference', 'OOS backtesting', 'guardrails · eval'] },
  { group: 'BI / Automation', items: ['Power BI · DAX', 'Next.js dashboards', 'n8n workflows', 'star-schema modeling'] },
];

export const links = {
  github: 'https://github.com/cmblum2', linkedin: '#', resume: '#', email: 'camrynblum@gmail.com',
};
