# camryn-portfolio

Personal portfolio site — AI / ML / BI / IB. Static HTML/CSS/JS, no build step, no dependencies.

## Highlights
- **Role-lens toggle** — the same content reframes for AI, ML, BI, or IB recruiters.
- **Audit-any-claim** case studies — every number shows its method, result, and honest caveat.
- **Content-safety test** — `npm test` fails if any private token leaks into the published content.

## Develop
- `npm test` — lens logic + content-safety guard
- `python -m http.server 8080` then open http://localhost:8080

## Structure
- `src/data.js` — all content (edit here)
- `src/lens.js` — role-lens ordering (pure, tested)
- `src/render.js` — section renderers
- `src/app.js` — bootstrap + toggle wiring
