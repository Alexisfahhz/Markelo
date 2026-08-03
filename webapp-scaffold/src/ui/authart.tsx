/*
  Auth panel artwork.

  Twelve compositions, one per signed-out screen, each about the thing that
  screen is actually for. They are drawn, not sourced, for three reasons:

  1. Every colour is a design token. A stock 3D render would import a palette
     nobody approved and could not be re-tinted when the brand moves.
  2. This scaffold is exported to Figma with html-to-design. Vector arrives as
     editable layers; a PNG arrives as one flat rectangle, which defeats the
     point of the export.
  3. Twelve pieces in one consistent style is the hard part of sourcing, and
     the easy part of composing from shared primitives.

  Everything is built from two primitives, `Plate` and `Slab`, on a fixed
  isometric projection (2:1, the standard game-art dimetric angle). That is
  what makes twelve different subjects read as one family rather than twelve
  drawings. Each scene is the same plinth with a different subject on it.

  All of it is decorative. The panel's headline and bullets carry the meaning,
  so every root svg is aria-hidden and nothing here is load-bearing for a
  screen reader.
*/
import React from "react";

const VB = "0 0 320 300";

/* An isometric parallelogram with an extruded thickness below it. */
function Plate({
  cx,
  cy,
  w,
  t = 14,
  className = "fill-brand",
  side = "fill-brand-dark",
  stroke,
}: {
  cx: number;
  cy: number;
  w: number;
  t?: number;
  className?: string;
  side?: string;
  stroke?: string;
}) {
  const h = w / 2;
  return (
    <g>
      <polygon
        points={`${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + t} ${cx},${cy + h + t}`}
        className={side}
      />
      <polygon
        points={`${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + t} ${cx - w},${cy + t}`}
        className={side}
        opacity={0.72}
      />
      <polygon
        points={`${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`}
        className={className}
        stroke={stroke ? "currentColor" : undefined}
        strokeWidth={stroke ? 1 : undefined}
      />
    </g>
  );
}

/* A thin upright panel standing on the plinth, used for booklets and screens. */
function Slab({
  x,
  y,
  w,
  h,
  className = "fill-brand",
  skew = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
  skew?: 1 | -1;
}) {
  const d = (w / 2) * 0.5 * skew;
  return (
    <polygon
      points={`${x},${y} ${x + w},${y - d} ${x + w},${y - d + h} ${x},${y + h}`}
      className={className}
    />
  );
}

/* The shared plinth every scene stands on. */
function Plinth() {
  return (
    <g>
      <Plate cx={160} cy={236} w={116} t={12} className="fill-brand/25" side="fill-brand-dark/60" />
      <Plate cx={160} cy={214} w={78} t={11} className="fill-brand/50" side="fill-brand-dark/80" />
    </g>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    /*
      Height-first, not width-first. Sized `w-full` it kept its intrinsic
      height and, in a panel laid out with `justify-between`, pushed the footer
      line straight through the bullet list on any frame shorter than about
      900px. Driving it from height instead lets it give space back as the
      panel gets shorter, and the viewBox keeps the aspect ratio while it does.
    */
    <svg
      viewBox={VB}
      className="h-full min-h-[150px] max-h-[300px] w-auto max-w-full text-white/25"
      aria-hidden
      role="presentation"
    >
      <Plinth />
      {children}
    </svg>
  );
}

/* 01 Sign in: the promise. A shield resting on the booklets you already use. */
export function ArtShield() {
  return (
    <Frame>
      <Slab x={112} y={168} w={44} h={34} className="fill-brand/70" />
      <Slab x={162} y={176} w={44} h={26} className="fill-brand/55" />
      <path
        d="M160 84l44 17v27c0 27-18 45-44 54-26-9-44-27-44-54v-27z"
        className="fill-brand-light/95"
      />
      <path d="M142 132l13 13 24-26" fill="none" className="stroke-brand" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* 02 Signing in: motion, nothing decided yet. Concentric arcs around the mark. */
export function ArtConnecting() {
  return (
    <Frame>
      <circle cx={160} cy={138} r={30} className="fill-brand-light/90" />
      <circle cx={160} cy={138} r={52} fill="none" className="stroke-brand-light/45" strokeWidth={5} strokeDasharray="60 26" strokeLinecap="round" />
      <circle cx={160} cy={138} r={72} fill="none" className="stroke-brand-light/22" strokeWidth={4} strokeDasharray="34 44" strokeLinecap="round" />
      <path d="M150 128h20v20h-20z" className="fill-brand" opacity={0.85} />
    </Frame>
  );
}

/* 03 Wrong details: a key that does not turn. */
export function ArtKeyRejected() {
  return (
    <Frame>
      <Slab x={126} y={166} w={68} h={38} className="fill-brand/60" />
      <circle cx={144} cy={122} r={26} fill="none" className="stroke-brand-light/90" strokeWidth={10} />
      <path d="M166 122h50m-16 0v18m-14-18v13" fill="none" className="stroke-brand-light/90" strokeWidth={10} strokeLinecap="round" />
      <circle cx={214} cy={92} r={22} className="fill-error" />
      <path d="M206 84l16 16m0-16l-16 16" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    </Frame>
  );
}

/* 04 MFA: one check is not enough, so there are two. */
export function ArtSecondCheck() {
  return (
    <Frame>
      <Slab x={104} y={150} w={52} h={54} className="fill-brand/45" />
      <rect x={158} y={92} width={62} height={104} rx={10} className="fill-brand-light/95" />
      <rect x={170} y={112} width={38} height={7} rx={3.5} className="fill-brand/45" />
      <g className="fill-brand">
        <circle cx={175} cy={140} r={7} />
        <circle cx={195} cy={140} r={7} />
        <circle cx={175} cy={162} r={7} opacity={0.3} />
        <circle cx={195} cy={162} r={7} opacity={0.3} />
      </g>
      <circle cx={112} cy={112} r={26} className="fill-brand" />
      <path d="M102 112l7 8 14-15" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* 05 Accept invitation: it opens outward, someone put you here on purpose. */
export function ArtInvitation() {
  return (
    <Frame>
      <path d="M96 128l64-36 64 36v76H96z" className="fill-brand-light/95" />
      <path d="M96 128l64 44 64-44" fill="none" className="stroke-brand" strokeWidth={6} strokeLinejoin="round" />
      <path d="M124 106h72v40l-36 24-36-24z" className="fill-brand/25" />
      <circle cx={224} cy={104} r={22} className="fill-success" />
      <path d="M214 104l7 8 13-15" fill="none" stroke="#fff" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* 06 Forgot password: the key is reissued, not recovered. */
export function ArtReissue() {
  return (
    <Frame>
      <circle cx={160} cy={140} r={58} fill="none" className="stroke-brand-light/35" strokeWidth={9} strokeDasharray="150 40" strokeLinecap="round" />
      <path d="M204 108l14-6-2 18z" className="fill-brand-light/70" />
      <circle cx={146} cy={140} r={22} fill="none" className="stroke-brand-light/95" strokeWidth={9} />
      <path d="M166 140h44m-14 0v16m-13-16v11" fill="none" className="stroke-brand-light/95" strokeWidth={9} strokeLinecap="round" />
    </Frame>
  );
}

/* 07 Reset sent: it has left, and it is in one specific inbox. */
export function ArtSent() {
  return (
    <Frame>
      <path d="M96 122h128v82H96z" className="fill-brand-light/95" />
      <path d="M96 122l64 46 64-46" fill="none" className="stroke-brand" strokeWidth={6} strokeLinejoin="round" />
      <path d="M60 100h44m-30 18h30m-16 18h16" fill="none" className="stroke-brand-light/40" strokeWidth={6} strokeLinecap="round" />
      <circle cx={224} cy={104} r={22} className="fill-success" />
      <path d="M214 104l7 8 13-15" fill="none" stroke="#fff" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* 08 No role: the account exists, the seat is empty. Outline, not fill. */
export function ArtNoRole() {
  return (
    <Frame>
      <Plate cx={160} cy={150} w={62} t={10} className="fill-transparent" side="fill-brand/25" />
      <polygon
        points="160,119 222,150 160,181 98,150"
        fill="none"
        className="stroke-brand-light/55"
        strokeWidth={5}
        strokeDasharray="14 12"
        strokeLinejoin="round"
      />
      <circle cx={160} cy={112} r={19} fill="none" className="stroke-brand-light/45" strokeWidth={5} strokeDasharray="12 10" />
    </Frame>
  );
}

/* 09 Suspended: everything is still there, the way through is barred. */
export function ArtSuspended() {
  return (
    <Frame>
      <Slab x={112} y={162} w={44} h={42} className="fill-brand/30" />
      <Slab x={162} y={170} w={44} h={34} className="fill-brand/22" />
      <circle cx={160} cy={124} r={44} fill="none" className="stroke-warning" strokeWidth={11} />
      <path d="M130 94l60 60" fill="none" className="stroke-warning" strokeWidth={11} strokeLinecap="round" />
    </Frame>
  );
}

/* 10 Choose role: the same person, more than one seat. One is lifted. */
export function ArtRoles() {
  return (
    <Frame>
      <Plate cx={160} cy={186} w={64} t={10} className="fill-brand/40" side="fill-brand-dark/80" />
      <Plate cx={160} cy={156} w={64} t={10} className="fill-brand/60" side="fill-brand-dark/80" />
      <Plate cx={160} cy={116} w={64} t={10} className="fill-brand-light/95" side="fill-brand" />
      <circle cx={160} cy={110} r={13} className="fill-brand" />
      <path d="M141 128c4-9 11-14 19-14s15 5 19 14z" className="fill-brand" />
    </Frame>
  );
}

/* 11 Session expiring: time is the subject, and it has not run out yet. */
export function ArtExpiring() {
  return (
    <Frame>
      <circle cx={160} cy={136} r={50} className="fill-brand-light/95" />
      <circle cx={160} cy={136} r={50} fill="none" className="stroke-warning" strokeWidth={8} strokeDasharray="236 78" strokeLinecap="round" transform="rotate(-90 160 136)" />
      <path d="M160 106v32l22 13" fill="none" className="stroke-brand" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* 12 Revoked mid-work: the link is cut, the work on this side is still saved. */
export function ArtRevoked() {
  return (
    <Frame>
      <Slab x={78} y={158} w={52} h={46} className="fill-brand/55" />
      <Slab x={196} y={158} w={52} h={46} className="fill-brand/22" />
      <path d="M120 128h28" fill="none" className="stroke-brand-light/80" strokeWidth={9} strokeLinecap="round" />
      <path d="M186 128h28" fill="none" className="stroke-brand-light/30" strokeWidth={9} strokeLinecap="round" />
      <path d="M158 108l-12 40" fill="none" className="stroke-error" strokeWidth={8} strokeLinecap="round" />
      <path d="M176 108l-12 40" fill="none" className="stroke-error" strokeWidth={8} strokeLinecap="round" />
      <circle cx={96} cy={112} r={20} className="fill-success" />
      <path d="M87 112l6 7 12-14" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}
