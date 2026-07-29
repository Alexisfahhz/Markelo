/*
  Mock data for the preview only, realistic Nigerian university values
  per the PRD personas. Marking-facing data carries NO identity (Script
  IDs like MK-000245 only); identity lives on the officer-only roster.
*/

import type { BadgeKind } from "./components/primitives";

export type ScriptRow = {
  scriptId: string;
  questionsMarked: number;
  questionsTotal: number;
  status: BadgeKind;
  flagged: boolean;
};

// Marking queue, anonymous. This is what a Lecturer/TA ever sees.
export const scripts: ScriptRow[] = [
  { scriptId: "MK-000341", questionsMarked: 5, questionsTotal: 5, status: "graded", flagged: false },
  { scriptId: "MK-000342", questionsMarked: 3, questionsTotal: 5, status: "in-progress", flagged: false },
  { scriptId: "MK-000343", questionsMarked: 0, questionsTotal: 5, status: "not-started", flagged: false },
  { scriptId: "MK-000344", questionsMarked: 2, questionsTotal: 5, status: "flagged", flagged: true },
  { scriptId: "MK-000345", questionsMarked: 5, questionsTotal: 5, status: "graded", flagged: false },
  { scriptId: "MK-000346", questionsMarked: 4, questionsTotal: 5, status: "missing", flagged: false },
];

// Scan-batch processing, Exam Officer view, control-sheet detection.
export type ScanRow = { tracking: string; pages: number; status: BadgeKind; confidence: number | null };
export const scanBatch: ScanRow[] = [
  { tracking: "MK-000341", pages: 8, status: "graded", confidence: 98 },
  { tracking: "MK-000342", pages: 7, status: "graded", confidence: 96 },
  { tracking: "MK-000343", pages: 9, status: "pending", confidence: 74 },
  { tracking: "MK-000344", pages: 6, status: "missing", confidence: 61 },
];

// Student roster, OFFICER-ONLY. Includes one deliberately-flawed row
// (duplicate matric) so the validation-report state has something to show,
// exactly as Demo Mode requires.
export type RosterRow = {
  name: string;
  matric: string;
  department: string;
  issue: string | null;
};
export const roster: RosterRow[] = [
  { name: "Chidiebere Okonkwo", matric: "CSC/2025/001", department: "Computer Science", issue: null },
  { name: "Fatima Aliyu", matric: "CSC/2025/002", department: "Computer Science", issue: null },
  { name: "Oluwaseun Adeyemi", matric: "CSC/2025/002", department: "Computer Science", issue: "Duplicate matric number (row 2)" },
  { name: "Ngozi Eze", matric: "CSC/2025/004", department: "", issue: "Missing department" },
  { name: "Ibrahim Sani", matric: "CSC/2025/005", department: "Computer Science", issue: null },
];

export const courses = [
  "CSC401, Operating Systems",
  "CSC403, Compiler Construction",
  "CSC405, Computer Networks",
  "MTH301, Real Analysis",
];

export const lecturers = ["Dr. Balogun", "Dr. Adaeze Nwosu", "Prof. Eze", "Dr. Yakubu Musa"];
