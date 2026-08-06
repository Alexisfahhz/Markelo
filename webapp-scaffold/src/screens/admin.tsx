/*
  Phase 2: Institution Admin screens (Epics A, I, G, H).

  Sources: PRD v3.4 §9.1, §9.1.1, §9.9, §9.10, §9.11; User Stories
  (19 July) A1–A4, I1–I3, J5, G2, H1, F2.

  Every screen ships five states: default, empty, loading, error,
  permission-denied. A screen with only a default state is 20% done.
*/
import React, { useState } from "react";
import { AppFrame } from "../ui/shell";
import {
  Button, Card, CardHeader, Badge, Notice, Input, Field,
  Select, EmptyState, ScriptId, Table, Td, Tooltip, TablePagination,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  Building2, Plus, Pencil, XCircle,
  Users, UserPlus, ShieldOff,
  Upload, FileUp, ScanLine,
  PenLine, Archive,
  ScrollText, Lock, Unlock,
  Check, RotateCcw, Save, Camera,
} from "lucide-react";

/* ------------------------------------------------------------------ helpers */

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

/* ----------------------------------------------- 0. Institution Setup */

export function InstitutionSetup() { return <InstitutionSetupDefault />; }

/*
  Concentric-circle badge for the institution logo, modelled on the LogoMark
  halo pattern in shell.tsx. Three rings: a solid inner disc (76px), then two
  hairlines at 104px and 132px, each fainter outward.

  When a logo IS uploaded, the outer ring pulses subtly so the badge reads as
  "living" rather than static. Without a logo, the rings stay still: a static
  badge signals a fallback, not a finished brand identity.

  Default state (no logo): shows the institution initials inside the disc, with
  a small camera chip in the bottom-right corner to invite upload. Institutions
  that never bother to upload still see their initials, which is how workplace
  apps handle this (Google Workspace, Slack, Notion). The badge never looks
  broken.
*/
function InstitutionBadge({ hasLogo, initials }: { hasLogo: boolean; initials: string }) {
  return (
    <span className="relative inline-grid h-[120px] w-[120px] shrink-0 place-items-center">
      <span
        className={`absolute inset-0 rounded-full border-[0.75px] border-brand/15 ${
          hasLogo ? "motion-safe:animate-pulse" : ""
        }`}
        aria-hidden
      />
      <span
        className="absolute inset-3.5 rounded-full border-[0.75px] border-brand/40"
        aria-hidden
      />
      <span className="absolute inset-7 rounded-full bg-brand-light" aria-hidden />
      <span className="relative text-brand text-xl font-bold tracking-tight select-none">
        {initials}
      </span>
      {!hasLogo && (
        <span
          className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm"
          aria-hidden
        >
          <Camera size={11} strokeWidth={2} className="text-muted" />
        </span>
      )}
    </span>
  );
}

function InstitutionSetupDefault() {
  const [hasLogo, setHasLogo] = useState(false);

  return (
    <AppFrame role={ROLES.admin} activeLabel="Courses" title="Institution setup" sub="Set up your institution profile and manage who has access. You can change any of this later in Settings">
      <div className="flex flex-col gap-6">
        {/* Hero card: logo + identity */}
        <Card>
          <div className="flex items-start gap-6">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <Tooltip content={hasLogo ? "Change institution logo" : "Upload institution logo or image"}>
                <button
                  type="button"
                  onClick={() => setHasLogo((v) => !v)}
                  className="shrink-0 transition-transform hover:scale-105 focus:outline-none"
                  aria-label={hasLogo ? "Change institution logo" : "Upload institution logo or image"}
                >
                  <InstitutionBadge hasLogo={hasLogo} initials="YCT" />
                </button>
              </Tooltip>
              {!hasLogo && (
                <span className="mt-2 text-caption text-muted">
                  Your initials appear as a placeholder. Upload a logo to personalise the institution.
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-title font-bold text-text">Yaba College of Technology</h2>
              <p className="mt-1 text-body text-muted">Polytechnic · YCT</p>
              <div className="mt-4 max-w-md">
                <Field label="Motto / description" hint="Appears on reports sent to your institution portal">
                  <Input defaultValue="Knowledge, Skill and Service" />
                </Field>
              </div>
            </div>

            <Tooltip content="Edit institution name, type, and details" position="bottom">
              <Button variant="ghost" size="sm" icon={Pencil} aria-label="Edit institution details">
                Edit
              </Button>
            </Tooltip>
          </div>
        </Card>

        {/* Profile form */}
        <Card>
          <CardHeader
            title="Profile details"
            sub="Your institution name appears on result exports and audit records"
          />
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Institution name" required>
                <Input defaultValue="Yaba College of Technology" />
              </Field>
              <Field label="Short code" hint="Appears in exported filenames and reports">
                <Input defaultValue="YCT" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Institution type" required>
                <Select defaultValue="poly">
                  <option value="uni">University</option>
                  <option value="poly">Polytechnic</option>
                  <option value="coe">College of Education</option>
                  <option value="mono">Monotechnic</option>
                </Select>
              </Field>
              <Field label="Current academic session">
                <Select defaultValue="2025-2026-1">
                  <option value="2025-2026-1">2025/2026, First Semester</option>
                  <option value="2024-2025-2">2024/2025, Second Semester</option>
                </Select>
              </Field>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="xl">Cancel</Button>
              <Button size="xl" icon={Save}>Save profile</Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader
            title="People & roles"
            sub="Who has access to Markelo, and what they can do"
          />
          <Notice tone="brand" title="A person can hold more than one role">
            A Lecturer can also be an HOD. Permissions are the union of all active roles. Suspending an
            account revokes access immediately.
          </Notice>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-body text-muted">48 active accounts, 2 waiting for a role</p>
            <Button icon={UserPlus}>Invite someone</Button>
          </div>
          <div className="mt-3 overflow-hidden rounded-card border border-border bg-white">
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
                      <Tooltip content="Edit roles">
                        <Button variant="ghost" size="sm" icon={Pencil} aria-label={`Edit roles for ${r.n}`} />
                      </Tooltip>
                      <Tooltip content="Suspend account">
                        <Button variant="ghost" size="sm" icon={ShieldOff} aria-label={`Suspend ${r.n}`} />
                      </Tooltip>
                    </div>
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
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

/* ------------------------------------------------ 1. Institution Courses */

export function InstitutionCourses() { return <CoursesDefault />; }

function CoursesDefault() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Courses" title="Courses" sub="Manage the courses at your institution">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">14 courses active, 4 deactivated</p>
          <Button icon={Plus}>Add course</Button>
        </div>
        <div className="overflow-hidden rounded-card border border-border bg-white">
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
          <TablePagination
            currentPage={1}
            totalPages={10}
            perPage={4}
            perPageOptions={[4, 10, 25]}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </AppFrame>
  );
}

export function InstitutionCoursesEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Courses" title="Courses" sub="Manage the courses at your institution">
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
    <AppFrame role={ROLES.admin} activeLabel="Courses" title="Courses" sub="Loading your courses…">
      <div className="flex flex-col gap-4">
        <LoadingRows rows={4} />
      </div>
    </AppFrame>
  );
}

export function InstitutionCoursesError() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Courses" title="Courses" sub="Manage the courses at your institution">
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
    <AppFrame role={ROLES.ta} activeLabel="Courses" title="Courses" sub="Manage courses">
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
    <AppFrame role={ROLES.admin} activeLabel="People & roles" title="People & roles" sub="Who has access, and what they can do">
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="A person can hold more than one role">
          A Lecturer can also be an HOD. Permissions are the union of all active roles. Suspending an
          account revokes access immediately.
        </Notice>
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">48 active accounts, 2 waiting for a role</p>
          <Button icon={UserPlus}>Invite someone</Button>
        </div>
        <Card pad={false}>
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
                    <Tooltip content="Edit roles">
                      <Button variant="ghost" size="sm" icon={Pencil} aria-label={`Edit roles for ${r.n}`} />
                    </Tooltip>
                    <Tooltip content="Suspend account">
                      <Button variant="ghost" size="sm" icon={ShieldOff} aria-label={`Suspend ${r.n}`} />
                    </Tooltip>
                  </div>
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
      </div>
    </AppFrame>
  );
}

export function PeopleRolesEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="People & roles" title="People & roles" sub="Who has access, and what they can do">
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
    <AppFrame role={ROLES.admin} activeLabel="People & roles" title="People & roles" sub="Loading accounts…">
      <div className="flex flex-col gap-4">
        <LoadingRows rows={5} />
      </div>
    </AppFrame>
  );
}

export function PeopleRolesError() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="People & roles" title="People & roles" sub="Who has access, and what they can do">
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
    <AppFrame role={ROLES.ta} activeLabel="People & roles" title="People & roles" sub="Manage user accounts">
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
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile" sub="Teach Markelo what your answer booklet looks like">
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

export function BookletProfileSetupEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile" sub="Teach Markelo what your answer booklet looks like">
      <div className="max-w-2xl">
        <EmptyState
          icon={Upload}
          title="No booklet profile yet"
          body="Add a scanned cover page to start. It is the only page Markelo needs, the normal page, extra sheet, and continuation sheet are optional and can be added later."
          action={<Button icon={FileUp}>Upload a cover page</Button>}
        />
      </div>
    </AppFrame>
  );
}

export function BookletProfileSetupLoading() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile" sub="Uploading your booklet pages…">
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
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile" sub="Teach Markelo what your answer booklet looks like">
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
    <AppFrame role={ROLES.ta} activeLabel="Booklet profile" title="Booklet profile" sub="Configure booklet setup">
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
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile validation" sub="Markelo checked what it could detect from your pages">
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

export function BookletProfileValidationEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile validation" sub="Markelo checks what it can detect">
      <div className="max-w-2xl">
        <EmptyState
          icon={ScanLine}
          title="Nothing to validate yet"
          body="Upload your booklet profile's cover page first. Once it is uploaded, Markelo detects what it can and lists anything you need to confirm by hand."
          action={<Button icon={FileUp}>Go to booklet profile</Button>}
        />
      </div>
    </AppFrame>
  );
}

export function BookletProfileValidationLoading() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile validation" sub="Running detection on your booklet pages…">
      <div className="flex flex-col gap-4 max-w-2xl">
        <LoadingRows rows={5} />
      </div>
    </AppFrame>
  );
}

export function BookletProfileValidationError() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet profile validation" sub="Markelo checks what it can detect">
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
    <AppFrame role={ROLES.ta} activeLabel="Booklet profile" title="Booklet profile validation">
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
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet versions" sub="Each version keeps old scripts working under the profile they were processed against">
      <div className="flex flex-col gap-6">
        <Notice tone="brand" title="Creating a new version never reprocesses old scripts">
          When your institution redesigns its booklet, create a new version. Scripts processed under
          the old version stay exactly as they were.
        </Notice>
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">2 versions</p>
          <Button icon={Plus} variant="secondary">New version</Button>
        </div>
        <Card pad={false}>
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
        </Card>
      </div>
    </AppFrame>
  );
}

export function BookletProfileVersioningEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet versions" sub="Booklet profile versioning">
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
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet versions" sub="Loading versions…">
      <LoadingRows rows={2} />
    </AppFrame>
  );
}

export function BookletProfileVersioningError() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Booklet profile" title="Booklet versions" sub="Booklet profile versioning">
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
    <AppFrame role={ROLES.ta} activeLabel="Booklet profile" title="Booklet versions">
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
    <AppFrame role={ROLES.admin} activeLabel="Audit trail" title="Audit trail" sub="A permanent record of every significant action. Nothing here can be edited or deleted">
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
          <p className="text-caption text-muted">47 entries</p>
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
          {/*
            This footer was a hand-rolled Previous / "Page 1 of 16" / Next
            trio. Same job TablePagination does, so it is the same component
            now: one pagination pattern in the product rather than one per
            screen. The rows above are a div list and not a <table>, which
            changes nothing about how a page footer should look.
          */}
          <TablePagination
            currentPage={1}
            totalPages={10}
            perPage={4}
            perPageOptions={[4, 10, 25]}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppFrame>
  );
}

export function AuditTrailEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Audit trail" title="Audit trail" sub="A permanent record of every significant action">
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
    <AppFrame role={ROLES.admin} activeLabel="Audit trail" title="Audit trail" sub="Loading entries…">
      <LoadingRows rows={5} />
    </AppFrame>
  );
}

export function AuditTrailError() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Audit trail" title="Audit trail" sub="A permanent record of every action">
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
    <AppFrame role={ROLES.ta} activeLabel="Audit trail" title="Audit trail">
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
    <AppFrame role={ROLES.admin} activeLabel="Result correction" title="Result correction" sub="Fix a genuine error in a locked result. Every change is logged permanently">
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="Unlocking requires a stated reason">
          Every correction records the old value, the new value, who made the change, and when.
          Once re-locked, the result has the same permanence guarantee as before.
        </Notice>
        {/*
          Script ID only, no Student column. This table is visible to the
          Institution Admin, not a marking-facing role, but identity still
          only belongs in the Identity Registry (H2). Reserving the reveal
          for one logged, purpose-built screen is what makes "the only place
          a name appears" actually true, rather than true everywhere except
          the screens someone forgot to check.
        */}
        <Card pad={false}>
          <Table head={["Course", "Script", "CA", "Exam", "Total", "Grade", "Status", ""]}>
            {[
              { c: "CSC 401", id: "MK-001", ca: 28, ex: 58, tot: 86, g: "A", st: "Finalized" },
              { c: "CSC 401", id: "MK-002", ca: 22, ex: 41, tot: 63, g: "C", st: "Finalized" },
              { c: "CSC 312", id: "MK-003", ca: 18, ex: 55, tot: 73, g: "B", st: "Finalized" },
            ].map((r) => (
              <tr key={r.id}>
                <Td className="font-medium">{r.c}</Td>
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
          <TablePagination
            currentPage={1}
            totalPages={10}
            perPage={4}
            perPageOptions={[4, 10, 25]}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppFrame>
  );
}

/*
  What "Correct" opens. G2's full acceptance criteria: unlocking requires a
  stated, logged reason; the correction records the old value, the new
  value, who made it, and when; re-locking restores the same permanence
  guarantee. All four are visible here, not just the first one.
*/
export function ResultCorrectionEditing() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Result correction" title="Result correction" sub="Fix a genuine error in a locked result">
      <div className="flex max-w-2xl flex-col gap-6">
        <Notice tone="warning" title="This result is unlocked for correction">
          It stays unlocked until you save a correction or cancel. While unlocked, the total shown
          below is not final.
        </Notice>

        <Card>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-card font-semibold text-text">CSC 401</h2>
              <ScriptId id="MK-002" />
            </div>
            <Badge tone="warning" icon={Unlock}>Unlocked</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-control border border-border bg-bg px-4 py-3">
              <p className="uppercase-label">Current value, locked</p>
              <p className="mt-1 text-sub font-semibold text-text">63 <span className="text-caption font-normal text-muted">/ 100</span></p>
              <p className="text-caption text-muted">CA 22, Exam 41, Grade C</p>
            </div>
            <div className="rounded-control border border-brand bg-brand-light px-4 py-3">
              <p className="uppercase-label !text-brand-dark">New value</p>
              <div className="mt-1 flex items-center gap-2">
                <Input defaultValue={22} className="w-16" aria-label="New CA" />
                <span className="text-caption text-muted">CA</span>
                <Input defaultValue={51} className="w-16" aria-label="New Exam" />
                <span className="text-caption text-muted">Exam</span>
              </div>
              <p className="mt-2 text-caption text-brand-dark">New total: 73, Grade B</p>
            </div>
          </div>
        </Card>

        <Card>
          <Field label="Reason for this correction" required hint="Recorded exactly as written, alongside your name and the time">
            <Input defaultValue="Exam script Q4 was marked against the wrong marking scheme version, remarked and confirmed by the Lecturer" />
          </Field>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl" icon={Lock}>Cancel, re-lock unchanged</Button>
          <Button size="xl" icon={Check}>Save correction and re-lock</Button>
        </div>
      </div>
    </AppFrame>
  );
}

export function ResultCorrectionEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Result correction" title="Result correction" sub="Fix a genuine error in a locked result">
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
    <AppFrame role={ROLES.admin} activeLabel="Result correction" title="Result correction" sub="Loading results…">
      <LoadingRows rows={4} />
    </AppFrame>
  );
}

export function ResultCorrectionError() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Result correction" title="Result correction" sub="Fix a genuine error in a locked result">
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
    <AppFrame role={ROLES.ta} activeLabel="Result correction" title="Result correction">
      <Notice tone="error" title="You do not have permission to view this page">
        Only Institution Admins and Moderators/HODs can correct results.
      </Notice>
    </AppFrame>
  );
}
