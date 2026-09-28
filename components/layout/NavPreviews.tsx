import {
  BookOpen,
  Check,
  CircleDashed,
  CornerDownRight,
  GraduationCap,
  Lock,
  MousePointer2,
  PencilLine,
  Sigma,
} from "lucide-react";
import { BotAvatar } from "bot-avatars";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/**
 * Artwork for the navbar's Product panel. Each piece is a static picture of the
 * product at the scale of the reference's own card previews (dub.co's Product
 * menu, read off the live DOM): the same boxes, type sizes and fade masks,
 * carrying Examax's content instead of links and partners.
 *
 * All of it is `aria-hidden` decoration. The card's title and description are
 * what a screen reader gets.
 */

/** The reference's preview fade: solid for the top half, gone by the bottom. */
const FADE_DOWN = "[mask-image:linear-gradient(black_50%,transparent)]";

/* ------------------------------------------------------------------------ */
/* Trening zadań — the reference's partner grid, 1:1 (template:              */
/* `DesignRules/Partner grid _ Dub.png`, classes from dub.co's live DOM):    */
/* 180x60 cells with a 3px gutter, two columns running off the card's right */
/* edge, a 54px slot holding the score ring, a name and two figures.        */
/* ------------------------------------------------------------------------ */

/** The subject, as a small dot after the topic's name. */
const SUBJECT_MARK = {
  math: "bg-[#60a5fa]",
  polish: "bg-[#4ade80]",
  english: "bg-[#a78bfa]",
} as const;

const TOPICS: Array<{ subject: keyof typeof SUBJECT_MARK; name: string; tasks: string; score: string }> = [
  { subject: "math", name: "Procenty", tasks: "48", score: "92%" },
  { subject: "english", name: "Past Simple", tasks: "36", score: "88%" },
  { subject: "polish", name: "Lektury", tasks: "31", score: "74%" },
  { subject: "math", name: "Funkcje", tasks: "40", score: "81%" },
  { subject: "polish", name: "Rozprawka", tasks: "20", score: "66%" },
  { subject: "english", name: "Reading", tasks: "42", score: "90%" },
];

/** A 22px ring, charcoal on an ash track, filled to `value` percent. */
function ScoreRing({ value }: { value: number }) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 22 22" className="size-[22px] -rotate-90">
      <circle cx="11" cy="11" r={radius} fill="none" stroke="var(--color-ash)" strokeWidth="2" />
      <circle
        cx="11"
        cy="11"
        r={radius}
        fill="none"
        stroke="var(--color-charcoal)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value / 100)}
      />
    </svg>
  );
}

export function TrainingPreview() {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute left-0 top-0 size-full overflow-hidden pl-2", FADE_DOWN)}>
      <div className="grid grid-cols-[repeat(2,180px)]">
        {TOPICS.map((topic) => (
          <div key={topic.name} className="h-[60px] w-[180px] p-[3px]">
            <div className="flex size-full select-none overflow-hidden rounded border border-ash bg-white">
              {/* Where the reference has a portrait: the topic's score as a
                  thin neutral progress ring. */}
              <div className="grid aspect-square h-full place-items-center bg-canvas-muted">
                <ScoreRing value={parseInt(topic.score, 10)} />
              </div>
              <div className="flex h-full flex-col justify-between border-l border-ash px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-medium text-slate">{topic.name}</span>
                  <span className={cn("size-1 rounded-full", SUBJECT_MARK[topic.subject])} />
                </div>
                <div className="flex divide-x divide-ash">
                  <div className="flex flex-col pr-4">
                    <span className="text-[6px] font-medium text-silver">Zadania</span>
                    <span className="text-[9px] font-medium text-slate">{topic.tasks}</span>
                  </div>
                  <div className="flex flex-col pl-4">
                    <span className="text-[6px] font-medium text-silver">Wynik</span>
                    <span className="text-[9px] font-medium text-slate">{topic.score}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Roadmapa nauki — the reference's link list: 52px rows, 8px apart.         */
/* ------------------------------------------------------------------------ */

/** Status reads from the icon in the circle; the badge carries only a number. */
const STEPS: Array<{ title: string; meta: string; status: IconComponent; badge: string }> = [
  { title: "Liczby rzeczywiste", meta: "8 lekcji", status: Check, badge: "100%" },
  { title: "Potęgi i pierwiastki", meta: "6 lekcji", status: CircleDashed, badge: "60%" },
  { title: "Równania", meta: "7 lekcji", status: Lock, badge: "0%" },
];

export function RoadmapPreview() {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden px-2", FADE_DOWN)}>
      <div className="flex flex-col gap-2 p-1">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="flex h-[52px] items-center gap-2 rounded-[9px] border-[0.75px] border-ash bg-white pl-[13px] pr-3"
          >
            <span className="grid size-[26px] shrink-0 place-items-center rounded-full border-[0.75px] border-ash bg-gradient-to-b from-transparent to-black/5 text-charcoal">
              <step.status className="size-3" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1 pl-0.5">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[10px] font-semibold text-charcoal">{step.title}</span>
                <BookOpen className="size-2.5 shrink-0 text-charcoal" strokeWidth={2} />
                <PencilLine className="size-2.5 shrink-0 text-charcoal" strokeWidth={2} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-fog">
                <CornerDownRight className="size-2.5 shrink-0 text-silver" strokeWidth={2} />
                <span className="truncate">{step.meta}</span>
              </div>
            </div>
            <span className="flex h-5 shrink-0 items-center rounded-md border-[0.75px] border-ash bg-white px-1.5 text-[8.8px] font-medium tabular-nums text-slate">
              {step.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Śledzenie postępów — the reference's analytics art: a rising line that    */
/* runs up beside the copy, over a stats card and a profile card.            */
/* ------------------------------------------------------------------------ */

/** The reference's own chart line, in its 339x168 viewBox. */
const CHART_PATH =
  "m345 1-60.533 76.487a8 8 0 0 1-9.732 2.25l-25.53-12.241a8 8 0 0 0-9.214 1.657l-62.736 64.993a8 8 0 0 1-6.695 2.388L67.303 124.331a8 8 0 0 0-5.193 1.17L-3.166 166.5";

const METRICS = [
  { label: "Zadania", value: "3 214", color: "#3b82f6" },
  { label: "Poprawne", value: "2 705", color: "#a855f7" },
  { label: "Opanowane", value: "38", color: "#14b8a6" },
];

const PROFILE_ROWS = [
  { label: "Arkusz próbny", value: "82%" },
  { label: "Gotowość", value: "76%" },
  { label: "Seria nauki", value: "34 dni" },
];

export function ProgressPreview({ color }: { color: string }) {
  return (
    // 170% tall and bottom-anchored, as in the reference, so the line climbs
    // past the top of the preview slot and up beside the description.
    <div aria-hidden className={cn("pointer-events-none absolute bottom-0 left-0 h-[170%] w-full overflow-hidden", FADE_DOWN)}>
      <div className="absolute bottom-0 left-0 size-full">
        <svg
          viewBox="0 0 339 168"
          fill="none"
          className="h-auto w-full [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        >
          <path stroke={color} strokeWidth={2} d={CHART_PATH} />
          <circle cx={259.333} cy={72} r={3} fill={color} />
          <circle cx={259.333} cy={72} r={4} stroke={color} strokeOpacity={0.3} strokeWidth={2} />
        </svg>

        <div className="absolute bottom-0 left-5 flex items-start gap-2">
          <div className="w-[172px] rounded-lg border border-ash bg-white">
            <div className="p-1.5">
              <div className="flex items-center gap-2 rounded border border-ash bg-canvas-muted p-2 text-xs font-medium leading-none text-charcoal">
                <Sigma className="size-3" strokeWidth={2} />
                Matematyka
              </div>
              <div className="mt-2 px-1.5 pb-0.5 text-[13px] font-medium text-charcoal">Marzec 2027</div>
            </div>
            <div className="flex flex-col gap-2 border-t border-ash p-3">
              {METRICS.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-sm border border-black/20 bg-current opacity-70"
                      style={{ color: metric.color }}
                    />
                    <span className="text-xs font-medium leading-none text-steel">{metric.label}</span>
                  </div>
                  <span className="text-xs leading-none text-charcoal">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 whitespace-nowrap rounded-lg border border-ash bg-white py-0.5">
              <div className="px-3 py-2.5">
                <div className="flex justify-between gap-2">
                  <span className="grid size-11 place-items-center rounded-full bg-paper-mist text-sm font-medium text-steel">
                    AW
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-charcoal">
                      <GraduationCap className="size-3.5" strokeWidth={1.8} />
                      Matura
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-charcoal">
                      {/* Polish flag, drawn: white over red. */}
                      <span className="flex h-2.5 w-3 flex-col overflow-hidden rounded-sm border-[0.5px] border-black/15">
                        <span className="flex-1 bg-white" />
                        <span className="flex-1 bg-[#dc143c]" />
                      </span>
                      PL
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-[13px] font-medium text-charcoal">Ala Wiśniewska</div>
                <div className="mt-px text-xs text-fog">ala@examax.app</div>
              </div>
              <div className="flex flex-col gap-2.5 border-t border-ash px-3 pb-2.5 pt-3">
                {PROFILE_ROWS.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-6 text-xs leading-none">
                    <span className="truncate font-medium text-fog">{row.label}</span>
                    <span className="text-charcoal">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Symulacja egzaminu — two exam sheets in A4's portrait proportion, narrow  */
/* and tall, tipped the same way and cropped by the card's bottom edge.      */
/* Their questions use the Roadmapa rows' style; the cursor rests on one.    */
/* ------------------------------------------------------------------------ */

/**
 * Two exam sheets, one per exam, each opened at a task: the paper's header
 * (exam, subject, the clock), a task with its points, the question as a
 * formula and the A–D answers. The Matura sheet is answered, the ósmoklasista
 * one is being answered — the cursor rests on B.
 */
const EXAM_SHEETS: Array<{
  mark: "matura" | "e8";
  exam: string;
  subject: string;
  time: string;
  task: string;
  formula: string;
  /** The ticked answer, or the one under the cursor. */
  answer: number;
  done: boolean;
}> = [
  {
    mark: "matura",
    exam: "Matura 2025",
    subject: "Matematyka · poziom podstawowy",
    time: "170:00",
    task: "Zadanie 1. (0–1)",
    formula: "2x + 3 = 11",
    answer: 2,
    done: true,
  },
  {
    mark: "e8",
    exam: "Ósmoklasista",
    subject: "Matematyka · 2025",
    time: "98:40",
    task: "Zadanie 4. (0–1)",
    formula: "¾ · 16 − 5",
    answer: 1,
    done: false,
  },
];

const OPTIONS = ["A", "B", "C", "D"];

/**
 * The Symulacja card's picture. The sheets bleed off the card's bottom edge
 * and hold still — nothing moves on hover. They end 20px from the card's
 * right edge, the same inset as the copy on its left.
 */
export function ExamSheetPreview() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-5 top-2.5 flex gap-3">
        {EXAM_SHEETS.map((sheet) => (
          <div
            key={sheet.exam}
            className="aspect-[1/1.414] w-[112px] rotate-6 rounded-[6px] border-[0.75px] border-ash bg-white px-2 py-1.5 shadow-sm"
          >
            <div className="flex items-center gap-1">
              {sheet.mark === "matura" ? <MaturaIcon className="h-2 w-2.5" /> : <E8Icon className="h-2 w-2.5" />}
              <span className="whitespace-nowrap text-[6.5px] font-semibold leading-none text-charcoal">{sheet.exam}</span>
              <span className="ml-auto font-geist-mono text-[5.5px] leading-none text-fog">{sheet.time}</span>
            </div>
            <p className="mt-1 text-[5px] leading-none text-fog">{sheet.subject}</p>
            <div className="mt-1.5 border-t-[0.75px] border-ash pt-1.5">
              <p className="text-[6px] font-semibold leading-none text-charcoal">{sheet.task}</p>
              <span className="mt-1 block h-[3px] w-full rounded-full bg-paper-mist" />
              <p className="mt-1.5 font-geist-mono text-[6.5px] leading-none text-charcoal">{sheet.formula}</p>
              <div className="relative mt-1.5 grid grid-cols-4 gap-1">
                {OPTIONS.map((option, index) => {
                  const picked = index === sheet.answer;
                  return (
                    <span
                      key={option}
                      className={cn(
                        "flex h-[13px] items-center justify-center gap-0.5 rounded-[4px] border-[0.75px] text-[5.5px] font-medium",
                        picked && sheet.done
                          ? "border-charcoal bg-charcoal text-white"
                          : picked
                            ? "border-smoke bg-paper-mist text-charcoal"
                            : "border-ash bg-white text-steel",
                      )}
                    >
                      {picked && sheet.done && <Check className="size-1.5" strokeWidth={3.5} />}
                      {option}
                    </span>
                  );
                })}
                {!sheet.done && (
                  <MousePointer2
                    className="absolute -bottom-2 size-3.5 fill-charcoal text-white drop-shadow-sm"
                    style={{ left: `calc(${(sheet.answer + 0.5) * 25}% + 1px)` }}
                    strokeWidth={1.5}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Agenci Examax — the team, huddled                                        */
/* ------------------------------------------------------------------------ */

/** Each face's size, the space between faces, and each step up the slope. */
const FACE = 40;
const GAP = 4;
const STEP = 12;

/** Left to right, climbing: the right-hand face is the peak. */
const LINEUP = ["circle", "cat", "clover"] as const;

/**
 * The Agent card's picture: three of the team spread along a slope that rises
 * steeply to the card's right edge, each a step higher than the one before. The faces are held
 * still in their resting pose, and nothing on the card moves on hover. The row
 * ends 20px from the card's right edge, the same inset as the copy on its left.
 */
export function AgentHuddle() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
      {LINEUP.map((type, i) => (
        <span
          key={type}
          className="relative"
          style={{ marginLeft: i === 0 ? 0 : GAP, translate: `0 ${(1 - i) * STEP}px` }}
        >
          <BotAvatar type={type} size={FACE} paused interactive={false} turn={0} />
        </span>
      ))}
    </div>
  );
}
