# Changelog

What changed and why. The commit history has the mechanical detail; this
records the reasoning, which is the part the code doesn't explain on its own.

## 2026-08-14

### Library section headings

"The five (plus one)" becomes **Drawing fundamentals** — the old name counted
the books instead of saying what they were, and the count had already stopped
being self-explanatory.

"Getting these onto the iPad Mini 7" becomes **Reading these on an iPad**. The
specific model was never load-bearing. It stays Apple-specific rather than
going device-neutral, because every step in it is: Safari, Save to Files, Apple
Pencil, iCloud Drive. A heading like "how to view on your device" would promise
Android and desktop instructions that the section doesn't contain — a heading
should not write a cheque its content can't cash.

### Renamed to Pencil Practice, and added a footer

"Studio Log" becomes **Pencil Practice**, with the tagline "a practice ledger
to improve drawing skills". The name now lives in one place, `siteName` /
`siteTagline` / `siteAuthor` in `App.jsx`, which the header, the document title
and the footer all read from — previously the name was typed separately into
the wordmark and `index.html`, which is how those drift apart.

The tagline came out of the header. At 28/900 the wordmark carries that space
on its own, and the new tagline is a full sentence rather than the three words
that used to sit beside it — as a header lockup it competed with the name.

It reappears in a new footer, closing every tab, alongside the name and a
copyright line. The year is computed rather than written down. The footer sits
directly on the sage canvas rather than in a card, because it is a page fixture
and not content, and it takes no divider — the system's divider colour is the
same sage it would sit on.

One deliberate departure: the footer uses `body`, not the `mute` the system
specifies for fine print. `mute` fails WCAG AA at 12px, which DESIGN.md has
recorded as a known gap since the restyle, and there was no reason to add fresh
text to it. That leaves the palette inconsistent until the existing captions
follow, so it's written down rather than left looking accidental.

Also added a `<meta name="description">`, which the page never had.

### Thumbnails open a dialog instead of the raw file

Tapping a page used to navigate to the JPEG. Getting back meant a browser
back-navigation, which reloaded the app and collapsed the course you were
reading — expensive for what is usually a two-second glance at a plate.

It now opens over the course list, and the list is still there behind it.
Scrim click, Escape, and a close button all dismiss; focus moves to the close
button on open and returns to the thumbnail after, and the page behind stops
scrolling while it is up.

The thumbnail stays an `<a>` pointing at the real file, with a plain click
intercepted. Cmd-click, middle-click and "open in new tab" therefore still work
exactly as before, and the dialog carries an "Open full size" link — the old
behaviour is still reachable, just no longer the only option.

Two layout notes, both load-bearing. The image sizes itself and centres rather
than filling the panel: these pages are portrait and the panel is not, so
stretching it letterboxed every scan in sage. And its height is capped with
`calc(100vh - 200px)` rather than a percentage — the panel's height comes from
its content, so `max-height: 100%` on the image resolves against a height that
depends on the image and collapses it to zero. Both are recorded in DESIGN.md,
the second under Known gaps, since the 200px is the dialog's own chrome written
as a constant.

### Page thumbnails on every lesson

Each lesson row now carries a thumbnail of the page it cites, linking to the
full-size scan. 83 lessons, 83 images in `public/pages/`, named for the lesson
id. 9.2 MB total, at ~1000px on the long edge and JPEG quality 55 — legible
enough to read a plate, small enough that the repo does not regret it.

Sourcing the right page turned out to be the whole job. Three separate
numbering schemes are in play:

- **Fun With a Pencil** — scan page equals printed page. Verified against the
  folio printed on each page used.
- **Successful Drawing, Figure Drawing, Creative Illustration** — the `~p. N`
  refs in `COURSES` are *PDF page indices*, not printed pages. They read like
  rough estimates and are not: PDF page 40 of Successful Drawing is
  "Architects' Perspective", exactly what `sd-2-2` asks for. All 31 of these
  matched their lesson text on inspection.
- **Drawing the Head and Hands, Constructive Anatomy** — printed pages, needing
  an offset. Constructive Anatomy is a constant +4. Head and Hands is **not
  constant**: it runs −4 early and −14 by the end, because the scan skips pages
  the printed numbering still counts. A fixed offset derived from one probe
  looked right in the first chapter and was eight pages out by the last.

Since both of those scans are image-only (no text layer), the offsets came from
OCR'ing the footer of all 365 pages with the system Vision framework and reading
the folio each page prints on itself, then interpolating across unnumbered
plates. Worth knowing if this is ever redone: the offset is not monotonic in
either direction — inserted plates push it one way, skipped pages the other — so
a filter assuming a fixed drift direction silently locks onto a wrong constant.

Verified by OCR'ing the heading off all 83 generated images and diffing against
the lesson titles, plus visual checks on the plate pages, which carry no heading
to read.

Each thumbnail is the first page of the range its lesson cites. Where a Head and
Hands lesson names a plate, it points at that plate instead — the cited ranges
there often open on a page of prose, and the plate is the reason the lesson
sends you to the book.

Text-heavy pages elsewhere were left alone: they were checked by OCR character
count, and the six dense ones in Figure Drawing and Creative Illustration are
the correct page — Loomis simply wrote a page of prose there, and `fd-3-1`
really is "Variety in the Standing Pose".

### Corrected 25 lesson page references

Rendering each cited page beside its lesson made it obvious where the citation
was wrong. 25 of 83 refs were repointed. The lessons themselves are unchanged;
only the page numbers moved, and each new one was confirmed against the page's
own heading or plate caption.

**Fun With a Pencil — 16 of 17 refs.** Most were one or two pages early, and a
few pointed somewhere else entirely: `fp-2-5` ("Construct a hand and a pair of
feet") cited p. 71, "Freak Hats", when The Hand and Feet are p. 72–73;
`fp-1-2` ("Add a second line to turn the ball into a head") cited p. 35–39,
"Brats", when the page actually titled "We Add Another Line to the Ball" is
p. 21. `fp-1-5` wanted the square-grid caricature method and cited p. 32,
"Projection", a different technique — the grid is p. 33, "Variety by
Distortion". Fixed by OCR'ing all 122 pages into a heading index and matching
each lesson to the page that teaches it.

**Drawing the Head and Hands — 9 of 18 refs.** Every lesson here also names
plates, which gave an independent check: resolve the plate to its page and see
whether it lands in the cited range. Four did not. In all four the plates were
right and the range was wrong — `hh-1-2` ("Simplified skull landmarks over the
ball") cited p. 19–24, but Plates 5–6, "Simplified bone structure" and "The
bony parts within the construction", are on p. 27–28. The other five `~p.`
refs contained their plates but had loose ends (`hh-2-2` cited p. 75–81 for
plates spanning p. 81–84), so all nine were rewritten to the exact plate span.
Every `~` is gone from this book; the refs now run monotonically from p. 21 to
p. 147, which they did not before.

The 31 `~p.` refs that remain, in Successful Drawing, Figure Drawing and
Creative Illustration, are the PDF-index ones described above. They are
accurate as-is. They would read better as printed page numbers, but converting
them means renumbering against a different scheme and is left for its own
change.

### Per-course PDF links

Each course cell links to its scan, opposite the lesson count. Lessons cite
page numbers, so the book belongs one tap away rather than a trip to the
Library tab. Courses match Library entries by title — all six resolve. The
link stops propagation so opening it doesn't also expand the card it sits in.

Removed the pencil icon beside the "Studio Log" title.

### Tab bar overflow at 375px — real fix

The narrow-width media query had been setting `padding-left/right` on the tab
buttons, which never applied: the buttons carry an inline `padding`, and inline
styles win. The icon-hiding rule beside it was doing all the work. That held
until the Wise restyle brought in Inter, whose wider metrics pushed the row 3px
past the viewport.

The inline padding now reads `var(--tab-pad, 16px)` and the media query sets
`--tab-pad: 10px`. Custom properties resolve at computed-value time, so this
overrides the inline style without `!important`.

## 2026-08-13

### Course caret now reads as expand/collapse

A right-facing chevron promises navigation to a new view; these cards expand in
place. Collapsed now shows a down chevron that rotates to point up when open.

The Wise design system defines no accordion or disclosure pattern and gives no
icon guidance at all, so the direction convention here is general UI convention,
not something the system specifies. The chevron sits in `button-icon-circular`,
which *is* a system primitive — with a sage fill instead of the specified canvas
fill, which would vanish against a white card.

Known gap: the card header is a `div` with `aria-expanded`, so the state is
announced but the control isn't keyboard-operable. Making it a real `<button>`
means changing how `Card` composes children.

### Restyled with the Wise design system

Tokens from [getdesign.md/wise/design-md](https://getdesign.md/wise/design-md):
lime `#9fe870` primary, sage `#e8ebe6` canvas, white cards, ink `#0e0f0c`, a 4px
spacing scale, 24px as the canonical card/button radius.

The structural change is elevation: that system uses surface contrast rather
than borders, so the 1.5px ink outlines came off everything and cards became
white-on-sage. Type moved to Inter throughout, weight 900 standing in for the
proprietary Wise Sans display face — that substitute is the spec's own
recommendation.

Two deliberate deviations:

- **Lesson checkboxes use `inkDeep`, not primary.** A white tick on `#9fe870`
  doesn't carry enough contrast.
- **Stat cards are white, not sage.** Built sage first, which made them
  invisible against the sage canvas — defeating the one rule the system is
  built on.

Primary green is reserved for actions, per the system's own instruction not to
repurpose it as a status colour: "Give me another" is the CTA pill, the streak
is a pale-green status badge, and the heatmap uses a green density ramp.

**New dependency:** Inter loads from Google Fonts. Weight 900 needs the real
font file; system fallbacks synthesize it badly.

### Session log moved into the repo

The log lives in `src/data/log.json` and ships with the build, so it's identical
on every device with no accounts, tokens, or backend — git is the sync layer.

This replaced a plan to sync via Google Drive or Dropbox, which would have meant
OAuth, a token in browser storage, and an app registration. The log is three
JSON blobs and some images; that's a file-sync problem, not a database one.

Streak, totals and the heatmap were always *computed* from the log, so they keep
working — "manual" means manual entry, not losing the visualizations. Entries
sort by date on load, so the file can be appended to in any order.

Sketch photos go in `public/sketches/` as real files, which also lifts them out
of the ~5MB localStorage ceiling they shared as base64 data URIs.

Trade-offs accepted:

- A public repo means a public practice log.
- Logging is a commit plus a ~1 minute rebuild.
- Git keeps binaries forever — deleting a photo later doesn't shrink the repo,
  so downscale before committing. Pages caps the published site around 1GB.

Course lesson ticks stayed in `localStorage`: they change several times a
session, and a commit per checkbox would be more friction than they're worth.
They're per-device and don't sync.

### Form spacing fixes

- Added a global `box-sizing: border-box` reset. Inputs set `width: 100%` but
  also carried 10px padding and a 1.5px border, so under content-box the notes
  textarea rendered 23px wider than its card and spilled past the border.
- Made the field label a flex column so a caption always sits above its control.
  As a plain inline `<label>`, "Minutes" shared a line with its input and
  collided, while "How it felt" — which wrapped a block `div` — did not.

### Deployed to GitHub Pages

Live at <https://stephenbarros.github.io/drawing/>.

Set `base: "/drawing/"` and added `.github/workflows/deploy.yml` using the
official `upload-pages-artifact` + `deploy-pages` flow. Pages source set to
"GitHub Actions" via `gh api`. No `gh-pages` branch.

The initial commit contained only the README — all app source was untracked
until this point.

Known warning, not a failure: `actions/checkout@v4`, `setup-node@v4` and
`upload-artifact@v4` target Node 20, which GitHub is deprecating on runners, so
they're forced onto Node 24. This concerns the actions' own runtime, not the
`node-version: 20` build. Moving to the `@v5` actions will silence it.
