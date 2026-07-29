/*
  The application shell: sidebar, top bar, offline indicator.
  Every screen after sign-in renders inside this.
*/
import React from "react";
import { INSTITUTION, SESSION, Role, ROLES, RoleKey } from "../roles";
import { Badge } from "./kit";
import { CloudOff, CloudUpload, CloudCheck, ChevronsUpDown, Check } from "lucide-react";

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-badge bg-brand text-sub font-bold text-white">
        M
      </span>
      <span className={`text-sub font-bold ${onDark ? "text-on-dark" : "text-text"}`}>Markelo</span>
    </span>
  );
}

/** PRD §9.6 / §15: Offline Sync Status Indicator, V1 basic. User Story E1/E2. */
export function OfflineIndicator({ state }: { state: "online" | "offline" | "syncing" }) {
  if (state === "online")
    return (
      <span className="inline-flex items-center gap-1.5 text-caption text-muted">
        <CloudCheck size={15} strokeWidth={2} className="text-success" aria-hidden />
        All work saved
      </span>
    );
  if (state === "syncing")
    return (
      <span className="inline-flex items-center gap-1.5 text-caption text-brand-dark">
        <CloudUpload size={15} strokeWidth={2} className="animate-pulse text-brand" aria-hidden />
        Saving your work…
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-caption font-medium text-badge-pending-text">
      <CloudOff size={15} strokeWidth={2} className="text-warning" aria-hidden />
      Offline. Work is saved on this device
    </span>
  );
}

/*
  User Story I2: a person can hold more than one role at once (Lecturer + HOD
  is the named example). Permissions are the union of all their active roles,
  so the interface has to let them switch which one they are working as.
  This control only appears when a person actually holds more than one role.
*/
export function RoleSwitcher({
  current,
  held,
  onDark = true,
}: {
  current: RoleKey;
  held: RoleKey[];
  onDark?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  if (held.length < 2) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-control border px-3 py-2 text-left transition-colors ${
          onDark
            ? "border-white/20 text-on-dark hover:bg-white/10"
            : "border-border text-text hover:bg-bg"
        }`}
      >
        <span className="min-w-0">
          <span className={`block text-caption ${onDark ? "text-on-dark/60" : "text-muted"}`}>
            Working as
          </span>
          <span className="block truncate text-body font-medium">{ROLES[current].title}</span>
        </span>
        <ChevronsUpDown size={15} strokeWidth={2} className="shrink-0 opacity-70" aria-hidden />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-full overflow-hidden rounded-card border border-border bg-white">
          <p className="border-b border-border px-3 py-2">
            <span className="uppercase-label">Your roles at this institution</span>
          </p>
          {held.map((k) => (
            <button
              key={k}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-body text-text hover:bg-bg"
            >
              {ROLES[k].title}
              {k === current && (
                <Check size={15} strokeWidth={2.5} className="text-brand" aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  role,
  activeLabel,
  heldRoles,
}: {
  role: Role;
  activeLabel: string;
  /** User Story I2: pass more than one to show the role switcher. */
  heldRoles?: RoleKey[];
}) {
  return (
    <nav className="flex w-[236px] shrink-0 flex-col gap-6 bg-brand-dark px-3 py-6">
      <div className="px-2">
        <Logo onDark />
      </div>

      <ul className="flex flex-col gap-1">
        {role.nav.map((item) => {
          const active = item.label === activeLabel;
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`flex items-center gap-2.5 rounded-control px-3 py-2 text-body transition-colors ${
                  active
                    ? "bg-brand font-semibold text-white"
                    : "text-on-dark/75 hover:bg-brand hover:text-white"
                }`}
              >
                <Icon size={17} strokeWidth={2} className="shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="shrink-0 rounded-pill bg-white/20 px-2 py-0.5 text-caption tabular-nums text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-3">
        {heldRoles && heldRoles.length > 1 && (
          <RoleSwitcher current={role.key} held={heldRoles} />
        )}
        <div className="rounded-card border border-white/15 px-3 py-3">
          <p className="uppercase-label !text-on-dark/60">Signed in as</p>
          <p className="text-body font-medium text-on-dark">{role.person}</p>
          <p className="text-caption text-on-dark/70">{role.title}</p>
        </div>
      </div>
    </nav>
  );
}

export function TopBar({
  title,
  sub,
  right,
  offline = "online",
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  offline?: "online" | "offline" | "syncing";
}) {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-border bg-white px-8 py-4">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-section font-semibold text-text">{title}</h1>
        {sub && <p className="text-caption text-muted">{sub}</p>}
      </div>
      <div className="flex items-center gap-5">
        <OfflineIndicator state={offline} />
        <div className="hidden text-right lg:block">
          <p className="text-caption font-medium text-text">{INSTITUTION}</p>
          <p className="text-caption text-muted">{SESSION}</p>
        </div>
      </div>
      {right}
    </header>
  );
}

/** Full app frame: sidebar + top bar + scrollable content. */
export function AppFrame({
  role,
  activeLabel = "Dashboard",
  title,
  sub,
  offline,
  heldRoles,
  overlay,
  children,
}: {
  role: Role;
  activeLabel?: string;
  title: string;
  sub?: string;
  offline?: "online" | "offline" | "syncing";
  heldRoles?: RoleKey[];
  /** A modal rendered over the whole frame, used for session expiry (J4). */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full min-h-0 overflow-hidden rounded-card border border-border bg-bg">
      <Sidebar role={role} activeLabel={activeLabel} heldRoles={heldRoles} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} sub={sub} offline={offline} />
        <div className="min-h-0 flex-1 overflow-y-auto p-8">{children}</div>
      </div>
      {overlay && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#1a1a1a]/45 p-6">
          {overlay}
        </div>
      )}
    </div>
  );
}

/** Centred frame used by every signed-out screen. */
export function AuthFrame({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-card border border-border bg-white">
      <div className="flex min-w-0 flex-1 items-center justify-center overflow-y-auto p-10">
        {/*
          512px, was 384px. At 384 the two CTAs measured 187 + 185 + 12 gap =
          exactly 384. Zero slack, so any longer label or different font
          metrics pushed the primary button out of the frame. It also forced
          role badges to wrap onto two lines. 512 gives real headroom.
          TODO(token): needs a Figma variable for the auth/form column width.
        */}
        <div className="w-full max-w-lg">{children}</div>
      </div>
      <aside className="hidden w-[42%] shrink-0 flex-col justify-between bg-brand-dark p-10 lg:flex">
        <Logo onDark />
        {aside ?? <DefaultAside />}
        <p className="text-caption text-on-dark/50">
          Markelo: Examination Operating System
        </p>
      </aside>
    </div>
  );
}

function DefaultAside() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-title font-bold leading-snug text-on-dark">
        Your exam process does not change. What sits underneath it is now provable.
      </p>
      <ul className="flex flex-col gap-3 text-body text-on-dark/80">
        <li className="flex gap-2">
          <span className="text-on-dark">·</span> Works with the answer booklets you already use.
        </li>
        <li className="flex gap-2">
          <span className="text-on-dark">·</span> No marker ever sees whose script they are marking.
        </li>
        <li className="flex gap-2">
          <span className="text-on-dark">·</span> Marking keeps working when the power or network drops.
        </li>
      </ul>
      <Badge tone="brand" pill>
        <span className="font-mono">MK-000245</span>, what a marker sees instead of a name
      </Badge>
    </div>
  );
}
