# Markelo, Web App Design Week
## Plan, screen assignments, and what each person owns

**Week of Monday 27 July – Friday 31 July 2026**
Prepared by KingFizzy (Lead Product Designer)
Sources: **PRD v3.4**, **User Stories (19 July)**, founder voice notes 26 July

> **Which documents are current:** PRD v3.4 (`Markelo_PRD.docx`) and `Markelo_User_Stories.updated(19 July).docx`.
> **Do not use** `Markelo_User_Stories_v2.(13 July)docx.docx` or `Markelo_PRD_v1.1.docx`. They describe the old QR control-sheet product. See section 6.

---

## 1. Where we are

The design system foundation is in good shape. What exists and is ready to use:

- Colour, full palette, colour rules, all saved in Variables
- Typography, display, headline, title, body, label
- Spacing, radius, shadow
- Buttons: every state and every size
- Accordion / dropdown
- Alert panels, variants and states
- Attention boxes

**Now also done, as of Tuesday 28 July, you are unblocked:**

- **Desktop Grid**, 12 columns, Stretch, **120px margin, 24px gutter**
- Input fields and form patterns
- Tables
- Modals and overlays
- **Lucide icon set**

**Use the Desktop Grid on every screen.** The style is named "Desktop Grid" in the Figma file. At a 1440 frame it gives you a 1200px content area and a 78px column.

**We are designing for desktop only.** No tablet layout, no mobile layout, no breakpoints. Do not design a responsive version of anything.

Still missing, and not blocking you: navigation, badges and tags, progress and loaders. If you need one of these, ask in the group rather than building your own.

---

## 2. What we must achieve this week

The founder's target is **70% of the web app designed by the end of next week**. Seventy percent of a fixed list, not a feeling. This is that list.

A screen counts as **done** when it has all five of these, built from the component library:

1. Default state
2. Empty state
3. Loading state
4. Error state
5. The state a user sees when they do not have permission

If a screen has only the default state, it is 20% done, not done.

---

## 3. Screen assignments

Every screen below comes from PRD v3.4, Section 15. Only V1 screens are in scope. Do not design anything marked V1.5 or V2.

### Team lead, KingFizzy
**Login, role-based onboarding, and all six dashboards**, Epic J, Epic I

- Sign in, sign in error, MFA check, accept invitation, forgot password, reset password
- No role assigned, account suspended
- **Choose role**, a person can hold more than one role at once (story I2)
- **Session about to expire**: a gentle prompt, never a silent logout (story J4)
- **Access revoked mid-work**, a role change takes effect immediately (story J5)
- Onboarding for all six roles
- Dashboard for Institution Admin, Exam Officer, Lecturer, Teaching Assistant, Moderator/HOD, Senior Management
- The app shell, sidebar, top bar, offline indicator, role switcher

*Status: a working scaffold of all 32 of these screens is already built and will be shared Monday.*

---

### Designer 1, Institution and governance
**Owner of everything an Institution Admin controls**

| Screen | PRD ref |
|---|---|
| Institution Setup, courses | §15; story I1 |
| Institution Admin Settings, people and roles | §6; stories I2, I3, J5 |
| Audit Trail Viewer | §9.10; story H1, F2 |
| Result Correction | §9.9; story G2 |

Three rules that are easy to miss:

- **V1 is a flat course list.** Faculty and department hierarchy is V1.5. Do not design a tree. Courses must be editable and deactivatable, not add-only (story I1).
- **A person can hold more than one role at once**, Lecturer + HOD is the named example. Your people-and-roles screen has to let an admin give someone two roles, and show both (story I2).
- **Audit entries read as plain sentences, not a technical log** (story F2). "Prof. Eze returned MK-000238 to Tunde Alabi on 24 July", not `AUDIT_EVT_RETURN uid=442`.

Also: a new account has **no role and no access** until an admin gives it one. Design that waiting state properly, it is not an edge case.

---

### Designer 2, Booklet profile
**Owner of the single hardest onboarding flow in the product**

| Screen | PRD ref |
|---|---|
| Institution Booklet Profile Setup | §9.1; story A1 |
| Booklet Profile Validation | §9.1.1; stories A2, A3 |
| Booklet Profile versioning | story A4 |

This is where an admin uploads a few pages of the institution's own answer booklet and Markelo learns its layout.

Four things the stories require:

- Only the **cover page is required**. Normal page, extra sheet, and continuation sheet are optional (A1).
- Validation must report **what it detected**, cover page found, identity fields located, OCR quality, segmentation confidence (A2).
- A profile **cannot be marked "ready to use" until every flagged field is resolved** (A2). Design that blocked state.
- The **draw-a-box correction tool** for a field Markelo could not find, available directly from the validation report (A3).
- **Versioning is V1, not V1.5.** When the institution redesigns its booklet, a new version is created and old scripts are never reprocessed (A4).

Read §9.1 twice before starting. This flow did not exist in the old PRD.

---

### Designer 3, Exam setup
| Screen | PRD ref |
|---|---|
| Exam Creation | §10 step 1 |
| Marking Scheme Setup | §9.4; story D1 |

Marking Scheme in V1 is deliberately simple: question number and highest mark only. **Do not design a rubric builder.**

Story D1 adds two hard rules: marking **cannot begin** until a scheme with at least one question exists, and a mark entry **cannot exceed** its question's maximum. Design both blocked states.

---

### Designer 4, Student data and results
| Screen | PRD ref |
|---|---|
| Student Data Upload and Validation | §10 step 2 |
| Identity Registry | §9.11; story H2 |
| Result Processing and Grade Report | §9.8; story G1 |

Three hard rules. The upload must handle 5,000+ student records and show errors clearly. The Identity Registry is the **only** place in the whole product where a name appears, Exam Officer only, closed once the exam reaches Marking status, and **every lookup requires a stated reason** and is logged with the actor and the record (story H2). Result export uses one fixed formula in V1 (CA + Exam = Total) with a manual override for genuine edge cases (story G1).

---

### Designer 5, Scanning and processing
| Screen | PRD ref |
|---|---|
| Scan Batch Upload | §9.2; story B1 |
| AI Processing and Integrity Report | §9.2, §9.2.1; story B2 |

Officers scan booklets in batches, in any order, never pre-sorted by name or matric number (B1).

**The most important detail in this flow, from story B2:** each script shows a live status of **Matched / Needs Review / Missing Pages**, and a script showing *Matched* can be assigned for marking **immediately**, without waiting for the rest of the batch to finish. A single batch-level progress bar is not enough. Design the per-script list.

---

### Designer 6, Triage and review
| Screen | PRD ref |
|---|---|
| Exception Queue | §9.2.1; stories B3, B4, B5 |
| Moderation Workspace | §9.7; story F1 |

These are the same pattern, a queue of things a human must decide on, so one person owns both and they stay consistent.

- **Two modes are required** (B4). During the pilot, every script needs human confirmation whatever score Markelo gives it. Normal mode shows only exceptions. Design both.
- **Every entry states its specific reason**, never just "needs review" (B5). And resolving an entry removes it from the queue immediately.
- An **extra sheet never starts a new script**; an identity mismatch between an extra sheet and its cover page goes to the queue rather than being guessed either way (B3).
- In moderation: original and moderated marks **side by side**; Returning **requires a stated reason**; if the moderator changes a score and approves, the moderated score becomes the score of record and **the original is kept permanently** (F1).

---

### Designer 7, Marking workload
| Screen | PRD ref |
|---|---|
| Marking Assignment | §9.5; story D2 |
| Marking Progress | §9.5, V1 basic |

A lecturer splits a class between themselves and their TAs, and can change the split at any time. A TA sees **only** the scripts explicitly assigned to them. If a script moves mid-marking, the first marker's submitted marks are **preserved as history, never deleted or overwritten** (D2).

One thing from the PRD personas that is easy to skip: a TA should see their **own** pace, not a comparison against other TAs.

---

### Designer 8, The marking interface
| Screen | PRD ref |
|---|---|
| Marking Interface | §9.3; stories C1, C2 |
| Answer Viewer | story C2 |
| Offline sync states across marking | §9.6; stories E1, E2 |
| Keyboard operation | story K1 |

This is the product. Everything else supports it. It gets the most time and the most edge cases.

Non-negotiable: **no student name, no matric number, anywhere on this screen, ever.** The marker sees a Script ID like MK-000245. There is no setting that turns this off (C1).

**The Answer Viewer** (C2) needs zoom, pan, rotate, and page/thumbnail navigation. It shows redacted page images only, never the original. And a deliberate design decision from the UX Spec: **Markelo does not auto-jump to an answer.** The marker navigates the script themselves. Do not design an auto-jump.

**Offline** (E1, E2): there is **no disabled state tied to losing connectivity**, the screen keeps working. Already-viewed pages stay viewable offline, not just the mark fields. On reconnect, pending changes submit by themselves. If the script was reassigned while the marker was offline, their submission is **flagged as a conflict**, not silently accepted or lost.

**Keyboard** (K1): every control here, including the viewer's zoom/pan/rotate, must be keyboard-operable. Formally a V1.5 target, but flagged as prioritised because this is the highest-volume screen in the product. Design the shortcuts now even if they ship later.

---

## 4. Rules for everyone

1. **Use the component library.** If you need something that does not exist, ask in the group. Do not build a one-off.
2. **Use the Desktop Grid on every screen.** 12 columns, 120px margin, 24px gutter. Desktop only, no tablet, no mobile, no breakpoints. Do not design a responsive version of anything.
3. **Icons are Lucide. Only Lucide.** Not Tabler, not Feather, not Material, not a mix. Get the Lucide plugin in Figma and pull icons from there. Sizes are fixed: **14px** inside small buttons, **16px** inside normal buttons, **17px** in the sidebar, **18px** in alert panels, **13px** on a stat label. Stroke width is **2**. If you find yourself wanting a different size, ask first.
4. **Plain language on every label.** "Print the class list", not "Generate PDF export". PRD §2.
5. **Five states per screen**, as listed in section 2 above.
6. **Assume the user has had no training and is not confident with software.** PRD §2. Help belongs on the screen, not in a manual.
7. **Accessibility floor** (stories K1, K2). Everything must be reachable by keyboard, and every control needs a visible focus state. We are targeting WCAG 2.2 Level AA. Do not solve a crowded screen by shrinking text below the minimum.
8. **Daily update in the group**, what you finished, what is blocking you. A reaction is enough to confirm you have read the day's update.

---

## 5. Daily shape of the week

| Day | Focus |
|---|---|
| Monday–Tuesday | ✅ Done. Desktop Grid, inputs, forms, tables, modals, and the Lucide set are published. Everyone reads their PRD section **and their user stories** and sketches their flow. |
| Tuesday | First screens in Figma. Default state only. |
| Wednesday | Empty, loading, and error states added. Mid-week review. |
| Thursday | Permission states, edge cases, consistency pass. |
| Friday | Full team review, fix the gaps, count what is actually done. |

---

## 6. Read this before you start

The PRD changed. Version 3.4 is **not** the same product as the older document.

The old version attached a printed QR control sheet to every booklet. **That is gone.** The new PRD says plainly that no sticker, no printed code, and no new sheet is ever attached to a booklet. Markelo now learns the institution's existing booklet layout instead.

The old user stories changed with it. The 13 July version had **US-06 Control Sheet Generation and Export**, that screen no longer exists. It is replaced by the Booklet Profile flow that Designer 2 now owns.

**Use these two documents, and nothing else:**

- `Markelo_PRD.docx`, version 3.4
- `Markelo_User_Stories.updated(19 July).docx`

Plus the UX Specification for layout and interaction detail.

**Do not use** `Markelo_PRD_v1.1.docx` or `Markelo_User_Stories_v2.(13 July)docx.docx`. If you design from either of them you will design the wrong product.

One more thing worth knowing. PRD §2.1 sets a principle that runs through everything: **AI administers, humans grade.** Markelo automates assembling and anonymising a script. It never touches a mark, at any confidence level. If a design you are making implies the system suggested a score, that design is wrong.
