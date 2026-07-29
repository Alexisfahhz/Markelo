# Markelo Design System, Define Layer

**Stage:** Define (Roadmap stage 1 of 4)
**Date:** 21 July 2026
**Status:** Draft for Michael's confirmation

**What this document is.** The roadmap says Define comes before Create. This layer records *why* the design system exists and *what rules govern it*. Every foundation and component decision must point back to this document.

**How this was made.** Almost everything here is captured from the Markelo PRD v1.1 and User Stories v2. It is not invented. Where I inferred something, I marked it **ASSUMED**. Where nothing exists yet, I marked it **GAP**.

---

## 1. Goals, why this design system exists

**The problem it solves.** The Markelo website UI was built without a design system or component library. The result is inconsistent. The product now needs 22 screens across 6 roles, and the interface is data-dense. Without shared rules, 10 designers will produce 10 different interfaces.
*Status: KNOWN, observed in Michael's own audit (5.0/10, maturity level 2 of 5).*

**Who it serves.**
1. The 10 Markelo designers, of whom 3 are not yet strong in Figma.
2. The engineers, who build in Next.js, TypeScript, and Tailwind.
3. AI tools used in the workflow, which must apply the rules instead of guessing.

**The outcomes it must change.**
- A designer can build a new screen without inventing new values.
- The same component looks and behaves the same on every screen.
- Design decisions transfer to code without loss.
- Accessibility is built in, not added later.

**Non-goals for version 1.0.**
- A public, published documentation website.
- Support for native mobile applications. The PRD lists native mobile as out of scope.
- Multi-language support. The PRD lists this as a phase 2 candidate.
- Theming for multiple institutions. **ASSUMED**, no PRD statement either way. Confirm this.

---

## 2. Principles, the rules that settle arguments

These are taken from the PRD's product philosophy (section A2) and problem statement (A3).

### P1. Familiar before novel
*Source: PRD A2, "The product must feel as familiar as tools lecturers already use, Word, Google Docs, email."*
The interface must look like software the user already knows. Reject a pattern that is elegant but unfamiliar.
**Trade-off:** when a familiar pattern conflicts with a modern one, choose familiar.

### P2. Plain language always
*Source: PRD A2, "Technical jargon is replaced with plain, task-oriented language."*
Every label names what the user does, not how the system works. Say "Print control sheets", not "Generate PDF batch export".
**Trade-off:** longer plain labels beat shorter technical ones.

### P3. Assume low technical confidence and no training
*Source: PRD A2, "Every workflow assumes the primary user has limited technical confidence and no time for training."*
No feature may depend on the user reading documentation first. Guidance appears in the interface.
**Trade-off:** accept more on-screen text if it removes a training need.

### P4. Density needs hierarchy
*Source: Michael's team message, 21 July 2026, "this is a product that will be data dense, higher institutions have thousands of students."*
Screens will hold thousands of rows. Use type weight, spacing, and colour to create a scanning order. Do not solve density by shrinking text.
**Trade-off:** when density conflicts with comfort, keep the accessible minimum text size and remove content instead.

### P5. Failure states are first-class
*Source: PRD A2, "must function reliably under unstable electricity and internet conditions"; US-11 offline marking.*
Every component is designed with its offline, pending, error, and empty states at the same time as its normal state. A component without these is not finished.
**Trade-off:** this slows component delivery. Accept it. This is the product's operating context.

### P6. Identity protection is structural, not decorative
*Source: PRD A6 hard constraint and A9, no role may view identity while marking.*
No marking-surface component may accept a name or matriculation number as input. Script ID only. The interface must also make the protection visible, because it is the product's main trust claim.
**Trade-off:** none. This principle never yields.

---

## 3. Scope, what the system covers

**Covered surfaces**
| Surface | Notes |
|---|---|
| `app.markelo.ng`, the application | 22 user stories, 6 roles. Primary scope. |
| `markelo.ng`, the marketing site | Shares foundations. Uses a separate, lighter component set. |

**Covered roles**, Exam Officer, Lecturer, Teaching Assistant, Moderator/HOD, Institution Admin, Senior Management.

**Covered platform**, Desktop web first.
**GAP:** the PRD does not state a minimum screen width or whether tablet use is expected. Assumption A7 in the research kit asks markers what device they would use. The answer changes the layout foundation. **Do not finalise breakpoints until this returns.**

**Not covered in version 1.0**
- Native mobile components.
- Print styles beyond the control sheet, which is a product artifact and not a UI component.
- Marketing brand assets such as shirts and business cards. These are brand work, not system work.

**Depth of support**
- **Full support:** everything on the marking, scanning, and results paths. These carry the product's trust claims.
- **Partial support:** admin settings and analytics screens. Use generic components. Do not build bespoke ones yet.
- **Deferred:** demo mode (US-20). It reuses existing components.

---

## 4. Architecture, how the system is structured

**Token layers (two tiers).**
1. **Primitive**: raw values. Example: `blue-700 = #1A56A0`. Named by scale, never by use.
2. **Semantic**, roles that point at primitives. Example: `action/primary → blue-700`.

**The single binding rule:** components bind to semantic tokens only. A component never uses a primitive directly. This rule is what makes the system changeable later.

**Sources of truth.**
| Layer | Lives in |
|---|---|
| Tokens | Figma Variables (primitive and semantic collections) |
| Components | Figma library |
| Code mirror | Tailwind config, using the same names as the Figma variables |

**Foundation areas, 8 total**, from the roadmap: Typography, Color, Spacing, Radius, Border, Layout, Elevation, Motion.
Markelo's existing design system PDF covers only Color, Typography, and Spacing, and covers them as values with no usage rules. **Radius, Border, Layout, Elevation, and Motion do not exist yet.**

**GAP:** Figma Starter plan limits variable collections and modes. Confirm the current plan's limits before building the token structure, so we do not design something the plan cannot hold.

---

## 5. Ownership, who decides

| Area | Owner |
|---|---|
| System direction and final decisions | Michael (acting Product Design Team Lead) |
| Foundations and tokens build | Michael plus 1–2 paired designers |
| Component build | The paired designers, reviewed by Michael |
| Code mirror | **GAP**, no engineer is named. This must be assigned, or design and code will drift. |
| Product rules that constrain design | Product Management, through the PRD |

**Escalation.** If a design decision conflicts with a PRD business rule, the PRD wins. Raise it with Product instead of solving it in the interface.

**GAP:** there is no official design lead role. Michael is acting. This is a real risk to the system's authority. Decisions may be reopened by others.

---

## 6. What must be confirmed before Phase 1 finishes

1. Is multi-institution theming needed? This changes the token architecture significantly.
2. What is the minimum supported screen width? Research assumption A7 answers this.
3. What are the Figma Starter plan's limits on variable collections and modes?
4. Who owns the code mirror on the engineering side?
5. Do you accept these 6 principles, or do you want to change any?

---

## Ready-enough checkpoint

The roadmap's bar for this stage: *"The team can use agreed goals to make consistent scope and priority decisions."*

**Not yet met.** Four gaps above are open. But the principles and scope are strong enough to begin Foundations. Continue to Phase 1, and close the gaps in parallel.
