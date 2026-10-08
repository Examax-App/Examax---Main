"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/Link";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  CircleCheck,
  CircleDashed,
  Clock,
  FileText,
  Flag,
  Lightbulb,
  ListChecks,
  Play,
  RefreshCcw,
  Route,
  Shapes,
  Sparkles,
  Target,
} from "lucide-react";
import { PosterScene } from "@/components/hero-film/HeroPoster";
import { HEIGHT, WIDTH } from "@/components/hero-film/timeline";
import { Sparkline } from "@/components/ui/Sparkline";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The four pictures under the plan chart — dub.co/links' analytics grid,
 * each kept to its reference's build, and each showing the plan rather than
 * a score:
 *
 *   App still + "Play demo"     → PathStill   (the dashboard's Roadmapa screen)
 *   Tilted devices/countries    → StageStack  (the year's three stages)
 *   Customer detail page        → ModulePage  (one topic, opened)
 *   Live events table           → WeekTable   (this week, day by day)
 */

/* ── Path still ──────────────────────────────────────────────────────────── */

/**
 * dub's product still: 120% of the cell wide, cut at the right and bottom,
 * with a white pill in the corner that grows under the pointer. The still is
 * the dashboard's own Roadmapa screen (the landing hero's poster scene),
 * scaled to fit with CSS.
 */
export function PathStill() {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.46);

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / WIDTH));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="size-full [mask-image:linear-gradient(90deg,black_95%,transparent)]">
      <div className="size-full [mask-image:linear-gradient(black_95%,transparent)]">
        <div className="relative h-full w-[120%]">
          <Link href="/signup" className="group relative mx-auto block w-full overflow-visible rounded-lg bg-paper-mist" style={{ aspectRatio: `${WIDTH}/${HEIGHT}` }}>
            <div ref={frame} aria-hidden inert className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg border border-ash">
              <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
                <PosterScene tab="roadmap" />
              </div>
            </div>
            <div className="absolute bottom-8 flex w-full items-center justify-between px-8">
              <div className="flex items-center gap-2 rounded-full border border-ash bg-white px-4 py-2 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95">
                <Play className="size-4 fill-charcoal text-charcoal" strokeWidth={1.5} aria-hidden />
                <span className="text-sm font-medium text-charcoal">Wypróbuj roadmapę</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Stage stack ─────────────────────────────────────────────────────────── */

type StageRow = { topic: string; done: number };
export type Stage = { title: string; icon: IconComponent; rows: StageRow[]; tx: number; opacity: number };

/** Back to front: the stage still ahead, the one behind, and the one under way. */
const STAGES: Stage[] = [
  {
    title: "Etap 3 · Powtórka",
    icon: Flag,
    tx: 0,
    opacity: 0.3,
    rows: [
      { topic: "Arkusz 2024", done: 0 },
      { topic: "Arkusz 2023", done: 0 },
      { topic: "Arkusz 2022", done: 0 },
      { topic: "Zadania otwarte", done: 0 },
      { topic: "Powtórka całości", done: 0 },
    ],
  },
  {
    title: "Etap 1 · Podstawy",
    icon: CircleCheck,
    tx: 55,
    opacity: 0.8,
    rows: [
      { topic: "Potęgi", done: 100 },
      { topic: "Procenty", done: 96 },
      { topic: "Wyrażenia", done: 92 },
      { topic: "Równania", done: 88 },
      { topic: "Nierówności", done: 84 },
    ],
  },
  {
    title: "Etap 2 · Funkcje",
    icon: Route,
    tx: 110,
    opacity: 1,
    rows: [
      { topic: "Funkcja liniowa", done: 64 },
      { topic: "Funkcja kwadratowa", done: 38 },
      { topic: "Ciągi", done: 22 },
      { topic: "Trygonometria", done: 10 },
      { topic: "Funkcja wykładnicza", done: 0 },
    ],
  },
];

/**
 * dub's tilted card stack: three panels offset by 55px, each lifting 15px
 * under the pointer. /roadmap stacks its stages; /progress passes its own
 * panels (subjects, sections, task types) back to front.
 */
export function StageStack({ stages = STAGES }: { stages?: Stage[] } = {}) {
  return (
    <div aria-hidden className="size-full cursor-default select-none [mask-image:radial-gradient(120%_100%_at_0%_0%,black_80%,transparent_100%)]">
      <div className="relative w-[70%] [transform:rotateX(-18deg)_rotateY(23deg)]">
        {stages.map((stage, index) => (
          <div
            key={stage.title}
            className={cn(
              "min-h-[500px] translate-x-[var(--tx)] translate-y-[var(--ty)] transition-transform duration-300 hover:translate-y-[calc(var(--ty)-15px)]",
              index > 0 && "absolute left-0 top-0 w-full",
            )}
            style={{ "--tx": `${stage.tx}px`, "--ty": `${stage.tx}px`, opacity: stage.opacity } as React.CSSProperties}
          >
            <div className="min-h-[1000px] rounded-2xl border border-ash bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-lg border border-ash p-1.5">
                  <stage.icon className="size-4 text-slate" strokeWidth={1.75} />
                </div>
                <span className="text-sm font-medium text-steel">{stage.title}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {stage.rows.map((row) => (
                  <div key={row.topic} className="relative flex items-center justify-between gap-2 p-1.5">
                    <div className="pointer-events-none absolute left-0 top-0 h-full rounded-md bg-black/5" style={{ width: `${Math.max(row.done, 6)}%` }} />
                    <span className="truncate text-sm text-steel">{row.topic}</span>
                    <span className="text-sm text-fog tabular-nums">{row.done}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Module page ─────────────────────────────────────────────────────────── */

const MODULE_PARTS: Array<{ part: string; icon: IconComponent; kind: string; time: string; done: boolean }> = [
  { part: "Wprowadzenie", icon: BookOpen, kind: "Lekcja", time: "5 min", done: true },
  { part: "Wyjaśnienie", icon: BookOpen, kind: "Lekcja", time: "12 min", done: true },
  { part: "Przykłady krok po kroku", icon: Lightbulb, kind: "Przykłady", time: "10 min", done: true },
  { part: "Schematy i wykresy", icon: Shapes, kind: "Schemat", time: "6 min", done: true },
  { part: "Techniki zapamiętywania", icon: Sparkles, kind: "Lekcja", time: "4 min", done: false },
  { part: "Zadania CKE", icon: FileText, kind: "Quiz", time: "20 min", done: false },
  { part: "Podsumowanie", icon: CircleCheck, kind: "Podsumowanie", time: "3 min", done: false },
];

/** dub's customer page, drawn at screenshot size: a table of the module's parts and a details column. */
export function ModulePage() {
  return (
    <div aria-hidden className="pointer-events-none size-full select-none [mask-image:linear-gradient(black_75%,transparent)]">
      <div className="size-full [mask-image:linear-gradient(90deg,black_90%,transparent)]">
        <div className="w-[125%] rounded-lg border border-ash bg-white p-4 text-[10px] leading-tight text-steel">
          <div className="flex items-center gap-1 text-[9px] text-fog">
            <ChevronLeft className="size-2.5" strokeWidth={2} />
            Roadmapa
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full border border-blue-200 bg-blue-100">
              <Route className="size-3.5 text-blue-700" strokeWidth={2} />
            </span>
            <div>
              <p className="text-[12px] font-semibold text-charcoal">Funkcja liniowa</p>
              <p className="text-[9px] text-fog">Matura podstawowa · Etap 2</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_150px] gap-6">
            <div>
              <p className="text-[11px] font-semibold text-charcoal">Moduł</p>
              <div className="mt-2 grid grid-cols-[1.6fr_1fr_0.6fr_0.5fr] border-b border-ash px-2 pb-1.5 text-[9px] font-medium text-graphite">
                <span>Część</span>
                <span>Typ</span>
                <span>Czas</span>
                <span>Status</span>
              </div>
              {MODULE_PARTS.map((row) => (
                <div key={row.part} className="grid grid-cols-[1.6fr_1fr_0.6fr_0.5fr] items-center border-b border-paper-mist px-2 py-[7px]">
                  <span className="flex items-center gap-1.5 truncate text-graphite">
                    <row.icon className="size-3 shrink-0 text-fog" strokeWidth={2} />
                    {row.part}
                  </span>
                  <span>{row.kind}</span>
                  <span className="tabular-nums">{row.time}</span>
                  {row.done ? (
                    <CircleCheck className="size-3 fill-green-500 text-white" strokeWidth={2.5} />
                  ) : (
                    <CircleDashed className="size-3 text-silver" strokeWidth={2} />
                  )}
                </div>
              ))}
              <p className="mt-2 px-2 text-[9px] text-fog">4 z 7 części</p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[9px] font-semibold text-charcoal">Szczegóły</p>
                <p className="mt-1 flex items-center gap-1">
                  <Target className="size-2.5 text-electric-blue" strokeWidth={2.5} /> Ukończenie 64%
                </p>
                <p className="mt-0.5 flex items-center gap-1">
                  <Clock className="size-2.5 text-fog" strokeWidth={2.5} /> 60 min łącznie
                </p>
                <p className="mt-0.5 flex items-center gap-1">
                  <CalendarDays className="size-2.5 text-fog" strokeWidth={2.5} /> Tydzień 12
                </p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-charcoal">Quiz</p>
                <p className="mt-1">6 z 8 punktów</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-charcoal">Zadania CKE</p>
                <p className="mt-1">12 zadań · 2015–2024</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-charcoal">Korepetytor AI</p>
                <p className="mt-1">Dostępny w każdej części</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-charcoal">Następny temat</p>
                <p className="mt-1 text-electric-blue">Funkcja kwadratowa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Week table ──────────────────────────────────────────────────────────── */

const WEEK: Array<{ day: string; topic: string; kind: string; icon: IconComponent; time: string; done: boolean }> = [
  { day: "pon", topic: "Funkcja liniowa", kind: "Lekcja", icon: BookOpen, time: "40 min", done: true },
  { day: "wt", topic: "Funkcja liniowa", kind: "Quiz", icon: ListChecks, time: "20 min", done: true },
  { day: "śr", topic: "Procenty", kind: "Powtórka", icon: RefreshCcw, time: "15 min", done: true },
  { day: "czw", topic: "Funkcja kwadratowa", kind: "Lekcja", icon: BookOpen, time: "45 min", done: false },
  { day: "pt", topic: "Funkcja kwadratowa", kind: "Przykłady", icon: Lightbulb, time: "30 min", done: false },
  { day: "sob", topic: "Arkusz 2023", kind: "Zadania CKE", icon: FileText, time: "60 min", done: false },
  { day: "nd", topic: "Podsumowanie tygodnia", kind: "Podsumowanie", icon: CircleCheck, time: "10 min", done: false },
];

const WEEK_CARDS = [
  { label: "Sesje", value: "7" },
  { label: "Tematy", value: "4" },
  { label: "Czas", value: "3 h 40 min" },
];

/** dub's events table: three figure cards with sparklines over the rows, cut at the right and bottom. */
export function WeekTable() {
  return (
    <div aria-hidden className="pointer-events-none size-full select-none [mask-image:linear-gradient(black_70%,transparent)]">
      <div className="size-full [mask-image:linear-gradient(90deg,black_85%,transparent)]">
        <div className="w-[125%]">
          <div className="grid grid-cols-3 gap-2">
            {WEEK_CARDS.map((card, index) => (
              <div
                key={card.label}
                className={cn("flex items-end justify-between rounded-lg border bg-white px-3 py-2.5", index === 0 ? "border-charcoal" : "border-ash")}
              >
                <div>
                  <p className="text-[10px] text-fog">{card.label}</p>
                  <p className="mt-1 text-[15px] font-medium text-charcoal">{card.value}</p>
                </div>
                <Sparkline className="h-7 w-16" />
              </div>
            ))}
          </div>
          <div className="mt-2 rounded-lg border border-ash bg-white text-[10px]">
            <div className="grid grid-cols-[0.5fr_1.6fr_1.1fr_0.8fr_0.5fr] border-b border-ash px-3 py-2 font-medium text-charcoal">
              <span>Dzień</span>
              <span>Temat</span>
              <span>Typ</span>
              <span>Czas</span>
              <span>Status</span>
            </div>
            {WEEK.map((row) => (
              <div key={row.day} className="grid grid-cols-[0.5fr_1.6fr_1.1fr_0.8fr_0.5fr] items-center border-b border-paper-mist px-3 py-[7px] text-steel">
                <span className="text-fog">{row.day}</span>
                <span className="truncate text-graphite">{row.topic}</span>
                <span className="flex items-center gap-1.5">
                  <row.icon className="size-3 text-fog" strokeWidth={2} />
                  {row.kind}
                </span>
                <span className="tabular-nums">{row.time}</span>
                {row.done ? (
                  <CircleCheck className="size-3 fill-green-500 text-white" strokeWidth={2.5} />
                ) : (
                  <CircleDashed className="size-3 text-silver" strokeWidth={2} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
