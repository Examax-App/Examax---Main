import {
  BadgeCheck,
  Check,
  Clock,
  Flag,
  History,
  Route,
  Sparkles,
  X,
} from "lucide-react";
import { AgentIcon } from "@/components/ui/AgentIcon";
import { cn } from "@/lib/cn";

/**
 * The nine product fragments that sit in the /training feature trios.
 *
 * They are deliberately *fragments*, not diagrams: each one is a real slice of
 * the product's own UI, built from the same vocabulary as the app shell —
 * white card, 1px ash hairline, 12px radius, 11–14px Inter — and cropped by
 * the frame it sits in. That crop is the reference's own trick (see the payout
 * list in `DesignRules/ExporttoFigma _ dub.co _ Dub Partners …png`): a panel
 * that runs off the bottom edge reads as a window onto a working screen, where
 * a panel that fits neatly inside reads as an illustration of one.
 *
 * All of them are static and server-rendered. The one moving visual on the
 * page is the timed run (components/training/TimedRun), which owns a clock.
 *
 * PLACEHOLDER DATA — topics, counts and percentages are illustrative. The
 * question is the same one the landing page's practice showcase uses, so the
 * two surfaces tell one story rather than two.
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

/* ── 1 · Matching ──────────────────────────────────────────────────────── */

const choices = [
  { key: "A", label: "42 zł" },
  { key: "B", label: "48 zł" },
  { key: "C", label: "52 zł" },
  { key: "D", label: "56 zł" },
];

/** A question straight off an arkusz, mid-answer. */
export function SheetTaskVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Arkusz CKE 2024 · Zadanie 14</p>
          <Flag className="size-3.5 text-silver" />
        </div>
        <p className="mt-2 text-[13px] font-medium leading-snug text-charcoal">
          Cena biletu wynosiła 40 zł, a następnie wzrosła o 20%. Ile kosztuje
          bilet po podwyżce?
        </p>
        <ul className="mt-3 space-y-1.5">
          {choices.map((choice) => {
            const picked = choice.key === "B";
            return (
              <li
                key={choice.key}
                className={cn(
                  "flex items-center gap-2.5 rounded-buttons border px-2.5 py-1.5 text-[12px]",
                  picked
                    ? "border-charcoal bg-paper-mist font-medium text-charcoal"
                    : "border-ash text-steel",
                )}
              >
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full border text-[9px] font-semibold",
                    picked
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-smoke text-fog",
                  )}
                >
                  {picked ? <Check className="size-2.5" /> : choice.key}
                </span>
                {choice.label}
              </li>
            );
          })}
        </ul>
      </Pane>
    </Stage>
  );
}

/* ── 2 · Quiz builder ──────────────────────────────────────────────────── */

const levels = [
  { label: "Podstawowy", className: "bg-[#86efac]" },
  { label: "Średni", className: "bg-[#fde047]" },
  { label: "Trudny", className: "bg-[#fdba74]" },
  { label: "Egzaminacyjny", className: "bg-[#f87171]" },
];

/** The quiz generator, configured and one click from running. */
export function QuizBuilderVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <p className="text-[13px] font-semibold text-charcoal">Nowy quiz</p>

        <p className={cn("mt-3", META)}>Temat</p>
        {/* The near-black input edge is the reference's signature: inputs
            read as important rather than optional (DESIGN.md). */}
        <div className="mt-1 rounded-inputs border border-midnight-ink px-2.5 py-1.5 text-[12px] font-medium text-charcoal">
          Procenty — Matematyka E8
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className={META}>Liczba zadań</p>
          <div className="flex items-center gap-1.5 rounded-buttons border border-ash px-2 py-1 font-geist-mono text-[11px] text-charcoal">
            20
          </div>
        </div>

        <p className={cn("mt-3", META)}>Poziom trudności</p>
        <div className="mt-1.5 flex items-center gap-2">
          {levels.map((level, index) => (
            <span
              key={level.label}
              className={cn(
                "grid size-5 place-items-center rounded-full",
                level.className,
                index === 2 && "ring-2 ring-charcoal ring-offset-2",
              )}
            >
              {index === 2 ? <Check className="size-3 text-charcoal" /> : null}
            </span>
          ))}
        </div>

        <span className="mt-4 block rounded-buttons bg-midnight-ink py-2 text-center text-[12px] font-medium text-white">
          Wygeneruj 20 zadań
        </span>
      </Pane>
    </Stage>
  );
}

/* ── 3 · Spaced review ─────────────────────────────────────────────────── */

const week = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

const dueTopics = [
  { topic: "Procenty", when: "dziś", due: true },
  { topic: "Wyrażenia algebraiczne", when: "za 3 dni", due: false },
  { topic: "Geometria płaska", when: "za 6 dni", due: false },
];

/** The review queue: what comes back, and when. */
export function SpacedReviewVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Powtórki · marzec</p>
          <History className="size-3.5 text-silver" />
        </div>

        <div className="mt-3 flex gap-1.5">
          {week.map((day, index) => (
            <div key={day} className="flex-1">
              <p className="text-center text-[9px] text-silver">{day}</p>
              <span
                className={cn(
                  "mt-1 block h-6 rounded-[5px]",
                  index < 4 && "bg-soft-mint",
                  index === 4 && "bg-vivid-green",
                  index > 4 && "border border-dashed border-smoke",
                )}
              />
            </div>
          ))}
        </div>

        <ul className="mt-3 border-t border-ash">
          {dueTopics.map((row) => (
            <li
              key={row.topic}
              className="flex items-center justify-between gap-3 border-b border-ash py-2 last:border-b-0"
            >
              <span className="truncate text-[12px] font-medium text-charcoal">
                {row.topic}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  row.due
                    ? "bg-soft-mint text-[#166534]"
                    : "bg-paper-mist text-fog",
                )}
              >
                {row.when}
              </span>
            </li>
          ))}
        </ul>
      </Pane>
    </Stage>
  );
}

/* ── 4 · Instant feedback ──────────────────────────────────────────────── */

/** The moment after an answer lands: verdict, points, elapsed time. */
export function InstantScoreVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Zadanie 14 z 19</p>
          <span className="inline-flex items-center gap-1 font-geist-mono text-[10px] text-fog">
            <Clock className="size-3" />
            0,4 s
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-buttons border border-vivid-green bg-soft-mint/60 px-3 py-2.5">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-vivid-green text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span className="text-[12px] font-medium text-[#166534]">
            48 zł — poprawnie
          </span>
          <span className="ml-auto rounded-full bg-white px-2 py-0.5 font-geist-mono text-[10px] font-medium text-[#166534]">
            +1 pkt
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <p className={META}>Wynik serii</p>
            <p className="font-geist-mono text-[13px] font-medium text-charcoal tabular-nums">
              12 / 14
            </p>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-mist">
            <span className="block h-full w-[86%] rounded-full bg-vivid-green" />
          </div>
        </div>

        <ul className="mt-3 space-y-1.5">
          {[
            { label: "Zadanie 13 · Procenty", ok: true },
            { label: "Zadanie 12 · Procenty", ok: false },
          ].map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-2 rounded-buttons border border-ash px-2.5 py-1.5 text-[11px] text-steel"
            >
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full",
                  row.ok ? "bg-soft-mint text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]",
                )}
              >
                {row.ok ? <Check className="size-2.5" /> : <X className="size-2.5" />}
              </span>
              {row.label}
            </li>
          ))}
        </ul>
      </Pane>
    </Stage>
  );
}

/* ── 5 · CKE marking scheme ────────────────────────────────────────────── */

const criteria = [
  { label: "Poprawna metoda", points: "1 / 1", ok: true },
  { label: "Obliczenia bez błędu", points: "1 / 1", ok: true },
  { label: "Odpowiedź z jednostką", points: "0 / 1", ok: false },
];

/** The marking scheme, criterion by criterion — the same one an examiner uses. */
export function RubricVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Zasady oceniania · CKE</p>
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
              <span className="text-[12px] text-charcoal">{row.label}</span>
              <span className="ml-auto font-geist-mono text-[11px] text-steel tabular-nums">
                {row.points}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-center justify-between rounded-buttons bg-paper-mist px-3 py-2">
          <span className="text-[12px] font-medium text-charcoal">Razem</span>
          <span className="font-geist-mono text-[13px] font-medium text-electric-blue tabular-nums">
            2 / 3 pkt
          </span>
        </div>

        <p className="mt-2.5 text-[11px] leading-snug text-fog">
          Brakuje jednostki w odpowiedzi — na arkuszu to jeden punkt mniej.
        </p>
      </Pane>
    </Stage>
  );
}

/* ── 6 · Agent ─────────────────────────────────────────────────────────── */

/** The agent unpicking the error, in the student's own words. */
export function AgentExplainVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center gap-2">
          <AgentIcon className="size-5" />
          <p className="text-[12px] font-semibold text-charcoal">
            Agent Examax
          </p>
        </div>

        <div className="mt-3 flex justify-end">
          <p className="max-w-[80%] rounded-cards rounded-br-[4px] bg-paper-mist px-3 py-2 text-[11.5px] leading-snug text-charcoal">
            Dlaczego 48, a nie 52?
          </p>
        </div>

        <div className="mt-2 max-w-[88%] rounded-cards rounded-bl-[4px] border border-ash px-3 py-2">
          <p className="text-[11.5px] leading-snug text-steel">
            Podwyżka o 20% to nie „plus 20 zł”. Liczysz 20% z ceny wyjściowej:
          </p>
          <p className="mt-1.5 rounded-inputs bg-canvas-muted px-2 py-1 font-geist-mono text-[11px] text-charcoal">
            40 + 0,20 · 40 = 48
          </p>
        </div>

        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-ash px-2.5 py-1 text-[10.5px] font-medium text-charcoal">
          <Sparkles className="size-3 text-lavender" />
          Przećwicz 5 podobnych zadań
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 7 · Roadmap sync ──────────────────────────────────────────────────── */

const roadmapRows = [
  { label: "Liczby i działania", state: "done" as const, meta: "opanowane" },
  { label: "Procenty", state: "current" as const, meta: "78%" },
  { label: "Wyrażenia algebraiczne", state: "next" as const, meta: "do zrobienia" },
  { label: "Równania", state: "next" as const, meta: "do zrobienia" },
];

/** Every answer lands back on the roadmap. */
export function RoadmapSyncVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Roadmapa · Matematyka E8</p>
          <Route className="size-3.5 text-silver" />
        </div>

        <ul className="mt-3 space-y-2">
          {roadmapRows.map((row) => (
            <li key={row.label} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full border",
                  row.state === "done" &&
                    "border-electric-blue bg-electric-blue text-white",
                  row.state === "current" &&
                    "border-electric-blue bg-white text-electric-blue",
                  row.state === "next" && "border-smoke bg-white",
                )}
              >
                {row.state === "done" ? (
                  <Check className="size-2.5" strokeWidth={3} />
                ) : row.state === "current" ? (
                  <span className="size-1.5 rounded-full bg-electric-blue" />
                ) : null}
              </span>
              <span
                className={cn(
                  "truncate text-[12px]",
                  row.state === "next"
                    ? "text-fog"
                    : "font-medium text-charcoal",
                )}
              >
                {row.label}
              </span>
              <span className="ml-auto shrink-0 font-geist-mono text-[10px] text-fog">
                {row.meta}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3.5 rounded-buttons bg-soft-blue/70 px-3 py-2">
          <p className="text-[11px] font-medium leading-snug text-electric-blue">
            +2 tematy opanowane w tym tygodniu
          </p>
        </div>
      </Pane>
    </Stage>
  );
}

/* ── 8 · Mastery over time ─────────────────────────────────────────────── */

const MASTERY_LINE =
  "M0 92 C24 90 40 82 62 78 S104 74 124 62 S166 50 188 44 S224 34 248 18";

const topicBars = [
  { label: "Procenty", value: 84 },
  { label: "Równania", value: 61 },
  { label: "Geometria", value: 47 },
];

/** Mastery climbing, topic by topic. */
export function MasteryChartVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-baseline justify-between">
          <p className={META}>Opanowanie · 90 dni</p>
          <p className="font-geist-mono text-[15px] font-medium text-lavender tabular-nums">
            76%
          </p>
        </div>

        <svg
          viewBox="0 0 248 100"
          preserveAspectRatio="none"
          className="mt-2 h-16 w-full"
        >
          <defs>
            <linearGradient id="mastery-fill" x1="0" y1="0" x2="0" y2="100">
              <stop offset="0" stopColor="#7c3aed" stopOpacity="0.18" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[16, 44, 72].map((y) => (
            <line
              key={y}
              x1="0"
              x2="248"
              y1={y}
              y2={y}
              stroke="#e5e5e5"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          ))}
          <path d={`${MASTERY_LINE} L248 100 L0 100 Z`} fill="url(#mastery-fill)" />
          <path
            d={MASTERY_LINE}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <ul className="mt-2 space-y-2">
          {topicBars.map((bar) => (
            <li key={bar.label} className="flex items-center gap-2.5">
              <span className="w-20 shrink-0 truncate text-[11px] text-steel">
                {bar.label}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-mist">
                <span
                  className="block h-full rounded-full bg-lavender"
                  style={{ width: `${bar.value}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-geist-mono text-[10px] text-fog tabular-nums">
                {bar.value}%
              </span>
            </li>
          ))}
        </ul>
      </Pane>
    </Stage>
  );
}

/* ── 9 · Flagged tasks ─────────────────────────────────────────────────── */

const flagged = [
  { task: "Zadanie 14", sheet: "CKE 2024 · Procenty" },
  { task: "Zadanie 6", sheet: "CKE 2023 · Geometria" },
  { task: "Zadanie 21", sheet: "CKE 2022 · Funkcje" },
];

/** Everything you flagged, waiting where you left it. */
export function FlaggedVisual() {
  return (
    <Stage>
      <Pane className="p-4">
        <div className="flex items-center justify-between">
          <p className={META}>Oflagowane · 3</p>
          <Flag className="size-3.5 text-deep-sapphire" />
        </div>

        <ul className="mt-3 space-y-2">
          {flagged.map((row) => (
            <li
              key={row.task}
              className="flex items-center gap-2.5 rounded-cards border border-ash px-3 py-2.5"
            >
              <Flag className="size-3.5 shrink-0 text-deep-sapphire" />
              <span className="min-w-0">
                <span className="block text-[12px] font-medium text-charcoal">
                  {row.task}
                </span>
                <span className="block truncate text-[10.5px] text-fog">
                  {row.sheet}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <span className="mt-3 block rounded-buttons border border-ash bg-white py-1.5 text-center text-[11px] font-medium text-charcoal shadow-subtle">
          Wróć do oflagowanych
        </span>
      </Pane>
    </Stage>
  );
}
