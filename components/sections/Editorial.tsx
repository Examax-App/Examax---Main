"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  BadgePercent,
  BookOpen,
  CalendarCheck,
  ChartNoAxesColumn,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  CircleHelp,
  Clock,
  Ellipsis,
  Gauge,
  ListChecks,
  Map,
  Milestone,
  PencilLine,
  RefreshCcw,
  Route,
  ScanFace,
  Signpost,
  Sigma,
  Sparkles,
  Table2,
  Tag,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Avatar } from "@/components/ui/Avatar";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import zuzannaPhoto from "@/public/mockups/learner.jpg";
import kacperPhoto from "@/public/mockups/learner-kacper.jpg";
import szymonPhoto from "@/public/mockups/learner-szymon.jpg";
import majaPhoto from "@/public/mockups/learner-maja.jpg";

type Product = "roadmap" | "practice" | "progress";

const PRODUCTS: Product[] = ["roadmap", "practice", "progress"];

/**
 * The three inline product chips. `glow` is the light the chip throws on the
 * copy around it — one step deeper than the chip's own tint, as on the
 * reference — and `tilt` is the way it tips when it becomes active.
 */
const CHIPS: Record<
  Product,
  { href: string; label: string; icon: IconComponent; accent: Accent; glow: string; tilt: string }
> = {
  roadmap: {
    href: "/#roadmap",
    label: "Roadmapa nauki",
    icon: Route,
    accent: "blue",
    glow: "text-[#3b82f6]",
    tilt: "group-data-[active=true]:rotate-10",
  },
  practice: {
    href: "/#practice",
    label: "Inteligentny trening",
    icon: PencilLine,
    accent: "green",
    glow: "text-[#4ade80]",
    tilt: "group-data-[active=true]:-rotate-10",
  },
  // Tangerine with the navbar's progress badge, so the feature wears the same
  // mark in both places. Its glow is the reference's own orange-500.
  progress: {
    href: "/#progress",
    label: "Śledzenie postępów",
    icon: BadgePercent,
    accent: "tangerine",
    glow: "text-[#f97316]",
    tilt: "group-data-[active=true]:rotate-10",
  },
};

/** Legend colours shared by the cards' three metrics, as on the reference. */
const METRIC = { first: "#3b82f6", second: "#a855f7", third: "#14b8a6" };

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/* ------------------------------------------------------------------------ */
/* Inline chip                                                               */
/* ------------------------------------------------------------------------ */

function ProductChip({
  product,
  active,
  onActivate,
  onRelease,
}: {
  product: Product;
  active: boolean;
  onActivate: (product: Product) => void;
  onRelease: (product: Product) => void;
}) {
  const chip = CHIPS[product];
  return (
    <a
      href={chip.href}
      aria-label={chip.label}
      data-active={active}
      className="focus-ring group relative inline-block rounded-[7px]"
      onPointerEnter={() => onActivate(product)}
      onPointerLeave={() => onRelease(product)}
      onFocus={() => onActivate(product)}
      onBlur={() => onRelease(product)}
    >
      {/* Coloured light, screened onto the copy so only the dark glyphs
          around the chip pick up its hue */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 block h-24 w-56 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side_ellipse,currentColor,black)] opacity-0 mix-blend-screen saturate-[1.25] transition-opacity duration-500 group-data-[active=true]:opacity-100 motion-reduce:transition-none",
          chip.glow,
        )}
      />
      <AccentTile
        icon={chip.icon}
        accent={chip.accent}
        size="lg"
        className={cn(
          "mx-0.5 -translate-y-0.5 transition-[translate,rotate,filter] duration-300 group-data-[active=true]:-translate-y-1.5 group-data-[active=true]:drop-shadow-md motion-reduce:transition-none",
          chip.tilt,
        )}
      />
    </a>
  );
}

/* ------------------------------------------------------------------------ */
/* Gutter furniture                                                          */
/* ------------------------------------------------------------------------ */

function IconTile({ icon: Icon, className }: { icon: IconComponent; className: string }) {
  return (
    <span
      className={cn(
        "absolute flex size-12 items-center justify-center rounded-cards border border-ash bg-white text-steel",
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}

/** Left gutter, the text column's footprint, right gutter. */
function Gutters({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex">
      <div className="relative h-full grow">{left}</div>
      <div className="w-full max-w-[530px] shrink-0" />
      <div className="relative h-full grow">{right}</div>
    </div>
  );
}

/* Roadmap scene ----------------------------------------------------------- */

function TopicCard({
  topic,
  tasks,
  correct,
  time,
  className,
}: {
  topic: string;
  tasks: string;
  correct: string;
  time: string;
  className: string;
}) {
  const stats = [
    { icon: ListChecks, color: METRIC.first, value: tasks },
    { icon: CircleCheck, color: METRIC.second, value: correct },
    { icon: Clock, color: METRIC.third, value: time },
  ];
  return (
    <div className={cn("absolute w-64", className)}>
      <div className="flex items-center justify-between gap-4 rounded-buttons border border-ash bg-white p-3 text-[10px]">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex-none rounded-full border border-ash bg-linear-to-t from-paper-mist p-1 text-graphite">
            <Sigma className="size-3" />
          </span>
          <span className="truncate font-medium text-charcoal">{topic}</span>
        </div>
        <span className="flex items-center gap-2 rounded-inputs border border-ash bg-white p-1 text-[8px]">
          {stats.map(({ icon: Icon, color, value }) => (
            <span key={color} className="flex items-center gap-0.5">
              <Icon className="size-2.5" style={{ color }} />
              <span className="font-medium leading-none text-steel">{value}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function MiniField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 font-medium">
        {label}
        <CircleHelp className="size-4 text-silver" />
      </p>
      {children}
    </div>
  );
}

const MINI_INPUT = "flex h-10 items-center rounded-buttons border border-smoke px-3";

/**
 * A step builder drawn at full size and scaled into a 260×240 thumbnail —
 * the reference drops a screenshot of its link builder here.
 *
 * It appears under the green practice chip, so its accents are green; the
 * black and neutral chrome is untouched.
 */
function StepBuilderMini({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "absolute h-[240px] w-[260px] overflow-hidden rounded-buttons border border-ash bg-white",
        className,
      )}
    >
      <div className="flex h-[704px] w-[763px] origin-top-left scale-[0.3408] flex-col text-[15px] text-charcoal">
        <div className="flex items-center justify-between px-[22px] py-[18px]">
          <div className="flex items-center gap-2 font-medium">
            <span className="grid size-6 place-items-center rounded-inputs bg-soft-mint text-vivid-green">
              <Route className="size-4" />
            </span>
            Roadmapa
            <ChevronsUpDown className="size-4 text-silver" />
            <ChevronRight className="mx-2 size-4 text-steel" />
            <Sigma className="size-4" />
            Nowy krok
          </div>
          <div className="flex items-center gap-5 text-fog">
            <span className="flex items-center gap-1.5">
              Szkice <ChevronDown className="size-4" />
            </span>
            <X className="size-5" />
          </div>
        </div>

        <div className="flex flex-1 gap-6 px-[22px]">
          <div className="flex-1 space-y-5 pt-2">
            <MiniField label="Temat">
              <div className={MINI_INPUT}>Funkcja liniowa — wykres i własności</div>
            </MiniField>
            <MiniField label="Dział">
              <div className="flex h-10 overflow-hidden rounded-buttons border border-smoke">
                <span className="flex items-center border-r border-smoke bg-canvas-muted px-3">
                  Matematyka
                </span>
                <span className="flex items-center px-3">Funkcje</span>
              </div>
            </MiniField>
            <MiniField label="Tagi">
              <div className={cn(MINI_INPUT, "gap-2 text-silver")}>
                <Tag className="size-4" /> Wybierz tagi
              </div>
            </MiniField>
            <MiniField label="Notatka (opcjonalnie)">
              <div className={cn(MINI_INPUT, "h-20 items-start pt-2.5 text-silver")}>
                Dodaj notatkę
              </div>
            </MiniField>
            <div className="flex items-center justify-between pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                Przypomnienie <CircleHelp className="size-4 text-silver" />
              </span>
              <span className="flex h-5 w-8 items-center justify-end rounded-full bg-vivid-green p-0.5">
                <span className="size-4 rounded-full bg-white" />
              </span>
            </div>
          </div>

          <div className="flex w-[305px] flex-col rounded-cards bg-canvas-muted p-4">
            <p className="font-medium">Postęp tematu</p>
            <div className="mt-3 flex h-[98px] items-center justify-center gap-3 rounded-buttons border border-ash bg-white">
              {["bg-vivid-green", "bg-vivid-green", "bg-[#4ade80]", "bg-ash", "bg-ash"].map(
                (fill, index) => (
                  <span key={index} className="flex items-center gap-3">
                    {index > 0 && <span className="h-0.5 w-5 rounded-full bg-ash" />}
                    <span className={cn("size-5 rounded-full", fill)} />
                  </span>
                ),
              )}
            </div>
            <div className="mt-6 flex items-center justify-between font-medium">
              Podgląd kroku
              <span className="flex h-5 w-8 items-center rounded-full bg-smoke p-0.5">
                <span className="size-4 rounded-full bg-white" />
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[BookOpen, PencilLine, RefreshCcw, Sparkles].map((Icon, index) => (
                <span
                  key={index}
                  className={cn(
                    "grid h-9 place-items-center rounded-buttons border border-ash",
                    index === 0 ? "bg-white shadow-subtle" : "bg-white/60",
                  )}
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
            <div className="mt-2 grid h-[140px] place-items-center rounded-buttons bg-soft-mint text-vivid-green">
              <Route className="size-12" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-[13px] font-medium leading-snug">
              Funkcja liniowa: od wykresu do zadań maturalnych
            </p>
            <p className="mt-1 text-[13px] leading-snug text-fog">
              Lekcja, quiz i powtórka — około 45 minut.
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2 border-t border-ash px-[18px] py-4 font-medium">
          {[
            { icon: BookOpen, label: "Lekcja" },
            { icon: PencilLine, label: "Quiz" },
            { icon: RefreshCcw, label: "Powtórka" },
            { icon: CalendarCheck, label: "Termin" },
            { icon: Sparkles, label: "Korepetytor AI" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex h-10 items-center gap-2 rounded-buttons border border-smoke px-3.5"
            >
              <Icon className="size-4" /> {label}
            </span>
          ))}
          <span className="grid h-10 w-10 place-items-center rounded-buttons border border-smoke">
            <Ellipsis className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* Practice scene ---------------------------------------------------------- */

function StudentCard() {
  return (
    <div className="w-48 rounded-buttons border border-ash bg-white">
      <p className="p-3 text-xs font-medium text-charcoal">Marzec 2027</p>
      <div className="flex flex-col gap-2 border-t border-ash p-3">
        {[
          { color: METRIC.first, label: "Zadania", value: "3 214" },
          { color: METRIC.second, label: "Poprawne", value: "2 705" },
          { color: METRIC.third, label: "Opanowane", value: "38 tematów" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-[2px] border border-black/20 bg-current opacity-70"
                style={{ color: row.color }}
              />
              <span className="text-xs font-medium leading-none text-fog">{row.label}</span>
            </div>
            <span className="text-xs leading-none text-charcoal">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-ash px-3 py-2.5">
        <div className="flex justify-between gap-2">
          <Avatar name="Ala Wiśniewska" size="xl" />
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-slate">
              <Sigma className="size-3" />
              Matematyka
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-slate">
              <MaturaIcon className="h-2.5 w-3" />
              Matura
            </span>
          </div>
        </div>
        <p className="mt-4 text-[13px] font-medium text-charcoal">Ala Wiśniewska</p>
        <p className="mt-px text-xs text-fog">ala@examax.app</p>
      </div>
      <div className="flex flex-col gap-2.5 border-t border-ash px-3 pb-2.5 pt-3">
        {[
          { label: "Arkusz próbny", value: "82%" },
          { label: "Gotowość", value: "76%" },
          { label: "Seria nauki", value: "34 dni" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 text-xs leading-none">
            <span className="truncate font-medium text-silver">{row.label}</span>
            <span className="text-steel">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Smooth-stepped band outline: flat runs joined by S-curves, mirrored around
 * the centre line. `points` are [x, half-height] pairs; `grow` pads the
 * half-height for the halo rings.
 */
function bandPath(points: Array<[number, number]>, centre: number, grow: number) {
  const edge = (sign: 1 | -1, list: Array<[number, number]>) =>
    list
      .map(([x, h], index) => {
        const y = centre + sign * (h + grow);
        if (index === 0) return `${x} ${y}`;
        const [px] = list[index - 1];
        const mid = (px + x) / 2;
        const py = centre + sign * (list[index - 1][1] + grow);
        return `C${mid} ${py} ${mid} ${y} ${x} ${y}`;
      })
      .join(" ");
  const reversed = [...points].reverse();
  return `M${edge(-1, points)} L${edge(1, reversed)} Z`;
}

const FUNNEL_POINTS: Array<[number, number]> = [
  [0, 147],
  [100, 147],
  [210, 79],
  [360, 79],
  [500, 11],
  [740, 11],
  [790, 2],
  [848, 2],
];

const FUNNEL_STAGES = [
  { label: "Tematy", value: "124", share: "100%", color: "#155dfc", legend: "#51a2ff", ink: "#1c398e" },
  { label: "Przerobione", value: "45", share: "36%", color: "#9810fa", legend: "#c27aff", ink: "#59168b" },
  { label: "Opanowane", value: "12", share: "9,7%", color: "#00d5be", legend: "#46ecd5", ink: "#0b4f4a" },
];

/**
 * Conversion-style funnel, drawn in the reference thumbnail's own 848×647
 * coordinates and scaled down whole, so the tiny type stays proportional.
 */
function FunnelCard({ className }: { className?: string }) {
  const id = useId();
  const columns = [0, 282, 565, 848];
  const centre = 379;
  return (
    <svg
      viewBox="0 0 848 647"
      width={230}
      height={175}
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <defs>
        <clipPath id={`${id}-card`}>
          <rect width="848" height="647" rx="20" />
        </clipPath>
        {FUNNEL_STAGES.map((_, index) => (
          <clipPath key={index} id={`${id}-col${index}`}>
            <rect x={columns[index]} width={columns[index + 1] - columns[index]} height="647" />
          </clipPath>
        ))}
      </defs>

      <g clipPath={`url(#${id}-card)`}>
        <rect width="848" height="647" fill="#ffffff" />
        {/* Selected stage */}
        <rect x="565" y="108" width="283" height="539" fill="#f4fbfe" />
        <line x1="0" x2="848" y1="108" y2="108" stroke="#ebebeb" vectorEffect="non-scaling-stroke" />
        <line x1="565" x2="848" y1="107" y2="107" stroke="#171717" strokeWidth="2.5" />
        {[282, 565].map((x) => (
          <line key={x} x1={x} x2={x} y1="0" y2="647" stroke="#ebebeb" vectorEffect="non-scaling-stroke" />
        ))}

        {FUNNEL_STAGES.map((stage, index) => (
          <g key={stage.label} clipPath={`url(#${id}-col${index})`}>
            <path d={bandPath(FUNNEL_POINTS, centre, 25)} fill={stage.color} opacity="0.1" />
            <path d={bandPath(FUNNEL_POINTS, centre, 12)} fill={stage.color} opacity="0.3" />
            <path d={bandPath(FUNNEL_POINTS, centre, 0)} fill={stage.color} />
          </g>
        ))}

        {FUNNEL_STAGES.map((stage, index) => {
          const x = columns[index] + 34;
          const pill = [140, 423, 705][index];
          return (
            <g key={stage.label}>
              <rect x={x} y="29" width="10" height="10" rx="2.5" fill={stage.legend} />
              <text x={x + 19} y="39" fontSize="15" fill="#525252">
                {stage.label}
              </text>
              <text x={x} y="82" fontSize="32" fontWeight="600" fill="#171717">
                {stage.value}
              </text>
              <rect x={pill - 39} y={centre - 15} width="78" height="30" rx="15" fill="#ffffff" />
              <text x={pill} y={centre + 6} fontSize="16" fontWeight="500" textAnchor="middle" fill={stage.ink}>
                {stage.share}
              </text>
            </g>
          );
        })}

        {/* Stage chevrons on the dividers */}
        {[282, 565].map((x) => (
          <g key={x}>
            <circle cx={x} cy="56" r="13" fill="#ffffff" stroke="#e5e5e5" vectorEffect="non-scaling-stroke" />
            <path d={`M${x - 2} 51l5 5-5 5`} fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* Unit and chart-type toggles */}
        <rect x="768" y="18" width="62" height="32" rx="7" fill="#f5f5f5" />
        <rect x="801" y="21" width="26" height="26" rx="6" fill="#ffffff" stroke="#e5e5e5" vectorEffect="non-scaling-stroke" />
        <text x="784" y="39" fontSize="11" textAnchor="middle" fill="#525252">123</text>
        <text x="814" y="39" fontSize="12" textAnchor="middle" fill="#171717">%</text>
        <rect x="775" y="128" width="62" height="32" rx="7" fill="#f0f0f0" />
        <rect x="807" y="131" width="27" height="26" rx="6" fill="#ffffff" stroke="#e5e5e5" vectorEffect="non-scaling-stroke" />
        <path d="M785 137v12h13M788 146l3-4 3 2 3-5" fill="none" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M815 138v12l12-6z" fill="none" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <rect x="0.5" y="0.5" width="847" height="646" rx="20" fill="none" stroke="#e5e5e5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* Progress scene ---------------------------------------------------------- */

function LearnerCard({
  name,
  exam,
  mastery,
  streak,
  photo,
  className,
}: {
  name: string;
  exam: "matura" | "e8";
  mastery: string;
  streak: string;
  /** The learner's photo; without one the well shows their initials. */
  photo?: StaticImageData;
  className: string;
}) {
  const ExamMark = exam === "matura" ? MaturaIcon : E8Icon;
  return (
    <div
      className={cn(
        "absolute flex h-[72px] w-[210px] select-none items-center overflow-hidden rounded-buttons border border-ash bg-white p-1.5",
        className,
      )}
    >
      <div className="relative aspect-square h-full overflow-hidden rounded-inputs">
        {photo ? (
          <Image src={photo} alt="" fill sizes="64px" className="object-cover object-[center_30%]" />
        ) : (
          <Avatar name={name} size="fill" square />
        )}
      </div>
      <div className="flex flex-col gap-2 px-3">
        <div className="flex items-center gap-1">
          <ExamMark className="h-2 w-2.5" />
          <span className="whitespace-nowrap text-[11px] font-medium leading-none text-graphite">
            {name}
          </span>
        </div>
        <div className="flex divide-x divide-ash">
          <div className="flex flex-col gap-1 pr-3">
            <span className="text-[10px] font-medium leading-none text-silver">Opanowanie</span>
            <span className="whitespace-nowrap text-xs font-medium leading-none text-steel">{mastery}</span>
          </div>
          <div className="flex flex-col gap-1 pl-3">
            <span className="text-[10px] font-medium leading-none text-silver">Seria</span>
            <span className="whitespace-nowrap text-xs font-medium leading-none text-steel">{streak}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Scenes ------------------------------------------------------------------ */

/**
 * Which scene each chip reveals. The roadmap chip shows the learner and the
 * mastery funnel, and the green practice chip shows the topic cards and the
 * step builder — assigned this way round at the user's request.
 */
const SCENES: Record<Product, () => React.ReactNode> = {
  roadmap: () => (
    <Gutters
      left={
        <>
          <IconTile icon={ScanFace} className="right-40 top-1/4 rotate-15" />
          <IconTile icon={ChartNoAxesColumn} className="right-20 top-[28%] -rotate-10" />
          <div className="absolute right-10 top-[38%] -rotate-7">
            <StudentCard />
          </div>
        </>
      }
      right={
        <>
          <IconTile icon={Target} className="left-20 top-1/4 rotate-10" />
          <IconTile icon={Table2} className="left-40 top-[23%] -rotate-15" />
          <FunnelCard className="absolute left-6 top-[37%] rotate-7" />
        </>
      }
    />
  ),
  practice: () => (
    <Gutters
      left={
        <>
          <IconTile icon={Map} className="right-40 top-[30%] -rotate-15" />
          <IconTile icon={Milestone} className="right-20 top-1/4 rotate-10" />
          <TopicCard topic="Ciągi arytmetyczne" tasks="36" correct="29" time="1,5h" className="right-12 top-[51%] -rotate-3" />
          <TopicCard topic="Równania kwadratowe" tasks="52" correct="44" time="3h" className="right-8 top-[45%] -rotate-10" />
          <TopicCard topic="Funkcja liniowa" tasks="48" correct="41" time="2h" className="right-16 top-[40%] -rotate-5" />
        </>
      }
      right={
        <>
          <IconTile icon={Signpost} className="left-20 top-[20%] -rotate-10" />
          <IconTile icon={CalendarCheck} className="left-40 top-1/4 rotate-15" />
          <StepBuilderMini className="left-8 top-[35%] rotate-7" />
        </>
      }
    />
  ),
  progress: () => (
    <Gutters
      left={
        <>
          <IconTile icon={TrendingUp} className="right-40 top-[32%] rotate-15" />
          <IconTile icon={Gauge} className="right-20 top-[27%] -rotate-10" />
          <LearnerCard name="Zuzanna Nowak" exam="matura" mastery="78%" streak="34 dni" photo={zuzannaPhoto} className="right-20 top-[49%] -rotate-3" />
          <LearnerCard name="Kacper Lewandowski" exam="e8" mastery="64%" streak="12 dni" photo={kacperPhoto} className="right-10 top-[42%] rotate-8" />
        </>
      }
      right={
        <>
          <IconTile icon={Target} className="left-20 top-[28%] rotate-10" />
          <IconTile icon={ChartNoAxesColumn} className="left-40 top-1/4 -rotate-15" />
          <LearnerCard name="Maja Zielińska" exam="matura" mastery="86%" streak="51 dni" photo={majaPhoto} className="left-4 top-[45%] rotate-6" />
          <LearnerCard name="Szymon Wójcik" exam="e8" mastery="71%" streak="19 dni" photo={szymonPhoto} className="left-8 top-[38%] -rotate-4" />
        </>
      }
    />
  ),
};

/* ------------------------------------------------------------------------ */
/* Section                                                                   */
/* ------------------------------------------------------------------------ */

/**
 * Centered editorial statement over the dotted texture, flanked by floating
 * UI in the side gutters — the reference's "philosophy" section, rebuilt from
 * dub.co's own markup.
 *
 * Two scroll readings drive it, both taken from the reference:
 *  - `--progress` reveals the copy top-down through a mask (unread lines sit
 *    at 20% ink) while lifting the column up to 75px;
 *  - a second, later window steps through the three products. The active
 *    product's inline chip lifts and tilts and throws its light on the copy,
 *    and its scene cross-fades into the gutters. Hovering or focusing a chip
 *    takes over from the scroll.
 */
export function Editorial() {
  const textRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState<Product>("roadmap");
  const [hovered, setHovered] = useState<Product | null>(null);
  const active = hovered ?? scrolled;
  const dotsId = useId();

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 639px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const { top, height } = node.getBoundingClientRect();
      const vh = window.innerHeight;

      // From the column's top at 75% of the viewport to its bottom at 50%.
      if (!reduceMotion) {
        const reveal = clamp((0.75 * vh - top) / (0.25 * vh + height));
        node.style.setProperty("--progress", reveal.toFixed(4));
      }

      // Desktop: 75% of the column past the fold → its bottom at 60%.
      // Mobile: halfway past the fold → its bottom at 80%.
      const cycle = mobile.matches
        ? clamp((vh - 0.5 * height - top) / (0.2 * vh + 0.5 * height))
        : clamp((vh - 0.75 * height - top) / (0.4 * vh + 0.25 * height));
      setScrolled(PRODUCTS[Math.min(Math.floor(cycle * 3), 2)]);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const activate = (product: Product) => setHovered(product);
  const release = (product: Product) =>
    setHovered((current) => (current === product ? null : current));
  const chip = (product: Product) => (
    <ProductChip
      product={product}
      active={active === product}
      onActivate={activate}
      onRelease={release}
    />
  );

  return (
    <section
      id="method"
      aria-label="Dlaczego Examax"
      className="col-rules relative overflow-hidden border-t border-ash bg-white"
    >
      <Container className="relative pb-16 pt-32 sm:pb-32 sm:pt-40">
        {/* Dotted texture — 2px squares on a 12px grid. It sits under the
            text column, so it only shows through where the mask thins it.

            The field runs to the section's edges and feathers in from all
            four sides, so the white gives way to the dots gradually instead
            of the grid switching on at a hard line. Full density starts
            128px down — past where the old hard edge sat, and still above
            the copy. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 inset-y-0 mix-blend-darken"
          style={{
            maskImage:
              "linear-gradient(transparent, black 128px, black calc(100% - 128px), transparent), linear-gradient(to right, transparent, black 64px, black calc(100% - 64px), transparent)",
            maskComposite: "intersect",
          }}
        >
          <svg className="absolute inset-0 text-ash/80" width="100%" height="100%">
            <defs>
              <pattern id={dotsId} x="-1" y="-1" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect x="1" y="1" width="2" height="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect fill={`url(#${dotsId})`} width="100%" height="100%" />
          </svg>
        </div>

        {/* Server-rendered fully revealed; the layout effect rewinds it
            before first paint, so without script the copy is never hidden. */}
        <div ref={textRef} style={{ "--progress": 1 } as React.CSSProperties}>
          <div
            className="relative isolate mx-auto max-w-[530px] bg-white"
            style={{
              maskImage:
                "linear-gradient(black calc(var(--progress) * 100%), #0003 calc(var(--progress) * 100% + 75%))",
              translate: "0 calc(var(--progress) * -75px)",
            }}
          >
            <div className="space-y-8 font-inter text-heading leading-snug text-graphite">
              <p>
                Sam wynik nie wystarczy. Examax pokazuje, co zrobić dalej.
              </p>
              <p>
                Examax łączy plan nauki {chip("roadmap")}, zadania egzaminacyjne{" "}
                {chip("practice")} i historię Twoich wyników {chip("progress")} w jedno
                miejsce przygotowań.
              </p>
              <p>
                Od pierwszego zadania do egzaminu widzisz, czego się uczyć, co już
                umiesz i nad czym pracować dalej.
              </p>
              <p>
                Lepszy wynik zaczyna się od regularnej pracy i jasnego planu.
              </p>
            </div>
          </div>
        </div>

        {/* One scene per product, cross-fading with the active chip */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
        >
          {PRODUCTS.map((product) => (
            <div
              key={product}
              className={cn(
                "absolute inset-0 transition-[translate,opacity] duration-500 motion-reduce:transition-none",
                active === product ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {SCENES[product]()}
            </div>
          ))}
        </div>

        {/* The practice scene's two cards stack under the text on smaller screens */}
        <div className="relative mt-14 flex flex-wrap items-center justify-center gap-8 md:hidden">
          <Reveal className="-rotate-7">
            <StudentCard />
          </Reveal>
          <Reveal delay={100} className="rotate-7">
            <FunnelCard />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
