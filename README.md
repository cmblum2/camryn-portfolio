# camryn-portfolio

The source for my portfolio, live at **[camrynblum.me](https://camrynblum.me)**. Hand-built — vanilla
HTML/CSS/JS ES modules, a ~40-line prerender step, a `node --test` suite, and a scheduled status cron.
No framework, no CSS library, no runtime dependencies.

## Why it's built the way it is

The interesting decisions here are the same ones I'd defend in a review — each is a problem → decision → why.

- **One source of truth, prerendered to static HTML.** All content lives in `src/warehouse.js`; `build.js`
  renders it (plus the lineage graph and the UI mockups) into a fully-populated, committed `index.html`.
  **Why:** the site's story has to be legible to things that don't run JS — AI/ATS résumé scanners, a
  recruiter who skims for ten seconds, `curl`. So the *served* HTML is complete on its own, with JSON-LD
  structured data; `src/app.js` then progressively enhances that same DOM (role filter, accordion cards,
  the graph self-draw, live status). Nothing the crawler needs is trapped behind a script.

- **A content-safety test, because the source is a private vault.** This site is generated from a private
  Obsidian vault full of real employer figures. `tests/safety.test.js` runs the rendered content against a
  denylist (`tests/denylist.local.js`) and **fails the build if a confidential number, handle, or internal
  system name leaks into what would be published.** **Why:** "don't paste the wrong number" is not a
  process I trust myself to do by hand every time — it's a test. The publish boundary is enforced in CI,
  not in my memory.

- **A role lens that's a pure, tested function.** `src/lens.js` reframes the same projects for AI, ML, BI,
  or IB readers; it's a pure function with its own unit tests (`tests/lens.test.js`) so the ordering logic
  can't silently break when I edit content. **Why:** the content and the presentation logic are separable,
  and the part with logic gets tests.

- **Live status, not screenshots of "it works."** `src/status.js` + the `status.yml` GitHub Action poll my
  deployed demos every ~30 min and commit `status.json`; the nav renders green/amber/red badges from it.
  **Why:** a portfolio that *claims* live demos should prove it in real time — and a red dot is more
  honest than a stale screenshot.

- **Deterministic and dependency-free.** Vanilla ES modules, `node --test`, prerender over a bundler.
  **Why:** the whole thing should still build and pass in five years with no `npm install` archaeology.

## Develop

```bash
npm run build     # prerender src/warehouse.js -> index.html   (rerun after editing content or template)
npm test          # 22 tests: engine, lens, status, content-safety denylist
python -m http.server 8080   # then open http://localhost:8080
```

**After any change to `src/warehouse.js` or `template.html`, run `npm run build`** — the committed
`index.html` is what GitHub Pages serves.

## Structure

- `src/warehouse.js` — all content (the single source of truth; edit here)
- `build.js` / `template.html` — prerender content + graph + mockups into `index.html`
- `src/app.js` — progressive enhancement: role filter, accordion cards, reveal/graph motion, live status
- `src/lens.js` — role-lens ordering (pure, tested) · `src/render.js` — section renderers
- `src/graph.js` — the source→warehouse→tools lineage SVG · `src/viz.js` — the per-project UI mockups
- `src/status.js` + `.github/workflows/status.yml` — live system-status polling → `status.json`
- `styles.css` — the monochrome design system (Bebas Neue / Oswald / Archivo; white/gray value bands)
- `tests/` — `engine`, `lens`, `status`, `safety` (+ `denylist.local.js`)

## Stack

Vanilla JS (ES modules) · a hand-rolled prerender build · `node --test` · GitHub Pages + Actions
(status cron) · custom domain via `CNAME`. No framework, no dependencies.
