/*
  Component reference sheets. Not product screens. They exist so a variant
  set can be rebuilt in Figma without hunting for it across 65 screens.
*/
import { Notice } from "../ui/kit";

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
