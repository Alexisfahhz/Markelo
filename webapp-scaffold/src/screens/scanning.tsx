/*
  Phase 3, Exam Officer scanning flow. Stories B1 and B2.
  Sources: User Stories (19 July) Epic B; PRD v3.4 §9.2, §9.2.1.

  Two acceptance criteria here are load-bearing and drive the whole layout:

  B1  "Scripts do not need to be scanned in student-name or matric-number
      order." The screen has to SAY that, not just permit it. An officer who
      does not believe it will still pre-sort by hand, which is the exact
      manual labour the product exists to remove.

  B2  "A script showing Matched can be assigned for marking immediately,
      independent of the rest of the batch." So the assign action on a Matched
      row is live WHILE the batch is still processing. A report that only
      unlocks at 100% fails this story, however good it looks.

  §9.2.1 and the B4 caveat: the confidence thresholds are an unvalidated
  target, not current behaviour. Until the benchmark passes, every script needs
  human confirmation whatever score it reports. The pilot notice says so, and
  no bulk-accept-by-confidence control exists on this screen.

  Identity: no student name or matric number appears here. Status is reported
  against a Script ID. Resolving who a script belongs to happens in the
  Exception Queue (B5) and the Identity Registry (H2), where it is logged.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import { Button, Card, CardHeader, Badge, Notice, Field, Select, EmptyState, Progress, ScriptId, Table, Td } from "../ui/kit";
import { ROLES } from "../roles";
import {
  Upload, FileUp, ScanLine, X, RotateCcw, CircleCheck,
  TriangleAlert, FileWarning, Send, ListChecks, Layers,
} from "lucide-react";

/* ------------------------------------------------------------------ shared */

function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col rounded-card border border-border bg-white">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
          <div className="h-4 w-24 animate-pulse rounded bg-bg" />
          <div className="h-4 w-16 animate-pulse rounded bg-bg" />
          <div className="ml-auto h-4 w-28 animate-pulse rounded bg-bg" />
        </div>
      ))}
    </div>
  );
}

const EXAM_SUB = "CSC 401 Compiler Construction, 2025/2026 First Semester";

/* ================================================ 1. Scan Batch Upload (B1) */

const STAGED = [
  { n: "scan-batch-01.pdf", pages: 184, size: "42.1 MB" },
  { n: "scan-batch-02.pdf", pages: 176, size: "39.8 MB" },
  { n: "scan-batch-03.pdf", pages: 152, size: "35.2 MB" },
];

function UploadShell({ children, role = ROLES.officer }: { children: React.ReactNode; role?: typeof ROLES.officer }) {
  return (
    <AppFrame role={role} activeLabel="Scan batches" title="Scan batch upload" sub={EXAM_SUB}>
      {children}
    </AppFrame>
  );
}

export function ScanBatchUpload() {
  return (
    <UploadShell>
      <div className="flex max-w-3xl flex-col gap-6">
        {/*
          B1 in one sentence. This notice is the story, not decoration. Say it
          plainly so nobody sorts a 500-booklet stack by hand first.
        */}
        <Notice tone="brand" title="Scan in whatever order the booklets are in">
          You do not need to sort the stack by name or matric number first. Markelo reads each cover
          page and assembles every student's script for you.
        </Notice>

        <Card>
          <CardHeader title="Which exam is this batch for?" sub="Pages are matched against this exam's student list" />
          <Field label="Exam">
            <Select defaultValue="csc401">
              <option value="csc401">CSC 401 Compiler Construction, First Semester</option>
              <option value="csc312">CSC 312 Operating Systems, First Semester</option>
              <option value="mth201">MTH 201 Linear Algebra, First Semester</option>
            </Select>
          </Field>
        </Card>

        <Card>
          <CardHeader
            title="Scanned pages"
            sub="A multi-page PDF, or a sequence of images"
            action={<Badge tone="success" icon={CircleCheck}>3 files ready</Badge>}
          />
          <div className="flex flex-col gap-4">
            <div className="rounded-card border-2 border-dashed border-border-control bg-bg px-6 py-8 text-center">
              <Upload size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" aria-hidden />
              <p className="text-body font-medium text-text">Drop scanned files here</p>
              <p className="text-caption text-muted">PDF or images. Add as many as your scanner produced.</p>
              <Button className="mt-3" variant="secondary" icon={FileUp}>Choose files</Button>
            </div>

            <ul className="flex flex-col gap-2">
              {STAGED.map((f) => (
                <li
                  key={f.n}
                  className="flex items-center gap-4 rounded-control border border-border bg-white px-4 py-3"
                >
                  <Layers size={16} strokeWidth={2} className="shrink-0 text-muted" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-medium text-text">{f.n}</p>
                    <p className="text-caption text-muted">
                      <span className="tabular-nums">{f.pages}</span> pages, {f.size}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" icon={X} aria-label={`Remove ${f.n}`} />
                </li>
              ))}
            </ul>
            <p className="text-caption text-muted">
              <span className="tabular-nums">512</span> pages in total. Markelo will work out how many
              scripts that is.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl">Cancel</Button>
          <Button size="xl" icon={ScanLine}>Start processing</Button>
        </div>
      </div>
    </UploadShell>
  );
}

export function ScanBatchUploadEmpty() {
  return (
    <UploadShell>
      <div className="max-w-3xl">
        <EmptyState
          icon={Upload}
          title="No pages added yet"
          body="Add the scanned pages for this exam. They can be in any order. Markelo reads each cover page and assembles the scripts for you."
          action={<Button icon={FileUp}>Choose files</Button>}
        />
      </div>
    </UploadShell>
  );
}

export function ScanBatchUploadLoading() {
  return (
    <UploadShell>
      <div className="flex max-w-3xl flex-col gap-6">
        <Notice tone="brand" title="Uploading your pages">
          Keep this tab open until the upload finishes. Processing starts by itself afterwards.
        </Notice>
        <Card>
          <CardHeader title="Uploading" sub="2 of 3 files sent" />
          <div className="flex flex-col gap-4">
            <Progress value={168} max={512} />
            <p className="text-caption text-muted">
              <span className="tabular-nums">168</span> of <span className="tabular-nums">512</span> pages sent
            </p>
          </div>
        </Card>
      </div>
    </UploadShell>
  );
}

export function ScanBatchUploadError() {
  return (
    <UploadShell>
      <div className="flex max-w-3xl flex-col gap-6">
        {/*
          The most likely real failure is not a broken file. It is an exam whose
          booklet profile was never validated, so there is nothing to match
          cover pages against. Name that cause and link the fix.
        */}
        <Notice
          tone="error"
          title="This exam has no validated booklet profile"
          action={{ label: "Open booklet profile" }}
        >
          Markelo cannot assemble scripts until it knows what your answer booklet looks like. Ask your
          Institution Admin to validate the booklet profile, then upload this batch again.
        </Notice>
        <Notice tone="warning" title="One file could not be read">
          scan-batch-03.pdf did not open. Scan those booklets again and add the new file. The other
          two files are still ready.
        </Notice>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl">Cancel</Button>
          <Button size="xl" icon={RotateCcw} disabled>Start processing</Button>
        </div>
      </div>
    </UploadShell>
  );
}

export function ScanBatchUploadDenied() {
  return (
    <UploadShell role={ROLES.lecturer}>
      <Notice tone="error" title="You do not have permission to view this page">
        Only Exam Officers upload scanned booklets. You will see the scripts assigned to you on your
        marking screen once the Exam Officer has processed this batch.
      </Notice>
    </UploadShell>
  );
}

/* ================================ 2. AI Processing and Integrity Report (B2) */

type ScriptStatus = "Matched" | "Needs Review" | "Missing Pages";

const STATUS_TONE: Record<ScriptStatus, "success" | "warning" | "error"> = {
  "Matched": "success",
  "Needs Review": "warning",
  "Missing Pages": "error",
};

const STATUS_ICON = {
  "Matched": CircleCheck,
  "Needs Review": TriangleAlert,
  "Missing Pages": FileWarning,
} as const;

type Row = { id: string; pages: number; status: ScriptStatus; reason?: string };

const ROWS: Row[] = [
  { id: "MK-000245", pages: 8, status: "Matched" },
  { id: "MK-000246", pages: 8, status: "Matched" },
  { id: "MK-000247", pages: 12, status: "Needs Review", reason: "Extra sheet identity does not match the cover page" },
  { id: "MK-000248", pages: 8, status: "Matched" },
  { id: "MK-000249", pages: 6, status: "Missing Pages", reason: "Pages 5 and 6 were not found in this batch" },
  { id: "MK-000250", pages: 8, status: "Matched" },
  { id: "MK-000251", pages: 8, status: "Needs Review", reason: "Matric number on the cover page could not be read" },
];

function ReportShell({ children, role = ROLES.officer }: { children: React.ReactNode; role?: typeof ROLES.officer }) {
  return (
    <AppFrame role={role} activeLabel="Scan batches" title="Processing this batch" sub={EXAM_SUB}>
      {children}
    </AppFrame>
  );
}

/*
  The pilot notice is not boilerplate. PRD §9.2.1 states the confidence
  thresholds are an unvalidated target, and story B4 carries the same caveat.
  Until the benchmark passes, a human confirms every script whatever the score.
  There is deliberately NO "accept all above 95%" control on this screen.
*/
function PilotNotice() {
  return (
    <Notice tone="warning" title="Every script still needs your confirmation">
      Markelo reports what it found, but the accuracy targets have not been measured against real
      scripts yet. During the pilot, confirm each script yourself before it goes for marking, whatever
      status it shows.
    </Notice>
  );
}

function StatusCell({ s }: { s: ScriptStatus }) {
  const Icon = STATUS_ICON[s];
  return <Badge tone={STATUS_TONE[s]} icon={Icon}>{s}</Badge>;
}

export function IntegrityReport() {
  const matched = ROWS.filter((r) => r.status === "Matched").length;
  return (
    <ReportShell>
      <div className="flex flex-col gap-6">
        <PilotNotice />

        <Card>
          <CardHeader
            title="Assembling scripts"
            sub="Pages are being read and grouped into scripts"
            action={<Badge tone="brand">Running</Badge>}
          />
          <div className="flex flex-col gap-4">
            <Progress value={412} max={512} />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-muted">
              <span><span className="tabular-nums font-medium text-text">412</span> of 512 pages read</span>
              <span><span className="tabular-nums font-medium text-text">{ROWS.length}</span> scripts assembled so far</span>
              <span><span className="tabular-nums font-medium text-text">{matched}</span> ready to assign</span>
            </div>
          </div>
        </Card>

        {/*
          B2, the whole point of this screen. "Assign for marking" is LIVE on a
          Matched row while the batch is still running. Do not gate it behind
          batch completion, and do not disable it to look tidy.
        */}
        <Notice tone="success" title={`${matched} scripts are ready to assign now`}>
          You do not have to wait for the rest of the batch. Any script showing Matched can go for
          marking straight away.
        </Notice>

        <Table
          head={[
            { label: "Script" },
            { label: "Pages" },
            { label: "Status" },
            { label: "What Markelo found" },
            { label: "", right: true },
          ]}
        >
          {ROWS.map((r) => (
            <tr key={r.id}>
              <Td><ScriptId id={r.id} /></Td>
              <Td className="tabular-nums text-muted">{r.pages}</Td>
              <Td><StatusCell s={r.status} /></Td>
              <Td className="text-muted">
                {r.reason ?? <span className="text-body">Cover page and all pages found</span>}
              </Td>
              <Td className="text-right">
                {r.status === "Matched" ? (
                  <Button variant="ghost" size="sm" icon={Send}>Assign for marking</Button>
                ) : (
                  <Button variant="ghost" size="sm" icon={ListChecks}>Open in exception queue</Button>
                )}
              </Td>
            </tr>
          ))}
        </Table>

        <p className="text-caption text-muted">
          Scripts keep appearing here as pages are read. Nothing is lost if you leave this screen.
        </p>
      </div>
    </ReportShell>
  );
}

export function IntegrityReportComplete() {
  return (
    <ReportShell>
      <div className="flex flex-col gap-6">
        <PilotNotice />
        <Card>
          <CardHeader
            title="This batch is finished"
            sub="All 512 pages were read"
            action={<Badge tone="success" icon={CircleCheck}>Complete</Badge>}
          />
          <div className="flex flex-col gap-4">
            <Progress value={512} max={512} />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-muted">
              <span><span className="tabular-nums font-medium text-text">64</span> scripts assembled</span>
              <span><span className="tabular-nums font-medium text-text">61</span> matched</span>
              <span><span className="tabular-nums font-medium text-text">3</span> need your review</span>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl" icon={ListChecks}>Review the 3 flagged</Button>
          <Button size="xl" icon={Send}>Assign the 61 matched</Button>
        </div>
      </div>
    </ReportShell>
  );
}

export function IntegrityReportEmpty() {
  return (
    <ReportShell>
      <EmptyState
        icon={ScanLine}
        title="Nothing has been scanned for this exam yet"
        body="Upload a batch of scanned booklets and this page will fill in as scripts are assembled. You can assign each one as soon as it is ready."
        action={<Button icon={Upload}>Upload a scan batch</Button>}
      />
    </ReportShell>
  );
}

export function IntegrityReportLoading() {
  return (
    <ReportShell>
      <div className="flex flex-col gap-6">
        <PilotNotice />
        <Card>
          <CardHeader title="Reading the first pages" sub="Scripts appear here as soon as a cover page is matched" />
          <div className="flex flex-col gap-4">
            <Progress value={9} max={512} />
            <p className="text-caption text-muted">
              <span className="tabular-nums">9</span> of <span className="tabular-nums">512</span> pages read
            </p>
          </div>
        </Card>
        <SkeletonRows rows={5} />
      </div>
    </ReportShell>
  );
}

export function IntegrityReportError() {
  return (
    <ReportShell>
      <div className="flex flex-col gap-6">
        {/*
          Partial failure, not total. 168 pages were already assembled into
          scripts and those stay valid. Saying "processing failed" and hiding
          them would throw away real work and real scanner time.
        */}
        <Notice tone="error" title="Processing stopped at page 168">
          Something went wrong while reading this batch. The 21 scripts already assembled are safe and
          still assignable. Start processing again to read the remaining pages.
        </Notice>
        <Card>
          <CardHeader title="Stopped" sub="168 of 512 pages read" action={<Badge tone="error" icon={FileWarning}>Stopped</Badge>} />
          <Progress value={168} max={512} />
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl">See the 21 assembled</Button>
          <Button size="xl" icon={RotateCcw}>Try the rest again</Button>
        </div>
      </div>
    </ReportShell>
  );
}

export function IntegrityReportDenied() {
  return (
    <ReportShell role={ROLES.ta}>
      <Notice tone="error" title="You do not have permission to view this page">
        Script assembly is handled by the Exam Officer. The scripts assigned to you will appear on your
        marking screen when they are ready.
      </Notice>
    </ReportShell>
  );
}
