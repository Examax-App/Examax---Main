"use client";

import Image from "next/image";
import {
  ArrowRight,
  Clock,
  FileText,
  Flag,
  Layers,
  ListChecks,
  ListFilter,
  Percent,
  Send,
  Shapes,
  Sparkles,
  SquareFunction,
  StickyNote,
  Timer,
  TrendingUp,
} from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { FilterMarquee, type Filter } from "@/components/progress/LiveVisuals";
import { SubjectMark } from "@/components/progress/SubjectMark";
import { StageStack, type Stage } from "@/components/roadmap/ScheduleVisuals";
import { SimulationStill } from "@/components/mockups/SimulationShowcase";
import { SITTING } from "@/components/simulation/sitting";

import learnerPhoto from "@/public/mockups/learner.jpg";

/*
 * The four pictures of /simulation's "#tools" band — dub.co/solutions/
 * creators' "Powerful features at scale" (live DOM, 2026-10-02):
 *
 *   Detailed filters    → SheetFilters  (/progress's drifting filter rows,
 *                                         filled with a simulation's fields)
 *   Intuitive dashboard → AppStill      (the landing film's own frame, at
 *                                         screenshot size)
 *   Aggregate data      → ResultStack   (/roadmap's tilted three-panel stack:
 *                                         sheets, topics and task types)
 *   Customer insights   → SittingCard   (the sitting's own card: who, when,
 *                                         how it went, what happened)
 *
 * PLACEHOLDER DATA — the learner and her figures are illustrative.
 */

const FILTERS: Filter[][] = [
  [
    { field: "Arkusz", icon: FileText, value: { label: "Matura 2025", exam: true } },
    { field: "Przedmiot", icon: Shapes, value: { label: "Matematyka", subject: "math" } },
    { field: "Dział", icon: Layers, value: { label: "Funkcje", icon: TrendingUp } },
    { field: "Typ zadania", icon: ListFilter, value: { label: "Otwarte", icon: ListChecks } },
  ],
  [
    { field: "Status", icon: Flag, value: { label: "Do sprawdzenia", icon: Flag } },
    { field: "Punkty", icon: Percent, value: { label: "Stracone", icon: Percent } },
    { field: "Czas", icon: Clock, value: { label: "Ponad 5 min", icon: Timer } },
    { field: "Przedmiot", icon: Shapes, value: { label: "Język polski", subject: "polish" } },
  ],
  [
    { field: "Narzędzie", icon: SquareFunction, value: { label: "Karta wzorów", icon: SquareFunction } },
    { field: "Notatki", icon: StickyNote, value: { label: "Notatki AI", icon: Sparkles } },
    { field: "Arkusz", icon: FileText, value: { label: "Matura 2024", exam: true } },
    { field: "Przedmiot", icon: Shapes, value: { label: "Język angielski", subject: "english" } },
  ],
];

export function SheetFilters() {
  return <FilterMarquee rows={FILTERS} />;
}

/** dub's dashboard screenshot: a still of the simulation itself, drawn small and fading out. */
export function AppStill() {
  return (
    <div aria-hidden className="pointer-events-none size-full select-none [mask-image:linear-gradient(black_70%,transparent)]">
      <div className="size-full [mask-image:linear-gradient(90deg,black_85%,transparent)]">
        <SimulationStill className="w-[118%] rounded-lg border border-ash shadow-subtle" />
      </div>
    </div>
  );
}

/** Back to front: every sheet so far, the topics across them, and the task types. */
const STAGES: Stage[] = [
  {
    title: "Arkusze",
    icon: FileText,
    tx: 0,
    opacity: 0.45,
    rows: [
      { topic: "Matura 2025", done: SITTING.percent },
      { topic: "Matura 2024", done: 78 },
      { topic: "Matura 2023", done: 72 },
      { topic: "Informator CKE", done: 67 },
      { topic: "Próbna 2024", done: 63 },
    ],
  },
  {
    title: "Działy",
    icon: Layers,
    tx: 55,
    opacity: 0.75,
    rows: [
      { topic: "Funkcje", done: 93 },
      { topic: "Wyrażenia", done: 100 },
      { topic: "Planimetria", done: 78 },
      { topic: "Ciągi", done: 86 },
      { topic: "Stereometria", done: 67 },
    ],
  },
  {
    title: "Typy zadań",
    icon: ListChecks,
    tx: 110,
    opacity: 1,
    rows: [
      { topic: "Zamknięte", done: 94 },
      { topic: "Prawda / fałsz", done: 83 },
      { topic: "Otwarte", done: 72 },
      { topic: "Dowody", done: 50 },
      { topic: "Optymalizacja", done: 40 },
    ],
  },
];

export function ResultStack() {
  return <StageStack stages={STAGES} />;
}

const ACTIVITY = [
  { icon: Send, text: <><span className="font-medium text-charcoal">{SITTING.score}/{SITTING.max} pkt</span> — arkusz oddany</>, time: "11:21" },
  { icon: Flag, text: <>Zadanie 10 oznaczone do sprawdzenia</>, time: "11:16" },
  { icon: StickyNote, text: <>Notatka AI przy zadaniu 10</>, time: "11:16" },
  { icon: SquareFunction, text: <>Karta wzorów: funkcja kwadratowa</>, time: "11:09" },
];

/** dub's customer card, for one sitting: the learner, the clock, the result and the log. */
export function SittingCard() {
  return (
    <div aria-hidden className="h-full cursor-default select-none overflow-clip [mask-image:linear-gradient(black_75%,transparent)]">
      <div className="w-[111%] origin-top-left scale-90 rounded-xl border border-ash bg-canvas-muted">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between gap-2">
            <span className="relative size-10 overflow-hidden rounded-full bg-paper-mist">
              <Image src={learnerPhoto} alt="" fill sizes="40px" className="object-cover object-[center_30%]" />
            </span>
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-[11px] text-slate">
                <MaturaIcon className="h-2.5 w-3.5" />
                {SITTING.exam}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-[11px] text-slate">
                <SubjectMark subject="math" className="size-3" />
                {SITTING.subject}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-charcoal">Zuzanna Nowakowska</span>
            <span className="rounded-full border border-ash bg-white px-1.5 text-[11px] font-medium leading-4 text-charcoal">Pro</span>
            <span className="rounded-full border border-ash bg-ash px-1.5 text-[11px] leading-4 text-slate">8 symulacji</span>
          </div>
          <span className="text-xs text-fog">zuzanna@examax.app</span>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ash bg-ash">
              <div className="relative flex flex-col bg-canvas-muted p-2.5">
                <span className="text-[11px] text-silver underline decoration-dotted underline-offset-2">Start</span>
                <span className="text-sm text-charcoal">9:00</span>
                <span className="absolute inset-y-0 right-0 z-10 my-auto -mr-2 flex size-4 items-center justify-center rounded-full border border-ash bg-canvas-muted">
                  <ArrowRight className="size-2.5" strokeWidth={2} />
                </span>
              </div>
              <div className="flex flex-col bg-canvas-muted p-2.5 pl-4">
                <span className="text-[11px] text-silver underline decoration-dotted underline-offset-2">Oddanie</span>
                <span className="text-sm text-charcoal">11:21</span>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-ash bg-canvas-muted p-2.5">
              <span className="text-[11px] text-silver underline decoration-dotted underline-offset-2">Wynik</span>
              <span className="text-sm text-charcoal">
                {SITTING.score}/{SITTING.max} pkt · {SITTING.percent}%
              </span>
            </div>
          </div>

          <div className="mt-2 flex text-xs">
            <div className="relative">
              <span className="block px-2 pb-2.5 pt-1 text-steel">Przebieg</span>
              <div className="absolute bottom-0 w-full px-1 text-charcoal">
                <div className="h-0.5 rounded-t-full bg-current" />
              </div>
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-3.5 rounded-b-xl border-t border-ash bg-white px-5 py-4">
          {ACTIVITY.map((entry, index) => (
            <li key={entry.time + index} className="flex items-center text-xs">
              <span className="relative mr-2.5 shrink-0">
                <entry.icon className="size-3.5 text-fog" strokeWidth={1.75} />
                {index < ACTIVITY.length - 1 ? <span className="absolute left-1/2 mt-1 h-3 border-l border-smoke" /> : null}
              </span>
              <span className="grow text-steel">{entry.text}</span>
              <span className="shrink-0 pl-3 text-silver">{entry.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
