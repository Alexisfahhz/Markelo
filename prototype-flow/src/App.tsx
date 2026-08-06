import React, { useEffect, useState } from "react";
import { FLOW } from "./flow";
import { ScreenShell } from "./components/ScreenShell";
import { PrototypeNav } from "./components/PrototypeNav";

/*
  Markelo prototype flow, Institution & governance.

  Every screen sits on one long vertical canvas, one viewport each. There is
  no routing, movement is smooth scrolling between artboards.

  The floating prototype navigation is app-level (one instance, scroll-spied),
  so it can never stack or shadow itself.
*/
export default function App() {
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const ids = FLOW.map((s) => s.id);
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
      {FLOW.map((screen, i) => (
        <ScreenShell key={screen.id} screen={screen} index={i} />
      ))}
      {currentId && <PrototypeNav flow={FLOW} currentId={currentId} />}
      <div className="flex flex-col items-center gap-1.5 py-12">
        <p className="text-label uppercase tracking-[0.12em] text-muted">
          End of prototype, {FLOW.length} screens
        </p>
        <p className="text-caption text-muted">
          Markelo · Institution & governance · presentation layer only, no routing or backend
        </p>
      </div>
    </div>
  );
}