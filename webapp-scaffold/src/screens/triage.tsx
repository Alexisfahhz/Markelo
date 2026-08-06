/*
  Triage and review. Designer 6's flow in the week plan.
  Exception Queue (stories B3, B4, B5; PRD v3.4 §9.2.1)
  Moderation Workspace (story F1; PRD v3.4 §9.7)

  Both screens are the same shape: a queue of things a human has to decide on.
  They are in one file so the pattern cannot drift between them.

  Load-bearing criteria, each one shapes the layout:

  B4  Two modes are required. During the pilot EVERY script needs human
      confirmation whatever score Markelo reports, because the confidence
      thresholds in §9.2.1 are an unvalidated target. Normal mode shows only
      flagged scripts. Pilot mode is the CURRENT reality, so it is the default.

  B5  Every entry states its specific reason, never just "needs review", and
      resolving an entry removes it from the queue at once. The three ways out
      are: confirm the suggested match, pick a different student, or send it to
      manual entry.

  B3  An extra sheet NEVER starts a new script. A mismatch between an extra
      sheet and its cover page arrives here rather than being guessed either
      way. That is why one reason string names exactly that case.

  F1  Original and moderated marks side by side. Returning requires a stated
      reason. If the moderator changes a score and approves, the moderated score
      becomes the score of record and the original is kept permanently.

  Identity, and this is a real decision worth checking:
  the queue LIST shows Script IDs only. A candidate student identity appears
  only inside the resolve panel, because B5 requires the officer to confirm or
  change a match and that is impossible without seeing who. That reveal is
  presented as a logged lookup. Moderation never shows a student at all: it is
  a marking-facing surface, so rule 1 applies and only the Script ID appears.
  The marker's name does appear in moderation, which F2 requires for disputes.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import { Button, Card, CardHeader, Badge, Notice, Field, Input, Select, EmptyState, Progress, ScriptId, Table, Td } from "../ui/kit";
import { ROLES } from "../roles";
import {
  ListChecks, TriangleAlert, FileWarning, CircleCheck, Copy, ScanLine,
  UserSearch, PenLine, Keyboard, Check, RotateCcw, Undo2, ShieldCheck,
  Lock, Eye, Layers,
} from "lucide-react";

/* ------------------------------------------------------------------ shared */

/*
  Two-option mode switch. The component library has no segmented control or
  navigation component yet, so this is local and flagged rather than invented
  as a system component.
*/
function ModeSwitch({ mode }: { mode: "pilot" | "normal" }) {
  const base = "h-10 flex-1 rounded-control px-4 text-body font-medium transition-colors";
  const on = "bg-brand text-white";
  const off = "bg-white text-text border border-border hover:bg-brand-light";
  return (
    <div
      role="group"
      aria-label="Which scripts to show"
      className="flex gap-2 rounded-control bg-bg p-1"
    >
      <button type="button" className={`${base} ${mode === "pilot" ? on : off}`}>
        Pilot: confirm every script
      </button>
      <button type="button" className={`${base} ${mode === "normal" ? on : off}`}>
        Normal: flagged only
      </button>
    </div>
  );
}

const EXAM_SUB = "CSC 401 Compiler Construction, 2025/2026 First Semester";

/* ==================================== 1. Exception Queue (B3, B4, B5) */

type Reason =
  | { kind: "extra-sheet"; text: string }
  | { kind: "unreadable"; text: string }
  | { kind: "missing"; text: string }
  | { kind: "duplicate"; text: string }
  | { kind: "no-cover"; text: string };

type Entry = {
  id: string;
  pages: number;
  reason: Reason | null;   // null means nothing flagged, pilot mode only
  suggestion?: string;     // what Markelo thinks the match is, never a name
};

const REASON_ICON = {
  "extra-sheet": Layers,
  "unreadable": ScanLine,
  "missing": FileWarning,
  "duplicate": Copy,
  "no-cover": TriangleAlert,
} as const;

/* Every string here is a specific stated reason. None of them says "needs review". */
const FLAGGED: Entry[] = [
  {
    id: "MK-000247",
    pages: 12,
    reason: {
      kind: "extra-sheet",
      text: "An extra sheet in this script carries different identity details from the cover page. The extra sheet has not been used to start a new script.",
    },
    suggestion: "Cover page match, 96% confident",
  },
  {
    id: "MK-000251",
    pages: 8,
    reason: {
      kind: "unreadable",
      text: "The matric number on the cover page could not be read. The handwriting was too faint for Markelo to be sure of two digits.",
    },
    suggestion: "Closest match on name, 71% confident",
  },
  {
    id: "MK-000249",
    pages: 6,
    reason: {
      kind: "missing",
      text: "Pages 5 and 6 are not in this batch. The script runs from page 4 straight to page 7.",
    },
  },
  {
    id: "MK-000262",
    pages: 8,
    reason: {
      kind: "duplicate",
      text: "This script gives the same matric number as MK-000238. One of the two cover pages has been read wrongly, or a booklet was scanned twice.",
    },
  },
  {
    id: "MK-000271",
    pages: 4,
    reason: {
      kind: "no-cover",
      text: "No cover page was found for these four pages. They may belong to another script, or the cover page may not have been scanned.",
    },
  },
];

const CLEAN: Entry[] = [
  { id: "MK-000245", pages: 8, reason: null },
  { id: "MK-000246", pages: 8, reason: null },
  { id: "MK-000248", pages: 8, reason: null },
];

function QueueShell({ children, role = ROLES.officer }: { children: React.ReactNode; role?: typeof ROLES.officer }) {
  return (
    <AppFrame role={role} activeLabel="Exception queue" title="Exception queue" sub={EXAM_SUB}>
      {children}
    </AppFrame>
  );
}

function EntryCard({ e }: { e: Entry }) {
  if (!e.reason) {
    /* Pilot mode only. Nothing was flagged, but a human still confirms it. */
    return (
      <Card className="flex items-center gap-4">
        <CircleCheck size={16} strokeWidth={2} className="shrink-0 text-success" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <ScriptId id={e.id} />
            <Badge tone="success" icon={CircleCheck}>Nothing flagged</Badge>
          </div>
          <p className="mt-1 text-caption text-muted">
            Cover page and all <span className="tabular-nums">{e.pages}</span> pages found. Confirm to
            release it for marking.
          </p>
        </div>
        <Button size="sm" icon={Check}>Confirm</Button>
      </Card>
    );
  }

  const Icon = REASON_ICON[e.reason.kind];
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Icon size={16} strokeWidth={2} className="mt-1 shrink-0 text-warning" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <ScriptId id={e.id} />
              <Badge tone="warning" icon={TriangleAlert}>Needs a decision</Badge>
              <span className="text-caption text-muted">
                <span className="tabular-nums">{e.pages}</span> pages
              </span>
            </div>
            {/* B5: the specific reason, in plain language, always visible. */}
            <p className="mt-2 text-body text-text">{e.reason.text}</p>
            {e.suggestion && (
              <p className="mt-1 text-caption text-muted">Markelo suggests: {e.suggestion}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="ghost" size="sm" icon={Keyboard}>Send to manual entry</Button>
          <Button variant="secondary" size="sm" icon={UserSearch}>Pick a different student</Button>
          <Button size="sm" icon={Eye}>Open and resolve</Button>
        </div>
      </div>
    </Card>
  );
}

/*
  PILOT MODE, the default, because it is what is true today. PRD §9.2.1 states
  the confidence thresholds are an unvalidated target and story B4 carries the
  same caveat. So the queue holds every script, not only the flagged ones, and
  there is no bulk-accept-by-confidence control anywhere on this screen.
*/
export function ExceptionQueuePilot() {
  return (
    <QueueShell>
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="Pilot mode: you confirm every script">
          Markelo's accuracy has not been measured against real scripts from your institution yet.
          Until it has, every script passes through this queue, including the ones with nothing
          flagged. Normal mode will show only flagged scripts once the accuracy check is done.
        </Notice>

        <ModeSwitch mode="pilot" />

        <Card>
          <CardHeader title="Progress through this batch" sub="59 of 64 scripts confirmed" />
          <div className="flex flex-col gap-4">
            <Progress value={59} max={64} />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-muted">
              <span><span className="tabular-nums font-medium text-text">5</span> need a decision</span>
              <span><span className="tabular-nums font-medium text-text">3</span> waiting to confirm</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <p className="uppercase-label">Need a decision from you</p>
          {FLAGGED.map((e) => <EntryCard key={e.id} e={e} />)}
        </div>

        <div className="flex flex-col gap-3">
          <p className="uppercase-label">Nothing flagged, still needs confirming</p>
          {CLEAN.map((e) => <EntryCard key={e.id} e={e} />)}
        </div>
      </div>
    </QueueShell>
  );
}

/* NORMAL MODE. Only flagged scripts. The end state, once accuracy is validated. */
export function ExceptionQueueNormal() {
  return (
    <QueueShell>
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="Showing flagged scripts only">
          The other 59 scripts in this batch assembled without a problem and have gone straight to
          marking. You only see the ones Markelo could not settle by itself.
        </Notice>

        <ModeSwitch mode="normal" />

        <div className="flex flex-col gap-3">
          {FLAGGED.map((e) => <EntryCard key={e.id} e={e} />)}
        </div>
      </div>
    </QueueShell>
  );
}

/*
  The resolve panel. B5's three ways out, in one place.
  This is the ONLY point in the queue where a student identity is shown, because
  confirming or changing a match is impossible without it. It is framed as a
  logged lookup, the same contract as the Identity Registry (H2).
*/
export function ExceptionQueueResolve() {
  return (
    <QueueShell>
      <div className="flex max-w-3xl flex-col gap-6">
        <Notice tone="warning" title="An extra sheet does not match its cover page">
          An extra sheet in this script carries different identity details from the cover page. Markelo
          has not used it to start a new script, and it will not guess which one is right.
        </Notice>

        <Card>
          <CardHeader
            title="Script MK-000247"
            sub="12 pages, including 4 extra sheet pages"
            action={<Badge tone="warning" icon={TriangleAlert}>Needs a decision</Badge>}
          />
          <div className="flex flex-col gap-4">
            {/*
              Identity reveal. Logged, with the reason recorded, exactly like the
              Identity Registry. This is the deliberate exception to keeping
              names out of the officer's working screens.
            */}
            <Notice tone="neutral" title="Looking up this student is recorded">
              Your name, the time, and the reason below are written to the audit trail. The record
              cannot be edited or removed.
            </Notice>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-control border border-border bg-bg px-4 py-3">
                <p className="uppercase-label">On the cover page</p>
                <p className="mt-1 text-sub font-semibold text-text">Chinaza Obiora</p>
                <p className="font-mono text-caption text-muted">CSC/2025/114</p>
                <Badge tone="success" icon={CircleCheck}>96% confident</Badge>
              </div>
              <div className="rounded-control border border-border bg-bg px-4 py-3">
                <p className="uppercase-label">On the extra sheet</p>
                <p className="mt-1 text-sub font-semibold text-text">C. Obiora</p>
                <p className="font-mono text-caption text-muted">CSC/2025/174</p>
                <Badge tone="warning" icon={TriangleAlert}>Does not match</Badge>
              </div>
            </div>

            <Field label="Why are you resolving it this way?" required>
              <Input placeholder="For example: checked the register, matric ends 114" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Pick a different student instead" sub="Only if neither reading above is right" />
          <Field label="Student on this exam's list">
            <Select defaultValue="">
              <option value="">Search this exam's student list</option>
              <option value="a">Chinaza Obiora, CSC/2025/114</option>
              <option value="b">Chinaza Obiora, CSC/2025/174</option>
              <option value="c">Chidera Obiora, CSC/2025/141</option>
            </Select>
          </Field>
        </Card>

        {/* B5: resolving removes the entry from the queue at once. Say so. */}
        <p className="text-caption text-muted">
          When you resolve this, it leaves the queue straight away and the script goes for marking.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl" icon={Keyboard}>Send to manual entry</Button>
          <Button size="xl" icon={Check}>Confirm the cover page match</Button>
        </div>
      </div>
    </QueueShell>
  );
}

export function ExceptionQueueEmpty() {
  return (
    <QueueShell>
      <div className="flex flex-col gap-6">
        <ModeSwitch mode="normal" />
        <EmptyState
          icon={CircleCheck}
          title="Nothing is waiting for you"
          body="Every script in this batch assembled without a problem and has gone for marking. Anything Markelo cannot settle by itself will appear here."
        />
      </div>
    </QueueShell>
  );
}

export function ExceptionQueueLoading() {
  return (
    <QueueShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader title="Loading the queue" sub="Checking which scripts need a decision" />
          <Progress value={18} max={64} />
        </Card>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <div className="flex flex-col gap-3">
                <div className="h-4 w-32 animate-pulse rounded bg-bg" />
                <div className="h-4 w-full animate-pulse rounded bg-bg" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-bg" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </QueueShell>
  );
}

export function ExceptionQueueError() {
  return (
    <QueueShell>
      <div className="flex flex-col gap-6">
        <Notice tone="error" title="Could not load the queue" action={{ label: "Try again" }}>
          The list of flagged scripts could not be fetched. Nothing has been lost, and no script has
          been released for marking. Check your connection and try again.
        </Notice>
        <Notice tone="neutral" title="Anything you already resolved is saved">
          The 59 scripts you confirmed earlier are unaffected.
        </Notice>
      </div>
    </QueueShell>
  );
}

export function ExceptionQueueDenied() {
  return (
    <QueueShell role={ROLES.lecturer}>
      <Notice tone="error" title="You do not have permission to view this page">
        Only Exam Officers resolve flagged scripts, because doing so means looking at student identity.
        Scripts appear on your marking screen once they are resolved.
      </Notice>
    </QueueShell>
  );
}

/* ============================== 2. Moderation Workspace (F1, PRD §9.7) */

type QRow = { q: string; max: number; original: number; moderated: number };

const MARKS: QRow[] = [
  { q: "1", max: 10, original: 8, moderated: 8 },
  { q: "2", max: 10, original: 6, moderated: 6 },
  { q: "3", max: 15, original: 14, moderated: 14 },
  { q: "4", max: 15, original: 11, moderated: 11 },
  { q: "5", max: 20, original: 19, moderated: 19 },
];

const CHANGED: QRow[] = [
  { q: "1", max: 10, original: 8, moderated: 8 },
  { q: "2", max: 10, original: 6, moderated: 9 },
  { q: "3", max: 15, original: 14, moderated: 14 },
  { q: "4", max: 15, original: 11, moderated: 11 },
  { q: "5", max: 20, original: 19, moderated: 17 },
];

const sum = (rows: QRow[], k: "original" | "moderated") => rows.reduce((a, r) => a + r[k], 0);

function ModShell({ children, role = ROLES.moderator }: { children: React.ReactNode; role?: typeof ROLES.moderator }) {
  return (
    <AppFrame role={role} activeLabel="Moderation queue" title="Moderation" sub="CSC 401, sampled script 7 of 21">
      {children}
    </AppFrame>
  );
}

/*
  F1: original and moderated marks SIDE BY SIDE. Two columns, per question, with
  a difference column so a change is impossible to miss. Student identity never
  appears: moderation is marking-facing, so rule 1 applies and the Script ID is
  all the moderator gets. The MARKER is named, which F2 requires for disputes.
*/
function MarksTable({ rows }: { rows: QRow[] }) {
  const to = sum(rows, "original");
  const tm = sum(rows, "moderated");
  return (
    /*
      This was the one hand-rolled <table> left in the product: its own thead,
      its own th and td classes, drifting a little from the shared component
      every time either side was touched. It is the shared Table now, so a
      change to header padding or row borders reaches this screen too.

      No pagination, deliberately. Every other table is a list that can grow,
      so a page footer belongs on it. This one is the question breakdown for a
      single script: it is exactly as long as the paper, it ends in a Total
      row, and paging it would hide half a mark sheet from the moderator
      signing it off.
    */
    <Card pad={false}>
      <Table
        head={[
          "Question",
          { label: "Max", right: true },
          { label: "Original mark", right: true },
          { label: "Your mark", right: true },
          { label: "Difference", right: true },
        ]}
      >
        {rows.map((r) => {
          const d = r.moderated - r.original;
          return (
            <tr key={r.q}>
              <Td className="font-medium">Question {r.q}</Td>
              <Td className="text-right tabular-nums text-muted">{r.max}</Td>
              <Td className="text-right tabular-nums">{r.original}</Td>
              <Td className="text-right">
                <input
                  aria-label={`Your mark for question ${r.q}`}
                  defaultValue={r.moderated}
                  className={`h-10 w-16 rounded-control border bg-white px-3 text-right text-body tabular-nums text-text outline-none focus:border-brand ${
                    d === 0 ? "border-border-control" : "border-brand"
                  }`}
                />
              </Td>
              <Td className="text-right">
                {d === 0 ? (
                  <span className="text-caption text-muted">No change</span>
                ) : (
                  <Badge tone={d > 0 ? "success" : "error"}>
                    {d > 0 ? `Up ${d}` : `Down ${Math.abs(d)}`}
                  </Badge>
                )}
              </Td>
            </tr>
          );
        })}
        <tr className="bg-bg">
          <Td className="font-semibold">Total</Td>
          <Td className="text-right tabular-nums text-muted">70</Td>
          <Td className="text-right tabular-nums font-semibold">{to}</Td>
          <Td className="text-right tabular-nums font-semibold">{tm}</Td>
          <Td className="text-right">
            {tm === to ? (
              <span className="text-caption text-muted">No change</span>
            ) : (
              <Badge tone={tm > to ? "success" : "error"}>
                {tm > to ? `Up ${tm - to}` : `Down ${to - tm}`}
              </Badge>
            )}
          </Td>
        </tr>
      </Table>
    </Card>
  );
}

function ScriptHeader() {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div>
          <p className="uppercase-label">Script</p>
          <div className="mt-1"><ScriptId id="MK-000245" /></div>
        </div>
        <div>
          <p className="uppercase-label">Marked by</p>
          <p className="mt-1 text-body font-medium text-text">Dr. Balogun Salami</p>
        </div>
        <div>
          <p className="uppercase-label">Submitted</p>
          <p className="mt-1 text-body text-text">24 Jul 2026, 16:40</p>
        </div>
        <div className="ml-auto">
          <Badge tone="warning" icon={ShieldCheck}>Waiting for you</Badge>
        </div>
      </div>
    </Card>
  );
}

export function ModerationWorkspace() {
  return (
    <ModShell>
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="You are not told whose script this is">
          Moderation works on the Script ID, the same as marking. You can see who marked it, which is
          the point of moderation, but not who wrote it.
        </Notice>
        <ScriptHeader />
        <MarksTable rows={MARKS} />
        <Notice tone="neutral" title="Nothing is overwritten">
          If you change a mark and approve, your mark becomes the score of record and the original is
          kept permanently beside it. A dispute months from now can still show both.
        </Notice>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl" icon={Undo2}>Return to the marker</Button>
          <Button size="xl" icon={Check}>Approve this script</Button>
        </div>
      </div>
    </ModShell>
  );
}

/*
  The moderator changed two marks. F1: the moderated score becomes the score of
  record and the original is retained permanently. Both totals stay on screen
  after approval, which is what makes the record usable in a dispute.
*/
export function ModerationWorkspaceChanged() {
  const to = sum(CHANGED, "original");
  const tm = sum(CHANGED, "moderated");
  return (
    <ModShell>
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="You have changed two marks">
          Question 2 is up 3 and question 5 is down 2. Approving makes your total the score of record.
          The marker's original total stays on the record permanently.
        </Notice>
        <ScriptHeader />
        <MarksTable rows={CHANGED} />
        <Card>
          <CardHeader title="What will be recorded" sub="Both totals are kept, not just yours" />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-control border border-border bg-bg px-4 py-3">
              <p className="uppercase-label">Original, kept permanently</p>
              <p className="mt-1 text-title font-bold tabular-nums text-muted">{to}</p>
              <p className="text-caption text-muted">Dr. Balogun Salami</p>
            </div>
            <div className="rounded-control border border-brand bg-brand-light px-4 py-3">
              <p className="uppercase-label">Score of record</p>
              <p className="mt-1 text-title font-bold tabular-nums text-brand-dark">{tm}</p>
              <p className="text-caption text-muted">Your moderated total</p>
            </div>
          </div>
        </Card>
        <Field label="Why did you change these marks?" hint="This is kept with the script and can be read in a dispute.">
          <Input placeholder="For example: question 2 answer was correct but marked as incomplete" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl" icon={RotateCcw}>Undo my changes</Button>
          <Button size="xl" icon={Lock}>Approve with my marks</Button>
        </div>
      </div>
    </ModShell>
  );
}

/*
  F1: "Returning requires a stated reason." The approve button is gated on the
  reason field being filled, not decorated with a hint that it matters. An
  ungated return is the story failing quietly.
*/
export function ModerationWorkspaceReturn() {
  return (
    <ModShell>
      <div className="flex flex-col gap-6">
        <ScriptHeader />
        <Card>
          <CardHeader title="Return this script to the marker" sub="It goes back to Dr. Balogun Salami to mark again" />
          <div className="flex flex-col gap-4">
            <Notice tone="warning" title="A reason is required">
              The marker sees exactly what you write here. Say what needs looking at again, so they do
              not have to guess.
            </Notice>
            <Field label="What should the marker look at again?" required>
              <Input placeholder="For example: question 3 was marked out of 10, the scheme says 15" />
            </Field>
            <Field label="Which questions?" hint="Leave blank if the whole script needs another look.">
              <Select defaultValue="">
                <option value="">The whole script</option>
                <option value="3">Question 3 only</option>
                <option value="45">Questions 4 and 5</option>
              </Select>
            </Field>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl">Cancel</Button>
          {/* Disabled until a reason exists. F1 requires the reason, so the control enforces it. */}
          <Button size="xl" icon={Undo2} disabled>Return to the marker</Button>
        </div>
        <p className="text-caption text-muted">
          Add a reason above to enable the return. Markelo will not send a script back without one.
        </p>
      </div>
    </ModShell>
  );
}

export function ModerationWorkspaceEmpty() {
  return (
    <ModShell>
      <EmptyState
        icon={ShieldCheck}
        title="No scripts are waiting for you"
        body="When a marker submits scripts for an exam you moderate, a sample arrives here. You will see the original mark beside your own for every question."
      />
    </ModShell>
  );
}

export function ModerationWorkspaceLoading() {
  return (
    <ModShell>
      <div className="flex flex-col gap-6">
        <Card>
          <div className="flex flex-col gap-3">
            <div className="h-4 w-40 animate-pulse rounded bg-bg" />
            <div className="h-4 w-64 animate-pulse rounded bg-bg" />
          </div>
        </Card>
        <div className="flex flex-col rounded-card border border-border bg-white">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
              <div className="h-4 w-24 animate-pulse rounded bg-bg" />
              <div className="ml-auto h-4 w-12 animate-pulse rounded bg-bg" />
              <div className="h-4 w-12 animate-pulse rounded bg-bg" />
              <div className="h-10 w-16 animate-pulse rounded-control bg-bg" />
            </div>
          ))}
        </div>
      </div>
    </ModShell>
  );
}

export function ModerationWorkspaceError() {
  return (
    <ModShell>
      <div className="flex flex-col gap-6">
        {/*
          The dangerous failure here is a lost decision, not a blank screen. Say
          plainly that nothing was submitted, so the moderator does not assume a
          score of record was set and move on.
        */}
        <Notice tone="error" title="Your decision was not saved" action={{ label: "Try again" }}>
          The connection dropped while this script was being submitted. Nothing was recorded. The
          marker has not been told anything, and the original mark is still the score of record.
        </Notice>
        <ScriptHeader />
        <Notice tone="neutral" title="Your marks are still on this screen">
          Nothing you typed has been lost. Try submitting again.
        </Notice>
      </div>
    </ModShell>
  );
}

export function ModerationWorkspaceDenied() {
  return (
    <ModShell role={ROLES.ta}>
      <Notice tone="error" title="You do not have permission to view this page">
        Only Moderators and HODs review marked scripts. If a script of yours is returned to you, it
        appears on your own marking screen with the reason attached.
      </Notice>
    </ModShell>
  );
}
