/*
  Six role dashboards.

  Design rule applied throughout (Define-layer principle P4, "density needs
  hierarchy"): each dashboard answers ONE question in its top slot. That is the thing
  the role opens Markelo to find out. Everything below it is supporting
  detail. Nothing here shows a student name to anyone except the Exam Officer,
  and even then only as a logged Identity Registry action (PRD §9.11, §11).
*/
import React, { useState } from "react";
import { AppFrame } from "../ui/shell";
import { Button, Card, CardHeader, Badge, Stat, Progress, Notice, EmptyState, ScriptId, Table, Td, Row, TablePagination } from "../ui/kit";
import { ROLES } from "../roles";
import {
  ClipboardList,
  FileStack,
  TriangleAlert,
  CircleCheckBig,
  ArrowRight,
  Plus,
  ScrollText,
  IdCard,
  PenLine,
  Users,
  Flag,
  Undo2,
  ShieldCheck,
  Building2,
  UserPlus,
  BookOpenCheck,
  Timer,
  Lock,
  ChartNoAxesColumn,
  Check,
  FileCheck2,
  UserCheck,
} from "lucide-react";

/* ---------------------------------------------------------------- helpers */

const stageTone = (s: string) =>
  s === "Finalized" ? "success" : s === "Marking" || s === "Moderation" ? "brand" : s === "Exceptions" ? "warning" : "neutral";

/* ------------------------------------------------------- Exam Officer */

export function DashOfficer() {
  return (
    <AppFrame role={ROLES.officer} title="Dashboard" sub="Where every exam stands right now">
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="14 scripts need you before marking can finish">
          Markelo could not match these to a student with enough confidence. Open the exception queue
          and confirm each one.
        </Notice>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 max-lg:grid-cols-2">
          <Stat label="Exams this session" value={7} sub="3 still being marked" icon={ClipboardList} />
          <Stat label="Scripts processed" value="4,182" sub="of 4,196 scanned" icon={FileStack} />
          <Stat label="Needs your review" value={14} sub="in the exception queue" tone="warning" icon={TriangleAlert} />
          <Stat label="Ready to finalise" value={2} sub="marking and moderation done" tone="success" icon={CircleCheckBig} />
        </div>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="Exams in progress"
              sub="Ordered by what needs attention first"
              action={<Button variant="secondary" size="sm" icon={Plus}>Create exam</Button>}
            />
          </div>
          <Table head={["Course", "Stage", "Scripts", "Progress", ""]}>
            {[
              { c: "CSC 401: Compiler Construction", s: "Exceptions", n: "412", p: 68 },
              { c: "CSC 312: Operating Systems", s: "Marking", n: "388", p: 54 },
              { c: "MTH 201: Linear Algebra", s: "Moderation", n: "602", p: 91 },
              { c: "STA 105: Intro Statistics", s: "Finalized", n: "744", p: 100 },
            ].map((r) => (
              <tr key={r.c}>
                <Td className="font-medium">{r.c}</Td>
                <Td>
                  <Badge tone={stageTone(r.s) as any}>{r.s}</Badge>
                </Td>
                <Td className="tabular-nums text-muted">{r.n}</Td>
                <Td className="w-52">
                  <Progress value={r.p} />
                </Td>
                <Td className="text-right">
                  <Button variant="ghost" size="sm">Open</Button>
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Latest scan batch" sub="CSC 401, uploaded 14 minutes ago" />
            <div className="flex flex-col gap-3">
              <Progress value={412} max={426} />
              <div className="grid grid-cols-3 gap-3 text-center max-lg:grid-cols-2">
                <div>
                  <p className="text-card font-semibold tabular-nums text-success">398</p>
                  <p className="text-caption text-muted">Accepted</p>
                </div>
                <div>
                  <p className="text-card font-semibold tabular-nums text-warning">14</p>
                  <p className="text-caption text-muted">Need review</p>
                </div>
                <div>
                  <p className="text-card font-semibold tabular-nums text-muted">14</p>
                  <p className="text-caption text-muted">Still processing</p>
                </div>
              </div>
              {/*
                User Story B2: a script showing "Matched" can be assigned for
                marking immediately, without waiting for the rest of the batch.
                So the batch card has to expose per-script status, not just a
                single batch-level progress bar.
              */}
              <div className="flex flex-col rounded-card border border-border">
                {[
                  { id: "MK-000412", s: "Matched", tone: "success" },
                  { id: "MK-000413", s: "Needs review", tone: "warning" },
                  { id: "MK-000414", s: "Missing pages", tone: "error" },
                ].map((x) => (
                  <div
                    key={x.id}
                    className="flex items-center gap-3 border-b border-border px-3 py-2 last:border-0"
                  >
                    <ScriptId id={x.id} />
                    <Badge tone={x.tone as any}>{x.s}</Badge>
                    {x.s === "Matched" && (
                      <Button variant="ghost" size="sm" className="ml-auto" iconEnd={ArrowRight}>
                        Assign now
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Notice tone="neutral">
                Every script in this pilot is confirmed by a person before marking, whatever score
                Markelo gives it.
              </Notice>
            </div>
          </Card>

          <Card>
            <CardHeader title="Identity lookups" sub="Every lookup you make is recorded permanently" />
            <div className="flex flex-col gap-3">
              <div className="rounded-card border border-border bg-bg px-4 py-3">
                <p className="text-body text-text">
                  You looked up <ScriptId id="MK-000245" /> on 24 Jul, 10:12
                </p>
                <p className="text-caption text-muted">Reason: corrected a matric number typo</p>
              </div>
              <p className="text-caption text-muted">
                Lookups are only possible before marking starts. Once marking begins, this closes for
                the whole exam.
              </p>
              <Button variant="secondary" size="sm" icon={IdCard}>Open identity registry</Button>
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

/* ----------------------------------------------------------- Lecturer */

export function DashLecturer() {
  return (
    <AppFrame role={ROLES.lecturer} title="Dashboard" sub="Your marking, and your team's">
      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4 !border-brand !bg-brand-light lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="uppercase-label !text-brand-dark">Next up</p>
            <p className="text-section font-semibold text-brand-dark">
              62 scripts assigned to you, CSC 312
            </p>
            <p className="text-body text-brand-dark/80">
              You last marked <ScriptId id="MK-001180" /> about an hour ago.
            </p>
          </div>
          <Button size="xl" icon={PenLine}>Continue marking</Button>
        </Card>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 max-lg:grid-cols-2">
          <Stat label="Assigned to you" value={62} sub="24 marked" icon={PenLine} />
          <Stat label="Assigned to your TAs" value={326} sub="across 3 assistants" icon={Users} />
          <Stat label="Flagged for you" value={3} sub="a TA asked for your view" tone="warning" icon={Flag} />
          <Stat label="Returned by moderator" value={1} sub="needs remarking" tone="error" icon={Undo2} />
        </div>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="Your teaching assistants"
              sub="Each TA sees only their own pace, never another TA's"
              action={<Button variant="secondary" size="sm" icon={Users}>Change the split</Button>}
            />
          </div>
          <Table head={["Assistant", "Assigned", "Marked", "Progress", ""]}>
            {[
              { n: "Chidinma Eze", a: 120, m: 82 },
              { n: "Tunde Alabi", a: 118, m: 45 },
              { n: "Grace Obi", a: 88, m: 88 },
            ].map((r) => (
              <tr key={r.n}>
                <Td className="font-medium">{r.n}</Td>
                <Td className="tabular-nums text-muted">{r.a}</Td>
                <Td className="tabular-nums text-muted">{r.m}</Td>
                <Td className="w-52">
                  <Progress value={r.m} max={r.a} />
                </Td>
                <Td className="text-right">
                  {r.m === r.a ? (
                    <Badge tone="success" icon={Check}>Done</Badge>
                  ) : (
                    <Button variant="ghost" size="sm">Reassign</Button>
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

        <Card>
          <CardHeader title="Scripts a TA flagged for you" />
          <div className="flex flex-col">
            {[
              { id: "MK-001204", by: "Chidinma Eze", why: "Answer continues on an unlabelled extra sheet" },
              { id: "MK-001217", by: "Tunde Alabi", why: "Q4 answered twice, unclear which one counts" },
              { id: "MK-001233", by: "Grace Obi", why: "Handwriting unreadable on two pages" },
            ].map((f) => (
              <Row key={f.id}>
                <ScriptId id={f.id} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body text-text">{f.why}</p>
                  <p className="text-caption text-muted">Flagged by {f.by}</p>
                </div>
                <Button variant="secondary" size="sm">Review</Button>
              </Row>
            ))}
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

/* ------------------------------------------------- Teaching Assistant */

export function DashTa() {
  return (
    <AppFrame
      role={ROLES.ta}
      title="Dashboard"
      sub="Only the scripts assigned to you"
      offline="offline"
    >
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="You are working offline">
          Keep marking. Everything is saved on this computer and will upload by itself when the
          network comes back. Do not clear your browser data until it does.
        </Notice>

        <Card className="flex flex-col gap-4 !border-brand !bg-brand-light lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="uppercase-label !text-brand-dark">Next script</p>
            <p className="text-section font-semibold text-brand-dark">
              <span className="font-mono">MK-001262</span>, CSC 312
            </p>
            <p className="text-body text-brand-dark/80">38 left of the 120 assigned to you.</p>
          </div>
          <Button size="xl" icon={PenLine}>Start marking</Button>
        </Card>

        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2">
          <Stat label="Assigned to you" value={120} icon={PenLine} />
          <Stat label="Marked" value={82} sub="saved on this device" tone="success" icon={CircleCheckBig} />
          <Stat label="Waiting to upload" value={9} sub="will send automatically" tone="warning" icon={Timer} />
        </div>

        <Card>
          <CardHeader title="Your progress" sub="This is your own pace. It is not compared to anyone else's." />
          <Progress value={82} max={120} />
        </Card>

        <Card>
          <CardHeader title="Scripts you flagged" sub="Your Lecturer has been notified" />
          <div className="flex flex-col">
            {[
              { id: "MK-001204", why: "Answer continues on an unlabelled extra sheet", state: "Waiting" },
              { id: "MK-001188", why: "Q2 answered in the wrong section", state: "Answered" },
            ].map((f) => (
              <Row key={f.id}>
                <ScriptId id={f.id} />
                <p className="min-w-0 flex-1 truncate text-body text-text">{f.why}</p>
                <Badge tone={f.state === "Answered" ? "success" : "warning"}>{f.state}</Badge>
              </Row>
            ))}
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

/* -------------------------------------------------- Moderator / HOD */

export function DashModerator() {
  return (
    /* Story I2's named example is exactly this person: Lecturer + HOD at once.
       The role switcher appears in the sidebar because they hold both. */
    <AppFrame
      role={ROLES.moderator}
      title="Dashboard"
      sub="Marking quality across your department"
      heldRoles={["moderator", "lecturer"]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 max-lg:grid-cols-2">
          <Stat label="Waiting for you" value={21} sub="sampled scripts" tone="warning" icon={ShieldCheck} />
          <Stat label="Approved this week" value={186} icon={CircleCheckBig} />
          <Stat label="Returned to markers" value={7} sub="all with a reason" icon={Undo2} />
          <Stat label="Results to approve" value={2} sub="CSC 401, MTH 201" tone="success" icon={FileCheck2} />
        </div>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="Moderation queue"
              sub="You see the original mark beside your own. The original is never overwritten."
              action={<Button size="sm" icon={ShieldCheck}>Start moderating</Button>}
            />
          </div>
          <Table head={["Script", "Course", "Marker", "Original", "Your mark", ""]}>
            {[
              { id: "MK-000245", c: "CSC 401", m: "Dr. Balogun", o: "58 / 70", y: "Not yet" },
              { id: "MK-000251", c: "CSC 401", m: "Chidinma Eze", o: "41 / 70", y: "Not yet" },
              { id: "MK-000262", c: "MTH 201", m: "Tunde Alabi", o: "66 / 70", y: "64 / 70" },
            ].map((r) => (
              <tr key={r.id}>
                <Td><ScriptId id={r.id} /></Td>
                <Td className="text-muted">{r.c}</Td>
                <Td className="text-muted">{r.m}</Td>
                <Td className="tabular-nums">{r.o}</Td>
                <Td className={`tabular-nums ${r.y === "Not yet" ? "text-muted" : "font-semibold text-brand"}`}>
                  {r.y}
                </Td>
                <Td className="text-right">
                  <Button variant="ghost" size="sm">Open</Button>
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Returned scripts" sub="A reason is required on every return" />
            <div className="flex flex-col">
              {[
                { id: "MK-000238", r: "Q3 marked against the wrong maximum", to: "Tunde Alabi" },
                { id: "MK-000240", r: "No comment given on a failing answer", to: "Chidinma Eze" },
              ].map((x) => (
                <Row key={x.id}>
                  <ScriptId id={x.id} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body text-text">{x.r}</p>
                    <p className="text-caption text-muted">Back with {x.to}</p>
                  </div>
                  <Badge tone="warning">Remarking</Badge>
                </Row>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Dispute evidence" sub="What you can show if a grade is challenged" />
            <div className="flex flex-col gap-3">
              <p className="text-body text-muted">
                For any script you can produce: who marked it, when, what they saw, every mark change,
                and proof that no marker could see the student's name.
              </p>
              <Button variant="secondary" size="sm" icon={ScrollText}>Open audit trail</Button>
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------- Institution Admin */

export function DashAdmin() {
  return (
    <AppFrame role={ROLES.admin} title="Dashboard" sub="Institution setup and access">
      <div className="flex flex-col gap-6">
        <Notice tone="warning" title="2 people are waiting for a role">
          They have set their passwords but cannot open anything yet. Give each one a role, or remove
          the account.
        </Notice>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 max-lg:grid-cols-2">
          <Stat label="Active accounts" value={48} icon={Users} />
          <Stat label="Waiting for a role" value={2} tone="warning" icon={UserPlus} />
          <Stat label="Courses active" value={14} sub="of 18 added" icon={Building2} />
          <Stat label="Booklet profile" value="v2" sub="validated 12 Jul" tone="success" icon={BookOpenCheck} />
        </div>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="People waiting for a role"
              action={<Button variant="secondary" size="sm" icon={UserPlus}>Invite someone</Button>}
            />
          </div>
          <Table head={["Name", "Email", "Added", ""]}>
            {[
              { n: "Grace Obi", e: "g.obi@yabatech.edu.ng", d: "2 days ago" },
              { n: "Samuel Idowu", e: "s.idowu@yabatech.edu.ng", d: "5 days ago" },
            ].map((r) => (
              <tr key={r.e}>
                <Td className="font-medium">{r.n}</Td>
                <Td className="text-muted">{r.e}</Td>
                <Td className="text-muted">{r.d}</Td>
                <Td className="text-right">
                  <Button size="sm" icon={UserCheck}>Give a role</Button>
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Booklet profile" sub="Markelo learned this from your own booklets" />
            <div className="flex flex-col gap-3">
              {[
                { l: "Cover page detection", v: "Reliable" },
                { l: "Name field", v: "Reliable" },
                { l: "Matric number field", v: "Reliable" },
                { l: "Extra sheet layout", v: "Set by hand" },
              ].map((x) => (
                <div key={x.l} className="flex items-center justify-between">
                  <span className="text-body text-text">{x.l}</span>
                  <Badge tone={x.v === "Reliable" ? "success" : "neutral"}>{x.v}</Badge>
                </div>
              ))}
              <p className="text-caption text-muted">
                Your booklets have not changed since this was set. If you redesign them, add a new
                version. Old scripts keep working under the old one.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent activity" sub="Nothing here can be edited or deleted" />
            <div className="flex flex-col">
              {[
                { w: "You", a: "changed Grace Obi's role to Teaching Assistant", t: "10:04" },
                { w: "Prof. Eze", a: "unlocked a finalised result, CSC 401", t: "Yesterday" },
                { w: "Mrs. Adaeze", a: "looked up one student identity", t: "24 Jul" },
              ].map((x, i) => (
                <Row key={i}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body text-text">
                      <strong className="font-medium">{x.w}</strong> {x.a}
                    </p>
                  </div>
                  <span className="shrink-0 text-caption text-muted">{x.t}</span>
                </Row>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------- Senior Management */

export function DashManagement() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);

  const deptData = [
    { d: "Computer Science", e: 9, s: "Moderation", p: 74 },
    { d: "Mathematics", e: 7, s: "Finalized", p: 100 },
    { d: "Statistics", e: 6, s: "Marking", p: 41 },
    { d: "Electrical Engineering", e: 11, s: "Scanning", p: 18 },
  ];

  return (
    <AppFrame role={ROLES.management} title="Dashboard" sub="Examinations across the institution">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 max-lg:grid-cols-2">
          <Stat label="Exams this session" value={41} sub="across 6 departments" icon={ClipboardList} />
          <Stat label="Results finalised" value="18" sub="44% of the session" icon={FileCheck2} />
          <Stat label="Average scan to result" value="9 days" sub="baseline was 31 days" tone="success" icon={Timer} />
          <Stat label="Identity leaks" value={0} sub="since Markelo went live" tone="success" icon={ShieldCheck} />
        </div>

        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader title="Departments" sub="How far each one has got this session" />
          </div>
          <Table head={["Department", "Exams", "Stage reached", "Progress"]}>
            {deptData.map((r) => (
              <tr key={r.d}>
                <Td className="font-medium">{r.d}</Td>
                <Td className="tabular-nums text-muted">{r.e}</Td>
                <Td>
                  <Badge tone={stageTone(r.s) as any}>{r.s}</Badge>
                </Td>
                <Td className="w-56">
                  <Progress value={r.p} />
                </Td>
              </tr>
            ))}
          </Table>
          <TablePagination
            currentPage={page}
            totalPages={10}
            perPage={perPage}
            perPageOptions={[4, 10, 25]}
            onPageChange={setPage}
            onPerPageChange={(n) => {
              setPerPage(n);
              setPage(1);
            }}
          />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="For accreditation review" sub="Evidence you can hand to an assessor" />
            <div className="flex flex-col gap-3">
              {[
                "Every mark traced to a named marker, with a timestamp",
                "Proof that no marker saw a student's name while marking",
                "Every moderation decision, with the reason given",
              ].map((x) => (
                <div key={x} className="flex gap-2">
                  <Check size={16} strokeWidth={2.5} className="mt-1 shrink-0 text-success" aria-hidden />
                  <span className="text-body text-text">{x}</span>
                </div>
              ))}
              <Button variant="secondary" size="sm" icon={ScrollText}>Open audit trail</Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Institution reports" />
            <EmptyState
              title="Reports arrive later"
              body="Full institutional reporting is being built. For now, department progress above and the audit trail cover an accreditation conversation."
            />
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
