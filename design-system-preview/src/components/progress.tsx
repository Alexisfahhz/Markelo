import React from "react";
import { IconCheck } from "@tabler/icons-react";

/* ============================================================
   STEPPER, Institution Setup Wizard, Demo Mode (PDF).
   ============================================================ */

export function Stepper() {
  const steps = ["Faculty", "Department", "Course", "Extra-sheet method"];
  const current = 2; // 0-indexed → step 3 active
  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-pill text-[13px] font-semibold ${
                  done
                    ? "bg-brand text-on-dark"
                    : active
                    ? "border-[1.5px] border-brand text-brand"
                    : "border border-border text-muted"
                }`}
              >
                {done ? <IconCheck size={16} stroke={2.5} /> : i + 1}
              </span>
              <span className={`text-[13px] ${active ? "font-semibold text-text" : "text-muted"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <span className={`mx-3 h-px flex-1 min-w-6 ${done ? "bg-brand" : "bg-border"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ============================================================
   PROGRESS BAR, batch processing, per-assignee marking.
   ============================================================ */

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono font-medium text-text">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-pill bg-border/50">
        <div className="h-full rounded-pill bg-brand transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ============================================================
   SKELETON, loading placeholders that match final layout shape.
   ============================================================ */

export function SkeletonRows() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border/70 px-4 py-3.5 last:border-0">
          <div className="h-4 w-4 animate-pulse rounded bg-border/60" />
          <div className="h-4 w-24 animate-pulse rounded bg-border/60" />
          <div className="h-4 w-32 animate-pulse rounded bg-border/50" />
          <div className="ml-auto h-5 w-20 animate-pulse rounded-pill bg-border/50" />
        </div>
      ))}
    </div>
  );
}
