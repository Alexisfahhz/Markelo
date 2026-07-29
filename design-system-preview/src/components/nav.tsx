import React from "react";
import {
  IconLayoutDashboard,
  IconFileText,
  IconUsers,
  IconClipboardCheck,
  IconScan,
  IconListSearch,
  IconChevronDown,
  IconBell,
  IconSearch,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

/* ============================================================
   APP SIDEBAR, role-aware sections (PDF Part B2). Uses the
   blue-dark token (#0C3D7A) the PDF reserves for dark headers.
   Shown here as the Exam Officer's section set.
   ============================================================ */

const officerNav: { icon: Icon; label: string; active?: boolean }[] = [
  { icon: IconLayoutDashboard, label: "Examinations", active: true },
  { icon: IconUsers, label: "Student Data" },
  { icon: IconFileText, label: "Control Sheets" },
  { icon: IconScan, label: "Scan Batches" },
  { icon: IconListSearch, label: "Review Queue" },
  { icon: IconClipboardCheck, label: "Results" },
];

export function Sidebar() {
  return (
    <nav className="flex w-60 flex-col rounded-card bg-brand-dark p-3 text-on-dark">
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-control bg-white text-[15px] font-bold text-brand">
          M
        </div>
        <span className="text-[16px] font-bold">Markelo</span>
      </div>
      <p className="px-2 pb-2 pt-3 text-[11px] font-medium uppercase tracking-[0.05em] text-white/50">
        Exam Officer
      </p>
      <ul className="flex flex-col gap-1">
        {officerNav.map((item) => (
          <li key={item.label}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`flex items-center gap-3 rounded-control px-3 py-2 text-[14px] font-medium transition-colors ${
                item.active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={18} stroke={1.75} />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-2 rounded-control px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-white/20 text-[12px] font-semibold">
          AA
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-white">Mrs. Adaeze</p>
          <p className="truncate text-[11px] text-white/60">Unilag</p>
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   TOPBAR, institution branding + search + notifications.
   ============================================================ */

export function Topbar() {
  return (
    <div className="flex h-16 items-center gap-4 rounded-card border border-border bg-white px-4">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-text">CSC401, Operating Systems</span>
        <span className="rounded-badge bg-brand-light px-2 py-0.5 text-[11px] font-medium text-brand">
          Final · Rain 2025
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <IconSearch size={16} stroke={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            placeholder="Search scripts…"
            className="h-9 w-56 rounded-control border border-border bg-white pl-9 pr-3 text-[13px] placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
        </div>
        <button aria-label="Notifications" className="relative inline-flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/5">
          <IconBell size={18} stroke={1.75} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-pill bg-error" />
        </button>
      </div>
    </div>
  );
}

/* Tabs, used by Institution Admin Settings (PDF). */
export function Tabs() {
  const items = ["Users & Roles", "Faculties", "Extra-Sheet Method", "Data Retention"];
  const [active, setActive] = React.useState(0);
  return (
    <div className="border-b border-border">
      <div className="flex gap-1">
        {items.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={`relative px-3 py-2.5 text-[14px] font-medium transition-colors ${
              active === i ? "text-brand" : "text-muted hover:text-text"
            }`}
          >
            {t}
            {active === i && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-pill bg-brand" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Breadcrumbs */
export function Breadcrumbs() {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-muted">
      <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand">Examinations</a>
      <IconChevronDown size={14} className="-rotate-90" />
      <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand">CSC401</a>
      <IconChevronDown size={14} className="-rotate-90" />
      <span className="font-medium text-text">Review Queue</span>
    </nav>
  );
}
