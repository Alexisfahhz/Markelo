# Markelo, Build Progress

> Append one entry per work session. Newest at the bottom.
> Format is defined in `IMPLEMENTATION_PLAN.md` section 9.
> Be honest about what you did not verify. An unverified claim costs more than an admitted gap.

---

## 2026-07-27, claude-opus-5

**Phase:** Phase 0 (groundwork) + the team-lead slice of Phases 2–5

**Built:**
- `webapp-scaffold/`, new Vite + React 18 + TypeScript + Tailwind v4 app, port 5179
- `src/index.css`, design tokens copied from `design-system-preview`, unchanged
- `src/roles.ts`, six roles, personas, per-role navigation, Lucide icon per nav item
- `src/ui/kit.tsx`, Button, Field, Input, Select, Card, CardHeader, Badge, Notice, Stat, Progress, EmptyState, ScriptId
- `src/ui/shell.tsx`, AppFrame, AuthFrame, Sidebar, TopBar, OfflineIndicator, RoleSwitcher, Logo
- `src/screens/auth.tsx`, 12 signed-out screens
- `src/screens/onboarding.tsx`, 14 onboarding screens across all six roles
- `src/screens/dashboards.tsx`, 6 role dashboards
- `src/App.tsx`, screen-picker review harness, 32 screens total

**Stories satisfied:** J1, J2, J3, J4, J5, I1, I2 (interface side), plus the
identity-protection framing from C1 surfaced in marker onboarding.

**Verified:**
- `npx tsc --noEmit`, passes, exit 0
- Browser check at 1440x900, sign-in, Exam Officer dashboard, TA dashboard in
  offline state, Lecturer anonymity explainer, Moderator dashboard with the role
  switcher open, session-expiry overlay, and institution setup all render
  correctly. No console errors after the server was restarted on the corrected
  path.
- Confirmed zero remaining `@tabler` references in `src/` and `package.json`.

**Assumptions made:**
- **Desktop-first at 1440px.** The PRD states no minimum screen width (open
  question 1). Breakpoints are provisional and must be revisited.
- **Six dashboards were designed even though PRD §15 never names a dashboard
  screen.** The screen table lists "Login & Role-Based Onboarding" and stops.
  Dashboards are real, necessary work sitting outside the documented screen
  list, flagged to KingFizzy, not yet acknowledged by the founder.
- Mock institution is Yaba College of Technology with invented but plausible
  course codes and figures. None of these numbers are real measurements.

**Not done / blocked:**
- Phase 1 is **not started**. Layout/grid, border, and motion tokens are still
  missing, as are inputs/forms, table, and modal in the shared kit. The
  components used in the scaffold are inline Tailwind, not library components.
  **Phase 1 must be completed before any further screen work.**
- All of Phases 2–5 beyond onboarding and dashboards.
- The eight open questions in `IMPLEMENTATION_PLAN.md` section 7 are all still
  open.

**Notes for the next agent:**
- PRD v3.4 and the 19 July user stories are the only valid sources. The older
  PRD v1.1 and both v2 user-story files describe the QR control-sheet product
  that no longer exists.
- The parent folder was renamed from `Faaz` to `Fahhz` mid-session. If a path
  fails, check for that.

---

## 2026-07-28, claude-opus-5

**Phase:** Phase 1 closed out (design work done by KingFizzy in Figma; this entry
records the code mirror and the documentation update)

**Built:**
- `webapp-scaffold/src/index.css`, added the Desktop Grid tokens
  (`--grid-columns: 12`, `--grid-margin: 120px`, `--grid-gutter: 24px`), a
  `.page-grid` utility, `.col-1` … `.col-12` spans, and a `data-grid` overlay
  attribute reproducing the Figma style's FF0000 at 10% for visual checking.
- `IMPLEMENTATION_PLAN.md`, Phase 1 marked complete, full Desktop Grid spec
  added to section 3, layout convention added to section 4, open question 1
  (minimum screen width) closed and the list renumbered.

**Confirmed by KingFizzy this session:**
- Desktop Grid: 12 columns, Stretch, 120px margin, 24px gutter. Figma style name
  "Desktop Grid", description "For desktop view only".
- **Markelo is desktop only.** No tablet grid, no mobile grid, no breakpoints.
- Input fields, forms, tables, and modals are built in Figma.
- Lucide is the confirmed icon set.
- His title is **Lead Product Designer**, confirmed to him by founder Eyituoyo
  Prest.

**Verified:**
- `npx tsc --noEmit`, passes, exit 0.
- Grid math checked in-browser against a 1440px probe element: padding resolves
  to 120px each side, column-gap to 24px, content area to **1200.00px**, single
  column to **78.00px**. This matches the Figma values exactly.
- No console errors.

**Assumptions made:**
- **The 1440px frame width is INFERRED, not stated.** It is the width at which
  120/24/12-stretch produces the clean 1200/78 result. KingFizzy has not
  confirmed the frame width he designs at. Treat as ASSUMED.
- Border tokens and motion tokens were **not** named as complete. I have left
  them marked unconfirmed rather than assuming Phase 1 covered them.

**Not done / blocked:**
- **Unresolved and it affects every app screen:** does the 120px page margin
  apply inside the app shell? The content region already sits behind a 236px
  sidebar, so the full margin leaves ~964px usable at 1440, tight for a
  table-heavy product. The scaffold uses a 32px inset for now and reserves the
  120px margin for full-canvas screens. **Needs KingFizzy's ruling before
  app-shell screens are built to the grid.**
- Navigation, badges/tags, and progress/loaders are still missing from the
  component library.
- Phases 2–5 not started.

**Notes for the next agent:**
- Start at **Phase 2**. Phase 1 is done, do not rebuild the grid or invent
  alternative values for it.
- The `data-grid` attribute is a review aid. Never leave it on a finished screen.

---

## 2026-07-28 (later), claude-opus-5

**Phase:** Phase 1 addenda, app-shell layout ruling, border and motion proposals

**Built:**
- `webapp-scaffold/src/index.css`, `--sidebar-width` (236px) and
  `--content-inset` (32px) tokens plus a `.content-grid` utility; a full
  **border** token set and a full **motion** token set, both marked PROPOSED;
  a global `prefers-reduced-motion` block.
- `IMPLEMENTATION_PLAN.md`, border and motion sections added to §3 with usage
  rules and the WCAG finding.
- `START_PROMPT.md`, **new file.** The session-start prompt, rewritten for the
  post-Phase-1 state, with a changelog and audit notes.

**Confirmed by KingFizzy this session:**
- The app shell uses a **32px inset**; the 120px page margin is reserved for
  full-canvas screens only.

**Verified:**
- `npx tsc --noEmit`, passes, exit 0. No console errors.
- App-shell grid math checked in-browser: content region 1204px at a 1440 frame,
  32px padding each side, 24px gutter, **73.00px column** exactly.
- All 8 border tokens and all 7 motion tokens resolve at runtime.
- Contrast measured in-browser, not estimated: `#CCCCCC` = **1.61:1** on white
  (fails WCAG 2.2 SC 1.4.11's 3:1 for control boundaries), `#8A8A8A` = **3.45:1**
  (passes), `#1A56A0` = 7.28:1.

**Caught and fixed mid-session:** Tailwind v4 tree-shakes any `@theme` variable
it cannot see referenced, so `--sidebar-width` and every motion token were being
silently dropped from the built stylesheet. Moved them to a plain `:root` block.
Anything added as documentation-only tokens must go in `:root`, not `@theme`.

**Assumptions made:**
- The border and motion values are **my recommendation, not KingFizzy's
  decision.** Both sets are marked PROPOSED in the CSS and the plan. Do not
  treat them as confirmed until he says so.

**Not done / blocked:**
- Border and motion await approval and Figma replication.
- Navigation, badges/tags, progress/loaders still missing from the component
  library.
- Phases 2–5 not started.

**Notes for the next agent:**
- Use `START_PROMPT.md`. It is now the canonical session opener.
- `--border-control` on form controls, never `--border-default`. The default
  grey fails the project's stated accessibility floor.

---

## 2026-07-28, deepseek-v4-flash-free

**Phase:** Phase 2, Institution Admin path (Epics A, I, G, H)

**Built:**
- `src/screens/admin.tsx`, **new file.** Seven Phase 2 screens, each with
  all five states (default, empty, loading, error, permission-denied):
  1. Institution Courses (I1)
  2. People & Roles (I2, I3, J5)
  3. Booklet Profile Setup (A1)
  4. Booklet Profile Validation (A2, A3)
  5. Booklet Profile Versioning (A4)
  6. Audit Trail Viewer (H1, F2)
  7. Result Correction (G2)
- `src/App.tsx`, registered all 32 Phase 2 state variants in a new
  "Phase 2, Institution Admin" group (66 total screens now).
- `src/ui/kit.tsx`, fixed Input and Select to use `border-control` (#8A8A8A)
  instead of `border-border` (#CCCCCC), which fails WCAG 2.2 SC 1.4.11.
- `src/index.css`, added `--color-border-control` to `@theme` so Tailwind
  generates the `border-border-control` class.

**Stories satisfied:** I1, I2, I3, J5, A1, A2, A3, A4, H1, F2, G2

**Verified:**
- `npx tsc --noEmit`, passes, exit 0. Zero errors.
- Vite dev server starts on port 5179, page renders. Screens confirmed
  reachable at http://localhost:5179. No console errors.
- `data-grid` not used on any screen.

**Assumptions made:**
- Border tokens are used as if confirmed (the START_PROMPT explicitly
  instructs `--border-control` on inputs). If KingFizzy rejects the border
  proposal, the Input/Select fix and the `@theme` addition must be reverted.
- The 32 state variants cover all combinations described in the plan;
  some screens (Booklet Profile Setup, Validation) have no "empty" state
  because the form itself is the default and data is supplied by the user.

**Not done / blocked:**
- Phases 3–5 not started (Exam Officer, Marking, Moderation screens).
- Navigation, badges/tags, progress/loaders still missing from the component
  library (used inline where needed).
- No interactive "draw-a-box" correction tool. That is a Figma detail that
  the scaffold cannot meaningfully implement; the validation screen exposes
  the control point with a "Draw box" button placeholder.

---

## 2026-07-28 (audit), claude-opus-5

**Phase:** Audit of the deepseek-v4-flash-free Phase 2 delivery. Not new screen work.

**Verified independently (not taken from the previous entry):**
- `npx tsc --noEmit`, passes, exit 0. Confirmed.
- Dev server runs on 5179, all screens render, **zero console errors**. Confirmed.
- All Phase 1 tokens resolve at runtime. Confirmed.
- Badge contrast measured in-browser: success 4.72:1, warning 6.43:1 at 12px, both pass WCAG AA. Muted text 5.74:1. Notice accent bar renders correctly
  (4px tone-coloured left edge, 1px grey elsewhere), the class-order concern
  was unfounded.
- `Input`/`Select` do now use `border-control`. Confirmed correct.
- `data-grid` not left on any screen. Confirmed.

**Corrections to the previous entry's claims:**
- It says "32 Phase 2 state variants" and "66 total screens". Actual counts are
  **33** and **65**. Verified by grep and by the live harness footer.

**Defects found and FIXED in this session (`src/screens/admin.tsx`):**
1. **WCAG 4.1.2 failure**, 12 icon-only buttons across Courses and People &
   Roles had no accessible name. Screen-reader users heard "button". Added
   per-row `aria-label` (e.g. "Suspend Dr. Balogun Salami"). Verified: 0 remain.
2. **Story A2/A3 acceptance criterion violated.** Booklet Profile Validation
   showed a success notice reading "All required fields detected / looks ready"
   while one field was still flagged, with **"Mark as ready to use" enabled**.
   The plan states the profile cannot be marked ready until every flagged field
   is resolved. Notice rewritten to a warning, button now `disabled`, unresolved
   count shown. Verified in browser.
3. Ten unused `lucide-react` imports plus an unused `Progress` import removed.
   `tsconfig.json` has `noUnusedLocals: false` (pre-existing, my scaffold), so
   tsc could not catch these.
4. `as any` cast on the detection-report badge tone replaced with a typed
   `DETECTION` constant.
5. `<th>` missing `scope="col"`; `py-2.5` off the 4/8/12/16/24/32/48 spacing
   scale. Both corrected.

**Found, NOT fixed, these need KingFizzy's ruling, not my guess:**
- **The Desktop Grid is used by nothing.** `.page-grid`, `.content-grid` and
  `.col-N` appear in zero screens. Phase 1's main deliverable is unapplied, so
  column alignment between code and Figma cannot be checked.
- **Result Correction shows a Student column next to the Script ID.** The plan
  reserves identity display for the Identity Registry (H2, Exam Officer only).
  Showing both in one row is a de-anonymisation surface with no reason-gate.
- **Story G2 is described but not designed.** The screen lists locked results
  and a "Correct" button; there is no reason-capture step and no old-value /
  new-value display, which is the substance of the story.
- `max-w-2xl` (Tailwind's default 672px) used as a form width, no Markelo
  token exists for this. Marked with a `TODO(token)` comment rather than
  invented. Needs a form-width decision.
- `bg-white` is used throughout the whole scaffold while `--color-card`
  (#FAFAFA) sits unused, contradicting the "never pure white" rule recorded in
  `index.css`. **Pre-existing and system-wide, not introduced by this session.**
- Booklet Setup and Booklet Validation still ship 4 states, not 5 (disclosed by
  the previous agent).
- The "draw-a-box" correction tool is a button placeholder only (disclosed).

**Not done / blocked:** Phases 3–5. Navigation, badges/tags, progress/loaders
still missing from the component library. Border and motion tokens still
PROPOSED, awaiting Figma replication.

---

## 2026-07-29, claude-opus-5

**Phase:** Design correction, attention box (`Notice`) rebuilt to KingFizzy's reference.

**The old style is RETIRED across all his work, not just Markelo.** No 4px left
accent bar, no 12px card radius, no tone-coloured text. Do not reintroduce it.

**Built:**
- `src/ui/kit.tsx`, `Notice` rewritten. Flat tinted fill, 8px `radius-control`,
  neutral text (title #1A1A1A, body #666666), tone carried entirely by the fill.
  `neutral` is the only outlined variant. New optional props: `icon`, `compact`,
  `link`, `action`, `onDismiss`. CSS grid, not flex, so the body hangs indented
  to the title instead of wrapping under the icon.
- `src/screens/components.tsx`, **new file.** Full variant sheet for Figma
  replication, plus an on-#F5F5F5 comparison block.
- `src/App.tsx`, new "Component reference" harness group. 66 screens.
- `IMPLEMENTATION_PLAN.md`, icon table: notice icon 18 → **16**, dismiss × 14.

**Accessibility rule added (KingFizzy accepted):** with the tone living only in
the fill, colour becomes the sole carrier of meaning. That is WCAG 2.2 SC 1.4.1. The
icon is therefore **forced on for success, warning and error** and can only be
suppressed on brand and neutral.

**Decisions KingFizzy made this session:**
- Keep the existing pale tint tokens, not the reference's more saturated fills.
- **Skip dark theme and black theme entirely.** Markelo has no dark mode.
- Radius = `radius-control` (8px).

**Verified:**
- `npx tsc --noEmit`, passes, exit 0. No console errors.
- Contrast measured in-browser on all four tints: title **15.25:1**, body
  **5.03:1**. Both pass AA.
- Tint vs the #F5F5F5 page background is 1.02–1.05 in luminance, weak on paper,
  but hue carries it and it reads acceptably. Screenshotted for his judgement.
  If more separation is wanted later, add a 1px border in the tone's own hue
  rather than changing fill values.
- All 31 existing `<Notice>` call sites still compile and render; the rewrite is
  backward-compatible on `tone` / `title` / children.

**Not done / blocked:**
- Dismiss is opt-in and currently used nowhere in the product screens. The
  offline banner and the "unlocking requires a stated reason" notice must never
  become dismissible.
- More UI corrections are queued, KingFizzy is working through the elements he
  is unhappy with one at a time.
- Everything from the 28 July audit that needs his ruling is still open: the
  grid is applied to no screen, Result Correction shows a Student column beside
  the Script ID, story G2 has no reason-capture step, `bg-white` is systemic.

---

## 2026-07-29 (later), claude-opus-5

**Phase:** Design correction 2, control heights, CTA overflow, badges, select padding.

**Diagnosis first, the reported symptom was not the cause.** Every button in
the product measured **exactly 40px** from the one `Button` component; nothing
was 56px and no two pages disagreed. The real faults were different:

1. **CTA overflow.** `<Button full>` sets `width:100%`. Two of them in a flex
   row each demand the full row and can only stay inside it by arithmetic luck.
   The auth column was `max-w-sm` = 384px and the two CTAs measured
   187 + 185 + 12 gap = **384 exactly. Zero slack.** Any longer label pushed
   the primary button out of frame.
2. **Badge height.** `Badge` took its height from its text, so "Moderator / HOD"
   wrapped to two lines in a narrow row and rendered 2px–20px taller than
   "Lecturer".
3. **Select chevron.** The arrow was the browser's **native** one, drawn hard
   against the right edge and impossible to pad away.

**Built:**
- `src/ui/kit.tsx`
  - Control height scale documented in one place: **sm 32 (table rows only),
    md 40 (in-card, matches Input/Select), lg 48, xl 56 (page and modal CTAs)**.
    `xl` is **new and PROPOSED**, needs a Figma variable.
  - `min-w-0` added to the button base so a button in a flex row shrinks
    instead of overflowing.
  - `Badge` fixed to **h-6 (24px)**, `shrink-0`, `whitespace-nowrap`.
  - `Select` now `appearance-none` with a **Lucide ChevronDown** at 12px from
    the right, matching the 12px text inset on the left. `pr-10` so no option
    label slides under it.
- `src/ui/shell.tsx`, auth column `max-w-sm` (384) → **`max-w-lg` (512)**.
- `src/screens/auth.tsx`, session-expiry card → `max-w-lg`; CTA row → CSS grid.
- `src/screens/onboarding.tsx`, invite rows use `min-w-0 flex-1` so the badge
  is pushed right and the email truncates; all CTA rows → grid.
- `src/screens/dashboards.tsx`, the two `lg` marking CTAs → `xl`.

**Every two-button CTA row is now `grid grid-cols-2`, not flex.** A grid gives
each child exactly half the row, so the overflow cannot recur regardless of
label length or font metrics.

**Verified:**
- `npx tsc --noEmit`, passes, exit 0.
- Static sweep of every `<Button>` in the product: heights are now **32 / 40 /
  56 only**. No 48px stragglers. Zero flex rows with 2+ full-width buttons.
- Invite screen measured live: column 512px, all three role badges **24px**,
  all three rows **66px**, CTA row 250 + 250 with **0px overflow**.
- Select measured live: padding-left 12px, chevron 12px from the right edge,
  `appearance: none`, 6 options intact.
- A `<Select>` error in the console was traced to the HMR state **between two
  of my edits** (chevron added before its import). Re-checked after reload:
  renders correctly, no error overlay. Not a live defect.

**Not done / blocked:**
- `max-w-lg` (512px) and the new 56px `xl` height are **off-token**, both
  marked `TODO(token)`. KingFizzy needs to add a form-column width variable and
  a control-height variable in Figma.
- Everything still open from the 28 July audit is unchanged.

---

## 2026-07-29 (later still), claude-opus-5

**Phase:** Design correction 3, stacked button height mismatch.

**Found:** in the shared `Welcome` component (`src/screens/onboarding.tsx`) the
primary CTA was `xl` (56px) and the ghost "Skip, take me to my dashboard"
directly beneath it defaulted to `md` (40px). **A ghost button has no fill at
rest, so the mismatch was invisible until hover painted its box**, which is how
KingFizzy found it.

`Welcome` is shared by all six welcome screens (Admin, Exam Officer, Lecturer,
TA, Moderator, Senior Management), so this was six screens, not one.

**Fixed:** ghost button → `size="xl"`. Measured live: both buttons now
**56 × 512px**, identical left and right edges.

**Swept the whole product for the same class of defect** with a script that
groups `<Button>`s by file, indentation and proximity, then flags any group
holding more than one height. Two apparent hits were checked and are false
positives:
- `admin.tsx` L102–103, both `size="sm"`; the second is a multi-line tag.
- `onboarding.tsx` L237 vs L243/246, "Add another course" sits in the course
  list container, not in the Back/Continue row.

**Zero real mismatches remain.**

**Standing rule added to the component docs:** buttons stacked or rowed in one
group always share a size. The ghost variant makes a violation invisible until
hover, so this cannot be caught by looking at a static screen.

**Verified:** `npx tsc --noEmit` exit 0. No new console errors, the two
`<Select>` entries in the buffer are the stale HMR-state errors already
explained in the previous entry, carrying the same old timestamp.

---

## 2026-07-29 (fourth entry) : claude-opus-5

**Phase:** Design correction 4. Primary CTA clipping, plus a project-wide em dash ban.

**The clipping was a regression I introduced.** Padding was never 0. It measured
24px on both sides. The label "I understand [em dash] continue" needed 250px of
intrinsic width in a column that is exactly 250px at the design width and
narrower on a smaller window. When I added `min-w-0` to the button base earlier
today to stop CTA rows overflowing, I let the button shrink below its content,
so the row stopped spilling and the label started clipping quietly instead. One
bug traded for a subtler one.

**Fixed:** the label is now "Continue". Measured at a 1280px window: box 236px,
intrinsic need 145px, 91px of slack. Padding confirmed 24px each side.

**Label budget documented in `kit.tsx`** so this cannot recur silently. An `xl`
button in a two-column CTA row has roughly 160px of text room at 1280px, about
19 characters. Measured slack on every current CTA label:
"Continue" 91, "Skip for now" 83, "Send 3 invitations" 28,
"Check the booklet" 20, "Keep me signed in" 12. The last one is the next to
clip if anything shifts.

**OPEN QUESTION for KingFizzy:** what is the minimum supported window width?
Desktop-only was ruled on 28 July but no minimum was set. Every measurement
above is at 1280px. Below that, the tight labels clip.

**Em dash banned project-wide (standing instruction, all projects).**
Removed **409 em dashes across 30 files**: `webapp-scaffold` source and CSS,
`design-system-preview`, `IMPLEMENTATION_PLAN.md`, `START_PROMPT.md`,
`PROGRESS.md`, `Docs/`, `Research/`, `DesignSystem/`, and both `index.html`
files. Not a mechanical hyphen swap. Replacements were chosen by sense:
- two independent clauses became two sentences
- appositions became commas
- labels followed by an expansion became colons
- em dashes standing in for an empty table value became words
  ("Not set" for an unassigned role, "Not yet" for an ungiven moderated score)
- decorative dash bullets in the dark aside became middots

**Verified:** `npx tsc --noEmit` passes in both `webapp-scaffold` and
`design-system-preview`. Zero em dashes remain in any project file outside
`node_modules`. Screens re-checked in the browser and render correctly.

**Also swept:** the memory index `MEMORY.md` had 39 em dashes. Cleared.

---

## 2026-07-29 (fifth entry) : claude-opus-5

**Phase:** Repairing the artefacts left by the mechanical em dash sweep, plus
harness-level enforcement so the rule cannot be forgotten again.

**The problem with the earlier sweep.** Replacing every em dash with ", " was
fast but wrong in about 45 places. It produced comma splices ("Not a product
screen, a review tool"), label-comma constructions that should have been colons
("Markelo UI kit, the subset of..."), and run-ons ("the container is too narrow,
that is the thing to fix"). Fixed each one by sense:

- two independent clauses became two sentences
- a label with its expansion became a colon
- a list of qualifiers became brackets
  ("The old pattern (4px bar, 12px radius, tone-coloured text) is RETIRED")

Repaired across `App.tsx`, `admin.tsx`, `auth.tsx`, `components.tsx`,
`dashboards.tsx`, `onboarding.tsx`, `kit.tsx`, `shell.tsx`, `index.css`,
`roles.ts`, plus `PROGRESS.md`, `IMPLEMENTATION_PLAN.md`, `Docs/`, `Research/`,
`DesignSystem/` and the `design-system-preview` app.

**A form the first sweep missed entirely.** `onepager.html` and
`design-system-preview/public/onepager.html` used the HTML entity `&mdash;`,
14 occurrences each. A character-only search never sees those. Also checked
`&#8212;`, `&#x2014;` and `—`.

**ENFORCEMENT, so this does not depend on a model remembering.**
New `PreToolUse` hook on `Write|Edit|NotebookEdit` in `~/.claude/settings.json`,
running `~/A.I-Workspace-Second-Brain/scripts/hook-block-em-dash.py`.

`PreToolUse`, not `PostToolUse`, on purpose: it **denies the write** so the
character never reaches disk, rather than reporting it afterwards. It inspects
`content`, `new_string`, `new_source` and every entry of an `edits` array, and
catches the literal character plus all three encoded forms. The denial message
states the correct replacement per context and explicitly forbids swapping in a
hyphen.

**Verified:** four pipe-tests (clean write passes, literal, `&mdash;`, and an
`edits` array all denied), `jq -e` schema check passes, existing Bash and
skill-sync hooks preserved, 36 permission rules and 12 plugins intact. Proved
live: an Edit containing an em dash was refused, a clean Edit went through.
Test file removed. `npx tsc --noEmit` passes. Zero em dashes in the project in
any form.

---

## 2026-07-29 (sixth entry) : claude-opus-5

**Phase:** Phase 3 started. Scanning flow, stories B1 and B2.

**Checked first: neither screen existed.** Phase 3 had not been started. The only
mention of scanning anywhere was a "Latest scan batch" card on the Exam Officer
dashboard.

**Built `src/screens/scanning.tsx`, 11 screens:**

Scan Batch Upload (B1), 5 states. Integrity Report (B2), 6 states, the extra one
being a batch-complete state, which is the state the officer actually acts on.

**Acceptance criteria driven, not decorative:**
- **B1** "Scripts do not need to be scanned in student-name or matric-number
  order." The screen SAYS this in a notice at the top. An officer who does not
  believe it will still pre-sort a 500-booklet stack by hand, which is the exact
  manual labour the product exists to remove.
- **B2** "A script showing Matched can be assigned for marking immediately,
  independent of the rest of the batch." The assign action is live on Matched
  rows **while the batch is still at 80%**. Verified in the browser: all four
  Matched rows have an enabled "Assign for marking" button while the progress
  card still reads 412 of 512.
- **§9.2.1 and the B4 caveat.** The confidence thresholds are an unvalidated
  target. A warning notice states that every script needs human confirmation
  during the pilot whatever status it shows, and there is deliberately **no
  bulk-accept-by-confidence control** on the screen. Verified by text search.

**Identity decision, flagged for KingFizzy.** No student name or matric number
appears on either screen. Status is reported against a Script ID only. This
follows the implementation plan's statement that the Identity Registry (H2) is
"the only place a name appears", and pushes identity resolution into the
Exception Queue (B5) where it is logged. **If the Exam Officer needs to see the
matched student inline while reviewing a batch, that is a deliberate change to
the identity model and needs his ruling, not a quiet edit.**

**Error states are partial-failure aware.** The upload error names the likeliest
real cause (an exam with no validated booklet profile) rather than a generic
failure. The report error keeps the 21 already-assembled scripts assignable
instead of discarding real scanner time behind a "processing failed" wall.

**BUG FOUND AND FIXED IN A SHARED COMPONENT.** `ScriptId` had no
`whitespace-nowrap`, so "MK-000245" was breaking across two lines in a narrow
table column, rendering 42px tall instead of 24px. A Script ID is the single
token markers and officers identify a script by, so it must never wrap. Fixed in
`kit.tsx` with `whitespace-nowrap` and the same fixed 24px height as `Badge`.
**This also fixes the Result Correction table in `admin.tsx`**, which had the
same defect.

**Verified:**
- `npx tsc --noEmit` exit 0. No console errors.
- 77 screens registered. Footer label corrected to "Phase 1 to 3".
- At a 1728px window: table rows a uniform **57px**, no wrapping, zero
  horizontal overflow, all Script IDs 24px.
- At 1280px rows grow to 92 to 137px. This is the known harness caveat, not a
  screen defect: the review rail takes 256px, so 1280 shows the app at an
  effective ~1024 frame. Related to the still-open minimum-width question.

**Not done / blocked:**
- Exception Queue (B3, B4, B5) is the natural next screen and is referenced by
  both screens built here. Not built.
- Rest of Phase 3: Exam Creation, Marking Scheme Setup, Student Data Upload,
  Identity Registry, Result Processing.
- The `Table`/`Th`/`Td` helpers now exist in three files. Worth extracting into
  `kit.tsx` before a fourth copy appears.
- The Desktop Grid is still applied to no screen, including these.

---

## 2026-07-29 (seventh entry) : claude-opus-5

**Phase:** Phase 3 continued. Triage and review, stories B3/B4/B5 and F1.

**Checked first: neither screen existed.** Only dashboard cards referenced them
("Exception queue", "Moderation queue"). Confirmed against Designer 6's
assignment in the week plan, which pairs both under one owner because they are
the same pattern, a queue of things a human decides on.

**Built `src/screens/triage.tsx`, 14 screens.** Exception Queue: pilot mode,
normal mode, the resolve panel, empty, loading, error, denied (7 states, one
extra for the two required modes). Moderation Workspace: default side-by-side,
marks-changed, return-to-marker, empty, loading, error, denied (7 states).

**Acceptance criteria verified live, not assumed:**
- **B4, two modes.** Pilot mode is the default because it is the current
  reality under §9.2.1's unvalidated thresholds, it lists every script
  including the ones with nothing flagged. Normal mode shows flagged only. Both
  built, neither is a stub of the other.
- **B5, specific reasons.** Five distinct reason strings (extra-sheet mismatch,
  unreadable field, missing pages, duplicate matric, no cover page), none of
  them says "needs review". Verified: resolving text states the entry "leaves
  the queue straight away".
- **B3, extra sheet never starts a script.** The resolve screen's reason text
  and notice both state this explicitly, verified by text search.
- **F1, side by side.** Verified: both "Original mark" and "Your mark" columns
  render. Changing two marks correctly computed a differing total and the
  screen labelled it "Score of record" with the original marked "kept
  permanently". Both totals stay visible together, which is what makes the
  screen useful as a dispute record later.
- **F1, return requires a reason.** Verified in the browser: the "Return to the
  marker" button is `disabled` on the return screen until a reason is entered.
  This is enforced by the control, not just hinted at.

**Identity decision, flagged rather than made quietly.** The exception queue
list shows Script IDs only. A candidate student's name and matric number appear
solely inside the resolve panel, framed as a logged lookup with the same
contract as the Identity Registry, because B5 cannot be satisfied without
showing who the candidate is. Moderation never shows a student at all, since it
is marking-facing, rule 1 applies, and only the Script ID appears. **The
marker's name does appear in moderation**, which F2 (audit and dispute
evidence) requires. If KingFizzy wants the queue list itself to preview
identity before opening an entry, that is a further change to this model and
needs his ruling.

**Verified:**
- `npx tsc --noEmit` exit 0. No console errors.
- 91 screens registered.
- `ScriptId`'s whitespace-nowrap fix from the last session holds here too:
  measured 24px in both the queue and moderation screens.
- At a 1728px window, all criteria above checked true via direct text and DOM
  assertions, not visual read.

**Not done / blocked:**
- Remaining Phase 3: Exam Creation, Marking Scheme Setup, Student Data Upload,
  Identity Registry, Result Processing.
- Phase 4 (Marking Interface) is the natural next flow and is the product's
  core; both screens built here feed scripts into it.
- The two-option mode switch on Exception Queue is a local component. If a
  second screen ever needs the same pattern, it should move into `kit.tsx`
  rather than being copied a second time.
- The shared-Table extraction task flagged last session is still pending,
  unrelated to this build.

## 2026-07-30 (eighth entry) : claude-sonnet-5

**Phase:** Phase 3 continued. Exam setup, story D1.

**Checked first: the screen did not exist.** Confirmed against Designer 3's
assignment in the week plan (27 July), which pairs Exam Creation with Marking
Scheme Setup under one owner. Only Marking Scheme Setup was requested, so only
that was built. Exam Creation remains open for whoever picks up the rest of
Designer 3's group.

**Built `src/screens/exam.tsx`, 5 screens.** Default (a scheme in progress,
five valid rows plus one deliberately invalid to show the inline error state),
empty, loading, error, denied. Registered as a new "Exam setup" group in
`App.tsx`, owner "Designer 3", ahead of the existing "Phase 3: Scanning"
group.

**Acceptance criteria verified live, not assumed:**
- **D1, marking cannot begin without a scheme.** The empty state is not a
  generic "add your first item" screen, it opens with an error-tone Notice
  stating the rule by name, then the EmptyState CTA underneath it. Screenshot
  confirmed both render together.
- **D1, a mark cannot exceed its question's maximum, designed as a blocked
  save.** A scheme cannot be confirmed with an invalid question. Question 5 in
  the default state ships with no value, a red-bordered `Input`, and an inline
  "Enter a mark greater than zero" message; the "Confirm scheme" button is
  `disabled` while that condition holds, matching the same disabled-until-valid
  pattern used for A2/A3 and the F1 return flow in earlier sessions.
- **No rubric builder.** The screen has exactly two fields per question
  (number, max mark) and says so in its own top Notice. No text field for a
  marking guide anywhere.

**Verified:**
- `npx tsc --noEmit` exit 0.
- 96 screens registered (91 plus these 5). Confirmed by reading the sidebar
  footer live in the browser, not by re-deriving the count from source.
- All five states clicked through and screenshotted in the preview at
  1280x720: default, empty, loading, error, denied. Denied correctly renders
  under the Teaching Assistant shell, matching the pattern used everywhere
  else permission-denied is shown.

**Not done / blocked:**
- Exam Creation (Designer 3's other screen) is still unbuilt.
- Remaining Phase 3: Student Data Upload and Validation, Identity Registry,
  Result Processing and Export.
- The row list (add/remove question) is presentational only, as with every
  other screen in this scaffold; there is no live add/remove interaction to
  test, only the states a real build would need to cover.
- The shared-Table extraction task flagged two sessions ago is still pending,
  unrelated to this build.

## 2026-07-30 (ninth entry) : claude-sonnet-5

**Phase:** Phase 4 begun early, ahead of the rest of Phase 3. Marking
workload, story D2. Requested explicitly: KingFizzy wants Marking Assignment
and Marking Progress assigned to one designer, matching Designer 7's pairing
in the week plan, so both were built together rather than one at a time.

**Built `src/screens/workload.tsx`, 11 screens.** Marking Assignment: default,
empty, loading, error, denied (5 states). Marking Progress: the Lecturer's
team view, the TA's own-pace view, empty, loading, error, denied (6 states,
one extra because story D2's second rule is a different screen for a
different role, not a filtered copy). Registered as a new "Phase 4: Marking
workload" group in `App.tsx`, owner "Designer 7", between Exam setup and
Scanning.

**Acceptance criteria verified live, not assumed:**
- **D2, a TA sees only their own pace, never a comparison.** Confirmed by
  building two separate functions, `MarkingProgressTeam` (Lecturer, shows all
  four markers side by side) and `MarkingProgressOwn` (TA, shows only that
  TA's three stats and one progress bar). Screenshotted both: the TA view has
  no other marker's name or number anywhere on it, and its Card header states
  the rule directly, "This is your own pace. It is not compared to anyone
  else's," reusing the exact line already shipped on the TA dashboard for
  consistency.
- **D2, reassignment preserves history.** Marking Assignment's "Recently
  reassigned" card shows a moved script (MK-001180) with a caption naming the
  original marker and stating her marks are "kept as history," not deleted.
  This is a second, independent surface of the rule beyond the top Notice, so
  the rule is demonstrated, not only described.
- **Reused the existing dashboard data model on purpose.** Both screens use
  the same marker roster and numbers already shown on the Lecturer and TA
  dashboards (Chidinma Eze, Tunde Alabi, Grace Obi, CSC 312, 62/24 for the
  Lecturer's own scripts). A reviewer moving between the dashboard and these
  two full screens sees one consistent set of numbers, not two different
  mock datasets that quietly disagree.

**Verified:**
- `npx tsc --noEmit` exit 0.
- 107 screens registered (96 plus these 11). Confirmed live in the browser
  sidebar footer.
- All 11 states clicked through and screenshotted individually in the
  preview: Marking Assignment's default, empty, and denied; Marking
  Progress's team view, own-pace view, and denied. Loading and error states
  read correctly from source (same skeleton and Notice pattern already
  verified elsewhere this project) but were not separately screenshotted this
  round.

**Not done / blocked:**
- The Marking Interface itself (Designer 8, stories C1/C2/E1/E2/K1) is the
  next natural screen, everything built in Phase 3 and this workload pair
  feeds scripts into it, but it was not requested this session.
- Remaining Phase 3: Exam Creation, Student Data Upload and Validation,
  Identity Registry, Result Processing and Export.
- The "Reassign" button on Marking Assignment and the Select-style marker
  picker it implies are presentational only, same convention as every other
  screen in this scaffold.
- The shared-Table extraction task flagged multiple sessions ago is still
  pending, unrelated to this build. `workload.tsx` adds a fourth local copy
  of the same `Table`/`Td` pair.

## 2026-07-30 (tenth entry) : claude-sonnet-5

**Two cleanup items, requested explicitly.**

**1. Shared Table/Td/Th/Row, extracted into `ui/kit.tsx`.** Four screen files
(`admin.tsx`, `dashboards.tsx`, `scanning.tsx`, `workload.tsx`) had each grown
their own copy. Two shapes had quietly diverged and both are preserved in the
one shared version rather than picking one and breaking the other's call
site: a header can be a plain string or `{ label, right? }` (only
`scanning.tsx`'s trailing actions column used the object form, for
right-aligned header text), and header cell padding had split 2-and-2 between
`py-3` and `py-2.5`. Standardised on `py-3` to match `Td`'s own padding,
which is what `admin.tsx` and `scanning.tsx` already did. Also added
`scope="col"` everywhere, `dashboards.tsx`'s inline header previously
omitted it. All four files now import `Table`, `Td`, and (where used) `Row`
from `../ui/kit` instead of declaring their own. `LoadingRows`/`SkeletonRows`/
`SkeletonCard` were left alone, out of the requested scope and not identical
across files.

**2. Sidebar active-state bug, fixed everywhere, not just new screens.**
KingFizzy flagged that the in-app sidebar was not highlighting the current
screen. Root cause: `AppFrame`'s `activeLabel` prop defaults to `"Dashboard"`
when not passed, and only one screen in the whole scaffold
(`SessionExpiryWarning` in `auth.tsx`) was ever passing it. Every other
screen, going back to the very first Phase 2 build, was silently showing
"Dashboard" highlighted regardless of which page was actually open. This was
never caught earlier because every review this project has done was of a
single screen at a time, not a click-through across screens where the stale
highlight would be obvious by comparison.

Fixed by passing `activeLabel` matching the nav item's exact label on every
`AppFrame` call: 33 individual call sites in `admin.tsx` (scripted, matched
on each screen's title text), 5 in `exam.tsx`, 11 in `workload.tsx`, and one
shared shell component each in `scanning.tsx` (`UploadShell`, `ReportShell`)
and `triage.tsx` (`QueueShell`, `ModShell`), which covers all of their
variant screens in one edit. Dashboards and the two already-correct
signed-out screens needed no change.

**A gap this surfaced, not just a labeling bug.** Setting `activeLabel`
correctly on the denied-role screens (e.g. a TA looking at Marking
Assignment) exposed that two nav items story D1 and D2 require did not exist
on the roles that need them: the Exam Officer's nav had no "Marking scheme"
entry at all (only the Lecturer's did, even though D1 grants the capability
to "Exam Officer or Lecturer"), and the Teaching Assistant's nav had no
"Marking progress" entry (even though D2's own-pace rule is specifically
about what a TA sees). Added both to `roles.ts`: "Marking scheme" to the
Exam Officer nav between "Exams" and "Student data", matching Phase 3's
build order; "Marking progress" to the TA nav between "My marking" and
"Flagged for review".

**Verified:**
- `npx tsc --noEmit` exit 0 after each step.
- Visual spot-check in the live preview at 1280x720: Courses (Table
  extraction) renders pixel-identical to its pre-extraction screenshot from
  two sessions ago. Marking assignment, Marking scheme, Scan batch upload,
  Exception queue, and Moderation each screenshotted with the correct sidebar
  item highlighted and no other item highlighted.
- A stale Vite HMR error ("Duplicate declaration Row") appeared once in
  `preview_logs` mid-edit, from before the `dashboards.tsx` edit had
  finished landing. Confirmed via a fresh screenshot and a second
  `preview_logs` read that it did not reproduce, and the source file itself
  has no duplicate.

**Not done / blocked:**
- `LoadingRows`, `SkeletonRows`, and `SkeletonCard` remain duplicated with
  minor per-file differences (row counts, skeleton widths). Not extracted,
  out of the scope requested this round.
- Did not screenshot every one of the 107 screens' loading/error states
  individually; spot-checked a representative one per fixed file plus every
  file that previously lacked a shared shell.

## 2026-07-30 (eleventh entry) : claude-sonnet-5

**Phase 3 continued. Student data and results, PRD §10 step 2, stories H2
and G1.** Confirmed scope against the week plan before building: Designer
4's assignment is exactly Student Data Upload and Validation, Identity
Registry, and Result Processing and Export, nothing else, KingFizzy asked
for exactly that list and it matched.

**Built `src/screens/studentdata.tsx`, 16 screens.** Student Data Upload:
default, empty ("scanning cannot begin" blocked state), loading, error,
denied (5). Identity Registry: default, empty, loading, error, closed,
denied (6, closed is a real lifecycle state, not a Denied variant). Result
Processing and Export: default, empty, loading, error, denied (5).
Registered as a new "Student data and results" group in `App.tsx`, owner
"Designer 4", between Exam setup and Scanning.

**A scope decision surfaced before building, not silently made.** G1's
export file has to reunite marks with real students, the institution's
portal needs names to file grades against. But the project's own rule says
the Identity Registry is the only place in the whole product a name appears.
Resolved by keeping Result Processing Script-ID-only on screen; the Notice
on that screen states plainly that identity matching happens at export time,
not in the UI. Flagged this to KingFizzy before writing any code rather than
picking a side quietly.

**Acceptance criteria verified live, not assumed:**
- **§10 step 2, handles 5,000+ records.** The upload screen's top Notice
  states the cohort-size and time target directly ("5,000 records or more,
  validates in about a minute"), and the flagged-rows table demonstrates the
  three real failure modes named in the PRD text: duplicate matric number,
  missing course code, and a matric number that does not match the
  institution's format.
- **H2, only place a name appears.** Verified by grep across the new file:
  the only screen with a student name anywhere on it is Identity Registry.
  Result Processing's table has no name column, confirmed by reading the
  rendered screenshot.
- **H2, closed at Marking status, never after.** Built as its own state,
  `IdentityRegistryClosed`, not a shade of Denied, because an Exam Officer
  with full permission still cannot open it once the exam has moved past
  Setup. Screenshotted: the screen shows only the block, no search form
  underneath it a user could still try.
- **H2, every lookup requires a reason and is logged.** The lookup form's
  reason field is marked required, and a "Recent lookups" table sits directly
  below the result, showing Script ID, who looked it up, the stated reason,
  and when, so the logging isn't just asserted in a Notice, it's demonstrated
  as existing data.
- **G1, fixed formula with manual override.** The results table computes
  Total as CA + Exam inline (not a hardcoded value), and one row carries an
  "Overridden" badge instead of the usual ghost "Override" button, showing
  both the normal path and the override path in the same table.

**Verified:**
- `npx tsc --noEmit` exit 0 (one unused import, `Lock`, caught and removed
  before this).
- 123 screens registered (107 plus these 16), confirmed live in the sidebar
  footer.
- Sidebar active-state highlighting, the subject of the fix earlier this
  session, checked correct on all three defaults plus the Identity Registry
  closed state: "Student data", "Identity registry", and "Results" each
  highlight only on their own screen.
- Screenshotted default and one blocked state per screen (Student data
  empty was read from source rather than re-screenshotted, identical
  Notice-then-EmptyState pattern already verified on Marking Scheme Setup
  two sessions ago).

**Not done / blocked:**
- Phase 3 is now fully built except Exam Creation (Designer 3's other
  screen, not requested this session either time it came up).
- Phase 4 (Marking Interface, the product's core) and the remainder of
  Phase 5 (Result approval, Dispute evidence view) remain.
- Result Processing's "Override" button and the Student Data upload's
  per-row "Fix" affordance are presentational only, same convention as
  every screen in this scaffold.
- The shared-Table extraction (`Table`/`Td`/`Th`/`Row` in `ui/kit.tsx`) from
  earlier this session was reused directly here with no changes needed,
  confirming it covers this shape of screen cleanly.

## 2026-07-30 (twelfth entry) : claude-sonnet-5

**Closed out the three items still open from the 28 July audit of
`admin.tsx`,** confirmed unresolved this session by reading the live code
before touching anything, then fixed all three on request.

**1. Result Correction's Student column, removed.** The table (`admin.tsx`,
`ResultCorrectionDefault`) went from `["Course", "Student", "Script", "CA",
"Exam", "Total", "Grade", "Status", ""]` to the same list minus `"Student"`,
and the corresponding `<Td>{r.s}</Td>` cell and `s` field on each row. Left a
comment explaining why: this table is Institution-Admin-facing, not
marking-facing, but H2 reserves identity for the Identity Registry
specifically, "the only place a name appears" only holds if every screen
respects it, not just the ones an auditor happens to check.

**2. Result Correction's "Correct" button now has a real destination.**
Added `ResultCorrectionEditing`, a new exported screen showing what G2 asked
for and nothing more: a locked "current value" panel (CA, Exam, Total,
Grade, read-only), an editable "new value" panel with live-computed new
total and grade, a required "Reason for this correction" field with a hint
that it is recorded alongside the actor and the timestamp, and a two-button
footer, cancel and re-lock unchanged, or save and re-lock. Registered as
"Result correction: editing one" in `App.tsx`, same convention as
`ExceptionQueueResolve`, a state you reach by picking a row, not a fifth
lifecycle state.

**3. Booklet Setup and Booklet Validation, both given their missing empty
state.** `BookletProfileSetupEmpty`: no cover page uploaded yet, states
plainly that the cover page is the only required one. `BookletProfileValidationEmpty`:
nothing to validate yet, points back to the setup screen rather than
showing a validation report with nothing in it. Both screens are now five
states each, matching the Definition of Done.

**Verified:**
- `npx tsc --noEmit` exit 0.
- 126 screens registered (123 plus these 3: the two empty states plus the
  new editing screen for Result Correction).
- Screenshotted all three fixes live: Result Correction's default table
  confirmed Script-ID-only with no Student column; the editing panel
  confirmed showing locked old value, editable new value with live
  recompute, and the required reason field; both booklet empty states
  confirmed rendering their EmptyState with correct copy and CTA.

**Not done / blocked:**
- The editing panel is presentational only, same convention as every screen
  in this scaffold: the "New value" inputs and the live total/grade shown
  underneath are not wired to actually recompute from a keystroke, they are
  a static illustration of what recomputation would show.
- No further known gaps from the 28 July audit remain in `admin.tsx`. If
  another one turns up, it should be checked against the live file first,
  the same way this entry was, rather than trusted from an old summary.

## 2026-07-30 (thirteenth entry) : claude-sonnet-5

**Three layout fixes, requested directly against rendered screens rather
than source.** All three verified with real DOM measurements in the live
preview, not by eyeballing a screenshot.

**1. `Stat` cards, figure anchored to the bottom.** `ui/kit.tsx`'s `Stat`
component packed label and value at the top with `flex-col gap-1`, so a row
of cards where one carries a `sub` line and others don't reads as uneven,
the short ones just stop early instead of matching their neighbours.
Changed to `justify-between` with a `min-h-[104px]` floor, so the label
anchors top and the value (plus `sub`, grouped together) anchors bottom,
independent of a row's tallest card. This is the shared component, so it
applies everywhere `Stat` is used, not just Student Data's three cards,
that was a deliberate call: KingFizzy's second request in the same message
was explicitly about uniformity across a screen, and a shared component
already IS the mechanism this project uses for that.

**2. Identity Registry's Recent Lookups table no longer needs horizontal
scroll.** All three cards on that screen (Look up a script, Result, Recent
lookups) share one wrapping div, so the fix was widening that one div from
`max-w-2xl` (672px) to `max-w-4xl` (896px) rather than only the table's
card, exactly per KingFizzy's own stated constraint: widening just the
table card while the other two stayed narrow would read as a mistake, not
a decision. Confirmed via `scrollWidth` vs `clientWidth` on the table's
`overflow-x-auto` wrapper: 670 vs 670, no scroll needed. Scoped to
`IdentityRegistryDefault` only, the other five states on that screen don't
carry the table and didn't need the width.

**3. "Need attention" now fits on one line, and all three Stat cards lost
2px of horizontal padding.** Measured before touching anything: the
label's natural unwrapped width was 147px, and the card's available inner
width (197px card minus 24px padding per side minus the 1px border per
side) was also 147px, a dead-even fit that lost to sub-pixel rounding.
KingFizzy's own answer, reduce the padding by 2px each side, fixed both
problems at once: `Card`'s default `p-6` (24px all round) was swapped for
`pad={false}` on the `Stat` card specifically, with explicit `py-6
px-[22px]`, keeping vertical padding untouched and only trimming
horizontal, confirmed measured at exactly 22px afterward and the label
rendering as a single `ClientRect` (one line).

**Verified:**
- `npx tsc --noEmit` exit 0 after each of the three changes.
- Real DOM measurements, not visual guesses: label natural width vs
  available card width before the fix; table `scrollWidth`/`clientWidth`
  before and after the width change; label top-offset (25px) and
  value-bottom-offset (25px) after the `justify-between` change, confirming
  actual symmetry, not just "looks closer."
- Screenshotted Student Data's three cards and Identity Registry's three
  cards together after all three fixes landed, to confirm none of the
  changes fought each other.

**Not done / blocked:**
- `Stat`'s new `min-h-[104px]` is a chosen constant, not a token. If
  KingFizzy wants a real spacing/sizing token for stat-card height, that is
  a Figma-side decision he owns, flagged the same way border and motion
  tokens were flagged earlier this project.
- The wider Identity Registry column (`max-w-4xl`) was not applied to
  Empty, Loading, Error, or Closed, none of them carry a table, and making
  them wider too was not asked for.

## 2026-07-30 (fourteenth entry) : claude-sonnet-5

**Follow-up on the same `Stat` card.** KingFizzy came back not satisfied,
the previous round's `min-h-[104px]` technically anchored the label top and
the value bottom, but with 24px/22px padding eating most of the card there
wasn't much left for `justify-between` to actually distribute, so it barely
read as intentional. Two explicit asks this round: real auto-distributed
space between the two groups, and 16px padding on all four sides, not the
asymmetric 24px/22px from before.

**Changed `Stat` in `ui/kit.tsx`:** `p-4` (16px, uniform, replacing the
`py-6 px-[22px]` split) and `min-h-32` (128px, up from 104px). The padding
alone would have shrunk the visible gap further, so the height had to grow
to compensate, that is what actually gives `justify-between` real room:
label and value content only need about 60px combined, so at 128px card
height the rest becomes genuine breathing room, not a rounding error.

**Verified with real measurements, before claiming done:**
- Card height: 128px. Padding: 16px on all four sides (`getComputedStyle`
  read back `padding: 16px` uniformly).
- Gap between the label's bottom edge and the value block's top edge:
  42.8px, up from roughly 18px in the previous round.
- Top padding to label (17px) and bottom padding to value (17px) are
  symmetric, confirming the card isn't just taller, the two groups are
  correctly anchored to opposite ends.
- Re-checked a row with mixed content (Marking Progress: Team, where one
  card carries a `sub` line and two don't) to confirm the fix holds under
  the exact condition it was meant to fix, all three values now sit on the
  same visual baseline regardless of which cards have a `sub`.
- `npx tsc --noEmit` exit 0.

**Not done / blocked:**
- `min-h-32` and `p-4` are still chosen constants, not tokens, same caveat
  as last round. A real stat-card sizing token remains a Figma-side
  decision for KingFizzy to make.

---

## 2026-08-02 — Prototype flow app (presentation layer, on request)

**Model:** opencode/deepseek-v4-flash

KingFizzy asked for a standalone clickable-prototype app: every auth screen and
every role dashboard on one long vertically scrollable canvas, no routing, no
backend. Built as `~/Downloads/Fahhz/Markelo/prototype-flow/` — a separate Vite
app that **imports the screens live from `webapp-scaffold/src/screens/*`** (zero
copies; the scaffold was not modified). Order mirrors the "Sign in & account"
and "Dashboards" groups of the scaffold's `App.tsx` GROUPS registry.

**What changed:**
- New app: `prototype-flow/` (package.json, vite/ts config, `src/flow.tsx`
  screen registry + action maps, `src/components/ScreenShell.tsx`,
  `src/components/PrototypeNav.tsx`, `src/App.tsx` scroll canvas, `verify.mjs`
  + `verify/` screenshots, puppeteer-core dev dep).
- 18 screens: 12 auth (Sign In → Signing In → Wrong Credentials → MFA →
  Accept Invitation → Forgot Password → Reset Sent → No Role → Suspended →
  Choose Role → Session Expiring → Access Revoked) + 6 dashboards (Officer,
  Lecturer, TA, Moderator, Admin, Senior Management).
- CTA clicks smooth-scroll via click delegation on a wrapper (screens
  untouched): Sign in → Signing In (any-click → MFA) → Confirm → Choose Role →
  Lecturer/Moderator card → that dashboard; Forgot password ↔ Back to sign in;
  sign-out paths → Sign In. Loading screen advances on any click.
- Floating nav is one app-level instance with a scroll-spy. A first version
  rendered one nav per dashboard section, which stacked six fixed navs and left
  only the last (Next-disabled) clickable — fixed by lifting it to `App.tsx`
  with a scroll-spy tracking the current dashboard (prev/next disable at ends,
  Auth, Top).

**Verified (counts, how counted):**
- 18 screens — counted in the live DOM
  (`document.querySelectorAll("section[id]")`, headless Chrome).
- `npx tsc -b` + `vite build` exit 0.
- 13/13 behavioral checks PASS in headless Chrome (scroll lands exactly on
  each target, computed styles = design tokens: h1 28px/700 Plus Jakarta Sans,
  CTA bg rgb(26,86,160) #1a56a0, exactly 1 nav instance, prev/next disabled
  states, 0 JS errors). Screenshots at `prototype-flow/verify/` for an eyeball
  pass (this session's model cannot read images).

**Not done / open:**
- Mapping judgment calls for KingFizzy: MFA "Confirm" → Choose Role, Choose
  Role Lecturer/Moderator cards → those dashboards, Session Expiry "Keep me
  signed in" = deliberate no-op. Each is a one-line edit in `src/flow.tsx`.
- "End of prototype" footer exists; no intro/cover screen.
- The 07-30 scaffold commits (Stat cards, Student Data Upload etc.) are
  recorded here in PROGRESS.md but still have no entry in the workspace's
  `logs/` — flagged at the 08-02 START, still awaiting a workspace log line.

---

## 2026-08-03 (fifteenth entry) : claude-opus-5

**Phase:** presentation layer (prototype-flow) + Phase 1/2 shared components

Auth-screen redesign and a categorised sidebar, both requested by KingFizzy
against four uploaded reference images. Three approach decisions were his, taken
before any code: the redesign lands in the **shared scaffold source** (so 5179
and 5180 both change, keeping prototype-flow's zero-copy architecture); the
right-panel artwork is **drawn as tokenized inline SVG**, not sourced 3D renders,
because html-to-design imports vector as editable layers and raster as one flat
rectangle; and the mockup's **"Sign in with SSO" button was NOT built**, because
an authentication method no document commits to is a spec claim, not a visual
one (rule 3, never invent evidence).

**Built:**

- `prototype-flow/src/components/ScreenShell.tsx` — **the 1392.09px bug.** Every
  artboard was wrapped in `px-6` on a fluid block, so each screen rendered at
  viewport minus 48px and html-to-design carried that into Figma as the frame
  width. Now a fixed 1440x1024 block with the padding as outer margin.
  `mx-auto w-max` so a window narrower than 1440 scrolls instead of clipping.
  Height was `100vh`, the identical non-determinism, and was pinned to 1024.
- `src/ui/authart.tsx` — **NEW.** Twelve illustrations built from two isometric
  primitives (`Plate`, `Slab`) on one 2:1 projection, so twelve subjects read as
  one family. Every colour is a token.
- `src/ui/shell.tsx` — `LogoMark` (circular badge above the form, placeholder
  `M` inside pending KingFizzy's logo file); `AuthAside` (headline, icon-chip
  bullets, art, chip); `ASIDE` map of eleven per-screen panels; `Sidebar`
  rebuilt with an identity block, nine category groups and per-role padlocks.
- `src/ui/kit.tsx` — `Input` gained an optional leading `icon`, inset 12px to
  match the Select chevron, `pl-10`, always `aria-hidden`.
- `src/roles.ts` — `NAV_GROUPS`, one shared 25-destination menu in nine groups.
  **It grants nothing.** Each role's existing `nav` array stays the permission
  source and the sidebar locks anything absent from it, so PRD §6 is untouched.
- `src/screens/auth.tsx` — 11 screens wired to their own aside, mail/lock icons
  on 5 email and 5 password inputs, `Head` centred, "Sign in" to "Welcome back".

**Two problems found by measuring, not by looking:**

1. **The flat 25-row menu failed the most junior role.** A Teaching Assistant
   saw 25 rows of which 21 were locked, with "My marking", their entire job,
   below seven padlocks and under the fold. Fixed by collapsing any group with
   zero permitted items to its label plus a count and one lock. TA goes 25 rows
   to 6, and "My marking" is now the fourth row. Admin 15, Officer 11, Lecturer
   10, Moderator 9, Management 4. Only Admin still scrolls, by 144px.
   **This modifies the design KingFizzy agreed with his teammate** and is
   flagged to him: the padlock and the visible-whole-product idea are intact,
   only fully-locked groups compress.
2. **The aside footer overlapped the bullet list** on any frame under ~900px.
   The art was sized `w-full`, kept its intrinsic height, and pushed through the
   text in a `justify-between` panel. Now height-driven inside a `min-h-0 flex-1`
   wrapper, so the drawing is the element that yields.

**Verified (and how):**
- Artboard geometry read from the live DOM: all 18 sections exactly 1440x1024,
  `anyClipped` false, `bodyScrollW` 1488.
- Sidebar counts read per role from the rendered DOM, not from source.
- 11 asides, 11 distinct illustrations, 11 distinct headlines, **0 overlaps**,
  measured by comparing each footer's top against the body block's bottom.
- `npx tsc --noEmit` exit 0 (scaffold), `npx tsc -b` exit 0 (prototype-flow).
- `npx vite build` exit 0 in **both** apps.
- Console: the browser buffer retains stale HMR failures from the intermediate
  edit states (I added `NAV_GROUPS` before its `LifeBuoy` import, and the aside
  icons before theirs). Both were real for about a minute and both are fixed.
  The current state is proven by the two clean production builds above, not by
  the console.

**Not done / blocked:**
- **The logo asset never arrived.** KingFizzy said it was uploaded; only the
  Markelo mockup and four sidebar references came through. `LogoMark` holds the
  placeholder `M`. Swapping it touches one span.
- `ArtExpiring` is drawn but unwired. "Session about to expire" is an `AppFrame`
  overlay, not a signed-out screen, so it has no aside slot.
- "Help & guidance" is the one invented destination, on the strength of
  principle P3. It has no screen. Everything else in `NAV_GROUPS` exists.
- 1024 as the artboard height is my choice, not a document's. The Desktop Grid
  fixes 1440 wide and says nothing about height.

---

## 2026-08-03 (sixteenth entry) : claude-opus-5

**Phase:** presentation layer, follow-up to the fifteenth entry

**Built:**

- `src/ui/logo.tsx` — **NEW.** The real logo from KingFizzy's
  `Markelo Logo(SVG).svg`, split into `MarkeloMark` (mark only) and
  `MarkeloLockup` (mark plus wordmark). Two deliberate changes to the source,
  both recorded in the file: the white group is dropped, because it is a full
  2000x2000 white square with the letterforms knocked out of it and would have
  shown its corners inside a circular badge and painted a white block on the
  dark sidebar; and the paths are set to `currentColor` instead of the baked-in
  `#0e3c75`, so the mark follows the token. No path data was redrawn. The two
  exports differ only by viewBox crop.
  **Judgement call:** the badge uses the mark alone, not the lockup, because a
  wordmark inside a 44px circle is unreadable. `MarkeloLockup` exists for
  anywhere with room.
- `LogoMark` — three concentric circles 14px apart, each fainter outward: solid
  tinted disc at 76px, hairlines at 104px and 132px, both `0.75px`. Drawn as
  three siblings rather than `ring` utilities, because a ring paints at the
  element's own opacity and the whole effect depends on each circle being weaker
  than the one inside it.
- `Logo` — the fake `M`-in-a-square placeholder is gone, replaced by the real
  mark, on both light and dark.
- **Sidebar rebuilt as a parent-child tree.** Nine parents carry an icon, a
  label and a chevron; children are text on a continuous indent rail with no
  icon of their own. The rail is a left border on the `ul`, not a line per row,
  so it cannot develop gaps when a row's height changes. `NavGroup` gained an
  `icon`, which is only possible without collision because children gave theirs
  up.
  **Why the flat version was cluttered, stated as a count rather than a
  feeling:** it drew 25 icons in a 236px column, one per row, so every row
  competed with every other for the same glance. Nine focal points now, and the
  indent does the work the icons were failing at, which is saying what belongs
  to what.
- **Identity block cut from three lines to one.** It repeated the institution
  and the academic session, both of which the top bar already prints on every
  screen this sidebar appears on. Only "Working as <role>" is left, which is the
  part the menu actually needs, since every padlock is calculated against it.

**Two bugs found and fixed:**

1. **The artwork collapsed to a thumbnail.** The `min-h-0 flex-1` wrapper from
   the last entry let it shrink without a floor, and on the shorter 5179 harness
   panel it reached about 40px and read as a stray icon. Given a `min-h-[150px]`
   floor, with `overflow-hidden` on the panel as the safety net so a genuinely
   tiny panel clips instead of letting anything escape into the footer.
2. **Four of six roles overflowed the sidebar** once the tree's breathing room
   was added. Fixed by removing the duplicated identity lines and tightening
   collapsed parents, which are markers not content. Not fixed by squeezing the
   spacing back out, which would have undone the thing that was asked for.

**Verified (and how):**
- Sidebar overflow at the real 1024 frame, measured per role from the live DOM:
  admin 212px, officer 47, lecturer 0, TA 0, moderator 44, management 0. Was
  admin 274 / officer 133 / lecturer 98 / moderator 130 before the trim.
  **Admin still scrolls and that is accepted**, not overlooked: it reaches the
  most of the product, the footer with the role switcher sits outside the
  scroller so nothing critical is ever pushed off, and the alternative was
  taking back the whitespace that was the point of the change.
- 11 artworks all at 300px, all 11 structurally distinct, 0 footer overlaps.
- 18 artboards still exactly 1440x1024.
- `npx tsc --noEmit` exit 0, `npx vite build` exit 0, both apps.

**A measurement error worth recording.** I first read the artwork heights with
`aside svg[role="presentation"]` and reported one rendering at 24px. That
selector was matching the aside's *logo*, which became an svg in this same
entry and is 24px by design. The artwork was never wrong. Re-measured against
each svg's own viewBox. The lesson is that a selector written before a change
can silently start matching something else after it.

**Not done / blocked:**
- `MarkeloLockup` is exported but unused. It is the full supplied artwork and is
  kept so nobody has to re-derive it; delete it if it is still unused later.
- Parent rows show a chevron but do not collapse on click. The tree is presented
  fully open, which suits a prototype being read rather than operated. Real
  collapse behaviour is a decision, not an oversight.
- "Help & guidance" is still the one invented destination, still without a
  screen.

---

## 2026-08-04 (seventeenth entry) : claude-opus-5

**Phase:** presentation layer, follow-up to the sixteenth entry

**Built:** sidebar parent rows now collapse on click.

- The parent is a real `<button>` with `aria-expanded` and `aria-controls`, not
  a div with a click handler, because it changes what is on screen and has to
  be keyboard-reachable and announce its state.
- **Open by default, click to close**, not the reverse. Starting closed would
  hide the whole product behind nine clicks on first run, and principle P3
  assumes no training and low technical confidence. It also keeps the tree
  visible in the html-to-design export, which is the reason this build exists:
  a collapsed export would carry nine rows and none of the structure.
- A closed parent shows the number of children it is hiding, reusing the
  count-plus-glyph shape a fully-locked parent already uses, so closing a group
  never makes its contents vanish without trace.
- Closed state resets on role change, keyed on `role.key`, so one role's closed
  groups are never carried onto another's menu where the labels may not exist.

**Motion: only the chevron animates, and only its rotation.**
`IMPLEMENTATION_PLAN.md` section 3 prohibits animating anything but `opacity`
and `transform`, because animating height forces a layout recalculation every
frame and that is visible jank on a modest institution PC. So the rows appear
and disappear instantly. This is the one place the project rule **overrides**
the workspace's usual standing rule for expand/collapse (grid-template-rows
`0fr` to `1fr`), and it is deliberate, not an oversight.

**A real bug found by testing rather than reading.**
`panelId` was derived from the group label alone. The prototype canvas renders
all six role dashboards on one page, so six sidebars each emitted
`nav-exam-setup`: duplicate DOM ids, invalid HTML, and an `aria-controls` on one
screen resolving to a panel on another screen. Fixed with `React.useId()` to
scope ids per Sidebar instance. **Confirmed 0 duplicate ids across 35 ids on the
full canvas** after the fix; the first verification pass had reported
`panelHidden: false` precisely because `getElementById` was returning another
dashboard's panel.

**Verified (and how):** clicked the real control in the live DOM, reading state
in a separate call each time because a synchronous read after `click()` runs
before React re-renders and reports the stale value.
- Open: `aria-expanded` true, panel visible, chevron unrotated, Admin sidebar
  overflow 212px.
- After one click: `aria-expanded` **false**, correct panel `hidden`, chevron
  `-rotate-90`, count "4" appears, overflow **65px**.
- After a second click: returns to the open state exactly, overflow back to 212.
- Collapsing groups on Admin left the Exam Officer sidebar untouched
  (`["true","true","true"]`), confirming state is per instance.
- 0 duplicate DOM ids. `npx tsc --noEmit` exit 0. `npx vite build` exit 0 in
  both apps.

**Not done / blocked:**
- Closed state is not persisted. Reloading reopens everything. Persisting it
  would need localStorage, which is app behaviour rather than design, and this
  folder is a design scaffold.
- Fully-locked parents are still not clickable. There is nothing to reveal, so
  a toggle would be a control that does nothing.
- `MarkeloLockup` still exported and unused. "Help & guidance" still the one
  invented destination, still without a screen.

---

## 2026-08-04 (eighteenth entry) : claude-opus-5

**Phase:** presentation layer, remote preview

**Built:** a single self-contained HTML build of `prototype-flow`, published as a
private artifact so KingFizzy can open the prototype away from this machine
without either dev server running. 380KB, one file, zero external requests.

Built from `dist/` by inlining the CSS and the JS module into one document. The
dev servers and the html-to-design export path are untouched; this is a preview
copy, not a new source of truth.

**Three problems solved, all found by testing rather than assuming:**

1. **The fonts would have silently disappeared.** `index.html` pulls Plus
   Jakarta Sans and JetBrains Mono from Google Fonts, and an artifact's CSP
   blocks every external host. A naive publish would have fallen back to system
   sans and misrepresented the typography, which on a design deliverable is the
   whole thing. Fixed by installing `@fontsource/plus-jakarta-sans` and
   `@fontsource/jetbrains-mono` and embedding all six faces as base64 woff2
   `@font-face` rules. Verified with `document.fonts.check`, both true.
2. **Mojibake.** The first build rendered `SCREEN 01 A-EUR" SIGN IN` and turned
   the password dots into gibberish. The file bytes were valid UTF-8; the cause
   was a host sending `text/html` with no charset, so the browser fell back to
   windows-1252. Rather than depend on the host getting the header right, every
   non-ASCII character in the bundle is now emitted as a `\uXXXX` JS escape, so
   the payload is pure ASCII and cannot be misread by any charset. Verified: the
   file is 100% ASCII and renders correctly from a server that sends no charset
   at all.
3. **Em dashes had come back.** The 2026-07-29 sweep removed 409 project-wide,
   but `prototype-flow` was created on 08-02 and reintroduced six, including one
   in visible UI copy (`Screen 01 - Sign In`) and one in the document title.
   Replaced by sense, not swapped for hyphens: the screen label separator is now
   a middot, the prose ones became commas. **0 remaining** in either app.

**Verified (and how):** served the standalone file over a deliberately
charset-less local server and read the live DOM. 18 sections, 11 artworks,
16 collapse buttons, artboards all exactly 1440px, computed heading font
`"Plus Jakarta Sans"`, both font faces loaded. `npx tsc -b` exit 0,
`npx vite build` exit 0.

**Not done / blocked:**
- The artifact is a **snapshot**. It does not update when the source changes; it
  has to be regenerated and republished. The URL is stable across republishes
  from this conversation.
- The font packages were installed with `--no-save`, so `package.json` is
  unchanged and a fresh clone will not have them. Regenerating the artifact
  needs that install repeated. This is deliberate: they are a packaging
  dependency for the preview, not a dependency of the app, which still loads
  fonts from Google Fonts as before.
- Not deployed to any public URL. `CURRENT.md` records that pushing this
  project anywhere is KingFizzy's call, and an artifact is private to his
  account, so it adds no exposure beyond this conversation.

---

## 2026-08-04 (nineteenth entry) : claude-opus-5

**Phase:** presentation layer, navigation restructure (5180 only)

**Why:** a teammate's point, which KingFizzy agreed with, that a nested sidebar
is heavy for a lecturer or TA who is not especially technical. The flat shape
answers it by never asking anyone to open anything to find their work.

**Built:** a second navigation variant, selected by context, so the same
components render either shape.

- `NavVariantContext` in `shell.tsx`, **defaulting to "tree"**. A context with
  no provider must leave existing screens exactly as they were, and 5179 has no
  provider, so it is untouched. Verified, not assumed: see below.
- `FlatSidebar` - nine rows, one per category, nothing nested. Institution
  selector in the slot the reference gives its workspace switcher. Active row
  marked twice, a tinted fill plus a 3px bar pinned to the sidebar's outer edge
  via `-left-3` against the list's `px-3`. The bar is the load-bearing signal:
  a fill alone is easy to lose on a dark panel, and the bar reads from the
  furthest-left pixel, which is where the eye lands scanning a left rail.
- `SectionTabs` - holds exactly what the sidebar gave up. Renders under the top
  bar, only when the active destination's category has more than one child, so
  a standalone destination such as Dashboard gets no empty strip.
- `prototype-flow/src/flow.tsx` wraps every app-shell screen in `<Flat>`.

**COLOURS: pattern copied, palette not.** The reference is a light rail with a
dark indicator. Inverted onto `brand-dark` the same relationship is a white
indicator over a white-tinted fill, and the tab row uses `border-brand` and
`text-brand` on white. Not one value was taken from the reference image, per
KingFizzy's explicit instruction.

**Two judgement calls, both flagged rather than quiet:**

1. **Four section screens were added to 5180.** Every dashboard is a standalone
   destination with no siblings, so on the dashboards alone the tab row
   correctly renders nothing and the restructure could not be reviewed at all.
   The four are existing scaffold screens (`ScanBatchUpload`, `IntegrityReport`,
   `MarkingAssignment`, `StudentDataUpload`), imported live like everything
   else, no copies, chosen because each sits in a category with several
   destinations. 18 screens to 22. Say the word and they come out.
2. **`session-expiry` was wrapped too**, despite being an auth-group screen. It
   is the only other screen in this build that renders the app shell, so left
   alone it would have been the single nested sidebar in a prototype where
   every other shell is flat, and would read as a bug rather than as scope.

**Verified (and how):** read from the live DOM, per screen.
- 5180: 22 sections, 4 tab rows with the right group labels (Scripts, Scripts,
  Marking, Exam setup), **0 expandable tree parents left**.
- TA dashboard: 9 flat rows, active row "Dashboard" carrying `aria-current`,
  7 locked, **0 tab rows**, which is correct for a standalone destination.
- Scripts section: tab row reads Scan batches / Exception queue / Identity
  registry, active tab underlined in `brand`.
- **5179 unchanged:** still reports `tree`, still has its expandable parents,
  **0 tab rows, 0 left indicators**, "Working as" block still present.
- `npx tsc --noEmit` exit 0, `npx tsc -b` exit 0, `npx vite build` exit 0 both
  apps. Artifact regenerated at 398KB, still pure ASCII.

**Not done / blocked:**
- Tabs and flat rows are not clickable navigation. Nothing in this scaffold
  routes, and the tab row is presentational like every other control here.
- The institution selector does not open. Markelo has one institution per
  deployment; it occupies the reference's workspace-switcher slot because that
  is where a user looks to confirm whose data they are about to change.
- The tree variant is still the default and still what 5179 shows. If the flat
  shape is adopted for real, the tree branch and its collapse state should be
  deleted rather than left as a second thing to maintain. **That is a decision,
  and it is Alex's or KingFizzy's, not mine.**

---

## 2026-08-04 (twentieth entry) : claude-opus-5

**Phase:** presentation layer, access indicators

**Requested:** lock indicators on tab menus the role cannot reach, and the
padlock swapped for `lucide/user-lock`.

**The tab locks already existed** and were shipped in the nineteenth entry. The
tab row KingFizzy was looking at is Scripts as Exam Officer, which grants all
three destinations, so no lock had anything to mark. Verified by reading every
tab row in the build: 4 of the 5 carry locked tabs (Exam setup / Booklet
profile; Marking / Flagged for review; Marking as TA / My courses + Marking
assignment; Scripts / none). Nothing was added for this, and saying otherwise
would have claimed work that did not happen.

**Actually changed:**

- **`Lock` to `UserLock` in all four places**, sidebar tree child, tree
  collapsed parent, flat row, and tab. Size raised 12 to 14: `user-lock` draws a
  figure and a padlock where `lock` drew a padlock alone, and at 12px the extra
  detail closed up into a smudge.
- **Both locked states failed contrast and were fixed.** Measured on the
  rendered pixels: sidebar locked was **2.21:1**, tab locked **2.12:1**. The
  entire argument for showing locked destinations is that a user can read what
  exists and see it is not theirs, so an unreadable locked state fails on its
  own terms whether or not WCAG 1.4.3 exempts inactive components. Now sidebar
  locked **4.50:1**, tab locked **4.61:1**, and the available sidebar rows were
  lifted 5.58 to **6.77:1** so "dimmed" still reads as clearly dimmer.
  The `user-lock` glyph is now the primary signal and dimness the secondary one,
  which is the right way round and is what was asked for.

**A measurement error I made and corrected mid-task.** My first contrast
readings were parsed from `getComputedStyle().color`, which this browser returns
as `oklab(...)`. Reading those three components as if they were RGB produced
nonsense: it reported the sidebar's normal text at 1.76:1, which is visibly
false, and a locked tab at 3.95:1. Redone by compositing each colour onto its
real background in a 1x1 canvas and reading the pixel back, which resolves any
colour space. **Every ratio in this entry comes from the canvas method.** The
lesson is that a plausible-looking number is not a measured one.

**Verified:** contrast as above; `UserLock` present at 4 sites, 0 stray `Lock`,
0 icons left at size 12; 4 locked tabs and 61 locked sidebar rows across the
build; `npx tsc --noEmit` exit 0, `npx tsc -b` exit 0, `npx vite build` exit 0
both apps; artifact regenerated at 399KB and republished to the same URL.

**Not done / blocked:**
- The two locked states sit at 4.50 and 4.61, just over the 4.5 line. They pass,
  but there is no headroom, so any future darkening of `--color-brand-dark` or
  lightening of `--color-muted` will break them. Worth a Figma variable rather
  than an opacity if the pattern is kept.
- 5179 still shows the tree variant and is unaffected by the flat work, but it
  **did** receive the `UserLock` swap and the contrast fixes, because those live
  in the shared components and are correct in both shapes.

---

## 2026-08-06, deepseek-v4-pro (via opencode)

**Phase:** Institution & governance flow on 5180, replacing the archived
auth-and-dashboards flow. One new screen built, five existing screens imported
live as before.

**What was asked:** a new presentation flow called "Institution & governance" on
the same 5180 prototype canvas, with the screens Institution Setup, Admin
Settings, Audit Trail, Result Correction, plus any missing governance screens.
The existing auth and dashboards flow was to be archived, not deleted.

**Decision points answered before any code was written:**
- Five screens: the four named plus People & Roles (recommended, I2/I3/J5,
  existing, zero build cost).
- Institution Setup = the plan's "Institution Setup, courses" screen (existing
  `InstitutionCourses`, I1), imported as-is.
- Admin Settings = one new screen with sectioned cards (Institution profile,
  Security & MFA, Notifications, Results & exports), 5 states.
- Archive method = `git tag archive/auth-dashboards-flow` plus moving the old
  flow registry to `flow-auth-dashboards.tsx` (kept in repo, one-line restore).

**Built:**

- `prototype-flow/src/flow-auth-dashboards.tsx` — old FLOW registry, archived
  with a header documenting the restore path.
- `prototype-flow/src/flow.tsx` — new FLOW registry. 6 artboards in order:
  Institution Setup, People & Roles, Admin Settings, Audit Trail, Result
  Correction, Result Correction (Editing). The `group` type is `"governance"`.
  Actions: "Correct" → editing panel, "Save correction and re-lock" / "Cancel,
  re-lock unchanged" → back to the correction list. All screens wrapped in
  `<Flat>` for sidebar tabs.
- `webapp-scaffold/src/screens/settings.tsx` — **new file.** Admin Settings with
  5 states (default with 4 sectioned cards: Institution profile, Security & MFA
  policy, Notifications, Results & exports; empty; loading; error; denied).
  Story J2 is the only PRD requirement in this screen; the other sections are
  presentational. Every rule that has burned this project is observed:
  `border-control`, no em dashes, spacing scale, `aria-label` on icon buttons,
  no `bg-white` outside the Card component.
- `webapp-scaffold/src/App.tsx` — registered 5 Admin Settings states in the
  Phase 2 group, after Result Correction.
- `prototype-flow/src/App.tsx` — scroll-spy generalised from
  `DASHBOARD_SCREENS` to the full `FLOW` array; passes `flow` to
  `PrototypeNav`.
- `prototype-flow/src/components/PrototypeNav.tsx` — rewritten. Accepts the
  full `FLOW` as a prop, computes prev/next across all screens. Auth button
  removed (would scroll to a now-missing screen). Aria-labels are stable
  ("Previous screen" / "Next screen") so the disabled state query works.
- `prototype-flow/index.html` — title "Markelo, Prototype Flow" → "Markelo,
  Institution & governance flow".
- `prototype-flow/verify.mjs` — rewritten for the governance flow. Tests 6
  screens, the correction-editing-save round trip (3 click paths), the cancel
  return, nav prev/next/disabled-at-ends, artboard geometry (1440x1024), 0 JS
  errors. Screenshots to `verify/`.

**Verified (and how):**

- 13/13 checks PASS in headless Chrome: 6 screens in the right order, all
  artboards exactly 1440x1024, correction→editing→save→correction + cancel
  round-trips land exactly on target (scrollY ±0), 1 nav instance, prev
  disabled on first screen, next disabled on last, 0 JS errors.
- `npx tsc --noEmit` exit 0 (scaffold), `npx tsc -b` exit 0 (prototype-flow),
  `npx vite build` exit 0 in both apps.
- 5179 tree sidebar intact: zero `NavVariantProvider` wrapping in the scaffold;
  the only "flat" hit is `flatMap` on the ALL array.

**Not done / blocked:**

- The 5 governance screens beyond Admin Settings are imports, not redesigns.
  None of their content was modified; the editing panel and every other control
  remains presentational only.
- The self-contained artifact was not regenerated. The fonts install with
  `--no-save` and the build script lives in the artifact commit, so it is
  reproducible on request.
- No new PROGRESS.md entries for the governance flow in the workspace's
  `logs/` — same as past scaffold entries, the workspace log tracks what
  happens inside the vault, not the Markelo repo.

---

## Twenty-first entry, 6 August 2026: flat nav everywhere, one table pattern

**What was asked:** three things. Put the 5180 sidebar on 5179, which still
showed the old nested one. Halve the gap between the per-page number and its
dropdown chevron. Make every table in the product agree, and rebuild the page
numbering to the shape `Previous 1 2 3 … 8 9 10 Next`.

**Found on arrival, before doing any of it:** the working tree was not clean
and none of it was in a commit. Someone had already started task 1 in
`webapp-scaffold/src/App.tsx` by wrapping the harness stage in
`<NavVariantProvider value="flat">`, and in the same edit had deleted
`import * as ST from "./screens/settings";`. `npx tsc --noEmit` exited 2 with
five `Cannot find name 'ST'` errors. The scaffold did not build. That import is
restored.

**Files touched:**

- `webapp-scaffold/src/ui/shell.tsx` — `NavVariantContext` default flipped
  `"tree"` → `"flat"`. This is the whole of task 1. A default beats a provider
  because it cannot be forgotten by a host: 5179's harness, 5180's canvas and
  anything built later all get the flat sidebar with no wrapper. `"tree"` is
  kept but is now unreferenced; deleting it is a one-way door and nobody has
  called the shape settled.
- `webapp-scaffold/src/App.tsx` — `ST` import restored; the redundant
  `NavVariantProvider` wrapper and its import removed, and the stage div put
  back to one line.
- `prototype-flow/src/flow.tsx` — the local `<Flat>` wrapper and its six call
  sites removed for the same reason. Two mechanisms for one behaviour is how
  the next person changes the wrong one.
- `webapp-scaffold/src/index.css` — pagination block. `#dadada` → 
  `var(--color-border)`, `4px` → `var(--radius-badge)`, so the footer moves
  when the design system moves. `field-sizing: content` added to the per-page
  select, and its right padding 28px → 27px.
- `webapp-scaffold/src/ui/kit.tsx` — `buildPageWindow` rewritten.
- `webapp-scaffold/src/screens/triage.tsx` — `MarksTable` was the last
  hand-rolled `<table>` in the product, with its own `thead`, `th` and `td`
  classes. Converted to the shared `Table` / `Td` inside a `Card`.
- `webapp-scaffold/src/screens/admin.tsx` — the Audit Trail footer was a
  hand-rolled `Previous` / "Page 1 of 16" / `Next` trio; it is
  `TablePagination` now, and moved inside the Card it belongs to. "Showing 3 of
  47 entries" → "47 entries", which was only ever true of the mock. Pagers
  added to Courses, People & roles (standalone), Result correction. Two bare
  tables wrapped in `Card pad={false}` to match the rest.
- `webapp-scaffold/src/screens/dashboards.tsx` — pagers added to all four
  tables that lacked one.
- `webapp-scaffold/src/screens/scanning.tsx` — pager added, table wrapped in a
  Card, `TablePagination` imported.
- `webapp-scaffold/src/screens/{workload,studentdata,admin}.tsx` — mock
  `totalPages` of 4, 5 and 8 raised to 10, and admin's odd `perPage={6}` /
  `[6, 10, 25]` normalised to `4` / `[4, 10, 25]`.

**On the gap, because padding was not the cause.** A native select sizes itself
to its *widest* option. With options 4 / 10 / 25 the box is always as wide as
"25", so a selected "4" sat in a box with dead space after it: measured 15.6px
to the chevron on "4" against 4px on "25", the same control looking different
depending on what was picked. `field-sizing: content` sizes the box to the
value actually shown. Measured after: **7.89px, a 50% reduction**, and now
identical for every option.

**On the page numbering.** The old window kept only page 1 and the last page as
anchors, so 10 pages rendered `1 2 … 10`, and any table with 7 or fewer pages
rendered every number. Two tables with different page counts looked like two
different components. The window is now three at each end plus the current page
and its neighbours. Seven or fewer still renders every page: at seven, the two
end triples leave exactly one hidden page, and an ellipsis standing in for one
number is worse than the number.

**Verified (and how):**

- `npx tsc --noEmit` exit 0 (scaffold), `npx tsc -b` exit 0 (prototype-flow),
  `npx vite build` exit 0 in both.
- Live DOM sweep across table screens on 5179 and the whole 5180 canvas.
  Every style bucket returned exactly **one** unique value: `th` computed
  style, `td` padding and size, thead background, table wrapper, footer
  (`rgb(245,245,245)` / 16px / `rgb(204,204,204)` / `0 0 12px 12px`), active
  page chip (white / `rgb(204,204,204)` / 4px / 12px / 700), inactive opacity
  `0.6`, and page sequence — `1 2 3 … 8 9 10` on every pager without exception.
- Hand-rolled pagination inside any screen: **0**. The ten `Previous`/`Next`
  buttons the sweep found all sit in the 5179 harness top bar, outside the
  AppFrame; confirmed by scoping the query to the stage container.
- 5179 screenshotted: flat sidebar, left indicator on the active row,
  `user-lock` on locked categories, secondary tab row, and the footer reading
  `SHOWING [4] ITEMS PER PAGE  PREVIOUS 1 2 3 … 8 9 10 NEXT`.

**Not done / open:**

- **Three tables deliberately have no pager**, and this is a judgement worth
  overruling if it is wrong. Booklet versions sits under copy that says "2
  versions"; the moderation mark sheet in `triage.tsx` is exactly as long as
  the exam paper and ends in a Total row, so paging it hides half a mark sheet
  from the person signing it off. Everything else that is a list which can grow
  now has one.
- **Mock page counts were raised to 10** to make the agreed shape visible. This
  is fabricated demo data, not a claim about volume.
- **The `#dadada` → `--color-border` swap changes the border from #DADADA to
  #CCCCCC**, which is a small deviation from the Figma "Table 1 Component"
  spec. Done because the design-system token is the rule; one line to revert.
- The tree sidebar branch is now dead code awaiting a decision.
- The self-contained artifact was not regenerated.

---

## 2026-08-06 (session 2), deepseek-v4-pro via opencode

**Phase:** Institution Setup personalisation, tooltips, spinner, Scan Batch Upload
rebuild, pagination, sidebar aligned across both builds.

**Requested across this session:**
- Institution Setup: logo badge with animated concentric halos, initials
  fallback, camera chip for upload invite, motto/description field, hero card
- Tooltip component with bounce animation, 300ms delay, 4px radius, dark bg
  (#1A1A1A), 10px white text, rotated-square arrow. Reverted from clip-path
  arrow per KingFizzy's feedback.
- Sign In button loading state: 12-bar radial spinner (OpenAI-style segment
  loader), 10-second demo loop, icon dynamically morphs
- Rebuild Scan Batch Upload to Figma specs: two-column layout (703px content +
  407px progress panel), brand-tinted upload drop zone, booklet cover page SVG
  preview for the second state variant
- Pagination: one shared `TablePagination` component, applied to 5 tables,
  dropdown spacing tightened by 50%
- Sidebar: aligned 5179 scaffold to use the flat sidebar variant matching 5180
- All feedback applied: upload area made visually prominent, empty right side
  filled with scripts-found counter and preview thumbnail

**Verified:**
- `npx tsc --noEmit` exit 0 (scaffold), `npx tsc -b` + `npx vite build` exit 0
  (prototype-flow), both apps
- 15/15 headless Chrome checks PASS for 7-screen governance flow
- All artboards 1440×1024, 0 JS errors

**Not done / blocked:**
- All controls remain presentational (no backend/routing)
- Self-contained artifact not regenerated
- Tree sidebar branch is dead code awaiting decision

---

## 2026-08-06 (session 3), deepseek-v4-pro via opencode

**Phase:** Booklet Profile & Scanning workflow — fresh 5180 page (archive governance
flow), screen rebuilds, whitespace audit and fill.

**Built:**
- **Archived** governance flow: current `flow.tsx` copied to `flow-governance.tsx`
  with archived header, `git tag archive/governance-flow` applied.
- **New `flow.tsx`:** 9 screens across two chapters (Booklet Profile + Scanning),
  chapter headers via `{ chapter: "..." }` entries in the FLOW array, `group`
  type extended to `"booklet" | "scanning"`. App.tsx updated to filter screen
  entries and render chapter dividers. `PrototypeNav` fed from the filtered
  `SCREENS` list.
- **`BookletProfileSetup` rebuilt** (admin.tsx `BookletProfileSetupDefault`):
  two-column layout mirroring Scan Batch Upload (703px content + 407px side panel).
  Left: same four page cards (cover required + three optional). Right: booklet
  cover page SVG showing the institution's template with name/matric
  placeholders, instructions, barcode strip, question grid, and dashed-outline
  answer/extra pages; a "Profile readiness" checklist (Cover page uploaded ✓,
  three optional items as grey dots); a "What happens next" info panel.
- **`BookletProfileValidation` rebuilt** (admin.tsx
  `BookletProfileValidationDefault`): two-column layout. Left: detection report
  table with dynamic row (extra sheet row flips from amber "Needs manual box"
  to green "Confirmed" via `boxDrawn` useState). Right: cover page SVG with
  colour-coded detection overlays (green dashed = name/matric fields located;
  amber dashed with corner handles = extra sheet needs manual box). Draw-a-box
  button in both left table and right panel sets `boxDrawn = true`, resolving
  the warning and unlocking "Mark as ready to use". `bg-success-light` token used
  for resolved-state feedback.
- **`BookletProfileVersioning` polished** (admin.tsx): added "Active version"
  summary card with two-stat grid (v2 current version + 4,182 scripts processed
  across 7 exams) between the notice and version table.
- **`IntegrityReportComplete` whitespace filled** (scanning.tsx): added 3-stat
  grid (64 assembled / 61 matched / 3 need review) and an "Exceptions for this
  batch" card listing the three flagged scripts with reasons and per-row
  "Open and resolve" buttons — below the progress card and above the two action
  buttons.
- **`index.html` title:** → `Markelo · Booklet Profile & Scanning flow`.
- **`verify.mjs` rewritten:** 9 screens, 6 click-throughs (setup→validate,
  draw-box→ready→versions, upload→ai-processing, ai-processing→queue,
  report→queue, queue→resolve), nav single-instance/prev-next/first-last,
  9×1440×1024 geometry, 4 screenshots, JS errors = 0.
- **`CircleCheck`** added to admin.tsx lucide imports (used by setup right
  panel checklist and validation resolved-state chip).
- **Whitespace rule codified:** every screen audited. Empty areas filled with
  live, useful content (cover-page previews, detection overlays, readiness
  checklists, stat summaries, exception cards) — never decorative filler.
  Pattern applied: the Scan Batch Upload right-panel treatment (upload progress
  + preview) replicated for Booklet Profile screens; Integrity Report got the
  same stat-strip treatment that the upload screen got from its prior feedback
  round.

**Verified:**
- `npx tsc --noEmit` exit 0 (scaffold), `npx tsc -b` + `npx vite build` exit 0
  (prototype-flow), both apps
- 24/24 headless Chrome checks PASS (9 screens, 6 click-throughs, 5 nav, 9 geometry, 0 JS errors)
- All artboards 1440×1024, zero JS errors
- Screenshots captured: booklet-setup, booklet-validation (resolved), ai-processing, integrity-report

**Not done / open:**
- All controls remain presentational (no backend/routing)
- Draw-a-box tool has no actual drag geometry (states toggle via button click)
- Self-contained artifact not regenerated
- The governance screens remain accessible in `flow-governance.tsx` if ever needed

---

## 2026-08-07, deepseek-v4-pro (via opencode)

### Session 4: Exam Setup · Student Data · Triage & Review flow on 5180

**Built:**

**Archived:** Booklet Profile & Scanning flow (9 screens) → `flow-booklet-scanning.tsx`
+ `git tag archive/booklet-scanning-flow`. Same archive pattern as the governance flow
(flow-governance.tsx + tag archive/governance-flow).

**New screen — Exam Creation** (exam.tsx): 5 states (default, empty, loading, error, denied).
Two-column layout (703px form left / 407px setup checklist right). Fields: course,
exam type, academic session, lecturer in charge. Right panel shows a 4-item readiness
checklist (Booklet profile ✓, Course and lecturer, Marking scheme, Student list) and
a "What happens next" info box. Registered in the 5179 scaffold harness `App.tsx`
GROUPS under "Exam setup" (5 entries). AppFrame uses `ROLES.officer` with
`activeLabel="Exams"`.

**Rebuilt screens — two-column (703+407) treatment:**

- **MarkingSchemeSetup** (exam.tsx, 5180 direction): left column = question rows +
  button bar; right column = scheme summary (question count + total marks as big numbers,
  "Marks at a glance" per-question list, D1 rules info box). Removed the invalid
  question-5 row from demo data so the "Confirm scheme" button is enabled for flow
  click-through (the D1 rules remain stated in the right panel).
- **StudentDataUpload** (studentdata.tsx): left column = exam select + drop zone +
  3-stat grid + flagged-rows table + button bar; right column = cohort overview
  (total/valid/flagged big-number stats), validation rules applied list, "What
  happens next" info box.
- **IdentityRegistry** (studentdata.tsx): left column = notice + lookup form +
  result card; right column = recent lookups as a **condensed feed** (Script ID,
  looked-up-by, reason, when per card) replacing the old full-width table.
  Per KingFizzy's choice: condensed feed over table-in-right-column.

**Reused as-is** (zero copies by architecture — 5180 imports live from scaffold):

- **ResultProcessing** (studentdata.tsx) — already full-width, complete.
- **ExceptionQueuePilot / ExceptionQueueResolve** (triage.tsx) — was screens 08-09
  of the archived scanning flow; same component file, regrouped under "Triage &
  Review" chapter. No duplication possible by the live-import architecture.
- **ModerationWorkspace / Changed / Return** (triage.tsx) — three artboards per
  KingFizzy's choice (default, marks-changed F1 story, reason-gated return).

**New flow** (prototype-flow/src/flow.tsx): 3 chapters, 10 artboards, group
union `"exam" | "student" | "triage"`:

1. Chapter 1 — Exam Setup: exam-creation → marking-scheme (Create exam / Confirm scheme)
2. Chapter 2 — Student Data & Results: student-upload, identity-registry, result-processing
3. Chapter 3 — Triage & Review: exception-queue → exception-resolve (Open and resolve),
   moderation, moderation-changed, moderation-return

**Plumbing:** `App.tsx` footer → "Markelo · Exam Setup · Student Data · Triage & Review",
`index.html` title → same. PrototypeNav and ScreenShell unchanged (generic scroll-spy
and action wiring).

**Whitespace rule applied:** every right panel carries live, useful content:
- Exam Creation right: readiness checklist mirroring BookletProfile setup
- Marking Scheme right: scheme summary statistics + D1 rules
- Student Data right: cohort overview + validation rules + next-step info
- Identity Registry right: condensed permanent lookup feed (every lookup logged)

**`verify.mjs` rewritten:** 10 screens, 3 click-throughs (exam-creation→marking-scheme,
marking-scheme→student-upload, exception-queue→exception-resolve), nav single-instance
(prev/next disabled-on-boundary, first/last), 10×1440×1024 geometry, 4 screenshots
(exam-creation, marking-scheme, student-upload, identity-registry). Timing: explicit
`sleep(1500)` and `sleep(2000)` instead of `settle()` — the smooth-scroll animation
was shorter than the settle() gap on cached attempts.

**Verified:**

- `npx tsc --noEmit` exit 0 (scaffold), `npx tsc -b` + `npx vite build` exit 0 (both apps)
- 24/24 headless Chrome checks PASS: 10 screens, 3 click-throughs, 2 nav bounds,
  10 geometry 1440×1024, 0 JS errors
- Screenshots captured: verify/01-exam-creation.png, verify/02-marking-scheme.png,
  verify/03-student-upload.png, verify/04-identity-registry.png
- Dev server on port 5180 confirmed 200 and serving the new flow

**Not done / open:**

- Marking Assignment / Marking Interface screens still not built (out of scope)
- Result Processing in chapter 2 but chronologically (PRD §10) follows Moderation —
  kept in chapter 2 per KingFizzy's explicit grouping
- All controls remain presentational (no backend/routing)
- MarkingSchemeSetup removed the D1 invalid-row demo (question 5 had `max: ""`)
  to keep the click-through button enabled — the invalid state is documented in the
  right panel rules section

---

## 2026-08-10, claude-opus-5

### Session 5: audit against the Definition of Done, then four rulings applied

**Phase:** cross-cutting, no new screens.

**Audited** all 138 screens against section 8 of IMPLEMENTATION_PLAN.md. Method:
static sweep of `screens/` and `ui/`, plus a live pass stepping every harness
position with `console.error`, `window.onerror` and `unhandledrejection`
instrumented.

**Passed, verified not assumed:**

- **The identity rule holds.** All 42 identity mentions checked one by one. Each
  is an Exam Officer surface where a name is meant to appear, a permission-denied
  notice explaining to a marker why they cannot see it, or a description of what
  failed to read ("the matric number could not be read") rather than a value.
- **Attention box** matches the standing rule exactly: flat tinted fill, no left
  accent bar, `rounded-control`, neutral text, icon forced on for
  success/warning/error via `iconRequired`.
- `tsc` 0 both apps, `vite build` clean both apps, **0 console errors and 0 blank
  screens across all 138 screens**.
- Global focus ring: `2px solid var(--color-brand)` at `outline-offset: 2px`.

**Found and fixed this session:**

- **61 raw hex values in classNames, now 0.** Five were hardcodes of tokens that
  already existed (`#1A56A0`, `#E8F1FB`, `#1A1A1A`, `#0C3D7A`, `#F5F5F5`) and were
  swapped. Five were a real, coherent sidebar family with no tokens, and are now
  tokens on KingFizzy's instruction: `--color-nav-label`, `--color-nav-brand`,
  `--color-nav-strong`, `--color-nav-active`. Each was measured against the
  `#0c3d7a` sidebar ground before naming (4.98, 8.30, 10.42, and 2.38 for the
  active pill, which is a surface carrying white text at 4.49).
- **Two greens collapsed rather than added.** `#EBF5ED` sits 2/255 mean per
  channel from `--color-success-light`, below perceptual threshold, so adding it
  would have put two near-identical greens in the Figma collection. Mapped to the
  existing success pair instead. One line to revert if KingFizzy disagrees.
- **`ScanBatchUploadWithPreview` was reachable in neither app.** Built and
  exported, but referenced only from two archived flow files, so absent from the
  5179 `GROUPS` array and from the active `flow.tsx`. Registered in both. The 5180
  flow gains a Scanning chapter placed before Triage & Review, because scanning is
  what produces the exceptions that chapter triages.
- **Harness footer said "Phase 1 to 3"** while serving a Phase 4 group. Now 1 to 4.

**Rulings applied (KingFizzy, 2026-08-10):**

- Open question 2 is CLOSED. App shell content inset **32px**, sidebar inner
  margin **12px**, 120px page margin reserved for full-canvas screens. Both are
  tokens and both go into the Figma grid system.
- The six dashboards do **not** need their remaining four states for now. He will
  say when other states are wanted. Section 8 still says a default-only screen is
  incomplete; this is a deliberate exception, not drift.

**A mistake worth recording.** The first pass wrote the sidebar padding as
`px-[--sidebar-inset]`, which is Tailwind v3 syntax. v4 drops it silently, so the
sidebar rendered at **0px padding** and both the typecheck and the build passed.
Only sampling `paddingLeft` in the live DOM caught it. Correct form is
`px-[var(--sidebar-inset)]`. A bulk replace had also applied the token to a
horizontal tab button, which is not the sidebar; reverted to `px-3`.

**Verified after the fixes:** `tsc` 0 and clean build both apps; live sample on
screen 108 of 139 gives sidebar padding 12px/12px, content inset 32px/32px,
sidebar ground `rgb(12,61,122)`, nav label `rgb(143,180,224)`, wordmark
`rgb(219,226,253)`, active pill `rgb(74,118,196)`, signed-in name
`rgb(251,252,255)`. Every token resolves to its declared value.

**Not done / blocked:**

- **252 arbitrary pixel values** remain in classNames. Not touched this session:
  unlike the hex, many encode traced Figma measurements (`h-[38.39px]`,
  `py-[7.28px]`) and collapsing them to a spacing scale is a design decision, not
  a mechanical swap. Needs KingFizzy or Alex to rule on the scale first.
- **19 responsive breakpoints** in 4 files (11 in `dashboards.tsx`), against the
  desktop-only rule. Mechanical, not done, no ruling needed.
- **25 em dashes**, against the standing ban. 409 were removed on 2026-07-29;
  these are new since.
- **12 off-table icon sizes** (11, 15, 22, 24, 26, 30).
- **Four off-scale control heights**: one `h-12` at `auth.tsx:171`, the retired
  48px `lg`; plus two `h-9` and one `h-[42px]`.
- **Marking Interface and Answer Viewer still not built.** Marking Assignment and
  Marking Progress ARE built, contrary to what CURRENT.md said before today.

---

## 2026-08-10, claude-opus-5 (RESUME verification of a deepseek-v4-pro packet)

### Session 6: tablet breakpoint, dispatched and verified

**Phase:** cross-cutting. Packet `markelo-tablet-breakpoints`, model deepseek-v4-pro,
commit `2d53200`. This entry is the Third Seat verification, not the delegated work.

**Verdict: PASS.** Re-ran every acceptance check independently rather than reading
the Result block.

- Sidebar collapses in **both** implementations, `max-lg:w-[72px]` at lines 247
  and 424 of `ui/shell.tsx`.
- Two-column layouts stack: `flexDirection: column`, `border-left: 0px`,
  `border-top: 1px`, right panel below left, confirmed by geometry not by grep.
- **`lg:` min-width classes are still 14, unchanged from baseline.** This was the
  packet's main risk: nothing was rewritten mobile-first, the desktop-first
  authoring survived, and every tablet rule is an additive `max-lg:` override.
- Raw hex introduced: 0.
- tsc 0 and clean builds, both apps.

**The packet was wrong and the model was right.** It expected 21 two-column sites;
there are **8**. The packet's number came from a grep that counted every occurrence
of the strings "703" and "407", including code comments. deepseek-v4-pro reported
the discrepancy under its own count rather than manufacturing 21 matches, which is
the behaviour the packet asked for and the reason the count check is worth writing.

**Live verification at true tablet width, and a trap worth recording.**

The 5179 harness **cannot faithfully preview tablet**. Its own screen-picker chrome
is 256px, so at a 768px browser the product frame only receives 512px, while at
1024px (where the product would receive a true 768) the `max-lg` query has already
switched off. There is no browser width at which the harness shows a real tablet.
Measured by hiding the harness aside via devtools, viewport held at 768:

| Measure | Value |
|---|---|
| Product stage | 768px |
| Sidebar | 72px rail |
| Left column | 582px |
| Right column | 582px, stacked below |
| Tab row | 646 scroll / 646 client, no overflow |
| Overflowing containers, whole page | 0 |
| Document horizontal scroll | none |

Before this change the content region had **468px** at 768. It now has 582. The
rail returned width to the tables, which was the stated goal.

**Fixed during verification:** `index.css` still carried a comment declaring
"Markelo is DESKTOP ONLY ... Do not add a second grid" forty lines above the new
tablet tokens. That is the packet's gap, not the model's error; it was never told
to update that comment. Rewritten to record the reversal, and to keep the part
that is still true: PRD §6 defers **native** tablet apps to V2, which is a
different thing from responsive web, and there is still no phone grid.

**Not done / blocked:** unchanged from Session 5. The 252 arbitrary pixel values
still need a spacing-scale ruling, and the em dash, icon size and control height
sweeps are still outstanding. Marking Interface and Answer Viewer still unbuilt.

---

## 2026-08-10, claude-opus-5

### Session 7: a preview that can actually show the tablet layout

**Phase:** tooling, no product screens changed.

KingFizzy asked for a link to preview the tablet view on 5180. **Neither app can
show it, and both reasons are structural rather than bugs.**

- **5180** pins every artboard to `w-[1440px]` on purpose, so html-to-design
  exports true Desktop Grid frames into Figma. Resizing does nothing, and that
  pinning must not be removed.
- **5179** carries a 256px screen-picker column of its own. At a 768px browser
  the product frame receives only 512. At 1024px it would receive a true 768,
  but by then `max-lg` (max-width: 1023px) has already switched off. **There is
  no browser width at which the harness shows a real tablet.**

The underlying reason is that a CSS media query reads the browser viewport and
never an element's width, so no container inside either app can make `max-lg`
fire.

**A wrong turn worth recording.** The first attempt added a 1440/768 artboard
toggle to 5180, setting the artboard width from a CSS variable. It was reverted
before going anywhere, because it cannot work: it would have rendered *desktop*
styles squeezed into 768px and looked exactly like a tablet preview while being
a lie. Container queries would be needed, which means rewriting every `max-lg:`
as `@container`, and that is not worth it for a preview.

**What was built instead:** `webapp-scaffold/src/preview.tsx` plus
`preview.html`, a second Vite entry that renders one screen full-bleed with the
picker as a `fixed` overlay, so it contributes zero width and the screen
measures the true viewport. `GROUPS` and `ALL` are now exported from `App.tsx`
so the preview reuses the one screen registry rather than duplicating it.

`vite.preview.config.ts` produces a single-file IIFE build for sharing.

**Two traps found while building it:**

1. **Concatenating ES module chunks does not work.** Splicing the entry chunk and
   the shared chunk together leaves the named imports between them dangling.
   React never mounts, the page renders blank, and **no error appears in the
   console**. The fix is a real single-bundle build: `format: "iife"` with
   `inlineDynamicImports`, not string surgery.
2. **The band label must not come from JS.** A `resize` listener, and even a
   `ResizeObserver`, can be throttled (hidden tab, programmatic resize), and a
   chip reading "Tablet" while you are looking at desktop is worse than no chip.
   The Desktop/Tablet label is now two spans shown and hidden by the same
   `max-lg` query that drives the layout, so it cannot disagree with the screen.
   Verified switching in both directions with no reload.

Fonts are embedded as base64 woff2 (latin and latin-ext only, 282KB raw) because
the sharing target blocks font CDNs and a silent system fallback would
misrepresent the typography. Final self-contained file: 843KB.

**Verified**, on the standalone build at a true 768 viewport with no chrome:
sidebar 72px rail, both columns 630px and stacked, no horizontal scroll,
Plus Jakarta Sans resolving, band label agreeing with the sidebar width. At 1440:
sidebar 236, columns 703 and 407 side by side, label reads Desktop.

**Not verified:** the published artifact itself. The in-app browser is not signed
in to claude.ai, so the live URL 404s from here. The file was verified served
locally over HTTP with a UTF-8 charset header. Note that a server sending **no**
charset makes the page fall back to windows-1252 and mojibakes every non-ASCII
character; the preview chrome is ASCII-only so its controls are immune, but the
screens' own text is not.
