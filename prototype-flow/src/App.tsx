import React, { useEffect, useState } from "react";
import { DASHBOARD_SCREENS, FLOW } from "./flow";
import { ScreenShell } from "./components/ScreenShell";
import { PrototypeNav } from "./components/PrototypeNav";

/*
  Markelo prototype flow.

  Every screen sits on one long vertical canvas, one viewport each, in the
  same order the scaffold registry presents them. There is no routing —
  movement is smooth scrolling between artboards.

  The floating prototype navigation is app-level (one instance, scroll-spied),
  so it can never stack or shadow itself.
*/
export default function App() {
  const [currentDashboard, setCurrentDashboard] = useState<string | null>(null);

  useEffect(() => {
    const dashIds = DASHBOARD_SCREENS.map((d) => d.id);
    let ticking = false;

    const spy = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mid = window.scrollY + window.innerHeight * 0.5;
        let found: string | null = null;
        for (const id of dashIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= mid) found = id;
        }
        setCurrentDashboard(found);
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
      {currentDashboard && <PrototypeNav currentId={currentDashboard} />}
      <div className="flex flex-col items-center gap-1.5 py-12">
        <p className="text-label uppercase tracking-[0.12em] text-muted">
          End of prototype — {FLOW.length} screens
        </p>
        <p className="text-caption text-muted">
          Markelo · presentation layer only, no routing or backend
        </p>
      </div>
    </div>
  );
}
