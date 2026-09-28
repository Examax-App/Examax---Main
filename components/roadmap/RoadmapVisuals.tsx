import {
  CalendarDays,
  Check,
  ChevronRight,
  ListChecks,
  Milestone,
  RefreshCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The eight product fragments that sit in the /roadmap feature rows.
 *
 * Same discipline as the training page's: each one is a real slice of the
 * product's own UI — white card, 1px ash hairline, 12px radius, 11–14px
 * Inter — cropped by the frame it sits in, so it reads as a window onto a
 * working screen rather than an illustration of one.
 *
 * The state vocabulary is the landing page's roadmap showcase, unchanged:
 * green for a finished topic, blue for the one in progress, a dashed edge for
 * anything still locked.
 *
 * PLACEHOLDER DATA — topic names, counts and percentages are illustrative.
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

/* ── 1 · The whole syllabus, mapped ────────────────────────────────────── */

const requirements = [
  { code: "I", label: "Liczby i działania", topics: 12, done: true },
  { code: "II", label: "Ułamki i proporcje", topics: 9, done: true },
  { code: "III", label: "Procenty", topics: 6, done: false },
  { code: "IV", label: "Wyrażenia algebraiczne", topics: 8, done: false },
];

/** Every CKE requirement, broken into the topics that satisfy it. */
export function SyllabusVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Wymagania CKE · Matematyka E8</p>
          <ListChecks className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3">
          {requirements.map((row) => (
            <li
              key={row.code}
              className="flex items-center gap-2.5 border-b border-ash py-2.5 last:border-b-0"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-[5px] bg-paper-mist font-geist-mono text-[9px] font-medium text-steel">
                {row.code}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12px] text-charcoal">
                {row.label}
              </span>
              <span className="shrink-0 font-geist-mono text-[10px] text-fog tabular-nums">
                {row.topics} tematów
              </span>
              {row.done ? (
                <Check className="size-3 shrink-0 text-vivid-green" strokeWidth={3} />
              ) : (
                <span className="size-3 shrink-0" />
              )}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-center justify-between rounded-buttons bg-paper-mist px-3 py-2">
          <span className="text-[12px] font-medium text-charcoal">
            Cała podstawa
          </span>
          <span className="font-geist-mono text-[12px] font-medium text-electric-blue tabular-nums">
            63 tematy
          </span>
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 2 · Split into stages ─────────────────────────────────────────────── */

const stages = [
  { label: "Etap 1 · IX–XI", percent: 100, note: "zamknięty" },
  { label: "Etap 2 · XII–II", percent: 64, note: "w trakcie" },
  { label: "Etap 3 · III–V", percent: 0, note: "przed Tobą" },
];

/** The year split into stages, each with its own share of the material. */
export function StagesVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Plan roku · do maja 2027</p>
          <CalendarDays className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3.5 space-y-3.5">
          {stages.map((stage) => (
            <li key={stage.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-medium text-charcoal">
                  {stage.label}
                </span>
                <span className="font-geist-mono text-[10px] text-fog tabular-nums">
                  {stage.percent}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-mist">
                <span
                  className={cn(
                    "block h-full rounded-full",
                    stage.percent === 100 ? "bg-vivid-green" : "bg-electric-blue",
                  )}
                  style={{ width: `${stage.percent}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-fog">{stage.note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-3.5 rounded-buttons bg-soft-blue/70 px-3 py-2">
          <p className="text-[11px] font-medium text-electric-blue">
            38 tygodni do egzaminu · 4 tematy na tydzień
          </p>
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 4 · Status of every topic ─────────────────────────────────────────── */

const statuses = [
  { label: "Liczby i działania", state: "done" as const, meta: "opanowane" },
  { label: "Procenty", state: "active" as const, meta: "78%" },
  { label: "Ułamki", state: "review" as const, meta: "do powtórki" },
  { label: "Równania", state: "locked" as const, meta: "zablokowane" },
];

const statusChip = {
  done: "bg-soft-mint text-[#166534]",
  active: "bg-soft-blue text-electric-blue",
  review: "bg-soft-peach text-[#7c2d12]",
  locked: "bg-paper-mist text-silver",
};

/** Four states, and never any doubt which one a topic is in. */
export function StatusListVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Twoje tematy · 63</p>
          <Target className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3 space-y-2">
          {statuses.map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-2.5 rounded-cards border border-ash px-3 py-2.5"
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  row.state === "done" && "bg-vivid-green",
                  row.state === "active" && "bg-electric-blue",
                  row.state === "review" && "bg-tangerine",
                  row.state === "locked" && "bg-silver",
                )}
              />
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-charcoal">
                {row.label}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  statusChip[row.state],
                )}
              >
                {row.meta}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center gap-2 text-[10px] text-fog">
          <span className="h-1 flex-1 rounded-full bg-paper-mist">
            <span className="block h-full w-[38%] rounded-full bg-electric-blue" />
          </span>
          <span className="font-geist-mono tabular-nums">24 / 63</span>
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 5 · Mastery comes from answers ────────────────────────────────────── */

const attempts = [true, true, false, true, true, true, false, true, true, true, true, true];

/** The status is computed, not self-reported. */
export function MasteryFromAnswersVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Procenty · skąd 78%</p>
          <Sparkles className="size-3.5 text-silver" />
        </div>

        <p className="mt-3 text-[11px] text-fog">Ostatnie 12 odpowiedzi</p>
        <ul className="mt-2 flex gap-1.5">
          {attempts.map((ok, index) => (
            <li key={index} className="flex-1">
              <span
                className={cn(
                  "grid h-6 place-items-center rounded-[5px]",
                  ok ? "bg-soft-mint text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]",
                )}
              >
                {ok ? (
                  <Check className="size-2.5" strokeWidth={3} />
                ) : (
                  <X className="size-2.5" strokeWidth={3} />
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <p className={META}>Opanowanie tematu</p>
            <p className="font-geist-mono text-[14px] font-medium text-electric-blue tabular-nums">
              78%
            </p>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-mist">
            <span className="block h-full w-[78%] rounded-full bg-electric-blue" />
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-snug text-fog">
          Do „opanowane” brakuje dwóch poprawnych serii pod rząd.
        </p>
      </Pane>
    </Stage>
  );
}

/* ── 6 · Gaps surface on their own ─────────────────────────────────────── */

const gaps = [
  { topic: "Ułamki dziesiętne", reason: "3 błędy pod rząd" },
  { topic: "Proporcje", reason: "ostatnia powtórka 6 tygodni temu" },
  { topic: "Skala i plan", reason: "temat pominięty we wrześniu" },
];

/** What is quietly slipping, before it costs points. */
export function GapsVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Braki do nadrobienia</p>
          <span className="rounded-full bg-soft-peach px-2 py-0.5 text-[10px] font-medium text-[#7c2d12]">
            3 tematy
          </span>
        </div>

        <ul className="mt-3 space-y-2">
          {gaps.map((gap) => (
            <li
              key={gap.topic}
              className="rounded-cards border border-ash px-3 py-2.5"
            >
              <p className="text-[12px] font-medium text-charcoal">{gap.topic}</p>
              <p className="mt-0.5 text-[10.5px] text-fog">{gap.reason}</p>
            </li>
          ))}
        </ul>

        <span className="mt-3 block rounded-buttons bg-midnight-ink py-2 text-center text-[11px] font-medium text-white">
          Wpisz braki do planu
        </span>
      </Pane>
    </Stage>
  );
}

/* ── 7 · Move the date, the plan follows ───────────────────────────────── */

/** The plan is a function of the date, not a fixed list. */
export function DateShiftVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Termin egzaminu</p>
          <Milestone className="size-3.5 text-silver" />
        </div>

        {/* The near-black input edge is the reference's signature: inputs read
            as important rather than optional (DESIGN.md). */}
        <div className="mt-2 flex items-center gap-2 rounded-inputs border border-midnight-ink px-2.5 py-2">
          <CalendarDays className="size-3.5 shrink-0 text-steel" />
          <span className="font-geist-mono text-[12px] text-charcoal">
            11.05.2027
          </span>
          <span className="ml-auto font-geist-mono text-[10px] text-fog tabular-nums">
            266 dni
          </span>
        </div>

        <p className="mt-3.5 text-[11px] text-fog">Plan przeliczony</p>
        <ul className="mt-2 space-y-2">
          {[
            { label: "Tematów na tydzień", from: "3", to: "4" },
            { label: "Etap 2 kończy się", from: "28 lut", to: "14 lut" },
            { label: "Zapas na powtórki", from: "3 tyg.", to: "2 tyg." },
          ].map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-2 rounded-cards border border-ash px-3 py-2 text-[11.5px]"
            >
              <span className="min-w-0 flex-1 truncate text-steel">
                {row.label}
              </span>
              <span className="shrink-0 font-geist-mono text-[10.5px] text-silver line-through">
                {row.from}
              </span>
              <ChevronRight className="size-3 shrink-0 text-silver" />
              <span className="shrink-0 font-geist-mono text-[10.5px] font-medium text-electric-blue">
                {row.to}
              </span>
            </li>
          ))}
        </ul>
      </Pane>
    </Stage>
  );
}

/* ── 8 · Weak topics get more room ─────────────────────────────────────── */

const allocation = [
  { label: "Procenty", slots: 4, weak: true },
  { label: "Ułamki", slots: 3, weak: true },
  { label: "Liczby", slots: 1, weak: false },
  { label: "Skala", slots: 2, weak: false },
];

/** The week is redistributed toward what is not working. */
export function WeightingVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Ten tydzień · 10 slotów</p>
          <Target className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3.5 space-y-3">
          {allocation.map((row) => (
            <li key={row.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-[11.5px] font-medium text-charcoal">
                  {row.label}
                </span>
                {row.weak ? (
                  <span className="rounded-full bg-soft-peach px-1.5 py-0.5 text-[9px] font-medium text-[#7c2d12]">
                    słaby punkt
                  </span>
                ) : null}
              </div>
              <div className="mt-1.5 flex gap-1">
                {[0, 1, 2, 3].map((slot) => (
                  <span
                    key={slot}
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      slot < row.slots
                        ? row.weak
                          ? "bg-electric-blue"
                          : "bg-smoke"
                        : "bg-paper-mist",
                    )}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-3.5 text-[11px] leading-snug text-fog">
          Tematy, na których tracisz punkty, dostają więcej miejsca w tygodniu.
        </p>
      </Pane>
    </Stage>
  );
}

/* ── 9 · Reviews slot themselves in ────────────────────────────────────── */

const weekPlan = [
  { day: "Pn", label: "Procenty · lekcja", kind: "new" as const },
  { day: "Wt", label: "Procenty · quiz", kind: "new" as const },
  { day: "Śr", label: "Ułamki · powtórka", kind: "review" as const },
  { day: "Cz", label: "Procenty · arkusz", kind: "new" as const },
];

/** Old material comes back on its own, in the gaps. */
export function ReviewInjectVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Tydzień 14 · marzec</p>
          <RefreshCcw className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3 space-y-2">
          {weekPlan.map((row) => (
            <li
              key={row.day}
              className={cn(
                "flex items-center gap-2.5 rounded-cards border px-3 py-2.5",
                row.kind === "review"
                  ? "border-electric-blue/40 bg-soft-blue/40"
                  : "border-ash",
              )}
            >
              <span className="w-6 shrink-0 font-geist-mono text-[10px] text-fog">
                {row.day}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-charcoal">
                {row.label}
              </span>
              {row.kind === "review" ? (
                <RefreshCcw className="size-3 shrink-0 text-electric-blue" />
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-[11px] leading-snug text-fog">
          Powtórka wchodzi w środę — akurat wtedy, kiedy ułamki zaczęłyby
          wypadać z głowy.
        </p>
      </Pane>
    </Stage>
  );
}
