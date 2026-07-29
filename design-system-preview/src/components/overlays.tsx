import React from "react";
import { IconX, IconAlertTriangle } from "@tabler/icons-react";
import { Button, TextInput, Field } from "./primitives";

/* ============================================================
   OVERLAYS, modal, confirmation dialog (Return-with-reason,
   Recall scripts), side panel (script preview). Static, inline
   demos (not portalled) so the whole set is visible on one page.
   ============================================================ */

export function ModalDemo() {
  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-black/20 p-6">
      {/* simulated backdrop + dialog */}
      <div className="mx-auto max-w-md rounded-card border border-border bg-white p-6 flat">
        <div className="flex items-start justify-between">
          <h3 className="text-[18px] font-semibold text-text">Return script for re-marking</h3>
          <button aria-label="Close" className="text-muted hover:text-text">
            <IconX size={18} stroke={1.75} />
          </button>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          The original marker will be notified and the script re-opens for editing. A reason is required.
        </p>
        <div className="mt-4">
          <Field label="Reason for return" htmlFor="reason" required>
            <TextInput id="reason" placeholder="e.g. Q4 total does not match sub-scores" />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Return script</Button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmDemo() {
  return (
    <div className="mx-auto max-w-md rounded-card border border-border bg-white p-6 flat">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-pill bg-error-light text-error">
          <IconAlertTriangle size={20} stroke={2} />
        </span>
        <div>
          <h3 className="text-[16px] font-semibold text-text">Recall 100 unmarked scripts?</h3>
          <p className="mt-1 text-[13px] text-muted">
            These scripts will be removed from Dr. Yakubu's queue and returned to the unassigned pool. Marks already
            entered are kept. This cannot be undone.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost">Keep assigned</Button>
        <Button variant="danger">Recall scripts</Button>
      </div>
    </div>
  );
}

export function SidePanelDemo() {
  return (
    <div className="flex justify-end overflow-hidden rounded-card border border-border bg-black/10">
      <aside className="h-full w-80 border-l border-border bg-white p-5 flat">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[14px] font-semibold">MK-000344</span>
          <button aria-label="Close panel" className="text-muted hover:text-text">
            <IconX size={18} stroke={1.75} />
          </button>
        </div>
        <div className="mt-4 aspect-[3/4] w-full rounded-control border border-border bg-bg flex items-center justify-center text-[12px] text-muted">
          Scanned page preview
        </div>
        <dl className="mt-4 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-muted">Pages</dt>
            <dd className="font-medium">6</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Match confidence</dt>
            <dd className="font-medium text-warning">61%</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
