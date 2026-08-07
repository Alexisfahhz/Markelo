import React, { useEffect, useState } from "react";
import { FLOW, FlowScreen } from "./flow";
import { ScreenShell } from "./components/ScreenShell";
import { PrototypeNav } from "./components/PrototypeNav";

/*
  Markelo prototype flow, Exam Setup · Student Data · Triage & Review.

  Every screen sits on one long vertical canvas, one viewport each. There is
  no routing, movement is smooth scrolling between artboards.

  The floating prototype navigation is app-level (one instance, scroll-spied),
  so it can never stack or shadow itself.
*/
function isScreen(entry: (typeof FLOW)[number]): entry is FlowScreen {
  return "id" in entry;
}

const SCREENS = FLOW.filter(isScreen);

export default function App() {
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const ids = SCREENS.map((s) => s.id);
    let ticking = false;

    const spy = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mid = window.scrollY + window.innerHeight * 0.5;
        let found: string | null = null;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= mid) found = id;
        }
        setCurrentId(found);
        ticking = false;
      });
    };

    spy();
    window.addEventListener("scroll", spy, { passive: true });
    return () => window.removeEventListener("scroll", spy);
  }, []);

  return (
    <div className="bg-bg text-text">
      {FLOW.map((entry, i) =>
        isScreen(entry) ? (
          <ScreenShell key={entry.id} screen={entry} index={SCREENS.indexOf(entry)} />
        ) : (
          <section key={`ch-${i}`} className="scroll-mt-0">
            <div className="flex flex-col items-center gap-1.5 py-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-40 bg-border" aria-hidden />
                <p className="shrink-0 text-label uppercase tracking-[0.14em] text-brand">{entry.chapter}</p>
                <span className="h-px w-40 bg-border" aria-hidden />
              </div>
            </div>
          </section>
        )
      )}
      {currentId && <PrototypeNav flow={SCREENS} currentId={currentId} />}
      <div className="flex flex-col items-center gap-1.5 py-12">
        <p className="text-label uppercase tracking-[0.12em] text-muted">
          End of prototype, {SCREENS.length} screens
        </p>
        <p className="text-caption text-muted">
          Markelo · Exam Setup · Student Data · Triage & Review · presentation layer only, no routing or backend
        </p>
      </div>
    </div>
  );
}
