import React from "react";
import { FLOW, FlowScreen } from "./flow";
import { ScreenShell } from "./components/ScreenShell";

/*
  Markelo prototype flow, active build: Exam Setup · Student Data & Results ·
  Scanning · Triage & Review (4 chapters, 11 artboards). Institution &
  governance + Booklet profile are archived in flow-institution-booklet.tsx.

  Every screen sits on one long vertical canvas at the 1440 Desktop Grid frame,
  one artboard each. There is no routing and no floating navigation: movement is
  by the per-screen trigger points ScreenShell renders in each artboard's margin
  (see ScreenShell for why the floating nav was removed).
*/
function isScreen(entry: (typeof FLOW)[number]): entry is FlowScreen {
  return "id" in entry;
}

const SCREENS = FLOW.filter(isScreen);

export default function App() {
  return (
    <div className="bg-bg text-text">
      {FLOW.map((entry, i) => {
        if (!isScreen(entry)) {
          return (
            <section key={`ch-${i}`} className="scroll-mt-0">
              <div className="flex flex-col items-center gap-1.5 pt-10 pb-2">
                <div className="flex items-center gap-3">
                  <span className="h-px w-40 bg-border" aria-hidden />
                  <p className="shrink-0 text-label uppercase tracking-[0.14em] text-brand">{entry.chapter}</p>
                  <span className="h-px w-40 bg-border" aria-hidden />
                </div>
              </div>
            </section>
          );
        }
        const si = SCREENS.indexOf(entry);
        return (
          <ScreenShell
            key={entry.id}
            screen={entry}
            index={si}
            prev={si > 0 ? SCREENS[si - 1] : null}
            next={si < SCREENS.length - 1 ? SCREENS[si + 1] : null}
          />
        );
      })}

      <div className="flex flex-col items-center gap-1.5 py-12">
        <p className="text-label uppercase tracking-[0.12em] text-muted">
          End of prototype, {SCREENS.length} screens
        </p>
        <p className="text-caption text-muted">
          Markelo · Exam Setup · Student Data &amp; Results · Scanning · Triage &amp; Review · default states only · presentation layer, no routing or backend
        </p>
      </div>
    </div>
  );
}
