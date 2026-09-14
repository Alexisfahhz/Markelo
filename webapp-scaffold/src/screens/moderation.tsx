/*
  Moderation and dispute screens:
    1. Returned Scripts (Moderator) — Scripts sent back to markers, reason, status.
    2. Result Approval (Moderator) — Grade distribution, manual overrides with stated reasons, final release.
    3. Dispute Evidence (Moderator / Admin) — Complete immutable audit chain for one script, zero identity leak.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import {
  Button,
  Card,
  CardHeader,
  Badge,
  Notice,
  ScriptId,
  Stat,
  Table,
  Td,
  Row,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  Eye,
  FileCheck2,
  TriangleAlert,
  ShieldCheck,
  Undo2,
  Lock,
  History,
  Download,
} from "lucide-react";

/* =====================================================================
   1. RETURNED SCRIPTS (Moderator)
   ===================================================================== */

export const RETURNED_DATA = [
  {
    id: "MK-000212",
    marker: "Chidinma Eze",
    reason: "Question 3 was marked out of 10, the scheme says 15.",
    returnedAt: "Today, 08:40",
    status: "with-marker" as const,
  },
  {
    id: "MK-000198",
    marker: "Tunde Alabi",
    reason: "Question 5's working was not checked against the scheme's alternate method.",
    returnedAt: "Yesterday, 14:12",
    status: "resubmitted" as const,
  },
  {
    id: "MK-000176",
    marker: "Dr. Balogun Salami",
    reason: "Total did not match the sum of the individual question marks.",
    returnedAt: "20 Jul 2026",
    status: "approved" as const,
  },
];

const STATUS_MAP = {
  "with-marker": { label: "With the marker", tone: "warning" as const },
  resubmitted: { label: "Resubmitted, needs your look", tone: "brand" as const },
  approved: { label: "Approved", tone: "success" as const },
};

export function ReturnedScripts() {
  return (
    <AppFrame
      role={ROLES.moderator}
      activeLabel="Returned scripts"
      title="Returned scripts"
      sub="Scripts you sent back, and where they stand"
    >
      <div className="flex flex-col gap-6">
        <Notice tone="brand" compact>
          A returned script goes back to the same marker it came from. You never lose the reason you gave, it stays attached until the script is approved.
        </Notice>
        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="CSC 401, first semester exam"
              sub={`${RETURNED_DATA.length} scripts returned this exam`}
            />
          </div>
          <Table head={["Script", "Marker", "Your reason", "Status", ""]}>
            {RETURNED_DATA.map((e) => (
              <tr key={e.id}>
                <Td><ScriptId id={e.id} /></Td>
                <Td className="font-medium">{e.marker}</Td>
                <Td className="max-w-xs text-muted">{e.reason}</Td>
                <Td><Badge tone={STATUS_MAP[e.status].tone}>{STATUS_MAP[e.status].label}</Badge></Td>
                <Td className="text-right">
                  {e.status === "resubmitted" ? (
                    <Button variant="ghost" size="sm" icon={Eye}>Review again</Button>
                  ) : (
                    <span className="text-caption text-muted">{e.returnedAt}</span>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </AppFrame>
  );
}

/* =====================================================================
   2. RESULT APPROVAL (Moderator)
   ===================================================================== */

export const GRADES_DATA = [
  { grade: "A", count: 62 },
  { grade: "B", count: 118 },
  { grade: "C", count: 145 },
  { grade: "D", count: 74 },
  { grade: "F", count: 27 },
];

export function ResultApproval() {
  const total = GRADES_DATA.reduce((acc, n) => acc + n.count, 0);

  return (
    <AppFrame
      role={ROLES.moderator}
      activeLabel="Result approval"
      title="Result approval"
      sub="CSC 401, first semester exam, 426 scripts"
    >
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="One fixed formula, one manual override">
          Every total on this exam is CA plus Exam mark. 3 scripts used a manual override, each with a stated reason, shown below. Approving finalises results for this exam.
        </Notice>

        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2">
          <Stat label="Scripts ready" value={total} sub="all marked and moderated" icon={FileCheck2} />
          <Stat label="Manual overrides" value={3} tone="warning" icon={TriangleAlert} />
          <Stat label="Sampled by moderation" value="21 of 426" icon={ShieldCheck} />
        </div>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader title="Grade distribution" sub="CA plus Exam, the fixed V1 formula" />
          </div>
          <Table head={["Grade", "Scripts", { label: "Share", right: true }]}>
            {GRADES_DATA.map((t) => (
              <tr key={t.grade}>
                <Td className="font-medium">{t.grade}</Td>
                <Td className="tabular-nums text-muted">{t.count}</Td>
                <Td className="text-right tabular-nums text-muted">{Math.round((t.count / total) * 100)}%</Td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHeader title="Manual overrides on this exam" sub="Each one needs its own stated reason before approval" />
          <div className="flex flex-col">
            <Row>
              <ScriptId id="MK-000208" />
              <p className="min-w-0 flex-1 text-body text-text">CA mark corrected from a data entry error before upload</p>
            </Row>
            <Row>
              <ScriptId id="MK-000233" />
              <p className="min-w-0 flex-1 text-body text-text">Exam mark adjusted after a moderation return, question 3 re-marked</p>
            </Row>
            <Row>
              <ScriptId id="MK-000267" />
              <p className="min-w-0 flex-1 text-body text-text">Total overridden for a documented illness-related deferred component</p>
            </Row>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl" icon={Undo2}>Send back for another look</Button>
          <Button size="xl" icon={Lock}>Approve and finalise</Button>
        </div>
      </div>
    </AppFrame>
  );
}

/* =====================================================================
   3. DISPUTE EVIDENCE (Moderator / Admin)
   ===================================================================== */

export const DISPUTE_EVENTS = [
  {
    at: "18 Jul 2026, 09:02",
    text: "Script assembled from the scan batch and matched to a student record. Identity was stripped before this point; no marker has ever seen it.",
  },
  {
    at: "18 Jul 2026, 09:04",
    text: "Assigned to Chidinma Eze, Teaching Assistant, by Dr. Balogun Salami.",
  },
  {
    at: "19 Jul 2026, 11:20",
    text: "Marked by Chidinma Eze. Submitted total: 63 of 70.",
  },
  {
    at: "20 Jul 2026, 14:05",
    text: "Sampled for moderation by Prof. Eze Nwachukwu.",
  },
  {
    at: "20 Jul 2026, 14:18",
    text: 'Question 2 changed from 6 to 9 during moderation. Reason given: "answer was correct but marked as incomplete."',
  },
  {
    at: "20 Jul 2026, 14:19",
    text: "Approved by Prof. Eze Nwachukwu. Moderated total, 66 of 70, became the score of record. The original total of 63 is retained permanently.",
  },
];

export function DisputeEvidence() {
  return (
    <AppFrame
      role={ROLES.moderator}
      activeLabel="Audit trail"
      title="Dispute evidence"
      sub="Everything on record for one script"
    >
      <div className="flex max-w-3xl flex-col gap-6">
        <Notice tone="success" title="No marker ever saw a name">
          Chidinma Eze marked this script by its Script ID only. Prof. Eze Nwachukwu moderated it the same way. Neither has ever seen the student's identity.
        </Notice>

        <Card>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <p className="uppercase-label">Script</p>
              <div className="mt-1"><ScriptId id="MK-000245" /></div>
            </div>
            <div>
              <p className="uppercase-label">Marked by</p>
              <p className="mt-1 text-body font-medium text-text">Chidinma Eze</p>
            </div>
            <div>
              <p className="uppercase-label">Moderated by</p>
              <p className="mt-1 text-body font-medium text-text">Prof. Eze Nwachukwu</p>
            </div>
            <div>
              <p className="uppercase-label">Score of record</p>
              <p className="mt-1 text-body font-semibold text-text">66 / 70</p>
            </div>
          </div>
        </Card>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="Every event on this script, in order"
              sub="Plain sentences, nothing technical, nothing editable"
            />
          </div>
          <div className="flex flex-col">
            {DISPUTE_EVENTS.map((e, t) => (
              <Row key={t}>
                <History size={16} strokeWidth={2} className="shrink-0 text-muted" aria-hidden />
                <p className="min-w-0 flex-1 text-body text-text">{e.text}</p>
                <span className="shrink-0 text-caption text-muted">{e.at}</span>
              </Row>
            ))}
          </div>
        </Card>

        <div className="flex items-center justify-end">
          <Button variant="secondary" icon={Download}>Export this record</Button>
        </div>
      </div>
    </AppFrame>
  );
}
