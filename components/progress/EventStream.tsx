"use client";

import { useCallback, useId, useState } from "react";
import { Activity, ArrowRight, CircleCheck, CircleDashed, CircleX, PencilLine } from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Sheet } from "@/components/ui/Sheet";
import { AccentTile, accentStyles } from "@/components/ui/FeaturePill";
import { monotonePath } from "@/components/progress/curve";
import { SubjectMark } from "@/components/progress/SubjectMark";
import { day, minutesAgo, stamp, useNow } from "@/components/progress/time";
import {
  ANSWERS,
  LESSONS,
  SCORES,
  SUBJECTS,
  TOPICS,
  type Outcome,
  type Source,
  type SubjectKey,
  type Topic,
} from "@/components/progress/events";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * dub.co/analytics' "See it as it happens", one to one (live DOM and
 * interactions recorded 2026-10-01, `DesignRules/dom-captures/analytics-events.html`):
 * three stat cards with a sparkline each — the selected one ringed in black —
 * over an events table that re-columns for the card picked. In the reference
 * a customer's name opens their details in a side sheet; here a topic opens
 * its own history: where it is followed from, how long it took to reach the
 * first quiz and mastery, and everything done in it, newest first.
 *
 * The streams are one learner's: every answer, every finished lesson, and
 * every scored task (dub's clicks, leads and sales). Sales is the reference's
 * opening card; points are, here.
 */

type TabKey = "answers" | "lessons" | "scores";

const TABS: Array<{ key: TabKey; label: string; value: number; spark: number[] }> = [
  {
    key: "answers",
    label: "Zadania",
    value: 704,
    spark: [16, 18, 20, 19, 15, 21, 22, 20, 22, 24, 22, 18, 24, 25, 23, 25, 27, 25, 21, 27, 28, 26, 28, 30],
  },
  {
    key: "lessons",
    label: "Lekcje",
    value: 38,
    // A week's running average, so a day without a lesson is a dip, not a cliff.
    spark: [1.1, 1.3, 1.2, 1.4, 1.3, 1.1, 1.4, 1.6, 1.5, 1.7, 1.6, 1.4, 1.7, 1.9, 1.8, 2, 1.9, 1.7, 2, 2.2, 2.1, 2.3, 2.2, 2.4],
  },
  {
    key: "scores",
    label: "Punkty",
    value: 1862,
    spark: [48, 55, 60, 57, 46, 63, 67, 61, 68, 74, 69, 57, 76, 79, 73, 80, 86, 80, 68, 87, 90, 85, 92, 98],
  },
];

const OUTCOMES: Record<Outcome, { label: string; icon: IconComponent }> = {
  correct: { label: "Poprawna", icon: CircleCheck },
  partial: { label: "Częściowo", icon: CircleDashed },
  wrong: { label: "Błędna", icon: CircleX },
};

/* ── Stat cards ─────────────────────────────────────────────────────────── */

/** The reference's card sparkline: 140×64, violet into pink, its fill fading down from 30%. */
function Spark({ values }: { values: number[] }) {
  const id = useId();
  const width = 136;
  const height = 48;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, i) => [(i / (values.length - 1)) * width, height - ((value - min) / (max - min || 1)) * height] as const);
  const line = monotonePath(points);
  return (
    <svg width="140" height="64" viewBox="0 0 140 64" aria-hidden className="h-16 w-full max-w-[140px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${id}-color`} x1="0" x2={width} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7D3AEC" />
          <stop offset="100%" stopColor="#DA2778" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-mask`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g transform="translate(2, 8)">
        <path d={`${line}L${width},${height}L0,${height}Z`} fill={`url(#${id}-color)`} mask={`url(#${id}-mask)`} />
        <path d={line} fill="none" stroke={`url(#${id}-color)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ── Cells ──────────────────────────────────────────────────────────────── */

const RULES = "whitespace-nowrap border-b border-l border-ash text-left text-sm leading-6";
const CELL = `${RULES} px-4 py-2.5`;

function SourceCell({ source }: { source: Source }) {
  const Icon = source.icon;
  return (
    <span className="flex items-center gap-3">
      {source.exam ? (
        <MaturaIcon className="h-3 w-4 shrink-0" />
      ) : Icon ? (
        <Icon className="size-4 shrink-0 text-slate" strokeWidth={1.75} aria-hidden />
      ) : null}
      <span className="truncate">{source.label}</span>
    </span>
  );
}

function SubjectCell({ subject }: { subject: SubjectKey }) {
  const { name, icon, accent } = SUBJECTS[subject];
  return (
    <span className="flex items-center gap-3" title={name}>
      <AccentTile icon={icon} accent={accent} size="xs" />
      <span className="truncate">{name}</span>
    </span>
  );
}

/**
 * The reference's customer button: the whole cell is the target, an activity
 * glyph at its right edge. The first row carries the reference's slow violet
 * sheen, the hint that the names open something.
 */
function TopicButton({ topic, hint, onOpen }: { topic: Topic; hint: boolean; onOpen: (id: string) => void }) {
  const { icon, accent } = SUBJECTS[topic.subject];
  return (
    <button
      type="button"
      onClick={() => onOpen(topic.id)}
      aria-haspopup="dialog"
      aria-label={`${topic.name} — pokaż historię tematu`}
      className="relative flex w-full items-center justify-between gap-2 overflow-hidden px-4 py-2.5 text-left transition-colors hover:bg-paper-mist focus-visible:bg-paper-mist focus-visible:outline-none"
    >
      {hint ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-full bg-[linear-gradient(-45deg,transparent_40%,#DA27781a,#7D3AEC1a,transparent_60%)] blur-md motion-safe:animate-[topic-sheen_4s_ease-in-out_infinite]"
        />
      ) : null}
      <span className="relative flex min-w-0 items-center gap-3">
        <AccentTile icon={icon} accent={accent} size="xs" />
        <span className="truncate">{topic.name}</span>
      </span>
      <Activity className="relative size-3.5 shrink-0 text-slate" strokeWidth={2} aria-hidden />
    </button>
  );
}

/* ── The table ──────────────────────────────────────────────────────────── */

type Column = { label: string; minWidth?: number };

const COLUMNS: Record<TabKey, Column[]> = {
  answers: [{ label: "Zdarzenie" }, { label: "Zadanie", minWidth: 180 }, { label: "Przedmiot" }, { label: "Wynik" }, { label: "Data" }],
  lessons: [{ label: "Zdarzenie" }, { label: "Źródło", minWidth: 180 }, { label: "Temat" }, { label: "Przedmiot" }, { label: "Data" }],
  scores: [{ label: "Zdarzenie" }, { label: "Źródło", minWidth: 180 }, { label: "Temat" }, { label: "Przedmiot" }, { label: "Punkty" }, { label: "Data" }],
};

function Rows({
  tab,
  now,
  selected,
  onOpen,
}: {
  tab: TabKey;
  now: number;
  selected: string | null;
  onOpen: (id: string, row: string) => void;
}) {
  const rowClass = (key: string) => cn("group/row", selected === key && "[&>td]:bg-blue-50");

  if (tab === "answers") {
    return ANSWERS.map((row, i) => {
      const outcome = OUTCOMES[row.outcome];
      return (
        <tr key={i} className={rowClass(`a${i}`)}>
          <td className={CELL}>
            <span className="flex items-center gap-3">
              <PencilLine className="size-4 shrink-0 text-slate" strokeWidth={1.75} aria-hidden />
              Odpowiedź
            </span>
          </td>
          <td className={CELL} style={{ minWidth: 180 }}>
            <span className="flex items-center gap-3">
              <MaturaIcon className="h-3 w-4 shrink-0" />
              <span className="truncate">{row.task}</span>
            </span>
          </td>
          <td className={CELL}>
            <SubjectCell subject={row.subject} />
          </td>
          <td className={CELL}>
            <span className="flex items-center gap-3">
              <outcome.icon className="size-4 shrink-0 text-slate" strokeWidth={1.75} aria-hidden />
              {outcome.label}
            </span>
          </td>
          <td className={CELL}>{stamp(minutesAgo(now, row.ago))}</td>
        </tr>
      );
    });
  }

  if (tab === "lessons") {
    return LESSONS.map((row, i) => {
      const topic = TOPICS[row.topic];
      const key = `l${i}`;
      return (
        <tr key={i} className={rowClass(key)}>
          <td className={CELL}>Lekcja</td>
          <td className={CELL} style={{ minWidth: 180 }}>
            <SourceCell source={row.source} />
          </td>
          <td className={RULES}>
            <TopicButton topic={topic} hint={i === 0} onOpen={(id) => onOpen(id, key)} />
          </td>
          <td className={CELL}>
            <SubjectCell subject={topic.subject} />
          </td>
          <td className={CELL}>{stamp(minutesAgo(now, row.ago))}</td>
        </tr>
      );
    });
  }

  return SCORES.map((row, i) => {
    const topic = TOPICS[row.topic];
    const key = `s${i}`;
    return (
      <tr key={i} className={rowClass(key)}>
        <td className={CELL}>{row.event}</td>
        <td className={CELL} style={{ minWidth: 180 }}>
          <SourceCell source={row.source} />
        </td>
        <td className={RULES}>
          <TopicButton topic={topic} hint={i === 0} onOpen={(id) => onOpen(id, key)} />
        </td>
        <td className={CELL}>
          <SubjectCell subject={topic.subject} />
        </td>
        <td className={CELL}>
          <span className="flex items-center gap-2 tabular-nums">
            <span>{row.points}</span>
            <span className="text-silver">/ {row.max} pkt</span>
          </span>
        </td>
        <td className={CELL}>{stamp(minutesAgo(now, row.ago))}</td>
      </tr>
    );
  });
}

/* ── The sheet ──────────────────────────────────────────────────────────── */

/** The reference's figure tile: a dotted-underline label over its value. */
function Figure({ label, hint, value, className, children }: { label: string; hint: string; value: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative flex flex-col bg-canvas-muted p-3", className)}>
      <span title={hint} className="cursor-default truncate text-xs text-silver underline decoration-dotted underline-offset-2">
        {label}
      </span>
      <span className="text-base text-charcoal">{value}</span>
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 overflow-hidden rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-slate">
      {children}
    </span>
  );
}

function TopicDetails({ topic, now }: { topic: Topic; now: number }) {
  const subject = SUBJECTS[topic.subject];
  const SourceIcon = topic.source.icon;
  const started = topic.activity[topic.activity.length - 1];
  return (
    <div className="flex grow flex-col">
      <div className="border-y border-ash bg-canvas-muted p-6 pb-0">
        <div className="flex h-12 w-full justify-between">
          <span className={cn("grid size-12 shrink-0 place-items-center rounded-full border border-black/5", accentStyles[subject.accent].chip)}>
            <subject.icon className="size-6" strokeWidth={2.25} aria-hidden />
          </span>
          <div className="flex min-w-[40%] shrink grow basis-1/2 flex-col items-end justify-end gap-2">
            <Pill>
              {topic.source.exam ? (
                <MaturaIcon className="h-2.5 w-3.5 shrink-0" />
              ) : SourceIcon ? (
                <SourceIcon className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              ) : null}
              <span className="truncate">{topic.source.label}</span>
            </Pill>
            <Pill>
              <SubjectMark subject={topic.subject} />
              <span className="truncate">{subject.name}</span>
            </Pill>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold leading-tight text-charcoal">{topic.name}</span>
          <span className="rounded-full border border-ash bg-ash px-1.5 py-0.5 text-xs text-charcoal">od {day(minutesAgo(now, started.ago))}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ash bg-ash">
            <Figure label="Quiz" hint="Od pierwszej lekcji do pierwszego quizu" value={topic.toQuiz}>
              <span aria-hidden className="absolute inset-y-0 right-0 z-10 my-auto -mr-2.5 flex size-5 items-center justify-center rounded-full border border-ash bg-canvas-muted text-charcoal">
                <ArrowRight className="size-3" strokeWidth={2} />
              </span>
            </Figure>
            <Figure label="Opanowanie" hint="Od pierwszej lekcji do opanowania tematu" value={topic.toMastery} className="pl-6" />
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ash bg-ash">
            <Figure label="Wynik w temacie" hint="Ile tematu masz już opanowane" value={`${topic.mastery}%`} />
          </div>
        </div>

        <div className="mt-2 flex text-sm">
          <div className="relative">
            <span className="block p-4 text-charcoal">Aktywność</span>
            <div aria-hidden className="absolute bottom-0 w-full px-1.5 text-charcoal">
              <div className="h-0.5 rounded-t-full bg-current" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex grow flex-col p-6">
        <ul className="flex flex-col gap-5">
          {topic.activity.map((entry, i) => (
            <li key={i} className="flex items-center">
              <div className="relative mr-3 shrink-0">
                <entry.icon className="size-4 text-slate" strokeWidth={1.75} aria-hidden />
                {i < topic.activity.length - 1 ? <div aria-hidden className="absolute left-1/2 mt-1 h-4 border-l border-smoke" /> : null}
              </div>
              <span className="grow text-sm text-slate">
                {entry.label}
                <span className="ml-1 font-medium">({entry.detail})</span>
              </span>
              <span className="shrink-0 pl-4 text-sm text-fog">{stamp(minutesAgo(now, entry.ago))}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── The band's picture ─────────────────────────────────────────────────── */

export function EventStream() {
  const [tab, setTab] = useState<TabKey>("scores");
  const [open, setOpen] = useState(false);
  // The last topic and row stay set while the sheet slides out.
  const [topicId, setTopicId] = useState("quadratic");
  const [row, setRow] = useState<string | null>(null);
  const now = useNow();

  const openTopic = useCallback((id: string, key: string) => {
    setTopicId(id);
    setRow(key);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    setRow(null);
  }, []);

  return (
    <div className="-mx-px mb-8 mt-12">
      <div className="relative rounded-xl border border-ash bg-white p-2 [mask-image:linear-gradient(black_85%,transparent)] sm:p-4">
        <div role="tablist" aria-label="Rodzaj zdarzeń" className="grid w-full grid-cols-3 gap-2 sm:gap-4">
          {TABS.map((item) => {
            const active = item.key === tab;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="progress-events"
                onClick={() => setTab(item.key)}
                className={cn(
                  "flex min-w-0 justify-between gap-4 rounded-xl border bg-white px-3 py-3 text-left transition-[box-shadow,border-color] focus:outline-none sm:px-5 sm:py-4",
                  active ? "border-black shadow-[0_0_0_1px_black_inset]" : "border-ash hover:border-smoke focus-visible:border-black",
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm text-steel">{item.label}</p>
                  <div className="mt-2 text-xl text-charcoal sm:text-2xl">
                    <RollingNumber value={item.value} lineHeight={32} />
                  </div>
                </div>
                <div className="relative hidden h-full max-w-[140px] grow md:block">
                  <Spark values={item.spark} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 h-96 w-full">
          <div className="relative z-0 rounded-xl border border-ash bg-white">
            <div id="progress-events" role="tabpanel" className="relative min-h-[400px] overflow-x-auto rounded-[inherit] [scrollbar-width:none]">
              <table className="w-full border-separate border-spacing-0 text-charcoal [&_tr>*:first-child]:border-l-transparent">
                <thead>
                  <tr>
                    {COLUMNS[tab].map((column) => (
                      <th key={column.label} scope="col" className={cn(CELL, "select-none font-medium")} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody key={tab} className="motion-safe:animate-[fade-in_0.3s_ease-out]">
                  <Rows tab={tab} now={now} selected={open ? row : null} onOpen={openTopic} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={open} onClose={close} title="Historia tematu">
        <TopicDetails topic={TOPICS[topicId]} now={now} />
      </Sheet>
    </div>
  );
}
