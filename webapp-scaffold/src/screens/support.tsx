/*
  Support: Help & Guidance (Screen #55).
  Role: Universal (all 6 roles).
  Principle P3: Guidance lives in the interface, never in a manual.
*/
import React, { useState } from "react";
import { AppFrame } from "../ui/shell";
import {
  Button,
  Card,
  CardHeader,
  Badge,
  Notice,
  Field,
  Input,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  LifeBuoy,
  Search,
  Keyboard,
  ShieldCheck,
  Zap,
  HelpCircle,
  Phone,
  HardDrive,
  FileText,
  EyeOff,
  ChevronRight,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export const KEYBOARD_SHORTCUTS = [
  { key: "1 – 9", desc: "Quick-enter marks for active question field" },
  { key: "Tab / Shift+Tab", desc: "Advance to next / previous question input" },
  { key: "[ / ]", desc: "Turn to previous / next booklet page" },
  { key: "R", desc: "Rotate current page 90° clockwise" },
  { key: "+ / -", desc: "Zoom in / zoom out document canvas" },
  { key: "Ctrl/Cmd + S", desc: "Force immediate offline snapshot save" },
  { key: "F", desc: "Flag current question for lecturer review" },
];

export const FAQS = [
  {
    q: "What happens if power or internet drops while I am marking?",
    a: "Every mark, note, and active script page is immediately persisted into your computer's local offline cache (IndexedDB). You can continue marking without interruption. Once connectivity restores, Markelo automatically pushes pending batches to the central server without overwriting work.",
  },
  {
    q: "Can a marker or exam administrator reveal a candidate's identity?",
    a: "Never. Under Markelo's non-negotiable double-blind standard (PRD §11), candidate identities are sealed into the encrypted Identity Registry at scanning. Markers, HODs, and Deans see only an immutable Script ID (e.g. MK-000245). There is no toggle or permission that disables this.",
  },
  {
    q: "What should I do if a student answered on a rough work or continuation page?",
    a: "Markelo scans and assembles every page of the answer booklet. You can browse through thumbnails or use the page rail to inspect all pages (including supplementary sheets) without leaving the marking interface.",
  },
  {
    q: "How does a Moderator return a script with discrepancies?",
    a: "From the Moderation Workspace, click 'Return to marker'. A specific, written reason is required by system policy before the return can be submitted. The original marker receives a notification and the return reason is permanently recorded in the audit trail.",
  },
];

export function HelpGuidance() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = searchQuery.trim() === ""
    ? FAQS
    : FAQS.filter(
        (f) =>
          f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.a.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <AppFrame
      role={ROLES.lecturer}
      activeLabel="Help & guidance"
      title="Help & Guidance"
      sub="Interactive examiner workflows, keyboard shortcuts, and exam centre technical assistance"
    >
      <div className="flex flex-col gap-6">
        {/* Search Banner */}
        <div className="relative rounded-card border border-border bg-white p-6 shadow-xs">
          <div className="max-w-2xl">
            <h2 className="text-title font-bold text-text">How can we help you?</h2>
            <p className="mt-1 text-body text-muted">
              Search by task, keyboard shortcut, or institutional policy guideline.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. offline marking, rotate page, flag question, return script..."
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button variant="ghost" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 3 Persona Workflow Cards */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          <Card>
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="grid h-8 w-8 place-items-center rounded-pill bg-brand-light text-brand">
                <FileText size={16} strokeWidth={2.25} />
              </div>
              <div>
                <p className="font-semibold text-text">Marker & TA Workflow</p>
                <p className="text-caption text-muted">Speed & offline ergonomics</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-col gap-2 text-caption text-muted">
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Anonymised Script IDs only; zero identity bias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Number keys 1-9 for high-speed keypad scoring.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Flag ambiguous questions directly to Lecturer.</span>
              </li>
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="grid h-8 w-8 place-items-center rounded-pill bg-blue-100 text-blue-700">
                <ShieldCheck size={16} strokeWidth={2.25} />
              </div>
              <div>
                <p className="font-semibold text-text">Exam Officer Pipeline</p>
                <p className="text-caption text-muted">Ingestion & exception triage</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-col gap-2 text-caption text-muted">
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Bulk scan batches in any order; AI matches pages.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Triage barcode and missing page exceptions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Vault identity data until marking is finalized.</span>
              </li>
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="grid h-8 w-8 place-items-center rounded-pill bg-purple-100 text-purple-700">
                <Zap size={16} strokeWidth={2.25} />
              </div>
              <div>
                <p className="font-semibold text-text">Moderation & Audit</p>
                <p className="text-caption text-muted">Quality control & defensibility</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-col gap-2 text-caption text-muted">
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Inspect 10% random samples side-by-side.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Written reason mandatory for returned scripts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">·</span>
                <span>Immutable audit trail records every mark alteration.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Keyboard Shortcuts & FAQ Layout */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          {/* Keyboard Shortcuts Panel */}
          <Card>
            <CardHeader
              title="Keyboard Shortcuts"
              sub="Master high-velocity paperless grading"
            />
            <div className="flex flex-col divide-y divide-border text-caption">
              {KEYBOARD_SHORTCUTS.map((sc, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-muted">{sc.desc}</span>
                  <kbd className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-text shadow-2xs">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-control bg-bg/80 p-3 text-[11px] text-muted">
              Tip: Press <kbd className="font-mono font-bold">?</kbd> anywhere while marking to bring up the quick shortcuts overlay.
            </div>
          </Card>

          {/* Frequently Asked Questions */}
          <div className="col-span-2 flex flex-col gap-4">
            <Card>
              <CardHeader
                title="Frequently Asked Questions"
                sub="Integrity rules, offline guarantees, and institutional standards"
              />
              <div className="flex flex-col divide-y divide-border">
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="py-3.5 first:pt-0 last:pb-0">
                    <p className="text-body font-semibold text-text flex items-start gap-2">
                      <HelpCircle size={15} className="mt-1 shrink-0 text-brand" />
                      <span>{faq.q}</span>
                    </p>
                    <p className="mt-1.5 pl-6 text-caption leading-relaxed text-muted">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Diagnostics & Escalation Banner */}
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              <Card>
                <div className="flex items-center gap-3">
                  <HardDrive size={18} className="text-success" />
                  <div>
                    <p className="text-caption font-semibold text-text">Local Storage & Cache Health</p>
                    <p className="text-[11px] text-muted">IndexedDB: 48.2 MB used of 2.0 GB allocated</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-caption">
                  <span className="text-success font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-pill bg-success" /> Healthy · 0 pending syncs
                  </span>
                  <button className="text-brand hover:underline text-[12px] font-medium">
                    Run Cache Self-Test
                  </button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-brand" />
                  <div>
                    <p className="text-caption font-semibold text-text">Exam Office Support Desk</p>
                    <p className="text-[11px] text-muted">Direct institutional support line</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-caption">
                  <span className="text-text font-medium">Ext. 4401 · Block B Centre</span>
                  <Button variant="secondary" size="sm">
                    Open Support Ticket
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
