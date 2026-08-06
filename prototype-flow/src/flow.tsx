/*
  Markelo prototype flow, Institution & governance.
  Supersedes flow-auth-dashboards.tsx (archived 2026-08-06 with the tag
  archive/auth-dashboards-flow).

  NOT a route table. This is a demo-order list for the scroll canvas.

  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.
  The order tells the governance story: establish the institution (profile and
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

/*
  There was a <Flat> wrapper here, opting every app-shell screen into the flat
  sidebar while 5179 kept the nested tree. Flat is now the scaffold's default,
  so both builds render it and the wrapper only implied a difference that no
  longer exists. Removed rather than left in: two mechanisms for one behaviour
  is how the next person ends up changing the wrong one.
*/

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "governance";
  el: React.ReactNode;
  actions?: FlowAction[];
  /** Loading/transient screens: any click advances. */
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