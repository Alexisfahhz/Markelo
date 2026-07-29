/*
  Phase 2: Institution Admin screens (Epics A, I, G, H).

  Sources: PRD v3.4 §9.1, §9.1.1, §9.9, §9.10, §9.11; User Stories
  (19 July) A1–A4, I1–I3, J5, G2, H1, F2.

  Every screen ships five states: default, empty, loading, error,
  permission-denied. A screen with only a default state is 20% done.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import {
  Button, Card, CardHeader, Badge, Notice, Input, Field,
  Select, EmptyState, ScriptId,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  Building2, Plus, Pencil, XCircle,
  Users, UserPlus, ShieldOff,
  Upload, FileUp, ScanLine,
  PenLine, Archive,
  ScrollText, Lock, Unlock,
  Check, RotateCcw,
} from "lucide-react";

/* ------------------------------------------------------------------ helpers */

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border px-4 py-3 text-text ${className}`}>{children}</td>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th scope="col" className="px-4 py-3 text-left"><span className="uppercase-label">{children}</span></th>;
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-white">
      <table className="w-full min-w-[560px] border-collapse text-body">
        <thead>
          <tr className="border-b border-border bg-bg">{head.map((h) => <Th key={h}>{h}</Th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col rounded-card border border-border bg-white">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
          <div className="h-4 w-24 animate-pulse rounded bg-bg" />
          <div className="h-4 w-32 animate-pulse rounded bg-bg" />
          <div className="ml-auto h-4 w-16 animate-pulse rounded bg-bg" />
        </div>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="h-5 w-40 animate-pulse rounded bg-bg" />
        <div className="h-4 w-full animate-pulse rounded bg-bg" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg" />
      </div>
    </Card>
  );
}

/* ------------------------------------------------ 1. Institution Courses */

export function InstitutionCourses() { return <CoursesDefault />; }

function CoursesDefault() {
  return (
    <AppFrame role={ROLES.admin} title="Courses" sub="Manage the courses at your institution">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">14 courses active, 4 deactivated</p>
          <Button icon={Plus}>Add course</Button>
        </div>
        <Table head={["Course", "Code", "Status", "Exams this session", ""]}>
          {[
            { n: "Compiler Construction", c: "CSC 401", s: "Active", e: 3 },
            { n: "Operating Systems", c: "CSC 312", s: "Active", e: 2 },
            { n: "Linear Algebra", c: "MTH 201", s: "Active", e: 4 },
            { n: "Intro to Statistics", c: "STA 105", s: "Active", e: 2 },
            { n: "Data Structures", c: "CSC 201", s: "Deactivated", e: 0 },
          ].map((r) => (
            <tr key={r.c}>
              <Td className="font-medium">{r.n}</Td>
              <Td className="text-muted">{r.c}</Td>
              <Td><Badge tone={r.s === "Active" ? "success" : "neutral"}>{r.s}</Badge></Td>
              <Td className="tabular-nums text-muted">{r.e}</Td>
              <Td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" icon={Pencil} aria-label={`Edit ${r.n}`} />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={r.s === "Active" ? XCircle : RotateCcw}
                    aria-label={`${r.s === "Active" ? "Deactivate" : "Reactivate"} ${r.n}`}
                  />
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </div>
    </AppFrame>
  );
}

export function InstitutionCoursesEmpty() {
  return (
    <AppFrame role={ROLES.admin} title="Courses" sub="Manage the courses at your institution">
      <EmptyState
        icon={Building2}
        title="No courses yet"
        body="Add your first course to start creating exams. Courses are flat in V1. Faculty and department hierarchy arrives later."
        action={<Button icon={Plus}>Add your first course</Button>}
      />
    </AppFrame>
  );
}

export function InstitutionCoursesLoading() {
  return (
    <AppFrame role={ROLES.admin} title="Courses" sub="Loading your courses…">
      <div className="flex flex-col gap-4">
        <LoadingRows rows={4} />
      </div>
    </AppFrame>
  );
}

export function InstitutionCoursesError() {
  return (
    <AppFrame role={ROLES.admin} title="Courses" sub="Manage the courses at your institution">
      <Notice tone="error" title="Could not load courses">
        We could not fetch the course list. Check your connection and try again. If this persists,
        contact your institution's IT support.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function InstitutionCoursesDenied() {
  return (
    <AppFrame role={ROLES.ta} title="Courses" sub="Manage courses">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Institution Admins can manage courses. If you need this access, ask your Institution
        Admin to update your role.
      </Notice>
    </AppFrame>
  );
}

/* ---------------------------------------------------- 2. People & Roles */

export function PeopleRoles() { return <PeopleRolesDefault />; }

function PeopleRolesDefault() {
  return (
    <AppFrame role={ROLES.admin} title="People & roles" sub="Who has access, and what they can do">
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="A person can hold more than one role">
          A Lecturer can also be an HOD. Permissions are the union of all active roles. Suspending an
          account revokes access immediately.
        </Notice>
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">48 active accounts, 2 waiting for a role</p>
          <Button icon={UserPlus}>Invite someone</Button>
        </div>
        <Table head={["Name", "Email", "Roles", "Status", ""]}>
          {[
            { n: "Dr. Balogun Salami", e: "b.salami@yabatech.edu.ng", r: "Lecturer, HOD", s: "Active" },
            { n: "Mrs. Adaeze Okonkwo", e: "a.okonkwo@yabatech.edu.ng", r: "Exam Officer", s: "Active" },
            { n: "Chidinma Eze", e: "c.eze@yabatech.edu.ng", r: "Teaching Assistant", s: "Active" },
            { n: "Prof. Eze Nwachukwu", e: "e.nwachukwu@yabatech.edu.ng", r: "Moderator / HOD", s: "Active" },
            { n: "Grace Obi", e: "g.obi@yabatech.edu.ng", r: "Not set", s: "Awaiting role" },
            { n: "Samuel Idowu", e: "s.idowu@yabatech.edu.ng", r: "Not set", s: "Awaiting role" },
          ].map((r) => (
            <tr key={r.e}>
              <Td className="font-medium">{r.n}</Td>
              <Td className="text-muted">{r.e}</Td>
              <Td><span className="text-body text-text">{r.r}</span></Td>
              <Td>
                <Badge tone={r.s === "Active" ? "success" : "warning"}>{r.s}</Badge>
              </Td>
              <Td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" icon={Pencil} aria-label={`Edit roles for ${r.n}`} />
                  <Button variant="ghost" size="sm" icon={ShieldOff} aria-label={`Suspend ${r.n}`} />
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </div>
    </AppFrame>
  );
}

export function PeopleRolesEmpty() {
  return (
    <AppFrame role={ROLES.admin} title="People & roles" sub="Who has access, and what they can do">
      <EmptyState
        icon={Users}
        title="No one has been invited yet"
        body="Invite your first person to join Markelo. They will receive an email to set up their account. Until you give them a role, they have no access at all."
        action={<Button icon={UserPlus}>Invite someone</Button>}
      />
    </AppFrame>
  );
}

export function PeopleRolesLoading() {
  return (
    <AppFrame role={ROLES.admin} title="People & roles" sub="Loading accounts…">
      <div className="flex flex-col gap-4">
        <LoadingRows rows={5} />
      </div>
    </AppFrame>
  );
}

export function PeopleRolesError() {
  return (
    <AppFrame role={ROLES.admin} title="People & roles" sub="Who has access, and what they can do">
      <Notice tone="error" title="Could not load accounts">
        We could not fetch the people list. Check your connection and try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function PeopleRolesDenied() {
  return (
    <AppFrame role={ROLES.ta} title="People & roles" sub="Manage user accounts">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Institution Admins can manage people and roles.
      </Notice>
    </AppFrame>
  );
}

/* ---------------------------------------------- 3. Booklet Profile Setup */

export function BookletProfileSetup() { return <BookletProfileSetupDefault />; }

function BookletProfileSetupDefault() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet profile" sub="Teach Markelo what your answer booklet looks like">
      <div className="flex flex-col gap-6 max-w-2xl">
        <Notice tone="brand" title="Only your cover page is required">
          The normal answer page, extra sheet, and continuation sheet are optional. If you skip them,
          Markelo will still work. It just cannot recognise those page types automatically.
        </Notice>
        <Card>
          <CardHeader
            title="Cover page"
            sub="The front page of your institution's answer booklet"
            action={<Badge tone="success" icon={Check}>Required</Badge>}
          />
          <div className="flex flex-col gap-4">
            <div className="rounded-card border-2 border-dashed border-border-control bg-bg px-6 py-10 text-center">
              <Upload size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" aria-hidden />
              <p className="text-body font-medium text-text">Upload a scanned cover page</p>
              <p className="text-caption text-muted">PDF or image, up to 10 MB</p>
              <Button className="mt-3" variant="secondary" icon={FileUp}>Choose file</Button>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Normal answer page" sub="The pages students write their answers on" action={<Badge tone="neutral">Optional</Badge>} />
          <div className="rounded-card border-2 border-dashed border-border bg-bg px-6 py-8 text-center">
            <Upload size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" aria-hidden />
            <Button variant="ghost" icon={FileUp}>Upload (optional)</Button>
          </div>
        </Card>
        <Card>
          <CardHeader title="Extra sheet" sub="An additional sheet the institution may provide" action={<Badge tone="neutral">Optional</Badge>} />
          <div className="rounded-card border-2 border-dashed border-border bg-bg px-6 py-8 text-center">
            <Upload size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" aria-hidden />
            <Button variant="ghost" icon={FileUp}>Upload (optional)</Button>
          </div>
        </Card>
        <Card>
          <CardHeader title="Continuation sheet" sub="A page for continuing an answer from a previous sheet" action={<Badge tone="neutral">Optional</Badge>} />
          <div className="rounded-card border-2 border-dashed border-border bg-bg px-6 py-8 text-center">
            <Upload size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" aria-hidden />
            <Button variant="ghost" icon={FileUp}>Upload (optional)</Button>
          </div>
        </Card>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button icon={ScanLine}>Validate this profile</Button>
        </div>
      </div>
    </AppFrame>
  );
}

export function BookletProfileSetupLoading() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet profile" sub="Uploading your booklet pages…">
      <div className="flex flex-col gap-4 max-w-2xl">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </AppFrame>
  );
}

export function BookletProfileSetupError() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet profile" sub="Teach Markelo what your answer booklet looks like">
      <Notice tone="error" title="Upload failed">
        We could not upload one or more pages. Make sure each file is a PDF or image under 10 MB and
        try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function BookletProfileSetupDenied() {
  return (
    <AppFrame role={ROLES.ta} title="Booklet profile" sub="Configure booklet setup">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Institution Admins can configure the booklet profile.
      </Notice>
    </AppFrame>
  );
}

/* --------------------------------------------- 4. Booklet Profile Validation */

type DetectionTone = "success" | "warning" | "error";
const DETECTION: { l: string; v: string; t: DetectionTone }[] = [
  { l: "Cover page", v: "Detected", t: "success" },
  { l: "Name field location", v: "Located", t: "success" },
  { l: "Matric number field location", v: "Located", t: "success" },
  { l: "OCR quality", v: "Good", t: "success" },
  { l: "Segmentation confidence", v: "High", t: "success" },
  { l: "Extra sheet layout", v: "Needs manual box", t: "warning" },
];

export function BookletProfileValidation() { return <BookletProfileValidationDefault />; }

function BookletProfileValidationDefault() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet profile validation" sub="Markelo checked what it could detect from your pages">
      {/* TODO(token): max-w-2xl is Tailwind's default 672px, not a Markelo
          token. Needs a form-width decision from KingFizzy. See the audit. */}
      <div className="flex max-w-2xl flex-col gap-6">
        {/*
          Story A2/A3: the profile CANNOT be marked ready while any field is
          still flagged. The button below is gated on `outstanding`, not
          decorative. See the acceptance criterion in the implementation plan.
        */}
        <Notice tone="warning" title="One field still needs your attention">
          Markelo read your cover page and located both identity fields. The extra sheet layout could
          not be detected, so you need to draw the box by hand. You can mark this profile as ready
          once that is done.
        </Notice>
        <Card>
          <CardHeader title="Detection report" sub="What Markelo found on your pages" />
          <div className="flex flex-col">
            {DETECTION.map((r) => (
              <div key={r.l} className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0">
                <span className="text-body text-text">{r.l}</span>
                <div className="flex items-center gap-2">
                  <Badge tone={r.t}>{r.v}</Badge>
                  {r.t === "warning" && (
                    <Button variant="ghost" size="sm" icon={PenLine}>Draw box</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex items-center justify-end gap-3">
          <span className="mr-auto text-caption text-muted">
            1 field unresolved. Draw the extra sheet box to continue.
          </span>
          <Button variant="secondary">Cancel</Button>
          <Button icon={Check} disabled>Mark as ready to use</Button>
        </div>
      </div>
    </AppFrame>
  );
}

export function BookletProfileValidationLoading() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet profile validation" sub="Running detection on your booklet pages…">
      <div className="flex flex-col gap-4 max-w-2xl">
        <LoadingRows rows={5} />
      </div>
    </AppFrame>
  );
}

export function BookletProfileValidationError() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet profile validation" sub="Markelo checks what it can detect">
      <Notice tone="error" title="Validation could not complete">
        The detection pipeline encountered an error. This might be because a page image was unclear.
        Check your uploads and try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function BookletProfileValidationDenied() {
  return (
    <AppFrame role={ROLES.ta} title="Booklet profile validation">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Institution Admins can validate the booklet profile.
      </Notice>
    </AppFrame>
  );
}

/* ---------------------------------------------- 5. Booklet Profile Versioning */

export function BookletProfileVersioning() { return <BookletProfileVersioningDefault />; }

function BookletProfileVersioningDefault() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet versions" sub="Each version keeps old scripts working under the profile they were processed against">
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="Creating a new version never reprocesses old scripts">
          When your institution redesigns its booklet, create a new version. Scripts processed under
          the old version stay exactly as they were.
        </Notice>
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">2 versions</p>
          <Button icon={Plus} variant="secondary">New version</Button>
        </div>
        <Table head={["Version", "Created", "Status", "Scripts processed", "Exams using this", ""]}>
          {[
            { v: "v2", d: "12 Jul 2026", s: "Active", sc: "4,182", e: 7 },
            { v: "v1", d: "10 Jun 2026", s: "Superseded", sc: "1,244", e: 2 },
          ].map((r) => (
            <tr key={r.v}>
              <Td><span className="font-mono font-medium">{r.v}</span></Td>
              <Td className="text-muted">{r.d}</Td>
              <Td><Badge tone={r.s === "Active" ? "success" : "neutral"}>{r.s}</Badge></Td>
              <Td className="tabular-nums text-muted">{r.sc}</Td>
              <Td className="tabular-nums text-muted">{r.e}</Td>
              <Td className="text-right">
                <Button variant="ghost" size="sm" icon={Archive}>View details</Button>
              </Td>
            </tr>
          ))}
        </Table>
      </div>
    </AppFrame>
  );
}

export function BookletProfileVersioningEmpty() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet versions" sub="Booklet profile versioning">
      <EmptyState
        icon={Archive}
        title="No versions yet"
        body="Once your booklet profile is validated, the first version is created automatically. Each time you redesign your booklet, a new version keeps old scripts intact."
      />
    </AppFrame>
  );
}

export function BookletProfileVersioningLoading() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet versions" sub="Loading versions…">
      <LoadingRows rows={2} />
    </AppFrame>
  );
}

export function BookletProfileVersioningError() {
  return (
    <AppFrame role={ROLES.admin} title="Booklet versions" sub="Booklet profile versioning">
      <Notice tone="error" title="Could not load versions">
        We could not fetch the version list. Try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function BookletProfileVersioningDenied() {
  return (
    <AppFrame role={ROLES.ta} title="Booklet versions">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Institution Admins can manage booklet profile versions.
      </Notice>
    </AppFrame>
  );
}

/* ------------------------------------------------------ 6. Audit Trail */

export function AuditTrail() { return <AuditTrailDefault />; }

function AuditTrailDefault() {
  return (
    <AppFrame role={ROLES.admin} title="Audit trail" sub="A permanent record of every significant action. Nothing here can be edited or deleted">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Field label="">
              <Select defaultValue="all">
                <option value="all">All scopes</option>
                <option value="courses">Courses</option>
                <option value="people">People & roles</option>
                <option value="booklet">Booklet profile</option>
                <option value="results">Results</option>
              </Select>
            </Field>
            <Field label="">
              <Input placeholder="Search entries…" />
            </Field>
          </div>
          <p className="text-caption text-muted">Showing 3 of 47 entries</p>
        </div>
        <Card pad={false}>
          <div className="flex flex-col">
            {[
              { w: "You", a: "updated the booklet profile: extra sheet layout set by hand", t: "Today, 11:32" },
              { w: "Prof. Eze", a: "unlocked result CSC 401. Stated reason: 'confirmed data entry error, Q3 score was 14 not 41'", t: "Yesterday, 16:05" },
              { w: "Mrs. Adaeze Okonkwo", a: "looked up student identity MK-000245. Reason: 'corrected matric number typo on upload'", t: "24 Jul 2026, 10:12" },
            ].map((x, i) => (
              <div key={i} className="flex items-start gap-4 border-b border-border px-4 py-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-body text-text">
                    <strong className="font-medium">{x.w}</strong> {x.a}
                  </p>
                </div>
                <span className="shrink-0 text-caption text-muted">{x.t}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" disabled>Previous</Button>
          <span className="text-caption text-muted">Page 1 of 16</span>
          <Button variant="ghost" size="sm">Next</Button>
        </div>
      </div>
    </AppFrame>
  );
}

export function AuditTrailEmpty() {
  return (
    <AppFrame role={ROLES.admin} title="Audit trail" sub="A permanent record of every significant action">
      <EmptyState
        icon={ScrollText}
        title="No entries yet"
        body="The audit trail is empty because nothing has happened yet. As soon as actions are taken across exams, courses, and accounts, they appear here and cannot be removed."
      />
    </AppFrame>
  );
}

export function AuditTrailLoading() {
  return (
    <AppFrame role={ROLES.admin} title="Audit trail" sub="Loading entries…">
      <LoadingRows rows={5} />
    </AppFrame>
  );
}

export function AuditTrailError() {
  return (
    <AppFrame role={ROLES.admin} title="Audit trail" sub="A permanent record of every action">
      <Notice tone="error" title="Could not load audit trail">
        The log could not be retrieved. Try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function AuditTrailDenied() {
  return (
    <AppFrame role={ROLES.ta} title="Audit trail">
      <Notice tone="error" title="You do not have permission to view this page">
        The audit trail is available to Moderators, Institution Admins, and Senior Management only.
        If you need access, ask your Institution Admin.
      </Notice>
    </AppFrame>
  );
}

/* ---------------------------------------------------- 7. Result Correction */

export function ResultCorrection() { return <ResultCorrectionDefault />; }

function ResultCorrectionDefault() {
  return (
    <AppFrame role={ROLES.admin} title="Result correction" sub="Fix a genuine error in a locked result. Every change is logged permanently">
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="Unlocking requires a stated reason">
          Every correction records the old value, the new value, who made the change, and when.
          Once re-locked, the result has the same permanence guarantee as before.
        </Notice>
        <Table head={["Course", "Student", "Script", "CA", "Exam", "Total", "Grade", "Status", ""]}>
          {[
            { c: "CSC 401", s: "Student A", id: "MK-001", ca: 28, ex: 58, tot: 86, g: "A", st: "Finalized" },
            { c: "CSC 401", s: "Student B", id: "MK-002", ca: 22, ex: 41, tot: 63, g: "C", st: "Finalized" },
            { c: "CSC 312", s: "Student C", id: "MK-003", ca: 18, ex: 55, tot: 73, g: "B", st: "Finalized" },
          ].map((r) => (
            <tr key={r.id}>
              <Td className="font-medium">{r.c}</Td>
              <Td className="text-muted">{r.s}</Td>
              <Td><ScriptId id={r.id} /></Td>
              <Td className="tabular-nums">{r.ca}</Td>
              <Td className="tabular-nums">{r.ex}</Td>
              <Td className="tabular-nums font-medium">{r.tot}</Td>
              <Td><Badge tone="success">{r.g}</Badge></Td>
              <Td><Badge>{r.st}</Badge></Td>
              <Td className="text-right">
                <Button variant="ghost" size="sm" icon={Unlock}>Correct</Button>
              </Td>
            </tr>
          ))}
        </Table>
      </div>
    </AppFrame>
  );
}

export function ResultCorrectionEmpty() {
  return (
    <AppFrame role={ROLES.admin} title="Result correction" sub="Fix a genuine error in a locked result">
      <EmptyState
        icon={Lock}
        title="No locked results yet"
        body="Once results are finalised, they appear here if a correction is needed. Every correction is logged permanently. Old and new values are both kept."
      />
    </AppFrame>
  );
}

export function ResultCorrectionLoading() {
  return (
    <AppFrame role={ROLES.admin} title="Result correction" sub="Loading results…">
      <LoadingRows rows={4} />
    </AppFrame>
  );
}

export function ResultCorrectionError() {
  return (
    <AppFrame role={ROLES.admin} title="Result correction" sub="Fix a genuine error in a locked result">
      <Notice tone="error" title="Could not load results">
        We could not retrieve the result list. Check your connection and try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

export function ResultCorrectionDenied() {
  return (
    <AppFrame role={ROLES.ta} title="Result correction">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Institution Admins and Moderators/HODs can correct results.
      </Notice>
    </AppFrame>
  );
}
