/*
  The application shell: sidebar, top bar, offline indicator.
  Every screen after sign-in renders inside this.
*/
import React from "react";
import { INSTITUTION, SESSION, Role, ROLES, RoleKey, NAV_GROUPS } from "../roles";
import { Badge } from "./kit";
import type { LucideIcon } from "lucide-react";
import {
  CloudOff,
  CloudUpload,
  CloudCheck,
  ChevronsUpDown,
  Check,
  UserLock,
  BookOpenCheck,
  EyeOff,
  PlugZap,
  ShieldCheck,
  Clock,
  AtSign,
  RotateCcw,
  Smartphone,
  UserCheck,
  KeyRound,
  MailCheck,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  ArtShield,
  ArtConnecting,
  ArtKeyRejected,
  ArtSecondCheck,
  ArtInvitation,
  ArtReissue,
  ArtSent,
  ArtNoRole,
  ArtSuspended,
  ArtRoles,
  ArtRevoked,
} from "./authart";
import { MarkeloMark } from "./logo";

/*
  NAVIGATION VARIANT.

  Two shapes of the same navigation exist, and which one renders is decided by
  context rather than a prop, so no screen has to pass it down through AppFrame.

  "tree"  The nine categories are expandable parents with their destinations
          nested underneath. The original shape. Nothing renders it now.

  "flat"  The nine categories are the whole sidebar, one flat row each, and a
          category's destinations move out of the sidebar into a secondary tab
          row inside the page.

  The split existed so the flat shape could be trialled on the 5180 prototype
  without disturbing the 5179 review scaffold. That trial is over: flat is the
  navigation, both builds render it, and the default below is what makes 5179
  pick it up without needing a provider anywhere.

  "tree" is kept rather than deleted because deleting it is a one-way door and
  nobody has called the shape settled. It is unreferenced: no provider passes
  it, so that branch is reachable only by changing this one line back.
*/
export type NavVariant = "tree" | "flat";
const NavVariantContext = React.createContext<NavVariant>("flat");

export function NavVariantProvider({
  value,
  children,
}: {
  value: NavVariant;
  children: React.ReactNode;
}) {
  return <NavVariantContext.Provider value={value}>{children}</NavVariantContext.Provider>;
}

/** The group a destination belongs to, or undefined for a standalone one. */
function groupOf(label: string) {
  return NAV_GROUPS.find((g) => g.items.some((i) => i.label === label));
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MarkeloMark className={`h-6 w-auto ${onDark ? "text-on-dark" : "text-brand"}`} />
      <span className={`text-sub font-bold ${onDark ? "text-on-dark" : "text-text"}`}>Markelo</span>
    </span>
  );
}

/*
  The circular mark that sits above the sign-in form. It is a different object
  from `Logo`, not a variant of it: `Logo` is an identifier in a corner and
  carries the wordmark, this one is the visual anchor a screen is composed
  around and carries no text, because the heading directly beneath it already
  says where you are.

  Three concentric circles, evenly spaced 14px apart, each fainter as it goes
  out: a solid tinted disc at 76px, then hairlines at 104px and 132px. They are
  drawn as three siblings rather than as `ring` utilities because a ring is
  painted at the element's own opacity, and the whole effect here depends on
  each circle being weaker than the one inside it. 0.75px is deliberate and
  sub-pixel: at a full 1px the outer ring reads as a border, which is a
  container, and the intent is a halo, which is not.

  The mark itself is the real logo from `logo.tsx`, tinted through
  `text-brand` so it moves with the token rather than carrying the source
  file's baked-in #0e3c75.
*/
export function LogoMark() {
  return (
    <span className="relative inline-grid h-[132px] w-[132px] place-items-center">
      <span
        className="absolute inset-0 rounded-pill border-[0.75px] border-brand/20"
        aria-hidden
      />
      <span
        className="absolute inset-3.5 rounded-pill border-[0.75px] border-brand/45"
        aria-hidden
      />
      <span className="absolute inset-7 rounded-pill bg-brand-light" aria-hidden />
      <MarkeloMark className="relative h-9 w-auto text-brand" />
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

/*
  THE FLAT SIDEBAR.

  Nine rows, one per category, and nothing nested. A category's destinations
  are not here at all: they render as a tab row inside the page, next to the
  content they filter. So the sidebar answers "which part of the product am I
  in" and the tabs answer "which view of it", and neither question is asked
  twice.

  The active row is marked two ways at once, a tinted fill and a bar pinned to
  the sidebar's outer edge. The bar is the load-bearing one: a fill alone is
  easy to lose against a dark panel at a glance, and the bar reads from the
  furthest left pixel of the screen, which is the first place the eye lands
  when scanning a left rail.

  Colours are Markelo's own. The reference this structure came from uses a
  light rail with a dark indicator; inverted onto `brand-dark` the same
  relationship is a white indicator over a white-tinted fill. The pattern was
  copied, the palette was not.
*/
function FlatSidebar({
  role,
  activeLabel,
  heldRoles,
}: {
  role: Role;
  activeLabel: string;
  heldRoles?: RoleKey[];
}) {
  const granted = new Set(role.nav.map((n) => n.label));
  const activeGroup = groupOf(activeLabel);

  return (
    <nav className="flex w-[236px] max-lg:w-[72px] shrink-0 flex-col bg-brand-dark">
      {/* Logo + Working as — Figma: 136.77px top section */}
      <div className="flex flex-col gap-4 px-[var(--sidebar-inset)] py-4 max-lg:items-center">
        <span className="inline-flex items-center gap-2">
          <MarkeloMark className="h-6 w-auto text-nav-brand" />
          <span className="text-[16px] font-extrabold leading-6 tracking-[0.01em] text-nav-brand max-lg:hidden">Markelo</span>
        </span>
        <div className="rounded-lg bg-white/[0.08] px-3 py-[7.28px] max-lg:hidden">
          <p className="text-[10px] font-semibold leading-4 tracking-[-0.01em] text-nav-label">WORKING AS</p>
          <p className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-white">{role.title}</p>
        </div>
      </div>

      {/* Nav items — Figma: 38.39px rows, 8px gap */}
      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-0">
        {NAV_GROUPS.map((group, gi) => {
          const label = group.label ?? group.items[0].label;
          const Icon = group.icon ?? group.items[0].icon;
          const reachable = group.items.some((i) => granted.has(i.label));
          const locked = !reachable;
          const active = group.label
            ? activeGroup?.label === group.label
            : activeLabel === label;

          return (
            <li key={group.label ?? `g${gi}`} className={`flex h-[38.39px] w-full items-center gap-2 ${locked ? "opacity-50" : ""}`}>
              <span aria-hidden className={`h-6 w-1 shrink-0 rounded-r-[4px] ${active && !locked ? "bg-nav-active" : "bg-transparent"}`} />
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-current={active && !locked ? "page" : undefined}
                aria-disabled={locked || undefined}
                title={label}
                className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 max-lg:justify-center max-lg:px-0 ${
                  active && !locked ? "bg-nav-active" : locked ? "" : "hover:bg-white/[0.06]"
                }`}
              >
                <Icon size={16} strokeWidth={1.33} className={`shrink-0 ${active && !locked ? "text-white" : "text-nav-label"}`} aria-hidden />
                <span className={`min-w-0 flex-1 truncate text-[14px] tracking-[-0.01em] leading-6 max-lg:hidden ${
                  active && !locked ? "font-bold text-white" : "font-semibold text-nav-label"
                }`}>{label}</span>
              </a>
              {locked && (
                <span className="mr-3 flex h-[38.39px] w-[40px] shrink-0 items-center justify-center max-lg:hidden">
                  <UserLock size={16} strokeWidth={1} className="text-nav-label" aria-label="You do not have access to this" />
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer — Figma: 80.15px, border-t 0.15px #8FB4E0 */}
      <div className="mt-auto flex flex-col gap-1 border-t border-nav-label/20 px-[var(--sidebar-inset)] py-3 max-lg:items-center">
        <div className="max-lg:hidden">{heldRoles && heldRoles.length > 1 && <RoleSwitcher current={role.key} held={heldRoles} />}</div>
        <p className="text-[10px] font-medium leading-4 tracking-[0.01em] text-nav-label max-lg:hidden">SIGNED IN AS</p>
        <p className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-nav-strong max-lg:hidden">{role.person}</p>
        <p className="text-[10px] font-medium leading-4 tracking-[0.01em] text-white max-lg:hidden">{role.title}</p>
      </div>
    </nav>
  );
}

/*
  The secondary tab row.

  Holds exactly what the flat sidebar gave up: the destinations inside the
  category you are in. It only renders when there is something to show, so a
  standalone destination such as Dashboard gets no empty tab strip under its
  title.

  A destination the role cannot reach stays visible and locked here for the
  same reason it did in the sidebar: seeing that a view exists and is somebody
  else's job is the point, and this is an audit product where the shape of the
  permission model is worth being legible.
*/
export function SectionTabs({ role, activeLabel }: { role: Role; activeLabel: string }) {
  const group = groupOf(activeLabel);
  if (!group?.label || group.items.length < 2) return null;
  const granted = new Set(role.nav.map((n) => n.label));

  return (
    <div className="border-b border-border bg-white px-8">
      <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label={group.label}>
        {group.items.map((item) => {
          const locked = !granted.has(item.label);
          const active = item.label === activeLabel;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={active}
              aria-disabled={locked || undefined}
              onClick={(e) => e.preventDefault()}
              className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-body transition-colors ${
                active
                  ? "border-brand font-semibold text-brand"
                  : locked
                    ? "cursor-not-allowed border-transparent text-muted/90"
                    : "border-transparent text-muted hover:text-text"
              }`}
            >
              <Icon size={16} strokeWidth={2} className="shrink-0" aria-hidden />
              {item.label}
              {locked && <UserLock size={14} strokeWidth={2.25} className="shrink-0" aria-hidden />}
            </button>
          );
        })}
      </div>
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
  const variant = React.useContext(NavVariantContext);
  if (variant === "flat") {
    return <FlatSidebar role={role} activeLabel={activeLabel} heldRoles={heldRoles} />;
  }

  /*
    The role's own nav array is the permission source. This turns it into two
    lookups so the shared menu below can be rendered once and locked per role,
    without a second, drifting copy of who-can-do-what living in the sidebar.
  */
  const granted = new Map(role.nav.map((n) => [n.label, n]));

  /*
    Every parent this role can reach starts open, and clicking one closes it.
    That order matters: the alternative, starting closed and clicking to open,
    hides the whole product behind nine clicks on first run, and principle P3
    assumes no training and low technical confidence. A user who has never seen
    Markelo should not have to discover that the menu has contents.

    It also keeps the structure visible in the html-to-design export, which is
    what this build exists for. A collapsed export would carry nine rows and
    none of the tree.

    Closed state is per role because the key includes `role.key`: switching
    role rebuilds the map rather than carrying one role's closed groups onto
    another's menu, where the labels may not even exist.
  */
  /*
    `useId` scopes the panel ids to this Sidebar instance. Derived from the
    group label alone they collided: the prototype canvas renders all six role
    dashboards on one page, so six sidebars each emitted `nav-exam-setup`, and
    an `aria-controls` on one screen resolved to a panel on another. Invalid
    HTML, and it would have sent a screen reader to the wrong element.
  */
  const uid = React.useId();
  const [closed, setClosed] = React.useState<Set<string>>(new Set());
  React.useEffect(() => setClosed(new Set()), [role.key]);
  const toggle = (label: string) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  /*
    Figma-matched sidebar (2026-08-06 CSS). 38.39px row height, 16px icons
    at 1.33px stroke, #4A76C4 active fill + 4px indicator, #8FB4E0 labels,
    0.5 opacity locked rows, #DBE2FD logo. Top section 136.77px with Markelo
    wordmark and WORKING AS badge. Footer 80.15px with #FBFCFF name.
  */
  return (
    <nav className="flex w-[236px] max-lg:w-[72px] shrink-0 flex-col bg-brand-dark">
      <div className="flex flex-col gap-4 px-[var(--sidebar-inset)] py-4 max-lg:items-center">
        <span className="inline-flex items-center gap-2">
          <MarkeloMark className="h-6 w-auto text-nav-brand" />
          <span className="text-[16px] font-extrabold leading-6 tracking-[0.01em] text-nav-brand max-lg:hidden">Markelo</span>
        </span>
        <div className="rounded-lg bg-white/[0.08] px-3 py-[7.28px] max-lg:hidden">
          <p className="text-[10px] font-semibold leading-4 tracking-[-0.01em] text-nav-label">WORKING AS</p>
          <p className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-white">{role.title}</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {NAV_GROUPS.map((group) => {
            const reachable = group.items.filter((i) => granted.has(i.label)).length;

            if (!group.label) {
              const only = group.items[0];
              const permitted = granted.get(only.label);
              const active = !!permitted && only.label === activeLabel;
              const OnlyIcon = only.icon;
              return (
                <a
                  key={only.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-disabled={!permitted || undefined}
                  title={only.label}
                  className={`flex h-[38.39px] w-full items-center gap-2 max-lg:justify-center max-lg:px-0 ${!permitted ? "opacity-50" : ""}`}
                >
                  <span aria-hidden className={`h-6 w-1 shrink-0 rounded-r-[4px] ${active && permitted ? "bg-nav-active" : "bg-transparent"}`} />
                  <span className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 ${active && permitted ? "bg-nav-active" : ""}`}>
                    <OnlyIcon size={16} strokeWidth={1.33} className={`shrink-0 ${active && permitted ? "text-white" : "text-nav-label"}`} aria-hidden />
                    <span className={`min-w-0 flex-1 truncate text-[14px] tracking-[-0.01em] leading-6 max-lg:hidden ${active && permitted ? "font-bold text-white" : "font-semibold text-nav-label"}`}>{only.label}</span>
                  </span>
                  {!permitted && (
                    <span className="mr-3 flex h-[38.39px] w-[40px] shrink-0 items-center justify-center max-lg:hidden">
                      <UserLock size={16} strokeWidth={1} className="text-nav-label" aria-label="You do not have access to this" />
                    </span>
                  )}
                </a>
              );
            }

            const ParentIcon = group.icon;

            if (reachable === 0) {
              return (
                <div key={group.label} className="flex h-[38.39px] w-full items-center gap-2 opacity-50">
                  <span aria-hidden className="h-6 w-1 shrink-0 rounded-r-[4px] bg-transparent" />
                  <span className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2">
                    {ParentIcon && <ParentIcon size={16} strokeWidth={1.33} className="shrink-0 text-nav-label" aria-hidden />}
                    <span className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.01em] leading-6 text-nav-label">{group.label}</span>
                  </span>
                  <span className="mr-3 flex h-[38.39px] w-[40px] shrink-0 items-center justify-center max-lg:hidden">
                    <UserLock size={16} strokeWidth={1} className="text-nav-label" aria-label={`${group.label}: locked`} />
                  </span>
                </div>
              );
            }

            const isOpen = !closed.has(group.label);
            const panelId = `${uid}-${group.label.replace(/\W+/g, "-").toLowerCase()}`;

            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() => toggle(group.label!)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex h-[38.39px] w-full items-center gap-2 hover:bg-white/[0.04]"
                >
                  <span aria-hidden className="h-6 w-1 shrink-0 rounded-r-[4px] bg-transparent" />
                  <span className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2">
                    {ParentIcon && <ParentIcon size={16} strokeWidth={1.33} className="shrink-0 text-nav-label" aria-hidden />}
                    <span className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.01em] leading-6 text-nav-label">{group.label}</span>
                  </span>
                  <span className="mr-3 flex h-[38.39px] w-[40px] shrink-0 items-center justify-center gap-1">
                    {!isOpen && <span className="text-[12px] leading-4 text-nav-label">{group.items.length}</span>}
                    <ChevronDown size={14} strokeWidth={1.67} aria-hidden className={`shrink-0 text-nav-label transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
                  </span>
                </button>

                <ul id={panelId} hidden={!isOpen} className="ml-7 flex flex-col gap-2 border-l border-white/[0.08] py-1">
                  {group.items.map((item) => {
                    const permitted = granted.get(item.label);
                    const locked = !permitted;
                    const active = !locked && item.label === activeLabel;
                    return (
                      <li key={item.label}>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          aria-disabled={locked || undefined}
                          title={item.label}
                          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[14px] tracking-[-0.01em] leading-6 max-lg:justify-center max-lg:px-0 ${locked ? "opacity-50 cursor-not-allowed" : ""} ${
                            active ? "bg-nav-active font-bold text-white" : locked ? "font-semibold text-nav-label" : "font-semibold text-nav-label hover:bg-white/[0.06]"
                          }`}
                        >
                          <span className="min-w-0 flex-1 truncate max-lg:hidden">{item.label}</span>
                          {locked ? (
                            <UserLock size={16} strokeWidth={1} className="shrink-0 text-nav-label" aria-label="You do not have access to this" />
                          ) : permitted?.badge ? (
                            <span className="shrink-0 rounded-pill bg-white/20 px-2 py-0.5 text-[12px] leading-4 tabular-nums text-white">{permitted.badge}</span>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-nav-label/20 px-[var(--sidebar-inset)] py-3 max-lg:items-center">
        <div className="max-lg:hidden">{heldRoles && heldRoles.length > 1 && <RoleSwitcher current={role.key} held={heldRoles} />}</div>
        <p className="text-[10px] font-medium leading-4 tracking-[0.01em] text-nav-label max-lg:hidden">SIGNED IN AS</p>
        <p className="text-[14px] font-semibold leading-6 tracking-[-0.01em] text-nav-strong max-lg:hidden">{role.person}</p>
        <p className="text-[10px] font-medium leading-4 tracking-[0.01em] text-white max-lg:hidden">{role.title}</p>
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
  const navVariant = React.useContext(NavVariantContext);
  return (
    <div className="relative flex h-full min-h-0 overflow-hidden rounded-card border border-border bg-bg">
      <Sidebar role={role} activeLabel={activeLabel} heldRoles={heldRoles} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} sub={sub} offline={offline} />
        {/*
          Only the flat variant has a tab row, because only the flat variant
          took the destinations out of the sidebar. In the tree variant they
          are still nested in the rail and a second copy here would be the
          same list twice.
        */}
        {navVariant === "flat" && <SectionTabs role={role} activeLabel={activeLabel} />}
        <div className="min-h-0 flex-1 overflow-y-auto p-8">{children}</div>
      </div>
      {overlay && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-text/45 p-6">
          {overlay}
        </div>
      )}
    </div>
  );
}

/**
 * Centred frame used by every signed-out screen.
 *
 * `mark` draws the circular logo above the form. It defaults on, because every
 * signed-out screen is a place where a user needs to know whose product they
 * are looking at before they type anything into it. The two screens that turn
 * it off are the ones already showing a large status object of their own,
 * where a second circular thing above it competes rather than orients.
 */
export function AuthFrame({
  children,
  aside,
  mark = true,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  mark?: boolean;
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
        <div className="w-full max-w-lg">
          {mark && (
            <div className="mb-6 flex justify-center">
              <LogoMark />
            </div>
          )}
          {children}
        </div>
      </div>
      <aside className="hidden w-[42%] shrink-0 flex-col justify-between bg-brand-dark p-10 lg:flex">
        <Logo onDark />
        {aside ?? <AuthAside {...ASIDE.signin} />}
        <p className="text-caption text-on-dark/50">
          Markelo: Examination Operating System
        </p>
      </aside>
    </div>
  );
}

/*
  The right-hand panel.

  Each bullet gets an icon in a tinted square rather than a text bullet glyph.
  On a dark panel a `·` at body size is nearly invisible, so the list read as
  three loose sentences instead of three claims. The square gives each line a
  fixed left edge and a shape to scan down, which is the same job the glyph was
  failing at.

  `art` is optional. A screen with nothing meaningful to draw gets no drawing,
  rather than a decorative one that says nothing.
*/
export function AuthAside({
  title,
  points,
  art,
  chip,
}: {
  title: string;
  points: { icon: LucideIcon; text: string }[];
  art?: React.ReactNode;
  chip?: React.ReactNode;
}) {
  return (
    /*
      `overflow-hidden` is the safety net that lets the art keep a floor. The
      art now refuses to shrink below 150px, because at the sizes it was
      reaching on a short panel it read as a stray thumbnail rather than an
      illustration. That floor means on a genuinely tiny panel the composition
      could exceed the space, so the panel clips instead of letting anything
      escape into the footer line.
    */
    <div className="flex min-h-0 flex-1 flex-col justify-center gap-6 overflow-hidden py-4">
      {/*
        `min-h-0 flex-1` is what makes the artwork the part that yields. The
        headline, the bullets and the chip are all content that must stay
        readable, so they size themselves; the drawing takes whatever height is
        left and shrinks to nothing on a very short panel rather than pushing
        the footer into the text. Without `min-h-0` a flex child refuses to go
        below its content size and the overlap comes back.
      */}
      {art && <div className="flex min-h-0 flex-1 items-center justify-center">{art}</div>}
      <p className="text-title font-bold leading-snug text-on-dark">{title}</p>
      <ul className="flex flex-col gap-3">
        {points.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.text} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-control bg-white/10">
                <Icon size={16} strokeWidth={2} className="text-on-dark" aria-hidden />
              </span>
              <span className="text-body text-on-dark/80">{p.text}</span>
            </li>
          );
        })}
      </ul>
      {chip}
    </div>
  );
}

/*
  One aside per signed-out screen. They live together in one map rather than
  inline in each screen so the twelve can be read as a set and checked for
  repetition, which is how the copy stays distinct.

  Every headline states what is true right now from the user's side. None of
  them describes what the system is doing internally, and none claims a
  capability the PRD does not.
*/
export const ASIDE: Record<
  string,
  { title: string; points: { icon: LucideIcon; text: string }[]; art?: React.ReactNode; chip?: React.ReactNode }
> = {
  signin: {
    title: "Your exam process does not change. What sits underneath it is now provable.",
    points: [
      { icon: BookOpenCheck, text: "Works with the answer booklets you already use." },
      { icon: EyeOff, text: "No marker ever sees whose script they are marking." },
      { icon: PlugZap, text: "Marking keeps working when the power or network drops." },
    ],
    art: <ArtShield />,
    chip: (
      <Badge tone="brand" pill>
        <span className="font-mono">MK-000245</span>, what a marker sees instead of a name
      </Badge>
    ),
  },
  connecting: {
    title: "Checking your details against your institution's record.",
    points: [
      { icon: ShieldCheck, text: "Your password is never stored in a form anyone can read." },
      { icon: Clock, text: "This normally takes a second or two." },
    ],
    art: <ArtConnecting />,
  },
  rejected: {
    title: "Almost always a typo in the email, not a forgotten password.",
    points: [
      { icon: AtSign, text: "Institution emails end in your school's own domain." },
      { icon: RotateCcw, text: "Five failed tries locks the account for fifteen minutes." },
    ],
    art: <ArtKeyRejected />,
  },
  mfa: {
    title: "Your role can change institution records, so Markelo checks twice.",
    points: [
      { icon: ShieldCheck, text: "Asked every sign-in for Admin, Moderator and Senior Management." },
      { icon: Smartphone, text: "The code goes to the device your Admin registered for you." },
    ],
    art: <ArtSecondCheck />,
  },
  invite: {
    title: "Someone at your institution put you here deliberately.",
    points: [
      { icon: UserCheck, text: "Your Institution Admin created this account and chose your role." },
      { icon: KeyRound, text: "Set a password now and the invitation link stops working." },
    ],
    art: <ArtInvitation />,
  },
  forgot: {
    title: "Passwords are replaced, never recovered.",
    points: [
      { icon: EyeOff, text: "Nobody at your institution can read your old password." },
      { icon: MailCheck, text: "The reset link goes only to your registered work email." },
    ],
    art: <ArtReissue />,
  },
  sent: {
    title: "Check the inbox for your work email, including the spam folder.",
    points: [
      { icon: Clock, text: "The link works once, and expires after one hour." },
      { icon: MailCheck, text: "Nothing changes until you open it and set a new password." },
    ],
    art: <ArtSent />,
  },
  norole: {
    title: "Your account exists. It has no role attached to it yet.",
    points: [
      { icon: ShieldCheck, text: "Markelo gives no access by default, on purpose." },
      { icon: UserCheck, text: "Your Institution Admin assigns the role, and access starts immediately." },
    ],
    art: <ArtNoRole />,
  },
  suspended: {
    title: "Access is paused. Nothing you did has been deleted.",
    points: [
      { icon: ShieldCheck, text: "Every mark you submitted is kept exactly as you left it." },
      { icon: UserCheck, text: "Only your Institution Admin can lift a suspension." },
    ],
    art: <ArtSuspended />,
  },
  roles: {
    title: "You hold more than one role. Choose the one you are working as.",
    points: [
      { icon: Layers, text: "What you can see and do changes with the role you pick." },
      { icon: RotateCcw, text: "You can switch at any time without signing out." },
    ],
    art: <ArtRoles />,
  },
  /*
    There is no `expiring` entry. "Session about to expire" is a modal drawn
    over the marking screen inside `AppFrame`, not a signed-out screen, so it
    has no aside slot to fill. `ArtExpiring` exists in authart.tsx for the day
    that screen wants it, and is deliberately not wired here rather than being
    given a panel it cannot render into.
  */
  revoked: {
    title: "Your access changed while you were working.",
    points: [
      { icon: CloudCheck, text: "Work you had already submitted is saved and untouched." },
      { icon: UserCheck, text: "Your Institution Admin can tell you what changed and why." },
    ],
    art: <ArtRevoked />,
  },
};
