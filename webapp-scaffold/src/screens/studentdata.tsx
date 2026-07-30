/*
  Phase 3, Student data and results (Designer 4): Student Data Upload and
  Validation, Identity Registry, Result Processing and Export.

  Source: PRD v3.4 §10 step 2, §9.11, §9.8; User Stories H2, G1; week plan
  27 July, "Designer 4, Student data and results".

  Three hard rules, all designed here:
    1. Upload must handle an institution's full cohort, 5,000+ records,
       within about a minute, and show mismatches clearly. See
       StudentDataUploadDefault's flagged-rows table.
    2. The Identity Registry is the ONLY place in the whole product where a
       name appears. Exam Officer only. Closed once the exam reaches Marking
       status, never after, and never to a marking-facing role. Every lookup
       needs a stated reason and is logged with the actor and the record.
       See IdentityRegistryDefault and IdentityRegistryClosed.
    3. Result export uses one fixed formula (CA + Exam = Total) with a
       manual override for genuine edge cases. The exported file, not this
       screen, is where marks and identity are reunited: ResultProcessing
       stays Script-ID-only on screen, same as every marking-adjacent
       screen in the product, consistent with rule 2.

  Every screen ships five states: default, empty, loading, error,
  permission-denied. Identity Registry ships a sixth, closed, because its
  second hard rule is a real blocked state, not a variant of denied.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import {
  Button, Card, CardHeader, Badge, Notice, Field, Input, Select, EmptyState,
  ScriptId, Stat, Table, Td,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  Upload, FileUp, FileSpreadsheet, RotateCcw, Check, X,
  IdCard, Search, ScrollText,
  FileCheck2, PenLine, Send, Layers,
} from "lucide-react";

const EXAM_SUB = "CSC 401 Compiler Construction, 2025/2026 First Semester";

/* ============================================= 1. Student Data Upload */

type FlagKind = "Duplicate matric number" | "Missing course code" | "Matric number does not match institution format";

const FLAGGED: { row: number; name: string; matric: string; issue: FlagKind }[] = [
  { row: 142, name: "Adeyemi Balogun", matric: "YCT/20/1142", issue: "Duplicate matric number" },
  { row: 143, name: "Adeyemi Balogun", matric: "YCT/20/1142", issue: "Duplicate matric number" },
  { row: 891, name: "Chika Umeh", matric: "YCT/20/0891", issue: "Missing course code" },
  { row: 1204, name: "Segun Ojo", matric: "20-1204", issue: "Matric number does not match institution format" },
];

function UploadShell({ children, role = ROLES.officer }: { children: React.ReactNode; role?: typeof ROLES.officer }) {
  return (
    <AppFrame role={role} activeLabel="Student data" title="Student data" sub={EXAM_SUB}>
      {children}
    </AppFrame>
  );
}

export function StudentDataUpload() { return <StudentDataUploadDefault />; }

function StudentDataUploadDefault() {
  return (
    <UploadShell>
      <div className="flex max-w-3xl flex-col gap-6">
        <Notice tone="brand" title="Handles a full cohort in about a minute">
          Upload the student list for this exam as a spreadsheet. Markelo checks every row, an
          institution's full exam cohort, 5,000 records or more, validates in about a minute.
        </Notice>

        <Card>
          <CardHeader title="Which exam is this list for?" sub="Scripts are matched against this list once scanning starts" />
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
            title="Student list"
            sub="A spreadsheet with name, matric number, and course code"
            action={<Badge tone="warning">4 rows need attention</Badge>}
          />
          <div className="flex flex-col gap-4">
            <div className="rounded-card border-2 border-dashed border-border-control bg-bg px-6 py-8 text-center">
              <Upload size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" aria-hidden />
              <p className="text-body font-medium text-text">Drop the student list here</p>
              <p className="text-caption text-muted">CSV or Excel, one row per student</p>
              <Button className="mt-3" variant="secondary" icon={FileUp}>Choose file</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Total records" value="4,812" icon={FileSpreadsheet} />
              <Stat label="Valid" value="4,808" tone="success" icon={Check} />
              <Stat label="Need attention" value={4} tone="warning" icon={X} />
            </div>
          </div>
        </Card>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader title="Rows that need attention" sub="Fix the file and upload again, or correct these directly" />
          </div>
          <Table head={["Row", "Name", "Matric number", "Issue"]}>
            {FLAGGED.map((f) => (
              <tr key={f.row}>
                <Td className="tabular-nums text-muted">{f.row}</Td>
                <Td className="font-medium">{f.name}</Td>
                <Td className="tabular-nums text-muted">{f.matric}</Td>
                <Td className="text-warning">{f.issue}</Td>
              </tr>
            ))}
          </Table>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl">Cancel</Button>
          <Button size="xl" icon={Check} disabled>Confirm student list</Button>
        </div>
      </div>
    </UploadShell>
  );
}

export function StudentDataUploadEmpty() {
  return (
    <UploadShell>
      <div className="max-w-3xl">
        <Notice tone="error" title="Scanning cannot begin until student data is uploaded">
          This exam has no student list yet. Upload one so Markelo has a cohort to match scanned
          scripts against.
        </Notice>
        <div className="mt-6">
          <EmptyState
            icon={FileSpreadsheet}
            title="No student list yet"
            body="Upload a spreadsheet with each student's name, matric number, and course code. Markelo validates it before scanning can start."
            action={<Button icon={FileUp}>Choose file</Button>}
          />
        </div>
      </div>
    </UploadShell>
  );
}

export function StudentDataUploadLoading() {
  return (
    <UploadShell>
      <div className="flex max-w-3xl flex-col gap-6">
        <Notice tone="brand" title="Validating your student list">
          Checking every row for duplicates, missing fields, and matric number format. This usually
          takes under a minute, even for a full cohort.
        </Notice>
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
    </UploadShell>
  );
}

export function StudentDataUploadError() {
  return (
    <UploadShell>
      <div className="max-w-3xl">
        <Notice tone="error" title="Could not validate this file">
          The file did not open as a spreadsheet. Check that it is a CSV or Excel file with one
          student per row, then upload it again.
        </Notice>
        <div className="mt-4">
          <Button variant="secondary" icon={RotateCcw}>Try again</Button>
        </div>
      </div>
    </UploadShell>
  );
}

export function StudentDataUploadDenied() {
  return (
    <UploadShell role={ROLES.ta}>
      <Notice tone="error" title="You do not have permission to view this page">
        Only Exam Officers upload student data.
      </Notice>
    </UploadShell>
  );
}

/* ================================================= 2. Identity Registry (H2) */

const LOOKUPS = [
  { id: "MK-000891", by: "Mrs. Adaeze Okonkwo", reason: "Confirming a name mismatch flagged in the exception queue", when: "24 Jul 2026, 11:12" },
  { id: "MK-001042", by: "Mrs. Adaeze Okonkwo", reason: "Institution registrar requested confirmation for a transcript query", when: "23 Jul 2026, 15:47" },
];

function RegistryShell({ children, role = ROLES.officer }: { children: React.ReactNode; role?: typeof ROLES.officer }) {
  return (
    <AppFrame role={role} activeLabel="Identity registry" title="Identity registry" sub={EXAM_SUB}>
      {children}
    </AppFrame>
  );
}

export function IdentityRegistry() { return <IdentityRegistryDefault />; }

function IdentityRegistryDefault() {
  return (
    <RegistryShell>
      <div className="flex max-w-2xl flex-col gap-6">
        <Notice tone="warning" title="The only place a name appears">
          Every lookup here is logged with your name, the record you looked at, and the reason you
          gave. This never appears on a marking or moderation screen.
        </Notice>

        <Card>
          <CardHeader title="Look up a script" sub="By Script ID or matric number" />
          <div className="flex flex-col gap-4">
            <Field label="Script ID or matric number">
              <Input defaultValue="MK-000891" />
            </Field>
            <Field label="Reason for this lookup" required hint="This is recorded exactly as written">
              <Input defaultValue="Confirming a name mismatch flagged in the exception queue" />
            </Field>
            <Button icon={Search} className="self-start">Look up</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Result" action={<Badge tone="warning" icon={ScrollText}>Logged</Badge>} />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-caption text-muted">Script</span>
              <ScriptId id="MK-000891" />
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-caption text-muted">Student</span>
              <span className="text-body font-medium text-text">Grace Obi</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-muted">Matric number</span>
              <span className="text-body tabular-nums text-text">YCT/20/0745</span>
            </div>
          </div>
        </Card>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader title="Recent lookups" sub="Every one of these, yours included, is permanent" />
          </div>
          <Table head={["Script", "Looked up by", "Reason", "When"]}>
            {LOOKUPS.map((l) => (
              <tr key={l.id}>
                <Td><ScriptId id={l.id} /></Td>
                <Td className="text-muted">{l.by}</Td>
                <Td className="text-muted">{l.reason}</Td>
                <Td className="tabular-nums text-muted">{l.when}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </RegistryShell>
  );
}

export function IdentityRegistryEmpty() {
  return (
    <RegistryShell>
      <div className="max-w-2xl">
        <EmptyState
          icon={IdCard}
          title="No lookups yet"
          body="Search a script by Script ID or matric number, with a stated reason, to reveal the student behind it. Nothing has been looked up on this exam yet."
        />
      </div>
    </RegistryShell>
  );
}

export function IdentityRegistryLoading() {
  return (
    <RegistryShell>
      <div className="max-w-2xl">
        <Card>
          <div className="flex flex-col gap-3">
            <div className="h-5 w-48 animate-pulse rounded bg-bg" />
            <div className="h-10 w-full animate-pulse rounded bg-bg" />
            <div className="h-10 w-full animate-pulse rounded bg-bg" />
          </div>
        </Card>
      </div>
    </RegistryShell>
  );
}

export function IdentityRegistryError() {
  return (
    <RegistryShell>
      <div className="max-w-2xl">
        <Notice tone="error" title="Could not complete this lookup">
          Check your connection and try again. Nothing was revealed, and this attempt has not been
          logged.
        </Notice>
        <div className="mt-4">
          <Button variant="secondary" icon={RotateCcw}>Try again</Button>
        </div>
      </div>
    </RegistryShell>
  );
}

/*
  H2's second hard rule: closed once the exam reaches Marking status, never
  after. Not a permission problem, a lifecycle one, so it is its own state
  rather than a variant of Denied.
*/
export function IdentityRegistryClosed() {
  return (
    <RegistryShell>
      <div className="max-w-2xl">
        <Notice tone="error" title="Identity Registry is closed for this exam" icon>
          CSC 401 reached Marking status on 24 Jul 2026. The registry closes at that point and does not
          reopen for this exam. This keeps identity out of reach of the marking stage, permanently, not
          just by convention.
        </Notice>
      </div>
    </RegistryShell>
  );
}

export function IdentityRegistryDenied() {
  return (
    <RegistryShell role={ROLES.ta}>
      <Notice tone="error" title="You do not have permission to view this page">
        Only Exam Officers can open the Identity Registry. This keeps identity lookups outside the
        marking side of the system entirely.
      </Notice>
    </RegistryShell>
  );
}

/* ==================================== 3. Result Processing and Export (G1) */

const RESULTS: { id: string; ca: number; exam: number; grade: string; overridden?: boolean }[] = [
  { id: "MK-000891", ca: 28, exam: 58, grade: "A" },
  { id: "MK-000892", ca: 22, exam: 41, grade: "C" },
  { id: "MK-000893", ca: 18, exam: 34, grade: "D", overridden: true },
  { id: "MK-000894", ca: 30, exam: 62, grade: "A" },
];

function ExportShell({ children, role = ROLES.officer }: { children: React.ReactNode; role?: typeof ROLES.officer }) {
  return (
    <AppFrame role={role} activeLabel="Results" title="Results" sub={EXAM_SUB}>
      {children}
    </AppFrame>
  );
}

export function ResultProcessing() { return <ResultProcessingDefault />; }

function ResultProcessingDefault() {
  return (
    <ExportShell>
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="One fixed formula: CA + Exam = Total">
          This is the file your institution's own portal already accepts. Scripts stay identified by
          Script ID here, the same as everywhere else. Identity is matched in automatically when the
          file is generated, not shown on this screen.
        </Notice>

        <div className="grid grid-cols-3 gap-4">
          <Stat label="Ready to export" value={426} icon={FileCheck2} />
          <Stat label="Moderation complete" value={426} tone="success" icon={Check} />
          <Stat label="Manual overrides" value={1} tone="warning" icon={PenLine} />
        </div>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader title="CSC 401, first semester exam" sub="Every row is post-moderation, this is the final total" />
          </div>
          <Table head={["Script", "CA", "Exam", "Total", "Grade", ""]}>
            {RESULTS.map((r) => (
              <tr key={r.id}>
                <Td><ScriptId id={r.id} /></Td>
                <Td className="tabular-nums text-muted">{r.ca}</Td>
                <Td className="tabular-nums text-muted">{r.exam}</Td>
                <Td className="tabular-nums font-medium">{r.ca + r.exam}</Td>
                <Td><Badge tone={r.grade === "A" ? "success" : r.grade === "D" || r.grade === "F" ? "error" : "neutral"}>{r.grade}</Badge></Td>
                <Td className="text-right">
                  {r.overridden ? (
                    <Badge tone="warning" icon={PenLine}>Overridden</Badge>
                  ) : (
                    <Button variant="ghost" size="sm" icon={PenLine}>Override</Button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHeader title="Export format" sub="Matches what your institution's student records system already accepts" />
          <div className="flex items-center justify-between">
            <Field label="Format">
              <Select defaultValue="yct">
                <option value="yct">Yaba College of Technology, portal CSV</option>
                <option value="generic">Generic CSV</option>
              </Select>
            </Field>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="xl">Preview file</Button>
          <Button size="xl" icon={Send}>Export grade report</Button>
        </div>
      </div>
    </ExportShell>
  );
}

export function ResultProcessingEmpty() {
  return (
    <ExportShell>
      <EmptyState
        icon={Layers}
        title="Nothing is ready to export yet"
        body="Results appear here once moderation is complete for this exam. Export opens as soon as the first script clears moderation, you do not need to wait for all of them."
      />
    </ExportShell>
  );
}

export function ResultProcessingLoading() {
  return (
    <ExportShell>
      <div className="flex flex-col gap-4">
        <div className="h-24 w-full animate-pulse rounded-card bg-bg" />
        <div className="flex flex-col rounded-card border border-border bg-white">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
              <div className="h-4 w-24 animate-pulse rounded bg-bg" />
              <div className="h-4 w-16 animate-pulse rounded bg-bg" />
              <div className="ml-auto h-4 w-16 animate-pulse rounded bg-bg" />
            </div>
          ))}
        </div>
      </div>
    </ExportShell>
  );
}

export function ResultProcessingError() {
  return (
    <ExportShell>
      <Notice tone="error" title="Could not generate the export file">
        Something went wrong building the file. Nothing has been sent to your institution's portal.
        Check your connection and try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </ExportShell>
  );
}

export function ResultProcessingDenied() {
  return (
    <ExportShell role={ROLES.ta}>
      <Notice tone="error" title="You do not have permission to view this page">
        Only the Exam Officer and the Moderator can process and export results.
      </Notice>
    </ExportShell>
  );
}
