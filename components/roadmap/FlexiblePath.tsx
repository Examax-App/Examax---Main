"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Lightbulb,
  ListChecks,
  LockOpen,
  RefreshCcw,
  Shapes,
  Waypoints,
  Zap,
  Sigma,
  Languages,
  FileText,
  BookMarked,
} from "lucide-react";
import { SheetFlow, type FlowDestination, type Sheet } from "@/components/mockups/PlatformStage";
import { GridSection, SectionHeader } from "@/components/roadmap/sections";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * dub.co/links' "Scalable programmatic link management" band: a muted 300px
 * stage over three tabs, each tab's 1px rail filling in the accent while it
 * runs, then handing over to the next. Dub's stages are the API (endpoint
 * pills on a marquee), the SDKs (a code window with a language switch) and
 * webhooks (an event card between its app and a carousel of receivers).
 * Here they are the three ways a roadmap stays flexible: every node open,
 * a quiz instead of the lesson, and a plan that reacts to results.
 */

/** How long a tab runs before handing over. */
const TAB_MS = 8000;
/** The longest step the clock takes in one frame (a hidden tab must not skip). */
const MAX_STEP_MS = 100;

type Tab = { icon: IconComponent; title: string; description: string; cta: { label: string; href: string } };

const TABS: Tab[] = [
  {
    icon: LockOpen,
    title: "Każdy temat otwarty",
    description: "Kolejność to podpowiedź, nie zamek. Zaczynasz od czegokolwiek i przeskakujesz dalej, kiedy chcesz.",
    cta: { label: "Ułóż roadmapę", href: "/signup" },
  },
  {
    icon: ListChecks,
    title: "Quiz zamiast lekcji",
    description: "Znasz temat? Zrób sam quiz — dobry wynik zalicza temat bez przerabiania lekcji.",
    cta: { label: "Zobacz trening", href: "/training" },
  },
  {
    icon: RefreshCcw,
    title: "Plan reaguje na wyniki",
    description: "Słabszy quiz? Examax dokłada powtórkę i przesuwa resztę tygodnia, zanim zostaniesz w tyle.",
    cta: { label: "Poznaj Korepetytora AI", href: "/agents" },
  },
];

export function FlexiblePath() {
  const [active, setActive] = useState(0);
  const fills = useRef<Array<HTMLDivElement | null>>([]);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();

  // The rail: a frame clock writing straight to the fill, as the auth slider does.
  useEffect(() => {
    fills.current.forEach((fill) => fill?.style.setProperty("transform", "translateY(-100%)"));
    if (!inView || reduced) {
      fills.current[active]?.style.setProperty("transform", "translateY(0%)");
      return;
    }
    let progress = 0;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      progress = Math.min(1, progress + Math.min(now - last, MAX_STEP_MS) / TAB_MS);
      last = now;
      fills.current[active]?.style.setProperty("transform", `translateY(${(progress - 1) * 100}%)`);
      if (progress >= 1) {
        setActive((active + 1) % TABS.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, inView, reduced]);

  return (
    <GridSection id="flexible" labelledBy="flexible-heading" innerClassName="pb-10 pt-20">
      <SectionHeader
        id="flexible-heading"
        icon={Waypoints}
        eyebrow="Elastyczna ścieżka"
        title="Ty wybierasz, którędy idziesz"
        sub="Roadmapa podpowiada kolejność, ale nic w niej nie jest zamknięte. Przeskakujesz, wracasz i zmieniasz plan, kiedy chcesz."
      />
      <div ref={ref} className="mt-12 border-y border-ash bg-canvas-muted px-4 pb-10 pt-12">
        <div className="relative mx-auto h-[300px] max-w-screen-md overflow-hidden">
          {[<NodeMarquee key="nodes" />, <QuizWindow key="quiz" />, <PlanReaction key="react" />].map((stage, index) => (
            <div
              key={index}
              aria-hidden={index !== active}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-500",
                index === active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
              )}
            >
              {stage}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-screen-md grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3">
          {TABS.map(({ icon: Icon, title, description, cta }, index) => {
            const current = index === active;
            return (
              <div key={title} className={cn("relative flex flex-col pl-6 text-left text-sm text-charcoal transition-opacity duration-500", !current && "opacity-50 hover:opacity-70")}>
                <div aria-hidden className="absolute left-0 top-0 h-full w-px overflow-hidden bg-ash">
                  <div
                    ref={(node) => {
                      fills.current[index] = node;
                    }}
                    className={cn("size-full bg-electric-blue transition-opacity", !current && "opacity-0")}
                    style={{ transform: "translateY(-100%)" }}
                  />
                </div>
                <button type="button" onClick={() => setActive(index)} aria-pressed={current} className="flex cursor-pointer flex-col text-left focus:outline-none focus-visible:underline">
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                  <span className="mt-2 font-medium">{title}</span>
                  <span className="mt-3 text-fog">{description}</span>
                </button>
                <Link
                  href={cta.href}
                  tabIndex={current ? undefined : -1}
                  className={cn(
                    "group mt-4 inline-flex w-fit items-center text-sm font-medium transition-opacity duration-500",
                    current ? "text-electric-blue" : "pointer-events-none text-fog",
                  )}
                >
                  {cta.label}
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} aria-hidden />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </GridSection>
  );
}

/* ── Stage 1: every node open ────────────────────────────────────────────── */

const KINDS = {
  LEKCJA: "bg-blue-100 text-blue-600",
  QUIZ: "bg-green-100 text-green-600",
  POWTÓRKA: "bg-yellow-100 text-yellow-700",
  ARKUSZ: "bg-orange-100 text-orange-600",
  AI: "bg-violet-100 text-violet-600",
} as const;

type Kind = keyof typeof KINDS;

const ROWS: Array<Array<[Kind, string]>> = [
  [["LEKCJA", "Funkcja liniowa"], ["QUIZ", "Procenty"], ["POWTÓRKA", "Potęgi"], ["ARKUSZ", "Matura 2024"], ["AI", "Wyjaśnij błąd"]],
  [["QUIZ", "Ciągi"], ["LEKCJA", "Trygonometria"], ["QUIZ", "Prawdopodobieństwo"], ["POWTÓRKA", "Równania"], ["LEKCJA", "Planimetria"]],
  [["LEKCJA", "Lektury"], ["QUIZ", "Środki stylistyczne"], ["LEKCJA", "Rozprawka"], ["POWTÓRKA", "Epoki literackie"], ["AI", "Sprawdź tezę"]],
  [["QUIZ", "Past Simple"], ["LEKCJA", "Reported Speech"], ["POWTÓRKA", "Phrasal verbs"], ["ARKUSZ", "E8 2024"], ["QUIZ", "Słownictwo"]],
  [["AI", "Ułóż plan tygodnia"], ["LEKCJA", "Stereometria"], ["QUIZ", "Funkcja kwadratowa"], ["ARKUSZ", "Matura 2023"], ["POWTÓRKA", "Ułamki"]],
  [["POWTÓRKA", "Procenty"], ["LEKCJA", "Logarytmy"], ["QUIZ", "Statystyka"], ["AI", "Podobne zadanie"], ["LEKCJA", "Wielomiany"]],
  [["QUIZ", "Romantyzm"], ["LEKCJA", "Pozytywizm"], ["QUIZ", "Reading"], ["POWTÓRKA", "Lektury"], ["ARKUSZ", "E8 2023"]],
  [["LEKCJA", "Geometria"], ["QUIZ", "Równania"], ["POWTÓRKA", "Funkcje"], ["AI", "Wyjaśnij krok"], ["QUIZ", "Writing"]],
];

function NodePill({ kind, topic }: { kind: Kind; topic: string }) {
  return (
    <span className="flex select-none items-center gap-1.5 whitespace-nowrap rounded border border-ash bg-white px-2 py-1 font-geist-mono text-xs text-charcoal">
      <span className={cn("rounded-full px-2 py-0.5 leading-none", KINDS[kind])}>{kind}</span>
      {topic}
    </span>
  );
}

/** dub's endpoint wall: eight rows of pills, each row two identical runs scrolling their own width. */
function NodeMarquee() {
  return (
    <div className="flex size-full items-center [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]">
      <div className="flex flex-col gap-2">
        {ROWS.map((row, index) => (
          <div key={index} className="flex items-center" style={{ marginLeft: `${-((index * 97) % 240)}px` }}>
            {[0, 1, 2].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy > 0}
                className="motion-safe:animate-infinite-scroll flex min-w-max items-center gap-2 pl-2"
                style={{ "--scroll": "-100%", "--scroll-duration": "60s" } as React.CSSProperties}
              >
                {row.map(([kind, topic]) => (
                  <NodePill key={`${kind}-${topic}`} kind={kind} topic={topic} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stage 2: a quiz instead of the lesson ───────────────────────────────── */

const MODES: Array<{ key: string; label: string; icon: IconComponent }> = [
  { key: "lesson", label: "Lekcja", icon: BookOpen },
  { key: "quiz", label: "Quiz", icon: ListChecks },
  { key: "example", label: "Przykład", icon: Lightbulb },
  { key: "diagram", label: "Schemat", icon: Shapes },
];

/** dub's SDK window: a switch above a bare window, the content changing with the switch. */
function QuizWindow() {
  const [mode, setMode] = useState("quiz");
  const current = MODES.find((item) => item.key === mode) ?? MODES[1];
  return (
    <div className="flex size-full flex-col items-center [mask-image:linear-gradient(black_75%,transparent)]">
      <div className="flex rounded-full border border-ash bg-white p-1 shadow-subtle" role="tablist" aria-label="Część tematu">
        {MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              mode === key ? "bg-charcoal text-white" : "text-steel hover:text-charcoal",
            )}
          >
            <Icon className="size-3.5" strokeWidth={2} aria-hidden />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 w-full max-w-[520px] rounded-xl border border-ash bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-ash px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2.5 rounded-full border border-silver" />
            ))}
          </div>
          <span className="text-sm text-steel">Funkcja liniowa · {current.label}</span>
          <ArrowUpRight className="size-4 text-fog" strokeWidth={1.75} aria-hidden />
        </div>
        <div key={mode} className="animate-slide-up-fade px-6 py-5 text-sm" style={{ "--offset": "4px" } as React.CSSProperties}>
          {mode === "quiz" ? (
            <>
              <p className="text-xs text-fog">Pytanie 3 z 8</p>
              <p className="mt-1.5 text-charcoal">
                Wykres funkcji <span className="font-geist-mono">f(x) = 2x − 4</span> przecina oś OX w punkcie:
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 font-geist-mono text-[13px]">
                {["A. (0, −4)", "B. (2, 0)", "C. (−2, 0)", "D. (4, 0)"].map((option, index) => (
                  <span key={option} className={cn("rounded-md border px-3 py-1.5", index === 1 ? "border-green-300 bg-green-50 text-green-700" : "border-ash text-steel")}>
                    {option}
                  </span>
                ))}
              </div>
            </>
          ) : mode === "lesson" ? (
            <>
              <p className="font-medium text-charcoal">Czym jest funkcja liniowa?</p>
              <p className="mt-2 leading-relaxed text-steel">
                To funkcja postaci <span className="font-geist-mono">f(x) = ax + b</span>. Współczynnik <span className="font-geist-mono">a</span> mówi, jak stromo
                biegnie wykres, a <span className="font-geist-mono">b</span> — gdzie przecina oś OY.
              </p>
              <p className="mt-2 leading-relaxed text-steel">Gdy a &gt; 0, funkcja rośnie; gdy a &lt; 0 — maleje.</p>
            </>
          ) : mode === "example" ? (
            <>
              <p className="font-medium text-charcoal">Przykład 2 · miejsce zerowe</p>
              <ol className="mt-2 space-y-1.5 font-geist-mono text-[13px] text-steel">
                <li>1. 2x − 4 = 0</li>
                <li>2. 2x = 4</li>
                <li className="text-green-700">3. x = 2 → punkt (2, 0)</li>
              </ol>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <svg viewBox="0 0 120 80" className="h-20 w-auto text-charcoal" fill="none" aria-hidden>
                <path d="M6 60H114M40 4V76" stroke="currentColor" strokeOpacity="0.3" />
                <path d="M18 76L98 6" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="62" cy="38" r="3.5" fill="white" stroke="#2563eb" strokeWidth="2" />
              </svg>
              <p className="leading-relaxed text-steel">Jedna prosta, dwa punkty: przecięcie z osią OY i miejsce zerowe.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Stage 3: a plan that reacts ─────────────────────────────────────────── */

/*
 * The landing page's "Jak działa Examax" flow, reused as it is: results roll
 * through the carousel, the newest one passes through the card into Examax,
 * and fans out to the three things that reshape the week.
 * PLACEHOLDER DATA — illustrative results.
 */
const RESULTS: Sheet[] = [
  { exam: "matura", name: "Quiz · Procenty", detail: "Matura · wynik 45%", task: "Procenty → powtórka w czwartek", icon: Sigma },
  { exam: "e8", name: "Quiz · Ułamki", detail: "Ósmoklasista · wynik 92%", task: "Ułamki → temat zaliczony", icon: Sigma },
  { exam: "matura", name: "Lekcja · Ciągi", detail: "Matura · ukończona", task: "Ciągi → quiz w sobotę", icon: Sigma },
  { exam: "e8", name: "Quiz · Past Simple", detail: "Ósmoklasista · wynik 58%", task: "Past Simple → powtórka w piątek", icon: Languages },
  { exam: "matura", name: "Arkusz 2024", detail: "Matura · 31 z 50 pkt", task: "Funkcje → więcej czasu w tygodniu", icon: FileText },
  { exam: "e8", name: "Quiz · Lektury", detail: "Ósmoklasista · wynik 74%", task: "Lektury → przykłady w piątek", icon: BookMarked },
  { exam: "matura", name: "Quiz · Pochodne", detail: "Rozszerzona · wynik 40%", task: "Pochodne → lekcja od nowa", icon: Sigma },
  { exam: "matura", name: "Quiz · Reading", detail: "Matura · wynik 88%", task: "Reading → temat zaliczony", icon: Languages },
];

const RESHAPES: FlowDestination[] = [
  { label: "Powtórki", icon: RefreshCcw, tint: "text-electric-blue" },
  { label: "Korepetytor AI", icon: Zap, tint: "text-[#ca8a04]" },
  { label: "Kalendarz", icon: CalendarDays, tint: "text-lavender" },
];

function PlanReaction() {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="shrink-0 scale-[0.5] sm:scale-[0.8] md:scale-100">
        <SheetFlow items={RESULTS} badge="Nowy wynik" destinations={RESHAPES} />
      </div>
    </div>
  );
}
