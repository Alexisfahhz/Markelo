import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FlowScreen, scrollToId } from "../flow";

/*
  One prototype "artboard": a real screen rendered at exactly the 1440 Desktop
  Grid frame, with its own PER-SCREEN trigger points in the surrounding margin.

  Trigger points (this replaced the single floating nav on KingFizzy's
  instruction, 2026-08-10): every screen carries its own two affordances so you
  can move from anywhere on the canvas without a floating control.
    - a "previous" trigger in the TOP margin strip  -> scrolls up to the prior screen
    - a "next" trigger in the BOTTOM margin strip    -> scrolls down to the next screen
  Both live in the margin around the fixed 1440 block, never on top of the
  product UI, so an html-to-design export of the block is unaffected by them.

  CTA wiring still works: a click on any real button/link inside the screen is
  matched against the screen's action map (by visible text) and, on a hit,
  smooth-scrolls to the target. Unmapped buttons do nothing, correct for a demo.
*/
export function ScreenShell({
  screen,
  index,
  prev,
  next,
}: {
  screen: FlowScreen;
  index: number;
  prev: FlowScreen | null;
  next: FlowScreen | null;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (screen.advanceAnywhereTo) {
      scrollToId(screen.advanceAnywhereTo);
      return;
    }
    const clicked = (e.target as HTMLElement).closest("button, a") as HTMLElement | null;
    if (!clicked) return;
    const text = (clicked.textContent ?? "").trim();
    const hit = screen.actions?.find((a) =>
      text.toLowerCase().includes(a.match.toLowerCase())
    );
    if (hit) scrollToId(hit.to);
  };

  return (
    <section id={screen.id} className="scroll-mt-0">
      {/* Top strip: screen label, and the "previous" trigger point. */}
      <div className="flex flex-col items-center gap-2 py-4">
        {prev ? (
          <button
            type="button"
            onClick={() => scrollToId(prev.id)}
            title={`Previous: ${prev.label}`}
            aria-label={`Go to previous screen, ${prev.label}`}
            className="group flex items-center gap-1.5 rounded-pill border border-border bg-white px-3 py-1 text-caption font-medium text-muted shadow-sm transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronUp size={14} strokeWidth={2} aria-hidden />
            <span>Previous</span>
            <span className="text-muted/70 group-hover:text-brand/70">· {prev.label}</span>
          </button>
        ) : (
          <span className="rounded-pill bg-brand/10 px-3 py-1 text-caption font-semibold uppercase tracking-[0.12em] text-brand">
            Start of flow
          </span>
        )}
        <p className="text-label uppercase tracking-[0.12em] text-muted">
          Screen {String(index + 1).padStart(2, "0")} · {screen.label}
        </p>
        <div className="h-px w-24 bg-border/70" aria-hidden />
      </div>

      {/*
        The artboard is pinned to exactly 1440px, the Desktop Grid's frame
        width, so an html-to-design export carries a true 1440 frame into Figma
        regardless of how wide the browser window happens to be.
      */}
      <div className="mx-auto w-max px-6" onClick={handleClick}>
        <div className="h-[1024px] w-[1440px] shrink-0">{screen.el}</div>
      </div>

      {/* Bottom strip: the "next" trigger point. */}
      <div className="flex flex-col items-center gap-2 py-8">
        {next ? (
          <button
            type="button"
            onClick={() => scrollToId(next.id)}
            title={`Next: ${next.label}`}
            aria-label={`Go to next screen, ${next.label}`}
            className="group flex items-center gap-2 rounded-pill bg-brand px-5 py-2 text-body font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            <span>Next · {next.label}</span>
            <ChevronDown size={16} strokeWidth={2.25} aria-hidden className="transition-transform group-hover:translate-y-0.5" />
          </button>
        ) : (
          <span className="rounded-pill bg-brand/10 px-3 py-1 text-caption font-semibold uppercase tracking-[0.12em] text-brand">
            End of flow
          </span>
        )}
      </div>
    </section>
  );
}
