import React, { useState, useEffect, useMemo, useCallback } from "react";
import logEntries from "./data/log.json";
import {
  Pencil, BookOpen, TrendingUp, ExternalLink,
  ChevronDown, Shuffle, Flame, Library
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens. See DESIGN.md in the repo root — it is the source of truth
// for UI decisions and records why these values are what they are. Keep the
// two in step: change DESIGN.md alongside anything changed here.
//
// Surface contrast carries elevation in this system: white cards sit on the
// sage canvas and take no border and no shadow. Lime green is the single
// brand accent and is reserved for primary actions — the semantic palette
// covers status, so green is never repurposed as a "success" colour.
// ---------------------------------------------------------------------------
const primary = "#9fe870";       // Wise green — the one accent, CTAs only
const primaryNeutral = "#c5edab";
const primaryPale = "#e2f6d5";
const positiveDeep = "#054d28";  // status text on pale-green surfaces
const onPrimary = "#0e0f0c";
const ink = "#0e0f0c";           // near-black with an olive cast
const inkDeep = "#163300";       // deep forest green
const body = "#454745";          // secondary text
const mute = "#868685";          // captions, fine print
const canvas = "#ffffff";        // card interiors
const canvasSoft = "#e8ebe6";    // sage page background, dividers

// 4px base unit
const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 9999 };

// Wise Sans is proprietary; the system names Inter 900 as its substitute for
// display and Inter as its actual second face, so one family covers both.
const displayFont = "'Inter', system-ui, -apple-system, sans-serif";
const bodyFont = "'Inter', system-ui, -apple-system, sans-serif";

// ---------------------------------------------------------------------------
// Content — courses built around the five core books
// ---------------------------------------------------------------------------
const COURSES = [
  {
    id: "fun-pencil",
    book: "Fun With a Pencil",
    author: "Loomis",
    tagline: "Start here — the friendliest entry point (122 pages, 3 parts)",
    modules: [
      { id: "fp-1", title: "Part One — Funny Faces (the ball & plane method)", lessons: [
        { id: "fp-1-1", title: "Draw 15 heads from a simple divided ball, no reference", page: "p. 15–20" },
        { id: "fp-1-2", title: "Add a second line to turn the ball into a head at an angle", page: "p. 21" },
        { id: "fp-1-3", title: "Push a few heads into 'blocky' character studies", page: "p. 23–24" },
        { id: "fp-1-4", title: "Same head, six expressions", page: "p. 25–27" },
        { id: "fp-1-5", title: "Distort a head for caricature (square-grid method)", page: "p. 33" },
        { id: "fp-1-6", title: "Draw the same head as a baby, a kid, and an old-timer", page: "p. 34–35, 47–49" },
      ]},
      { id: "fp-2", title: "Part Two — Putting the Head on the Body", lessons: [
        { id: "fp-2-1", title: "Build the simplified action-figure framework (the 'doohinkus')", page: "p. 55–56" },
        { id: "fp-2-2", title: "Pose the framework off-balance, in motion", page: "p. 57" },
        { id: "fp-2-3", title: "Flesh out one framework pose into a full figure", page: "p. 60–61" },
        { id: "fp-2-4", title: "Dress a figure — try a suit, a dress, and a hat", page: "p. 68–70" },
        { id: "fp-2-5", title: "Construct a hand and a pair of feet on a simple figure", page: "p. 72–73" },
        { id: "fp-2-6", title: "Draw one pose with basic foreshortening", page: "p. 94" },
      ]},
      { id: "fp-3", title: "Part Three — A World for Your Figures to Live In", lessons: [
        { id: "fp-3-1", title: "Place a figure correctly on the ground in perspective", page: "p. 99" },
        { id: "fp-3-2", title: "Project a piece of furniture onto a ground plane", page: "p. 102–103" },
        { id: "fp-3-3", title: "Build a simple room interior from a ground plan", page: "p. 104–107" },
        { id: "fp-3-4", title: "Light a figure and cast its ground shadow", page: "p. 108–109" },
        { id: "fp-3-5", title: "Finish with a from-life sketch, applying the whole method", page: "p. 116–117" },
      ]},
    ],
  },
  {
    id: "head-hands",
    book: "Drawing the Head and Hands",
    author: "Loomis",
    tagline: "Portrait fundamentals (141 pages, 93 plates, 4 parts)",
    modules: [
      { id: "hh-1", title: "Part One — Men's Heads", lessons: [
        { id: "hh-1-1", title: "Ball + cross-line construction, five head angles", page: "p. 21–35 (Plates 1–11)" },
        { id: "hh-1-2", title: "Simplified skull landmarks over the ball", page: "p. 27–28 (Plates 5–6)" },
        { id: "hh-1-3", title: "Basic & secondary planes, one light source", page: "p. 33, 63–65 (Plates 9, 32–34)" },
        { id: "hh-1-4", title: "Muscles of the face — draw from the anatomy plates", page: "p. 46–48 (Plates 20–22)" },
        { id: "hh-1-5", title: "Mouth, eyes, nose, and ears in isolation", page: "p. 50–55 (Plates 23–26)" },
        { id: "hh-1-6", title: "Same head, a full range of expressions", page: "p. 56–60 (Plates 27–31)" },
        { id: "hh-1-7", title: "Build tone onto a planed head (modeling)", page: "p. 63–70 (Plates 32–39)" },
      ]},
      { id: "hh-2", title: "Part Two — Women's Heads", lessons: [
        { id: "hh-2-1", title: "Construct a female head — note the softened planes", page: "p. 77–80 (Plates 40–43)" },
        { id: "hh-2-2", title: "Several 'girls' heads' sketches, construction first", page: "p. 81–84 (Plates 44–47)" },
        { id: "hh-2-3", title: "An older woman's head — aging process", page: "p. 86–87 (Plates 49–50)" },
      ]},
      { id: "hh-3", title: "Part Three — Children's Heads (babies to teens)", lessons: [
        { id: "hh-3-1", title: "Baby head proportions, year one vs. year three", page: "p. 92–93 (Plates 51–52)" },
        { id: "hh-3-2", title: "Little child's head construction, boy and girl", page: "p. 106–107 (Plates 61–62)" },
        { id: "hh-3-3", title: "School-age proportions, four-division method", page: "p. 116–119 (Plates 67–70)" },
        { id: "hh-3-4", title: "Teen-age head proportions, boy and girl", page: "p. 126–129 (Plates 73–76)" },
      ]},
      { id: "hh-4", title: "Part Four — Hands", lessons: [
        { id: "hh-4-1", title: "Hand anatomy and block-form construction", page: "p. 135–136 (Plates 77–78)" },
        { id: "hh-4-2", title: "Hand proportions, palm and knuckle structure", page: "p. 137–142 (Plates 79–84)" },
        { id: "hh-4-3", title: "Hand in action, foreshortened", page: "p. 140–141 (Plate 82–83)" },
        { id: "hh-4-4", title: "Baby hand vs. adult hand, side by side", page: "p. 147–151 (Plates 89–93)" },
      ]},
    ],
  },
  {
    id: "successful-drawing",
    book: "Successful Drawing",
    author: "Loomis",
    tagline: "General fundamentals — form, light, space (151 pages)",
    modules: [
      { id: "sd-1", title: "The Fundamentals", lessons: [
        { id: "sd-1-1", title: "Reduce a photo or scene to round / square / triangle", page: "~p. 3" },
        { id: "sd-1-2", title: "Sketch the same subject with a placement/spacing focus", page: "~p. 5–10" },
      ]},
      { id: "sd-2", title: "Form in Perspective", lessons: [
        { id: "sd-2-1", title: "Build blocks to specified dimensions in perspective", page: "~p. 30" },
        { id: "sd-2-2", title: "Draw a building or interior in architects' perspective", page: "~p. 40" },
        { id: "sd-2-3", title: "A roofline or other inclined plane in perspective", page: "~p. 50" },
        { id: "sd-2-4", title: "Spot and fix a common perspective error in your own sketch", page: "~p. 70" },
      ]},
      { id: "sd-3", title: "Figures & Shadows in Space", lessons: [
        { id: "sd-3-1", title: "Project a figure's height/measurements onto a scene", page: "~p. 60" },
        { id: "sd-3-2", title: "Cast a shadow correctly from a defined light source", page: "~p. 80" },
        { id: "sd-3-3", title: "Pose a figure using a manikin or simplified action-figure", page: "~p. 100" },
      ]},
    ],
  },
  {
    id: "constructive-anatomy",
    book: "Constructive Anatomy",
    author: "Bridgman",
    tagline: "Companion to Loomis — the body as forms (224 pages)",
    modules: [
      { id: "ca-1", title: "Construction Principles", lessons: [
        { id: "ca-1-1", title: "Reduce a photographed body part to simple masses", page: "p. 17–24" },
        { id: "ca-1-2", title: "Redraw one plate's form in your own hand, no tracing", page: "p. 17–24" },
      ]},
      { id: "ca-2", title: "The Hand, Thumb & Fingers", lessons: [
        { id: "ca-2-1", title: "Block in the hand as a wedge, then add the thumb mass", page: "p. 25–61 (Hand & Thumb)" },
        { id: "ca-2-2", title: "Study finger construction — knuckle to knuckle", page: "p. 63–73 (Fingers)" },
        { id: "ca-2-3", title: "Draw your own hand in three grips, structure first", page: "p. 25–53 (The Hand)" },
      ]},
      { id: "ca-3", title: "The Arm & Shoulder", lessons: [
        { id: "ca-3-1", title: "Arm forms from shoulder to wrist, bent and straight", page: "p. 75–101 (The Arm)" },
        { id: "ca-3-2", title: "Shoulder girdle over a simplified rib-cage block", page: "p. 103–109 (The Shoulder)" },
      ]},
      { id: "ca-4", title: "The Neck & Head", lessons: [
        { id: "ca-4-1", title: "Neck muscles connecting to the base of the skull", page: "p. 111–117 (The Neck)" },
        { id: "ca-4-2", title: "Block construction of the head, three angles", page: "p. 119–133 (The Head)" },
      ]},
      { id: "ca-5", title: "Facial Features", lessons: [
        { id: "ca-5-1", title: "Eye socket and eye as simplified solid forms", page: "p. 135–141" },
        { id: "ca-5-2", title: "Nose construction from block to finished form", page: "p. 143–147" },
        { id: "ca-5-3", title: "Mouth construction around the teeth/jaw structure", page: "p. 149–153" },
      ]},
      { id: "ca-6", title: "The Trunk", lessons: [
        { id: "ca-6-1", title: "Rib cage and pelvis as two connected masses", page: "p. 155–175 (The Trunk)" },
        { id: "ca-6-2", title: "Torso twisting — rib cage and pelvis out of alignment", page: "p. 165–183 (The Trunk)" },
      ]},
      { id: "ca-7", title: "Lower Limbs, Knee & Foot", lessons: [
        { id: "ca-7-1", title: "Leg construction, thigh through calf", page: "p. 185–197 (Lower Limbs)" },
        { id: "ca-7-2", title: "Knee structure bent and straight", page: "p. 199–205 (The Knee)" },
        { id: "ca-7-3", title: "Foot as a wedge block, weight-bearing pose", page: "p. 207–211 (The Foot)" },
      ]},
    ],
  },
  {
    id: "figure-drawing",
    book: "Figure Drawing for All It's Worth",
    author: "Loomis",
    tagline: "Full figure — gesture, pose, weight (197 pages)",
    modules: [
      { id: "fd-1", title: "Proportion & the Mannikin", lessons: [
        { id: "fd-1-1", title: "Quick set-up of figure proportions, 8-head scale", page: "~p. 25" },
        { id: "fd-1-2", title: "Place the mannikin figure at a specific spot/level", page: "~p. 40" },
      ]},
      { id: "fd-2", title: "Anatomy & Planes", lessons: [
        { id: "fd-2-1", title: "Arm muscles, front and back view", page: "~p. 55" },
        { id: "fd-2-2", title: "Simplify the torso into major planes", page: "~p. 70" },
      ]},
      { id: "fd-3", title: "Pose, Rhythm & Action", lessons: [
        { id: "fd-3-1", title: "Same standing pose, several weight variations", page: "~p. 85" },
        { id: "fd-3-2", title: "A figure turning and twisting through space", page: "~p. 100" },
        { id: "fd-3-3", title: "Fast action — capture more than the eye catches", page: "~p. 115" },
        { id: "fd-3-4", title: "Rhythm-line study: action line before the form", page: "~p. 130" },
      ]},
      { id: "fd-4", title: "Rendering & Special Cases", lessons: [
        { id: "fd-4-1", title: "Full value range in ink and pencil on one figure", page: "~p. 145" },
        { id: "fd-4-2", title: "Baby proportions vs. adult, side by side", page: "~p. 175" },
        { id: "fd-4-3", title: "Work through one 'typical problem' pose start to finish", page: "~p. 190" },
      ]},
    ],
  },
  {
    id: "creative-illustration",
    book: "Creative Illustration",
    author: "Loomis",
    tagline: "Optional — long-term reference, not sequential (290 pages)",
    modules: [
      { id: "ci-1", title: "The Form Principle & Composition", lessons: [
        { id: "ci-1-1", title: "Apply the form principle to a black-and-white study", page: "~p. 15" },
        { id: "ci-1-2", title: "Subdivide a rectangle to plan a composition", page: "~p. 30" },
        { id: "ci-1-3", title: "Compare a strong vs. a weak composition of one subject", page: "~p. 45" },
      ]},
      { id: "ci-2", title: "Tone & Media", lessons: [
        { id: "ci-2-1", title: "Try carbon pencil on smooth bristol for tonal range", page: "~p. 120" },
        { id: "ci-2-2", title: "Ink, black pencil, and poster white on coquille board", page: "~p. 60" },
      ]},
      { id: "ci-3", title: "From Idea to Finished Illustration", lessons: [
        { id: "ci-3-1", title: "Rough out an idea before rendering it", page: "~p. 240" },
        { id: "ci-3-2", title: "Take one subject through to a final interpretation", page: "~p. 90, 270" },
        { id: "ci-3-3", title: "Sketch a book cover or jacket concept", page: "~p. 255" },
      ]},
      { id: "ci-4", title: "Illustration for a Purpose", lessons: [
        { id: "ci-4-1", title: "Design a mock magazine-ad illustration", page: "~p. 225" },
        { id: "ci-4-2", title: "Work sentiment or mood into a simple scene", page: "~p. 210" },
        { id: "ci-4-3", title: "A portrait sketch worked in color", page: "~p. 285" },
      ]},
    ],
  },
];

// ---------------------------------------------------------------------------
// Exercise library — pulled up on the Practice tab
// ---------------------------------------------------------------------------
const EXERCISES = {
  Gesture: [
    "10 one-minute gesture sketches from photo references",
    "Draw a moving figure (TV, street, mirror) in under 30 seconds",
    "Gesture a chair, a coat on a hook — objects have gesture too",
  ],
  "Head & Features": [
    "One head, five angles, same light source",
    "Construct a head from the Loomis ball, no reference",
    "Draw an eye, nose, mouth, ear — five times each",
  ],
  Hands: [
    "Draw your own hand in three different grips",
    "Hand holding a familiar object (mug, pencil, phone)",
    "Simplify a photographed hand into blocks first",
  ],
  "Anatomy & Form": [
    "Block-in a full figure from Bridgman, no outline detail",
    "One muscle group, three views (front, side, 3/4)",
    "Turn a simple object into three basic solids",
  ],
  Perspective: [
    "Draw your room in one-point perspective",
    "A street or hallway in two-point perspective",
    "Simple object rotated through 4 positions",
  ],
  "Value & Light": [
    "Sphere, cube, cylinder — one light source, five values",
    "Still life in charcoal or pencil, values only, no line",
    "Same object lit from two different directions",
  ],
  Composition: [
    "Three thumbnail compositions of the same subject",
    "Crop a finished sketch four different ways",
    "Foreground / midground / background in one scene",
  ],
};

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
async function loadJSON(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    if (!res) return fallback;
    return JSON.parse(res.value);
  } catch {
    return fallback;
  }
}
async function saveJSON(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch (e) {
    console.error("Storage save failed", e);
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function StudioLog() {
  const [tab, setTab] = useState("practice");
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState({});
  const [openCourse, setOpenCourse] = useState(null);

  // The session log is committed to the repo (src/data/log.json), so it is the
  // same on every device rather than living in one browser's localStorage.
  // Sorted here so entries can be appended to the file in any order.
  const log = useMemo(
    () => [...logEntries].sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  // Lesson ticks stay per-device: they change several times a session, and a
  // commit per checkbox would be far more friction than they are worth.
  useEffect(() => {
    (async () => {
      setProgress(await loadJSON("course-progress", {}));
      setLoaded(true);
    })();
  }, []);

  const toggleLesson = useCallback((lessonId) => {
    setProgress((prev) => {
      const next = { ...prev, [lessonId]: !prev[lessonId] };
      saveJSON("course-progress", next);
      return next;
    });
  }, []);

  const streak = useMemo(() => {
    const dates = new Set(log.map((e) => e.date));
    // start counting from today if practiced today, otherwise from yesterday
    // (so the streak doesn't reset to 0 the moment a new day begins)
    const startOffset = dates.has(todayISO()) ? 0 : 1;
    if (!dates.has(daysAgoISO(startOffset))) return 0;
    let s = 0;
    while (dates.has(daysAgoISO(s + startOffset))) s++;
    return s;
  }, [log]);

  if (!loaded) {
    return (
      <div style={{ fontFamily: bodyFont, color: body, padding: 40 }}>
        Loading your studio…
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: bodyFont,
        background: canvasSoft,
        color: ink,
        minHeight: "100%",
      }}
    >
      <Header tab={tab} setTab={setTab} />
      <div style={{ padding: `${space.xl}px ${space.lg}px ${space.xxxl}px`, maxWidth: 720, margin: "0 auto" }}>
        {tab === "practice" && (
          <PracticeTab streak={streak} recentLog={log.slice(0, 3)} />
        )}
        {tab === "courses" && (
          <CoursesTab
            progress={progress}
            toggleLesson={toggleLesson}
            openCourse={openCourse}
            setOpenCourse={setOpenCourse}
          />
        )}
        {tab === "progress" && <ProgressTab log={log} streak={streak} />}
        {tab === "library" && <LibraryTab />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header / nav — tabbed like binder dividers
// ---------------------------------------------------------------------------
function Header({ tab, setTab }) {
  const tabs = [
    { id: "practice", label: "Today", icon: Pencil },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "library", label: "Library", icon: Library },
  ];
  return (
    // nav-bar: white surface against the sage canvas. Surface contrast is the
    // separation, so the bar takes no border and no shadow.
    <div style={{ background: canvas }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: `${space.xl}px ${space.lg}px ${space.md}px` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: space.sm, marginBottom: space.lg }}>
          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "-0.6px",
              margin: 0,
            }}
          >
            Studio Log
          </h1>
          <span style={{ fontSize: 14, color: mute }}>a practice ledger</span>
        </div>
        <div className="tab-bar" style={{ display: "flex", gap: space.xs }}>
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: space.sm,
                  // Custom property so the narrow-width media query can tighten
                  // this — a plain padding rule there would lose to this inline
                  // style, which is how the tabs crept back off-screen.
                  padding: `${space.sm}px var(--tab-pad, ${space.lg}px)`,
                  fontFamily: bodyFont,
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: active ? onPrimary : body,
                  background: active ? primary : "transparent",
                  border: "none",
                  borderRadius: radius.pill,
                  cursor: "pointer",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Practice tab
// ---------------------------------------------------------------------------
function PracticeTab({ streak, recentLog }) {
  const categories = Object.keys(EXERCISES);
  const [category, setCategory] = useState(categories[0]);
  const [exercise, setExercise] = useState(EXERCISES[categories[0]][0]);

  const rollExercise = () => {
    const list = EXERCISES[category];
    const pick = list[Math.floor(Math.random() * list.length)];
    setExercise(pick);
  };

  return (
    <div>
      {/* badge-positive — pale green pill, deep green text. Reserved for
          status so the primary green stays exclusive to actions. */}
      {streak > 0 && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: space.sm, marginBottom: space.lg, padding: `${space.xs}px ${space.md}px`, background: primaryPale, color: positiveDeep, borderRadius: radius.pill, fontWeight: 600, fontSize: 14, lineHeight: "20px" }}>
          <Flame size={15} />
          {streak}-day streak
        </div>
      )}

      <Card>
        <SectionLabel>Pick a category</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: space.sm, marginBottom: space.xl }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setExercise(EXERCISES[c][0]); }}
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                padding: `${space.sm}px ${space.lg}px`,
                borderRadius: radius.pill,
                border: "none",
                background: c === category ? primary : canvasSoft,
                color: c === category ? onPrimary : body,
                cursor: "pointer",
                fontFamily: bodyFont,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <SectionLabel>Today's exercise</SectionLabel>
        {/* card-feature-green — the soft-green surface, used here to make the
            day's prompt the focal moment on the tab. */}
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 24,
            fontWeight: 600,
            lineHeight: "31.2px",
            letterSpacing: "-0.48px",
            padding: space.xl,
            background: primaryPale,
            borderRadius: radius.xl,
            marginBottom: space.lg,
          }}
        >
          {exercise}
        </div>
        <button onClick={rollExercise} style={primaryButtonStyle}>
          <Shuffle size={16} /> Give me another
        </button>
      </Card>

      {recentLog.length > 0 && (
        <Card>
          <SectionLabel>Recent sessions</SectionLabel>
          {recentLog.map((e, i) => (
            <div key={`${e.date}-${i}`} style={{ fontSize: 14, lineHeight: "20px", color: body, padding: `${space.md}px 0`, borderBottom: `1px solid ${canvasSoft}` }}>
              <strong style={{ color: ink }}>{e.date}</strong> · {e.category} · {e.minutes} min
            </div>
          ))}
        </Card>
      )}

      <Card>
        <SectionLabel>Logging a session</SectionLabel>
        <div style={{ fontSize: 16, lineHeight: "24px", color: body }}>
          Add an entry to <code style={codeStyle}>src/data/log.json</code> and commit —
          it appears here and on Progress once the site rebuilds. The format is in
          the README.
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Courses tab
// ---------------------------------------------------------------------------
function CoursesTab({ progress, toggleLesson, openCourse, setOpenCourse }) {
  return (
    <div>
      {COURSES.map((course) => {
        const allLessons = course.modules.flatMap((m) => m.lessons);
        const done = allLessons.filter((l) => progress[l.id]).length;
        const pct = Math.round((done / allLessons.length) * 100);
        const isOpen = openCourse === course.id;
        // Lessons cite page numbers, so keep the scan one tap away. Every
        // course book has a matching Library entry.
        const book = LIBRARY.find((b) => b.title === course.book);

        return (
          <Card key={course.id} onClick={() => setOpenCourse(isOpen ? null : course.id)} clickable>
            <div
              role="button"
              aria-expanded={isOpen}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: space.lg, cursor: "pointer" }}
            >
              <div>
                <div style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 600, lineHeight: "31.2px", letterSpacing: "-0.48px" }}>
                  {course.book}
                </div>
                <div style={{ fontSize: 14, lineHeight: "20px", color: body, marginTop: space.xs }}>
                  {course.author} — {course.tagline}
                </div>
              </div>
              {/* button-icon-circular, holding a disclosure chevron: down when
                  closed, rotated to up when open. A right-facing chevron would
                  promise navigation to a new view, which this is not. The
                  circle takes the sage fill because the system's canvas fill
                  would vanish against the white card. */}
              <div
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: radius.pill,
                  background: canvasSoft,
                  color: ink,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <ChevronDown size={20} />
              </div>
            </div>

            <div style={{ marginTop: space.lg, marginBottom: isOpen ? space.xl : 0 }}>
              <ProgressBar pct={pct} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: space.md, marginTop: space.sm }}>
                <div style={{ fontSize: 12, lineHeight: "16px", color: mute }}>
                  {done} / {allLessons.length} lessons
                </div>
                {book && (
                  // stopPropagation so opening the scan does not also toggle
                  // the card the link sits inside.
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: space.xs,
                      flexShrink: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: "20px",
                      color: ink,
                      textDecoration: "none",
                    }}
                  >
                    PDF <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {isOpen && (
              <div onClick={(e) => e.stopPropagation()}>
                {course.modules.map((mod) => (
                  <div key={mod.id} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 14, lineHeight: "20px", fontWeight: 600, color: ink, marginBottom: space.sm }}>
                      {mod.title}
                    </div>
                    {mod.lessons.map((lesson) => (
                      <label
                        key={lesson.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: space.md,
                          fontSize: 14,
                          lineHeight: "20px",
                          padding: `${space.sm}px 0`,
                          cursor: "pointer",
                          color: progress[lesson.id] ? mute : ink,
                        }}
                      >
                        {/* accent is inkDeep, not primary: a white tick on the
                            pale brand green would not carry enough contrast. */}
                        <input
                          type="checkbox"
                          checked={!!progress[lesson.id]}
                          onChange={() => toggleLesson(lesson.id)}
                          style={{ accentColor: inkDeep, width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
                        />
                        <span style={{ flex: 1 }}>
                          <span style={{ textDecoration: progress[lesson.id] ? "line-through" : "none" }}>
                            {lesson.title}
                          </span>
                          {lesson.page && (
                            <span style={{ display: "block", fontSize: 12, lineHeight: "16px", color: mute, marginTop: space.xxs }}>
                              {lesson.page}
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress tab — graphite-density heatmap instead of a generic green grid
// ---------------------------------------------------------------------------
function ProgressTab({ log, streak }) {
  const totalMinutes = log.reduce((s, e) => s + (e.minutes || 0), 0);
  const totalSessions = log.length;

  const weeks = 12;
  const days = weeks * 7;
  const minutesByDate = useMemo(() => {
    const map = {};
    log.forEach((e) => { map[e.date] = (map[e.date] || 0) + (e.minutes || 0); });
    return map;
  }, [log]);

  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgoISO(i);
    cells.push({ date, minutes: minutesByDate[date] || 0 });
  }
  const columns = [];
  for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7));

  // Density ramp built from the brand greens — empty days fall back to the
  // sage canvas so the grid reads as one surface.
  const shade = (m) => {
    if (m <= 0) return canvasSoft;
    if (m < 15) return primaryPale;
    if (m < 30) return primaryNeutral;
    if (m < 60) return primary;
    return inkDeep;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: space.md, marginBottom: space.lg }}>
        <StatCard label="Streak" value={`${streak}d`} />
        <StatCard label="Sessions" value={totalSessions} />
        <StatCard label="Total time" value={`${Math.round(totalMinutes / 60)}h`} />
      </div>

      <Card>
        <SectionLabel>Last 12 weeks</SectionLabel>
        <div style={{ display: "flex", gap: 3, overflowX: "auto", padding: `${space.sm}px 0` }}>
          {columns.map((col, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {col.map((c) => (
                <div
                  key={c.date}
                  title={`${c.date} — ${c.minutes} min`}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 4,
                    background: shade(c.minutes),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, lineHeight: "16px", color: mute, marginTop: space.sm }}>
          deeper green = more time at the board that day
        </div>
      </Card>

      <Card>
        <SectionLabel>Session log</SectionLabel>
        {log.length === 0 && (
          <div style={{ fontSize: 16, lineHeight: "24px", color: body, padding: `${space.sm}px 0` }}>
            Nothing logged yet — add your first entry to{" "}
            <code style={codeStyle}>src/data/log.json</code>.
          </div>
        )}
        {log.map((e, i) => (
          <LogEntryRow key={`${e.date}-${i}`} entry={e} />
        ))}
      </Card>
    </div>
  );
}

function LogEntryRow({ entry: e }) {
  const rating = Number(e.rating) || 0;
  return (
    <div style={{ padding: `${space.md}px 0`, borderBottom: `1px solid ${canvasSoft}`, fontSize: 14, lineHeight: "20px" }}>
      <div style={{ fontWeight: 600 }}>
        {e.date} · {e.category} · {e.minutes} min
        {rating > 0 && <> · {"●".repeat(rating)}{"○".repeat(5 - rating)}</>}
      </div>
      {e.exercise && <div style={{ color: body, marginTop: space.xxs }}>{e.exercise}</div>}
      {e.notes && <div style={{ color: mute, marginTop: space.xxs }}>{e.notes}</div>}
      {e.photo && (
        // Sketches live in public/sketches/ and ship with the site. BASE_URL
        // keeps these correct under the /drawing/ sub-path.
        <img
          src={`${import.meta.env.BASE_URL}sketches/${e.photo}`}
          alt={`Sketch from ${e.date}`}
          loading="lazy"
          style={{ maxWidth: "100%", borderRadius: radius.lg, display: "block", marginTop: space.md }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Library tab
// ---------------------------------------------------------------------------
const LIBRARY = [
  {
    title: "Drawing the Head and Hands",
    author: "Andrew Loomis",
    note: "Portrait fundamentals, head construction, hands",
    url: "https://commons.wikimedia.org/wiki/File:Andrew_Loomis,_Drawing_the_Head_and_Hands.pdf",
    source: "Wikimedia Commons · public domain",
  },
  {
    title: "Successful Drawing",
    author: "Andrew Loomis",
    note: "General fundamentals — form, perspective, light, composition",
    url: "https://commons.wikimedia.org/wiki/File:Andrew_Loomis,_Successful_Drawing.pdf",
    source: "Wikimedia Commons · public domain",
  },
  {
    title: "Constructive Anatomy",
    author: "George Bridgman",
    note: "The body as forms — anatomy and figure construction",
    url: "https://commons.wikimedia.org/wiki/File:Constructive_anatomy_(IA_cu31924014504371).pdf",
    source: "Wikimedia Commons · public domain",
  },
  {
    title: "Fun With a Pencil",
    author: "Andrew Loomis",
    note: "Beginner-friendly — the ball & plane method, daily exercises",
    url: "https://archive.org/details/andrew-loomis-fun-with-a-pencil",
    source: "Internet Archive · free PDF download",
  },
  {
    title: "Figure Drawing for All It's Worth",
    author: "Andrew Loomis",
    note: "Full figure, gesture, pose, construction",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/16/Andrew_Loomis%2C_Figure_Drawing_for_All_It%27s_Worth.pdf",
    source: "Wikimedia Commons · public domain",
  },
  {
    title: "Creative Illustration",
    author: "Andrew Loomis",
    note: "Optional — composition, value, color, storytelling. Long-term reference.",
    url: "https://commons.wikimedia.org/wiki/File:Andrew_Loomis,_Creative_Illustration.pdf",
    source: "Wikimedia Commons · public domain",
  },
];

function LibraryTab() {
  return (
    <div>
      <Card>
        <SectionLabel>The five (plus one)</SectionLabel>
        {LIBRARY.map((book) => (
          <div key={book.title} style={{ padding: `${space.lg}px 0`, borderBottom: `1px solid ${canvasSoft}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 600, lineHeight: "24px" }}>{book.title}</div>
                <div style={{ fontSize: 14, lineHeight: "20px", color: body, marginTop: space.xxs }}>{book.author}</div>
                <div style={{ fontSize: 14, lineHeight: "20px", color: ink, marginTop: space.xs }}>{book.note}</div>
                <div style={{ fontSize: 12, lineHeight: "16px", color: mute, marginTop: space.xs }}>{book.source}</div>
              </div>
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...ghostButtonStyle,
                  flexShrink: 0,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Open <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <SectionLabel>Getting these onto the iPad Mini 7</SectionLabel>
        <ol style={{ fontSize: 16, lineHeight: "28px", paddingLeft: 20, margin: 0 }}>
          <li>Open each link in Safari, tap the share icon, choose <strong>Save to Files</strong>.</li>
          <li>Create one folder — e.g. <em>Files → On My iPad → Drawing Library</em> — so everything stays together and works offline.</li>
          <li>For annotating over the pages (tracing proportions, marking angles), open the PDF from Files into <strong>GoodNotes</strong>, <strong>Notability</strong>, or <strong>PDF Expert</strong> — all handle Apple Pencil markup well and re-save back to the same folder.</li>
          <li>If you want them searchable and synced across devices, drop the same folder into iCloud Drive instead of "On My iPad."</li>
        </ol>
      </Card>

      <div style={{ fontSize: 12, lineHeight: "16px", color: mute, marginTop: space.xs }}>
        All titles above are public-domain scans hosted by Wikimedia Commons or Internet Archive —
        free to download and keep offline.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small shared UI pieces
// ---------------------------------------------------------------------------
// card-content: white on sage, no border, no shadow — the surface contrast is
// the elevation. 24px is the system's canonical radius.
function Card({ children, onClick, clickable }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: canvas,
        borderRadius: radius.xl,
        padding: space.xl,
        marginBottom: space.lg,
        cursor: clickable ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        lineHeight: "16px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: mute,
        fontWeight: 600,
        marginBottom: space.md,
      }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div style={{ height: 8, background: canvasSoft, borderRadius: radius.pill, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: primary, transition: "width 0.3s" }} />
    </div>
  );
}

// White on sage like every other card — a sage fill here would sit on the
// sage canvas with no contrast, and contrast is what carries elevation.
function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, background: canvas, borderRadius: radius.xl, padding: `${space.lg}px ${space.md}px`, textAlign: "center" }}>
      <div style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 900, lineHeight: "38px", letterSpacing: "-0.96px" }}>{value}</div>
      <div style={{ fontSize: 12, lineHeight: "16px", color: body, marginTop: space.xxs }}>{label}</div>
    </div>
  );
}

const codeStyle = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.92em", background: canvasSoft, padding: "2px 6px", borderRadius: radius.sm, color: ink };

// button-tertiary — white fill, 1px ink hairline, 24px pill-rectangle.
const ghostButtonStyle = { display: "inline-flex", alignItems: "center", gap: space.sm, fontFamily: bodyFont, fontSize: 14, fontWeight: 600, lineHeight: "20px", padding: `${space.sm}px ${space.lg}px`, background: canvas, color: ink, border: `1px solid ${ink}`, borderRadius: radius.xl, cursor: "pointer" };

// button-primary — the lime-green CTA pill.
const primaryButtonStyle = { display: "inline-flex", alignItems: "center", gap: space.sm, fontFamily: bodyFont, fontSize: 16, fontWeight: 600, lineHeight: "24px", padding: `${space.md}px ${space.xl}px`, background: primary, color: onPrimary, border: "none", borderRadius: radius.xl, cursor: "pointer" };
