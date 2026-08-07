/*
  ARCHIVED 2026-08-07 as flow-booklet-scanning.tsx (tag archive/booklet-scanning-flow).
  The live flow is now in flow.tsx.

  Markelo prototype flow, Booklet Profile & Scanning workflow.
  Superseded flow-governance.tsx (archived 2026-08-06 with the tag
  archive/governance-flow).

  NOT a route table. This is a demo-order list for the scroll canvas.

  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.

  Two-chapter narrative:
    1. Booklet Profile (Institution Admin) — teach Markelo what your answer
       booklet looks like, validate the detection, version it.
    2. Scanning        (Exam Officer)    — upload a batch, watch AI process it,
       get the integrity report, triage exceptions.

  `actions` maps a click on a button/link (matched by its visible text,
  case-insensitive substring) to the id it smooth-scrolls to. Unmapped
  buttons do nothing, which is correct for a presentation prototype.
*/
import React from "react";
import * as AD from "../../webapp-scaffold/src/screens/admin";
import * as SC from "../../webapp-scaffold/src/screens/scanning";
import * as TQ from "../../webapp-scaffold/src/screens/triage";

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "booklet" | "scanning";
  el: React.ReactNode;
  actions?: FlowAction[];
  advanceAnywhereTo?: string;
};

export const FLOW: (FlowScreen | { chapter: string })[] = [
  /* ============================================ Chapter 1: Booklet Profile */
  { chapter: "Booklet Profile" },
  {
    id: "booklet-setup",
    label: "Booklet Profile Setup",
    group: "booklet",
    el: <AD.BookletProfileSetup />,
    actions: [
      { match: "Validate this profile", to: "booklet-validation" },
    ],
  },
  {
    id: "booklet-validation",
    label: "Booklet Profile Validation",
    group: "booklet",
    el: <AD.BookletProfileValidation />,
    actions: [
      { match: "Mark as ready to use", to: "booklet-versions" },
    ],
  },
  {
    id: "booklet-versions",
    label: "Booklet Profile Versioning",
    group: "booklet",
    el: <AD.BookletProfileVersioning />,
  },

  /* =============================================== Chapter 2: Scanning */
  { chapter: "Scanning" },
  {
    id: "scan-upload",
    label: "Scan Batch Upload",
    group: "scanning",
    el: <SC.ScanBatchUpload />,
    actions: [
      { match: "Start processing", to: "ai-processing" },
    ],
  },
  {
    id: "scan-upload-preview",
    label: "Scan Batch Upload, Booklet Preview",
    group: "scanning",
    el: <SC.ScanBatchUploadWithPreview />,
    actions: [
      { match: "Start processing", to: "ai-processing" },
    ],
  },
  {
    id: "ai-processing",
    label: "AI Processing",
    group: "scanning",
    el: <SC.IntegrityReport />,
    actions: [
      { match: "Open in exception queue", to: "exception-queue" },
    ],
  },
  {
    id: "integrity-report",
    label: "Integrity Report",
    group: "scanning",
    el: <SC.IntegrityReportComplete />,
    actions: [
      { match: "Review the 3 flagged", to: "exception-queue" },
    ],
  },
  {
    id: "exception-queue",
    label: "Exception Queue, Pilot",
    group: "scanning",
    el: <TQ.ExceptionQueuePilot />,
    actions: [
      { match: "Open and resolve", to: "exception-resolve" },
    ],
  },
  {
    id: "exception-resolve",
    label: "Exception Queue, Resolve",
    group: "scanning",
    el: <TQ.ExceptionQueueResolve />,
  },
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
