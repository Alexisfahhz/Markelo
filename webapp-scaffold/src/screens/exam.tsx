/*
  Phase 3, Exam setup (Designer 3): Marking Scheme Setup.

  Source: PRD v3.4 §9.4; User Story D1; week plan 27 July, "Designer 3, Exam
  setup".

  V1 is deliberately simple: question number and maximum mark only. There is
  no rubric builder, do not add one. Story D1 sets two hard rules, both
  designed here:
    1. Marking cannot begin until a scheme with at least one question exists.
       See MarkingSchemeSetupEmpty.
    2. A mark entered against a question can never exceed that question's
       defined maximum. Enforced live in the Marking Interface (Phase 4, not
       yet built), but the rule already governs what a valid scheme looks
       like here: a question cannot be saved with a maximum of zero.

  Every screen ships five states: default, empty, loading, error,
  permission-denied. A screen with only a default state is 20% done.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import {
  Button, Card, CardHeader, Badge, Notice, Input, Field, Select, EmptyState,
} from "../ui/kit";
import { ROLES } from "../roles";
import { ListChecks, Plus, X, Check, RotateCcw, CircleCheck, Building2, CalendarDays, User } from "lucide-react";

type Row = { q: number; max: number | ""; invalid?: string };

const ROWS: Row[] = [
  { q: 1, max: 20 },
  { q: 2, max: 15 },
  { q: 3, max: 15 },
  { q: 4, max: 20 },
  { q: 5, max: 15 },
  { q: 6, max: 15 },
];

const TOTAL = ROWS.reduce((sum, r) => sum + (typeof r.max === "number" ? r.max : 0), 0);
const HAS_INVALID = ROWS.some((r) => r.invalid);

function QuestionRow({ row }: { row: Row }) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-3 last:border-0">
      <span className="w-24 shrink-0 text-body font-medium text-text">Question {row.q}</span>
      <div className="w-28">
        <Input
          type="number"
          min={1}
          defaultValue={row.max === "" ? undefined : row.max}
          placeholder="Max"
          invalid={!!row.invalid}
          aria-label={`Maximum mark for question ${row.q}`}
        />
      </div>
      <span className="text-caption text-muted">marks</span>
      {row.invalid && <span className="text-caption text-error">{row.invalid}</span>}
      <Button
        variant="ghost"
        size="sm"
        icon={X}
        className="ml-auto"
        aria-label={`Remove question ${row.q}`}
      />
    </div>
  );
}

/* ---------------------------------------------- 0. Exam Creation (PRD §10 step 1) */

export function ExamCreationScreen() { return <ExamCreationScreenDefault />; }

function ExamCreationScreenDefault() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Exams" title="Create an exam" sub="Set up a new exam record so Markelo knows what it is marking">
      <div className="flex gap-0 max-lg:flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
        <div className="flex flex-1 flex-col gap-6 px-8 py-6 max-lg:max-w-none" style={{ maxWidth: "min(703px, 100%)" }}>
          <Notice tone="brand" title="Create the record first, everything else follows">
            The marking scheme and student list are attached to this exam record. Create it once, then
            set those up, and scanning can begin.
          </Notice>

          <Card>
            <CardHeader title="New exam" sub="Every field must be filled before the record can be created" />
            <div className="flex flex-col gap-4">
              <Field label="Course" required>
                <Select defaultValue="csc401">
                  <option value="csc401">CSC 401 Compiler Construction</option>
                  <option value="csc312">CSC 312 Operating Systems</option>
                  <option value="mth201">MTH 201 Linear Algebra</option>
                </Select>
              </Field>
              <Field label="Exam type" required>
                <Select defaultValue="first">
                  <option value="first">First Semester</option>
                  <option value="second">Second Semester</option>
                  <option value="resit">Resit</option>
                </Select>
              </Field>
              <Field label="Academic session" required>
                <Select defaultValue="2526">
                  <option value="2526">2025/2026</option>
                  <option value="2425">2024/2025</option>
                  <option value="2324">2023/2024</option>
                </Select>
              </Field>
              <Field label="Lecturer in charge" required>
                <Select defaultValue="balogun">
                  <option value="balogun">Dr. Balogun Salami</option>
                  <option value="ade">Dr. Ade Ogunlana</option>
                  <option value="nneka">Prof. Nneka Chukwu</option>
                </Select>
              </Field>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="xl" full>Cancel</Button>
            <Button size="xl" full icon={Check}>Create exam</Button>
          </div>
        </div>

        <div className="flex w-[407px] shrink-0 flex-col border-l border-border bg-white max-lg:w-full max-lg:border-l-0 max-lg:border-t">
          <div className="flex flex-col gap-6 px-8 py-6">
            <div>
              <h3 className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-text">Exam setup checklist</h3>
              <p className="text-[12px] leading-[18px] text-muted">What still needs doing after the record is created</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <CircleCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-success" aria-hidden />
                <div>
                  <p className="text-[13px] font-medium leading-5 text-text">Booklet profile</p>
                  <p className="text-caption text-muted">Already configured. Every exam at Yaba College of Technology uses the same booklet.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CircleCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-success" aria-hidden />
                <div>
                  <p className="text-[13px] font-medium leading-5 text-text">Course and lecturer</p>
                  <p className="text-caption text-muted">Fill in the form. Both must be on record for the exam to proceed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-muted" aria-hidden />
                <div>
                  <p className="text-[13px] font-medium leading-5 text-text">Marking scheme</p>
                  <p className="text-caption text-muted">Add question numbers and maximum marks once the exam record exists.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-muted" aria-hidden />
                <div>
                  <p className="text-[13px] font-medium leading-5 text-text">Student list</p>
                  <p className="text-caption text-muted">Upload the full cohort spreadsheet after the marking scheme is confirmed.</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-brand-light p-4">
              <div className="flex items-start gap-3">
                <CircleCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-[12px] font-semibold leading-4 text-text">What happens next</p>
                  <p className="mt-1 text-[12px] leading-[18px] text-muted">
                    Creating the exam record is step one. Markelo then guides you through setting a
                    marking scheme and uploading the student cohort so scanning can begin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function ExamCreationScreenEmpty() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Exams" title="Create an exam" sub="Set up a new exam record">
      <Notice tone="error" title="No courses exist yet">
        There is nothing to create an exam for. An Institution Admin needs to add at least one course
        before an exam record can be created.
      </Notice>
      <div className="mt-6">
        <EmptyState
          icon={Building2}
          title="No courses are on record"
          body="Courses are managed by the Institution Admin under Courses. Once a course is added, you can create an exam record for it here."
        />
      </div>
    </AppFrame>
  );
}

export function ExamCreationScreenLoading() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Exams" title="Create an exam" sub="Setting up your exam record…">
      <div className="flex max-w-2xl flex-col gap-6">
        <Card>
          <div className="flex flex-col gap-3">
            <div className="h-5 w-48 animate-pulse rounded bg-bg" />
            <div className="h-4 w-64 animate-pulse rounded bg-bg" />
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded bg-bg" />
            ))}
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

export function ExamCreationScreenError() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Exams" title="Create an exam" sub="Set up a new exam record">
      <div className="max-w-2xl">
        <Notice tone="error" title="Could not create the exam">
          Something went wrong saving this record. Nothing you entered has been lost. Check your
          connection and try again.
        </Notice>
        <div className="mt-4">
          <Button variant="secondary" icon={RotateCcw}>Try again</Button>
        </div>
      </div>
    </AppFrame>
  );
}

export function ExamCreationScreenDenied() {
  return (
    <AppFrame role={ROLES.ta} activeLabel="Exams" title="Create an exam" sub="Set up a new exam record">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Exam Officers and Institution Admins can create exam records.
      </Notice>
    </AppFrame>
  );
}

/* ------------------------------------------------ 1. Marking Scheme Setup */

export function MarkingSchemeSetup() { return <MarkingSchemeSetupDefault />; }

function MarkingSchemeSetupDefault() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Marking scheme" title="Marking scheme" sub="Set the maximum mark for each question">
      <div className="flex gap-0 max-lg:flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
        <div className="flex flex-1 flex-col gap-6 px-8 py-6 max-lg:max-w-none" style={{ maxWidth: "min(703px, 100%)" }}>
          <Notice tone="brand" title="No rubric builder in V1">
            Set only the question number and its maximum mark. Marking cannot begin until every
            question has a mark greater than zero.
          </Notice>
          <Card>
            <CardHeader
              title="CSC 401, first semester exam"
              sub="Compiler Construction"
              action={<Badge tone="neutral">{ROWS.length} questions, {TOTAL} marks</Badge>}
            />
            <div className="flex flex-col">
              {ROWS.map((r) => <QuestionRow key={r.q} row={r} />)}
            </div>
            <div className="mt-4">
              <Button variant="secondary" icon={Plus}>Add question</Button>
            </div>
          </Card>
          {HAS_INVALID && (
            <Notice tone="warning" title="One question is missing a maximum mark">
              Fix question 5 before you can confirm this scheme. Every question needs a mark greater
              than zero.
            </Notice>
          )}
          <div className="flex items-center justify-between">
            <p className="text-body text-muted">Total across all questions: <span className="font-medium text-text tabular-nums">{TOTAL} marks</span></p>
            <div className="flex items-center gap-3">
              <Button variant="secondary">Cancel</Button>
              <Button icon={Check} disabled={HAS_INVALID}>Confirm scheme</Button>
            </div>
          </div>
        </div>

        <div className="flex w-[407px] shrink-0 flex-col border-l border-border bg-white max-lg:w-full max-lg:border-l-0 max-lg:border-t">
          <div className="flex flex-col gap-6 px-8 py-6">
            <div>
              <h3 className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-text">Scheme summary</h3>
              <p className="text-[12px] leading-[18px] text-muted">What this scheme tells every marker before they begin</p>
            </div>

            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[36px] font-bold leading-[44px] tabular-nums text-brand">{ROWS.length}</span>
                  <p className="text-[12px] leading-[18px] text-muted">questions</p>
                </div>
                <div>
                  <span className="text-[36px] font-bold leading-[44px] tabular-nums text-brand">{TOTAL}</span>
                  <p className="text-[12px] leading-[18px] text-muted">total marks</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold leading-4 tracking-[-0.01em] text-text">Marks at a glance</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {ROWS.map((r) => (
                  <div key={r.q} className="flex items-center justify-between rounded-md border border-border bg-bg px-3 py-2">
                    <span className="text-[13px] leading-5 text-text">Question {r.q}</span>
                    <span className={`text-[13px] font-medium leading-5 tabular-nums ${r.invalid ? "text-error" : "text-text"}`}>
                      {r.max === "" ? <span className="text-error">—</span> : <>{r.max} marks</>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-brand-light p-4">
              <div className="flex items-start gap-3">
                <CircleCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-[12px] font-semibold leading-4 text-text">Marking rules enforced by this scheme</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    <li className="flex items-start gap-2 text-[12px] leading-[18px] text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden />
                      A marker can never enter a mark higher than its question's maximum.
                    </li>
                    <li className="flex items-start gap-2 text-[12px] leading-[18px] text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden />
                      Marking cannot begin until a scheme with at least one question exists.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function MarkingSchemeSetupEmpty() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Marking scheme" title="Marking scheme" sub="Set the maximum mark for each question">
      <div className="max-w-2xl">
        <Notice tone="error" title="Marking cannot begin until a scheme exists">
          This exam has no marking scheme. Add at least one question and its maximum mark before
          scripts can be assigned to a marker.
        </Notice>
        <div className="mt-6">
          <EmptyState
            icon={ListChecks}
            title="No questions yet"
            body="Add the first question and its maximum mark. You can add the rest, or come back and edit them, at any time before marking starts."
            action={<Button icon={Plus}>Add the first question</Button>}
          />
        </div>
      </div>
    </AppFrame>
  );
}

export function MarkingSchemeSetupLoading() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Marking scheme" title="Marking scheme" sub="Loading this exam's marking scheme…">
      <div className="max-w-2xl">
        <Card>
          <div className="flex flex-col gap-3">
            <div className="h-5 w-56 animate-pulse rounded bg-bg" />
            <div className="h-4 w-40 animate-pulse rounded bg-bg" />
            <div className="mt-3 flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded bg-bg" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

export function MarkingSchemeSetupError() {
  return (
    <AppFrame role={ROLES.officer} activeLabel="Marking scheme" title="Marking scheme" sub="Set the maximum mark for each question">
      <div className="max-w-2xl">
        <Notice tone="error" title="Could not save the marking scheme">
          Your changes were not saved. Check your connection and try again. Nothing you entered has
          been lost.
        </Notice>
        <div className="mt-4">
          <Button variant="secondary" icon={RotateCcw}>Try again</Button>
        </div>
      </div>
    </AppFrame>
  );
}

export function MarkingSchemeSetupDenied() {
  return (
    <AppFrame role={ROLES.ta} activeLabel="Marking scheme" title="Marking scheme" sub="Set up an exam's marking scheme">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Exam Officers and Lecturers can set up a marking scheme.
      </Notice>
    </AppFrame>
  );
}
