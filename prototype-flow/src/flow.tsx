/*
  Markelo prototype flow, batch 1: Institution & governance, then Booklet profile.
  Rebuilt 2026-08-10 on KingFizzy's instruction, replacing the Exam Setup /
  Student Data / Triage flow (archived alongside the earlier governance and
  booklet-scanning flows).

  How this build grows
  --------------------
  Screens are taken into Figma one flow at a time, assigned to a teammate to map
  the Markelo design-system tokens, corrected, reviewed, then released to the dev
  team. So this file is deliberately a DEFAULT-STATE-ONLY list: every screen's
  empty / loading / error / denied states are built later, on request, and slotted
  in directly under their parent screen. Do not add other states pre-emptively.

  NOT a route table. This is a demo-order list for one long vertical scroll canvas.
  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.

  Movement is by per-screen TRIGGER POINTS, not a floating nav (see ScreenShell):
  every artboard carries a "previous" and a "next" affordance in its own margin.
  `actions` still maps a click on a real in-screen button/link (by visible text)
  to a target id, for when a screen's own CTA should advance the demo.
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
