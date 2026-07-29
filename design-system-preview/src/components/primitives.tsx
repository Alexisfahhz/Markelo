import React from "react";
import type { Icon } from "@tabler/icons-react";

/* ============================================================
   BUTTONS  (PDF §5)
   Primary #1A56A0 / secondary outline / danger / ghost / disabled.
   Radius 8 (control), padding 10px 20px, SemiBold 14. One primary
   per screen. Always verb-first labels.
   ============================================================ */

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold " +
  "transition-transform active:translate-y-px disabled:pointer-events-none whitespace-nowrap";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-dark hover:bg-brand-dark",
  secondary: "bg-transparent text-brand border-[1.5px] border-brand hover:bg-brand-light",
  danger: "bg-error text-on-dark hover:brightness-95",
  ghost: "bg-transparent text-muted hover:bg-black/5",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: Icon;
  rightIcon?: Icon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const disabledCls = disabled
    ? "bg-bg text-border border border-border"
    : buttonVariants[variant];
  return (
    <button
      disabled={disabled}
      className={`${buttonBase} ${buttonSizes[size]} ${disabledCls}`}
      {...rest}
    >
      {LeftIcon && <LeftIcon size={16} stroke={1.75} />}
      {children}
      {RightIcon && <RightIcon size={16} stroke={1.75} />}
    </button>
  );
}

export function IconButton({
  icon: I,
  label,
  ...rest
}: { icon: Icon; label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/5 hover:text-text transition-colors"
      {...rest}
    >
      <I size={18} stroke={1.75} />
    </button>
  );
}

/* ============================================================
   STATUS BADGES  (PDF §6)
   Radius 100 (pill), size 11, weight 500. Six paired colours.
   These map directly onto Markelo's real states (scan/marking).
   ============================================================ */

export type BadgeKind =
  | "graded"
  | "in-progress"
  | "pending"
  | "missing"
  | "not-started"
  | "flagged";

const badgeStyles: Record<BadgeKind, { bg: string; text: string; label: string }> = {
  graded: { bg: "bg-success-light", text: "text-[#1a7a4a]", label: "Graded" },
  "in-progress": { bg: "bg-brand-light", text: "text-[#0c3d7a]", label: "In progress" },
  pending: { bg: "bg-warning-light", text: "text-[#7a4f00]", label: "Pending" },
  missing: { bg: "bg-error-light", text: "text-[#8b1a1a]", label: "Missing pages" },
  "not-started": { bg: "bg-bg", text: "text-[#444441]", label: "Not started" },
  flagged: { bg: "bg-warning-light", text: "text-[#7a4f00]", label: "Flagged for review" },
};

export function Badge({ kind, children }: { kind: BadgeKind; children?: React.ReactNode }) {
  const s = badgeStyles[kind];
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}
    >
      {children ?? s.label}
    </span>
  );
}

/* ============================================================
   CARD  (PDF §7), #FAFAFA on #F5F5F5, 1px #CCCCCC, radius 12,
   NO shadow. Padding 16 (24 for large feature cards).
   ============================================================ */

export function Card({
  large,
  className = "",
  children,
}: {
  large?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flat rounded-card border border-border bg-card ${
        large ? "p-6" : "p-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================
   FORM CONTROLS  (PDF §5 radius 8; label-above pattern)
   Label above, helper optional, error below. Never placeholder-
   as-label.
   ============================================================ */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-text">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-muted">{hint}</p>}
      {error && <p className="text-[12px] text-error">{error}</p>}
    </div>
  );
}

const controlBase =
  "w-full rounded-control border bg-white px-3 text-[14px] text-text placeholder:text-muted/70 " +
  "focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/25 transition-colors";

export function TextInput({
  invalid,
  ...rest
}: { invalid?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`${controlBase} h-11 ${invalid ? "border-error" : "border-border"}`}
      {...rest}
    />
  );
}

export function Textarea({
  invalid,
  ...rest
}: { invalid?: boolean } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${controlBase} min-h-[88px] py-2.5 ${invalid ? "border-error" : "border-border"}`}
      {...rest}
    />
  );
}

export function Select({
  invalid,
  children,
  ...rest
}: { invalid?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`${controlBase} h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%221.75%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[right_12px_center] bg-no-repeat pr-9 ${
        invalid ? "border-error" : "border-border"
      }`}
      {...rest}
    >
      {children}
    </select>
  );
}

/* Small section scaffolding used across the gallery */
export function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}

export function Stack({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-4 ${className}`}>{children}</div>;
}
