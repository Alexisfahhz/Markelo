import React from "react";
import { FlowScreen, scrollToId } from "../flow";

/*
  One prototype "artboard": a small screen label, then the real screen
  rendered at exactly one viewport height. The scaffold's AppFrame and
  AuthFrame are both h-full flex layouts, so they fill the block and keep
  their own internal scrolling for tall content.

  CTA wiring is done by click delegation on this wrapper, without touching
  the screens: a click on any button/link is matched against the screen's
  action map (by visible text) and smooth-scrolls to the target screen.
*/
export function ScreenShell({ screen, index }: { screen: FlowScreen; index: number }) {
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
      <div className="flex flex-col items-center gap-1.5 py-3">
        <p className="text-label uppercase tracking-[0.12em] text-muted">
          Screen {String(index + 1).padStart(2, "0")} · {screen.label}
        </p>
        <div className="h-px w-24 bg-border/70" aria-hidden />
      </div>

      {/*
        The artboard is pinned to exactly 1440px, the Desktop Grid's frame
        width. It used to be `px-6` on a full-width block, which made every
        screen render at viewport minus 48px: at a 1440 window that is 1392,
        and html-to-design carried that 1392 straight into Figma as the frame
        width. The padding is now margin around a fixed block instead of an
        inset inside a fluid one, so the exported frame is 1440 regardless of
        how wide the browser window happens to be.
      */}
      <div className="mx-auto w-max px-6 pb-12" onClick={handleClick}>
        <div className="h-[1024px] w-[1440px] shrink-0">{screen.el}</div>
      </div>
    </section>
  );
}
