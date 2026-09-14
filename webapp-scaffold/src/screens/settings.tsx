/*
  Institution & governance: Admin Settings.

  Story J2: MFA is required for Institution Admin and above (§9.1.1).
  Five states: default, empty, loading, error, permission-denied.
*/
import React from "react";
import { AppFrame } from "../ui/shell";
import {
  Button, Card, CardHeader, Badge, Notice, Field,
  Input, Select, EmptyState,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  Building2, ShieldCheck, Bell, FileText,
  Settings, RotateCcw, Save,
} from "lucide-react";

function SkeletonCards() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <div className="flex flex-col gap-3">
            <div className="h-5 w-40 animate-pulse rounded bg-bg" />
            <div className="h-4 w-full animate-pulse rounded bg-bg" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-bg" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* --------------------------------------------------- 1. Admin Settings */

export function AdminSettings() { return <AdminSettingsDefault />; }

function AdminSettingsDefault() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Settings" title="Settings" sub="Configure institution-wide defaults, security policy, and notification preferences. All changes take effect immediately">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader
            title="Institution profile"
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
              <Field label="Current academic session" hint="e.g. 2025/2026 First Semester">
                <Select defaultValue="2025-2026-1">
                  <option value="2025-2026-1">2025/2026, First Semester</option>
                  <option value="2024-2025-2">2024/2025, Second Semester</option>
                </Select>
              </Field>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader
            title="Security & MFA policy"
            sub="Multi-factor authentication is required for roles with elevated access per User Story J2"
          />
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <Notice tone="brand" title="MFA is enforced for Institution Admin and above">
              Exam Officer, Institution Admin, Senior Management, and any role with Identity Registry access must use MFA.
              Lecturers and Teaching Assistants can opt in but are not required to.
            </Notice>
            <div className="flex flex-col gap-3">
              <Field label="MFA enforcement level">
                <Select defaultValue="admin-up">
                  <option value="admin-up">Institution Admin and above</option>
                  <option value="officer-up">Exam Officer and above</option>
                  <option value="all">All users</option>
                </Select>
              </Field>
              <Field label="Session timeout" hint="Users are signed out after this period of inactivity">
                <Select defaultValue="30">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </Select>
              </Field>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader
            title="Notifications"
            sub="The Institution Admin receives these emails by default. Lecturers and markers have their own notification preferences"
          />
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            {[
              { label: "Result corrections", description: "When a result is unlocked and corrected by an Exam Officer", enabled: true },
              { label: "Role changes", description: "When someone is assigned, promoted, suspended, or removed", enabled: true },
              { label: "Booklet profile updates", description: "When a booklet profile is modified, validated, or versioned", enabled: true },
              { label: "Scan batch completion", description: "When a batch has finished scanning and the integrity report is ready", enabled: false },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col gap-0.5">
                  <span className="text-body font-medium text-text">{n.label}</span>
                  <span className="text-caption text-muted">{n.description}</span>
                </div>
                <Badge tone={n.enabled ? "success" : "neutral"}>
                  {n.enabled ? "On" : "Off"}
                </Badge>
              </div>
            ))}
          </form>
        </Card>

        <Card>
          <CardHeader
            title="Results & exports"
            sub="Default grade scale and result processing preferences. Individual courses can override these"
          />
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Default grade scale">
                <Select defaultValue="5-point">
                  <option value="5-point">5-point (A, B, C, D, F)</option>
                  <option value="7-point">7-point (A, AB, B, BC, C, D, F)</option>
                  <option value="percentage">Percentage only</option>
                </Select>
              </Field>
              <Field label="Export format" hint="The default file format for giving results to your institution's portal">
                <Select defaultValue="csv">
                  <option value="csv">CSV (comma-separated)</option>
                  <option value="xlsx">Excel workbook (.xlsx)</option>
                  <option value="pdf">PDF report</option>
                </Select>
              </Field>
            </div>
            <Field label="CA-to-Exam split" hint="This is the default. A lecturer can adjust it per course during marking scheme setup">
              <Select defaultValue="30-70">
                <option value="30-70">30% CA, 70% Exam</option>
                <option value="40-60">40% CA, 60% Exam</option>
                <option value="50-50">50% CA, 50% Exam</option>
              </Select>
            </Field>
          </form>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="xl">Cancel</Button>
          <Button size="xl" icon={Save}>Save settings</Button>
        </div>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------------- 2. Empty */

export function AdminSettingsEmpty() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Settings" title="Settings" sub="Configure institution-wide defaults from one place">
      <EmptyState
        icon={Settings}
        title="Settings not yet configured"
        body="The first Institution Admin has not set up institution-level defaults yet. Security, notifications, and result policies will appear here once they are configured."
        action={<Button icon={Settings}>Set up defaults</Button>}
      />
    </AppFrame>
  );
}

/* --------------------------------------------------- 3. Loading */

export function AdminSettingsLoading() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Settings" title="Settings" sub="Loading configuration…">
      <SkeletonCards />
    </AppFrame>
  );
}

/* --------------------------------------------------- 4. Error */

export function AdminSettingsError() {
  return (
    <AppFrame role={ROLES.admin} activeLabel="Settings" title="Settings" sub="Configure institution-wide defaults from one place">
      <Notice tone="error" title="Could not load settings">
        The configuration could not be retrieved. Check your connection and try again.
      </Notice>
      <div className="mt-4">
        <Button variant="secondary" icon={RotateCcw}>Try again</Button>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------------- 5. Permission denied */

export function AdminSettingsDenied() {
  return (
    <AppFrame role={ROLES.ta} activeLabel="Settings" title="Settings">
      <Notice tone="error" title="You do not have permission to view this page">
        Institution Settings are available to Institution Admin only.
        If you need a setting changed, ask your Institution Admin.
      </Notice>
    </AppFrame>
  );
}

/* =====================================================================
   6. USER SETTINGS (Screen #56)
   Personal preferences, offline cache, and notifications (Marker / User)
   ===================================================================== */

export function UserSettings() {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppFrame
      role={ROLES.lecturer}
      activeLabel="Settings"
      title="User Settings"
      sub="Manage your personal preferences, local offline marking cache, and notification triggers"
    >
      <div className="flex flex-col gap-6">
        {saved && (
          <Notice tone="brand" title="Preferences updated">
            Your personal settings and offline cache configurations have been saved.
          </Notice>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Section 1: Profile & Credentials */}
          <Card>
            <CardHeader
              title="Personal profile & role assignment"
              sub="Credentials managed through your institutional directory (LDAP/SSO)"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full name">
                <Input defaultValue="Dr. Balogun Salami" disabled />
              </Field>
              <Field label="Institutional email">
                <Input defaultValue="b.salami@yabatech.edu.ng" disabled />
              </Field>
              <Field label="Department / Faculty">
                <Input defaultValue="Computer Science · School of Technology" disabled />
              </Field>
              <Field label="Active assigned roles">
                <div className="flex items-center gap-2 pt-2">
                  <Badge tone="brand" pill>Lecturer (Primary)</Badge>
                  <Badge tone="neutral" pill>Moderator (Secondary)</Badge>
                </div>
              </Field>
            </div>
          </Card>

          {/* Section 2: Offline Cache & Workspace Preferences */}
          <Card>
            <CardHeader
              title="Marking workspace & offline cache"
              sub="Configure local script pre-fetching to prevent marking interruptions during network drops"
            />
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Offline script pre-fetch quota"
                  hint="How many assigned scripts to keep cached locally in browser storage"
                >
                  <Select defaultValue="25">
                    <option value="10">10 scripts (Low bandwidth / mobile hotspot)</option>
                    <option value="25">25 scripts (Recommended for campus Wi-Fi)</option>
                    <option value="50">50 scripts (Heavy marking sessions)</option>
                    <option value="all">All assigned scripts</option>
                  </Select>
                </Field>
                <Field
                  label="Auto-save frequency"
                  hint="Every keystroke is saved to local cache; this controls cloud sync frequency"
                >
                  <Select defaultValue="instant">
                    <option value="instant">Instantaneous (sync on mark enter)</option>
                    <option value="15s">Every 15 seconds</option>
                    <option value="30s">Every 30 seconds</option>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Image scan rendering quality"
                  hint="Higher quality increases zoom clarity; standard uses less storage"
                >
                  <Select defaultValue="balanced">
                    <option value="performance">Standard (150 DPI · fast loading)</option>
                    <option value="balanced">High definition (200 DPI · balanced)</option>
                    <option value="maximum">Maximum detail (300 DPI · high fidelity)</option>
                  </Select>
                </Field>
                <Field
                  label="Thumbnail rail position in viewer"
                  hint="Placement of the page thumbnail filmstrip"
                >
                  <Select defaultValue="left">
                    <option value="left">Left vertical sidebar (Default)</option>
                    <option value="bottom">Bottom horizontal rail</option>
                  </Select>
                </Field>
              </div>

              <div className="rounded-control bg-bg/80 p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-caption font-semibold text-text">Local Cache Storage Usage</p>
                  <p className="text-[11px] text-muted">Currently using 48.2 MB of 2.0 GB allocated browser space</p>
                </div>
                <Button variant="secondary" size="sm">
                  Clear offline cache
                </Button>
              </div>
            </div>
          </Card>

          {/* Section 3: Notification Preferences */}
          <Card>
            <CardHeader
              title="Notifications & alert thresholds"
              sub="Choose which examination events send in-app and email notices"
            />
            <div className="flex flex-col gap-3 text-caption">
              {[
                { label: "Teaching Assistant escalations", desc: "Notify me immediately when a TA flags an ambiguous question" },
                { label: "Moderation returns", desc: "Notify me when a script is returned by the department moderator with written feedback" },
                { label: "Session expiry reminders", desc: "Show an on-screen warning 3 minutes before automatic 15-minute inactivity sign-out" },
                { label: "Exam submission deadlines", desc: "Daily summary of remaining unmarked scripts before Senate deadline" },
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 rounded-control border border-border p-3 cursor-pointer hover:bg-bg/40">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border text-brand" />
                  <div>
                    <p className="font-semibold text-text">{item.label}</p>
                    <p className="text-[11px] text-muted">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="secondary">Reset to defaults</Button>
            <Button type="submit" icon={Save}>Save preferences</Button>
          </div>
        </form>
      </div>
    </AppFrame>
  );
}