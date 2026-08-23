/*
  Markelo prototype flow, active build: Exam Setup · Student Data & Results ·
  Scanning · Triage & Review. Re-activated 2026-08-23 on KingFizzy's request,
  replacing Institution & governance + Booklet profile (archived as
  flow-institution-booklet.tsx, tag archive/institution-booklet-flow).

  Provenance: this registry first went live 2026-08-07 and was deleted by
  e6f5fee on 2026-08-10 without an archive file or tag, despite that commit
  claiming otherwise. It was recovered verbatim from git history as
  flow-exam-student-triage.tsx earlier on 2026-08-23; this file is that
  registry unchanged, now live again.

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

  Four-chapter narrative:
    1. Exam Setup (Exam Officer)             — create the exam record, define the
       marking scheme.
    2. Student Data & Results (Exam Officer) — upload the cohort, look up
       identities, process and export results.
    3. Scanning        (Exam Officer)       — upload a batch with booklet preview.
    4. Triage & Review (Exam Officer, Moderator) — triage scanning exceptions,
       moderate marked scripts side by side.
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
    // Confirm student list is disabled; advance via trigger point.
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
