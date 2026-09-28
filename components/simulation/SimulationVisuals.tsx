import {
  AlarmClock,
  BadgeCheck,
  Check,
  Flag,
  Gauge,
  NotebookPen,
  Route,
  TrendingDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The eight product fragments that sit in the /simulation feature rows.
 *
 * Same discipline as the other two product pages': each one is a real slice of
 * the product's own UI — white card, 1px ash hairline, 12px radius, 11–14px
 * Inter — cropped by the frame it sits in, so it reads as a window onto a
 * working screen rather than an illustration of one.
 *
 * The vocabulary is the one the hero film's old simulation beat used:
 * tangerine for the run itself, green and red for a graded task, points
 * counted as the student works rather than at the end.
 *
 * PLACEHOLDER DATA — sheet contents and scores are illustrative.
 */

/** A product card inset in its frame, cropped by the frame's bottom edge. */
function Pane({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-5 top-5 rounded-cards border border-ash bg-white shadow-subtle",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Every fragment's outer positioning context. */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full" aria-hidden>
      {children}
    </div>
  );
}

/** The 11px muted caption used for every fragment's header row. */
const META = "text-[11px] font-medium text-fog";

/* ── 1 · The sheet, as it is printed ───────────────────────────────────── */

/** The arkusz cover and its first task — same layout as the paper. */
export function SheetFormatVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <p className="font-geist-mono text-[9px] uppercase tracking-[0.14em] text-fog">
          Arkusz egzaminacyjny
        </p>
        <p className="mt-1.5 font-satoshi text-body-lg font-bold tracking-tight text-charcoal">
          Matematyka
        </p>
        <p className="font-geist-mono text-[10.5px] text-steel">
          Egzamin ósmoklasisty · maj 2024
        </p>

        <div className="mt-3 flex gap-1.5">
          {["100 minut", "25 punktów", "19 zadań"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-ash px-2 py-0.5 font-geist-mono text-[9.5px] text-steel"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-3.5 border-t border-ash pt-3">
          <div className="flex items-start justify-between">
            <p className="text-[12px] font-semibold text-charcoal">
              Zadanie 1. <span className="font-normal text-fog">(0–1)</span>
            </p>
            <Flag className="size-3 text-silver" />
          </div>
          <p className="mt-1.5 text-[11.5px] leading-snug text-steel">
            Cena biletu wynosiła 40 zł i wzrosła o 20%. Dokończ zdanie —
            wybierz odpowiedź spośród A–D.
          </p>
          <div className="mt-2.5 space-y-1.5">
            {["A. 42 zł", "B. 48 zł", "C. 52 zł"].map((option) => (
              <div
                key={option}
                className="rounded-buttons border border-ash px-2.5 py-1.5 text-[11.5px] text-steel"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 2 · The clock ─────────────────────────────────────────────────────── */

const rules = [
  { label: "Czas liczony jak na sali", ok: true },
  { label: "Brudnopis pod ręką", ok: true },
  { label: "Bez pauzy i bez podpowiedzi", ok: true },
  { label: "Wyjście kończy arkusz", ok: false },
];

/** The clock, and the rules that come with it. */
export function ExamClockVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Arkusz na czas</p>
          <AlarmClock className="size-3.5 text-silver" />
        </div>

        <p className="mt-3 text-center font-geist-mono text-[34px] leading-none tracking-tight text-charcoal tabular-nums">
          48:12
        </p>
        <p className="mt-1.5 text-center text-[10.5px] text-fog">
          pozostało ze 100 minut
        </p>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-mist">
          <span className="block h-full w-[52%] rounded-full bg-tangerine" />
        </div>

        <ul className="mt-3.5 space-y-2">
          {rules.map((rule) => (
            <li key={rule.label} className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full",
                  rule.ok
                    ? "bg-soft-mint text-[#166534]"
                    : "bg-[#fee2e2] text-[#991b1b]",
                )}
              >
                {rule.ok ? (
                  <Check className="size-2.5" strokeWidth={3} />
                ) : (
                  <X className="size-2.5" strokeWidth={3} />
                )}
              </span>
              <span className="text-[11.5px] text-steel">{rule.label}</span>
            </li>
          ))}
        </ul>
      </Pane>
    </Stage>
  );
}

/* ── 3 · Room to work ──────────────────────────────────────────────────── */

/** An open task with the workspace the paper version gives you. */
export function WorkspaceVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Zadanie 17 · (0–3)</p>
          <NotebookPen className="size-3.5 text-silver" />
        </div>

        <p className="mt-2 text-[11.5px] font-medium leading-snug text-charcoal">
          Oblicz pole powierzchni ostrosłupa prawidłowego czworokątnego o
          krawędzi podstawy 6 cm.
        </p>

        <p className={cn("mt-3", META)}>Brudnopis</p>
        <div className="mt-1.5 rounded-inputs border border-midnight-ink p-2.5">
          <p className="font-geist-mono text-[11px] leading-relaxed text-charcoal">
            P<sub>p</sub> = 6 · 6 = 36
            <br />
            h = √(5² − 3²) = 4
            <br />
            P<sub>b</sub> = 4 · ½ · 6 · 4 = 48
          </p>
          <span className="mt-1 block h-3 w-px bg-charcoal" />
        </div>

        <div className="mt-3 flex items-center justify-between rounded-buttons bg-paper-mist px-3 py-2">
          <span className="text-[11px] text-steel">Zapisane automatycznie</span>
          <span className="font-geist-mono text-[10px] text-fog">14:02</span>
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 4 · Graded as you go ──────────────────────────────────────────────── */

const graded = [
  { label: "Zadanie 12 · Procenty", state: "correct" as const, points: "+1" },
  { label: "Zadanie 13 · Wyrażenia", state: "wrong" as const, points: "0" },
  { label: "Zadanie 14 · Równania", state: "current" as const, points: "—" },
];

/** Points bank as the sheet goes, not after it. */
export function LiveScoreVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Ocena na bieżąco</p>
          <span className="font-geist-mono text-[10px] text-fog tabular-nums">
            14 / 25 zadań
          </span>
        </div>

        <ul className="mt-3 space-y-2">
          {graded.map((task) => (
            <li
              key={task.label}
              className="flex items-center gap-2.5 rounded-cards bg-canvas-muted px-3 py-2"
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full",
                  task.state === "correct" && "bg-vivid-green text-white",
                  task.state === "wrong" && "bg-[#ef4444] text-white",
                  task.state === "current" && "border border-smoke bg-white",
                )}
              >
                {task.state === "correct" ? (
                  <Check className="size-2.5" strokeWidth={3} />
                ) : task.state === "wrong" ? (
                  <X className="size-2.5" strokeWidth={3} />
                ) : (
                  <span className="size-1.5 rounded-full bg-tangerine" />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-charcoal">
                {task.label}
              </span>
              <span className="shrink-0 font-geist-mono text-[10px] text-fog">
                {task.points}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {[
            { label: "Punkty", value: "11 / 25" },
            { label: "Tempo", value: "1:54" },
          ].map((tile) => (
            <div key={tile.label} className="rounded-cards border border-ash p-2.5">
              <p className="text-[10px] text-fog">{tile.label}</p>
              <p className="mt-1 font-geist-mono text-[13px] font-medium leading-none text-charcoal tabular-nums">
                {tile.value}
              </p>
            </div>
          ))}
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 5 · Points per criterion ──────────────────────────────────────────── */

const criteria = [
  { label: "Poprawna metoda", points: "1 / 1", ok: true },
  { label: "Obliczenia bez błędu", points: "1 / 1", ok: true },
  { label: "Odpowiedź z jednostką", points: "0 / 1", ok: false },
];

/** Open tasks scored the way an examiner scores them. */
export function RubricPointsVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Zadanie 17 · zasady oceniania</p>
          <BadgeCheck className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3">
          {criteria.map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-2.5 border-b border-ash py-2.5 last:border-b-0"
            >
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full",
                  row.ok
                    ? "bg-soft-mint text-[#166534]"
                    : "bg-[#fee2e2] text-[#991b1b]",
                )}
              >
                {row.ok ? (
                  <Check className="size-2.5" strokeWidth={3} />
                ) : (
                  <X className="size-2.5" strokeWidth={3} />
                )}
              </span>
              <span className="text-[11.5px] text-charcoal">{row.label}</span>
              <span className="ml-auto font-geist-mono text-[10.5px] text-steel tabular-nums">
                {row.points}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-center justify-between rounded-buttons bg-paper-mist px-3 py-2">
          <span className="text-[11.5px] font-medium text-charcoal">Razem</span>
          <span className="font-geist-mono text-[12.5px] font-medium text-tangerine tabular-nums">
            2 / 3 pkt
          </span>
        </div>

        <p className="mt-2.5 text-[10.5px] leading-snug text-fog">
          Na arkuszu ten sam brak jednostki kosztowałby dokładnie tyle samo.
        </p>
      </Pane>
    </Stage>
  );
}

/* ── 7 · The readiness report ──────────────────────────────────────────── */

const subjects = [
  { label: "Matematyka", value: 82 },
  { label: "Język polski", value: 71 },
  { label: "Język angielski", value: 73 },
];

/** One number for "am I ready", and the three behind it. */
export function ReadinessVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Raport gotowości</p>
          <Gauge className="size-3.5 text-silver" />
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-geist-mono text-[34px] leading-none tracking-tight text-tangerine tabular-nums">
            78
          </span>
          <span className="text-[11px] text-fog">/ 100 gotowości</span>
        </div>
        <p className="mt-1.5 text-[10.5px] text-fog">
          +4 względem poprzedniego arkusza
        </p>

        <ul className="mt-3.5 space-y-2.5">
          {subjects.map((subject) => (
            <li key={subject.label} className="flex items-center gap-2.5">
              <span className="w-24 shrink-0 truncate text-[11px] text-steel">
                {subject.label}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-mist">
                <span
                  className="block h-full rounded-full bg-tangerine"
                  style={{ width: `${subject.value}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-geist-mono text-[10px] text-fog tabular-nums">
                {subject.value}%
              </span>
            </li>
          ))}
        </ul>
      </Pane>
    </Stage>
  );
}

/* ── 8 · Where the points went ─────────────────────────────────────────── */

const losses = [
  { topic: "Stereometria", lost: 4, reason: "trzy zadania bez odpowiedzi" },
  { topic: "Procenty", lost: 2, reason: "błąd w drugim kroku" },
  { topic: "Statystyka", lost: 1, reason: "brak jednostki" },
];

/** The seven points that did not happen, and why. */
export function LostPointsVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Stracone punkty · 7</p>
          <TrendingDown className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3 space-y-2">
          {losses.map((loss) => (
            <li
              key={loss.topic}
              className="flex items-start gap-2.5 rounded-cards border border-ash px-3 py-2.5"
            >
              <span className="mt-0.5 shrink-0 rounded-full bg-[#fee2e2] px-1.5 py-0.5 font-geist-mono text-[9.5px] font-medium text-[#991b1b]">
                −{loss.lost}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11.5px] font-medium text-charcoal">
                  {loss.topic}
                </span>
                <span className="block truncate text-[10.5px] text-fog">
                  {loss.reason}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-[10.5px] leading-snug text-fog">
          Cztery z siedmiu punktów przepadły przez czas, nie przez brak wiedzy.
        </p>
      </Pane>
    </Stage>
  );
}

/* ── 9 · Straight back into the plan ───────────────────────────────────── */

const queued = [
  { label: "Stereometria", meta: "wpisane na poniedziałek" },
  { label: "Tempo · zadania otwarte", meta: "seria na czas, środa" },
  { label: "Procenty", meta: "powtórka, piątek" },
];

/** The report is not a PDF — it is next week's plan. */
export function PlanBackVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Po arkuszu · roadmapa</p>
          <Route className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3 space-y-2">
          {queued.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2.5 rounded-cards border border-ash px-3 py-2.5"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-electric-blue bg-white">
                <span className="size-1.5 rounded-full bg-electric-blue" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11.5px] font-medium text-charcoal">
                  {item.label}
                </span>
                <span className="block truncate text-[10.5px] text-fog">
                  {item.meta}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-buttons bg-soft-blue/70 px-3 py-2">
          <p className="text-[10.5px] font-medium leading-snug text-electric-blue">
            Trzy tematy wpisane do planu na przyszły tydzień
          </p>
        </div>
      </Pane>
    </Stage>
  );
}
