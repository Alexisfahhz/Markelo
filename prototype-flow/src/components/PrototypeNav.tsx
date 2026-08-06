import React from "react";
import { FlowScreen, scrollToId } from "../flow";

/*
  Floating prototype navigation. Rendered once, app-level.

  A scroll-spy tracks which screen is visible so the prev/next state is
  always correct. These controls exist purely to move the viewer around the
  presentation canvas. They are NOT part of the product UI.
*/
export function PrototypeNav({ flow, currentId }: { flow: FlowScreen[]; currentId: string }) {
  const idx = flow.findIndex((s) => s.id === currentId);
  const prev = idx > 0 ? flow[idx - 1] : null;
  const next = idx < flow.length - 1 ? flow[idx + 1] : null;

  return (
    <nav className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1.5">
      <span className="rounded-full bg-text/85 px-2.5 py-1 text-label uppercase tracking-wide text-white">
        Prototype navigation
      </span>
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-white px-2 py-1.5 shadow-md">
        <NavBtn
          disabled={!prev}
          onClick={() => prev && scrollToId(prev.id)}
          title={prev ? `Previous: ${prev.label}` : "No previous screen"}
          label="Previous screen"
        >
          ←
        </NavBtn>
        <NavBtn
          disabled={!next}
          onClick={() => next && scrollToId(next.id)}
          title={next ? `Next: ${next.label}` : "No next screen"}
          label="Next screen"
        >
          →
        </NavBtn>
        <span className="mx-0.5 h-4 w-px bg-border" aria-hidden />
        <NavBtn
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          label="Scroll to top"
        >
          ↑ Top
        </NavBtn>
      </div>
    </nav>
  );
}

function NavBtn({
  children,
  onClick,
  disabled,
  label,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      aria-label={label}
      className="h-7 rounded-full px-2.5 text-caption font-medium text-text transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}