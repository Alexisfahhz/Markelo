/*
  Markelo prototype flow, Exam Setup · Student Data · Triage & Review.
  Supersedes flow-booklet-scanning.tsx (archived 2026-08-07 with the tag
  archive/booklet-scanning-flow).

  NOT a route table. This is a demo-order list for the scroll canvas.

  Every screen is imported live from webapp-scaffold/src/screens/*, zero copies.

  Three-chapter narrative:
    1. Exam Setup (Exam Officer)         — create the exam record, define the
       marking scheme.
    2. Student Data & Results (Exam Officer) — upload the cohort, look up
       identities, process and export results.
    3. Triage & Review        (Exam Officer, Moderator) — triage scanning
       exceptions, moderate marked scripts side by side.

  `actions` maps a click on a button/link (matched by its visible text,
  case-insensitive substring) to the id it smooth-scrolls to. Unmapped
  buttons do nothing, which is correct for a presentation prototype.
*/
import React from "react";
import * as EX from "../../webapp-scaffold/src/screens/exam";
import * as SD from "../../webapp-scaffold/src/screens/studentdata";
import * as TQ from "../../webapp-scaffold/src/screens/triage";

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "exam" | "student" | "triage";
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

  /* ======================================= Chapter 3: Triage & Review */
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
