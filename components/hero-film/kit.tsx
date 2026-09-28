"use client";

import { interpolate } from "remotion";
import { Brain, CircleHelp, Compass, Gift } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { EASE, GLIDE, ramp } from "@/components/hero-film/motion";
import { useFrame } from "@/components/hero-film/frame";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/* ------------------------------------------------------------------------ */
/* Geometry                                                                  */
/*                                                                           */
/* The shell is laid out in fixed composition pixels, the reference's own    */
/* proportions (dub.co's dashboard, measured off `forVideo/`), so the cursor */
/* can be aimed at the same numbers the layout is built from.                */
/* ------------------------------------------------------------------------ */

export const RAIL_W = 56;
export const SIDEBAR_W = 176;
/** Left edge of the white main panel. */
export const MAIN_X = 1 + RAIL_W + SIDEBAR_W + 5;
/** Left edge of page content inside the main panel. */
export const CONTENT_X = MAIN_X + 1 + 30;
/** Top of page content, under the 46px page header. */
export const CONTENT_Y = 6 + 1 + 46 + 18;
/** Width of page content. */
export const CONTENT_W = 1200 - 5 - 1 - MAIN_X - 2 - 60;

/** Sidebar geometry: rows are 26px on a 28px pitch; group headings 30px. */
const NAV_TOP = 6 + 14 + 34;
const NAV_PITCH = 28;
const NAV_HEADING = 30;

export type NavItem = { label: string; icon: IconComponent; badge?: number };
export type NavGroup = { heading: string; items: NavItem[] };

/** Centre of a sidebar row, for aiming the cursor at it. */
export function navPoint(groups: NavGroup[], label: string): { x: number; y: number } {
  let y = NAV_TOP;
  for (const [g, group] of groups.entries()) {
    if (g > 0 || group.heading) y += NAV_HEADING;
    for (const item of group.items) {
      if (item.label === label) return { x: 1 + RAIL_W + 64, y: y + 13 };
      y += NAV_PITCH;
    }
  }
  return { x: 0, y: 0 };
}

/* ------------------------------------------------------------------------ */
/* Shell                                                                     */
/* ------------------------------------------------------------------------ */

/** The rail's product areas: learning (open) and the agents. */
const RAIL_PRODUCTS: Array<{ key: string; icon: IconComponent; active: boolean }> = [
  { key: "nauka", icon: Compass, active: true },
  { key: "agenci", icon: Brain, active: false },
];

/**
 * The application window: icon rail, sidebar, and the white main panel with
 * its page header — dub's shell, one to one. Every loop renders the same
 * sidebar (`appNav`); `active` is the row lit right now.
 */
export function Shell({
  nav = [],
  active,
  sidebar,
  framed = true,
  title,
  titleKey,
  headerRight,
  children,
}: {
  nav?: NavGroup[];
  active?: string;
  /**
   * Replaces the "Nauka" heading and `nav` with other sidebar content, for a
   * workspace that brings its own navigation (the exam simulation).
   */
  sidebar?: React.ReactNode;
  /**
   * The hero's window: a rounded top and an outline, its bottom cut by the
   * band edge. Unframed, the shell fills a card that draws its own edge, so
   * the panels close at the bottom too. The border stays, transparent, so
   * every coordinate matches the framed shell.
   */
  framed?: boolean;
  title: React.ReactNode;
  /** Changes whenever the page changes, so the header re-enters with it. */
  titleKey: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex overflow-hidden border bg-ash pr-[5px] pt-[5px] font-inter text-charcoal antialiased",
        framed ? "rounded-t-[14px] border-b-0 border-smoke" : "border-transparent pb-[5px]",
      )}
    >
      {/* Icon rail */}
      {/* Workspace mark at the very top, the same 34px footprint as the
          product tiles under it. */}
      <div className="flex shrink-0 flex-col items-center pt-[9px]" style={{ width: RAIL_W }}>
        <span className="grid size-[32px] place-items-center rounded-full bg-charcoal">
          <BrandMark className="size-[15px] text-white" />
        </span>
        <div className="mt-[12px] flex flex-col items-center gap-[6px]">
          {RAIL_PRODUCTS.map(({ key, icon: Icon, active }) => (
            <span
              key={key}
              className={cn(
                "grid size-[34px] place-items-center rounded-[9px]",
                active ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]" : "",
              )}
            >
              <Icon className="size-[16px] text-slate" strokeWidth={1.75} />
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center gap-[14px] pb-[18px]">
          <Gift className="size-[15px] text-slate" strokeWidth={1.75} />
          <CircleHelp className="size-[15px] text-slate" strokeWidth={1.75} />
          <span className="grid size-[24px] place-items-center rounded-full bg-[#dbeafe] text-[9px] font-semibold text-deep-sapphire">
            AW
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn("relative shrink-0 bg-paper-mist px-[10px] pt-[14px]", framed ? "rounded-t-[10px]" : "rounded-[10px]")}
        style={{ width: SIDEBAR_W }}
      >
        {sidebar ?? (
          <>
            <p className="flex h-[34px] items-start px-2 text-[14px] font-medium leading-none text-charcoal">
              Nauka
            </p>
            {nav.map((group, g) => (
              <div key={group.heading || g}>
                {(g > 0 || group.heading) && <NavHeading>{group.heading}</NavHeading>}
                <ul className="space-y-[2px]">
                  {group.items.map((item) => (
                    <NavRow key={item.label} item={item} on={item.label === active} />
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main panel */}
      <div
        className={cn(
          "ml-[5px] flex min-w-0 flex-1 flex-col overflow-hidden border border-ash bg-white",
          framed ? "rounded-t-[10px] border-b-0" : "rounded-[10px]",
        )}
      >
        <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-ash px-[30px]">
          <PageTitle key={titleKey}>{title}</PageTitle>
          {headerRight}
        </div>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

/** A sidebar group heading: "Wgląd", "Biblioteka". */
export function NavHeading({ children }: { children: React.ReactNode }) {
  return <p className="flex h-[30px] items-end px-2 pb-[6px] text-[11px] leading-none text-silver">{children}</p>;
}

/** A sidebar row, lit when `on`; the badge is a count beside the label. */
export function NavRow({ item, on }: { item: NavItem; on: boolean }) {
  return (
    <li
      className={cn(
        "flex h-[26px] items-center gap-2 rounded-[7px] px-2 text-[12px] leading-none",
        on ? "bg-[#e8f1fe] text-[#1d63d8]" : "text-slate",
      )}
    >
      <item.icon className="size-[13px] shrink-0" strokeWidth={1.75} />
      <span className="truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            "ml-auto grid h-[16px] min-w-[16px] place-items-center rounded-[5px] px-1 text-[9px] font-medium tabular-nums",
            on ? "bg-[#1d63d8] text-white" : "bg-[#dbeafe] text-[#1d63d8]",
          )}
        >
          {item.badge}
        </span>
      )}
    </li>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1.5 text-[14px] font-medium leading-none text-charcoal">{children}</div>;
}

/** A page inside the main panel, positioned at the content origin. */
export function Page({ opacity, children }: { opacity: number; children: React.ReactNode }) {
  if (opacity <= 0) return null;
  return (
    <div className="absolute inset-0 px-[30px] pt-[18px]" style={{ opacity }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Controls                                                                  */
/* ------------------------------------------------------------------------ */

/** The reference's small outline control (Filter, date range, View all…). */
export function Chip({
  icon: Icon,
  children,
  caret = false,
  pressed = false,
  className,
}: {
  icon?: IconComponent;
  children?: React.ReactNode;
  caret?: boolean;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[28px] items-center gap-1.5 rounded-[7px] border border-ash px-2.5 text-[11.5px] leading-none text-charcoal",
        pressed ? "bg-paper-mist" : "bg-white",
        className,
      )}
    >
      {Icon && <Icon className="size-[12px] text-slate" strokeWidth={1.75} />}
      {children}
      {caret && (
        <svg viewBox="0 0 10 10" className="size-[9px] text-fog" aria-hidden>
          <path d="M2.5 4 5 6.5 7.5 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/** The reference's primary black button. */
export function PrimaryButton({ children, pressed = false }: { children: React.ReactNode; pressed?: boolean }) {
  return (
    <span
      className="inline-flex h-[28px] items-center gap-1.5 rounded-[7px] bg-charcoal px-3 text-[11.5px] font-medium leading-none text-white"
      style={{ transform: pressed ? "scale(0.97)" : undefined, opacity: pressed ? 0.85 : 1 }}
    >
      {children}
    </span>
  );
}

/** A status pill that cross-fades from one state to the next at `flipAt`. */
export function StatusFlip({
  frame,
  flipAt,
  from,
  to,
}: {
  frame: number;
  flipAt: number;
  from: Status;
  to: Status;
}) {
  const t = ramp(frame, flipAt, 10);
  return (
    <span className="relative inline-grid">
      <StatusPill status={from} style={{ opacity: 1 - t, gridArea: "1 / 1" }} />
      <StatusPill status={to} style={{ opacity: t, gridArea: "1 / 1", transform: `scale(${0.92 + t * 0.08})` }} />
    </span>
  );
}

export type Status = "pending" | "done" | "new";

const STATUS: Record<Status, { label: string; className: string; dot: string }> = {
  pending: { label: "Do powtórki", className: "bg-[#fff7ed] text-[#c2410c]", dot: "border-[#f97316]" },
  done: { label: "Opanowane", className: "bg-[#f0fdf4] text-[#15803d]", dot: "border-[#22c55e]" },
  new: { label: "Nowe", className: "bg-[#eff6ff] text-[#1d63d8]", dot: "border-[#3b82f6]" },
};

/** `label` swaps the wording and keeps the state's colours ("Zapisano" is a `done`). */
export function StatusPill({ status, label, style }: { status: Status; label?: string; style?: React.CSSProperties }) {
  const s = STATUS[status];
  return (
    <span
      className={cn("inline-flex h-[18px] items-center gap-1 rounded-[5px] px-1.5 text-[10px] font-medium leading-none", s.className)}
      style={style}
    >
      <span className={cn("size-[7px] rounded-full border-[1.5px]", s.dot)} />
      {label ?? s.label}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Rolling number                                                            */
/* ------------------------------------------------------------------------ */

/**
 * The reference's counter: when a figure changes, each digit that differs
 * rolls up to its new value, the columns staggered a frame apart. Characters
 * that stay the same stay put, so "$10,301" → "$10,981" moves only two digits.
 */
export function Roll({
  frame,
  at,
  from,
  to,
  className,
}: {
  frame: number;
  at: number;
  from: string;
  to: string;
  className?: string;
}) {
  const width = Math.max(from.length, to.length);
  const a = from.padStart(width, " ");
  const b = to.padStart(width, " ");
  // Every character gets the same box, rolled or not, so the digits and the
  // symbols around them share one baseline.
  const cell = { height: "1.15em", lineHeight: "1.15em" };
  return (
    <span className={cn("inline-flex align-bottom tabular-nums", className)}>
      {Array.from({ length: width }, (_, i) => {
        if (a[i] === b[i]) {
          return b[i] === " " ? null : (
            <span key={i} className="inline-block" style={cell}>
              {b[i]}
            </span>
          );
        }
        const t = ramp(frame, at + i * 2, 14);
        return (
          <span key={i} className="relative inline-block overflow-hidden" style={cell}>
            {/* Two stacked glyphs; sliding half the stack shows the new one. */}
            <span className="block" style={{ transform: `translateY(${-t * 50}%)` }}>
              <span className="block">{a[i] === " " ? " " : a[i]}</span>
              <span className="block">{b[i] === " " ? " " : b[i]}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Charts                                                                    */
/* ------------------------------------------------------------------------ */

/** Points as 0–1 values, drawn as the reference's straight-segment area chart. */
export function linePath(values: number[], w: number, h: number): string {
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (values.length - 1)) * w).toFixed(1)} ${((1 - v) * h).toFixed(1)}`)
    .join(" ");
}

export function AreaChart({
  values,
  width,
  height,
  color,
  draw,
  id,
}: {
  values: number[];
  width: number;
  height: number;
  color: string;
  /** 0 → 1: how much of the line has drawn. The fill follows it in. */
  draw: number;
  id: string;
}) {
  const line = linePath(values, width, height);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block overflow-visible">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.16" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect width={width * draw} height={height + 4} y={-2} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <path d={`${line} L${width} ${height} L0 ${height} Z`} fill={`url(#${id}-fill)`} />
        <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** A small sparkline with the reference's pink wash under it. */
export function Sparkline({ values, width, height, draw, id }: { values: number[]; width: number; height: number; draw: number; id: string }) {
  return <AreaChart values={values} width={width} height={height} color="#d946ef" draw={draw} id={id} />;
}

/* Funnel ------------------------------------------------------------------ */

/**
 * Smooth-stepped band outline, mirrored around the centre line: flat runs
 * joined by S-curves, as the reference's conversion funnel draws them.
 * `points` are [x, half-height] pairs; `grow` pads the half-height for the
 * translucent halo bands.
 */
function bandPath(points: Array<[number, number]>, centre: number, grow: number): string {
  const edge = (sign: 1 | -1, list: Array<[number, number]>) =>
    list
      .map(([x, h], i) => {
        const y = centre + sign * (h + grow);
        if (i === 0) return `${x} ${y}`;
        const [px, ph] = list[i - 1];
        const mid = (px + x) / 2;
        return `C${mid} ${centre + sign * (ph + grow)} ${mid} ${y} ${x} ${y}`;
      })
      .join(" ");
  return `M${edge(-1, points)} L${edge(1, [...points].reverse())} Z`;
}

export function Funnel({
  width,
  height,
  stages,
  reveal,
  id,
}: {
  width: number;
  height: number;
  stages: Array<{ color: string; share: string }>;
  /** 0 → 1: how far across the funnel has drawn. */
  reveal: number;
  id: string;
}) {
  const col = width / stages.length;
  const c = height / 2;
  const h0 = height * 0.36;
  const h1 = height * 0.2;
  const h2 = height * 0.035;
  const points: Array<[number, number]> = [
    [0, h0],
    [col * 0.25, h0],
    [col * 0.75, h1],
    [col * 1.25, h1],
    [col * 1.75, h2],
    [width, h2],
  ];
  return (
    <svg width={width} height={height} className="block">
      <defs>
        <clipPath id={`${id}-reveal`}>
          <rect width={width * reveal} height={height} />
        </clipPath>
        {stages.map((_, i) => (
          <clipPath key={i} id={`${id}-col${i}`}>
            <rect x={col * i} width={col} height={height} />
          </clipPath>
        ))}
      </defs>
      <g clipPath={`url(#${id}-reveal)`}>
        {stages.map((stage, i) => (
          <g key={i} clipPath={`url(#${id}-col${i})`}>
            <path d={bandPath(points, c, 14)} fill={stage.color} opacity="0.12" />
            <path d={bandPath(points, c, 7)} fill={stage.color} opacity="0.28" />
            <path d={bandPath(points, c, 0)} fill={stage.color} />
          </g>
        ))}
      </g>
      {stages.map((stage, i) => {
        const x = col * i + col / 2;
        const t = Math.max(0, Math.min(1, (reveal * width - x + 20) / 40));
        return (
          <g key={i} opacity={t}>
            <rect x={x - 22} y={c - 10} width="44" height="20" rx="10" fill="#fff" />
            <text x={x} y={c + 4} fontSize="11" fontWeight="500" textAnchor="middle" fill="#171717">
              {stage.share}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Cursor                                                                    */
/* ------------------------------------------------------------------------ */

export type CursorKey = { at: number; x: number; y: number; click?: boolean };

/** Tip at (3, 3); wing, notch and heel in the reference's proportions. */
const POINTER = "M3.4 3.3 15.8 7.6 10.9 9.5 8 15.6Z";

/**
 * The reference's pointer: a black arrowhead with rounded corners and a white
 * keyline, floating on a soft shadow. It glides
 * between targets and dips on each click. Keyframes are absolute composition
 * coordinates; before the first and after the last it fades away.
 */
export function Cursor({ keys }: { keys: CursorKey[] }) {
  const frame = useFrame();
  if (keys.length === 0) return null;
  const first = keys[0];
  const last = keys[keys.length - 1];
  const opacity =
    interpolate(frame, [first.at - 8, first.at], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [last.at + 10, last.at + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (opacity <= 0) return null;

  let x = first.x;
  let y = first.y;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame >= a.at) {
      // Travel takes the gap up to the next key, capped so long holds rest.
      const travel = Math.min(b.at - a.at, 30);
      const start = b.at - travel;
      const t = interpolate(frame, [start, b.at], [0, 1], { easing: GLIDE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
    }
  }
  const press = keys.reduce((acc, k) => {
    if (!k.click) return acc;
    const d = frame - k.at;
    // A soft press: down over four frames, back up over six.
    if (d < 0 || d >= 10) return acc;
    const depth = d < 4 ? d / 4 : 1 - (d - 4) / 6;
    return Math.min(acc, 1 - depth * 0.14);
  }, 1);

  return (
    <svg
      viewBox="0 0 20 20"
      width="25"
      height="25"
      className="pointer-events-none absolute left-0 top-0 z-50"
      style={{
        transform: `translate(${x - 3.75}px, ${y - 3.75}px) scale(${press})`,
        transformOrigin: "3.75px 3.75px",
        opacity,
        // The reference's lift: a wide, soft shadow well below the pointer,
        // so it reads as hovering over the page rather than printed on it.
        filter: "drop-shadow(0 4px 7px rgba(0,0,0,0.2)) drop-shadow(0 1px 1.5px rgba(0,0,0,0.1))",
      }}
    >
      {/* The reference's pointer, measured off dub.co: an arrowhead with every
          corner rounded — tip, wing, heel and the soft notch between them.
          The white keyline is the same outline drawn wider underneath. */}
      <path d={POINTER} fill="none" stroke="#fff" strokeWidth="4.2" strokeLinejoin="round" />
      <path d={POINTER} fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

/** Whether the cursor is resting on a target, for hover tints. */
export function hovering(frame: number, from: number, to: number): number {
  return interpolate(frame, [from, from + 4, to, to + 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}
