import React from "react";
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
  IconCloudUpload,
  IconCloudCheck,
  IconWifiOff,
} from "@tabler/icons-react";

/* ============================================================
   TOAST, transient confirmation (PDF names toast-style feedback).
   ============================================================ */

type ToastKind = "success" | "error" | "info";
const toastConf: Record<ToastKind, { icon: typeof IconCircleCheck; ring: string; tint: string }> = {
  success: { icon: IconCircleCheck, ring: "text-success", tint: "bg-success-light" },
  error: { icon: IconAlertTriangle, ring: "text-error", tint: "bg-error-light" },
  info: { icon: IconInfoCircle, ring: "text-brand", tint: "bg-brand-light" },
};

export function Toast({ kind, title, body }: { kind: ToastKind; title: string; body?: string }) {
  const c = toastConf[kind];
  const I = c.icon;
  return (
    <div className="flex w-full max-w-sm items-start gap-3 rounded-card border border-border bg-white p-4">
      <span className={`mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-pill ${c.tint} ${c.ring}`}>
        <I size={16} stroke={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-text">{title}</p>
        {body && <p className="mt-0.5 text-[13px] text-muted">{body}</p>}
      </div>
      <button aria-label="Dismiss" className="text-muted hover:text-text">
        <IconX size={16} stroke={1.75} />
      </button>
    </div>
  );
}

/* ============================================================
   BANNER, persistent contextual message.
   ============================================================ */

export function Banner({ kind, children }: { kind: ToastKind; children: React.ReactNode }) {
  const c = toastConf[kind];
  const I = c.icon;
  return (
    <div className={`flex items-center gap-3 rounded-card ${c.tint} px-4 py-3`}>
      <span className={c.ring}>
        <I size={18} stroke={2} />
      </span>
      <p className="text-[13px] font-medium text-text">{children}</p>
    </div>
  );
}

/* Inline validation message (below input) is handled by <Field error>. */

/* ============================================================
   OFFLINE SYNC INDICATOR (US-11), persistent chip that expands
   to a conflict panel only when the server returns a conflict.
   Three states: synced / pending / offline-with-conflict.
   ============================================================ */

export function SyncChip() {
  const [state, setState] = React.useState<"synced" | "pending" | "conflict">("pending");

  const conf = {
    synced: { icon: IconCloudCheck, text: "All changes saved", cls: "text-success bg-success-light" },
    pending: { icon: IconCloudUpload, text: "3 marks pending sync", cls: "text-brand bg-brand-light" },
    conflict: { icon: IconWifiOff, text: "Sync needs attention", cls: "text-error bg-error-light" },
  }[state];
  const I = conf.icon;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          className={`inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-[12px] font-medium ${conf.cls}`}
        >
          <I size={15} stroke={2} />
          {conf.text}
        </button>
        {/* demo toggle so the reviewer can see every state */}
        <div className="flex gap-1">
          {(["synced", "pending", "conflict"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`rounded-badge border px-2 py-1 text-[11px] ${
                state === s ? "border-brand text-brand" : "border-border text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {state === "conflict" && (
        <div className="rounded-card border border-error/40 bg-error-light/50 p-4">
          <p className="text-[13px] font-semibold text-text">Conflicting mark on Script MK-000344, Q3</p>
          <p className="mt-1 text-[13px] text-muted">
            This script was also marked on another device while you were offline. Choose which mark to keep, the other is
            preserved in the audit trail.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between rounded-control border border-border bg-white px-3 py-2.5 text-[13px] hover:border-brand">
              <span>This device · <span className="font-mono">14 / 20</span></span>
              <input type="radio" name="conflict" defaultChecked className="h-4 w-4 accent-[#1a56a0]" />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-control border border-border bg-white px-3 py-2.5 text-[13px] hover:border-brand">
              <span>Server · <span className="font-mono">16 / 20</span></span>
              <input type="radio" name="conflict" className="h-4 w-4 accent-[#1a56a0]" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
