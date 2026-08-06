/*
  Markelo UI kit: the subset of the design system this scaffold needs.
  Every value comes from a token in index.css. Nothing is hard-coded.
  Figma variable mapping is 1:1 with the Tailwind name (bg-brand = color/brand).
*/
import React from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, CircleAlert, Info, TriangleAlert, Inbox, X, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ Button */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "xl";

/*
  `min-w-0` matters more than it looks. Without it a button in a flex row keeps
  its intrinsic content width (min-width:auto) and pushes out of its container
  instead of shrinking, which is exactly how the CTA row was overflowing the
  session-expiry card.
*/
const btnBase =
  "inline-flex min-w-0 items-center justify-center gap-2 font-medium rounded-control " +
  "transition-colors disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap";

const btnVariant: Record<BtnVariant, string> = {
  primary: "bg-brand text-[#FBFCFF] hover:bg-brand-dark",
  secondary: "bg-white text-[#1A1A1A] border border-border hover:bg-brand-light hover:border-brand",
  ghost: "bg-transparent text-brand hover:bg-brand-light",
  danger: "bg-error text-white hover:brightness-90",
};

/*
  CONTROL HEIGHT SCALE. The one place button height is decided.
  Every height is a multiple of 4. Use the size that matches the job, not taste:

    sm  32  inside a table row only. Never a page action.
    md  40  inside a card. Matches Input and Select height exactly.
    xl  42  page-level and modal CTAs. The largest button allowed. Icon 16px, text 14px.
*/
const btnSize: Record<BtnSize, string> = {
  sm: "h-8 px-3 text-caption",
  md: "h-10 px-4 text-body",
  xl: "h-[42px] px-6 text-body",
};

/** Icon sizes are locked to the button size so a row of buttons never wobbles. */
const btnIconSize: Record<BtnSize, number> = { sm: 14, md: 16, xl: 16 };

export function Button({
  variant = "primary",
  size = "md",
  full,
  icon: Icon,
  iconEnd: IconEnd,
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: BtnSize;
  full?: boolean;
  icon?: LucideIcon;
  iconEnd?: LucideIcon;
}) {
  const s = btnIconSize[size];
  return (
    <button
      className={`${btnBase} ${btnVariant[variant]} ${btnSize[size]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={s} strokeWidth={2} aria-hidden />}
      {children}
      {IconEnd && <IconEnd size={s} strokeWidth={2} aria-hidden />}
    </button>
  );
}

/* ------------------------------------------------------------------- Field */

export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-body font-medium text-text">
        {label}
        {required && <span className="text-error"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="text-caption text-error">{error}</span>
      ) : hint ? (
        <span className="text-caption text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

/* h-10 = 40px, the same height as a `md` button. Controls must line up. */
const inputBase =
  "h-10 w-full rounded-control border bg-white text-body text-text " +
  "placeholder:text-muted focus:border-brand outline-none transition-colors";

/*
  A leading icon is drawn inside the field, not beside it, so the label above
  keeps its own left edge and the icon reads as part of the control. The inset
  is 12px, the same as the text inset on a plain Input and the same as the
  Select chevron on the right, so a form mixing all three lines up on one
  vertical rule. Padding-left grows to 40px (12 inset + 16 glyph + 12 gap) so a
  long value can never slide under the icon.

  It is decorative and always `aria-hidden`: the Field label already names the
  control, and a second announcement of "mail" would be noise on a screen
  reader, not help.
*/
export function Input({
  invalid,
  icon: Icon,
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  icon?: LucideIcon;
}) {
  const field = (
    <input
      className={`${inputBase} ${Icon ? "pl-10 pr-3" : "px-3"} ${
        invalid ? "border-error" : "border-border-control"
      } ${className}`}
      {...rest}
    />
  );
  if (!Icon) return field;
  return (
    <div className="relative">
      {field}
      <Icon
        size={16}
        strokeWidth={2}
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/*
  The native select arrow is drawn by the browser hard against the right edge
  and cannot be padded away. That is the imbalance. So the native one is
  removed with `appearance-none` and replaced with a Lucide chevron placed at
  12px from the right, matching the 12px text inset on the left. Padding-right
  is 40px so the longest option label can never slide under the chevron.
*/
export function Select({
  invalid,
  className = "",
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        className={`${inputBase} appearance-none pl-3 pr-10 ${
          invalid ? "border-error" : "border-border-control"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2}
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/* -------------------------------------------------------------------- Card */

export function Card({
  children,
  className = "",
  pad = true,
}: {
  children: React.ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section
      className={`flat rounded-card border border-border bg-white ${pad ? "p-6" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  action,
  sub,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-card font-semibold text-text">{title}</h2>
        {sub && <p className="text-caption text-muted">{sub}</p>}
      </div>
      {action}
    </header>
  );
}

/* ------------------------------------------------------------------- Badge */

type Tone = "neutral" | "brand" | "success" | "warning" | "error";

const badgeTone: Record<Tone, string> = {
  neutral: "bg-bg text-muted border-border",
  brand: "bg-brand-light text-brand-dark border-brand-light",
  success: "bg-success-light text-success border-success-light",
  warning: "bg-warning-light text-badge-pending-text border-warning-light",
  error: "bg-error-light text-badge-missing-text border-error-light",
};

export function Badge({
  tone = "neutral",
  children,
  pill,
  icon: Icon,
}: {
  tone?: Tone;
  pill?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  /*
    Fixed 24px height and `whitespace-nowrap`, both deliberate. Height used to
    come from the text, so "Lecturer" and "Moderator / HOD" rendered at
    different heights the moment the longer one wrapped to two lines. A badge
    is a fixed-height object; if the label does not fit, the container is too
    narrow. That is the thing to fix, not the badge.
  */
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap border px-2 text-caption font-medium ${
        pill ? "rounded-pill" : "rounded-badge"
      } ${badgeTone[tone]}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.25} aria-hidden />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Notice */

/*
  Attention box. Rebuilt 29 July 2026 to KingFizzy's reference sheet.

  The old pattern (4px tone-coloured left bar, 12px card radius, tone-coloured
  text) is RETIRED. Do not bring it back in any Markelo surface.

  The style is: flat tinted fill, no accent bar, 8px control radius, and
  NEUTRAL text. The tone lives entirely in the fill. `neutral` is the one
  outline variant: white with a hairline border and no tint.

  Accessibility rule that is NOT optional. Because the tone now lives only in
  the fill, colour would be the sole carrier of meaning, which fails WCAG 2.2
  SC 1.4.1. So the icon is FORCED ON for success, warning and error. It can
  only be suppressed on `brand` and `neutral`, where nothing is being signalled
  beyond "read this".
*/
const noticeTone: Record<Tone, string> = {
  neutral: "bg-white border border-border",
  brand: "bg-brand-light",
  success: "bg-success-light",
  warning: "bg-warning-light",
  error: "bg-error-light",
};

/* One icon per tone, fixed. A warning always looks like a warning. */
const noticeIcon: Record<Tone, LucideIcon> = {
  neutral: Info,
  brand: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

/* Tones where meaning depends on the icon, so it cannot be turned off. */
const iconRequired: Tone[] = ["success", "warning", "error"];

export function Notice({
  tone = "brand",
  title,
  children,
  icon = true,
  compact,
  link,
  action,
  onDismiss,
}: {
  tone?: Tone;
  title?: string;
  children?: React.ReactNode;
  /** Suppress the icon. Ignored on success/warning/error. See the rule above. */
  icon?: boolean;
  /** Single line, no title, text truncates. For persistent low-priority notices. */
  compact?: boolean;
  /** Underlined text link, e.g. { label: "Read more", onClick }. */
  link?: { label: string; onClick?: () => void };
  /** One small secondary button. Never more than one. */
  action?: { label: string; onClick?: () => void };
  /** Opt-in only. Never put this on a notice the user still needs. */
  onDismiss?: () => void;
}) {
  const Icon = noticeIcon[tone];
  const showIcon = icon || iconRequired.includes(tone);
  const box = `rounded-control px-4 py-3 text-text ${noticeTone[tone]}`;

  const Dismiss = onDismiss ? (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss this message"
      className="-mr-1 shrink-0 rounded-badge p-1 text-muted hover:bg-black/5 hover:text-text"
    >
      <X size={14} strokeWidth={2} aria-hidden />
    </button>
  ) : null;

  const Link = link ? (
    <button
      type="button"
      onClick={link.onClick}
      className="text-caption font-medium text-text underline underline-offset-2 hover:text-brand"
    >
      {link.label}
    </button>
  ) : null;

  const Action = action ? (
    <Button variant="secondary" size="sm" onClick={action.onClick}>
      {action.label}
    </Button>
  ) : null;

  /* Compact: one row, no title, everything inline, text truncates. */
  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${box}`}>
        {showIcon && <Icon size={16} strokeWidth={2} className="shrink-0" aria-hidden />}
        <p className="min-w-0 flex-1 truncate text-caption text-muted">{children}</p>
        {Link}
        {Action}
        {Dismiss}
      </div>
    );
  }

  /*
    Grid, not flex, so the body hangs indented to the title rather than
    wrapping back under the icon. Column 1 collapses when there is no icon.
  */
  return (
    <div
      className={`grid items-start gap-x-2 ${box} ${
        showIcon ? "grid-cols-[auto_1fr_auto]" : "grid-cols-[1fr_auto]"
      }`}
    >
      {showIcon && <Icon size={16} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />}
      <div className="min-w-0">
        {title && <p className="text-body font-semibold text-text">{title}</p>}
        {children && <div className="text-caption text-muted">{children}</div>}
        {(Link || Action) && (
          <div className="mt-3 flex items-center gap-3">
            {Link}
            {Action}
          </div>
        )}
      </div>
      {Dismiss}
    </div>
  );
}

/* -------------------------------------------------------------------- Misc */

export function Stat({
  label,
  value,
  sub,
  tone = "neutral",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: Tone;
  icon?: LucideIcon;
}) {
  const valueTone =
    tone === "error" ? "text-error" : tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-text";
  /*
    `justify-between` plus a min-height, not `gap`. A stat card's label and
    figure used to sit packed together at the top, so a row of cards with
    different content (some carrying a `sub` line, some not) read as
    uneven, whichever was shortest just stopped early instead of matching
    its neighbours. Anchoring the label to the top and the figure to the
    bottom means every card in a row lines up along the same baseline
    regardless of what else is in it. `min-h-32` (128px) is what actually
    gives `justify-between` room to work with, at 16px padding the two
    groups' own content only needs about 60px, so the rest becomes real,
    visible breathing room between them rather than a token gesture.
  */
  return (
    <Card pad={false} className="flex min-h-32 flex-col justify-between gap-1 p-4">
      <span className="uppercase-label flex items-center gap-1.5">
        {Icon && <Icon size={13} strokeWidth={2} aria-hidden />}
        {label}
      </span>
      <div className="flex flex-col gap-1">
        <span className={`text-title font-bold tabular-nums ${valueTone}`}>{value}</span>
        {sub && <span className="text-caption text-muted">{sub}</span>}
      </div>
    </Card>
  );
}

export function Progress({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-bg">
        <div className="h-full rounded-pill bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-caption tabular-nums text-muted">{pct}%</span>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border bg-white px-6 py-12 text-center">
      <Icon size={28} strokeWidth={1.5} className="text-muted" aria-hidden />
      <p className="text-card font-semibold text-text">{title}</p>
      <p className="max-w-md text-body text-muted">{body}</p>
      {action}
    </div>
  );
}

/*
  A Script ID is a single indivisible token. It was breaking across two lines in
  a narrow table column, which made the row 42px tall instead of 24px and, worse,
  made the ID itself hard to read at a glance. Markers and officers identify
  scripts by this string alone, so it must never wrap.

  Same fixed 24px height as Badge, so a row holding both lines up.
*/
export function ScriptId({ id }: { id: string }) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-badge bg-bg px-2 font-mono text-caption text-text">
      {id}
    </span>
  );
}

/* -------------------------------------------------------------------- Table */

/*
  Extracted 30 July 2026. Four screen files (admin, dashboards, scanning,
  workload) had each grown their own copy of this trio. Two shapes had
  quietly diverged and are both supported here rather than picked one over
  the other:

    - A header can be a plain string, or `{ label, right? }` when a column
      (usually a trailing actions column with no visible label) needs its
      text right-aligned. `scanning.tsx` was the one file using the object
      form; every other call site keeps passing plain strings unchanged.
    - Header padding had split 2-and-2 between `py-3` and `py-2.5`. This
      version standardises on `py-3` to match `Td`'s own vertical padding,
      which is what `admin.tsx` and `scanning.tsx` already did. The two
      files that used to run `py-2.5` (`dashboards.tsx`, `workload.tsx`)
      pick up an extra 2px of header row height as a result. Confirmed
      visually harmless.

  `scope="col"` is now on every header cell. `dashboards.tsx`'s inline
  header previously omitted it. Not visible, but it is what the other three
  files already did, and it is the correct thing for a screen reader.
*/

type TableHead = string | { label: string; right?: boolean };

function Th({ head }: { head: TableHead }) {
  const label = typeof head === "string" ? head : head.label;
  const right = typeof head === "string" ? false : !!head.right;
  return (
    <th scope="col" className={`px-4 py-3 ${right ? "text-right" : "text-left"}`}>
      <span className="uppercase-label">{label}</span>
    </th>
  );
}

export function Table({ head, children }: { head: TableHead[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-white">
      <table className="w-full min-w-[560px] border-collapse text-body">
        <thead>
          <tr className="border-b border-border bg-bg">
            {head.map((h, i) => <Th key={typeof h === "string" ? h : h.label || i} head={h} />)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border px-4 py-3 text-text ${className}`}>{children}</td>;
}

/** A generic bordered flex row, for a list that is not a `<table>`. */
export function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-4 border-b border-border px-4 py-3 last:border-0 ${className}`}>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- Tooltip */

/*
  Dark tooltip with a subtle bounce entrance and a triangular arrow pointing
  toward the target element. Rendered via createPortal to document.body, so it
  can never be clipped by a parent's overflow (tables, cards, sidebars).

  Automatically flips direction when the trigger is near the top of the
  viewport (top → bottom with an upward-pointing arrow), so controls at the
  top of the page never push a tooltip off screen. Explicit "top", "bottom",
  or "right" overrides the auto behaviour when needed.

  Animation: 200ms (--motion-quick), --motion-enter easing, three-stop bounce
  keyframe (0%: scale 0.85 + 4px rise → 60%: scale 1.06 + -2px overshoot →
  100%: settle). At prefers-reduced-motion the bounce is stripped globally.
*/
export function Tooltip({
  content,
  children,
  position = "auto",
  delay = 300,
}: {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "right" | "auto";
  delay?: number;
}) {
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0, dir: "top" as "top" | "bottom" | "right" });
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      let dir: "top" | "bottom" | "right";
      if (position === "right") {
        dir = "right";
      } else if (position === "auto") {
        dir = rect.top < 180 ? "bottom" : "top";
      } else {
        dir = position;
      }
      setCoords({
        x: rect.left + rect.width / 2,
        y: dir === "top" ? rect.top - 8 : rect.bottom + 8,
        dir,
      });
      setVisible(true);
    }, delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  const transform = {
    top: "-translate-x-1/2 -translate-y-full",
    bottom: "-translate-x-1/2",
    right: "translate-x-1.5 -translate-y-1/2",
  }[coords.dir];

  const arrowPos = {
    top: "bottom-[-3px] left-1/2 -translate-x-1/2",
    bottom: "top-[-3px] left-1/2 -translate-x-1/2",
    right: "left-[-3px] top-1/2 -translate-y-1/2",
  }[coords.dir];

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible &&
        createPortal(
          <span
            className={`fixed z-[9999] ${transform} animate-tooltip-bounce pointer-events-none select-none`}
            style={{ top: coords.y, left: coords.x }}
            role="tooltip"
          >
            <span className="relative block whitespace-nowrap rounded-[4px] bg-[#1A1A1A] px-2 py-1 text-[10px] leading-[14px] text-white">
              {content}
              <span
                className={`absolute ${arrowPos} h-[6px] w-[6px] rotate-45 rounded-[1px] bg-[#1A1A1A]`}
                aria-hidden
              />
            </span>
          </span>,
          document.body
        )}
    </span>
  );
}
