/*
  Role-based onboarding. PRD §15, "Login & Role-Based Onboarding", V1, all roles.

  One shared pattern, six different contents. The pattern is deliberate:
  PRD §2 says every workflow assumes limited technical confidence and NO TIME
  FOR TRAINING. So onboarding is short, it teaches only what the role must know
  on day one, and it can be skipped without breaking anything.
*/
import React from "react";
import { AuthFrame, Logo, AppFrame } from "../ui/shell";
import { Button, Card, Field, Input, Notice, Badge, Select } from "../ui/kit";
import { ROLES, RoleKey } from "../roles";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  ScanSearch,
  UserPlus,
  Send,
  Lock,
  CircleCheckBig,
  Plus,
} from "lucide-react";

/* ---------------------------------------------------------------- Stepper */

function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-pill text-caption font-semibold ${
                done
                  ? "bg-success text-white"
                  : active
                    ? "bg-brand text-white"
                    : "bg-bg text-muted border border-border"
              }`}
            >
              {done ? <Check size={13} strokeWidth={3} aria-hidden /> : i + 1}
            </span>
            <span
              className={`truncate text-caption ${active ? "font-semibold text-text" : "text-muted"}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

function Welcome({
  roleKey,
  points,
  ctaLabel = "Get started",
}: {
  roleKey: RoleKey;
  points: string[];
  ctaLabel?: string;
}) {
  const role = ROLES[roleKey];
  return (
    <AuthFrame
      aside={
        <div className="flex flex-col gap-5">
          <p className="text-title font-bold leading-snug text-on-dark">{role.primaryJob}</p>
          <Badge tone="brand" pill>
            {role.title}
          </Badge>
        </div>
      }
    >
      <div className="mb-4 lg:hidden">
        <Logo />
      </div>
      <p className="uppercase-label mb-2">Signed in as {role.title}</p>
      <h1 className="mb-3 text-title font-bold text-text">Welcome, {role.person.split(" ")[1]}</h1>
      <p className="mb-6 text-body text-muted">
        Two minutes now, and you will know everything you need for your first exam.
      </p>
      <ul className="mb-8 flex flex-col gap-4">
        {points.map((p, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-brand-light text-caption font-semibold text-brand-dark">
              {i + 1}
            </span>
            <span className="text-body text-text">{p}</span>
          </li>
        ))}
      </ul>
      {/*
        Both buttons are `xl`. A ghost button has no fill at rest, so a height
        mismatch here is invisible until someone hovers it, which is exactly
        how this one was found. Stacked buttons in one group always share a size.
      */}
      <div className="flex flex-col gap-3">
        <Button size="xl" full iconEnd={ArrowRight}>
          {ctaLabel}
        </Button>
        <Button variant="ghost" size="xl" full>
          Skip and go to my dashboard
        </Button>
      </div>
    </AuthFrame>
  );
}

/* -------------------------------------------------------- Welcome screens */

export const WelcomeAdmin = () => (
  <Welcome
    roleKey="admin"
    ctaLabel="Set up the institution"
    points={[
      "Add the courses running exams, so your Exam Officers can start creating exams.",
      "Upload a few pages of the answer booklet you already use. Markelo learns its layout once.",
      "Invite your Exam Officers, Lecturers, and Moderators, and give each one a role.",
    ]}
  />
);

export const WelcomeOfficer = () => (
  <Welcome
    roleKey="officer"
    ctaLabel="Show me the exam pipeline"
    points={[
      "Create an exam, upload the student list, then scan the booklets in any order.",
      "Markelo assembles each student's script for you. You only look at the ones it flags.",
      "You are the only person who can look up a student's name, and every lookup is recorded.",
    ]}
  />
);

export const WelcomeLecturer = () => (
  <Welcome
    roleKey="lecturer"
    ctaLabel="Show me how marking works"
    points={[
      "You will never see a student's name or matric number while marking. Only a Script ID.",
      "Split your class between yourself and your Teaching Assistants, and change the split any time.",
      "If the power or network drops while you mark, your work stays saved on this computer.",
    ]}
  />
);

export const WelcomeTa = () => (
  <Welcome
    roleKey="ta"
    ctaLabel="Show me how marking works"
    points={[
      "You only see the scripts your Lecturer assigns to you. Nothing else.",
      "You will never see a student's name or matric number. Only a Script ID.",
      "If the power or network drops while you mark, your work stays saved on this computer.",
    ]}
  />
);

export const WelcomeModerator = () => (
  <Welcome
    roleKey="moderator"
    ctaLabel="Show me the moderation view"
    points={[
      "A sample of marked scripts comes to you. You see the original mark beside your own.",
      "Approve a script, or return it to the marker with a reason. The reason is required.",
      "Every mark, change, and comment is kept permanently, so a disputed grade can be answered.",
    ]}
  />
);

export const WelcomeManagement = () => (
  <Welcome
    roleKey="management"
    ctaLabel="Show me the dashboard"
    points={[
      "See how far each department has got with marking, moderation, and results.",
      "Open the audit trail for any exam when an accreditation review asks for evidence.",
      "You cannot see a student's identity, and you cannot change a mark. Neither can anyone else.",
    ]}
  />
);

/* ------------------------------------------- Admin first-run: institution */

export function AdminInstitutionDetails() {
  return (
    <AuthFrame>
      <div className="w-full">
        <Steps steps={["Institution", "Booklet", "Your team"]} current={0} />
        <h1 className="mb-2 text-title font-bold text-text">Tell us about your institution</h1>
        <p className="mb-6 text-body text-muted">
          This appears on result exports and audit records. You can change it later in Settings.
        </p>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Field label="Institution name" required>
            <Input defaultValue="Yaba College of Technology" />
          </Field>
          <Field label="Institution type" required>
            <Select defaultValue="poly">
              <option value="uni">University</option>
              <option value="poly">Polytechnic</option>
              <option value="coe">College of Education</option>
              <option value="mono">Monotechnic</option>
            </Select>
          </Field>

          {/*
            User Story I1: V1 is a FLAT course list. Faculty and department
            hierarchy is a V1.5 addition, so it is deliberately not asked for
            here. Courses can also be edited and deactivated later, not only
            added. That is part of the same story.
          */}
          <Field
            label="Courses running exams this session"
            hint="A simple list is enough for now. You can add, edit, or deactivate a course at any time."
          >
            <Input placeholder="e.g. CSC 401: Compiler Construction" />
          </Field>

          <div className="flex flex-col gap-2">
            {["CSC 401: Compiler Construction", "CSC 312: Operating Systems"].map((c) => (
              <div
                key={c}
                className="flex items-center justify-between rounded-control border border-border bg-bg px-3 py-2"
              >
                <span className="text-body text-text">{c}</span>
                <Badge tone="success">Active</Badge>
              </div>
            ))}
            <Button variant="secondary" size="sm" icon={Plus}>
              Add another course
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="secondary" size="xl" icon={ArrowLeft}>
              Back
            </Button>
            <Button size="xl" iconEnd={ArrowRight}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </AuthFrame>
  );
}

export function AdminBookletPrompt() {
  return (
    <AuthFrame>
      <div className="w-full">
        <Steps steps={["Institution", "Booklet", "Your team"]} current={1} />
        <h1 className="mb-2 text-title font-bold text-text">Teach Markelo your answer booklet</h1>
        <p className="mb-5 text-body text-muted">
          Upload a few pages of the booklet you already use. Markelo learns where the cover page,
          the name, and the matric number sit. You do this once.
        </p>

        <Notice tone="brand" title="Nothing is added to your booklets">
          No sticker, no printed code, no new sheet. Your booklets and your exam day do not change.
        </Notice>

        <div className="mt-5 flex flex-col gap-3">
          {[
            { label: "Cover page", req: true, state: "Uploaded" },
            { label: "Normal answer page", req: false, state: "Uploaded" },
            { label: "Extra sheet", req: false, state: "Not uploaded" },
            { label: "Continuation sheet", req: false, state: "Not uploaded" },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between rounded-card border border-border bg-white px-4 py-3"
            >
              <div>
                <p className="text-body font-medium text-text">
                  {r.label}
                  {r.req && <span className="text-error"> *</span>}
                </p>
                <p className="text-caption text-muted">
                  {r.req ? "Required" : "Optional, but improves accuracy"}
                </p>
              </div>
              {r.state === "Uploaded" ? (
                <Badge tone="success">Uploaded</Badge>
              ) : (
                <Button variant="secondary" size="sm" icon={Upload}>
                  Upload
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl">
            Do this later
          </Button>
          <Button size="xl" icon={ScanSearch}>
            Check the booklet
          </Button>
        </div>
      </div>
    </AuthFrame>
  );
}

export function AdminInviteTeam() {
  const rows = [
    { name: "Adaeze Okonkwo", email: "a.okonkwo@yabatech.edu.ng", role: "Exam Officer" },
    { name: "Dr. Balogun Salami", email: "b.salami@yabatech.edu.ng", role: "Lecturer" },
    { name: "Prof. Eze Nwachukwu", email: "e.nwachukwu@yabatech.edu.ng", role: "Moderator / HOD" },
  ];
  return (
    <AuthFrame>
      <div className="w-full">
        <Steps steps={["Institution", "Booklet", "Your team"]} current={2} />
        <h1 className="mb-2 text-title font-bold text-text">Invite your team</h1>
        <p className="mb-5 text-body text-muted">
          Each person gets an email to set their own password. Nobody can do anything in Markelo
          until you give them a role.
        </p>

        <div className="mb-4 flex flex-col gap-2">
          {rows.map((r) => (
            <div
              key={r.email}
              className="flex items-center gap-4 rounded-card border border-border bg-white px-4 py-3"
            >
              {/*
                `min-w-0 flex-1` is what pushes the badge right and lets the
                long email truncate instead of squeezing the badge. The badge
                itself is `shrink-0` and a fixed 24px, so all three rows line up
                whatever the role is called.
              */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-text">{r.name}</p>
                <p className="truncate text-caption text-muted">{r.email}</p>
              </div>
              <Badge tone="brand">{r.role}</Badge>
            </div>
          ))}
        </div>

        <Card className="mb-6 !p-4">
          <div className="flex flex-col gap-3">
            <Field label="Work email">
              <Input placeholder="name@yabatech.edu.ng" />
            </Field>
            <Field label="Role" hint="A person with no role cannot open anything.">
              <Select>
                <option>Exam Officer</option>
                <option>Lecturer</option>
                <option>Teaching Assistant</option>
                <option>Moderator / HOD</option>
                <option>Institution Admin</option>
                <option>Senior Management</option>
              </Select>
            </Field>
            <Button variant="secondary" icon={UserPlus}>
              Add to the list
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl">
            Skip for now
          </Button>
          <Button size="xl" icon={Send}>
            Send 3 invitations
          </Button>
        </div>
      </div>
    </AuthFrame>
  );
}

/* ------------------------------------- The one thing every marker must see */

export function MarkerAnonymityExplainer({ roleKey }: { roleKey: RoleKey }) {
  const role = ROLES[roleKey];
  return (
    <AuthFrame
      aside={
        <div className="flex flex-col gap-6">
          <p className="text-title font-bold leading-snug text-on-dark">
            No setting turns this off. Not for you, not for your Lecturer, not for the admin.
          </p>
        </div>
      }
    >
      <div className="w-full">
        <p className="uppercase-label mb-2">{role.title}</p>
        <h1 className="mb-2 text-title font-bold text-text">What you will see when you mark</h1>
        <p className="mb-6 text-body text-muted">
          Markelo removes the student's identity before a script reaches you.
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-card border border-border bg-bg p-4 opacity-60">
            <p className="uppercase-label mb-2">Never shown to you</p>
            <p className="text-body text-text line-through">John Ade</p>
            <p className="text-body text-text line-through">CSC/2025/001</p>
          </div>
          <div className="rounded-card border-2 border-brand bg-brand-light p-4">
            <p className="uppercase-label mb-2 !text-brand-dark">What you see instead</p>
            <p className="font-mono text-section font-semibold text-brand-dark">MK-000245</p>
            <p className="mt-1 text-caption text-brand-dark">Script ID</p>
          </div>
        </div>

        <Notice tone="success" title="Why this matters to you">
          If a student ever disputes a grade, the record shows you could not have known whose script
          it was. It protects the student from bias, and it protects you from the accusation.
        </Notice>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" size="xl" icon={ArrowLeft}>
            Back
          </Button>
          <Button size="xl" iconEnd={ArrowRight}>
            Continue
          </Button>
        </div>
      </div>
    </AuthFrame>
  );
}

/* ------------------------------------------------ Onboarding complete */

export function OnboardingDone({ roleKey }: { roleKey: RoleKey }) {
  const role = ROLES[roleKey];
  return (
    <AuthFrame
      aside={<p className="text-title font-bold leading-snug text-on-dark">{role.primaryJob}</p>}
    >
      <div className="w-full text-center">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-pill bg-success-light text-success">
          <CircleCheckBig size={30} strokeWidth={2} aria-hidden />
        </div>
        <h1 className="mb-2 text-title font-bold text-text">You are set up</h1>
        <p className="mb-8 text-body text-muted">
          Everything else you need is on your dashboard. You can reopen this walkthrough any time
          from the help menu.
        </p>
        <Button size="xl" full iconEnd={ArrowRight}>
          Go to my dashboard
        </Button>
      </div>
    </AuthFrame>
  );
}

/* ------------------------- First-run empty dashboard (nothing exists yet) */

export function FirstRunEmptyDashboard() {
  return (
    <AppFrame
      role={ROLES.officer}
      title="Dashboard"
      sub="Nothing has been set up for this session yet"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-6 py-10">
        <div className="text-center">
          <h2 className="mb-2 text-section font-semibold text-text">
            Your first exam starts here
          </h2>
          <p className="text-body text-muted">
            Work through these in order. Each one unlocks the next.
          </p>
        </div>

        {[
          {
            n: 1,
            t: "Create an exam",
            d: "Course, exam type, semester, and who lectures it.",
            state: "ready",
          },
          {
            n: 2,
            t: "Upload the student list",
            d: "A spreadsheet of the students sitting this exam. Markelo checks it for you.",
            state: "locked",
          },
          {
            n: 3,
            t: "Set the marking scheme",
            d: "How many questions, and the highest mark for each one.",
            state: "locked",
          },
          {
            n: 4,
            t: "Scan the booklets",
            d: "After the exam. Stack them in any order and scan in batches.",
            state: "locked",
          },
        ].map((s) => (
          <Card
            key={s.n}
            className={`flex items-center gap-4 ${s.state === "locked" ? "opacity-55" : ""}`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-pill text-body font-semibold ${
                s.state === "ready" ? "bg-brand text-white" : "border border-border bg-bg text-muted"
              }`}
            >
              {s.n}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sub font-semibold text-text">{s.t}</p>
              <p className="text-caption text-muted">{s.d}</p>
            </div>
            {s.state === "ready" ? (
              <Button iconEnd={ArrowRight}>Start</Button>
            ) : (
              <Badge tone="neutral" icon={Lock}>Locked</Badge>
            )}
          </Card>
        ))}
      </div>
    </AppFrame>
  );
}
