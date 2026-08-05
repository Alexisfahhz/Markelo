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
  Lock,
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
          nested underneath. This is the default and is what the review
          scaffold on 5179 shows. Nothing about it changed.

  "flat"  The nine categories are the whole sidebar, one flat row each, and a
          category's destinations move out of the sidebar into a secondary tab
          row inside the page. Opted into by the prototype build on 5180.

  Why the split exists rather than one replacing the other: a teammate's point
  was that a nested sidebar is heavy for a lecturer or TA who is not
  particularly technical, and the flat shape answers that by never asking them
  to open anything to find their work. It is a real IA change, so it is being
  trialled on the prototype before the review scaffold follows.

  Defaulting to "tree" is deliberate: a context with no provider must leave
  existing screens exactly as they were.
*/
export type NavVariant = "tree" | "flat";
const NavVariantContext = React.createContext<NavVariant>("tree");

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
    <nav className="flex w-[236px] shrink-0 flex-col bg-brand-dark">
      {/*
        The institution selector, in the slot the reference gives its workspace
        switcher. Markelo has exactly one institution per deployment, so the
        control does not open anything yet; it is here because it is where a
        user looks to confirm whose data they are about to change, and PRD §6
        makes that a question worth answering before any of the rest.
      */}
      <div className="px-3 pb-2 pt-5">
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="flex w-full items-center gap-2.5 rounded-control border border-white/15 px-2.5 py-2 text-left transition-colors hover:bg-white/10"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-badge bg-white/10">
            <MarkeloMark className="h-4 w-auto text-on-dark" />
          </span>
          <span className="min-w-0 flex-1 truncate text-body font-medium text-on-dark">
            {INSTITUTION}
          </span>
          <ChevronsUpDown size={14} strokeWidth={2} className="shrink-0 text-on-dark/50" aria-hidden />
        </button>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group, gi) => {
          const label = group.label ?? group.items[0].label;
          const Icon = group.icon ?? group.items[0].icon;
          const reachable = group.items.some((i) => granted.has(i.label));
          const locked = !reachable;
          const active = group.label
            ? activeGroup?.label === group.label
            : activeLabel === label;

          return (
            <li key={group.label ?? `g${gi}`} className="relative">
              {active && (
                <span
                  aria-hidden
                  className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-pill bg-white"
                />
              )}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-current={active ? "page" : undefined}
                aria-disabled={locked || undefined}
                className={`flex items-center gap-3 rounded-control px-3 py-2.5 text-body transition-colors ${
                  active
                    ? "bg-white/12 font-semibold text-white"
                    : locked
                      ? "cursor-not-allowed text-on-dark/30"
                      : "text-on-dark/70 hover:bg-white/8 hover:text-on-dark"
                }`}
              >
                <Icon size={17} strokeWidth={2} className="shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {locked && (
                  <Lock
                    size={12}
                    strokeWidth={2.25}
                    className="shrink-0"
                    aria-label="You do not have access to this"
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-3 border-t border-white/10 px-3 pb-6 pt-4">
        {heldRoles && heldRoles.length > 1 && (
          <RoleSwitcher current={role.key} held={heldRoles} />
        )}
        <div className="px-2">
          <p className="uppercase-label !text-on-dark/60">Signed in as</p>
          <p className="text-body font-medium text-on-dark">{role.person}</p>
          <p className="text-caption text-on-dark/70">{role.title}</p>
        </div>
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
                    ? "cursor-not-allowed border-transparent text-muted/50"
                    : "border-transparent text-muted hover:text-text"
              }`}
            >
              <Icon size={16} strokeWidth={2} className="shrink-0" aria-hidden />
              {item.label}
              {locked && <Lock size={12} strokeWidth={2.25} className="shrink-0" aria-hidden />}
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

  return (
    <nav className="flex w-[236px] shrink-0 flex-col bg-brand-dark">
      <div className="flex flex-col gap-4 px-5 pb-4 pt-6">
        <Logo onDark />
        {/*
          Identity block, one line, not three.

          It carried the institution and the academic session too. Both are
          already printed in the top bar of every screen this sidebar appears
          on, so the sidebar was repeating them into its own narrowest column
          and spending about 34px of vertical space to do it. What is left is
          the only part that is not duplicated and the only part the menu needs:
          on a multi-role account every padlock below is calculated against the
          role named here, so the menu cannot be read correctly without it.
        */}
        <div className="flex flex-col gap-0.5 rounded-control bg-white/8 px-3 py-2">
          <span className="text-label uppercase tracking-[0.1em] text-on-dark/50">Working as</span>
          <span className="truncate text-body font-medium text-on-dark">{role.title}</span>
        </div>
      </div>

      {/*
        The menu scrolls on its own. The shared menu is 25 destinations across
        nine groups, which is taller than a 1024px frame once the logo, the
        identity block and the footer have taken their share. Letting the whole
        sidebar grow instead would push the role switcher and sign-out off the
        bottom of the screen, where they are unreachable.
      */}
      {/*
        A PARENT-CHILD TREE, not a flat list with headings.

        The flat version was too dense, and the reason is countable rather than
        a matter of taste: it drew 25 icons in a 236px column, one per row, so
        every row competed with every other row for the same first glance. Here
        only the nine parents carry an icon and the children are text on an
        indent rail. Nine focal points instead of 25, and the indent does the
        work the icons were failing to do, which is say what belongs to what.

        Children are keyboard-reachable in source order under their parent, so
        the visual nesting and the tab order agree.
      */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {NAV_GROUPS.map((group, gi) => {
          const reachable = group.items.filter((i) => granted.has(i.label)).length;

          /*
            A group with no children at all, currently only Dashboard, is its
            own destination and renders as a parent with nothing under it.
          */
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
                className={`flex items-center gap-3 rounded-control px-3 py-2.5 text-body transition-colors ${
                  active
                    ? "bg-brand font-semibold text-white"
                    : permitted
                      ? "text-on-dark/80 hover:bg-white/10"
                      : "cursor-not-allowed text-on-dark/35"
                }`}
              >
                <OnlyIcon size={17} strokeWidth={2} className="shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{only.label}</span>
              </a>
            );
          }

          const ParentIcon = group.icon;

          /*
            A parent with nothing in it for this role stays a parent and simply
            never opens. It is dimmed, carries one lock and a count, and shows
            no children.

            Measured before this existed: a Teaching Assistant saw 25 rows of
            which 21 were locked, with "My marking", the entire job, below seven
            padlocks and under the fold. The most junior role got the worst
            screen, which is the opposite of what a permission display is for.
            Collapsing rather than hiding keeps what KingFizzy and his teammate
            wanted: you can still see Moderation exists and is not yours.
          */
          if (reachable === 0) {
            return (
              <div key={group.label} className="mt-3">
                <div className="flex cursor-not-allowed items-center gap-3 px-3 py-2 text-body text-on-dark/30">
                  {ParentIcon && (
                    <ParentIcon size={17} strokeWidth={2} className="shrink-0" aria-hidden />
                  )}
                  <span className="min-w-0 flex-1 truncate">{group.label}</span>
                  <span className="text-caption tabular-nums">{group.items.length}</span>
                  <Lock
                    size={12}
                    strokeWidth={2.25}
                    className="shrink-0"
                    aria-label={`${group.label}: ${group.items.length} areas you do not have access to`}
                  />
                </div>
              </div>
            );
          }

          const isOpen = !closed.has(group.label);
          const panelId = `${uid}-${group.label.replace(/\W+/g, "-").toLowerCase()}`;
          /*
            A closed parent still says how many children it is hiding, using
            the same count-plus-glyph shape a fully-locked parent uses. Without
            it, closing a group makes its contents vanish with no trace, and
            the user has to remember what was there.
          */
          const hiddenCount = group.items.length;

          return (
            <div key={group.label} className="mt-5">
              {/*
                A real <button>, not a div with a click handler. It is a control
                that changes what is on screen, so it has to be reachable by
                keyboard and announce its state, which `aria-expanded` does and
                a styled div cannot.
              */}
              <button
                type="button"
                onClick={() => toggle(group.label!)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-left text-body font-medium text-on-dark transition-colors hover:bg-white/10"
              >
                {ParentIcon && (
                  <ParentIcon size={17} strokeWidth={2} className="shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1 truncate">{group.label}</span>
                {!isOpen && (
                  <span className="text-caption tabular-nums text-on-dark/45">{hiddenCount}</span>
                )}
                {/*
                  Only the chevron animates, and only its rotation.
                  IMPLEMENTATION_PLAN.md section 3 prohibits animating anything
                  but opacity and transform, because animating height forces a
                  layout recalculation every frame and that is visible jank on a
                  modest institution PC. So the rows appear and disappear
                  instantly and the chevron carries the sense of movement. This
                  is the one place the project rule overrides the usual
                  grid-template-rows 0fr-to-1fr reveal.
                */}
                <ChevronDown
                  size={14}
                  strokeWidth={2.25}
                  aria-hidden
                  className={`shrink-0 opacity-40 transition-transform duration-200 ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {/*
                The rail is a left border on the list, not a line drawn per row,
                so it is continuous by construction and cannot develop gaps when
                a row's height changes. It starts at 28px, which lines the
                children's text up under the parent's text rather than under
                the parent's icon.
              */}
              <ul
                id={panelId}
                hidden={!isOpen}
                className="ml-[27px] flex flex-col gap-0.5 border-l border-white/12 pl-2.5 pt-1"
              >
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
                        /*
                          A locked child is dimmed and gets no hover state, so
                          it never behaves like something that would respond. It
                          keeps its full label: greying it into unreadability
                          would defeat the point, which is that you can see what
                          exists and that it is not yours.
                        */
                        className={`flex items-center gap-2 rounded-control px-2.5 py-1.5 text-body transition-colors ${
                          active
                            ? "bg-brand font-semibold text-white"
                            : locked
                              ? "cursor-not-allowed text-on-dark/30"
                              : "text-on-dark/70 hover:bg-white/10 hover:text-on-dark"
                        }`}
                      >
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {locked ? (
                          <Lock
                            size={12}
                            strokeWidth={2.25}
                            className="shrink-0"
                            aria-label="You do not have access to this"
                          />
                        ) : (
                          permitted?.badge && (
                            <span className="shrink-0 rounded-pill bg-white/20 px-2 py-0.5 text-caption tabular-nums text-white">
                              {permitted.badge}
                            </span>
                          )
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/*
        The role title used to be repeated here under the person's name. It
        moved to the identity block at the top, where it has a job to do: it
        tells you which role the padlocks below are calculated against. Saying
        it twice in one 236px column made it read as decoration in both places.
      */}
      <div className="mt-auto flex flex-col gap-3 border-t border-white/10 px-3 pb-6 pt-4">
        {heldRoles && heldRoles.length > 1 && (
          <RoleSwitcher current={role.key} held={heldRoles} />
        )}
        <div className="px-2">
          <p className="uppercase-label !text-on-dark/60">Signed in as</p>
          <p className="text-body font-medium text-on-dark">{role.person}</p>
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
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#1a1a1a]/45 p-6">
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
