/*
  Markelo prototype flow, screen registry.

  NOT a route table. This is a demo-order list for the scroll canvas.

  Source of truth: the scaffold at ../webapp-scaffold. The order below
  mirrors the "Sign in & account" and "Dashboards" groups in
  webapp-scaffold/src/App.tsx (GROUPS), and every component is imported
  live from webapp-scaffold/src/screens/*, no copies, so when a screen
  evolves in the scaffold this prototype updates with it.

  `actions` maps a click on a button/link (matched by its visible text,
  case-insensitive substring) to the id it smooth-scrolls to. Unmapped
  buttons do nothing, which is correct for a presentation prototype.
*/
import React from "react";
import * as A from "../../webapp-scaffold/src/screens/auth";
import * as D from "../../webapp-scaffold/src/screens/dashboards";
import * as SC from "../../webapp-scaffold/src/screens/scanning";
import * as W from "../../webapp-scaffold/src/screens/workload";
import * as SD from "../../webapp-scaffold/src/screens/studentdata";
import { NavVariantProvider } from "../../webapp-scaffold/src/ui/shell";

/*
  Every screen with an app shell is wrapped so its sidebar renders flat and
  its category's destinations move into a tab row. The wrapper lives here, in
  the prototype, and not in the scaffold: the restructure is being trialled on
  5180 only, so 5179 must keep the nested tree it already has.
*/
const Flat = ({ children }: { children: React.ReactNode }) => (
  <NavVariantProvider value="flat">{children}</NavVariantProvider>
);

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "auth" | "dashboard" | "section";
  el: React.ReactNode;
  actions?: FlowAction[];
  /** Loading/transient screens: any click advances. */
  advanceAnywhereTo?: string;
};

export const SIGNIN_ID = "signin";

export const FLOW: FlowScreen[] = [
  /* ------------------------------------------------------ Authentication */

  {
    id: "signin",
    label: "Sign In",
    group: "auth",
    el: <A.SignIn />,
    actions: [
      { match: "Sign in", to: "signin-loading" },
      { match: "Forgot password", to: "forgot" },
    ],
  },
  {
    id: "signin-loading",
    label: "Signing In",
    group: "auth",
    el: <A.SignInLoading />,
    advanceAnywhereTo: "mfa",
  },
  {
    id: "signin-error",
    label: "Wrong Credentials",
    group: "auth",
    el: <A.SignInError />,
    actions: [{ match: "Sign in", to: "signin-loading" }],
  },
  {
    id: "mfa",
    label: "MFA",
    group: "auth",
    el: <A.MfaChallenge />,
    actions: [{ match: "Confirm", to: "choose-role" }],
  },
  {
    id: "invite",
    label: "Accept Invitation",
    group: "auth",
    el: <A.AcceptInvite />,
    actions: [{ match: "Set password and continue", to: SIGNIN_ID }],
  },
  {
    id: "forgot",
    label: "Forgot Password",
    group: "auth",
    el: <A.ForgotPassword />,
    actions: [
      { match: "Send reset link", to: "forgot-sent" },
      { match: "Back to sign in", to: SIGNIN_ID },
    ],
  },
  {
    id: "forgot-sent",
    label: "Password Reset Sent",
    group: "auth",
    el: <A.ForgotPasswordSent />,
    actions: [{ match: "Send the link again", to: "forgot-sent" }],
  },
  {
    id: "no-role",
    label: "No Role Assigned",
    group: "auth",
    el: <A.NoRoleAssigned />,
    actions: [{ match: "Sign out", to: SIGNIN_ID }],
  },
  {
    id: "suspended",
    label: "Account Suspended",
    group: "auth",
    el: <A.AccountSuspended />,
    actions: [{ match: "Back to sign in", to: SIGNIN_ID }],
  },
  {
    id: "choose-role",
    label: "Choose Role",
    group: "auth",
    el: <A.ChooseRole />,
    actions: [
      { match: "Lecturer", to: "dash-lecturer" },
      { match: "Moderator", to: "dash-moderator" },
    ],
  },
  {
    id: "session-expiry",
    label: "Session Expiring",
    group: "auth",
    /*
      Wrapped despite being an auth-group screen. It is the only other
      screen in this build that renders the app shell, so left alone it
      would be the single nested sidebar in a prototype where every other
      shell is flat, and would read as a bug rather than as scope.
    */
    el: (
      <Flat>
        <A.SessionExpiryWarning />
      </Flat>
    ),
    actions: [{ match: "Sign me out now", to: SIGNIN_ID }],
  },
  {
    id: "revoked",
    label: "Access Revoked",
    group: "auth",
    el: <A.AccessRevokedMidSession />,
    actions: [{ match: "Back to sign in", to: SIGNIN_ID }],
  },

  /* -------------------------------------------------------- Dashboards */

  {
    id: "dash-officer",
    label: "Exam Officer Dashboard",
    group: "dashboard",
    el: (
      <Flat>
        <D.DashOfficer />
      </Flat>
    ),
  },
  {
    id: "dash-lecturer",
    label: "Lecturer Dashboard",
    group: "dashboard",
    el: (
      <Flat>
        <D.DashLecturer />
      </Flat>
    ),
  },
  {
    id: "dash-ta",
    label: "Teaching Assistant Dashboard",
    group: "dashboard",
    el: (
      <Flat>
        <D.DashTa />
      </Flat>
    ),
  },
  {
    id: "dash-moderator",
    label: "Moderator Dashboard",
    group: "dashboard",
    el: (
      <Flat>
        <D.DashModerator />
      </Flat>
    ),
  },
  {
    id: "dash-admin",
    label: "Institution Admin Dashboard",
    group: "dashboard",
    el: (
      <Flat>
        <D.DashAdmin />
      </Flat>
    ),
  },
  {
    id: "dash-management",
    label: "Senior Management Dashboard",
    group: "dashboard",
    el: (
      <Flat>
        <D.DashManagement />
      </Flat>
    ),
  },
  /* ---------------------------------------------------------- Sections */
  /*
    Added so the secondary tab row is actually visible. The flat sidebar moves
    a category's destinations into tabs, and every dashboard is a standalone
    destination with no siblings, so on dashboards alone the tab row correctly
    renders nothing and the change cannot be reviewed. These four are existing
    scaffold screens, imported live like everything else, chosen because each
    sits inside a category with more than one destination.
  */
  {
    id: "sec-scripts",
    label: "Scripts, Scan Batches",
    group: "section",
    el: (
      <Flat>
        <SC.ScanBatchUpload />
      </Flat>
    ),
  },
  {
    id: "sec-scripts-exceptions",
    label: "Scripts, Exception Queue",
    group: "section",
    el: (
      <Flat>
        <SC.IntegrityReport />
      </Flat>
    ),
  },
  {
    id: "sec-marking",
    label: "Marking, Assignment",
    group: "section",
    el: (
      <Flat>
        <W.MarkingAssignment />
      </Flat>
    ),
  },
  {
    id: "sec-exam-setup",
    label: "Exam Setup, Student Data",
    group: "section",
    el: (
      <Flat>
        <SD.StudentDataUpload />
      </Flat>
    ),
  },
];

export const AUTH_SCREENS = FLOW.filter((s) => s.group === "auth");
export const DASHBOARD_SCREENS = FLOW.filter((s) => s.group === "dashboard");

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
