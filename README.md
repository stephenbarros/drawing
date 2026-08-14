# drawing

Studio Log — a self-guided drawing practice tracker. Courses built around
a set of public-domain drawing fundamentals books, a daily exercise
generator, and progress tracking (streaks, a practice heatmap, and
optional photos of your own sketches).

Progress is stored locally in your browser (`localStorage`) — nothing is
sent to a server, so it's per-device.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## Deploying to GitHub Pages

Live at <https://stephenbarros.github.io/drawing/>.

Deploys happen automatically: every push to `main` runs
`.github/workflows/deploy.yml`, which builds and publishes `dist/` via
GitHub Pages (Pages source is set to "GitHub Actions" — there is no
`gh-pages` branch). `base: "/drawing/"` in `vite.config.js` is what makes
asset paths resolve under the repo sub-path; if the repo is ever renamed,
that value has to change with it.

## Structure

```
src/
  App.jsx                  — the whole app (tabs, courses, exercises, progress)
  main.jsx                 — entry point
  lib/storagePolyfill.js   — localStorage-backed window.storage shim
```
