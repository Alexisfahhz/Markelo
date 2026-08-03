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

export type FlowAction = { match: string; to: string };
export type FlowScreen = {
  id: string;
  label: string;
  group: "auth" | "dashboard";
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
    el: <A.SessionExpiryWarning />,
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
    el: <D.DashOfficer />,
  },
  {
    id: "dash-lecturer",
    label: "Lecturer Dashboard",
    group: "dashboard",
    el: <D.DashLecturer />,
  },
  {
    id: "dash-ta",
    label: "Teaching Assistant Dashboard",
    group: "dashboard",
    el: <D.DashTa />,
  },
  {
    id: "dash-moderator",
    label: "Moderator Dashboard",
    group: "dashboard",
    el: <D.DashModerator />,
  },
  {
    id: "dash-admin",
    label: "Institution Admin Dashboard",
    group: "dashboard",
    el: <D.DashAdmin />,
  },
  {
    id: "dash-management",
    label: "Senior Management Dashboard",
    group: "dashboard",
    el: <D.DashManagement />,
  },
];

export const AUTH_SCREENS = FLOW.filter((s) => s.group === "auth");
export const DASHBOARD_SCREENS = FLOW.filter((s) => s.group === "dashboard");

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
