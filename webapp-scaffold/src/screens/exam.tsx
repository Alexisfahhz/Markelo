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
  Button, Card, CardHeader, Badge, Notice, Input, Field, EmptyState,
} from "../ui/kit";
import { ROLES } from "../roles";
import { ListChecks, Plus, X, Check, RotateCcw } from "lucide-react";

type Row = { q: number; max: number | ""; invalid?: string };

const ROWS: Row[] = [
  { q: 1, max: 20 },
  { q: 2, max: 15 },
  { q: 3, max: 15 },
  { q: 4, max: 20 },
  { q: 5, max: "", invalid: "Enter a mark greater than zero" },
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

/* ------------------------------------------------ 1. Marking Scheme Setup */

export function MarkingSchemeSetup() { return <MarkingSchemeSetupDefault />; }

function MarkingSchemeSetupDefault() {
  return (
    <AppFrame role={ROLES.officer} title="Marking scheme" sub="Set the maximum mark for each question">
      <div className="flex flex-col gap-6 max-w-2xl">
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
    </AppFrame>
  );
}

export function MarkingSchemeSetupEmpty() {
  return (
    <AppFrame role={ROLES.officer} title="Marking scheme" sub="Set the maximum mark for each question">
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
    <AppFrame role={ROLES.officer} title="Marking scheme" sub="Loading this exam's marking scheme…">
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
    <AppFrame role={ROLES.officer} title="Marking scheme" sub="Set the maximum mark for each question">
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
    <AppFrame role={ROLES.ta} title="Marking scheme" sub="Set up an exam's marking scheme">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Exam Officers and Lecturers can set up a marking scheme.
      </Notice>
    </AppFrame>
  );
}
