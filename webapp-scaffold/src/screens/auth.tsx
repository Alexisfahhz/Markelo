/*
  Signed-out screens: every path a user can be on before they reach a dashboard.
  PRD refs: §6 (no access by default, no role until assigned, suspension revokes
  access immediately), §16 (MFA for privileged roles).
*/
import React from "react";
import { AuthFrame, Logo, AppFrame, AuthAside, ASIDE } from "../ui/shell";
import { Button, Field, Input, Notice, Card, Badge } from "../ui/kit";
import { ROLES, RoleKey } from "../roles";
import {
  Mail,
  Lock,
  LogIn,
  KeyRound,
  ShieldCheck,
  MailCheck,
  Clock,
  UserX,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Send,
} from "lucide-react";

/*
  Centred, because the circular mark above it is centred and a left-aligned
  heading under a centred mark reads as a mistake rather than a choice. The
  form fields below stay left-aligned: a centred label above a full-width
  input has no edge to line up against, which is the usual way this pattern
  goes wrong.
*/
function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2 text-center">
      <div className="mb-4 lg:hidden">
        <Logo />
      </div>
      <h1 className="text-title font-bold text-text">{title}</h1>
      {sub && <p className="text-body text-muted">{sub}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- Sign in */

export function SignIn() {
  return (
    <AuthFrame aside={<AuthAside {...ASIDE.signin} />}>
      <Head title="Welcome back" sub="Use the work email your institution registered." />
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Work email" required>
          <Input type="email" icon={Mail} placeholder="a.okonkwo@yabatech.edu.ng" autoComplete="username" />
        </Field>
        <Field label="Password" required>
          <Input type="password" icon={Lock} placeholder="••••••••" autoComplete="current-password" />
        </Field>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-body text-text">
            <input type="checkbox" className="h-4 w-4 accent-[#1a56a0]" />
            Keep me signed in
          </label>
          <a href="#" onClick={(e) => e.preventDefault()} className="text-body text-brand hover:underline">
            Forgot password
          </a>
        </div>
        <Button size="xl" full type="submit" icon={LogIn}>
          Sign in
        </Button>
        <p className="text-caption text-muted">
          No account yet? Your Institution Admin creates it for you. Ask them to send an invitation.
        </p>
      </form>
    </AuthFrame>
  );
}

export function SignInError() {
  return (
    <AuthFrame aside={<AuthAside {...ASIDE.rejected} />}>
      <Head title="Sign in" />
      <div className="mb-4">
        <Notice tone="error" title="That email and password do not match.">
          Check the spelling of your email. If you still cannot sign in, use “Forgot password” below.
          After 5 failed tries the account locks for 15 minutes.
        </Notice>
      </div>
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Work email" required>
          <Input type="email" icon={Mail} defaultValue="a.okonkwo@yabatech.edu.ng" invalid />
        </Field>
        <Field label="Password" required error="Enter your password again.">
          <Input type="password" icon={Lock} defaultValue="wrongpass" invalid />
        </Field>
        <Button size="xl" full icon={LogIn}>
          Sign in
        </Button>
      </form>
    </AuthFrame>
  );
}

export function SignInLoading() {
  return (
    <AuthFrame aside={<AuthAside {...ASIDE.connecting} />}>
      <Head title="Sign in" />
      <form className="flex flex-col gap-4">
        <Field label="Work email" required>
          <Input type="email" icon={Mail} defaultValue="a.okonkwo@yabatech.edu.ng" disabled />
        </Field>
        <Field label="Password" required>
          <Input type="password" icon={Lock} defaultValue="••••••••" disabled />
        </Field>
        <Button size="xl" full disabled>
          Signing you in…
        </Button>
      </form>
    </AuthFrame>
  );
}

/* -------------------------------------------------------------------- MFA */

export function MfaChallenge() {
  return (
    <AuthFrame aside={<AuthAside {...ASIDE.mfa} />}>
      <Head
        title="Confirm it is you"
        sub="Your role can change institution records, so Markelo asks for a second check every time you sign in."
      />
      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <Field
          label="6-digit code"
          hint="Open your authenticator app and enter the code shown for Markelo."
          required
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                maxLength={1}
                inputMode="numeric"
                className="h-12 w-full rounded-control border border-border bg-white text-center font-mono text-section text-text outline-none focus:border-brand"
              />
            ))}
          </div>
        </Field>
        <Button size="xl" full icon={ShieldCheck}>
          Confirm
        </Button>
        <div className="flex flex-col gap-2 text-caption text-muted">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-brand hover:underline">
            I cannot open my authenticator app
          </a>
          <span>Use a saved recovery code, or ask your Institution Admin to reset it.</span>
        </div>
      </form>
    </AuthFrame>
  );
}

/* -------------------------------------------------- Invitation / password */

export function AcceptInvite() {
  return (
    <AuthFrame aside={<AuthAside {...ASIDE.invite} />}>
      <Head
        title="Welcome to Markelo"
        sub="Yaba College of Technology has created an account for you. Set a password to finish."
      />
      <div className="mb-5 rounded-card border border-border bg-bg px-4 py-3">
        <p className="uppercase-label">Your role</p>
        <p className="text-sub font-semibold text-text">Exam Officer</p>
        <p className="text-caption text-muted">
          Set by Mr. Femi Adeyemi. Ask him if this is not the role you expected.
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Work email">
          <Input type="email" icon={Mail} defaultValue="a.okonkwo@yabatech.edu.ng" disabled />
        </Field>
        <Field
          label="Create a password"
          hint="At least 12 characters. Use a phrase you will remember, not a single word."
          required
        >
          <Input type="password" icon={Lock} placeholder="••••••••••••" autoComplete="new-password" />
        </Field>
        <Field label="Type the password again" required>
          <Input type="password" icon={Lock} placeholder="••••••••••••" autoComplete="new-password" />
        </Field>
        <Button size="xl" full icon={KeyRound}>
          Set password and continue
        </Button>
      </form>
    </AuthFrame>
  );
}

export function ForgotPassword() {
  return (
    <AuthFrame aside={<AuthAside {...ASIDE.forgot} />}>
      <Head title="Forgot password" sub="Enter your work email. We will send you a reset link." />
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Work email" required>
          <Input type="email" icon={Mail} placeholder="a.okonkwo@yabatech.edu.ng" />
        </Field>
        <Button size="xl" full icon={Send}>
          Send reset link
        </Button>
        <a href="#" onClick={(e) => e.preventDefault()} className="text-body text-brand hover:underline">
          Back to sign in
        </a>
      </form>
    </AuthFrame>
  );
}

export function ForgotPasswordSent() {
  return (
    <AuthFrame aside={<AuthAside {...ASIDE.sent} />}>
      <Head title="Check your email" />
      <Notice tone="success" title="Reset link sent">
        If an account uses <strong>a.okonkwo@yabatech.edu.ng</strong>, a reset link is on its way.
        The link works once and expires in 30 minutes.
      </Notice>
      <div className="mt-5 flex flex-col gap-3">
        <p className="text-body text-muted">
          Nothing arrived? Check your spam folder first, then try again.
        </p>
        <Button variant="secondary" size="xl" full icon={RotateCcw}>
          Send the link again
        </Button>
      </div>
    </AuthFrame>
  );
}

/* --------------------------------------------------------- Blocked states */

export function NoRoleAssigned() {
  return (
    <AuthFrame
      aside={<AuthAside {...ASIDE.norole} />}
    >
      <Head title="Your account has no role yet" />
      <Notice tone="warning" title="Waiting for your Institution Admin">
        Markelo gives every new account no access until an admin assigns a role. This protects exam
        records. You will get an email as soon as your role is set.
      </Notice>
      <div className="mt-5 flex flex-col gap-3">
        <div className="rounded-card border border-border bg-bg px-4 py-3">
          <p className="uppercase-label">Who can help</p>
          <p className="text-body font-medium text-text">Mr. Femi Adeyemi, Institution Admin</p>
          <p className="text-caption text-muted">f.adeyemi@yabatech.edu.ng</p>
        </div>
        <Button variant="secondary" full icon={ArrowLeft}>
          Sign out
        </Button>
      </div>
    </AuthFrame>
  );
}

export function AccountSuspended() {
  return (
    <AuthFrame
      aside={<AuthAside {...ASIDE.suspended} />}
    >
      <Head title="This account is suspended" />
      <Notice tone="error" title="You cannot sign in right now">
        Your access was withdrawn by an Institution Admin. Any marking you had saved is kept and is
        not lost. Speak to your admin to have access restored.
      </Notice>
      <div className="mt-5">
        <Button variant="secondary" full icon={ArrowLeft}>
          Back to sign in
        </Button>
      </div>
    </AuthFrame>
  );
}

/* ------------------------------------------------- Multi-role (Story I2) */

/*
  User Story I2: "As a user who holds more than one role at my institution, I
  want the system to recognize both roles at once." Permissions are the union
  of every active role, so the person is never asked to pick ONE. They pick
  which one to start in, and switch freely from the sidebar afterwards.
*/
export function ChooseRole({ held = ["lecturer", "moderator"] as RoleKey[] }) {
  return (
    <AuthFrame
      aside={<AuthAside {...ASIDE.roles} />}
    >
      <div className="w-full">
        <div className="mb-4 lg:hidden">
          <Logo />
        </div>
        <h1 className="mb-2 text-title font-bold text-text">Where do you want to start?</h1>
        <p className="mb-6 text-body text-muted">
          You can switch at any time from the menu on the left. Nothing is locked by this choice.
        </p>

        <div className="flex flex-col gap-3">
          {held.map((k) => {
            const r = ROLES[k];
            return (
              <button
                key={k}
                className="flex items-center gap-3 rounded-card border border-border bg-white px-4 py-4 text-left transition-colors hover:border-brand hover:bg-brand-light"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sub font-semibold text-text">{r.title}</p>
                  <p className="text-caption text-muted">{r.primaryJob}</p>
                </div>
                <ArrowRight size={18} strokeWidth={2} className="shrink-0 text-brand" aria-hidden />
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-caption text-muted">
          Marking rules do not change between roles. You still never see a student's name while
          marking, even as a Moderator.
        </p>
      </div>
    </AuthFrame>
  );
}

/* --------------------------------------- Session expiry (Story J4) */

/*
  User Story J4: session expiry must be handled GENTLY. A timeout during a long
  marking session must not destroy unsaved work. So this is a non-destructive
  prompt over the screen the person was already on. Never a silent logout,
  and never a redirect that loses their place.
*/
export function SessionExpiryWarning() {
  return (
    <AppFrame
      role={ROLES.ta}
      activeLabel="My marking"
      title="Marking"
      sub="CSC 312, script 83 of 120"
      overlay={
        <Card className="w-full max-w-lg">
          <div className="mb-4 flex items-start gap-3">
            <Clock size={22} strokeWidth={2} className="mt-0.5 shrink-0 text-warning" aria-hidden />
            <div>
              <h2 className="text-card font-semibold text-text">
                You will be signed out in 2 minutes
              </h2>
              <p className="mt-1 text-body text-muted">
                Markelo signs you out after a period of no activity, to keep exam records safe.
              </p>
            </div>
          </div>

          <Notice tone="success" title="Your marking is safe">
            Everything you have entered on this script is already saved on this computer. Signing out
            will not lose it, and it will still be here when you sign back in.
          </Notice>

          {/*
            Grid, not flex. Two `w-full` flex children each demand 100% of the
            row and can only stay inside it by luck of arithmetic. A 2-column
            grid gives each exactly half, so the row can never overflow.
          */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="secondary" size="xl">
              Sign me out now
            </Button>
            <Button size="xl" icon={RotateCcw}>
              Keep me signed in
            </Button>
          </div>
        </Card>
      }
    >
      <Card>
        <p className="text-body text-muted">
          The marking screen sits behind this prompt. The person keeps their place. The prompt never
          navigates them away.
        </p>
      </Card>
    </AppFrame>
  );
}

/* ------------------------------- Access revoked mid-session (Story J5) */

/*
  User Story J5: when an admin suspends an account or changes a role, active
  sessions are revoked IMMEDIATELY, not left to expire. So a person can be
  working and be stopped mid-task. That moment needs a screen, and it has to
  reassure them their submitted work was kept.
*/
export function AccessRevokedMidSession() {
  return (
    <AuthFrame
      aside={<AuthAside {...ASIDE.revoked} />}
    >
      <div className="w-full">
        <div className="mb-4 lg:hidden">
          <Logo />
        </div>
        <div className="mb-5 flex items-center gap-3">
          <UserX size={26} strokeWidth={2} className="shrink-0 text-error" aria-hidden />
          <h1 className="text-title font-bold text-text">Your access has changed</h1>
        </div>

        <Notice tone="error" title="You were signed out while you were working">
          An Institution Admin changed your role or suspended your account just now. Markelo applies
          that straight away, so your session ended here.
        </Notice>

        <div className="mt-5 rounded-card border border-border bg-bg px-4 py-3">
          <p className="text-body font-medium text-text">Marks you already submitted are kept.</p>
          <p className="mt-1 text-caption text-muted">
            Anything you had entered but not yet submitted on the current script may not have been
            sent. Speak to your Lecturer about that one script.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="rounded-card border border-border bg-white px-4 py-3">
            <p className="uppercase-label">Who can help</p>
            <p className="text-body font-medium text-text">Mr. Femi Adeyemi, Institution Admin</p>
            <p className="text-caption text-muted">f.adeyemi@yabatech.edu.ng</p>
          </div>
          <Button variant="secondary" full icon={ArrowLeft}>
            Back to sign in
          </Button>
        </div>
      </div>
    </AuthFrame>
  );
}
