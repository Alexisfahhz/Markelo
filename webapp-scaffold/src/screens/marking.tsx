/*
  Marking flow screens:
    1. My Courses (Lecturer) — Courses taught, exam state, scheme status, marking progress.
    2. Flagged for Review (TA) — Questions flagged by TA for Lecturer guidance.
    3. Marking Interface (Lecturer / TA) — Anonymised Script ID marking canvas with document viewer,
       zoom/rotate, page rail, question-by-question scoring and running total.
*/
import React, { useState } from "react";
import { AppFrame } from "../ui/shell";
import {
  Button,
  Card,
  CardHeader,
  Badge,
  Notice,
  ScriptId,
  Progress,
  Table,
  Td,
  Input,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  Check,
  EyeOff,
  GalleryVerticalEnd,
  ChevronLeft,
  ChevronRight,
  ZoomOut,
  ZoomIn,
  Minus,
  Plus,
  RotateCw,
  Maximize2,
  Keyboard,
  FileText,
  Save,
  Send,
  MessageSquareWarning,
  CircleCheckBig,
} from "lucide-react";

/* =====================================================================
   1. MY COURSES (Lecturer)
   ===================================================================== */

export const MY_COURSES_DATA = [
  {
    code: "CSC 401",
    name: "Compiler Construction",
    exam: "First semester exam",
    scriptsAssigned: 62,
    scriptsMarked: 24,
    schemeSet: true,
  },
  {
    code: "CSC 312",
    name: "Operating Systems",
    exam: "First semester exam",
    scriptsAssigned: 45,
    scriptsMarked: 45,
    schemeSet: true,
  },
  {
    code: "CSC 305",
    name: "Database Systems",
    exam: "First semester exam",
    scriptsAssigned: 0,
    scriptsMarked: 0,
    schemeSet: false,
  },
];

export function MyCourses() {
  return (
    <AppFrame
      role={ROLES.lecturer}
      activeLabel="My courses"
      title="My courses"
      sub="Every course you teach, and where marking stands on each one"
    >
      <div className="flex flex-col gap-6">
        <Card pad={false}>
          <div className="p-6 pb-4">
            <CardHeader
              title="Yaba College of Technology, 2025/2026 First Semester"
              sub={`${MY_COURSES_DATA.length} courses`}
            />
          </div>
          <Table head={["Course", "Exam", "Marking scheme", "Scripts marked", ""]}>
            {MY_COURSES_DATA.map((e) => (
              <tr key={e.code}>
                <Td>
                  <p className="font-medium text-text">{e.code}</p>
                  <p className="text-caption text-muted">{e.name}</p>
                </Td>
                <Td className="text-muted">{e.exam}</Td>
                <Td>
                  {e.schemeSet ? (
                    <Badge tone="success" icon={Check}>Set</Badge>
                  ) : (
                    <Badge tone="warning">Not set yet</Badge>
                  )}
                </Td>
                <Td className="w-48">
                  {e.scriptsAssigned > 0 ? (
                    <Progress value={e.scriptsMarked} max={e.scriptsAssigned} />
                  ) : (
                    <span className="text-caption text-muted">Scanning not started</span>
                  )}
                </Td>
                <Td className="text-right">
                  {e.schemeSet && e.scriptsAssigned > 0 ? (
                    <Button variant="ghost" size="sm">Open marking</Button>
                  ) : (
                    <span className="text-caption text-muted">Nothing to open yet</span>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </AppFrame>
  );
}

/* =====================================================================
   2. FLAGGED FOR REVIEW (TA)
   ===================================================================== */

export const FLAGGED_DATA = [
  {
    id: "MK-000312",
    question: 4,
    note: "Handwriting on this answer is very faint, I can make out most of it but not the last two lines.",
    flaggedAt: "Today, 09:14",
    status: "waiting" as const,
  },
  {
    id: "MK-000318",
    question: 2,
    note: "Student's working uses a method not shown in the marking scheme. Not sure how many marks it earns.",
    flaggedAt: "Yesterday, 15:02",
    status: "waiting" as const,
  },
  {
    id: "MK-000301",
    question: 6,
    note: "Two different answers written, one crossed out. Unclear which one is the final answer.",
    flaggedAt: "22 Jul 2026",
    status: "answered" as const,
  },
];

export function FlaggedForReview() {
  const waiting = FLAGGED_DATA.filter((n) => n.status === "waiting");
  const answered = FLAGGED_DATA.filter((n) => n.status === "answered");

  return (
    <AppFrame
      role={ROLES.ta}
      activeLabel="Flagged for review"
      title="Flagged for review"
      sub="Scripts you flagged for your Lecturer's attention"
    >
      <div className="flex flex-col gap-6">
        <Notice tone="brand" compact>
          Flagging a question does not stop it counting toward your marking progress. Your Lecturer sees your note and the question, never the student's identity.
        </Notice>

        <div className="flex flex-col gap-3">
          <p className="uppercase-label">Waiting on your Lecturer</p>
          {waiting.map((n) => (
            <Card key={n.id}>
              <div className="flex items-start gap-4">
                <MessageSquareWarning size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-warning" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <ScriptId id={n.id} />
                    <Badge tone="neutral">Question {n.question}</Badge>
                    <span className="text-caption text-muted">Flagged {n.flaggedAt}</span>
                  </div>
                  <p className="mt-2 text-body text-text">{n.note}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {answered.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="uppercase-label">Answered</p>
            {answered.map((n) => (
              <Card key={n.id}>
                <div className="flex items-start gap-4">
                  <CircleCheckBig size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-success" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <ScriptId id={n.id} />
                      <Badge tone="neutral">Question {n.question}</Badge>
                      <Badge tone="success" icon={Check}>Resolved</Badge>
                    </div>
                    <p className="mt-2 text-body text-text">{n.note}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppFrame>
  );
}

/* =====================================================================
   3. MARKING INTERFACE (Lecturer / TA)
   ===================================================================== */

export const SCRIPT_INFO = { id: "MK-000245", course: "CSC 401, first semester exam", pages: 8 };

export const INITIAL_MARKS = [
  { q: 1, max: 20, mark: 18 as number | "" },
  { q: 2, max: 15, mark: 15 as number | "" },
  { q: 3, max: 15, mark: "" as number | "" },
  { q: 4, max: 20, mark: "" as number | "" },
  { q: 5, max: 15, mark: "" as number | "" },
  { q: 6, max: 15, mark: "" as number | "" },
];
const MAX_TOTAL = INITIAL_MARKS.reduce((acc, t) => acc + t.max, 0);

const QUESTION_PROMPTS: Record<number, { title: string; prompt: string }> = {
  1: {
    title: "Question 1 · Scheduling Algorithms",
    prompt: "Distinguish between preemptive and non-preemptive CPU scheduling. Provide an analysis of Round Robin vs Priority Scheduling under varying time-quantum conditions.",
  },
  2: {
    title: "Question 2 · Deadlock Handling",
    prompt: "State and formally explain the four Coffman conditions necessary for deadlock to occur in a distributed multiprocessor environment.",
  },
  3: {
    title: "Question 3 · Memory Management",
    prompt: "Explain how multilevel paging eliminates external fragmentation and contrast this with inverted page tables in modern 64-bit architectures.",
  },
  4: {
    title: "Question 4 · File Systems",
    prompt: "Compare contiguous, linked, and indexed file allocation schemes with respect to access speed, disk space utilization, and fault tolerance.",
  },
  5: {
    title: "Question 5 · Synchronization",
    prompt: "Illustrate the Producer-Consumer problem using semaphores. Provide pseudo-code handling race conditions and bounded buffer constraints.",
  },
  6: {
    title: "Question 6 · Security & Access Control",
    prompt: "Discuss the implementation of Capability Lists versus Access Control Lists (ACLs) in contemporary microkernel operating systems.",
  },
};

function QuestionRow({
  q,
  max,
  value,
  isActive,
  onSelect,
  onChange,
}: {
  q: number;
  max: number;
  value: number | "";
  isActive?: boolean;
  onSelect?: () => void;
  onChange: (val: number | "") => void;
}) {
  const invalid = typeof value === "number" && value > max;
  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between border-b border-border py-2.5 px-2 transition-colors cursor-pointer last:border-0 rounded-sm ${
        isActive
          ? "bg-brand-light/50 border-l-2 border-l-brand"
          : "hover:bg-bg/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`text-body font-medium transition-colors ${isActive ? "text-brand font-semibold" : "text-text"}`}>
          Question {q}
        </span>
        {value !== "" && (
          <span className="flex h-1.5 w-1.5 rounded-full bg-success" title="Marked" aria-label="Marked" />
        )}
      </div>
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Input
          type="number"
          min={0}
          max={max}
          value={value}
          invalid={invalid}
          className="w-20 text-right tabular-nums"
          aria-label={`Mark for question ${q}, out of ${max}`}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") return onChange("");
            const num = Math.max(0, Math.min(max, Number(val)));
            onChange(num);
          }}
        />
        <span className="w-14 shrink-0 text-caption text-muted">/ {max}</span>
      </div>
    </div>
  );
}

function PageCanvas({ page, zoom, rotate }: { page: number; zoom: number; rotate: number }) {
  const isCover = page === 1;
  const qNum = page - 1;
  const qData = QUESTION_PROMPTS[qNum];
  const isRough = page === 8;

  return (
    <div
      className="mx-auto aspect-[210/297] w-full max-w-[520px] shrink-0 rounded-control border border-border bg-white transition-transform"
      style={{
        transform: `scale(${zoom / 100}) rotate(${rotate}deg)`,
        transformOrigin: "top center",
      }}
    >
      <div className="flex h-full flex-col gap-3 p-6 select-none">
        {isCover ? (
          <>
            <div className="flex items-center gap-2 rounded-badge bg-text px-3 py-2">
              <EyeOff size={14} strokeWidth={2} className="shrink-0 text-white" aria-hidden />
              <span className="text-caption font-medium text-white">Identity redacted, Exam Officer only</span>
            </div>
            <div className="mt-2 space-y-2">
              <div className="h-3 w-1/2 rounded bg-bg" />
              <div className="h-3 w-1/3 rounded bg-bg" />
            </div>
            <div className="mt-6 rounded-card border border-border/80 bg-bg/50 p-4">
              <p className="text-caption font-semibold text-text">Examination Instructions & Cover Notice</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Candidate identity has been masked according to institutional anonymous marking protocol.
                All marks entered are logged directly against Script ID only.
              </p>
            </div>
          </>
        ) : isRough ? (
          <>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <ScriptId id={SCRIPT_INFO.id} />
              <span className="text-caption font-medium text-muted">Page 8 of 8 · Supplementary Notes</span>
            </div>
            <div className="mt-2 rounded-sm border border-dashed border-border bg-bg/30 px-3 py-2 text-[11px] font-medium text-muted">
              Rough Work & Candidate Scratch Pad
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <ScriptId id={SCRIPT_INFO.id} />
              <span className="text-caption text-muted">
                Page {page} of {SCRIPT_INFO.pages} · <strong className="font-semibold text-text">Q{qNum}</strong>
              </span>
            </div>
            {qData && (
              <div className="rounded-control border border-border/70 bg-bg/40 p-3">
                <p className="text-[12px] font-semibold text-brand-dark">{qData.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{qData.prompt}</p>
              </div>
            )}
          </>
        )}

        {/* Student Script Writing Simulation */}
        <div className="mt-2 flex flex-1 flex-col gap-2.5">
          {Array.from({ length: isCover ? 6 : 9 }).map((_, idx) => (
            <div
              key={idx}
              className="h-2 rounded-full bg-bg"
              style={{ width: `${88 - (idx % 4) * 11}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScriptViewer({
  currentPage,
  onSelectPage,
  marks,
}: {
  currentPage: number;
  onSelectPage: (p: number) => void;
  marks: typeof INITIAL_MARKS;
}) {
  const [zoom, setZoom] = useState(100);
  const [rotate, setRotate] = useState(0);

  // Ergonomic keyboard navigation for fast marking workflow
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onSelectPage(Math.max(1, currentPage - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onSelectPage(Math.min(SCRIPT_INFO.pages, currentPage + 1));
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((z) => Math.min(200, z + 25));
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setZoom((z) => Math.max(50, z - 25));
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setRotate((r) => (r + 90) % 360);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, onSelectPage]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-bg shadow-2xs">
      {/* Top status & script header — minimal, quiet, non-competing */}
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <ScriptId id={SCRIPT_INFO.id} />
          <span className="text-caption text-muted/60" aria-hidden>·</span>
          <span className="text-caption font-medium text-muted">{SCRIPT_INFO.course}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Dedicated Visually Appealing Page Counter Pill */}
          <div className="flex items-center gap-1.5 rounded-control border border-border bg-bg/80 px-2.5 py-0.5 text-caption text-muted shadow-2xs">
            <FileText size={13} strokeWidth={2} className="text-muted/70" aria-hidden />
            <span>
              Page <strong className="font-semibold text-text tabular-nums">{currentPage}</strong> of{" "}
              <span className="tabular-nums">{SCRIPT_INFO.pages}</span>
            </span>
          </div>

          {/* Context / Security Status Badge */}
          {currentPage === 1 ? (
            <Badge tone="brand">Cover page · Identity redacted</Badge>
          ) : currentPage === 8 ? (
            <Badge tone="neutral">Rough work &amp; Scratchpad</Badge>
          ) : (
            <Badge tone="neutral">Question {currentPage - 1}</Badge>
          )}
        </div>
      </div>

      {/* Document Viewport */}
      <div className="flex-1 overflow-auto p-6 bg-bg/40">
        <PageCanvas page={currentPage} zoom={zoom} rotate={rotate} />
      </div>

      {/* Redesigned Bottom Navigation & Control Deck — 2-Tier High-UX Architecture */}
      <div className="border-t border-border bg-white flex flex-col divide-y divide-border/60">
        {/* Tier 1: Centralized Booklet Page Navigation */}
        <div className="flex items-center justify-center px-4 py-2.5 bg-bg/30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onSelectPage(Math.max(1, currentPage - 1))}
              aria-label="Previous page (Shortcut: Left Arrow)"
              title="Previous page (←)"
              className="flex h-8 items-center gap-1 rounded-control border border-border bg-white px-2.5 text-caption font-medium text-text transition-colors hover:bg-bg disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} strokeWidth={2} aria-hidden />
              <span>Prev</span>
            </button>

            {/* Segmented Page Pills with Completion Status */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Booklet pages">
              {Array.from({ length: SCRIPT_INFO.pages }).map((_, i) => {
                const pageNum = i + 1;
                const active = pageNum === currentPage;
                const qNum = pageNum - 1;
                const qMark = marks.find((m) => m.q === qNum);
                const isMarked = qMark && qMark.mark !== "";

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => onSelectPage(pageNum)}
                    aria-label={`Go to page ${pageNum}${pageNum === 1 ? " (Cover page)" : ""}`}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-8 items-center justify-center rounded-control transition-all ${
                      pageNum === 1 ? "px-2.5" : "w-8"
                    } text-caption font-medium tabular-nums ${
                      active
                        ? "bg-brand font-semibold text-white shadow-xs ring-2 ring-brand/20"
                        : "border border-border bg-white text-muted hover:border-brand/40 hover:bg-bg hover:text-text"
                    }`}
                  >
                    {pageNum === 1 ? (
                      <span className="flex items-center gap-1">
                        <span>1</span>
                        <span className="text-[10px] font-normal uppercase tracking-wider opacity-85">Cover</span>
                      </span>
                    ) : (
                      <span>{pageNum}</span>
                    )}

                    {/* Completion Status Dot for Questions */}
                    {isMarked && (
                      <span
                        className={`absolute -top-1 -right-1 h-2 w-2 rounded-full border border-white ${
                          active ? "bg-white" : "bg-success"
                        }`}
                        title={`Question ${qNum} marked (${qMark.mark}/${qMark.max})`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={currentPage >= SCRIPT_INFO.pages}
              onClick={() => onSelectPage(Math.min(SCRIPT_INFO.pages, currentPage + 1))}
              aria-label="Next page (Shortcut: Right Arrow)"
              title="Next page (→)"
              className="flex h-8 items-center gap-1 rounded-control border border-border bg-white px-2.5 text-caption font-medium text-text transition-colors hover:bg-bg disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight size={14} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        {/* Tier 2: View Tools (Zoom, Rotate, Reset) & Monospace Keyboard Hints */}
        <div className="flex items-center justify-between gap-4 px-4 py-2 bg-white">
          {/* View Manipulation Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Segmented Control */}
            <div className="flex h-7.5 items-center rounded-control border border-border bg-bg p-0.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(50, z - 25))}
                title="Zoom out (−)"
                aria-label="Zoom out"
                className="flex h-6.5 w-6.5 items-center justify-center rounded-[3px] text-muted transition-colors hover:bg-white hover:text-text"
              >
                <Minus size={13} strokeWidth={2.5} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                title="Click to reset zoom to 100%"
                className="px-2 text-[11px] font-medium tabular-nums text-text transition-colors hover:text-brand"
              >
                {zoom}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(200, z + 25))}
                title="Zoom in (+)"
                aria-label="Zoom in"
                className="flex h-6.5 w-6.5 items-center justify-center rounded-[3px] text-muted transition-colors hover:bg-white hover:text-text"
              >
                <Plus size={13} strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            {/* Rotate Button */}
            <button
              type="button"
              onClick={() => setRotate((r) => (r + 90) % 360)}
              title="Rotate 90° clockwise (R)"
              aria-label="Rotate page 90 degrees"
              className={`flex h-7.5 items-center gap-1.5 rounded-control border px-2.5 text-caption font-medium transition-colors ${
                rotate > 0
                  ? "border-brand/40 bg-brand-light font-semibold text-brand"
                  : "border-border bg-white text-muted hover:bg-bg hover:text-text"
              }`}
            >
              <RotateCw size={13} strokeWidth={2} aria-hidden />
              <span>{rotate > 0 ? `${rotate}°` : "Rotate"}</span>
            </button>

            {/* Reset View Button */}
            {(zoom !== 100 || rotate !== 0) && (
              <button
                type="button"
                onClick={() => {
                  setZoom(100);
                  setRotate(0);
                }}
                title="Reset zoom and rotation"
                aria-label="Reset view"
                className="flex h-7.5 items-center gap-1 rounded-control border border-brand/40 bg-brand-light px-2 text-caption font-medium text-brand transition-colors hover:bg-brand-light/80"
              >
                <Maximize2 size={12} strokeWidth={2} aria-hidden />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Tactile Keyboard Shortcuts Legend */}
          <div className="flex items-center gap-3 text-[11px] text-muted">
            <div className="flex items-center gap-1">
              <Keyboard size={12} strokeWidth={2} className="text-muted/70" aria-hidden />
              <span className="text-muted/80">Keys:</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="flex gap-0.5">
                  <kbd className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9px] font-medium text-text">←</kbd>
                  <kbd className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9px] font-medium text-text">→</kbd>
                </span>
                <span>page</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="flex gap-0.5">
                  <kbd className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9px] font-medium text-text">+</kbd>
                  <kbd className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9px] font-medium text-text">−</kbd>
                </span>
                <span>zoom</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9px] font-medium text-text">R</kbd>
                <span>rotate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9px] font-medium text-text">S</kbd>
                <span>save</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkingSidebar({
  marks,
  currentPage,
  onSelectQuestion,
  onUpdateMark,
}: {
  marks: typeof INITIAL_MARKS;
  currentPage: number;
  onSelectQuestion: (q: number) => void;
  onUpdateMark: (q: number, val: number | "") => void;
}) {
  const total = marks.reduce((acc, s) => acc + (typeof s.mark === "number" ? s.mark : 0), 0);
  const answeredCount = marks.filter((s) => s.mark !== "").length;

  return (
    <div className="flex w-[407px] shrink-0 flex-col gap-4 max-lg:w-full">
      <Card pad={false} className="flex min-h-32 flex-col justify-between gap-1 p-4">
        <span className="uppercase-label">Running total</span>
        <div className="flex items-end justify-between">
          <span className="text-title font-bold tabular-nums text-text">
            {total} <span className="text-body font-normal text-muted">/ {MAX_TOTAL}</span>
          </span>
          <Badge tone={answeredCount === marks.length ? "success" : "neutral"}>
            {answeredCount} of {marks.length} answered
          </Badge>
        </div>
      </Card>

      <Card pad={false}>
        <div className="p-6 pb-2">
          <CardHeader title="Marks" sub="Never more than a question's own maximum" />
        </div>
        <div className="px-4 pb-2">
          {marks.map((item) => (
            <QuestionRow
              key={item.q}
              q={item.q}
              max={item.max}
              value={item.mark}
              isActive={currentPage === item.q + 1}
              onSelect={() => onSelectQuestion(item.q)}
              onChange={(newVal) => onUpdateMark(item.q, newVal)}
            />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" icon={Save}>Save draft</Button>
        <Button icon={Send} disabled={answeredCount < marks.length}>Submit script</Button>
      </div>
    </div>
  );
}

export function MarkingInterface() {
  const [currentPage, setCurrentPage] = useState(1);
  const [marks, setMarks] = useState(INITIAL_MARKS);

  return (
    <AppFrame
      role={ROLES.lecturer}
      activeLabel="My marking"
      title={`Marking ${SCRIPT_INFO.id}`}
      sub={SCRIPT_INFO.course}
      offline="online"
    >
      <div className="flex h-[760px] flex-col gap-3">
        <Notice tone="brand" icon={false} compact>
          You are marking a Script ID only. No student name or matriculation number appears anywhere on this screen.
        </Notice>
        <div className="flex min-h-0 flex-1 gap-6 max-lg:flex-col">
          <div className="min-w-0 flex-1 h-full">
            <ScriptViewer
              currentPage={currentPage}
              onSelectPage={setCurrentPage}
              marks={marks}
            />
          </div>
          <MarkingSidebar
            marks={marks}
            currentPage={currentPage}
            onSelectQuestion={(q) => setCurrentPage(q + 1)}
            onUpdateMark={(q, val) =>
              setMarks((prev) => prev.map((m) => (m.q === q ? { ...m, mark: val } : m)))
            }
          />
        </div>
      </div>
    </AppFrame>
  );
}

/* =====================================================================
   4. ANSWER VIEWER (Screen #43)
   Standalone Full-Canvas Script Inspector (Lecturer, TA, Moderator)
   ===================================================================== */

export function AnswerViewer() {
  const [currentPage, setCurrentPage] = useState(2);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showInspector, setShowInspector] = useState(true);

  const handleZoom = (delta: number) => {
    setZoom((z) => Math.min(200, Math.max(50, z + delta)));
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  return (
    <AppFrame
      role={ROLES.lecturer}
      activeLabel="My marking"
      title={`Answer Viewer · ${SCRIPT_INFO.id}`}
      sub={`${SCRIPT_INFO.course} · Full script audit & document inspection`}
      offline="online"
    >
      <div className="flex h-[760px] flex-col gap-3">
        {/* Security & Anonymity Ribbon */}
        <div className="flex items-center justify-between rounded-control border border-border bg-white px-4 py-2 text-caption">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-pill bg-success" />
            <span className="font-semibold text-text">Script ID:</span>
            <ScriptId id={SCRIPT_INFO.id} />
            <span className="text-muted">·</span>
            <span className="text-muted">Session: 2025/2026 First Semester</span>
            <span className="text-muted">·</span>
            <span className="text-muted">Booklet Profile: V1.2 (Standard 8-page)</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <EyeOff size={13} className="text-brand" />
            <span>Double-blind anonymity active · Student identity permanently locked</span>
          </div>
        </div>

        {/* Viewer Workspace */}
        <div className="flex min-h-0 flex-1 gap-4">
          {/* Main Document Inspection Stage */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-card border border-border bg-white shadow-sm">
            {/* Control Bar */}
            <div className="flex items-center justify-between border-b border-border bg-bg/50 px-4 py-2.5">
              {/* Page Navigator */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                />
                <span className="text-caption font-semibold text-text">
                  Page {currentPage} of {SCRIPT_INFO.pages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ChevronRight}
                  onClick={() => setCurrentPage((p) => Math.min(SCRIPT_INFO.pages, p + 1))}
                  disabled={currentPage >= SCRIPT_INFO.pages}
                />
                <span className="mx-2 h-4 w-px bg-border" />
                {/* Jump to question */}
                <div className="flex items-center gap-1">
                  <span className="text-caption text-muted mr-1">Jump to:</span>
                  {[1, 2, 3, 4, 5].map((q) => (
                    <button
                      key={q}
                      onClick={() => setCurrentPage(q + 1)}
                      className={`h-6 px-2 rounded text-caption font-semibold transition-colors ${
                        currentPage === q + 1
                          ? "bg-brand text-white"
                          : "bg-white text-muted border border-border hover:border-brand hover:text-brand"
                      }`}
                    >
                      Q{q}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`h-6 px-2 rounded text-caption font-semibold transition-colors ${
                      currentPage === 1
                        ? "bg-brand text-white"
                        : "bg-white text-muted border border-border hover:border-brand hover:text-brand"
                    }`}
                  >
                    Cover
                  </button>
                </div>
              </div>

              {/* Canvas Controls */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Minus}
                  onClick={() => handleZoom(-15)}
                  title="Zoom out"
                />
                <span className="w-12 text-center text-caption font-medium text-text">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => handleZoom(15)}
                  title="Zoom in"
                />
                <span className="mx-1 h-4 w-px bg-border" />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RotateCw}
                  onClick={handleRotate}
                  title="Rotate 90 degrees"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Maximize2}
                  onClick={() => {
                    setZoom(100);
                    setRotation(0);
                  }}
                  title="Reset view"
                />
                <span className="mx-1 h-4 w-px bg-border" />
                <Button
                  variant={showInspector ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setShowInspector((s) => !s)}
                >
                  {showInspector ? "Hide audit panel" : "Show audit panel"}
                </Button>
              </div>
            </div>

            {/* Stage Body */}
            <div className="flex min-h-0 flex-1">
              {/* Left thumbnail rail */}
              <div className="w-36 shrink-0 overflow-y-auto border-r border-border bg-bg/30 p-2.5">
                <p className="uppercase-label mb-2 px-1">Pages ({SCRIPT_INFO.pages})</p>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: SCRIPT_INFO.pages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`group relative flex flex-col items-center rounded-control border p-1.5 transition-all ${
                          isActive
                            ? "border-brand bg-brand-light shadow-sm"
                            : "border-border bg-white hover:border-brand/40"
                        }`}
                      >
                        <div className="h-16 w-12 rounded border border-border/60 bg-white p-1 shadow-inner flex flex-col justify-between">
                          <div className="h-1 w-4 rounded bg-muted/30" />
                          <div className="space-y-0.5">
                            <div className="h-0.5 w-full rounded bg-muted/20" />
                            <div className="h-0.5 w-3/4 rounded bg-muted/20" />
                          </div>
                          <span className="text-[9px] font-bold text-brand">P.{pageNum}</span>
                        </div>
                        <span className={`mt-1 text-[10px] font-medium ${isActive ? "text-brand-dark" : "text-muted"}`}>
                          {pageNum === 1 ? "Cover" : pageNum === 8 ? "Notes" : `Q${pageNum - 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Center Canvas */}
              <div className="relative flex flex-1 items-center justify-center overflow-auto bg-slate-100 p-6">
                <PageCanvas
                  page={currentPage}
                  zoom={zoom}
                  rotate={rotation}
                />
              </div>
            </div>
          </div>

          {/* Right Audit Inspector Drawer */}
          {showInspector && (
            <div className="w-80 shrink-0 flex flex-col gap-3 overflow-y-auto">
              <Card>
                <CardHeader
                  title="Marks summary"
                  sub="Official recorded scores for this script"
                />
                <div className="flex flex-col gap-2.5">
                  <div className="rounded-control bg-bg p-3">
                    <div className="flex items-center justify-between text-caption text-muted">
                      <span>Total score</span>
                      <span className="font-semibold text-text">75 / 100</span>
                    </div>
                    <p className="text-title font-bold text-brand">Grade: A</p>
                    <Progress value={75} max={100} />
                  </div>

                  <div className="divide-y divide-border text-caption">
                    {[
                      { q: "Question 1", max: 20, mark: 18, topic: "Context-free grammars" },
                      { q: "Question 2", max: 15, mark: 14, topic: "First and Follow sets" },
                      { q: "Question 3", max: 15, mark: 12, topic: "Shift-reduce parsing" },
                      { q: "Question 4", max: 20, mark: 16, topic: "Type inference algorithm" },
                      { q: "Question 5", max: 20, mark: 15, topic: "Target code generation" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5">
                        <div>
                          <p className="font-semibold text-text">{item.q}</p>
                          <p className="text-[11px] text-muted">{item.topic}</p>
                        </div>
                        <span className="font-bold text-brand-dark">
                          {item.mark} / {item.max}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Audit & verification" />
                <div className="flex flex-col gap-2 text-caption">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted">Primary marker</span>
                    <span className="font-medium text-text">Marker #4 (Chidinma Eze)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted">Completed</span>
                    <span className="font-medium text-text">24 Jul 2026, 16:42</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted">Integrity status</span>
                    <span className="font-medium text-success flex items-center gap-1">
                      <CircleCheckBig size={13} /> 8/8 Pages verified
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted">Moderation batch</span>
                    <Badge tone="neutral">10% Random sample</Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}

