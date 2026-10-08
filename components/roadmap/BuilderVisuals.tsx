"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import {
  BookMarked,
  BookOpen,
  CalendarDays,
  CircleCheck,
  CircleDashed,
  Flag,
  Gauge,
  Gift,
  GraduationCap,
  Languages,
  ListChecks,
  Pencil,
  Search,
  Shapes,
  Sigma,
  Target,
  Bell,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The four pictures under the builder — dub.co/links' "Branded short links"
 * grid, each kept to its reference's build and motion:
 *
 *   Link preview card      → TopicPreview  (a topic's lesson card)
 *   Custom domains rows    → SubjectRows   (one roadmap per subject)
 *   UTM builder            → PlanWizard    (the plan's settings)
 *   Deep-link flow (SMIL)  → DiagnosticFlow (the diagnostic quiz feeding the plan)
 */

/* ── Topic preview ───────────────────────────────────────────────────────── */

/** dub's "Link Preview" panel, 90% (75% from lg), fading out below 70%. */
export function TopicPreview() {
  return (
    <div className="pointer-events-none size-full [mask-image:linear-gradient(black_70%,transparent)]" aria-hidden inert>
      <div className="flex origin-top scale-90 cursor-default flex-col gap-6 rounded-xl border border-ash bg-white p-4 shadow-[0_20px_20px_0_#00000017] lg:scale-75">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium text-charcoal">Podgląd tematu</h4>
          <kbd className="flex size-6 items-center justify-center rounded-md border border-ash font-sans text-xs text-midnight-ink max-md:hidden">P</kbd>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-graphite">Schemat</span>
            <div className="flex h-6 items-center gap-3 px-1 text-fog">
              <Shapes className="size-4" strokeWidth={1.75} />
              <Pencil className="size-3" strokeWidth={2} />
            </div>
          </div>
          <div className="relative mt-2 flex aspect-[1200/630] w-full items-center justify-center overflow-hidden rounded-md border border-smoke bg-canvas-muted">
            {/* Graph paper, the spectrum glow behind it, and the function */}
            <div className="absolute inset-0 bg-[linear-gradient(var(--color-ash)_1px,transparent_1px),linear-gradient(90deg,var(--color-ash)_1px,transparent_1px)] bg-[size:24px_24px] opacity-70" />
            <div className="absolute inset-[15%] rounded-full opacity-25 blur-2xl [background:var(--gradient-conic-spectrum)]" />
            <svg viewBox="0 0 240 126" className="relative h-[78%] w-auto text-charcoal" fill="none">
              <path d="M12 104H228M120 8V118" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
              <path d="M44 118L200 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="120" cy="67.3" r="5" fill="white" stroke="currentColor" strokeWidth="3" />
              <circle cx="164" cy="38" r="5" fill="white" stroke="currentColor" strokeWidth="3" />
            </svg>
            <span className="absolute left-3 top-3 rounded-md border border-ash bg-white px-2 py-0.5 text-xs font-medium text-charcoal shadow-subtle">
              y = ax + b
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-graphite">Tytuł</span>
          <div className="mt-1 rounded-lg border border-smoke bg-white px-2 py-1 text-xs text-graphite">Funkcja liniowa — wykres i własności</div>
        </div>
      </div>
    </div>
  );
}

/* ── Subject rows ────────────────────────────────────────────────────────── */

const SUBJECT_ROWS: Array<{ name: string; icon: IconComponent; accent: Accent; done: string; priority?: boolean }> = [
  { name: "Matematyka", icon: Sigma, accent: "blue", done: "64%", priority: true },
  { name: "Język polski", icon: BookMarked, accent: "green", done: "41%" },
  { name: "Język angielski", icon: Languages, accent: "lavender", done: "78%" },
];

/** dub's custom-domain stack: rows stepping in by 5%, each easing left under the pointer. */
export function SubjectRows() {
  return (
    <div className="relative flex size-full flex-col justify-center">
      <div className="relative">
        <div aria-hidden className="flex flex-col gap-2.5 [mask-image:linear-gradient(90deg,black_70%,transparent)]">
          {SUBJECT_ROWS.map((row, index) => (
            <div key={row.name} className="transition-transform duration-300 hover:translate-x-[-2%]">
              <div
                className="ml-[calc((var(--idx)+1)*5%)] flex cursor-default items-center gap-3 rounded-xl border border-ash bg-white p-4 shadow-subtle"
                style={{ "--idx": index } as React.CSSProperties}
              >
                <div className="flex-none rounded-full border border-ash bg-gradient-to-t from-paper-mist p-2">
                  <span className={cn("grid size-6 place-items-center rounded-full border border-black/5", accentStyles[row.accent].chip)}>
                    <row.icon className="size-3.5" strokeWidth={2.5} />
                  </span>
                </div>
                <span className="whitespace-nowrap text-base font-medium text-charcoal">{row.name}</span>
                <span className="ml-2 flex items-center gap-x-1 rounded-md border border-ash bg-canvas-muted px-2 py-[0.2rem]">
                  <CircleDashed className="size-4 text-slate" strokeWidth={1.75} />
                  <span className="whitespace-nowrap text-sm text-fog">
                    {row.done}
                    <span className="ml-1 hidden sm:inline-block">ukończone</span>
                  </span>
                </span>
                {row.priority ? (
                  <span className="flex items-center gap-x-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-[0.2rem]">
                    <Flag className="size-4 text-blue-700" strokeWidth={1.75} />
                    <span className="whitespace-nowrap text-sm text-blue-600">Priorytet</span>
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/pricing"
          className="absolute right-0 top-0 flex -translate-y-1/2 items-center gap-2 rounded-lg border border-green-600/15 bg-gradient-to-r from-lime-100 to-emerald-100 px-3 py-1.5 transition-shadow hover:shadow-subtle"
        >
          <Gift className="size-4 text-green-800" strokeWidth={1.75} aria-hidden />
          <span className="whitespace-nowrap text-sm font-medium leading-none text-graphite">
            Pierwsza roadmapa <strong>za darmo</strong>
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ── Plan wizard ─────────────────────────────────────────────────────────── */

const WIZARD_ROWS: Array<{ icon: IconComponent; label: string; value?: string; placeholder: string }> = [
  { icon: GraduationCap, label: "Egzamin", value: "Matura podstawowa", placeholder: "Matura podstawowa" },
  { icon: Sigma, label: "Przedmiot", value: "Matematyka", placeholder: "Matematyka" },
  { icon: Gauge, label: "Tempo", value: "6 h tygodniowo", placeholder: "6 h tygodniowo" },
  { icon: CalendarDays, label: "Start", placeholder: "pon, 5 paź" },
  { icon: Flag, label: "Termin", placeholder: "5 maja 2027" },
  { icon: Target, label: "Poziom", placeholder: "z quizu diagnostycznego" },
];

/** The reference's beat, read off the live page: ~6s on the settings, ~4s on the result. */
const SETTINGS_MS = 6000;
const RESULT_MS = 4000;

/**
 * dub's UTM builder: a summary box over the builder card. The box shows what
 * the settings spell out, then shrinks away as the finished plan scales in
 * over it — and back, on a loop, only while the picture is on screen.
 */
export function PlanWizard() {
  const [result, setResult] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setTimeout(() => setResult((shown) => !shown), result ? RESULT_MS : SETTINGS_MS);
    return () => window.clearTimeout(timer);
  }, [inView, reduced, result]);

  return (
    <div ref={ref} aria-hidden inert className="size-full px-4 [mask-image:linear-gradient(black_70%,transparent)] md:px-8">
      <div className="relative break-all rounded-lg border border-smoke bg-canvas-muted font-geist-mono text-[0.8125rem] shadow-subtle">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-steel transition-[transform,opacity]",
            !result && "scale-125 opacity-0",
          )}
        >
          Plan gotowy · 31 tygodni
          <CircleCheck className="size-4 shrink-0 fill-green-500 text-white" strokeWidth={2.25} />
        </div>
        <div className={cn("px-2.5 py-2 text-fog transition-[transform,opacity]", result && "scale-50 opacity-0")}>
          matura/matematyka?tempo=6h&amp;start=2026-10-05&amp;termin=2027-05-05
        </div>
      </div>
      <div className="mt-3 flex cursor-default flex-col gap-6 rounded-lg border border-ash bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium text-charcoal">Kreator planu</h4>
          <kbd className="flex size-6 items-center justify-center rounded-md border border-ash font-sans text-xs text-midnight-ink max-md:hidden">K</kbd>
        </div>
        <div className="grid gap-y-3">
          {WIZARD_ROWS.map(({ icon: Icon, label, value, placeholder }) => (
            <div key={label} className="flex">
              <div className="flex items-center gap-1.5 rounded-l-md border-y border-l border-smoke bg-canvas-muted px-3 py-1.5 text-slate sm:min-w-28">
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="select-none text-sm">{label}</span>
              </div>
              <div className={cn("min-w-0 grow truncate rounded-r-md border border-smoke px-3 py-1.5 text-sm", value ? "text-charcoal" : "text-silver")}>
                {value ?? placeholder}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Diagnostic flow ─────────────────────────────────────────────────────── */

/*
 * dub's deep-link diagram, rebuilt on the same rules: hairline routes with
 * rounded corners, three glowing dots running them on a shared 4s clock
 * (offset by a third each, SMIL like the reference), and white tiles sitting
 * on top. The quiz at the top splits what it finds into gaps (left) and
 * mastered topics (right); both routes, and the straight one between them,
 * end in the student's roadmap.
 */
const ROUTE_LEFT = "M400 96V186Q400 210 376 210H174Q150 210 150 234V306Q150 330 174 330H300";
const ROUTE_RIGHT = "M400 96V186Q400 210 424 210H626Q650 210 650 234V306Q650 330 626 330H500";
const ROUTE_MIDDLE = "M400 96V280";

const DOTS: Array<{ path: string; begin: string; gradient: string }> = [
  { path: ROUTE_LEFT, begin: "0s", gradient: "blue" },
  { path: ROUTE_MIDDLE, begin: "1.33s", gradient: "dark" },
  { path: ROUTE_RIGHT, begin: "2.66s", gradient: "green" },
];

function Tile({ x, y, icon: Icon, accent, label }: { x: number; y: number; icon: LucideIcon; accent: Accent; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width="80" height="80" rx="18" fill="white" stroke="#e5e5e5" />
      <rect x={x + 22} y={y + 22} width="36" height="36" rx="10" className={accent === "blue" ? "fill-[#60a5fa]" : "fill-[#4ade80]"} />
      <Icon x={x + 30} y={y + 30} width={20} height={20} strokeWidth={2.25} className={accent === "blue" ? "text-[#1e3a8a]" : "text-[#14532d]"} />
      <text x={x + 40} y={y + 102} textAnchor="middle" fill="#525252" fontSize="13" fontWeight="500" fontFamily="var(--font-inter)">
        {label}
      </text>
    </g>
  );
}

export function DiagnosticFlow() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="relative flex size-full items-start justify-center overflow-hidden [mask-image:linear-gradient(black_75%,transparent)]">
      {/* Wider than the cell, as dub's: the side tiles are cut by its edges */}
      <svg viewBox="0 20 800 440" className="h-auto w-[135%] max-w-none shrink-0" fill="none">
        <defs>
          {(
            [
              ["blue", "#229DF3"],
              ["green", "#34A853"],
              ["dark", "#5E5E5E"],
            ] as const
          ).map(([name, color]) => (
            <radialGradient key={name} id={`flow-${name}`}>
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          ))}
          <linearGradient id="flow-screen" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#171717" />
            <stop offset="1" stopColor="#404040" />
          </linearGradient>
        </defs>

        {/* Routes */}
        {[ROUTE_LEFT, ROUTE_RIGHT, ROUTE_MIDDLE].map((d) => (
          <path key={d} d={d} stroke="#e5e5e5" strokeWidth="1.5" />
        ))}

        {/* Dots on the shared clock */}
        {!reduced
          ? DOTS.map((dot) => (
              <g key={dot.gradient}>
                <circle r="14" fill={`url(#flow-${dot.gradient})`} opacity="0.5">
                  <animateMotion path={dot.path} dur="4s" begin={dot.begin} repeatCount="indefinite" />
                </circle>
                <circle r="4" fill={dot.gradient === "blue" ? "#229DF3" : dot.gradient === "green" ? "#34A853" : "#5E5E5E"}>
                  <animateMotion path={dot.path} dur="4s" begin={dot.begin} repeatCount="indefinite" />
                </circle>
              </g>
            ))
          : null}

        {/* The quiz */}
        <rect x="290" y="40" width="220" height="56" rx="14" fill="white" stroke="#e5e5e5" />
        <rect x="306" y="54" width="28" height="28" rx="8" className="fill-[#4ade80]" />
        <ListChecks x={312} y={60} width={16} height={16} strokeWidth={2.5} className="text-[#14532d]" />
        <text x="346" y="73" fill="#171717" fontSize="15" fontWeight="600" fontFamily="var(--font-inter)">
          Quiz diagnostyczny
        </text>

        {/* What it finds */}
        <Tile x={110} y={170} icon={Target} accent="blue" label="Braki" />
        <Tile x={610} y={170} icon={CircleCheck} accent="green" label="Opanowane" />

        {/* The roadmap, on a phone */}
        <g>
          <path d="M300 460V302Q300 280 322 280H478Q500 280 500 302V460Z" fill="url(#flow-screen)" />
          <text x="318" y="314" fill="white" fontSize="15" fontWeight="700" fontFamily="var(--font-satoshi)">
            Examax
          </text>
          <Search x={424} y={302} width={14} height={14} className="text-white/70" strokeWidth={2} />
          <Bell x={446} y={302} width={14} height={14} className="text-white/70" strokeWidth={2} />
          <Menu x={468} y={302} width={14} height={14} className="text-white/70" strokeWidth={2} />
          <rect x="310" y="330" width="180" height="130" rx="10" fill="white" />
          <text x="322" y="352" fill="#525252" fontSize="12" fontWeight="600" fontFamily="var(--font-inter)">
            Twoja roadmapa
          </text>
          <rect x="322" y="364" width="72" height="30" rx="7" fill="#f5f5f5" />
          <rect x="404" y="364" width="72" height="30" rx="7" fill="#f5f5f5" />
          <BookOpen x={330} y={372} width={14} height={14} className="text-electric-blue" strokeWidth={2} />
          <ListChecks x={412} y={372} width={14} height={14} className="text-vivid-green" strokeWidth={2} />
          <rect x="348" y="376" width="38" height="6" rx="3" fill="#e5e5e5" />
          <rect x="430" y="376" width="38" height="6" rx="3" fill="#e5e5e5" />
        </g>
      </svg>
    </div>
  );
}
