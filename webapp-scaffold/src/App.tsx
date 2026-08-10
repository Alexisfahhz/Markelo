/*
  Screen harness. Not a product screen. It is a review tool.
  Pick any screen on the left, see it rendered at full app chrome on the right.
  This is the thing to open when recreating a screen in Figma.
*/
import React, { useState } from "react";
import * as A from "./screens/auth";
import * as O from "./screens/onboarding";
import * as D from "./screens/dashboards";
import * as AD from "./screens/admin";
import * as ST from "./screens/settings";
import * as C from "./screens/components";
import * as EX from "./screens/exam";
import * as SD from "./screens/studentdata";
import * as S from "./screens/scanning";
import * as T from "./screens/triage";
import * as W from "./screens/workload";
import { Logo } from "./ui/shell";

type Screen = { id: string; label: string; note?: string; el: React.ReactNode };
type Group = { title: string; owner: string; screens: Screen[] };

const GROUPS: Group[] = [
  {
    title: "Component reference",
    owner: "Team lead",
    screens: [
      { id: "cmp-notice", label: "Attention box", note: "all variants", el: <C.AttentionBoxes /> },
      { id: "cmp-tooltip", label: "Tooltip", note: "10 samples + animation spec", el: <C.TooltipSamples /> },
    ],
  },
  {
    title: "Sign in & account",
    owner: "Team lead",
    screens: [
      { id: "signin", label: "Sign in", el: <A.SignIn /> },
      { id: "signin-loading", label: "Sign in: signing in", el: <A.SignInLoading /> },
      { id: "signin-error", label: "Sign in: wrong details", el: <A.SignInError /> },
      { id: "mfa", label: "MFA check", note: "Admin, Moderator, Senior Mgmt", el: <A.MfaChallenge /> },
      { id: "invite", label: "Accept invitation", el: <A.AcceptInvite /> },
      { id: "forgot", label: "Forgot password", el: <A.ForgotPassword /> },
      { id: "forgot-sent", label: "Forgot password: sent", el: <A.ForgotPasswordSent /> },
      { id: "no-role", label: "No role assigned", el: <A.NoRoleAssigned /> },
      { id: "suspended", label: "Account suspended", el: <A.AccountSuspended /> },
      {
        id: "choose-role",
        label: "Choose role",
        note: "story I2, multi-role user",
        el: <A.ChooseRole />,
      },
      {
        id: "session-expiry",
        label: "Session about to expire",
        note: "story J4",
        el: <A.SessionExpiryWarning />,
      },
      {
        id: "revoked",
        label: "Access revoked mid-work",
        note: "story J5",
        el: <A.AccessRevokedMidSession />,
      },
    ],
  },
  {
    title: "Onboarding: Institution Admin",
    owner: "Team lead",
    screens: [
      { id: "ob-admin-1", label: "Welcome", el: <O.WelcomeAdmin /> },
      { id: "ob-admin-2", label: "Institution details", el: <O.AdminInstitutionDetails /> },
      { id: "ob-admin-3", label: "Booklet prompt", el: <O.AdminBookletPrompt /> },
      { id: "ob-admin-4", label: "Invite your team", el: <O.AdminInviteTeam /> },
      { id: "ob-admin-5", label: "Done", el: <O.OnboardingDone roleKey="admin" /> },
    ],
  },
  {
    title: "Onboarding: other roles",
    owner: "Team lead",
    screens: [
      { id: "ob-officer", label: "Exam Officer: welcome", el: <O.WelcomeOfficer /> },
      { id: "ob-officer-2", label: "Exam Officer: first run", el: <O.FirstRunEmptyDashboard /> },
      { id: "ob-lect", label: "Lecturer: welcome", el: <O.WelcomeLecturer /> },
      { id: "ob-lect-2", label: "Lecturer: anonymity", el: <O.MarkerAnonymityExplainer roleKey="lecturer" /> },
      { id: "ob-ta", label: "TA: welcome", el: <O.WelcomeTa /> },
      { id: "ob-ta-2", label: "TA: anonymity", el: <O.MarkerAnonymityExplainer roleKey="ta" /> },
      { id: "ob-mod", label: "Moderator: welcome", el: <O.WelcomeModerator /> },
      { id: "ob-mgmt", label: "Senior Mgmt: welcome", el: <O.WelcomeManagement /> },
      { id: "ob-done", label: "Done (any role)", el: <O.OnboardingDone roleKey="lecturer" /> },
    ],
  },
  {
    title: "Dashboards",
    owner: "Team lead",
    screens: [
      { id: "dash-officer", label: "Exam Officer", el: <D.DashOfficer /> },
      { id: "dash-lecturer", label: "Lecturer", el: <D.DashLecturer /> },
      { id: "dash-ta", label: "Teaching Assistant", note: "offline state", el: <D.DashTa /> },
      { id: "dash-moderator", label: "Moderator / HOD", note: "role switcher", el: <D.DashModerator /> },
      { id: "dash-admin", label: "Institution Admin", el: <D.DashAdmin /> },
      { id: "dash-management", label: "Senior Management", el: <D.DashManagement /> },
    ],
  },
  {
    title: "Phase 2: Institution Admin",
    owner: "KingFizzy",
    screens: [
      /* --- Institution Setup (combined: profile + People & Roles) --- */
      { id: "ad-setup", label: "Institution setup: default", note: "profile + People & Roles", el: <AD.InstitutionSetup /> },

      /* --- Institution Courses (I1) --- */
      { id: "ad-courses", label: "Courses: default", note: "I1", el: <AD.InstitutionCourses /> },
      { id: "ad-courses-empty", label: "Courses: empty", el: <AD.InstitutionCoursesEmpty /> },
      { id: "ad-courses-loading", label: "Courses: loading", el: <AD.InstitutionCoursesLoading /> },
      { id: "ad-courses-error", label: "Courses: error", el: <AD.InstitutionCoursesError /> },
      { id: "ad-courses-denied", label: "Courses: permission denied", el: <AD.InstitutionCoursesDenied /> },

      /* --- People & Roles (I2, I3, J5) --- */
      { id: "ad-people", label: "People & roles: default", note: "I2/I3/J5", el: <AD.PeopleRoles /> },
      { id: "ad-people-empty", label: "People & roles: empty", el: <AD.PeopleRolesEmpty /> },
      { id: "ad-people-loading", label: "People & roles: loading", el: <AD.PeopleRolesLoading /> },
      { id: "ad-people-error", label: "People & roles: error", el: <AD.PeopleRolesError /> },
      { id: "ad-people-denied", label: "People & roles: denied", el: <AD.PeopleRolesDenied /> },

      /* --- Booklet Profile Setup (A1) --- */
      { id: "ad-bp-setup", label: "Booklet setup: default", note: "A1", el: <AD.BookletProfileSetup /> },
      { id: "ad-bp-setup-empty", label: "Booklet setup: empty", el: <AD.BookletProfileSetupEmpty /> },
      { id: "ad-bp-setup-loading", label: "Booklet setup: loading", el: <AD.BookletProfileSetupLoading /> },
      { id: "ad-bp-setup-error", label: "Booklet setup: error", el: <AD.BookletProfileSetupError /> },
      { id: "ad-bp-setup-denied", label: "Booklet setup: denied", el: <AD.BookletProfileSetupDenied /> },

      /* --- Booklet Profile Validation (A2, A3) --- */
      { id: "ad-bp-validate", label: "Booklet validation: default", note: "A2/A3", el: <AD.BookletProfileValidation /> },
      { id: "ad-bp-validate-empty", label: "Booklet validation: empty", el: <AD.BookletProfileValidationEmpty /> },
      { id: "ad-bp-validate-loading", label: "Booklet validation: loading", el: <AD.BookletProfileValidationLoading /> },
      { id: "ad-bp-validate-error", label: "Booklet validation: error", el: <AD.BookletProfileValidationError /> },
      { id: "ad-bp-validate-denied", label: "Booklet validation: denied", el: <AD.BookletProfileValidationDenied /> },

      /* --- Booklet Profile Versioning (A4) --- */
      { id: "ad-bp-versions", label: "Booklet versions: default", note: "A4", el: <AD.BookletProfileVersioning /> },
      { id: "ad-bp-versions-empty", label: "Booklet versions: empty", el: <AD.BookletProfileVersioningEmpty /> },
      { id: "ad-bp-versions-loading", label: "Booklet versions: loading", el: <AD.BookletProfileVersioningLoading /> },
      { id: "ad-bp-versions-error", label: "Booklet versions: error", el: <AD.BookletProfileVersioningError /> },
      { id: "ad-bp-versions-denied", label: "Booklet versions: denied", el: <AD.BookletProfileVersioningDenied /> },

      /* --- Audit Trail (H1, F2) --- */
      { id: "ad-audit", label: "Audit trail: default", note: "H1/F2", el: <AD.AuditTrail /> },
      { id: "ad-audit-empty", label: "Audit trail: empty", el: <AD.AuditTrailEmpty /> },
      { id: "ad-audit-loading", label: "Audit trail: loading", el: <AD.AuditTrailLoading /> },
      { id: "ad-audit-error", label: "Audit trail: error", el: <AD.AuditTrailError /> },
      { id: "ad-audit-denied", label: "Audit trail: denied", el: <AD.AuditTrailDenied /> },

      /* --- Result Correction (G2) --- */
      { id: "ad-correction", label: "Result correction: default", note: "G2", el: <AD.ResultCorrection /> },
      { id: "ad-correction-editing", label: "Result correction: editing one", note: "the \"Correct\" destination", el: <AD.ResultCorrectionEditing /> },
      { id: "ad-correction-empty", label: "Result correction: empty", el: <AD.ResultCorrectionEmpty /> },
      { id: "ad-correction-loading", label: "Result correction: loading", el: <AD.ResultCorrectionLoading /> },
      { id: "ad-correction-error", label: "Result correction: error", el: <AD.ResultCorrectionError /> },
      { id: "ad-correction-denied", label: "Result correction: denied", el: <AD.ResultCorrectionDenied /> },

      /* --- Admin Settings (J2) --- */
      { id: "ad-settings", label: "Admin settings: default", note: "J2", el: <ST.AdminSettings /> },
      { id: "ad-settings-empty", label: "Admin settings: empty", el: <ST.AdminSettingsEmpty /> },
      { id: "ad-settings-loading", label: "Admin settings: loading", el: <ST.AdminSettingsLoading /> },
      { id: "ad-settings-error", label: "Admin settings: error", el: <ST.AdminSettingsError /> },
      { id: "ad-settings-denied", label: "Admin settings: denied", el: <ST.AdminSettingsDenied /> },
    ],
  },
  {
    title: "Exam setup",
    owner: "Designer 3",
    screens: [
      /* --- Exam Creation (PRD §10 step 1) --- */
      { id: "ex-create", label: "Exam creation: default", note: "PRD §10 step 1", el: <EX.ExamCreationScreen /> },
      { id: "ex-create-empty", label: "Exam creation: empty", note: "no courses exist", el: <EX.ExamCreationScreenEmpty /> },
      { id: "ex-create-loading", label: "Exam creation: loading", el: <EX.ExamCreationScreenLoading /> },
      { id: "ex-create-error", label: "Exam creation: error", el: <EX.ExamCreationScreenError /> },
      { id: "ex-create-denied", label: "Exam creation: denied", el: <EX.ExamCreationScreenDenied /> },

      /* --- Marking Scheme Setup (D1) --- */
      { id: "ms-setup", label: "Marking scheme: default", note: "D1", el: <EX.MarkingSchemeSetup /> },
      { id: "ms-setup-empty", label: "Marking scheme: empty", note: "marking cannot begin", el: <EX.MarkingSchemeSetupEmpty /> },
      { id: "ms-setup-loading", label: "Marking scheme: loading", el: <EX.MarkingSchemeSetupLoading /> },
      { id: "ms-setup-error", label: "Marking scheme: error", el: <EX.MarkingSchemeSetupError /> },
      { id: "ms-setup-denied", label: "Marking scheme: denied", el: <EX.MarkingSchemeSetupDenied /> },
    ],
  },
  {
    title: "Student data and results",
    owner: "Designer 4",
    screens: [
      /* --- Student Data Upload and Validation (PRD §10 step 2) --- */
      { id: "sd-upload", label: "Student data: default", note: "§10 step 2", el: <SD.StudentDataUpload /> },
      { id: "sd-upload-empty", label: "Student data: empty", note: "scanning cannot begin", el: <SD.StudentDataUploadEmpty /> },
      { id: "sd-upload-loading", label: "Student data: loading", el: <SD.StudentDataUploadLoading /> },
      { id: "sd-upload-error", label: "Student data: error", el: <SD.StudentDataUploadError /> },
      { id: "sd-upload-denied", label: "Student data: denied", el: <SD.StudentDataUploadDenied /> },

      /* --- Identity Registry (H2) --- */
      { id: "sd-registry", label: "Identity registry: default", note: "H2", el: <SD.IdentityRegistry /> },
      { id: "sd-registry-empty", label: "Identity registry: empty", el: <SD.IdentityRegistryEmpty /> },
      { id: "sd-registry-loading", label: "Identity registry: loading", el: <SD.IdentityRegistryLoading /> },
      { id: "sd-registry-error", label: "Identity registry: error", el: <SD.IdentityRegistryError /> },
      { id: "sd-registry-closed", label: "Identity registry: closed", note: "exam reached Marking status", el: <SD.IdentityRegistryClosed /> },
      { id: "sd-registry-denied", label: "Identity registry: denied", el: <SD.IdentityRegistryDenied /> },

      /* --- Result Processing and Export (G1) --- */
      { id: "sd-results", label: "Result processing: default", note: "G1", el: <SD.ResultProcessing /> },
      { id: "sd-results-empty", label: "Result processing: empty", el: <SD.ResultProcessingEmpty /> },
      { id: "sd-results-loading", label: "Result processing: loading", el: <SD.ResultProcessingLoading /> },
      { id: "sd-results-error", label: "Result processing: error", el: <SD.ResultProcessingError /> },
      { id: "sd-results-denied", label: "Result processing: denied", el: <SD.ResultProcessingDenied /> },
    ],
  },
  {
    title: "Phase 3: Scanning",
    owner: "Designer 5",
    screens: [
      /* --- Scan Batch Upload (B1) --- */
      { id: "sc-upload", label: "Scan batch upload: default", note: "B1", el: <S.ScanBatchUpload /> },
      { id: "sc-upload-empty", label: "Scan batch upload: empty", el: <S.ScanBatchUploadEmpty /> },
      { id: "sc-upload-loading", label: "Scan batch upload: uploading", el: <S.ScanBatchUploadLoading /> },
      { id: "sc-upload-error", label: "Scan batch upload: error", el: <S.ScanBatchUploadError /> },
      { id: "sc-upload-denied", label: "Scan batch upload: denied", el: <S.ScanBatchUploadDenied /> },
      {
        id: "sc-upload-preview",
        label: "Scan batch upload: booklet preview",
        note: "B1",
        el: <S.ScanBatchUploadWithPreview />,
      },

      /* --- AI Processing and Integrity Report (B2) --- */
      { id: "sc-report", label: "Integrity report: processing", note: "B2", el: <S.IntegrityReport /> },
      { id: "sc-report-done", label: "Integrity report: complete", el: <S.IntegrityReportComplete /> },
      { id: "sc-report-empty", label: "Integrity report: empty", el: <S.IntegrityReportEmpty /> },
      { id: "sc-report-loading", label: "Integrity report: starting", el: <S.IntegrityReportLoading /> },
      { id: "sc-report-error", label: "Integrity report: stopped", el: <S.IntegrityReportError /> },
      { id: "sc-report-denied", label: "Integrity report: denied", el: <S.IntegrityReportDenied /> },
    ],
  },
  {
    title: "Phase 4: Marking workload",
    owner: "Designer 7",
    screens: [
      /* --- Marking Assignment (D2) --- */
      { id: "wl-assign", label: "Marking assignment: default", note: "D2", el: <W.MarkingAssignment /> },
      { id: "wl-assign-empty", label: "Marking assignment: empty", el: <W.MarkingAssignmentEmpty /> },
      { id: "wl-assign-loading", label: "Marking assignment: loading", el: <W.MarkingAssignmentLoading /> },
      { id: "wl-assign-error", label: "Marking assignment: error", el: <W.MarkingAssignmentError /> },
      { id: "wl-assign-denied", label: "Marking assignment: denied", el: <W.MarkingAssignmentDenied /> },

      /* --- Marking Progress (D2, "own pace" persona rule) --- */
      { id: "wl-progress", label: "Marking progress: team (Lecturer)", note: "D2", el: <W.MarkingProgress /> },
      { id: "wl-progress-own", label: "Marking progress: your pace (TA)", note: "never compared to other TAs", el: <W.MarkingProgressOwn /> },
      { id: "wl-progress-empty", label: "Marking progress: empty", el: <W.MarkingProgressEmpty /> },
      { id: "wl-progress-loading", label: "Marking progress: loading", el: <W.MarkingProgressLoading /> },
      { id: "wl-progress-error", label: "Marking progress: error", el: <W.MarkingProgressError /> },
      { id: "wl-progress-denied", label: "Marking progress: denied", el: <W.MarkingProgressDenied /> },
    ],
  },
  {
    title: "Triage and review",
    owner: "Designer 6",
    screens: [
      /* --- Exception Queue (B3, B4, B5) --- */
      { id: "eq-pilot", label: "Exception queue: pilot mode", note: "B4, the current reality", el: <T.ExceptionQueuePilot /> },
      { id: "eq-normal", label: "Exception queue: normal mode", note: "B4, the end state", el: <T.ExceptionQueueNormal /> },
      { id: "eq-resolve", label: "Exception queue: resolve one", note: "B3, B5", el: <T.ExceptionQueueResolve /> },
      { id: "eq-empty", label: "Exception queue: empty", el: <T.ExceptionQueueEmpty /> },
      { id: "eq-loading", label: "Exception queue: loading", el: <T.ExceptionQueueLoading /> },
      { id: "eq-error", label: "Exception queue: error", el: <T.ExceptionQueueError /> },
      { id: "eq-denied", label: "Exception queue: denied", el: <T.ExceptionQueueDenied /> },

      /* --- Moderation Workspace (F1) --- */
      { id: "mod", label: "Moderation: side by side", note: "F1", el: <T.ModerationWorkspace /> },
      { id: "mod-changed", label: "Moderation: marks changed", note: "F1, score of record", el: <T.ModerationWorkspaceChanged /> },
      { id: "mod-return", label: "Moderation: return to marker", note: "F1, reason required", el: <T.ModerationWorkspaceReturn /> },
      { id: "mod-empty", label: "Moderation: empty", el: <T.ModerationWorkspaceEmpty /> },
      { id: "mod-loading", label: "Moderation: loading", el: <T.ModerationWorkspaceLoading /> },
      { id: "mod-error", label: "Moderation: not saved", el: <T.ModerationWorkspaceError /> },
      { id: "mod-denied", label: "Moderation: denied", el: <T.ModerationWorkspaceDenied /> },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.screens);

export default function App() {
  const [active, setActive] = useState("signin");
  const screen = ALL.find((s) => s.id === active) ?? ALL[0];
  const idx = ALL.findIndex((s) => s.id === active);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Harness rail */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <Logo />
          <span className="uppercase-label">Scaffold</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {GROUPS.map((g) => (
            <div key={g.title} className="mb-5">
              <p className="uppercase-label mb-2 px-2">{g.title}</p>
              <ul className="flex flex-col gap-0.5">
                {g.screens.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setActive(s.id)}
                      className={`w-full rounded-control px-2 py-1.5 text-left text-body transition-colors ${
                        s.id === active
                          ? "bg-brand-light font-semibold text-brand-dark"
                          : "text-text hover:bg-bg"
                      }`}
                    >
                      {s.label}
                      {s.note && <span className="block text-caption text-muted">{s.note}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="text-caption text-muted">
            {ALL.length} screens · Phase 1 to 4
          </p>
        </div>
      </aside>

      {/* Stage */}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-white px-6 py-3">
          <div>
            <p className="text-sub font-semibold text-text">{screen.label}</p>
            <p className="text-caption text-muted">
              Screen {idx + 1} of {ALL.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActive(ALL[Math.max(0, idx - 1)].id)}
              disabled={idx === 0}
              className="h-8 rounded-control border border-border bg-white px-3 text-caption text-text disabled:opacity-40 hover:bg-bg"
            >
              Previous
            </button>
            <button
              onClick={() => setActive(ALL[Math.min(ALL.length - 1, idx + 1)].id)}
              disabled={idx === ALL.length - 1}
              className="h-8 rounded-control border border-border bg-white px-3 text-caption text-text disabled:opacity-40 hover:bg-bg"
            >
              Next
            </button>
          </div>
        </div>

        {/*
          No NavVariantProvider here. The scaffold used to opt itself into the
          flat sidebar with one, which meant the flat shape depended on every
          host remembering to wrap. It is the scaffold default now, so a screen
          rendered anywhere gets it, including inside the review harness.
        */}
        <div className="min-h-0 flex-1 overflow-hidden p-6">{screen.el}</div>
      </main>
    </div>
  );
}
