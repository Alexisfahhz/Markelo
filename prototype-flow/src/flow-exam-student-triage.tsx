/*
  MARKELO PROTOTYPE FLOW — ARCHIVED.
  Exam Setup · Student Data · Triage & Review (+ Scanning), 4 chapters, 11 artboards.
  Archived 2026-08-10 with the tag archive/exam-student-triage-flow.

  History note: commit e6f5fee (2026-08-10) replaced flow.tsx with the
  Institution & governance + Booklet profile build and this registry was
  deleted WITHOUT an archive file or tag at the time, even though that
  commit's own header claimed otherwise. Restored verbatim from git history
  (e6f5fee^) on 2026-08-23 so the archive pattern holds again. The tag marks
  the restore commit; the registry itself is unchanged from its last live
  state.

  This file is kept so these chapters can be re-activated or referenced by
  importing from here instead of flow.tsx. To re-activate: reverse the import
  in App.tsx, re-point index.html title, and re-tag.

  NOT a route table. This is a demo-order list for the scroll canvas.

  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.

  Four-chapter narrative:
    1. Exam Setup (Exam Officer)         — create the exam record, define the
       marking scheme.
    2. Student Data & Results (Exam Officer) — upload the cohort, look up
       identities, process and export results.
    3. Scanning        (Exam Officer)    — upload a batch with booklet preview.
    4. Triage & Review (Exam Officer, Moderator) — triage scanning exceptions,
       moderate marked scripts side by side.

  `actions` maps a click on a button/link (matched by its visible text,
  case-insensitive substring) to the id it smooth-scrolls to. Unmapped
  buttons do nothing, which is correct for a presentation prototype.
*/
import React from "react";
import * as EX from "../../webapp-scaffold/src/screens/exam";
import * as SD from "../../webapp-scaffold/src/screens/studentdata";
import * as SC from "../../webapp-scaffold/src/screens/scanning";
import * as TQ from "../../webapp-scaffold/src/screens/triage";

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "exam" | "student" | "scanning" | "triage";
  el: React.ReactNode;
  actions?: FlowAction[];
  advanceAnywhereTo?: string;
};

export const FLOW: (FlowScreen | { chapter: string })[] = [
  /* ============================================= Chapter 1: Exam Setup */
  { chapter: "Exam Setup" },
  {
    id: "exam-creation",
    label: "Exam Creation",
    group: "exam",
    el: <EX.ExamCreationScreen />,
    actions: [
      { match: "Create exam", to: "marking-scheme" },
    ],
  },
  {
    id: "marking-scheme",
    label: "Marking Scheme Setup",
    group: "exam",
    el: <EX.MarkingSchemeSetup />,
    actions: [
      { match: "Confirm scheme", to: "student-upload" },
    ],
  },

  /* ================================== Chapter 2: Student Data & Results */
  { chapter: "Student Data & Results" },
  {
    id: "student-upload",
    label: "Student Data Upload",
    group: "student",
    el: <SD.StudentDataUpload />,
    // Confirm student list is disabled; advance via nav.
  },
  {
    id: "identity-registry",
    label: "Identity Registry",
    group: "student",
    el: <SD.IdentityRegistry />,
  },
  {
    id: "result-processing",
    label: "Result Processing",
    group: "student",
    el: <SD.ResultProcessing />,
  },

  /* ============================================== Chapter 3: Scanning */
  /*
    Placed immediately before Triage & Review because it is what produces the
    exceptions that chapter triages. This screen was built and then reachable
    in neither app: it was registered only in two archived flows, so it was
    invisible on 5180 and absent from the 5179 harness. Added to both on
    KingFizzy's instruction, 2026-08-10.
  */
  { chapter: "Scanning" },
  {
    id: "scan-batch-with-preview",
    label: "Scan Batch Upload, Booklet Preview",
    group: "scanning",
    el: <SC.ScanBatchUploadWithPreview />,
  },

  /* ======================================= Chapter 4: Triage & Review */
  { chapter: "Triage & Review" },
  {
    id: "exception-queue",
    label: "Exception Queue, Pilot",
    group: "triage",
    el: <TQ.ExceptionQueuePilot />,
    actions: [
      { match: "Open and resolve", to: "exception-resolve" },
    ],
  },
  {
    id: "exception-resolve",
    label: "Exception Queue, Resolve",
    group: "triage",
    el: <TQ.ExceptionQueueResolve />,
  },
  {
    id: "moderation",
    label: "Moderation Workspace",
    group: "triage",
    el: <TQ.ModerationWorkspace />,
  },
  {
    id: "moderation-changed",
    label: "Moderation Workspace, Changed",
    group: "triage",
    el: <TQ.ModerationWorkspaceChanged />,
  },
  {
    id: "moderation-return",
    label: "Moderation Workspace, Return",
    group: "triage",
    el: <TQ.ModerationWorkspaceReturn />,
  },
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
