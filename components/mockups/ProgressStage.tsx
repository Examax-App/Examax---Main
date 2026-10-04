"use client";

import { useEffect, useId, useState } from "react";
import {
  CalendarDays,
  Check,
  CircleCheck,
  CircleDashed,
  CircleX,
  FileCheck,
  FileText,
  Flag,
  GraduationCap,
  ListChecks,
  MapPin,
  Route,
  Sigma,
  Target,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Sparkline } from "@/components/ui/Sparkline";
import { usePanelCurrent } from "@/components/sections/FeatureStage";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

import learnerPhoto from "@/public/mockups/learner.jpg";

/**
 * The Roadmapa section's three pictures, one per sub-feature below the band,
 * each a template copy of the reference's analytics section (dub.co, read off
 * its live DOM and `DesignRules/Analytics — * _ Dub.png`):
 *
 *  - ProgressFunnel ← conversion tracking: the product card over the funnel
 *  - LiveProgress   ← real-time analytics: stat cards over a streaming feed
 *  - ProgressProfile← customer insights: a profile amid staggered columns
 *
 * All drawn on the 800×440 stage; FeatureStage scales it on narrow screens.
 * PLACEHOLDER DATA — the learner, figures and dates are illustrative. The
 * funnel's figures match the editorial section's, so the page tells one story.
 */

/* ------------------------------------------------------------------------ */
/* 1 · Progress funnel                                                       */
/* ------------------------------------------------------------------------ */

/** The reference's funnel card coordinates: 502×269, header 55.6 high. */
const CENTRE = 161.31;
const COL = 167.333;
const HEADER = 55.6;

/**
 * One column's band, in the reference's own geometry: a flat run, two cubic
 * segments easing down to the next stage's height, a short straight, then
 * flat to the column's end. Offsets are the reference's; the vertical
 * control points are the same fractions of the drop, so any pair of heights
 * keeps its curve.
 */
function bandPath(x0: number, from: number, to: number) {
  const drop = from - to;
  const top = (f: number) => (CENTRE - from + f * drop).toFixed(2);
  const bottom = (f: number) => (CENTRE + from - f * drop).toFixed(2);
  const x = (v: number) => (x0 + v).toFixed(2);
  return [
    `M${x(0)} ${top(0)}H${x(26.85)}`,
    `C${x(44.16)} ${top(0)} ${x(60.98)} ${top(0.169)} ${x(74.69)} ${top(0.481)}`,
    `C${x(86.03)} ${top(0.739)} ${x(99.55)} ${top(0.9)} ${x(113.77)} ${top(0.947)}`,
    `L${x(129.67)} ${top(1)}H${x(COL)}V${bottom(1)}H${x(129.67)}`,
    `L${x(113.77)} ${bottom(0.947)}`,
    `C${x(99.55)} ${bottom(0.9)} ${x(86.03)} ${bottom(0.739)} ${x(74.69)} ${bottom(0.481)}`,
    `C${x(60.98)} ${bottom(0.169)} ${x(44.16)} ${bottom(0)} ${x(26.85)} ${bottom(0)}`,
    `H${x(0)}Z`,
  ].join("");
}

/** Topics → worked through → mastered, in the reference's three colours. */
const STAGES = [
  {
    label: "Tematy",
    value: "124",
    share: "100%",
    from: 72.78,
    to: 38.9,
    pill: 38.94,
    fill: "#155dfc",
    halo: "#2563eb",
    legend: "#2b7fff",
    edge: "#155dfc",
    ink: "#1c398e",
  },
  {
    label: "Przerobione",
    value: "45",
    share: "36%",
    from: 38.9,
    to: 14,
    pill: 34.94,
    fill: "#9810fa",
    halo: "#9333ea",
    legend: "#ad46ff",
    edge: "#8200db",
    ink: "#59168b",
  },
  {
    label: "Opanowane",
    value: "12",
    share: "9,7%",
    from: 14,
    to: 3,
    pill: 35.94,
    fill: "#00d5be",
    halo: "#00d5be",
    legend: "#00bba7",
    edge: "#009689",
    ink: "#0b4f4a",
  },
];

/** Replays each time the panel is shown, like the reference's stage. */
const GROW =
  "origin-center [transform-box:fill-box] in-data-[current=true]:motion-safe:animate-band-grow";

function FunnelChart() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 502 269"
      fill="none"
      className="h-auto w-full max-w-[540px] shrink-0 overflow-hidden rounded-xl border border-ash bg-white"
    >
      <defs>
        {STAGES.map((_, i) => (
          <clipPath key={i} id={`${id}-col${i}`}>
            <rect x={i * COL} y={HEADER} width={COL} height={212.83} />
          </clipPath>
        ))}
      </defs>
      <rect width="502" height="269" fill="white" />

      {/* The selected stage: a faint wash under it, a rule under its header */}
      <rect
        x={2 * COL}
        y={HEADER}
        width={COL}
        height={212.83}
        fill="#67e8f9"
        fillOpacity="0.07"
      />
      <rect x={2 * COL} y="53.41" width="166.79" height="1.06" fill="#171717" />

      {/* Header grid */}
      <rect y="55.07" width="502" height="0.53" fill="#e5e5e5" />
      {[1, 2].map((i) => (
        <rect
          key={i}
          x={i * COL - 0.26}
          width="0.53"
          height={HEADER}
          fill="#e5e5e5"
        />
      ))}

      {STAGES.map((stage, i) => {
        const x0 = i * COL;
        return (
          <g key={stage.label}>
            <rect
              x={x0 + 17.2}
              y="15.28"
              width="3.7"
              height="3.7"
              rx="0.79"
              fill={stage.legend}
              stroke={stage.edge}
              strokeWidth="0.53"
              opacity="0.5"
            />
            <text x={x0 + 26.46} y="19.82" fontSize="7.41" fill="#525252">
              {stage.label}
            </text>
            <text
              x={x0 + 16.94}
              y="40.17"
              fontSize="15.88"
              fontWeight="600"
              fill="#171717"
            >
              {stage.value}
            </text>

            <g clipPath={`url(#${id}-col${i})`}>
              <g className={GROW}>
                <path
                  d={bandPath(x0, stage.from, stage.to)}
                  stroke={stage.halo}
                  strokeOpacity="0.1"
                  strokeWidth="25.4"
                  strokeLinejoin="round"
                />
                <path
                  d={bandPath(x0, stage.from, stage.to)}
                  stroke={stage.halo}
                  strokeOpacity="0.3"
                  strokeWidth="12.7"
                  strokeLinejoin="round"
                />
                <path
                  d={bandPath(x0, stage.from, stage.to)}
                  fill={stage.fill}
                />
              </g>
              <rect
                x={x0 + 83.4 - stage.pill / 2}
                y="153.9"
                width={stage.pill}
                height="15.35"
                rx="7.68"
                fill="white"
              />
              <text
                x={x0 + 83.4}
                y="164.65"
                fontSize="8.47"
                fontWeight="500"
                fill={stage.ink}
                textAnchor="middle"
              >
                {stage.share}
              </text>
            </g>
          </g>
        );
      })}

      {/* Stage dividers through the body, and the arrows between headers */}
      {[1, 2].map((i) => (
        <g key={i}>
          <rect
            x={i * COL - 0.54}
            y={HEADER}
            width="0.53"
            height="213.43"
            fill="#171717"
            opacity="0.1"
          />
          <rect
            x={i * COL - 6.63}
            y="21.33"
            width="13.23"
            height="13.23"
            rx="6.62"
            fill="white"
            stroke="#e5e5e5"
            strokeWidth="0.53"
          />
          <path
            d={`M${i * COL - 0.34} 26.48L${i * COL + 1.13} 27.95L${i * COL - 0.34} 29.42`}
            stroke="#737373"
            strokeWidth="0.79"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Count / percent toggle, and chart-type toggle */}
      <rect
        x="461.76"
        y="8.89"
        width="31.76"
        height="16.94"
        rx="4.23"
        fill="#f5f5f5"
      />
      <text
        x="470.4"
        y="19.4"
        fontSize="5.6"
        fontWeight="600"
        fill="#262626"
        textAnchor="middle"
      >
        123
      </text>
      <rect
        x="477.9"
        y="10.22"
        width="14.29"
        height="14.29"
        rx="2.91"
        fill="white"
        stroke="#e5e5e5"
        strokeWidth="0.53"
      />
      <text
        x="485.05"
        y="19.6"
        fontSize="7"
        fontWeight="500"
        fill="#262626"
        textAnchor="middle"
      >
        %
      </text>
      <rect
        x="465.38"
        y="64.06"
        width="31.76"
        height="16.94"
        rx="4.23"
        fill="black"
        opacity="0.04"
      />
      <path
        d="M471.28 73.25L472.78 71.75C472.86 71.67 472.99 71.67 473.07 71.75L474.42 73.11C474.5 73.19 474.63 73.19 474.72 73.11L476.42 71.4"
        stroke="#262626"
        strokeWidth="0.53"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M471.28 69.96V74.08C471.28 74.53 471.65 74.9 472.1 74.9H476.42"
        stroke="#262626"
        strokeWidth="0.53"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="481.52"
        y="65.39"
        width="14.29"
        height="14.29"
        rx="2.91"
        fill="white"
        stroke="#e5e5e5"
        strokeWidth="0.53"
      />
      <path
        d="M491.45 72.12V73.36H488.46L486.94 75.17C486.86 75.26 486.75 75.31 486.63 75.31H485.89V70.17H486.63C486.75 70.17 486.86 70.22 486.94 70.31L488.46 72.12H491.45Z"
        stroke="#262626"
        strokeWidth="0.53"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const OPTIONS = [
  { key: "A", text: "20%" },
  { key: "B", text: "33%" },
  { key: "C", text: "25%", chosen: true },
  { key: "D", text: "75%" },
];

export function ProgressFunnel() {
  return (
    <div
      aria-hidden
      className="relative size-full [mask-image:linear-gradient(black_70%,transparent)]"
    >
      <div className="flex size-full flex-col items-center justify-start">
        {/* The question being answered — the reference's product card, cut
            by the band's top edge so only its answers and button show. */}
        <div className="-mt-32 flex flex-col gap-2 rounded-xl border border-ash bg-white p-2">
          <div className="flex flex-col rounded-lg border border-ash px-5 py-3">
            <div className="flex size-[184px] flex-col justify-end gap-1.5 overflow-hidden pb-3">
              <span className="text-[11px] text-fog">Zadanie 7 · Procenty</span>
              <span className="text-xs font-medium leading-4 text-charcoal">
                Cena spadła z 80 zł do 60 zł. O ile procent?
              </span>
              {OPTIONS.map((option) => (
                <span
                  key={option.key}
                  className={cn(
                    "flex h-7 shrink-0 items-center gap-2 rounded-md border px-2 text-xs",
                    option.chosen
                      ? "border-charcoal text-charcoal"
                      : "border-ash text-steel",
                  )}
                >
                  <span className="text-silver">{option.key}</span>
                  {option.text}
                  {option.chosen && (
                    <Check className="ml-auto size-3.5" strokeWidth={2} />
                  )}
                </span>
              ))}
            </div>
            <div className="-mt-2 flex items-center justify-center gap-1">
              <span className="h-1.5 w-3 rounded-full bg-fog" />
              <span className="size-1.5 rounded-full bg-smoke" />
              <span className="size-1.5 rounded-full bg-smoke" />
            </div>
          </div>
          <div
            className="flex h-8 items-center justify-center rounded-lg bg-charcoal px-3 text-sm font-medium text-white [--from-scale:0.9] in-data-[current=true]:motion-safe:animate-pulse-in"
            style={{ animationDelay: "300ms" }}
          >
            Sprawdź odpowiedź
          </div>
        </div>
        <div className="h-5 w-px shrink-0 bg-ash" />
        <FunnelChart />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · Live progress                                                         */
/* ------------------------------------------------------------------------ */

type Outcome = "correct" | "partial" | "wrong" | "mastered";

const OUTCOME: Record<Outcome, { label: string; icon: IconComponent }> = {
  correct: { label: "Poprawna odpowiedź", icon: CircleCheck },
  partial: { label: "Częściowo poprawna", icon: CircleDashed },
  wrong: { label: "Błędna odpowiedź", icon: CircleX },
  mastered: { label: "Temat opanowany", icon: Target },
};

/**
 * A score's colour: green from 85%, amber from 50%, orange from 30%, red
 * below — the 600 shades, which hold their contrast on white.
 */
function scoreColor(score: number) {
  if (score >= 85) return "text-[#16a34a]";
  if (score >= 50) return "text-[#ca8a04]";
  if (score >= 30) return "text-[#ea580c]";
  return "text-[#dc2626]";
}

/**
 * A score in the page's own chip — the hairline box the question rows use
 * for their solve counts (the reference's clicks chip) — its figure
 * coloured by band.
 */
function ScoreBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span className={cn("rounded-md border border-ash bg-white px-1.5 py-0.5 font-medium tabular-nums", scoreColor(score), className)}>
      {score}%
    </span>
  );
}

type FeedEvent = {
  outcome: Outcome;
  topic: string;
  source: string;
  sourceIcon: IconComponent;
  /** Share of the task's points, or the topic's mastery once mastered. */
  score: number;
};

/** One loop of a learner's evening; the feed cycles through it. */
const EVENTS: FeedEvent[] = [
  {
    outcome: "correct",
    topic: "Procenty",
    source: "Arkusz CKE 2024",
    sourceIcon: FileText,
    score: 100,
  },
  {
    outcome: "wrong",
    topic: "Funkcja liniowa",
    source: "Quiz tematyczny",
    sourceIcon: ListChecks,
    score: 0,
  },
  {
    outcome: "partial",
    topic: "Ciągi",
    source: "Arkusz CKE 2023",
    sourceIcon: FileText,
    score: 67,
  },
  {
    outcome: "correct",
    topic: "Procenty",
    source: "Quiz tematyczny",
    sourceIcon: ListChecks,
    score: 100,
  },
  {
    outcome: "mastered",
    topic: "Procenty",
    source: "Roadmapa",
    sourceIcon: Route,
    score: 92,
  },
  {
    outcome: "wrong",
    topic: "Geometria",
    source: "Arkusz CKE 2022",
    sourceIcon: FileText,
    score: 40,
  },
  {
    outcome: "partial",
    topic: "Funkcja liniowa",
    source: "Arkusz CKE 2024",
    sourceIcon: FileText,
    score: 75,
  },
  {
    outcome: "correct",
    topic: "Geometria",
    source: "Quiz tematyczny",
    sourceIcon: ListChecks,
    score: 100,
  },
];

const BASE = { solved: 1248, correct: 836, mastered: 12 };

/** At or below this, an answer is a miss and counts towards nothing. */
const COUNTS_ABOVE = 5;

/** Running totals after the first `count` events have streamed in. */
function totalsAfter(count: number) {
  const tally = (n: number) => {
    const t = { solved: 0, correct: 0, mastered: 0 };
    for (let i = 0; i < n; i++) {
      const { outcome, score } = EVENTS[i % EVENTS.length];
      if (outcome === "mastered") t.mastered++;
      else if (score > COUNTS_ABOVE) {
        t.solved++;
        if (outcome === "correct") t.correct++;
      }
    }
    return t;
  };
  const loops = Math.floor(count / EVENTS.length);
  const loop = tally(EVENTS.length);
  const rest = tally(count % EVENTS.length);
  return {
    solved: BASE.solved + loops * loop.solved + rest.solved,
    correct: BASE.correct + loops * loop.correct + rest.correct,
    mastered: BASE.mastered + loops * loop.mastered + rest.mastered,
  };
}

/** The reference's row pitch: 40px rows overlapping by their 1px border. */
const PITCH = 39;
const VISIBLE = 8;

export function LiveProgress() {
  const current = usePanelCurrent();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  // One event a second, the reference's beat, only while it can be seen.
  useEffect(() => {
    if (!current || !inView || reducedMotion) return;
    const timer = window.setInterval(() => setStep((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [current, inView, reducedMotion]);

  const totals = totalsAfter(step + VISIBLE);
  const stats = [
    { label: "Rozwiązane", value: totals.solved },
    { label: "Poprawne", value: totals.correct },
    { label: "Opanowane", value: totals.mastered },
  ];
  // The row leaving over the top, the ones on show, and one waiting below.
  const rows = Array.from(
    { length: VISIBLE + 2 },
    (_, k) => step - 1 + k,
  ).filter((i) => i >= 0);

  return (
    <div ref={ref} aria-hidden className="relative size-full pt-8">
      <div className="size-full overflow-hidden [mask-image:linear-gradient(black_75%,transparent)]">
        <div className="relative z-0 mx-auto flex size-full max-w-xl flex-col items-center">
          <div className="w-full shrink-0 rounded-[10px] border border-ash bg-white p-1.5 shadow-subtle">
            <div className="grid w-full grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex h-full items-center justify-between gap-2.5 rounded-md border border-ash bg-white p-2.5"
                >
                  <div className="flex h-full flex-col gap-1">
                    <span className="text-[10px] text-fog">{stat.label}</span>
                    <RollingNumber
                      value={stat.value}
                      lineHeight={24}
                      className="text-base font-medium text-graphite"
                    />
                  </div>
                  <div className="relative h-[43px] min-w-0 max-w-20 grow">
                    <Sparkline className="size-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-5 w-px shrink-0 bg-ash" />
          <div className="relative w-full">
            {rows.map((index) => {
              const event = EVENTS[index % EVENTS.length];
              const outcome = OUTCOME[event.outcome];
              const leaving = index < step;
              return (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-x-0 top-0 grid h-10 grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))] gap-4 rounded-md border border-ash bg-white pl-2 pr-4 text-[11px] font-medium text-graphite transition-[transform,opacity] duration-300",
                    leaving && "opacity-0",
                  )}
                  style={{
                    transform: `translateY(${(index - step) * PITCH}px) scaleX(${leaving ? 0.5 : 1})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <outcome.icon
                      className="size-3.5 shrink-0 text-slate"
                      strokeWidth={1.75}
                    />
                    <span className="whitespace-nowrap">{outcome.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MaturaIcon className="h-2.5 w-3.5" />
                    <span className="min-w-0 truncate">{event.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <event.sourceIcon
                      className="size-3.5 shrink-0 text-slate"
                      strokeWidth={1.75}
                    />
                    <span className="min-w-0 truncate">{event.source}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <ScoreBadge
                      score={event.score}
                      className="text-[10px] leading-4"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · Progress profile                                                      */
/* ------------------------------------------------------------------------ */

/** The reference's card: grey, 16px radius, 14px text. */
const CARD =
  "flex flex-col rounded-2xl border border-ash bg-canvas-muted p-4 text-sm text-charcoal";

function EventCard({
  icon: Icon,
  title,
  date,
  score,
}: {
  icon: IconComponent;
  title: string;
  date: string;
  /** A result, shown as a badge at the card's right edge. */
  score?: number;
}) {
  return (
    <div className={CARD}>
      <div className="flex items-start justify-between gap-2">
        <Icon className="size-4 text-slate" strokeWidth={1.75} />
        {score !== undefined && (
          <ScoreBadge score={score} className="text-xs" />
        )}
      </div>
      <div className="mt-2 font-medium text-graphite">{title}</div>
      <span className="mt-1 text-fog">{date}</span>
    </div>
  );
}

function FactCard({ title, value }: { title: string; value: string }) {
  return (
    <div className={CARD}>
      <span className="font-semibold">{title}</span>
      <div className="mt-2">{value}</div>
    </div>
  );
}

/** The reference's inline token: a grey pill with an icon. */
function Chip({
  icon: Icon,
  children,
}: {
  icon: IconComponent;
  children: React.ReactNode;
}) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 rounded-lg bg-ash px-1.5 py-1 text-xs text-slate">
      <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

function MasteredCard({ topic, date }: { topic: string; date: string }) {
  return (
    <div className={CARD}>
      <Target className="size-4 text-slate" strokeWidth={1.75} />
      <div className="mt-2 space-y-1 font-medium text-graphite">
        <div className="flex items-center gap-2">
          Opanowany <Chip icon={Sigma}>{topic}</Chip>
        </div>
        <div className="flex items-center gap-2">
          w <Chip icon={Route}>Roadmapa</Chip>
        </div>
      </div>
      <span className="mt-2 text-fog">{date}</span>
    </div>
  );
}

type Portrait = { src: StaticImageData; position: string };

/** The landing's portrait: Zuzanna, cropped around her face. */
const LEARNER_PORTRAIT: Portrait = { src: learnerPhoto, position: "object-[center_30%]" };

function ProfileCard({ portrait }: { portrait: Portrait }) {
  return (
    <div className="flex flex-col rounded-2xl border border-ash bg-white p-2 text-sm text-charcoal shadow-md">
      {/* The learner's photo, supplied for this card — the reference's own
          260px well, cover-cropped around the face, shown untinted. */}
      <div className="relative h-[260px] overflow-hidden rounded-2xl border border-black/10 bg-paper-mist">
        <Image src={portrait.src} alt="" fill sizes="240px" className={cn("object-cover", portrait.position)} />
      </div>
      <div className="mt-1 flex flex-col items-center py-2 text-center">
        <span className="text-base font-semibold text-graphite">
          Zuzanna Nowakowska
        </span>
        <span className="font-medium text-silver">zuzanna@examax.app</span>
      </div>
    </div>
  );
}

/** Five columns, staggered down and in from the centre, as the reference's. */
const COLUMNS = (portrait: Portrait): Array<{
  offset: number;
  delay: number;
  cards: React.ReactNode[];
}> => [
  {
    offset: 64,
    delay: 200,
    cards: [
      <EventCard
        key="a"
        icon={FileCheck}
        title="Arkusz próbny"
        score={86}
        date="12 kwi 2026, 18:40"
      />,
      <EventCard
        key="b"
        icon={FileCheck}
        title="Arkusz próbny"
        score={76}
        date="5 kwi 2026, 17:15"
      />,
      <EventCard
        key="c"
        icon={FileCheck}
        title="Arkusz próbny"
        score={71}
        date="29 mar 2026, 19:02"
      />,
      <EventCard
        key="d"
        icon={FileCheck}
        title="Arkusz próbny"
        score={48}
        date="22 mar 2026, 16:48"
      />,
    ],
  },
  {
    offset: 32,
    delay: 100,
    cards: [
      <div key="a" className={CARD}>
        <span className="font-semibold">Szczegóły</span>
        <div className="mt-2 grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-x-1.5 gap-y-2">
          <MaturaIcon className="h-3 w-3.5" />
          <span>Matura 2027</span>
          <MapPin className="size-3.5 text-slate" strokeWidth={1.75} />
          <span>Kraków</span>
          <GraduationCap className="size-3.5 text-slate" strokeWidth={1.75} />
          <span>LO nr 5</span>
          <Sigma className="size-3.5 text-slate" strokeWidth={1.75} />
          <span>Matematyka</span>
        </div>
      </div>,
      <MasteredCard key="b" topic="Procenty" date="12 mar 2026, 18:02" />,
      <EventCard
        key="c"
        icon={Flag}
        title="Pierwsze zadanie"
        date="2 wrz 2025, 16:08"
      />,
    ],
  },
  {
    offset: 0,
    delay: 0,
    cards: [
      <ProfileCard key="a" portrait={portrait} />,
      <MasteredCard key="b" topic="Funkcja liniowa" date="2 kwi 2026, 17:34" />,
    ],
  },
  {
    offset: 32,
    delay: 100,
    cards: [
      <div key="a" className={CARD}>
        <span className="font-semibold">Cel</span>
        <div className="mt-2 grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-x-6 gap-y-2">
          <span>Egzamin</span>
          <span className="text-fog">Matura 2027</span>
          <span>Poziom</span>
          <span className="text-fog">rozszerzony</span>
          <span>Wynik</span>
          <span className="text-fog">85%</span>
        </div>
      </div>,
      <FactCard key="b" title="Uczy się od" value="2 września 2025" />,
      <FactCard key="c" title="Średni wynik" value="78%" />,
      <EventCard
        key="d"
        icon={FileCheck}
        title="Arkusz próbny"
        score={86}
        date="12 kwi 2026, 18:40"
      />,
    ],
  },
  {
    offset: 64,
    delay: 200,
    cards: [
      <FactCard key="a" title="Seria" value="34 dni" />,
      <EventCard
        key="b"
        icon={Target}
        title="Temat opanowany · Ciągi"
        date="16 mar 2026, 15:34"
      />,
      <EventCard
        key="c"
        icon={CalendarDays}
        title="Quiz tematyczny"
        score={90}
        date="16 lut 2026, 15:34"
      />,
      <EventCard
        key="d"
        icon={CalendarDays}
        title="Quiz tematyczny"
        score={80}
        date="16 sty 2026, 15:34"
      />,
    ],
  },
];

/**
 * On the landing it sits on the 800×440 stage at 75%; /progress shows the
 * same wall at the reference's own size (`full`), across the whole column,
 * and may pass its own portrait for the centre card.
 */
export function ProgressProfile({ full = false, portrait = LEARNER_PORTRAIT }: { full?: boolean; portrait?: Portrait } = {}) {
  return (
    <div className="relative size-full">
      <div
        aria-hidden
        // Wider than the stage, as the reference's band is, so the side fade
        // falls where the reference's does.
        className={cn(
          "absolute left-1/2 top-0 h-full -translate-x-1/2 [mask-composite:intersect] [mask-image:linear-gradient(black_70%,transparent),linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]",
          full ? "w-[1352px] pt-0" : "w-[1014px] pt-12",
        )}
      >
        <div className={cn("relative h-[520px] w-full origin-top", !full && "scale-75")}>
          <div className="absolute left-1/2 top-0 grid -translate-x-1/2 grid-cols-[repeat(5,256px)] gap-4">
            {COLUMNS(portrait).map((column, i) => (
              <div
                key={i}
                className="relative flex flex-col gap-4 [--offset:20px] in-data-[current=true]:motion-safe:animate-rise"
                style={{
                  paddingTop: column.offset,
                  animationDelay: `${column.delay}ms`,
                }}
              >
                {column.cards}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
