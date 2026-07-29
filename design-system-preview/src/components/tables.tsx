import React from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconDots,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { Badge } from "./primitives";
import { scripts, type ScriptRow } from "../mock";

/* ============================================================
   DATA TABLE, sortable headers, row states, inline actions,
   pagination, bulk select. Half the Markelo app is tables
   (Review Queue, rosters, audit log, progress dashboards).
   ============================================================ */

type SortDir = "asc" | "desc" | null;

export function DataTable() {
  const [sortKey, setSortKey] = React.useState<keyof ScriptRow | null>("scriptId");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const rows = React.useMemo(() => {
    const r = [...scripts];
    if (sortKey && sortDir) {
      r.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return r;
  }, [sortKey, sortDir]);

  function toggleSort(key: keyof ScriptRow) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
    }
  }

  const allSelected = selected.size === rows.length && rows.length > 0;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-card">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={allSelected}
                onChange={(e) =>
                  setSelected(e.target.checked ? new Set(rows.map((r) => r.scriptId)) : new Set())
                }
                className="h-4 w-4 accent-[#1a56a0]"
              />
            </th>
            <SortHeader label="Script ID" active={sortKey === "scriptId"} dir={sortDir} onClick={() => toggleSort("scriptId")} />
            <SortHeader label="Progress" active={sortKey === "questionsMarked"} dir={sortDir} onClick={() => toggleSort("questionsMarked")} />
            <SortHeader label="Status" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isSel = selected.has(r.scriptId);
            return (
              <tr
                key={r.scriptId}
                className={`border-b border-border/70 last:border-0 transition-colors hover:bg-brand-light/40 ${
                  isSel ? "bg-brand-light/60" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${r.scriptId}`}
                    checked={isSel}
                    onChange={(e) => {
                      const next = new Set(selected);
                      e.target.checked ? next.add(r.scriptId) : next.delete(r.scriptId);
                      setSelected(next);
                    }}
                    className="h-4 w-4 accent-[#1a56a0]"
                  />
                </td>
                <td className="px-4 py-3 font-mono text-[13px] font-medium text-text">{r.scriptId}</td>
                <td className="px-4 py-3 text-[13px] text-muted">
                  {r.questionsMarked} / {r.questionsTotal} questions
                </td>
                <td className="px-4 py-3">
                  <Badge kind={r.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    aria-label="Row actions"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-control text-muted hover:bg-black/5 hover:text-text"
                  >
                    <IconDots size={18} stroke={1.75} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* footer: selection + pagination */}
      <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
        <span className="text-[12px] text-muted">
          {selected.size > 0 ? `${selected.size} selected` : `${rows.length} scripts`}
        </span>
        <div className="flex items-center gap-1">
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-control border border-border text-muted hover:bg-black/5" aria-label="Previous page">
            <IconChevronLeft size={16} stroke={1.75} />
          </button>
          <span className="px-2 text-[12px] text-muted">Page 1 of 1</span>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-control border border-border text-muted hover:bg-black/5" aria-label="Next page">
            <IconChevronRight size={16} stroke={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted hover:text-text"
      >
        {label}
        {active && dir === "asc" ? (
          <IconChevronUp size={14} stroke={2} />
        ) : active && dir === "desc" ? (
          <IconChevronDown size={14} stroke={2} />
        ) : (
          <IconSelector size={14} stroke={1.75} className="opacity-50" />
        )}
      </button>
    </th>
  );
}
