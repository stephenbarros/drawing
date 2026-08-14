---
version: 1
name: studio-log-design
description: The UI system for Studio Log — a drawing-practice tracker. Derived from the Wise design analysis at getdesign.md: a lime-green accent reserved for actions, sage-tinted canvas, white cards carrying no borders or shadows, and Inter at weight 900 for display. Documents the app's own components and the places it deliberately departs from its source.

colors:
  primary: "#9fe870"          # the one accent — actions only
  primary-neutral: "#c5edab"
  primary-pale: "#e2f6d5"
  on-primary: "#0e0f0c"
  positive-deep: "#054d28"
  ink: "#0e0f0c"
  ink-deep: "#163300"
  body: "#454745"
  mute: "#868685"
  canvas: "#ffffff"
  canvas-soft: "#e8ebe6"

typography:
  font-family: "'Inter', system-ui, -apple-system, sans-serif"
  display-stat:
    fontSize: 32px
    fontWeight: 900
    lineHeight: 38px
    letterSpacing: -0.96px
  display-wordmark:
    fontSize: 28px
    fontWeight: 900
    letterSpacing: -0.6px
  display-xs:
    fontSize: 24px
    fontWeight: 600
    lineHeight: 31.2px
    letterSpacing: -0.48px
  body-md:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  button-md:
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-sm:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  section-label:
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.06em
    textTransform: uppercase

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  xxxl: 48px

radius:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px

layout:
  container: 720px
  page-padding: "{spacing.xl} {spacing.lg} {spacing.xxxl}"
  page-background: "{colors.canvas-soft}"

components:
  page:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
  nav-bar:
    backgroundColor: "{colors.canvas}"
    padding: "{spacing.xl} {spacing.lg} {spacing.md}"
    border: none
    shadow: none
  wordmark:
    typography: "{typography.display-wordmark}"
    textColor: "{colors.ink}"
  tab:
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.sm} var(--tab-pad, {spacing.lg})"
    radius: "{radius.pill}"
    iconSize: 15
    default: { backgroundColor: transparent, textColor: "{colors.body}" }
    active: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}" }
  card:
    backgroundColor: "{colors.canvas}"
    radius: "{radius.xl}"
    padding: "{spacing.xl}"
    marginBottom: "{spacing.lg}"
    border: none
    shadow: none
  card-feature-green:
    backgroundColor: "{colors.primary-pale}"
    radius: "{radius.xl}"
    padding: "{spacing.xl}"
    typography: "{typography.display-xs}"
  stat-card:
    backgroundColor: "{colors.canvas}"
    radius: "{radius.xl}"
    padding: "{spacing.lg} {spacing.md}"
    valueTypography: "{typography.display-stat}"
    labelTypography: "{typography.caption}"
    labelColor: "{colors.body}"
  section-label:
    typography: "{typography.section-label}"
    textColor: "{colors.mute}"
    marginBottom: "{spacing.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    padding: "{spacing.md} {spacing.xl}"
    radius: "{radius.xl}"
    border: none
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    borderWidth: 1px
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.sm} {spacing.lg}"
    radius: "{radius.xl}"
  chip:
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.sm} {spacing.lg}"
    radius: "{radius.pill}"
    border: none
    default: { backgroundColor: "{colors.canvas-soft}", textColor: "{colors.body}" }
    active: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}" }
  badge-status:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.positive-deep}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.xs} {spacing.md}"
    radius: "{radius.pill}"
  disclosure-toggle:
    size: 36
    backgroundColor: "{colors.canvas-soft}"
    iconColor: "{colors.ink}"
    iconSize: 20
    radius: "{radius.pill}"
    closed: { transform: "rotate(0deg)" }
    open: { transform: "rotate(180deg)" }
    transition: "transform 0.2s ease"
  progress-bar:
    height: 8
    trackColor: "{colors.canvas-soft}"
    fillColor: "{colors.primary}"
    radius: "{radius.pill}"
    transition: "width 0.3s"
  checkbox:
    accentColor: "{colors.ink-deep}"
    size: 16
  list-row:
    padding: "{spacing.md} 0"
    borderBottom: "1px solid {colors.canvas-soft}"
    typography: "{typography.body-sm}"
  inline-code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: 0.92em
    backgroundColor: "{colors.canvas-soft}"
    padding: "2px 6px"
    radius: "{radius.sm}"
  sketch-image:
    radius: "{radius.lg}"
    maxWidth: 100%
  heatmap-cell:
    size: 12
    radius: 4
    gap: 3
---

## Provenance

The tokens here derive from the Wise design analysis published at
[getdesign.md/wise/design-md](https://getdesign.md/wise/design-md), an
independent study of publicly observable patterns. That analysis is not
affiliated with or endorsed by Wise; Wise and its logo are trademarks of their
respective owner. This file documents how Studio Log applies those tokens,
including where it departs from them — it is not a copy of the source analysis.

**This file is the source of truth for UI decisions.** When the interface
changes, change this first (or alongside), so the reasoning lives somewhere
more durable than a diff. Values here are mirrored in the token block at the
top of `src/App.jsx`; the two must stay in step.

## Overview

Studio Log is a practice ledger, so the interface should stay quiet and let the
content — exercises, lesson lists, a density grid — carry the page. The system
gives it three moves:

1. **Surface contrast instead of borders.** White cards sit on a sage canvas.
   Nothing has a shadow and almost nothing has a border. The difference between
   `canvas` and `canvas-soft` is the entire elevation model.
2. **One accent, spent carefully.** Lime `primary` marks the active tab, the
   selected chip, the CTA, and the progress fill. That is the whole list. Green
   used everywhere would stop meaning anything.
3. **Weight, not size, for hierarchy.** Display type is Inter 900. Body text
   stays 400/600 at 14–16px. The jump from 600 to 900 does the work that a
   second typeface would in another system.

## Colors

### Accent

| Token | Value | Use |
|---|---|---|
| `primary` | `#9fe870` | Active tab, selected chip, CTA fill, progress fill, densest-but-one heatmap step |
| `primary-neutral` | `#c5edab` | Heatmap mid step only |
| `primary-pale` | `#e2f6d5` | Feature-card fill, status badge background, lightest heatmap step |
| `on-primary` | `#0e0f0c` | Text and icons sitting on `primary` |
| `positive-deep` | `#054d28` | Text on `primary-pale` status surfaces |

### Surface

| Token | Value | Use |
|---|---|---|
| `canvas` | `#ffffff` | Cards, nav bar |
| `canvas-soft` | `#e8ebe6` | Page background, chip default fill, dividers, progress track, empty heatmap cells, inline code |

`canvas-soft` does double duty as both the page ground and a fill for elements
sitting *on* white. That is fine as long as the two never meet: a
`canvas-soft` element on the `canvas-soft` page is invisible. This has already
caught us once — see Deviations.

### Text

| Token | Value | Use |
|---|---|---|
| `ink` | `#0e0f0c` | Headings, primary body, icons |
| `ink-deep` | `#163300` | Checkbox accent, densest heatmap step |
| `body` | `#454745` | Secondary text, inactive tabs, stat labels |
| `mute` | `#868685` | Section labels, captions, page references, fine print |

## Typography

One family, Inter, loaded from Google Fonts at 400/600/900. Weight 900 is a
real file, not a synthesized bold — the system's display voice depends on it,
and a fallback stack fakes it badly.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Stat value | 32 | 900 | 38 | -0.96px |
| Wordmark | 28 | 900 | — | -0.6px |
| Card title / feature text | 24 | 600 | 31.2 | -0.48px |
| Body, CTA label | 16 | 400 / 600 | 24 | — |
| Secondary body, tabs, links | 14 | 400 / 600 | 20 | — |
| Caption, section label | 12 | 400 / 600 | 16 | — (label: 0.06em, uppercase) |

Section labels are the one place with letterspacing and uppercase. They are
structural signposts, not content, and `mute` keeps them from competing.

## Layout

- Base unit 4px; the spacing scale runs 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48.
- Content column caps at **720px** and centres.
- Page padding is 24px top, 16px sides, 48px bottom.
- Cards are 24px inside, 16px apart.

### Responsive

There is one breakpoint, at **460px**, and it does two things: hides the tab
icons and tightens tab padding to 10px via `--tab-pad`.

That custom property exists for a specific reason. Tab buttons are styled
inline, and inline styles beat stylesheet rules — a plain `padding` declaration
in the media query silently does nothing. A custom property resolves at
computed-value time, so the media query can set it and the inline `padding`
picks it up. **Any future responsive override of an inline style needs this
same treatment**, or it will appear to work while doing nothing.

## Elevation

There is none. No `box-shadow` appears anywhere in the app, by design.

| Level | Treatment |
|---|---|
| Flat | Default for everything |
| Hairline | 1px solid `ink` — tertiary buttons only |
| Card | White on sage; the contrast *is* the elevation |

## Shape

24px (`radius.xl`) is the signature: cards, buttons, feature surfaces. Pills
(`radius.pill`) take anything small and interactive — tabs, chips, badges, the
progress bar, the disclosure toggle. 16px for images, 8px for inline code, 4px
for heatmap cells. Nothing in the UI has square corners.

## Components

Full property values are in the frontmatter. Notes on intent:

**`card`** — the default container. White, 24px radius, 24px padding, no border,
no shadow. Everything on a tab is a card or lives in one.

**`card-feature-green`** — `primary-pale` fill, used once, for the day's
exercise. It is the focal point of the Today tab and earns the tint by being
the only one.

**`stat-card`** — white like every other card, holding a 32/900 number.

**`tab`** — pill, `body-sm-strong`. Active is `primary` with `on-primary` text.
Icons hide below 460px.

**`chip`** — same pill geometry as tabs but `canvas-soft` by default, so a row
of them reads as a group of options rather than navigation.

**`button-primary`** — the lime CTA. Currently used once ("Give me another").
If a second primary action ever appears on the same view, one of them is not
primary.

**`button-tertiary`** — white with a 1px `ink` hairline. Secondary actions and
outbound links.

**`badge-status`** — `primary-pale` with `positive-deep` text. Status only, e.g.
the streak. Deliberately *not* `primary`, so status never impersonates an action.

**`disclosure-toggle`** — a 36px circle holding a chevron that points down when
closed and rotates 180° when open. A right-facing chevron would promise
navigation to a new view; these panels expand in place. Carries `aria-expanded`.

**`progress-bar`** — 8px, pill, `canvas-soft` track, `primary` fill.

**`heatmap-cell`** — 12px squares on a 3px gap, ramped by minutes practised:

| Minutes | Fill |
|---|---|
| 0 | `canvas-soft` |
| < 15 | `primary-pale` |
| < 30 | `primary-neutral` |
| < 60 | `primary` |
| ≥ 60 | `ink-deep` |

## Deviations from the source analysis

Recorded so they read as decisions rather than drift.

1. **`disclosure-toggle` uses a `canvas-soft` fill.** The source specifies
   `canvas` (white) for its circular icon button. On a white card that is
   invisible, so the circle takes the sage fill instead.
2. **Checkboxes accent with `ink-deep`, not `primary`.** A white tick on
   `#9fe870` does not carry enough contrast.
3. **Stat cards are white, not sage.** They were built sage first, which put a
   `canvas-soft` element on the `canvas-soft` page and erased them. Contrast is
   the elevation model; sage-on-sage has none.
4. **No dark mode.** The source defines light tokens only, and nothing here
   adds a dark palette. If one is ever wanted it needs designing, not inverting.
5. **The disclosure pattern is ours.** The source defines no accordion,
   collapsible, or disclosure component, and gives no icon guidance at all. The
   chevron-direction convention is general UI convention, not something
   inherited.

## Do

- Reserve `primary` for actions and selection. Status uses `badge-status`.
- Reach for `card` before inventing a container.
- Use weight to build hierarchy before reaching for a larger size.
- Check any `canvas-soft` element against the surface behind it.
- Pull values from the scales rather than typing new numbers.

## Don't

- Don't add shadows. Elevation is surface contrast.
- Don't introduce a second accent colour.
- Don't set display type below weight 900, or body type above 600.
- Don't use square corners.
- Don't override an inline style from a media query without a custom property.
- Don't put `primary` text on a `primary` or `primary-pale` fill.

## Known gaps

- **`mute` fails WCAG AA for normal text.** Measured: **3.64:1** on `canvas`
  and **3.03:1** on `canvas-soft`, against a 4.5:1 requirement. It is used at
  12px, so the large-text 3:1 allowance does not apply. This is inherited from
  the source analysis, not introduced here, and it affects section labels,
  captions, page references, and the tagline. Darkening `mute` toward `body`
  (`#454745`, which measures 9.37:1) would fix it.

  Everything else checks out: `ink` on `canvas` 19.23:1, `body` on `canvas`
  9.37:1, `on-primary` on `primary` 13.05:1, `positive-deep` on `primary-pale`
  8.76:1.

- The course card header is a `div` with `aria-expanded`. State is announced,
  but it is not keyboard-operable — no tab focus, no Enter/Space. Fixing it
  means making the header a real `<button>`.
- No focus-visible styling is defined anywhere.
