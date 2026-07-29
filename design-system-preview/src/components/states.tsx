import {
  IconInbox,
  IconAlertTriangle,
  IconLock,
  IconRefresh,
  IconFileUpload,
} from "@tabler/icons-react";
import { Button } from "./primitives";

/* ============================================================
   EMPTY / ERROR / PERMISSION-DENIED
   US v2 adds a denial criterion to every role-gated story, so a
   screen without a 403 state is incomplete by spec.
   ============================================================ */

function Shell({
  icon: I,
  tint,
  title,
  body,
  action,
}: {
  icon: typeof IconInbox;
  tint: string;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-card px-6 py-12 text-center">
      <span className={`flex h-14 w-14 items-center justify-center rounded-pill ${tint}`}>
        <I size={26} stroke={1.5} />
      </span>
      <h3 className="mt-4 text-[16px] font-semibold text-text">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function EmptyState() {
  return (
    <Shell
      icon={IconFileUpload}
      tint="bg-brand-light text-brand"
      title="No scan batches yet"
      body="Upload scanned scripts from your scanning station to begin automatic control-sheet detection and separation."
      action={<Button leftIcon={IconFileUpload}>Upload scan batch</Button>}
    />
  );
}

export function ErrorState() {
  return (
    <Shell
      icon={IconAlertTriangle}
      tint="bg-error-light text-error"
      title="Couldn't load the review queue"
      body="Something went wrong reaching the server. Your marking is saved locally and nothing is lost."
      action={
        <Button variant="secondary" leftIcon={IconRefresh}>
          Try again
        </Button>
      }
    />
  );
}

export function DeniedState() {
  return (
    <Shell
      icon={IconLock}
      tint="bg-bg text-muted"
      title="You don't have access to this"
      body="Viewing student identity is restricted to the Examination Officer. Markers work with anonymous Script IDs only, this is enforced by the system, not a setting."
    />
  );
}

export function EmptyInboxState() {
  return (
    <Shell
      icon={IconInbox}
      tint="bg-success-light text-success"
      title="Nothing needs review"
      body="Every script in this batch matched a control sheet with high confidence. There's nothing in the manual queue."
    />
  );
}
