/*
  Standalone responsive preview. Not the review harness, and not a product screen.

  Why this exists
  ---------------
  Neither existing app can show the tablet layout, and the reasons are structural
  rather than bugs:

    5179  the review harness has a 256px screen-picker column of its own, so at a
          768px browser the product frame only receives 512. At a 1024px browser
          the frame would get a true 768, but by then the `max-lg` media query
          (max-width: 1023px) has already switched off. There is no browser width
          at which the harness shows a real tablet.

    5180  every artboard is pinned to `w-[1440px]` on purpose, so html-to-design
          exports true Desktop Grid frames into Figma. Resizing does nothing.

  A CSS media query reads the BROWSER viewport, never an element's width, so no
  amount of resizing a container inside either app can make `max-lg` fire. The
  only honest fix is a page where the product occupies the whole viewport.

  So: this entry renders one screen full-bleed with no chrome that takes
  horizontal space. The picker is a fixed overlay, so the screen still measures
  the full viewport width and the breakpoint behaves exactly as it will in
  production. Resize the window, or open it on a real iPad, and what you see is
  what the layout does.
*/
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { GROUPS } from "./App";
import "./index.css";

const ALL = GROUPS.flatMap((g) =>
  g.screens.map((s) => ({ ...s, group: g.title }))
);

function Preview() {
  const [idx, setIdx] = useState(() => {
    const q = new URLSearchParams(location.search).get("screen");
    const found = q ? ALL.findIndex((s) => s.id === q) : -1;
    return found >= 0 ? found : 0;
  });
  const [open, setOpen] = useState(false);
  const [w, setW] = useState(() => window.innerWidth);

  /*
    A plain `resize` listener is not enough. Some environments change the
    viewport without firing one (devtools device emulation, a programmatically
    resized pane), and the chip then reports the wrong breakpoint, which is
    worse than showing nothing: it tells you that you are looking at tablet
    when you are looking at desktop. ResizeObserver on the root element fires
    on any layout change, so it catches those cases too. Both are wired.
  */
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    const ro = new ResizeObserver(on);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", on);
      ro.disconnect();
    };
  }, []);

  const screen = ALL[idx];
  const go = (n: number) => {
    const next = (n + ALL.length) % ALL.length;
    setIdx(next);
    const u = new URL(location.href);
    u.searchParams.set("screen", ALL[next].id);
    history.replaceState(null, "", u);
  };

  return (
    <>
      {/* The screen itself, full viewport. Nothing may sit beside this. */}
      <div className="h-dvh w-full overflow-hidden">{screen.el}</div>

      {/*
        Every control below is `fixed`, so it is out of flow and contributes no
        width. That is the whole point: the screen above must measure the true
        viewport or the breakpoint lies.
      */}
      <div className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-white/95 p-1.5 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => go(idx - 1)}
          aria-label="Previous screen"
          className="rounded-full px-3 py-1.5 text-body font-medium text-text hover:bg-bg"
        >
          Prev
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="max-w-[46vw] truncate rounded-full px-3 py-1.5 text-body font-semibold text-text hover:bg-bg"
        >
          {screen.label}
        </button>

        <button
          type="button"
          onClick={() => go(idx + 1)}
          aria-label="Next screen"
          className="rounded-full px-3 py-1.5 text-body font-medium text-text hover:bg-bg"
        >
          Next
        </button>

        {/*
          The band label is driven by CSS, not by React state, and that is
          deliberate. A JS width listener can lag or be throttled (a hidden tab,
          devtools device emulation, a programmatically resized pane), and a
          chip that says "Tablet" while you are looking at desktop is worse than
          no chip at all. These two spans are shown and hidden by the very same
          `max-lg` query that drives the layout, so the label cannot disagree
          with what you are seeing. The pixel count stays on JS as a
          best-effort readout; if it ever looks stale, trust the word.
        */}
        <span
          className="ml-1 rounded-full bg-brand px-2.5 py-1 text-label font-semibold text-white max-lg:hidden"
          title="Viewport is 1024px or wider"
        >
          Desktop
        </span>
        <span
          className="ml-1 hidden rounded-full bg-success px-2.5 py-1 text-label font-semibold text-white max-lg:inline"
          title="Viewport is below 1024px, the max-lg breakpoint"
        >
          Tablet
        </span>
        <span className="px-1 text-label tabular-nums text-muted">{w}px</span>
      </div>

      {open && (
        <div className="fixed inset-0 z-[99] flex justify-center bg-black/30 p-4 pt-10" onClick={() => setOpen(false)}>
          <div
            className="max-h-full w-full max-w-md overflow-y-auto rounded-card border border-border bg-white p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {GROUPS.map((g) => (
              <div key={g.title} className="mb-2">
                <p className="px-2 py-1 text-label uppercase tracking-[0.1em] text-muted">
                  {g.title}
                </p>
                {g.screens.map((s) => {
                  const i = ALL.findIndex((x) => x.id === s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        go(i);
                        setOpen(false);
                      }}
                      className={`block w-full rounded-control px-2 py-1.5 text-left text-body ${
                        i === idx ? "bg-brand-light font-semibold text-brand" : "text-text hover:bg-bg"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Preview />
  </React.StrictMode>
);
