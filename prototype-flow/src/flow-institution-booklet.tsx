/*
  MARKELO PROTOTYPE FLOW — ARCHIVED.
  Institution & governance + Booklet profile, 2 chapters, 9 artboards.
  Superseded 2026-08-23 by flow.tsx (Exam Setup · Student Data & Results ·
  Scanning · Triage & Review).
  Git tag: archive/institution-booklet-flow.

  This file is kept so these chapters can be re-activated or referenced by
  importing from here instead of flow.tsx. To re-activate: reverse the import
  in App.tsx, re-point index.html title and the App footer line, and re-tag.

  NOT a route table. This is a demo-order list for one long vertical scroll canvas.
  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.

  How this build grew
  -------------------
  Screens are taken into Figma one flow at a time, assigned to a teammate to map
  the Markelo design-system tokens, corrected, reviewed, then released to the dev
  team. So this file was deliberately a DEFAULT-STATE-ONLY list: every screen's
  empty / loading / error / denied states are built later, on request, and slotted
  in directly under their parent screen.

  Movement is by per-screen TRIGGER POINTS, not a floating nav (see ScreenShell):
  every artboard carries a "previous" and a "next" affordance in its own margin.
  `actions` still maps a click on a real in-screen button/link (by visible text)
  to a target id, for when a screen's own CTA should advance the demo.

  Two-chapter narrative:
    1. Institution & governance — establish the institution, its people, settings,
       audit trail, and controlled correction of locked results.
    2. Booklet profile — teach Markelo what the answer booklet looks like,
       validate detection, version the profile.
*/
import React from "react";
import * as AD from "../../webapp-scaffold/src/screens/admin";
import * as ST from "../../webapp-scaffold/src/screens/settings";

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "governance" | "booklet";
  el: React.ReactNode;
  actions?: FlowAction[];
  advanceAnywhereTo?: string;
};

export const FLOW: (FlowScreen | { chapter: string })[] = [
  /* =============================== Flow 1: Institution & governance */
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

  /* ===================================== Flow 2: Booklet profile */
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
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
