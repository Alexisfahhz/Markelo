/*
  MARKELO PROTOTYPE FLOW — ARCHIVED.
  Superseded 2026-08-06 by flow.tsx (Booklet Profile & Scanning workflow).
  Git tag: archive/governance-flow.

  This file is kept so the governance screens can be restored by importing
  from here instead of flow.tsx. To re-activate: reverse the import in
  App.tsx, re-point index.html title, and re-tag.

  NOT a route table. This is a demo-order list for the scroll canvas.

  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.
  The order told the governance story: establish the institution (profile and
  people), settings and security, accountability through the audit trail, and
  the controlled correction of locked results.

  `actions` maps a click on a button/link (matched by its visible text,
  case-insensitive substring) to the id it smooth-scrolls to. Unmapped
  buttons do nothing, which is correct for a presentation prototype.
*/
import React from "react";
import * as AD from "../../webapp-scaffold/src/screens/admin";
import * as ST from "../../webapp-scaffold/src/screens/settings";
import * as SC from "../../webapp-scaffold/src/screens/scanning";

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "governance";
  el: React.ReactNode;
  actions?: FlowAction[];
  advanceAnywhereTo?: string;
};

export const FLOW: FlowScreen[] = [
  /* ---------------------------------------------- Institution & governance */
  {
    id: "institution-setup",
    label: "Institution Setup",
    group: "governance",
    el: <AD.InstitutionSetup />,
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
    actions: [
      { match: "Correct", to: "result-correction-editing" },
    ],
  },
  {
    id: "result-correction-editing",
    label: "Result Correction, Editing",
    group: "governance",
    el: <AD.ResultCorrectionEditing />,
    actions: [
      { match: "Save correction and re-lock", to: "result-correction" },
      { match: "Cancel, re-lock unchanged", to: "result-correction" },
    ],
  },
  {
    id: "scan-batch-upload",
    label: "Scan Batch Upload",
    group: "governance",
    el: <SC.ScanBatchUpload />,
  },
  {
    id: "scan-batch-with-preview",
    label: "Scan Batch Upload, Booklet Preview",
    group: "governance",
    el: <SC.ScanBatchUploadWithPreview />,
  },
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
