# Markelo, Web App Implementation Plan

**Status:** active
**Owner:** KingFizzy (Lead Product Designer)
**Last updated:** 28 July 2026
**Audience:** any AI model or engineer picking this work up cold

> **Phase 1 is COMPLETE as of 28 July 2026.** The Desktop Grid, input fields,
> forms, tables, and modals are built in Figma. Icons are Lucide. **Start at
> Phase 2.** See section 3 for what is confirmed and section 5 for what remains.

---

## 0. Read this first

This file is the single entry point. It is written so a model with no prior
conversation history can start work immediately.

**What Markelo is.** An Examination Operating System for Nigerian tertiary
institutions. Institutions keep their existing paper answer booklets. Markelo
adds a layer around them: scan booklets in bulk, let AI assemble each student's
script, strip the student's identity, hand an anonymous script to a human
marker, moderate, and export results. Its single non-negotiable promise is that
no marker ever sees whose script they are marking.

**What this repo folder is.** A design working folder, not a production repo.
Everything built here is for KingFizzy to review locally and then recreate in
Figma by hand. It is never committed to a product repository and never shipped.
Optimise for **visual clarity and legible token names**, not production
robustness. Do not add tests, CI, auth backends, or deployment config.

### The three rules that override everything

1. **No student name or matriculation number may appear on any marking-facing
   screen, ever.** Markers see a Script ID such as `MK-000245`. There is no
   setting that disables this. If a design you are making would show identity to
   a marker, the design is wrong, stop and re-read PRD §11.
2. **AI administers, humans grade** (PRD §2.1). Markelo automates assembling
   and anonymising scripts. It never scores an answer, never suggests a mark,
   and never influences a grade at any confidence level. If a screen implies the
   system proposed a score, that screen is wrong.
3. **Never invent evidence.** Do not fabricate user research, analytics,
   technical limits, or business results. Label what you state as KNOWN,
   ASSUMED, or NEEDS VALIDATION. If a document does not say it, say that it does
   not say it.

---

## 1. Authoritative documents

Use these. Nothing else.

| Document | Path | What it governs |
|---|---|---|
| **PRD v3.4** | `Docs/Markelo_PRD.docx` | What the product is, features by version, permission model |
| **User Stories (19 July)** | `Docs/Markelo_User_Stories.updated(19 July).docx` | Acceptance criteria per story, grouped into Epics A–K |
| **Define layer** | `DesignSystem/00-define.md` | Design principles, scope, token architecture, open gaps |
| **Week plan & assignments** | `Docs/2026-07-27-week-plan-and-assignments.md` | Who owns which screen, and the per-screen traps |
| **Market landscape** | `Research/05-market-landscape.md` | Competitors, verified with sources |
| **Meeting note** | `Docs/meetings/2026-07-20-general-meeting.md` | Team direction, the validation pivot |

### Superseded, do not use

- `Docs/Markelo_PRD_v1.1.docx`
- `Docs/Markelo_User_Stories_v2.docx`
- `Docs/Markelo_User_Stories_v2.(13 July)docx.docx`

These describe a **different product**. They attach a printed QR control sheet
to every answer booklet. PRD v3.4 removed that entirely: no sticker, no printed
code, no new sheet ever touches a booklet. The old `US-06 Control Sheet
Generation and Export` screen does not exist any more. Building from these files
produces the wrong product.

### Companion documents not yet in this folder

PRD §20 names two companions that KingFizzy has not shared here yet:
**Markelo, UX Specification** and **Markelo, Engineering Architecture
Document**. Several user stories cite them. If a task needs screen-level layout
detail or an API contract, say the companion document is missing rather than
inventing the answer.

---

## 2. Extracting a .docx

There is no Word reader in this environment. Use Python's standard library:

```bash
python3 -c "
import zipfile,re
z=zipfile.ZipFile('Docs/Markelo_PRD.docx')
x=z.read('word/document.xml').decode('utf8','ignore')
x=re.sub(r'</w:p>','\n',x); x=re.sub(r'<[^>]+>','',x)
print(x.strip())
"
```

---

## 3. Current state

### Design system

Built in Figma by KingFizzy, and mirrored as tokens in
`webapp-scaffold/src/index.css`.

| Area | State |
|---|---|
| Colour | Done, palette, semantic rules, all in Figma Variables |
| Typography | Done, display, headline, title, body, label |
| Spacing | Done |
| Radius | Done |
| Elevation / shadow | Done |
| **Layout and grid** | **Done, 28 July. See the Desktop Grid below.** |
| Border | **Proposed 28 July, awaiting approval.** See below. |
| Motion | **Proposed 28 July, awaiting approval.** See below. |

Components done: buttons (all states and sizes), accordion/dropdown, alert
panels, attention boxes, **input fields, forms, tables, modals**.
Components still missing: navigation, badges/tags, progress/loaders.

### The Desktop Grid, the layout foundation every screen binds to

Confirmed 28 July 2026. Figma style name **"Desktop Grid"**, description
"For desktop view only".

| Property | Value |
|---|---|
| Count | 12 columns |
| Type | Stretch, fluid columns, not fixed width |
| Margin | 120px |
| Gutter | 24px |
| Overlay colour | FF0000 at 10% |

Stretch means the content area is the viewport minus 2 × 120px margin, and the
12 columns divide what is left after 11 × 24px gutters. At a 1440px frame that
resolves to a **1200px content area and a 78px column**. The 1440 frame width is
*inferred* from those numbers landing cleanly. It is not stated anywhere, so
treat it as ASSUMED.

**Markelo is DESKTOP ONLY.** Ruled by KingFizzy on 28 July. There is no tablet
grid, no mobile grid, and **no breakpoints**. Do not add a second grid, and do
not propose responsive behaviour. This closes what used to be open question 1.

**In code:** `--grid-columns`, `--grid-margin`, `--grid-gutter` in
`src/index.css`, plus a `.page-grid` utility, `.col-1` … `.col-12` spans, and a
`data-grid` attribute that draws the FF0000/10% overlay for checking a screen
against Figma. The overlay is a review aid. Never leave it on a real screen.

**DECIDED 10 August 2026 by KingFizzy.** The 120px page margin does **not** apply
inside the app shell. Inside `AppFrame` the content region sits behind the 236px
sidebar and takes a **32px inset**; the sidebar itself takes a **12px inner
margin**. The 120px margin is reserved for full-canvas screens, sign-in and
onboarding. Both values are tokens, `--content-inset` and `--sidebar-inset`, and
both are going into the Figma grid system. This was the last open layout question.

### Border tokens, PROPOSED 28 July, awaiting KingFizzy's approval

Markelo is a **flat** product, the design system PDF states shadows are not
used, so borders do all the separating. That makes these load-bearing.

| Token | Value | Use |
|---|---|---|
| `border/hairline` | 1px | Default. Everything. |
| `border/emphasis` | 2px | Focus ring, selected state, active tab |
| `border/accent` | 4px | The left bar on alert panels |
| `border/default` | `#CCCCCC` | Card edges, table cells, page dividers |
| `border/subtle` | `#E5E5E5` | Dividers **inside** a card |
| `border/control` | `#8A8A8A` | Inputs, selects, checkboxes at rest |
| `border/interactive` | `#1A56A0` | Focused, selected, active |
| `border/on-dark` | `white @ 15%` | Dividers in the sidebar |

Status borders reuse the existing status colours. No new tokens.

**WCAG 2.2, and this is a real failure not a nitpick.** `#CCCCCC` measures
**1.61:1** against white. SC 1.4.11 requires **3:1** for the boundary of any
control a user must identify. So `#CCCCCC` is fine on a divider and **fails on
an input border**. `border/control` at `#8A8A8A` measures **3.45:1** and exists
to fix exactly that. Do not use `border/default` on a form control.

### Motion tokens, PROPOSED 28 July, awaiting KingFizzy's approval

| Token | Value | Use |
|---|---|---|
| `motion/instant` | 100ms | Feedback on the thing you just touched |
| `motion/quick` | 200ms | Most UI, dropdown, tooltip, toast, tab |
| `motion/moderate` | 300ms | Large surfaces, modal, side panel, overlay |
| `motion/loop` | 1200ms | Skeletons, indeterminate progress |
| `motion/enter` | `cubic-bezier(0, 0, 0.2, 1)` | Things arriving |
| `motion/exit` | `cubic-bezier(0.4, 0, 1, 1)` | Things leaving |
| `motion/move` | `cubic-bezier(0.4, 0, 0.2, 1)` | Things moving in place |

**Three prohibitions.** Never animate a table, rows fading in a 5,000-row list
is nauseating and slow. Never animate anything but `opacity` and `transform`. Animating width or height forces layout recalculation every frame, which is
visible jank on a modest institution PC. Never let an animation delay a marker's
input; the save indicator is `motion/instant` and never blocks typing.

`prefers-reduced-motion` is already handled globally in `src/index.css`.

### Code scaffold, onboarding and dashboards complete

`webapp-scaffold/`, Vite + React 18 + TypeScript + Tailwind v4. 32 screens.
Runs on port 5179.

```bash
npm --prefix /Users/KingFizzy/Downloads/Fahhz/Markelo/webapp-scaffold run dev
```

| File | Contents |
|---|---|
| `src/index.css` | Every design token. Tailwind v4 `@theme` block. |
| `src/roles.ts` | Six roles, their navigation, their personas |
| `src/ui/kit.tsx` | Button, Field, Input, Select, Card, Badge, Notice, Stat, Progress, EmptyState, ScriptId |
| `src/ui/shell.tsx` | AppFrame, AuthFrame, Sidebar, TopBar, OfflineIndicator, RoleSwitcher |
| `src/screens/auth.tsx` | 12 signed-out screens (Epic J, story I2) |
| `src/screens/onboarding.tsx` | 14 onboarding screens, all six roles |
| `src/screens/dashboards.tsx` | 6 role dashboards |
| `src/App.tsx` | Screen picker harness, the review tool |

`design-system-preview/` is an **older, separate** app on port 5178. It is a
component gallery, not the product. Do not build product screens there.

### Not started

Every screen in section 5 below, from Institution Setup onward.

---

## 4. Conventions

**Stack.** Vite + React 18 + TypeScript + Tailwind v4. No router, the harness
in `App.tsx` switches screens with `useState`. Keep it that way; it makes every
screen directly linkable in review.

**Tokens.** Every colour, size, radius, and font size comes from
`src/index.css`. Never write a raw hex value or a pixel size in a component.
Token names mirror the Figma variable names one-for-one:

| Tailwind class | Figma variable |
|---|---|
| `bg-brand` | `color/brand` |
| `text-muted` | `color/muted` |
| `rounded-card` | `radius/card` |
| `text-body` | `type/body` |

If you need a value that has no token, that is a signal the design system has a
gap. Say so. Do not invent a one-off value.

**Layout.** Every full-canvas screen binds to the Desktop Grid, 12 columns,
120px margin, 24px gutter, stretch. Use `.page-grid` and the `.col-N` spans.
Add `data-grid` temporarily to check alignment against Figma, then remove it.
**Desktop only. Never add a breakpoint or a mobile layout.**

**Icons, Lucide only.** `lucide-react`. Not Tabler, not Feather, not Material,
not a mix. Sizes are fixed:

| Context | Size | Stroke |
|---|---|---|
| Small button | 14 | 2 |
| Normal button | 16 | 2 |
| Large button | 18 | 2 |
| Sidebar navigation | 17 | 2 |
| Attention box | 16 | 2 |
| Attention box dismiss (×) | 14 | 2 |
| Badge | 12 | 2.25 |
| Stat label | 13 | 2 |
| Empty state | 28 | 1.5 |

**Design principles** (from `DesignSystem/00-define.md`, sourced from PRD §2):

- **P1 Familiar before novel.** It must look like software the user already
  knows. Reject an elegant pattern that is unfamiliar.
- **P2 Plain language always.** "Print the class list", not "Generate PDF
  export".
- **P3 Assume no training and low technical confidence.** Guidance appears in
  the interface, never in a manual.
- **P4 Density needs hierarchy.** Screens hold thousands of rows. Use weight,
  spacing, and colour to create a scanning order. Never solve density by
  shrinking text.
- **P5 Failure states are first-class.** Offline, pending, error, and empty are
  designed at the same time as the normal state, not after.
- **P6 Identity protection is structural.** See rule 1 at the top.

**Every screen ships five states.** Default, empty, loading, error, and the
permission-denied state for the roles that cannot use it. A screen with only a
default state is 20% done, not done.

**Accessibility floor.** Everything keyboard-reachable, visible focus states,
WCAG 2.2 Level AA target. Stories K1 and K2.

**Mock data.** Use consistent, realistic Nigerian institution data. The scaffold
already establishes: Yaba College of Technology, courses CSC 401 / CSC 312 /
MTH 201 / STA 105, Script IDs in the form `MK-000245`, and the six persona
names in `src/roles.ts`. Reuse them so screens look like one product.

---

## 5. Build order

Phases are ordered by dependency. Do not skip ahead, phase 1 blocks everything.

### Phase 1, Design system foundations, ✅ COMPLETE (28 July 2026)

Done in Figma by KingFizzy. **Do not redo this and do not invent alternatives
to it.**

1. ✅ **Desktop Grid**, 12 / stretch / 120 margin / 24 gutter. Desktop only,
   no breakpoints. Full spec in section 3.
2. ✅ **Input fields and forms**
3. ✅ **Tables**
4. ✅ **Modals**
5. ✅ **Lucide** confirmed as the only icon set.

**Still open, ask before assuming:** border tokens and motion tokens were not
named as done. Navigation, badges/tags, and progress/loaders are still missing
from the component library.

**If you need a value that has no token, say so and stop.** Proposing a value
for KingFizzy's approval is fine. Committing one into the system is not, he
owns the Figma file, and an invented value creates reconciliation work for him
later.

### Phase 2, Institution Admin path (Epics A, I)

| Screen | Stories | Notes |
|---|---|---|
| Institution Setup, courses | I1 | **Flat course list.** Hierarchy is V1.5. Courses must be editable and deactivatable, not add-only. |
| People and roles | I2, I3, J5 | A person can hold **two roles at once** (Lecturer + HOD). Permissions are the union. Suspension revokes access immediately. |
| Booklet Profile Setup | A1 | Cover page required; normal page, extra sheet, continuation sheet optional. |
| Booklet Profile Validation | A2, A3 | Must report what it detected. Cannot be marked "ready" until every flagged field is resolved. Includes the **draw-a-box** correction tool. |
| Booklet Profile versioning | A4 | **V1, not V1.5.** A new version never reprocesses old scripts. |
| Audit Trail Viewer | H1, F2 | Entries read as **plain sentences**, not a technical log. Nothing is editable or deletable. |
| Result Correction | G2 | Unlocking requires a stated, logged reason. Records old value, new value, who, when. |

### Phase 3, Exam Officer path (Epics B, D, G, H)

| Screen | Stories | Notes |
|---|---|---|
| Exam Creation | PRD §10 step 1 | Course, exam type, semester, lecturer. |
| Marking Scheme Setup | D1 | Question number and max marks only. **No rubric builder.** Marking cannot start without it. |
| Student Data Upload and Validation | PRD §10 step 2 | Must handle 5,000+ records with clear error reporting. |
| Scan Batch Upload | B1 | Any order, never pre-sorted. |
| AI Processing and Integrity Report | B2 | **Per-script live status.** Matched / Needs Review / Missing Pages. A Matched script is assignable immediately, without waiting for the batch. |
| Exception Queue | B3, B4, B5 | **Two modes.** Pilot mode confirms every script regardless of score (PRD §9.2.1, thresholds are unvalidated). Normal mode shows exceptions only. Every entry states its specific reason. |
| Identity Registry | H2 | The only place a name appears. Exam Officer only. Closes at Marking status. Every lookup needs a stated reason and is logged. |
| Result Processing and Export | G1 | Fixed formula CA + Exam = Total, with manual override. |

### Phase 4, Marking (Epics C, D, E, K), the core of the product

| Screen | Stories | Notes |
|---|---|---|
| Marking Assignment | D2 | Lecturer splits across self and TAs, changeable any time. Reassignment **preserves** the first marker's submitted marks as history. |
| Marking Progress | D2 | A TA sees their **own** pace, never a comparison against other TAs. |
| **Marking Interface** | C1, C2, E1, E2 | The product. Script ID only. Redacted images only. |
| Answer Viewer | C2 | Zoom, pan, rotate, page and thumbnail navigation. **Markelo does not auto-jump to an answer**, this is a deliberate decision, do not add it. |
| Offline states | E1, E2 | **No disabled state tied to losing connectivity.** Already-viewed pages stay viewable offline. On reconnect, pending changes submit by themselves. A script reassigned while offline produces a **conflict flag**, never a silent overwrite. |
| Keyboard operation | K1 | Every control, including viewer zoom/pan/rotate. Formally V1.5 but prioritised. |

### Phase 5, Moderation and results (Epics F, G)

| Screen | Stories | Notes |
|---|---|---|
| Moderation Workspace | F1 | Original and moderated marks **side by side**. Return requires a stated reason. A changed-and-approved score becomes the score of record; **the original is kept permanently**. |
| Returned scripts | F1 | Back with the original marker. |
| Result approval | G1 | Moderator/HOD approval before finalisation. |
| Dispute evidence view | F2 | Who marked it, when, every change, and proof no marker saw the name. |

### Phase 6, Senior Management

Reports and Analytics Dashboard is **V2**. Do not build it. The Senior
Management dashboard in the scaffold already shows the correct V1 position:
department progress plus audit trail access, with an honest empty state where
reports will later go.

---

## 6. Out of scope

Do not build these. They are deliberately deferred by the PRD.

- Automated grading or AI-assisted scoring of any kind, V3, and see rule 2
- Native mobile or tablet applications, V2
- Reports and Analytics Dashboard, V2
- Demo Mode walkthrough, V1.5
- Grading Formula Configuration, V1.5
- Multi-language interface, V3
- Faculty and department hierarchy, V1.5
- Self-serve Booklet Profile builder with live layout suggestions, explicit non-goal
- Marketing website (`markelo.ng`), separate product, separate scope
- Student-facing anything, a student is not a Markelo user in V1

---

## 7. Open questions

Do not guess at these. Ask KingFizzy, or state the assumption you made.

1. ~~Minimum supported screen width.~~ **CLOSED 28 July**, desktop only, no
   breakpoints, Desktop Grid confirmed. See section 3.
2. ~~Does the 120px page margin apply inside the app shell?~~ **CLOSED 10 August
   2026 by KingFizzy.** It does not. The app shell gets a **32px content inset**,
   and the sidebar gets a **12px inner margin**. The 120px page margin now applies
   to full-canvas screens only, sign-in and onboarding. Both values are going into
   the Figma grid system, and both are tokens in `src/index.css`
   (`--content-inset`, `--sidebar-inset`). The 32px was already in the scaffold as
   a guess; it is now the decision, so stop treating it as provisional.
3. **Border and motion tokens**, built or not? Not named in the 28 July Phase 1
   confirmation, so treat as unbuilt until he says otherwise.
4. **Multi-institution theming.** Is one visual theme enough, or does each
   institution need its own? This changes the token architecture significantly.
5. **Figma plan limits.** Starter caps variable collections and modes. The token
   structure must fit whatever plan is actually in use.
6. **Code mirror owner.** No engineer is named for keeping Tailwind and Figma in
   sync. Design and code will drift without one.
7. **The six design principles** in `DesignSystem/00-define.md` are drafted but
   KingFizzy has not formally confirmed them.
8. **Companion documents.** The UX Specification and Engineering Architecture
   Document are referenced everywhere but not present in this folder.
9. **Competing deadline.** The 20 July meeting committed the marketing website
   for this same week. Same designers. Unresolved which wins.
10. **Multi-role knock-on.** Story I2 touches three people's screens, People and
    Roles, Marking Assignment, and the app shell. Agree the pattern once before
    three designers solve it three ways.

---

## 8. Definition of done, per screen

A screen is complete when all of these are true:

- [ ] All five states exist: default, empty, loading, error, permission-denied
- [ ] Every value comes from a token, no raw hex, no raw pixel sizes
- [ ] Every icon is Lucide, at the size in the table in section 4
- [ ] Every acceptance criterion in its user story is visibly satisfied
- [ ] No student name or matric number appears on any marking-facing surface
- [ ] Nothing implies the system produced or suggested a mark
- [ ] Labels are task-oriented plain language, not system language
- [ ] Every control is keyboard-reachable and has a visible focus state
- [ ] `npx tsc --noEmit` passes
- [ ] No console errors in the browser
- [ ] Registered in the `GROUPS` array in `src/App.tsx` so it is reviewable

---

## 9. Handover protocol

When you finish a work session, append an entry to `PROGRESS.md` in this folder
(create it if absent):

```markdown
## <date>, <model name that did the work>

**Phase:** <which phase from section 5>
**Built:** <files created or edited, and which screens>
**Stories satisfied:** <story IDs>
**Verified:** <typecheck result, browser check result>
**Assumptions made:** <anything you decided without a document backing it>
**Not done / blocked:** <what remains and why>
```

Be honest in the "Verified" and "Not done" fields. A prior session claiming
something works when it does not has already cost this project a day. If you did
not run the typecheck, write that you did not run it.
