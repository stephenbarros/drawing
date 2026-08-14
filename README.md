# drawing

Pencil Practice — a practice ledger to improve drawing skills. Courses built
around a set of public-domain drawing fundamentals books, a daily exercise
generator, and progress tracking (streaks, a practice heatmap, and optional
photos of your own sketches).

Live at <https://stephenbarros.github.io/drawing/>.
[DESIGN.md](DESIGN.md) is the source of truth for UI decisions;
[CHANGELOG.md](CHANGELOG.md) records what has changed and why.

## Logging a session

The session log lives in [`src/data/log.json`](src/data/log.json) and is
committed to the repo, so it is the same on every device you open the site
on — no accounts, no backend, no sync to set up. Add an entry, commit, and
the deploy workflow rebuilds the site with it.

```json
[
  {
    "date": "2026-08-13",
    "category": "Gesture",
    "exercise": "10 one-minute gesture sketches from photo references",
    "minutes": 25,
    "rating": 3,
    "notes": "wrists still stiff, better by the last three",
    "photo": "2026-08-13-gesture.jpg"
  }
]
```

Only `date`, `category` and `minutes` are required. Entries can be added in
any order — the app sorts by date. `rating` is 1–5.

For a sketch photo, drop the image in `public/sketches/` and put its
filename in `photo`. **Downscale before committing** (~1600px, a few hundred
KB): git keeps every binary forever, so deleting a photo later does not
shrink the repo, and GitHub Pages caps the published site at about 1 GB.

Streak, totals and the heatmap are all computed from this file, so they keep
working without any tracking.

Note that a public repo means a public practice log.

Course lesson ticks are the exception — they stay in your browser's
`localStorage`, since a commit per checkbox would be more friction than they
are worth. They're per-device and don't sync.

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
  data/log.json            — your session log (edit this to log practice)
  lib/storagePolyfill.js   — localStorage-backed window.storage shim
public/
  sketches/                — sketch photos, served at /drawing/sketches/
  pages/                   — book pages cited by each lesson, one JPEG per
                             lesson id (e.g. fp-1-1.jpg), served at
                             /drawing/pages/
```

## Lesson page images

Every lesson shows a thumbnail of the book page it cites, linking to the
full-size scan. The images are extracted from the same public-domain scans the
Library tab links to — Wikimedia Commons and the Internet Archive — and are
named for the lesson id, so `public/pages/fp-1-1.jpg` is what `fp-1-1` displays.

Adding or repointing a lesson means adding a matching JPEG. Beware that the
page reference in `COURSES` does not mean the same thing in every book: for
Successful Drawing, Figure Drawing and Creative Illustration the `~p. N` refs
are PDF page indices, while the other three cite printed page numbers, two of
which need a per-page offset. [CHANGELOG.md](CHANGELOG.md) has the details.
