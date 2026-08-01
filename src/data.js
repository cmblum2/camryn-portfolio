// Single source of truth for all site content.
// PUBLIC-SAFE ONLY: employer generalized to "a ~$30M consumer-products company".
// No real numbers beyond what interview-stories.md already approved for public use.

export const LENSES = ['AI', 'ML', 'BI', 'IB'];

export const profile = {
  name: 'Camryn Blum',
  kicker: 'CS + Data Science · UW–Madison',
  taglines: {
    AI: 'Applied AI, measured in outcomes.',
    ML: 'Models that prove their calls — in dollars.',
    BI: 'Decision-grade dashboards and data models.',
    IB: 'Every call quantified — and stress-tested.',
    default: 'Applied AI, measured in outcomes.',
  },
  subs: {
    AI: 'Retrieval-grounded systems and decision engines — evaluated, deployed, validated out of sample. Code decides; the model narrates.',
    ML: 'Causal ROI, calibration, and out-of-sample backtests — the fundamentals, shown, not claimed.',
    BI: 'Exec dashboards, star-schema models, and DAX — built to change decisions, not just display data.',
    IB: 'Diligence-grade reconciliation, build-vs-buy simulation, and financial models that survive an auditor.',
    default: 'Retrieval-grounded systems and decision engines — evaluated, deployed, validated out of sample.',
  },
};

// Hero stats. `lenses` = which lenses feature this metric first.
export const metrics = [
  { value: '100%', label: 'out-of-sample classification accuracy, 4 windows', lenses: ['AI', 'ML', 'IB'] },
  { value: '$590K', label: 'books discrepancy reconciled to 0.5% variance', lenses: ['IB', 'BI'] },
  { value: '+75%', label: 'retrieval recall from an MMR fix, caught by eval', lenses: ['AI', 'ML'] },
  { value: '8/8', label: 'eval pass on the deployed LangGraph SQL agent', lenses: ['AI', 'BI'] },
  { value: '$36K/yr', label: 'saved by a data-backed build-vs-buy "no"', lenses: ['IB', 'BI'] },
  { value: '3.7×', label: 'realized ROAS on campaigns flagged healthy', lenses: ['ML', 'IB'] },
];

// Featured projects (ordered per lens by lens.js).
export const projects = [
  { id: 'nl2sql', title: 'Ask-Your-Warehouse — NL→SQL agent', lenses: ['AI', 'BI'],
    blurb: 'LangGraph + Claude turns plain questions into governed SQL with guardrails and self-repair. Eval: 8/8.',
    tags: ['LangGraph', 'guardrails', 'eval'],
    repo: 'https://github.com/cmblum2/nl2sql-agent',
    demo: 'https://ask-your-warehouse.streamlit.app' },
  { id: 'rag', title: 'Creator Insight Assistant — RAG', lenses: ['AI', 'ML'],
    blurb: 'Chroma + LangGraph + Claude with a RAGAS harness; an MMR fix lifted context recall +75%.',
    tags: ['RAG', 'Chroma', 'RAGAS'],
    repo: 'https://github.com/cmblum2/creator-insight-assistant',
    demo: 'https://creator-insight-assistant.onrender.com' },
  { id: 'roi', title: 'Causal marketing-ROI engine', lenses: ['ML', 'IB'],
    blurb: 'Refund-adjusted order-level attribution, matched-control diff-in-diff with CIs, out-of-sample dollar backtest.',
    tags: ['causal inference', 'backtest', 'calibration'] },
  { id: 'dashboard', title: 'Executive BI dashboard', lenses: ['BI', 'IB'],
    blurb: 'Next.js dashboard over a multi-platform warehouse; caught an upstream mart inflating a channel ~12×.',
    tags: ['Next.js', 'BI', 'data quality'] },
  { id: 'powerbi', title: 'Power BI revenue/GMV rebuild', lenses: ['BI'],
    blurb: 'Star-schema model with DAX measures (revenue, AOV, gross-margin %, MoM) and interactive filters.',
    tags: ['Power BI', 'DAX', 'star schema'] },
  { id: 'fbt', title: 'Fulfilled-by-TikTok build-vs-buy', lenses: ['IB', 'BI'],
    blurb: 'Per-SKU simulation of ~11.6K orders vs the exact rate card + a natural experiment. Recommended NO.',
    tags: ['simulation', 'build-vs-buy', 'finance'] },
  { id: 'dbt', title: 'dbt + BigQuery warehouse', lenses: ['BI', 'AI'],
    blurb: 'ELT with data tests, lineage, and a green GitHub Actions CI pipeline on synthetic data.',
    tags: ['dbt', 'BigQuery', 'CI'],
    repo: 'https://github.com/cmblum2/retail-analytics-dbt' },
];

// Signature "audit any claim" case studies.
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

export const demos = [
  { title: 'Ask-Your-Warehouse — NL→SQL agent', live: true,
    blurb: 'LangGraph + Claude turns plain questions into governed SQL with guardrails and self-repair. Eval: 8/8.',
    url: 'https://ask-your-warehouse.streamlit.app' },
  { title: 'Creator Insight Assistant — RAG', live: true,
    blurb: 'Chroma + LangGraph + Claude with a RAGAS harness. An MMR fix lifted context recall +75%.',
    url: 'https://creator-insight-assistant.onrender.com' },
];

export const links = {
  github: 'https://github.com/cmblum2', linkedin: '#', resume: '#', email: 'camrynblum@gmail.com',
};
