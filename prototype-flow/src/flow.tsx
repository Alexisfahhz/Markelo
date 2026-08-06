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
import { NavVariantProvider } from "../../webapp-scaffold/src/ui/shell";

/*
  Every app-shell screen is wrapped so its sidebar renders flat and its
  category's destinations move into a tab row. The wrapper lives here, in the
  prototype, and not in the scaffold: 5179 must keep the nested tree.
*/
const Flat = ({ children }: { children: React.ReactNode }) => (
  <NavVariantProvider value="flat">{children}</NavVariantProvider>
);

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
    el: (
      <Flat>
        <AD.InstitutionSetup />
      </Flat>
    ),
  },
  {
    id: "admin-settings",
    label: "Admin Settings",
    group: "governance",
    el: (
      <Flat>
        <ST.AdminSettings />
      </Flat>
    ),
  },
  {
    id: "audit-trail",
    label: "Audit Trail",
    group: "governance",
    el: (
      <Flat>
        <AD.AuditTrail />
      </Flat>
    ),
  },
  {
    id: "result-correction",
    label: "Result Correction",
    group: "governance",
    el: (
      <Flat>
        <AD.ResultCorrection />
      </Flat>
    ),
    actions: [
      { match: "Correct", to: "result-correction-editing" },
    ],
  },
  {
    id: "result-correction-editing",
    label: "Result Correction, Editing",
    group: "governance",
    el: (
      <Flat>
        <AD.ResultCorrectionEditing />
      </Flat>
    ),
    actions: [
      { match: "Save correction and re-lock", to: "result-correction" },
      { match: "Cancel, re-lock unchanged", to: "result-correction" },
    ],
  },
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}