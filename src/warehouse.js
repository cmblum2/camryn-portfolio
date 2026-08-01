// Single source of truth. PUBLIC-SAFE ONLY: employer generalized; no real FHI tokens.
export const LENSES = ['AI', 'ML', 'BI', 'IB'];

// ---- Career warehouse: the query engine's entries ----
export const entries = [
  { id: 'sell', lenses: ['IB', 'BI'],
    keywords: ['sell', 'sold', 'acquisition', 'acquire', 'diligence', '590', 'reconcile', 'books', 'gap', 'audit'],
    plan: "SELECT story FROM career WHERE impact = 'acquisition' ORDER BY stakes DESC → 1 row",
    metric: '$590K → 0.5%', mlabel: 'books gap reconciled',
    headline: 'I helped sell the company.',
    narrative: 'During diligence on the acquisition, the buyer flagged ~$590K paid to a carrier with no matching labels. I pulled 570K+ shipping records into the warehouse I built and reconciled them line-by-line against the ERP ledger — proving it was a bookkeeping mis-classification, not missing money. The correction was booked.',
    lineage: ['multi-platform warehouse', '570K-record reconciliation', 'live acquisition diligence'], hot: 0,
    links: [] },
  { id: 'prove', lenses: ['AI', 'ML', 'IB'],
    keywords: ['prove', 'right', 'accura', 'backtest', 'engine', 'roi', 'campaign', 'trust', 'eval', 'decision'],
    plan: "SELECT verdict, backtest FROM ai_engine WHERE validated = true → 100% OOS",
    metric: '100%', mlabel: 'out-of-sample accuracy, 4 windows',
    headline: 'The engine that proves its own calls.',
    narrative: "A LangGraph + Claude decision engine classifies ad campaigns scale/cut against margin breakeven. Then I backtested it out of sample — recompute every verdict from data before a cutoff, measure what happened after. 100% profitable/unprofitable accuracy; it flagged up to $197K of below-breakeven spend. (Honest caveat: the 'keep' side rested on few campaigns, so I lean on the robust 'stop' side.)",
    lineage: ['SQL warehouse', 'decision engine (LangGraph)', 'out-of-sample dollar backtest'], hot: 1,
    links: [['Repo', 'https://github.com/cmblum2/nl2sql-agent'], ['Live demo', 'https://ask-your-warehouse.streamlit.app']] },
  { id: 'voice', lenses: ['AI', 'ML'], root: 'lab', rootLabel: 'research lab',
    keywords: ['voice', 'realtime', 'audio', 'hands-free', 'speech', 'dictation', 'assistant', 'openai', 'agent'],
    plan: "SELECT story FROM career WHERE domain = 'voice-ai' → 1 row",
    metric: 'full-duplex', mlabel: 'realtime voice agent · co-authored',
    headline: 'A hands-free voice AI for the lab bench.',
    narrative: "I co-authored the voice-agent layer of a research lab's AI assistant — OpenAI Realtime full-duplex audio with function-calling and confirmation gates, so a scientist can run workflows hands-free at the bench. Design focus: safe tool dispatch (the model proposes, a confirmation gate commits) and low-latency turn-taking. (Honest split: this was collaborative — I owned the voice/tool-dispatch flow.)",
    lineage: ['OpenAI Realtime (full-duplex)', 'function-calling + confirmation gates', 'hands-free lab workflows'], hot: 1,
    links: [] },
  { id: 'deploy', lenses: ['AI', 'BI'],
    keywords: ['deploy', 'live', 'running', 'host', 'demo', 'ship', 'url', 'production'],
    plan: "SELECT name, status FROM deployments WHERE state = 'live' → 4 rows",
    metric: '4 live', mlabel: 'public, running systems',
    headline: 'Things that are actually running.',
    narrative: 'NL→SQL agent on Streamlit (role-scoped, self-repairing). RAG assistant on Render (RAGAS-evaluated). dbt+BigQuery warehouse with green CI. And this portfolio itself. Not screenshots — endpoints you can hit right now.',
    lineage: ['Streamlit · agent', 'Render · RAG', 'GitHub Actions · dbt CI'], hot: -1,
    links: [['NL→SQL', 'https://ask-your-warehouse.streamlit.app'], ['RAG', 'https://creator-insight-assistant.onrender.com']] },
  { id: 'warehouse', lenses: ['BI', 'IB'],
    keywords: ['warehouse', 'data', 'pipeline', 'erp', 'source', 'database', 'backbone', 'infrastructure'],
    plan: "SELECT * FROM sources JOIN downstream USING (warehouse_id) → backbone",
    metric: '1 backbone', mlabel: 'ERP · marketplaces · DTC · shipping',
    headline: 'The warehouse everything runs on.',
    narrative: 'I unified ERP, marketplaces, DTC, and shipping into one multi-platform warehouse. It became the backbone of a company sale, the source for the exec BI dashboard, and the substrate my AI engines query. When people ask what I actually built — this is the root node.',
    lineage: ['ERP + marketplaces + DTC + shipping', 'the warehouse', 'audit · dashboards · AI engines'], hot: 1,
    links: [] },
  { id: 'stack', lenses: ['AI', 'ML', 'BI', 'IB'],
    keywords: ['stack', 'tool', 'tech', 'skill', 'langgraph', 'dbt', 'power bi', 'powerbi', 'python'],
    plan: "SELECT tool, proof FROM stack WHERE shipped = true → many rows",
    metric: 'shipped', mlabel: 'each tool maps to a public repo',
    headline: 'Named tools, honestly earned.',
    narrative: 'AI/LLM: LangGraph · RAG · Chroma · RAGAS. Data: dbt · BigQuery · Docker · CI. BI: Power BI · DAX · Next.js. Rigor: causal inference · OOS backtesting · calibration · guardrails. Everything points to a public repo, not a course checklist.',
    lineage: ['raw skills', 'staging (projects)', 'marts (shipped + evaluated)'], hot: 2,
    links: [['dbt repo', 'https://github.com/cmblum2/retail-analytics-dbt']] },
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
  { group: 'AI / LLM', items: ['LangGraph', 'RAG · Chroma', 'RAGAS eval', 'Claude / OpenAI'] },
  { group: 'Data / Eng', items: ['dbt · BigQuery', 'Python · SQL', 'Docker · CI/CD', 'ELT · data tests'] },
  { group: 'BI / Viz', items: ['Power BI · DAX', 'Next.js dashboards', 'star-schema modeling', 'n8n automation'] },
  { group: 'Rigor', items: ['causal inference', 'OOS backtesting', 'calibration · rank-IC', 'guardrails · eval'] },
];

export const links = {
  github: 'https://github.com/cmblum2', linkedin: '#', resume: '#', email: 'camrynblum@gmail.com',
};
