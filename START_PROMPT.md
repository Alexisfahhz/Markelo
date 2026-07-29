# Markelo, Session Start Prompt

**Last updated:** 28 July 2026
**Purpose:** paste the block below into a new session with any model, including a
free one, to start or continue the Markelo web app build.

Keep this file current. If the plan changes, change the prompt.

---

## Copy from here

```
You are picking up the Markelo web app design build.

Read these three files in this order before doing anything else:

1. /Users/KingFizzy/Downloads/Fahhz/Markelo/IMPLEMENTATION_PLAN.md
2. /Users/KingFizzy/Downloads/Fahhz/Markelo/PROGRESS.md  (read the LAST entry, it tells you what the previous agent actually finished and what it did not)
3. /Users/KingFizzy/Downloads/Fahhz/Markelo/Docs/2026-07-27-week-plan-and-assignments.md

The implementation plan is authoritative.

PHASE 1 IS COMPLETE. The Desktop Grid, input fields, forms, tables and modals
are built in Figma. Icons are Lucide. START AT PHASE 2. Do not rebuild the
grid, and do not invent alternative values for anything already built.

Three rules you must never break:

1. No student name or matriculation number on any marking-facing screen, ever.
   Markers see a Script ID like MK-000245. There is no setting that turns this
   off.
2. AI administers, humans grade. Nothing in the interface may imply the system
   produced, suggested, or influenced a mark.
3. Never invent user research, analytics, technical limits, or business results.
   Label what you state as KNOWN, ASSUMED, or NEEDS VALIDATION. If a document
   does not say something, say that it does not say it.

Sources:

- Use PRD v3.4 (Docs/Markelo_PRD.docx) and the 19 July user stories only. The
  older PRD v1.1 and both v2 user-story files describe a DIFFERENT product with
  printed QR control sheets that no longer exist. Building from them is wrong.
- There is no Word reader here. Extract a .docx with the Python snippet in
  section 2 of the implementation plan.

Layout. Markelo is DESKTOP ONLY:

- No breakpoints. No tablet layout. No mobile layout. Never propose responsive
  behaviour.
- Full-canvas screens (sign-in, onboarding) use the Desktop Grid: 12 columns,
  Stretch, 120px margin, 24px gutter. Class `.page-grid` with `.col-1`…`.col-12`.
- App screens sit inside the app shell. The sidebar is fixed chrome at 236px and
  is OUTSIDE every grid. The content region beside it uses a 32px inset, not the
  120px page margin. Class `.content-grid`.
- Add `data-grid` temporarily to check alignment against Figma, then remove it.
  It must never be left on a finished screen.

Tokens:

- Every colour, size, radius, border, duration and font size comes from a token
  in webapp-scaffold/src/index.css. Never write a raw hex or pixel value.
- If you need a value with no token, STOP and say so. Proposing a value for
  KingFizzy's approval is fine. Committing one into the system is not, he owns
  the Figma file, and an invented value creates reconciliation work for him.
- Borders do all the separating in this product; it is flat, with no shadows.
  Use `--border-control` (#8A8A8A) on inputs and checkboxes, never
  `--border-default` (#CCCCCC), #CCCCCC is 1.61:1 on white and fails WCAG 2.2
  SC 1.4.11, which requires 3:1 for a control boundary.
- Motion: only `opacity` and `transform`, ever. Never animate a table. Never let
  an animation delay a marker's input.

Icons are Lucide only, at the sizes in the plan's table. Not Tabler, not a mix.

Every screen ships five states: default, empty, loading, error, and
permission-denied. A screen with only a default state is 20% done, not done.

Register every new screen in the GROUPS array in webapp-scaffold/src/App.tsx.

Before you say a screen is done, run:
  cd /Users/KingFizzy/Downloads/Fahhz/Markelo/webapp-scaffold && npx tsc --noEmit
and open it at http://localhost:5179 to confirm it renders with no console
errors. If you did not run these, say you did not run them.

When you stop, append an entry to PROGRESS.md in the format given in section 9
of the implementation plan. Be honest in the "Verified" and "Not done / blocked"
fields, a previous session claiming something worked when it did not has
already cost this project a day.

Tell me which phase you are starting and what you plan to build, then begin.
```

## Copy to here

---

## What changed on 28 July

If you are comparing against the 27 July version of this prompt:

- **Phase 1 is now complete**, so the prompt says start at Phase 2 instead of
  telling the agent Phase 1 blocks everything.
- **Desktop-only is now an explicit instruction**, with the grid values inline.
  This is the single most likely thing for a model to get wrong, because
  "responsive" is its default habit.
- **The sidebar rule is stated**, since attaching the page grid to an app frame
  puts the first column behind the sidebar and produces a guide that looks right
  and means nothing.
- **The border contrast rule is stated with the actual numbers**, because
  reaching for the default grey on an input is the natural mistake and it fails
  an accessibility criterion the project has committed to.
- **The motion prohibitions are stated**, since a model asked for polish will
  animate a table by default.
- **The stop-and-ask rule is sharper**, previously "say so", now "STOP and say
  so", with the reason spelled out.

## Notes for KingFizzy

**On auditing.** Hand me the session's `PROGRESS.md` entry and I will verify the
claims against the actual files rather than taking them at face value. The entry
format forces the agent to state what it verified and what it assumed, which is
what makes it checkable.

**On free models specifically.** The two failure modes seen so far in this
workspace are dates and proper nouns. When auditing Markelo work, check any
date, any story ID, and any claim about what a document says, first.
