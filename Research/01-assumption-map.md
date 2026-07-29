# Markelo, Assumption Map

**Purpose:** This document lists every important assumption in the Markelo PRD and user stories. Each assumption has a risk score and a question to ask in the field.

**How to read the risk score:**
- **Regret cost** = how much work we must redo if the assumption is wrong.
- **Confidence** = how sure we are today, based on real evidence.
- **Priority** = test the HIGH regret + LOW confidence rows first.

**Important:** Confidence values below are honest. The team has spoken to approximately 4 people (founder statement, 20 July 2026 meeting). Almost nothing here is validated.

---

## Tier 1, Test these first (high regret, low confidence)

### A1. Institutions will attach a control sheet to every booklet before the exam
- **Source:** PRD A7 Feature 1, Workflow Step 3–4
- **Status:** ASSUMED
- **Why it matters:** This is the entry point of the whole product. Every later step depends on it.
- **The problem:** The PRD says Markelo requires "no change to the physical examination process." This is not accurate. Attaching a unique, per-student control sheet to each booklet **is** a change to exam-day process. Someone must print 1,240 sheets, keep them in order, and match the correct sheet to the correct student.
- **If wrong:** The script-identification pipeline (US-06, US-07, US-08) does not work. This is a large part of the product.
- **Ask:** "Walk me through what happens on exam day, from when booklets leave the store to when the invigilator collects them. Who handles them at each step?"

### A2. Institutions own scanners that can bulk-scan thousands of pages
- **Source:** PRD Workflow Step 5 ("using existing scanners")
- **Status:** ASSUMED, never verified
- **Why it matters:** If a department has one flatbed office scanner, scanning 1,240 scripts is impossible.
- **If wrong:** The institution must buy hardware. This changes the price, the sales cycle, and the buyer.
- **Ask:** "What scanning or photocopying equipment does the department have? May I see it?" (Record make, model, and sheet-feed capacity.)

### A3. Anonymous marking is wanted, and is permitted by institutional regulation
- **Source:** PRD A9, described as "Markelo's foundational trust feature"
- **Status:** ASSUMED
- **Why it matters:** This is the core of the product and the main sales claim.
- **The risk:** Wanting anonymity is not the same as being allowed to have it. Some institutions may have exam regulations that require the marker to confirm identity. Some lecturers may resist it.
- **If wrong:** A large part of the product's value disappears.
- **Ask:** "When you mark, do you see whose script it is? Has your institution ever discussed hiding student identity? What is the written exam regulation on this?"

### A4. The institution's existing result portal will accept a Markelo export file
- **Source:** PRD A7 Feature 7 ("a result file the institution's own portal already accepts")
- **Status:** ASSUMED, highest technical risk in the product
- **Why it matters:** If the export does not load, the exam officer must re-type every result. The main efficiency claim fails.
- **If wrong:** Markelo needs a per-institution integration. That is slow, costly, and blocks scaling.
- **Ask:** "What system do you upload final results into? Can you show me the file format it accepts? Who controls that system?"

### A5. Scripts go missing often enough to be a real, felt problem
- **Source:** PRD A3 Problem Statement
- **Status:** ASSUMED. This is the product's founding claim
- **Why it matters:** If missing scripts are rare, the main pitch is weak.
- **Ask:** "Think of the last two exam periods. Did any script go missing? What happened? How long did it take to resolve?" (Ask for the incident, not an opinion.)

---

## Tier 2, Test soon (high regret, medium confidence)

### A6. Teaching Assistants exist, and lecturers already delegate marking to them
- **Source:** PRD A8, Feature 4, called "a first-class workflow, not a side feature"
- **Status:** ASSUMED
- **Risk:** TA availability differs a lot by institution and department. Some lecturers mark everything themselves. Some use postgraduate students informally, with no official record.
- **Ask:** "Who marks scripts for your largest class? How is the work shared? Is that arrangement official?"

### A7. Markers have a device good enough for the marking interface
- **Source:** Implied by US-10, US-11
- **Status:** ASSUMED
- **Risk:** If lecturers mark on a phone, the whole marking screen design changes. The PRD assumes desktop web.
- **Ask:** "What device would you use to mark on screen? Do you have a personal laptop? Where would you do it, office or home?"

### A8. Institutions will accept scanned scripts being stored on an external server
- **Source:** Implied throughout; PRD C6 mentions compliance
- **Status:** NEEDS VALIDATION, includes a legal question (Nigeria Data Protection Act)
- **Risk:** Exam scripts are sensitive records. An institution's legal or ICT team may refuse external storage, or require on-premise hosting.
- **Ask (ICT/legal):** "Where is student data allowed to be stored? Do you have a data-protection policy? Has an external system been refused before?"

### A9. Extra answer sheets can be handled by one of two methods
- **Source:** PRD/US-03 (extra-sheet method 1 or 2)
- **Status:** ASSUMED
- **Why it matters:** Students who write more than one booklet are common. If the extra sheet is not linked correctly, pages join the wrong script. This is a silent, serious data error.
- **Ask:** "What happens when a student needs a second booklet? How is it joined to the first one today?"

### A10. Continuous Assessment (CA) scores exist in a spreadsheet that can be merged
- **Source:** PRD A7 Feature 7
- **Status:** ASSUMED
- **Ask:** "Where do CA scores live now? Who holds them? Can you show me the file?"

---

## Tier 3, Business and buying assumptions (currently the weakest area)

### A11. We know who signs the contract
- **Status:** UNKNOWN. This is a gap, not an assumption
- **Note:** The stated target users (lecturers, exam officers) are users, not buyers. Nobody has confirmed who holds the budget.
- **Ask (any senior staff):** "If a department wanted software like this, who approves it? Who pays, the department, the ICT directorate, or the central administration?"

### A12. Institutions have budget, and a purchase cycle we can survive
- **Status:** UNKNOWN
- **Ask:** "When does the budget year run? How long does approval usually take for a new system?"

### A13. Private universities are the right first target
- **Source:** Founder statement, 20 July 2026 meeting (they respond faster)
- **Status:** ASSUMED, the reasoning is about *speed of response*, not *willingness to pay* or *fit*
- **Risk:** Fast to reach is not the same as likely to buy. Federal universities have far higher script volumes, so the pain may be much greater there.
- **Ask:** Compare volume and pain between one private and one federal institution before fixing the target.

### A14. Faster result release is valued enough to pay for
- **Source:** PRD A3
- **Ask:** "What is the deadline for submitting results? What happens if it is late? Has that ever caused a real problem?"

---

## Tier 4, Lower regret (design details, cheap to change later)

| ID | Assumption | Source |
|---|---|---|
| A15 | Moderation works by sampling a subset of scripts | PRD A8 Step 10 |
| A16 | The moderated score should become authoritative on approval | US-14 Business Rule |
| A17 | A marker may correct their own marks until moderation starts | US-10 Business Rule (PRD flags the exact cutoff as unconfirmed) |
| A18 | Exam officers can produce a clean roster spreadsheet | US-05 |
| A19 | 5,000 roster records must validate within 60 seconds | US-05 BR-05.4 |
| A20 | Demo Mode reduces the need for training | PRD A10 |

---

## How to use this map

1. Take Tier 1 and Tier 2 questions into every interview.
2. After each interview, mark each assumption: **Supported / Contradicted / Still unknown**.
3. Review the map weekly. Move rows between tiers as evidence arrives.
4. **Do not mark an assumption "validated" from one conversation.** Use three or more independent sources.
