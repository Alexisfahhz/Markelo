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

/*
  The circular mark that sits above the sign-in form. It is a different object
  from `Logo`, not a variant of it: `Logo` is an identifier in a corner and
  always carries the wordmark, this one is the visual anchor a screen is
  composed around and carries no text, because the heading directly beneath it
  already says where you are.

  The concentric ring is a halo, not a border. It is drawn as a second element
  rather than a `ring` utility so it can sit at a lower opacity than the mark
  without dragging the mark's own contrast down with it.

  TODO(asset): the inner mark is the placeholder `M` from `Logo`. KingFizzy's
  real logo file replaces the contents of the inner span and nothing else.
*/
export function LogoMark() {
  return (
    <span className="relative inline-grid h-20 w-20 place-items-center">
      <span className="absolute inset-0 rounded-pill bg-brand-light" aria-hidden />
      <span className="absolute inset-2 rounded-pill bg-white" aria-hidden />
      <span className="relative grid h-11 w-11 place-items-center rounded-card bg-brand text-section font-bold text-white">
        M
      </span>
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
  /*
    The role's own nav array is the permission source. This turns it into two
    lookups so the shared menu below can be rendered once and locked per role,
    without a second, drifting copy of who-can-do-what living in the sidebar.
  */
  const granted = new Map(role.nav.map((n) => [n.label, n]));

  return (
    <nav className="flex w-[236px] shrink-0 flex-col bg-brand-dark">
      <div className="flex flex-col gap-4 px-5 pb-4 pt-6">
        <Logo onDark />
        {/*
          Identity block. Which institution, which academic session, and which
          role you are currently acting as. It sits above the menu rather than
          in the footer because on a multi-role account every lock below it is
          only true *for the role named here*, so the menu cannot be read
          correctly without it.
        */}
        <div className="flex flex-col gap-0.5 rounded-control bg-white/8 px-3 py-2.5">
          <span className="truncate text-caption font-medium text-on-dark">{INSTITUTION}</span>
          <span className="truncate text-caption text-on-dark/55">{SESSION}</span>
          <span className="mt-1 truncate text-caption font-semibold text-on-dark/90">
            {role.title}
          </span>
        </div>
      </div>

      {/*
        The menu scrolls on its own. The shared menu is 25 destinations across
        nine groups, which is taller than a 1024px frame once the logo, the
        identity block and the footer have taken their share. Letting the whole
        sidebar grow instead would push the role switcher and sign-out off the
        bottom of the screen, where they are unreachable.
      */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        {NAV_GROUPS.map((group, gi) => {
          const reachable = group.items.filter((i) => granted.has(i.label)).length;
          /*
            A group with nothing in it for this role collapses to its own
            label plus a count.

            Measured before this existed: a Teaching Assistant saw 25 rows of
            which 21 were locked, and "My marking", which is the entire job,
            sat below seven padlocks and under the fold. The most junior role
            got the worst screen, which is the opposite of what a permission
            display is for.

            It collapses rather than disappears, so the thing KingFizzy and his
            teammate actually wanted still holds: you can see Moderation exists
            and that it is not yours. You just do not have to scroll past it to
            reach your own work. Roles that own most of the product, Admin and
            Exam Officer, barely notice this; the roles that own little are the
            ones it rescues.
          */
          if (group.label && reachable === 0) {
            return (
              <div key={group.label} className={gi === 0 ? "" : "mt-4"}>
                <div className="flex items-center gap-2 px-3 py-1.5 text-label uppercase tracking-[0.1em] text-on-dark/30">
                  <span className="min-w-0 flex-1 truncate">{group.label}</span>
                  <span className="tabular-nums">{group.items.length}</span>
                  <Lock
                    size={12}
                    strokeWidth={2.25}
                    aria-label={`${group.label}: ${group.items.length} areas you do not have access to`}
                  />
                </div>
              </div>
            );
          }
          return (
          <div key={group.label ?? `g${gi}`} className={gi === 0 ? "" : "mt-4"}>
            {group.label && (
              <p className="px-3 pb-1.5 text-label uppercase tracking-[0.1em] text-on-dark/40">
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const permitted = granted.get(item.label);
                const locked = !permitted;
                const active = !locked && item.label === activeLabel;
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      aria-disabled={locked || undefined}
                      /*
                        A locked row is dimmed and gets no hover state, so it
                        never behaves like something that would respond. It
                        keeps its icon and full label: greying the label out
                        into unreadability would defeat the whole point, which
                        is that you can see what exists and that it is not
                        yours.
                      */
                      className={`flex items-center gap-2.5 rounded-control px-3 py-2 text-body transition-colors ${
                        active
                          ? "bg-brand font-semibold text-white"
                          : locked
                            ? "cursor-not-allowed text-on-dark/35"
                            : "text-on-dark/75 hover:bg-brand hover:text-white"
                      }`}
                    >
                      <Icon size={17} strokeWidth={2} className="shrink-0" aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {locked ? (
                        <Lock
                          size={12}
                          strokeWidth={2.25}
                          className="shrink-0 text-on-dark/35"
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
    <div className="flex min-h-0 flex-1 flex-col justify-center gap-6 py-4">
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
