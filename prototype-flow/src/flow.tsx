/*
  Markelo prototype flow: Institution & Governance · Booklet Profile · Marking · Moderation
  (4 chapters, 17 artboards).
  Matched to the live Vercel build (markelo-marking-flow.vercel.app).

  NOT a route table. This is a demo-order list for one long vertical scroll canvas.
  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.

  Movement is by per-screen TRIGGER POINTS, not a floating nav (see ScreenShell):
  every artboard carries a "previous" and a "next" affordance in its own margin.

  Four-chapter narrative:
    1. Institution & governance (Institution Admin) — establish the institution, its people,
       settings, audit trail, and controlled correction of locked results.
    2. Booklet profile (Institution Admin) — teach Markelo what the answer booklet looks like,
       validate detection, version the profile.
    3. Marking (Lecturer, TA) — split scripts across markers, track marker-by-marker progress,
       overview courses, flag question exceptions, and score anonymised scripts.
    4. Moderation (Moderator) — manage returned scripts, approve result grade distribution
       and manual overrides, inspect immutable dispute audit evidence.
*/
import React from "react";
import * as AD from "../../webapp-scaffold/src/screens/admin";
import * as ST from "../../webapp-scaffold/src/screens/settings";
import * as WK from "../../webapp-scaffold/src/screens/workload";
import * as MK from "../../webapp-scaffold/src/screens/marking";
import * as MD from "../../webapp-scaffold/src/screens/moderation";
import * as OV from "../../webapp-scaffold/src/screens/oversight";
import * as SP from "../../webapp-scaffold/src/screens/support";

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "governance" | "booklet" | "marking" | "moderation" | "oversight" | "support";
  el: React.ReactNode;
  actions?: FlowAction[];
  advanceAnywhereTo?: string;
};

export const FLOW: (FlowScreen | { chapter: string })[] = [
  /* =============================== Chapter 1: Institution & governance */
  { chapter: "Institution & governance" },
  {
    id: "institution-setup",
    label: "Institution Setup",
    group: "governance",
    el: <AD.InstitutionSetup />,
  },
  {
    id: "courses",
    label: "Courses",
    group: "governance",
    el: <AD.InstitutionCourses />,
  },
  {
    id: "people-roles",
    label: "People & Roles",
    group: "governance",
    el: <AD.PeopleRoles />,
  },
  {
    id: "admin-settings",
    label: "Admin Settings",
    group: "governance",
    el: <ST.AdminSettings />,
  },
  {
    id: "audit-trail",
    label: "Audit Trail",
    group: "governance",
    el: <AD.AuditTrail />,
  },
  {
    id: "result-correction",
    label: "Result Correction",
    group: "governance",
    el: <AD.ResultCorrection />,
  },

  /* ===================================== Chapter 2: Booklet profile */
  { chapter: "Booklet profile" },
  {
    id: "booklet-setup",
    label: "Booklet Setup",
    group: "booklet",
    el: <AD.BookletProfileSetup />,
  },
  {
    id: "booklet-validation",
    label: "Booklet Validation",
    group: "booklet",
    el: <AD.BookletProfileValidation />,
  },
  {
    id: "booklet-versions",
    label: "Booklet Versions",
    group: "booklet",
    el: <AD.BookletProfileVersioning />,
  },

  /* ===================================== Chapter 3: Marking */
  { chapter: "Marking" },
  {
    id: "marking-assignment",
    label: "Marking Assignment",
    group: "marking",
    el: <WK.MarkingAssignment />,
  },
  {
    id: "marking-progress",
    label: "Marking Progress",
    group: "marking",
    el: <WK.MarkingProgress />,
  },
  {
    id: "my-courses",
    label: "My Courses",
    group: "marking",
    el: <MK.MyCourses />,
  },
  {
    id: "flagged-for-review",
    label: "Flagged for Review",
    group: "marking",
    el: <MK.FlaggedForReview />,
  },
  {
    id: "marking-interface",
    label: "Marking Interface",
    group: "marking",
    el: <MK.MarkingInterface />,
  },
  {
    id: "answer-viewer",
    label: "Answer Viewer",
    group: "marking",
    el: <MK.AnswerViewer />,
  },

  /* ===================================== Chapter 4: Moderation */
  { chapter: "Moderation" },
  {
    id: "returned-scripts",
    label: "Returned Scripts",
    group: "moderation",
    el: <MD.ReturnedScripts />,
  },
  {
    id: "result-approval",
    label: "Result Approval",
    group: "moderation",
    el: <MD.ResultApproval />,
  },
  {
    id: "dispute-evidence",
    label: "Dispute Evidence",
    group: "moderation",
    el: <MD.DisputeEvidence />,
  },

  /* ===================================== Chapter 5: Oversight & support */
  { chapter: "Oversight & support" },
  {
    id: "exam-performance",
    label: "Exam Performance",
    group: "oversight",
    el: <OV.ExamPerformance />,
  },
  {
    id: "help-guidance",
    label: "Help & Guidance",
    group: "support",
    el: <SP.HelpGuidance />,
  },
  {
    id: "user-settings",
    label: "User Settings",
    group: "support",
    el: <ST.UserSettings />,
  },
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
