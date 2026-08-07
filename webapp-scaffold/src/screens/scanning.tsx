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
import { Button, Card, CardHeader, Badge, Notice, Field, Select, EmptyState, Progress, ScriptId, Table, Td, TablePagination } from "../ui/kit";
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
      <div className="flex gap-0">
        {/* Left column — Figma: 703px content width */}
        <div className="flex flex-1 flex-col gap-6 px-8 py-6" style={{ maxWidth: 703 }}>
          <Notice tone="brand" title="Scan in whatever order the booklets are in">
            You do not need to sort the stack by name or matric number first. Markelo reads each cover
            page and assembles every student's script for you.
          </Notice>

          <Card>
            <CardHeader title="Which exam is this batch for?" sub="Pages are matched against this exam's student list" />
            <Field label="Exam" required>
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
              action={
                <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#EBF5ED] px-2 py-1">
                  <CircleCheck size={14} strokeWidth={2} className="text-[#0E6C40]" aria-hidden />
                  <span className="text-[12px] font-medium leading-4 tracking-[-0.01em] text-[#0E6C40]">Completed</span>
                </span>
              }
            />
            <div className="flex flex-col gap-4">
              {/* Upload drop zone — made visually prominent */}
              <div className="rounded-[12px] border-2 border-dashed border-[#1A56A0] bg-[#E8F1FB] px-6 py-10 text-center">
                <span className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#1A56A0]/10">
                  <Upload size={26} strokeWidth={1.75} className="text-[#1A56A0]" aria-hidden />
                </span>
                <p className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-text">Drop scanned files here</p>
                <p className="mt-1 text-[12px] leading-[18px] text-muted">
                  PDF or images. Add as many as your scanner produced.
                </p>
                <Button className="mt-4" variant="secondary" icon={FileUp}>Choose files</Button>
              </div>

              <ul className="flex flex-col gap-2">
                {STAGED.map((f) => (
                  <li
                    key={f.n}
                    className="flex items-center gap-4 rounded-lg border border-border bg-white px-4 py-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-bg">
                      <Layers size={14} strokeWidth={1.67} className="text-muted" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium leading-5 tracking-[-0.01em] text-text">{f.n}</p>
                      <p className="text-[12px] leading-[18px] text-muted">
                        <span className="tabular-nums">{f.pages}</span> pages, {f.size}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" icon={X} aria-label={`Remove ${f.n}`} />
                  </li>
                ))}
              </ul>
              <p className="text-[12px] leading-[18px] text-muted">
                <span className="tabular-nums font-medium">512</span> pages in total. Markelo will work out how many scripts that is.
              </p>
            </div>
          </Card>

          <div className="flex items-center gap-4">
            <Button variant="secondary" size="xl" full>Cancel</Button>
            <Button size="xl" full icon={ScanLine}>Start processing</Button>
          </div>
        </div>

        {/* Right column — upload progress panel */}
        <div className="flex w-[407px] shrink-0 flex-col border-l border-border bg-white">
          <div className="flex flex-col gap-6 px-8 py-6">
            <div>
              <h3 className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-text">Upload progress</h3>
              <p className="text-[12px] leading-[18px] text-muted">Live feedback as Markelo reads your pages</p>
            </div>

            {/* Script count */}
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold leading-[44px] tabular-nums text-brand">0</span>
                <span className="text-[14px] leading-6 text-muted">scripts found</span>
              </div>
              <p className="mt-1 text-[12px] leading-[18px] text-muted">
                This updates as each cover page is read. Nothing to show yet because processing has not started.
              </p>
            </div>

            {/* First page preview */}
            <div className="rounded-lg border border-border bg-bg p-4">
              <p className="text-[12px] font-semibold leading-4 tracking-[-0.01em] text-text">First page preview</p>
              <p className="mt-1 text-[12px] leading-[18px] text-muted">
                The first cover page Markelo recognises appears here so you can confirm the scan is clear.
              </p>
              <div className="mt-3 flex aspect-[3/4] items-center justify-center rounded-lg border-2 border-dashed border-[#1A56A0]/30 bg-[#F5F5F5]">
                <div className="flex flex-col items-center gap-2 text-muted">
                  <Upload size={24} strokeWidth={1.5} aria-hidden />
                  <span className="text-[12px] leading-[18px]">Waiting for processing</span>
                </div>
              </div>
            </div>

            {/* Processing status info */}
            <div className="rounded-lg bg-brand-light p-4">
              <div className="flex items-start gap-3">
                <CircleCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-[12px] font-semibold leading-4 text-text">What happens next</p>
                  <p className="mt-1 text-[12px] leading-[18px] text-muted">
                    After processing, every script is matched against your student list. Matched scripts
                    can be assigned for marking immediately, even while the rest of the batch is still
                    being assembled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UploadShell>
  );
}

export function ScanBatchUploadWithPreview() {
  return (
    <UploadShell>
      <div className="flex gap-0">
        <div className="flex flex-1 flex-col gap-6 px-8 py-6" style={{ maxWidth: 703 }}>
          <Notice tone="brand" title="Scan in whatever order the booklets are in">
            You do not need to sort the stack by name or matric number first. Markelo reads each cover
            page and assembles every student's script for you.
          </Notice>

          <Card>
            <CardHeader title="Which exam is this batch for?" sub="Pages are matched against this exam's student list" />
            <Field label="Exam" required>
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
              action={
                <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#EBF5ED] px-2 py-1">
                  <CircleCheck size={14} strokeWidth={2} className="text-[#0E6C40]" aria-hidden />
                  <span className="text-[12px] font-medium leading-4 tracking-[-0.01em] text-[#0E6C40]">Completed</span>
                </span>
              }
            />
            <div className="flex flex-col gap-4">
              <div className="rounded-[12px] border-2 border-dashed border-[#1A56A0] bg-[#E8F1FB] px-6 py-10 text-center">
                <span className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#1A56A0]/10">
                  <Upload size={26} strokeWidth={1.75} className="text-[#1A56A0]" aria-hidden />
                </span>
                <p className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-text">Drop scanned files here</p>
                <p className="mt-1 text-[12px] leading-[18px] text-muted">PDF or images. Add as many as your scanner produced.</p>
                <Button className="mt-4" variant="secondary" icon={FileUp}>Choose files</Button>
              </div>

              <ul className="flex flex-col gap-2">
                {STAGED.map((f) => (
                  <li key={f.n} className="flex items-center gap-4 rounded-lg border border-border bg-white px-4 py-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-bg">
                      <Layers size={14} strokeWidth={1.67} className="text-muted" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium leading-5 tracking-[-0.01em] text-text">{f.n}</p>
                      <p className="text-[12px] leading-[18px] text-muted"><span className="tabular-nums">{f.pages}</span> pages, {f.size}</p>
                    </div>
                    <Button variant="ghost" size="sm" icon={X} aria-label={`Remove ${f.n}`} />
                  </li>
                ))}
              </ul>
              <p className="text-[12px] leading-[18px] text-muted">
                <span className="tabular-nums font-medium">512</span> pages in total. Markelo will work out how many scripts that is.
              </p>
            </div>
          </Card>

          <div className="flex items-center gap-4">
            <Button variant="secondary" size="xl" full>Cancel</Button>
            <Button size="xl" full icon={ScanLine}>Start processing</Button>
          </div>
        </div>

        {/* Right panel — with booklet cover page preview */}
        <div className="flex w-[407px] shrink-0 flex-col border-l border-border bg-white">
          <div className="flex flex-col gap-6 px-8 py-6">
            <div>
              <h3 className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-text">Upload progress</h3>
              <p className="text-[12px] leading-[18px] text-muted">Live feedback as Markelo reads your pages</p>
            </div>

            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold leading-[44px] tabular-nums text-brand">3</span>
                <span className="text-[14px] leading-6 text-muted">scripts found</span>
              </div>
              <p className="mt-1 text-[12px] leading-[18px] text-muted">3 of 512 cover pages recognised so far as processing continues.</p>
            </div>

            {/* Booklet cover page preview */}
            <div className="rounded-lg border border-border bg-bg p-4">
              <p className="text-[12px] font-semibold leading-4 tracking-[-0.01em] text-text">Cover page preview</p>
              <p className="mt-1 text-[12px] leading-[18px] text-muted">The first cover page Markelo recognised. This one reads clearly.</p>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                {/* Booklet cover page SVG */}
                <svg viewBox="0 0 280 360" className="w-full" role="img" aria-label="Scanned answer booklet cover page">
                  {/* Page background */}
                  <rect width="280" height="360" fill="#FAFAFA" rx="2" />
                  <rect x="12" y="12" width="256" height="336" fill="none" stroke="#1A56A0" strokeWidth="1.5" rx="2" />

                  {/* Institution header */}
                  <rect x="24" y="24" width="232" height="32" fill="#1A56A0" rx="4" />
                  <text x="140" y="45" textAnchor="middle" fill="white" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="12">YABA COLLEGE OF TECHNOLOGY</text>

                  {/* Exam details section */}
                  <rect x="24" y="66" width="232" height="58" fill="none" stroke="#CCCCCC" strokeWidth="0.5" rx="4" />
                  <text x="36" y="84" fill="#1A1A1A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="10">CSC 401</text>
                  <text x="36" y="98" fill="#666666" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="9">Compiler Construction</text>
                  <text x="36" y="114" fill="#1A1A1A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="500" fontSize="9">2025/2026 · First Semester</text>

                  {/* Script ID */}
                  <rect x="24" y="132" width="232" height="28" fill="#F0F4FA" rx="4" />
                  <text x="36" y="144" fill="#1A56A0" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="14" letterSpacing="0.02em">MK-000245</text>
                  <text x="36" y="154" fill="#666666" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="8">Script ID</text>

                  {/* Instructions */}
                  <text x="24" y="178" fill="#1A1A1A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="9">INSTRUCTIONS</text>
                  <rect x="24" y="184" width="232" height="52" fill="#F5F5F5" rx="4" />
                  <text x="36" y="198" fill="#666666" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="8">1. Write your answers in the spaces provided.</text>
                  <text x="36" y="212" fill="#666666" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="8">2. Do not write your name or matric number anywhere on this booklet.</text>
                  <text x="36" y="226" fill="#666666" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="8">3. The Script ID above is how your work is identified.</text>

                  {/* Barcode area */}
                  <rect x="24" y="244" width="232" height="36" fill="#FAFAFA" stroke="#CCCCCC" strokeWidth="0.5" rx="4" />
                  <g transform="translate(36, 256)">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <rect key={i} x={i * 4} y={0} width={2} height={8 + Math.round(Math.abs(Math.sin(i * 0.7)) * 12)} fill="#1A1A1A" opacity={0.65 + Math.random() * 0.35} rx="0.5" />
                    ))}
                  </g>
                  <text x="140" y="276" textAnchor="middle" fill="#999999" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="7">Scan Verification Strip</text>

                  {/* Question grid */}
                  <text x="24" y="298" fill="#1A1A1A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="9">QUESTIONS</text>
                  {[
                    { q: "1", marks: "20" }, { q: "2", marks: "20" }, { q: "3", marks: "20" },
                    { q: "4", marks: "20" }, { q: "5", marks: "20" },
                  ].map((item, i) => (
                    <g key={item.q}>
                      <rect x={24 + i * 47} y={304} width={44} height={28} fill="white" stroke="#DDDDDD" strokeWidth="0.5" rx="3" />
                      <text x={24 + i * 47 + 6} y={318} fill="#1A1A1A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="8">Q{item.q}</text>
                      <text x={24 + i * 47 + 6} y={328} fill="#666666" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="7">{item.marks} marks</text>
                    </g>
                  ))}

                  {/* Footer */}
                  <rect x="24" y="340" width="232" height="12" fill="#F0F4FA" rx="2" />
                  <text x="140" y="349" textAnchor="middle" fill="#999999" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="400" fontSize="7">Markelo Examination OS · Cover Page</text>
                </svg>
              </div>
            </div>

            <div className="rounded-lg bg-brand-light p-4">
              <div className="flex items-start gap-3">
                <CircleCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-[12px] font-semibold leading-4 text-text">What happens next</p>
                  <p className="mt-1 text-[12px] leading-[18px] text-muted">
                    After processing, every script is matched against your student list. Matched scripts
                    can be assigned for marking immediately, even while the rest of the batch is still
                    being assembled.
                  </p>
                </div>
              </div>
            </div>
          </div>
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

        <Card pad={false}>
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
          <TablePagination
            currentPage={1}
            totalPages={10}
            perPage={4}
            perPageOptions={[4, 10, 25]}
            onPageChange={() => {}}
          />
        </Card>

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

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <div className="text-center">
              <p className="text-[12px] leading-[18px] text-muted">Assembled</p>
              <p className="mt-1 text-[32px] font-bold leading-[40px] tabular-nums text-text">64</p>
              <p className="text-[12px] leading-[18px] text-muted">scripts from 512 pages</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-[12px] leading-[18px] text-muted">Matched</p>
              <p className="mt-1 text-[32px] font-bold leading-[40px] tabular-nums text-success">61</p>
              <p className="text-[12px] leading-[18px] text-muted">ready to assign now</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-[12px] leading-[18px] text-muted">Need Review</p>
              <p className="mt-1 text-[32px] font-bold leading-[40px] tabular-nums text-warning">3</p>
              <p className="text-[12px] leading-[18px] text-muted">open in exception queue</p>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Exceptions for this batch"
            sub="Scripts that need your decision before they can be assigned"
            action={<Badge tone="warning" icon={ListChecks}>3 flagged</Badge>}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3">
              <TriangleAlert size={14} strokeWidth={2} className="shrink-0 text-warning" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-5 text-text">MK-000247 — Extra sheet mismatch</p>
                <p className="text-[12px] leading-[18px] text-muted">Identity details on the extra sheet do not match the cover page</p>
              </div>
              <Button variant="ghost" size="sm" icon={ListChecks}>Open and resolve</Button>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3">
              <TriangleAlert size={14} strokeWidth={2} className="shrink-0 text-warning" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-5 text-text">MK-000249 — Missing pages</p>
                <p className="text-[12px] leading-[18px] text-muted">Pages 5 and 6 are not in this batch</p>
              </div>
              <Button variant="ghost" size="sm" icon={ListChecks}>Open and resolve</Button>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3">
              <TriangleAlert size={14} strokeWidth={2} className="shrink-0 text-warning" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-5 text-text">MK-000251 — Unreadable matric number</p>
                <p className="text-[12px] leading-[18px] text-muted">Two digits on the cover page are too faint to read</p>
              </div>
              <Button variant="ghost" size="sm" icon={ListChecks}>Open and resolve</Button>
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
