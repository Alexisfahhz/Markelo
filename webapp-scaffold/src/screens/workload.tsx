/*
  Phase 4, Marking workload (Designer 7): Marking Assignment and Marking
  Progress.

  Source: PRD v3.4 §9.5; User Story D2; week plan 27 July, "Designer 7,
  Marking workload". Both screens are given to one designer because they are
  two views of the same underlying split: who is marking what, and how far
  along they are.

  Story D2's two hard rules, both designed here:
    1. A TA sees only the scripts explicitly assigned to them, never another
       TA's queue or pace. See MarkingProgressOwn.
    2. Reassigning a script mid-marking preserves the original marker's
       already-submitted marks as history. It is never deleted or
       overwritten. See the "Recently reassigned" list on
       MarkingAssignmentDefault.

  Every screen ships five states: default, empty, loading, error,
  permission-denied. Marking Progress ships a sixth, the TA's own-pace view,
  because story D2's second rule is a different screen, not a filtered copy
  of the Lecturer's.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import {
  Button, Card, CardHeader, Badge, Notice, EmptyState, ScriptId, Stat, Progress, Table, Td, Row,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  Users, PenLine, ArrowRightLeft, History, Check, RotateCcw,
  ChartNoAxesColumn, Timer, CircleCheckBig,
} from "lucide-react";

/* ------------------------------------------------------------------ helpers */

function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col rounded-card border border-border bg-white">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
          <div className="h-4 w-32 animate-pulse rounded bg-bg" />
          <div className="h-4 w-16 animate-pulse rounded bg-bg" />
          <div className="h-2 flex-1 animate-pulse rounded-pill bg-bg" />
        </div>
      ))}
    </div>
  );
}

const MARKERS = [
  { n: "You, Dr. Balogun Salami", a: 62, m: 24, self: true },
  { n: "Chidinma Eze", a: 120, m: 82 },
  { n: "Tunde Alabi", a: 118, m: 45 },
  { n: "Grace Obi", a: 88, m: 88 },
];

/* --------------------------------------------------- 1. Marking Assignment */

export function MarkingAssignment() { return <MarkingAssignmentDefault />; }

function MarkingAssignmentDefault() {
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking assignment" title="Marking assignment" sub="Split scripts between yourself and your teaching assistants">
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="Change the split at any time">
          Moving a script to a different marker never deletes work already submitted. The original
          marker's marks are kept as history.
        </Notice>
        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="CSC 312, first semester exam"
              sub="426 scripts matched and ready to mark"
              action={<Badge tone="neutral">388 assigned</Badge>}
            />
          </div>
          <Table head={["Marker", "Assigned", "Marked", "Progress", ""]}>
            {MARKERS.map((r) => (
              <tr key={r.n}>
                <Td className="font-medium">{r.n}</Td>
                <Td className="tabular-nums text-muted">{r.a}</Td>
                <Td className="tabular-nums text-muted">{r.m}</Td>
                <Td className="w-52"><Progress value={r.m} max={r.a} /></Td>
                <Td className="text-right">
                  {r.self ? (
                    <span className="text-caption text-muted">Marking yourself</span>
                  ) : r.m === r.a ? (
                    <Badge tone="success" icon={Check}>Done</Badge>
                  ) : (
                    <Button variant="ghost" size="sm" icon={ArrowRightLeft}>Reassign</Button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card>
          <CardHeader title="Recently reassigned" sub="The original marker's submitted marks are never lost" />
          <div className="flex flex-col">
            <Row>
              <History size={16} strokeWidth={2} className="shrink-0 text-muted" aria-hidden />
              <ScriptId id="MK-001180" />
              <p className="min-w-0 flex-1 text-body text-text">
                Moved from Chidinma Eze to Tunde Alabi
              </p>
              <span className="text-caption text-muted">Chidinma's marks kept as history</span>
            </Row>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

export function MarkingAssignmentEmpty() {
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking assignment" title="Marking assignment" sub="Split scripts between yourself and your teaching assistants">
      <EmptyState
        icon={Users}
        title="No scripts ready to assign yet"
        body="Assignment opens as soon as a script is matched to a student. You do not need to wait for the whole batch, a single matched script can be assigned right away."
      />
    </AppFrame>
  );
}

export function MarkingAssignmentLoading() {
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking assignment" title="Marking assignment" sub="Loading your class's assignment…">
      <SkeletonRows rows={4} />
    </AppFrame>
  );
}

export function MarkingAssignmentError() {
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking assignment" title="Marking assignment" sub="Split scripts between yourself and your teaching assistants">
      <Notice tone="error" title="Could not load the assignment">
        We could not fetch who is assigned to what. Check your connection and try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function MarkingAssignmentDenied() {
  return (
    <AppFrame role={ROLES.ta} activeLabel="Marking assignment" title="Marking assignment" sub="Split a class's scripts across its markers">
      <Notice tone="error" title="You do not have permission to view this page">
        Only the Lecturer can assign scripts across markers. You will still see any script assigned
        to you on your own dashboard.
      </Notice>
    </AppFrame>
  );
}

/* ----------------------------------------------------- 2. Marking Progress */

export function MarkingProgress() { return <MarkingProgressTeam />; }

function MarkingProgressTeam() {
  const totalAssigned = MARKERS.reduce((s, r) => s + r.a, 0);
  const totalMarked = MARKERS.reduce((s, r) => s + r.m, 0);
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking progress" title="Marking progress" sub="How your class is moving, marker by marker">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Scripts marked" value={totalMarked} sub={`of ${totalAssigned} assigned`} icon={ChartNoAxesColumn} />
          <Stat label="Remaining" value={totalAssigned - totalMarked} icon={Timer} />
          <Stat label="Markers on pace" value="3 of 4" tone="success" icon={CircleCheckBig} />
        </div>
        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader title="By marker" sub="Each person's own pace, side by side for you only" />
          </div>
          <Table head={["Marker", "Assigned", "Marked", "Progress"]}>
            {MARKERS.map((r) => (
              <tr key={r.n}>
                <Td className="font-medium">{r.n}</Td>
                <Td className="tabular-nums text-muted">{r.a}</Td>
                <Td className="tabular-nums text-muted">{r.m}</Td>
                <Td className="w-52"><Progress value={r.m} max={r.a} /></Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </AppFrame>
  );
}

export function MarkingProgressOwn() {
  return (
    <AppFrame role={ROLES.ta} activeLabel="Marking progress" title="Marking progress" sub="Your own pace">
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Assigned to you" value={120} icon={PenLine} />
          <Stat label="Marked" value={82} tone="success" icon={CircleCheckBig} />
          <Stat label="Remaining" value={38} icon={Timer} />
        </div>
        <Card>
          <CardHeader title="Your progress" sub="This is your own pace. It is not compared to anyone else's." />
          <Progress value={82} max={120} />
        </Card>
      </div>
    </AppFrame>
  );
}

export function MarkingProgressEmpty() {
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking progress" title="Marking progress" sub="How your class is moving, marker by marker">
      <EmptyState
        icon={ChartNoAxesColumn}
        title="No marking has started yet"
        body="Progress appears here as soon as a marker submits their first script. Assign scripts to yourself or a teaching assistant to get started."
      />
    </AppFrame>
  );
}

export function MarkingProgressLoading() {
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking progress" title="Marking progress" sub="Loading progress…">
      <SkeletonRows rows={4} />
    </AppFrame>
  );
}

export function MarkingProgressError() {
  return (
    <AppFrame role={ROLES.lecturer} activeLabel="Marking progress" title="Marking progress" sub="How your class is moving, marker by marker">
      <Notice tone="error" title="Could not load progress">
        We could not fetch marking progress. Check your connection and try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function MarkingProgressDenied() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Marking progress" title="Marking progress" sub="How a class is moving, marker by marker">
      <Notice tone="error" title="You do not have permission to view this page">
        Only the Lecturer and the Teaching Assistants on this exam can view marking progress.
      </Notice>
    </AppFrame>
  );
}
