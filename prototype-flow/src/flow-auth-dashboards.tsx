/*
  ARCHIVED 2026-08-06. Superseded by flow.tsx (Institution & governance flow).

  This is the original auth + dashboards flow. To restore it as the 5180
  default, swap the two files:

    mv src/flow.tsx src/flow-governance.tsx
    mv src/flow-auth-dashboards.tsx src/flow.tsx

  The git tag archive/auth-dashboards-flow also captures this state at the
  commit before the archive was made.
*/

import React from "react";
import * as A from "../../webapp-scaffold/src/screens/auth";
import * as D from "../../webapp-scaffold/src/screens/dashboards";
import * as SC from "../../webapp-scaffold/src/screens/scanning";
import * as W from "../../webapp-scaffold/src/screens/workload";
import * as SD from "../../webapp-scaffold/src/screens/studentdata";
import { NavVariantProvider } from "../../webapp-scaffold/src/ui/shell";

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
  advanceAnywhereTo?: string;
};

export const SIGNIN_ID = "signin";

export const FLOW: FlowScreen[] = [
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