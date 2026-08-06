/*
  Component reference sheets. Not product screens. They exist so a variant
  set can be rebuilt in Figma without hunting for it across 65 screens.
*/
import { Notice, Tooltip } from "../ui/kit";

function Row({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-6 border-b border-border py-6 last:border-0">
      <div>
        <p className="text-body font-semibold text-text">{label}</p>
        {note && <p className="mt-1 text-caption text-muted">{note}</p>}
      </div>
      <div className="flex max-w-xl flex-col gap-3">{children}</div>
    </div>
  );
}

const BODY = "This action will cause your team to lose access to the account until you use the correct SSO source.";

export function AttentionBoxes() {
  return (
    <div className="h-full overflow-y-auto bg-bg p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-title font-bold text-text">Attention box</h1>
        <p className="mt-2 max-w-xl text-body text-muted">
          Flat tinted fill, 8px radius, neutral text. No accent bar. The icon is forced on for
          success, warning and error, because with the tone carried only by the fill, colour would
          otherwise be the sole indicator of meaning. That is WCAG 2.2 SC 1.4.1.
        </p>

        <div className="mt-8 rounded-card border border-border bg-white px-6">
          <Row label="Type" note="Five tones. Neutral is the only outlined one.">
            <Notice tone="brand" title="Attention box title">{BODY}</Notice>
            <Notice tone="neutral" title="Attention box title">{BODY}</Notice>
            <Notice tone="success" title="Attention box title">{BODY}</Notice>
            <Notice tone="warning" title="Attention box title">{BODY}</Notice>
            <Notice tone="error" title="Attention box title">{BODY}</Notice>
          </Row>

          <Row label="No icon" note="Only allowed on brand and neutral.">
            <Notice tone="brand" icon={false} title="Attention box title">{BODY}</Notice>
            <Notice tone="neutral" icon={false} title="Attention box title">{BODY}</Notice>
          </Row>

          <Row label="Dismissible" note="Opt-in. Never on a notice the user still needs.">
            <Notice tone="brand" title="Attention box title" onDismiss={() => {}}>{BODY}</Notice>
          </Row>

          <Row label="Link">
            <Notice tone="brand" title="Attention box title" link={{ label: "Read more" }}>{BODY}</Notice>
          </Row>

          <Row label="Button" note="One button maximum.">
            <Notice tone="brand" title="Attention box title" action={{ label: "Button" }}>{BODY}</Notice>
          </Row>

          <Row label="Link + button">
            <Notice
              tone="brand"
              title="Attention box title"
              link={{ label: "Read more" }}
              action={{ label: "Button" }}
              onDismiss={() => {}}
            >
              {BODY}
            </Notice>
          </Row>

          <Row label="Compact" note="One line, no title, text truncates.">
            <Notice tone="brand" compact>{BODY}</Notice>
            <Notice tone="brand" compact link={{ label: "Read more" }} action={{ label: "Button" }} onDismiss={() => {}}>
              {BODY}
            </Notice>
          </Row>

          <Row label="No title" note="Body only.">
            <Notice tone="warning">{BODY}</Notice>
          </Row>
        </div>

        <div className="mt-8 rounded-card border border-border bg-white p-6">
          <p className="text-card font-semibold text-text">On the page background</p>
          <p className="mt-1 text-caption text-muted">
            Markelo's page background is #F5F5F5 and the tints are pale. This is how much the fill
            separates from it. See the note in the audit.
          </p>
          <div className="mt-4 flex flex-col gap-3 rounded-control bg-bg p-6">
            <Notice tone="brand" title="On #F5F5F5">{BODY}</Notice>
            <Notice tone="warning" title="On #F5F5F5">{BODY}</Notice>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Tooltip */

export function TooltipSamples() {
  return (
    <div className="h-full overflow-y-auto bg-bg p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-title font-bold text-text">Tooltip</h1>
        <p className="mt-2 max-w-2xl text-body text-muted">
          Dark tooltip (#1A1A1A, white 10px text, 4px radius) with a 16px×8px
          triangular arrow drawn via CSS clip-path. The arrow and body share the
          same fill so they read as one continuous shape. Rendered to document.body
          via portal so it can never be clipped by parent overflow.
        </p>

        {/*
          Animation documentation. This block is for developers recreating the
          effect in code or motion tools (CSS, Remotion, After Effects, Figma
          prototype mode). Every value is deliberate and measurable.
        */}
        <div className="mt-6 rounded-card border border-brand/20 bg-brand-light/30 p-6">
          <p className="text-card font-semibold text-text">Animation specification</p>
          <div className="mt-3 flex flex-col gap-4">
            <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-1 text-caption">
              <span className="font-semibold text-text">Duration</span>
              <span className="text-muted">200ms, the project's --motion-quick token (CSS variable). This is the
                shortest project duration; a tooltip that lingers reads as lag.</span>

              <span className="font-semibold text-text">Easing</span>
              <span className="text-muted">--motion-enter: cubic-bezier(0, 0, 0.2, 1). A standard "arriving"
                curve — fast start, gentle settle. No bounce in the curve itself; the
                bounce is in the keyframe, not the easing.</span>

              <span className="font-semibold text-text">Delay</span>
              <span className="text-muted">300ms before the tooltip appears. This prevents every element you
                pass over from firing a tooltip; only deliberate pauses trigger one.</span>

              <span className="font-semibold text-text">Bounce keyframe</span>
              <span className="font-mono text-muted">
                0%: opacity 0, scale 0.85, translateY(4px)<br />
                60%: opacity 1, scale 1.06, translateY(-2px)<br />
                100%: opacity 1, scale 1, translateY(0)
              </span>

              <span className="font-semibold text-text">Animation properties</span>
              <span className="text-muted">Only opacity and transform are animated, matching the project rule
                (never animate layout properties like height or margin). The animation
                fill mode is "both" so the final state persists.</span>

              <span className="font-semibold text-text">Reduced motion</span>
              <span className="text-muted">The global prefers-reduced-motion rule sets animation-duration to
                0.01ms. The tooltip appears instantly — a legible state change with no
                movement.</span>

              <span className="font-semibold text-text">Portal</span>
              <span className="text-muted">createPortal renders to document.body with position: fixed and
                coordinates from getBoundingClientRect(). This is how it escapes table
                overflow-x-auto, card overflow-hidden, and sidebar overflow-y-auto.</span>

              <span className="font-semibold text-text">Auto-direction</span>
              <span className="text-muted">When the trigger element is within 180px of the viewport top, the
                tooltip flips from top (arrow ↓) to bottom (arrow ↑). This prevents
                a top-positioned tooltip from rendering off screen. Explicit "top" /
                "bottom" / "right" overrides this.</span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-card border border-border bg-white px-6">
          <Row label="Default (auto)" note="Arrow points down, tooltip above. Flips to bottom automatically if near the viewport top.">
            <div className="flex items-center gap-2">
              <Tooltip content="Edit institution details">
                <span className="inline-flex cursor-default rounded-control border border-border px-3 py-1 text-body text-text">Hover me (auto)</span>
              </Tooltip>
            </div>
          </Row>

          <Row label="Bottom" note="Arrow points up, tooltip below. For elements at the top of a page or modal.">
            <Tooltip content="Save changes to this profile" position="bottom">
              <span className="inline-flex cursor-default rounded-control border border-border px-3 py-1 text-body text-text">Hover me (bottom)</span>
            </Tooltip>
          </Row>

          <Row label="Right" note="Arrow points left, tooltip to the right. For narrow columns like a sidebar row.">
            <Tooltip content="Notification preferences" position="right">
              <span className="inline-flex cursor-default rounded-control border border-border px-3 py-1 text-body text-text">Hover me (right)</span>
            </Tooltip>
          </Row>

          <Row label="Left" note="Arrow points right, tooltip to the left. For elements near the right edge of the screen.">
            <Tooltip content="Close this panel" position="left">
              <span className="inline-flex cursor-default rounded-control border border-border px-3 py-1 text-body text-text">Hover me (left)</span>
            </Tooltip>
          </Row>

          <Row label="Icon button" note="Same pattern as the People & Roles edit/suspend controls.">
            <Tooltip content="Edit roles">
              <button className="inline-flex h-8 w-8 cursor-default items-center justify-center rounded-control border border-border bg-white text-muted" aria-label="Edit">✎</button>
            </Tooltip>
          </Row>

          <Row label="Long text" note="Wraps naturally. The portal has no max-width restriction.">
            <Tooltip content="Your institution motto appears on result export headers, audit records, and the cover page of every report sent to your institution portal">
              <span className="inline-flex cursor-default rounded-control border border-border px-3 py-1 text-body text-text">Hover me (long)</span>
            </Tooltip>
          </Row>

          <Row label="Instant (0 delay)" note="For icon-only buttons where the tooltip is the primary label.">
            <Tooltip content="Archive this version" delay={0}>
              <span className="inline-flex cursor-default rounded-control border border-border px-3 py-1 text-body text-text">Hover me (instant)</span>
            </Tooltip>
          </Row>

          <Row label="Badge" note="Explains what a status badge actually means.">
            <Tooltip content="No role assigned yet — they can sign in but have no access to any exam data" position="bottom">
              <span className="inline-flex cursor-default rounded-badge bg-badge-warning-bg px-2 py-0.5 text-label text-badge-warning-text">Awaiting role</span>
            </Tooltip>
          </Row>

          <Row label="Inside a scrollable card" note="This container has overflow-x-auto. Because the tooltip renders to document.body, it will never be clipped regardless of how far the card scrolls.">
            <div className="overflow-x-auto rounded-control border border-border" style={{ maxWidth: 320 }}>
              <div className="flex items-center gap-1 p-3" style={{ minWidth: 500 }}>
                {["Edit", "Copy", "Archive", "Export", "Delete"].map((label) => (
                  <Tooltip key={label} content={`${label} this item`}>
                    <span className="inline-flex shrink-0 cursor-default rounded-control border border-border px-2 py-1 text-caption text-text">{label}</span>
                  </Tooltip>
                ))}
              </div>
            </div>
          </Row>

          <Row label="Grouped" note="Multiple tooltips close together. Each fires independently on hover.">
            <div className="flex items-center gap-2">
              <Tooltip content="View full details">
                <span className="cursor-default rounded-control border border-border px-2 py-1 text-caption text-text">Item A</span>
              </Tooltip>
              <Tooltip content="Compare side by side">
                <span className="cursor-default rounded-control border border-border px-2 py-1 text-caption text-text">Item B</span>
              </Tooltip>
              <Tooltip content="Remove from list">
                <span className="cursor-default rounded-control border border-border px-2 py-1 text-caption text-text">Item C</span>
              </Tooltip>
            </div>
          </Row>

          <Row label="Forced top" note="Overrides auto-detection. Use when the element's context demands top placement.">
            <Tooltip content="Rendered above regardless of viewport position" position="top">
              <span className="inline-flex cursor-default rounded-control border border-border px-3 py-1 text-body text-text">Hover me (forced)</span>
            </Tooltip>
          </Row>
        </div>
      </div>
    </div>
  );
}
