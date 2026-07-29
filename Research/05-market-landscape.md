# Markelo, Global Market Landscape

**Date of research:** 21 July 2026
**Method:** Web research against vendor sites, university IT pages, and press sources. Every claim below has a source. Claims that could not be verified are listed at the end.
**Status:** KNOWN (external, verifiable). This is the only part of our evidence base that is not assumption.

---

## Summary, what this tells us

**Good news.** The core Markelo concept is proven elsewhere. Two facts matter most:

1. **Anonymous marking is standard national policy across UK universities.** It is not an experimental idea. It is a mandated, audited practice.
2. **Scanning paper scripts and marking them on screen works at national scale in India.** CBSE, India's largest school board, begins On-Screen Marking for Class 12 in 2026.

**The white space is real.** No product found combines all four of these:
- paper-first intake using pre-printed QR control sheets
- automatic splitting per student **and** per question
- anonymity enforced by the server, not by a switch an admin can turn off
- genuine offline-first marking with later sync

---

## The five closest products

| Rank | Product | Country | How it differs from Markelo |
|---|---|---|---|
| 1 | **Crowdmark** | Canada | Closest workflow match. QR-coded booklets, batch scan, splits by page and question, routes single questions to different markers at the same time, native blind marking. **Differs:** built for high-connectivity campuses. No CA merge. No stated offline marking. |
| 2 | **Gradescope** (Turnitin) | USA | Same scan-and-split concept, AI-assisted answer grouping. **Differs:** anonymity is a per-assignment *setting*, not structural. Student matching relies on written IDs or roster matching, not an end-to-end Script ID system. |
| 3 | **TCS iON Digital Marking** | India | Closest to our server-enforced "never see the name" model, at exam-board scale. Coded answer books, marker access gated by face recognition or OTP. **Differs:** vendor-run managed service for government boards. No lecturer-to-TA delegation. |
| 4 | **MeritTrac TracMarks / OSM** | India | Same pipeline: scan, mask identity, assign to evaluator, mark on screen, auto-tabulate. **Differs:** service model for boards, not licensable software for one institution. |
| 5 | **WISEflow** (UNIwise) | Denmark | Strongest policy-grade anonymity: blind and double-blind, traceable only by admins. **Differs:** built for born-digital exams, not paper-booklet scanning. |

---

## Detail by product

### Crowdmark (Canada)
- **Workflow:** Instructor uploads a booklet design. Crowdmark inserts QR codes on each page. Booklets are printed, written on by hand, then scanned as a batch **in any order** and uploaded. QR codes rebuild which pages belong to which student and question.
- **Notable difference from our plan:** markers can be assigned **one question across the whole cohort**, instead of whole scripts. This is a real alternative to our per-script assignment model.
- **Anonymity:** native blind marking.
- **Confirmed users:** University of Waterloo (LMS-integrated, free to instructors); Toronto Metropolitan University (supported external tool).
- **Pricing:** not public. "Request pricing." Licensed per instructor, department, or institution.
- Sources: crowdmark.com/help/scanning-assessments, crowdmark.com/blog/grading-one-question-vs-entire-assessment, uwaterloo.ca/crowdmark, torontomu.ca/courses/toolbox/crowdmark

### Gradescope (Turnitin, USA)
- **Workflow:** Instructor uploads a blank template and marks answer regions per question. Paper exams are scanned on any campus scanner. Gradescope splits the batch by student and question region, then groups similar answers using AI to speed up marking.
- **Anonymity:** a per-assignment "Anonymous Grading" setting replaces names with a random ID. Submissions still match to real students in the backend. Explicitly **not recommended** for bubble-sheet or instructor-uploaded work, because matching depends on visible identifiers.
- **Confirmed users:** University of Michigan, Stanford, University of Florida, University of Chicago, UC Irvine, each confirmed on the institution's own teaching-technology pages.
- **Pricing (public):** Basic $1 per student per course. Team $3 per student per course. Solo $3 per student. Institutional is custom.
- Founded at UC Berkeley in 2014. Acquired by Turnitin in 2018.
- Sources: gradescope.com/pricing, academictech.uchicago.edu, caennews.engin.umich.edu, teachingcommons.stanford.edu, elearning.ufl.edu

### TCS iON Digital Marking (India)
- **Workflow:** The vendor runs the whole pipeline. Scan and code every answer book, digitise, upload to data-centre servers, assign to markers and reviewers, evaluate on screen, publish results.
- **Anonymity:** identity stripped and replaced with a coded number before any marker sees the script. *This is the vendor's own claim on its own site. No independent confirmation found.*
- **Named users:** none found. See "could not verify".
- Source: tcsion.com/institutions/higher-education/digital-marking

### MeritTrac TracMarks (India)
- **Workflow (vendor's description):** scan and mask scripts, assign to evaluators, mark on screen, auto-calculate results. Identity masking plus encrypted storage.
- **Named users:** not confirmed.
- Source: merittrac.com/blogs/digital-evaluation-guide-universities-exam-marking

### WISEflow (UNIwise, Denmark)
- End-to-end digital assessment platform. Founded out of Aarhus University in 2010.
- **Anonymity:** configurable blind and double-blind marking. Admin staff keep full traceability for audit.
- **Confirmed user:** University of Copenhagen.
- Vendor claims roughly 70 European universities. Not independently confirmed.
- Source: uniwise.eu/about, uniwise.eu/resources/news

### Inspera Assessment (Norway)
- **Anonymity:** shows student numbers, not names, to markers by default. Anonymity can be switched off when required.
- **Confirmed users:** Newcastle University, University of Bath, Victoria University of Wellington.
- Source: ncl.ac.uk/learning-and-teaching/digital-technologies/inspera/marking-exams

### Canvas SpeedGrader and Moodle blind marking
Both offer anonymous grading inside a general LMS. Both have documented limits:
- **Canvas:** unavailable for quizzes, graded discussions, and group assignments. Does not redact a name the student typed inside the document. Anonymity lifts permanently once grades post.
- **Moodle:** replaces names with a random participant number. Once identities are revealed, this cannot be reversed. Settings lock as soon as a submission or grade exists.
- **Neither handles paper scanning or script splitting at all.**

### OMR tools, Akindi, Remark Office OMR, Scantron
These score multiple-choice bubble sheets. They do not handle long-form scripts, anonymous essay marking, moderation, or script splitting. Included only to show the boundary of that category. Several universities have retired Scantron in favour of Gradescope.

---

## National practices

### United Kingdom, anonymous marking is sector policy
This is the strongest external support for Markelo's core feature.

UK universities run anonymous marking as formal, audited institutional policy, not as a vendor feature. The mechanism is close to our Script ID: the central registry issues each student an **anonymous candidate number**, separate from their student ID. That number appears on the script. Names are withheld from markers until marks are final.

Confirmed examples:
- **UCL:** "Examinations and tests must be assessed against Candidate Number only."
- **University of Reading:** answer books require an Anonymous Candidate Number; only administrative staff cross-reference it against the seating list.
- **University of Derby:** policy covers all summative assessment, registration number only, no name.
- **Bournemouth University:** rolled out to all students from November 2019.
- **Canterbury Christ Church University:** board-approved Anonymous Marking Policy document.
- Exceptions (vivas, performance assessments) need board-level sign-off.
- A peer-reviewed study on the effectiveness of anonymous marking in UK higher education exists (PMC5557596), independent, non-vendor evidence.

**Why this matters to us:** UK anonymity is enforced by policy and process, largely independent of the software underneath. Markelo's proposition is to enforce the same thing *in software*. That is a defensible position.

### India, On-Screen Marking (OSM)
This is the closest match to our operating context: paper-heavy, very high volume.

- The exam stays paper-and-pen. Only **marking** goes digital. Answer books are scanned to high-resolution images, uploaded to a secure portal, and evaluators mark on screen.
- **CBSE**, India's largest board, begins OSM for Class 12 in **2026**. Class 10 stays physical, a deliberate phased approach. CBSE's stated goals: reduce totalling errors and script misplacement, and remove the physical transport of answer books.
- **Punjab's PSEB** intends to be the first Indian state board to go fully end-to-end digital.
- India's Right to Information Act requires answer scripts to be producible on request. This shapes retention design.

**An important warning for us:** Delhi government schoolteachers reportedly asked CBSE to **phase the rollout rather than launch everything at once**. Marker resistance to on-screen marking is real and documented. We should plan for it.

### Nordic region
WISEflow and Inspera both treat blind and double-blind marking as first-class platform features. Neither was built to scan paper booklets.

---

## Gaps and white space

1. **No product combines all four:** paper-first QR intake, per-student *and* per-question splitting, structurally enforced anonymity, and true offline-first marking. Crowdmark and Gradescope reach the first three but assume reliable broadband. The Indian vendors reach the scale but are managed services for boards, not software for one institution's TA workflow.
2. **Offline marking is thin everywhere.** No named product in this research documents a robust offline-first marking client with later sync. Generic vendor blog claims exist, but nothing specific. **This looks like a genuine underserved gap for our market.**
3. **CA merge is absent.** No product found merges continuous-assessment scores with anonymised exam scores into one export. This is unique to our spec.
4. **Chain-of-custody for physical scripts is not marketed by any exam vendor.** Some gesture at encrypted storage and compliant archival. None market an immutable audit trail for paper booklets.
5. **Lecturer-to-TA delegation** is native to Crowdmark and Gradescope, but absent from the board-exam tools, which assign anonymous evaluators centrally. Our organisational model matches the Western university tools, not the Indian board tools.
6. **No competitor found is built for the African or Nigerian tertiary context.** Zero. This supports the positioning, though it also means no one has proven the market.

---

## Could not verify

- Named institutional clients of **TCS iON Digital Marking**.
- Named institutional clients of **MeritTrac TracMarks**.
- Whether **Akindi** or **Remark Office OMR** support anonymous marking at all, no documentation found either way.
- The institution behind Crowdmark's "~15.5 hours saved on a 350-paper exam" claim.
- UNIwise's claim of ~70 European universities.
- Any named product with a demonstrated **offline-first marking client with sync**.
- Gradescope's own anonymous-grading help page returned an HTTP 403 error. Its content was reconstructed from search snippets. Treat with lower confidence.

---

## What we should do with this

1. **Use the UK policy evidence in the pitch deck.** It answers "is anonymous marking a real requirement?" with named institutions instead of opinion.
2. **Use CBSE 2026 as proof of direction.** A national board of that size moving to on-screen marking shows the model works at volume.
3. **Test Crowdmark's per-question assignment model.** Assigning one question across the whole cohort may be faster and more consistent than assigning whole scripts. Our PRD assumes whole-script assignment (A6). This is worth a design comparison.
4. **Treat offline-first as the main technical differentiator.** No competitor demonstrates it. It is also the hardest thing to build. Confirm it is genuinely needed before over-investing (assumption A7).
5. **Plan for marker resistance.** The CBSE teacher pushback is a warning. Change management may matter more than features.
6. **Do not claim "no competitors exist."** Investors will know Gradescope and Crowdmark. Claim the *combination* is unserved in this context. That claim is true and defensible.
