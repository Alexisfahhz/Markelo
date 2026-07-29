import { IconCheck, IconFlag, IconX, IconArrowRight, IconAlertTriangle } from "@tabler/icons-react";
import { Button, Badge, Field, TextInput, Textarea } from "./primitives";
import { roster, scanBatch } from "../mock";

/* ============================================================
   APP-SPECIFIC COMPOSITES, the screens that decide whether the
   product feels right. Built from the primitives above.
   ============================================================ */

/* --- 1. Mark-entry panel (US-10 Marking Interface) ---
   Script ID header, NO identity, mark validated against max,
   comment, autosave, Next Script, flag-for-review. */
export function MarkEntryPanel() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white flat">
      <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[15px] font-semibold text-text">MK-000342</span>
          <span className="text-[13px] text-muted">Script 45 of 300</span>
        </div>
        <span className="text-[12px] text-success">Saved</span>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="aspect-[4/3] rounded-control border border-border bg-bg flex items-center justify-center text-[12px] text-muted">
          Student's answer, Question 3
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="uppercase-label">Question 3 of 5</p>
            <p className="mt-1 text-[14px] text-muted">
              Explain paging and segmentation, and contrast their fragmentation behaviour.
            </p>
          </div>
          <Field label="Marks awarded" htmlFor="marks" hint="Maximum 20 marks for this question">
            <div className="flex items-center gap-2">
              <TextInput id="marks" defaultValue="14" className="!w-24 text-center font-mono" />
              <span className="text-[15px] text-muted">/ 20</span>
            </div>
          </Field>
          <Field label="Comment" htmlFor="comment">
            <Textarea id="comment" placeholder="Optional feedback for moderation…" />
          </Field>
          <div className="flex items-center gap-3 pt-1">
            <Button variant="primary" rightIcon={IconArrowRight}>Next script</Button>
            <Button variant="ghost" leftIcon={IconFlag}>Flag for review</Button>
          </div>
          <p className="rounded-control bg-brand-light px-3 py-2 text-[12px] text-brand">
            Anonymous marking is on. You never see the student's name or matric number.
          </p>
        </div>
      </div>
    </div>
  );
}

/* --- 2. Validation-report row (US-05 Roster upload) ---
   Officer-only. Shows the deliberately-flawed rows to fix. */
export function ValidationReport() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      <div className="flex items-center gap-2 border-b border-border bg-error-light/60 px-4 py-2.5">
        <IconAlertTriangle size={16} className="text-error" stroke={2} />
        <span className="text-[13px] font-medium text-text">2 of 5 rows need attention before you can proceed</span>
      </div>
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-[0.04em] text-muted">
            <th className="px-4 py-2.5 font-semibold">Name</th>
            <th className="px-4 py-2.5 font-semibold">Matric</th>
            <th className="px-4 py-2.5 font-semibold">Department</th>
            <th className="px-4 py-2.5 font-semibold">Issue</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((r, i) => (
            <tr key={i} className={`border-b border-border/70 last:border-0 ${r.issue ? "bg-error-light/30" : ""}`}>
              <td className="px-4 py-2.5">{r.name}</td>
              <td className="px-4 py-2.5 font-mono">{r.matric}</td>
              <td className="px-4 py-2.5">{r.department || <span className="text-error">,</span>}</td>
              <td className="px-4 py-2.5">
                {r.issue ? (
                  <span className="inline-flex items-center gap-1.5 text-error">
                    <IconX size={14} stroke={2.5} /> {r.issue}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-success">
                    <IconCheck size={14} stroke={2.5} /> Valid
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --- 3. Moderation side-by-side (US-14) --- */
export function ModerationCompare() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white flat">
      <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
        <span className="font-mono text-[14px] font-semibold">MK-000341</span>
        <Badge kind="in-progress">Under moderation</Badge>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-5">
          <p className="uppercase-label">Original marker</p>
          <p className="mt-2 font-mono text-[28px] font-bold text-text">72<span className="text-[16px] text-muted">/100</span></p>
          <p className="mt-2 text-[13px] text-muted">Consistent scoring, brief comments on Q2 and Q4.</p>
        </div>
        <div className="p-5 bg-brand-light/30">
          <p className="uppercase-label">Moderated</p>
          <div className="mt-2 flex items-center gap-2">
            <TextInput defaultValue="76" className="!w-20 text-center font-mono text-[18px] font-bold" />
            <span className="text-[16px] text-muted">/100</span>
          </div>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-warning">
            <IconAlertTriangle size={14} stroke={2} /> +4 above threshold, reason required
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3">
        <Button variant="secondary">Return to marker</Button>
        <Button variant="primary" leftIcon={IconCheck}>Approve moderated</Button>
      </div>
    </div>
  );
}

/* --- 4. Scan-status row (US-07), live control-sheet detection --- */
export function ScanStatusList() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      {scanBatch.map((s, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border/70 px-4 py-3 last:border-0">
          <span className="font-mono text-[13px] font-medium text-text">{s.tracking}</span>
          <span className="text-[13px] text-muted">{s.pages} pages</span>
          {s.confidence !== null && (
            <span className={`text-[12px] font-medium ${s.confidence >= 90 ? "text-success" : s.confidence >= 70 ? "text-warning" : "text-error"}`}>
              {s.confidence}% match
            </span>
          )}
          <div className="ml-auto">
            <Badge kind={s.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
