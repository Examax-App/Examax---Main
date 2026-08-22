"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Bot,
  Check,
  CircleAlert,
  Compass,
  FileText,
  FolderOpen,
  Home,
  PencilLine,
  RefreshCcw,
  Route,
  Search,
  Send,
  Settings,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Sparkline } from "@/components/ui/Sparkline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

export type HeroView = "roadmap" | "practice" | "agent" | "analytics";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  badge?: string;
};

const sidebarGroups: Array<{ heading: string | null; items: SidebarItem[] }> = [
  {
    heading: null,
    items: [
      { label: "Start", icon: Home },
      { label: "Roadmapa", icon: Route },
      { label: "Trening", icon: PencilLine },
      { label: "Arkusze", icon: FileText, badge: "3" },
      { label: "Agent", icon: Bot },
    ],
  },
  {
    heading: "Analiza",
    items: [
      { label: "Postępy", icon: BarChart3 },
      { label: "Błędy", icon: CircleAlert, badge: "7" },
      { label: "Powtórki", icon: RefreshCcw, badge: "16" },
    ],
  },
  {
    heading: "Biblioteka",
    items: [
      { label: "Przedmioty", icon: BookOpen },
      { label: "Zapisane", icon: FolderOpen },
    ],
  },
];

const examRows = [
  {
    name: "Arkusz E8 · Matematyka 2024",
    subject: "Matematyka",
    date: "12 mar 2027",
    score: "21 / 25",
    status: "completed" as const,
    statusLabel: "Ukończony",
  },
  {
    name: "Arkusz E8 · Język polski 2023",
    subject: "Polski",
    date: "10 mar 2027",
    score: "—",
    status: "pending" as const,
    statusLabel: "W trakcie",
  },
  {
    name: "Quiz · Procenty",
    subject: "Matematyka",
    date: "8 mar 2027",
    score: "86%",
    status: "completed" as const,
    statusLabel: "Ukończony",
  },
];

const demoChoices = [
  { key: "A", label: "24" },
  { key: "B", label: "36" },
  { key: "C", label: "48" },
  { key: "D", label: "32" },
];

/**
 * Scripted hero demo timeline (practice view only). Each entry is how long
 * the demo holds on that step before advancing; the whole thing loops.
 *
 * 0 idle table → 1 row highlight → 2 cursor to sidebar → 3 click, view swaps
 * to a live question → 4 cursor to answer → 5 click, marked correct + streak
 * ticks → 6 hold → back to 0.
 */
const DEMO_STEPS = [1100, 1100, 950, 1250, 950, 1700, 1400];

const CURSOR_POS: Array<{ left: string; top: string }> = [
  { left: "58%", top: "62%" },
  { left: "50%", top: "47%" },
  { left: "16%", top: "28%" },
  { left: "16%", top: "28%" },
  { left: "48%", top: "63%" },
  { left: "48%", top: "63%" },
  { left: "70%", top: "50%" },
];

function MiniStat({
  label,
  value,
  pop,
}: {
  label: string;
  value: string;
  pop?: boolean;
}) {
  return (
    <div className="rounded-cards border border-ash p-3">
      <p className="text-[11px] text-fog">{label}</p>
      <p
        key={pop ? value : undefined}
        className={cn(
          "mt-1 text-subheading font-medium leading-none text-charcoal",
          pop && "animate-view-swap",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function PracticeQuestion({ answered }: { answered: boolean }) {
  return (
    <div className="animate-view-swap">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-medium text-fog">
          Zadanie 12 z 20 · Matematyka — procenty
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none transition-opacity duration-300",
            answered ? "bg-soft-mint text-[#166534] opacity-100" : "opacity-0",
          )}
        >
          <Check className="size-3" aria-hidden />
          Dobrze! · +10 XP
        </span>
      </div>
      <p className="mt-2 max-w-md text-body-lg font-medium text-charcoal">
        Ile wynosi 15% liczby 240?
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {demoChoices.map((choice) => {
          const selected = answered && choice.key === "B";
          return (
            <li
              key={choice.key}
              className={cn(
                "flex items-center gap-2.5 rounded-buttons border px-3 py-2 text-[13px] transition-colors duration-300",
                selected
                  ? "border-vivid-green bg-soft-mint font-medium text-[#166534]"
                  : "border-ash text-steel",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors duration-300",
                  selected
                    ? "border-vivid-green bg-vivid-green text-white"
                    : "border-smoke text-fog",
                )}
                aria-hidden
              >
                {selected ? <Check className="size-3" /> : choice.key}
              </span>
              {choice.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MockExamsTable({ highlightRow }: { highlightRow: boolean }) {
  return (
    <div className="animate-view-swap">
      <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-inputs border border-ash px-3 text-[13px] text-fog">
        <Search className="size-3.5" />
        Szukaj arkusza lub tematu
      </div>
      <div className="mt-4 overflow-hidden rounded-cards border border-ash">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-ash text-left text-[12px] text-fog">
              <th className="px-4 py-2.5 font-medium">Arkusz</th>
              <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Data</th>
              <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Wynik</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {examRows.map((row, index) => (
              <tr
                key={row.name}
                className={cn(
                  "border-b border-ash text-charcoal transition-colors duration-300 last:border-b-0",
                  index === 0 && highlightRow && "bg-paper-mist",
                )}
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <Avatar name={row.subject} size="sm" />
                    <span className="truncate font-medium">{row.name}</span>
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-steel lg:table-cell">{row.date}</td>
                <td className="hidden px-4 py-3 font-geist-mono text-steel sm:table-cell">
                  {row.score}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} label={row.statusLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const roadmapNodes = [
  {
    label: "Liczby i działania",
    meta: "12 tematów · opanowane",
    state: "done" as const,
  },
  {
    label: "Procenty",
    meta: "68% opanowania · w trakcie",
    state: "active" as const,
  },
  {
    label: "Równania i nierówności",
    meta: "Następny na roadmapie",
    state: "next" as const,
  },
  {
    label: "Geometria na płaszczyźnie",
    meta: "Odblokuje się po równaniach",
    state: "todo" as const,
  },
];

function RoadmapView() {
  return (
    <div className="animate-view-swap">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-body font-semibold text-charcoal">
            Matematyka · Egzamin ósmoklasisty
          </p>
          <p className="text-[12px] text-fog">Roadmapa do maja 2027</p>
        </div>
        <span className="font-geist-mono text-[12px] font-medium text-electric-blue">
          42% ukończone
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-mist">
        <div className="h-full w-[42%] rounded-full bg-electric-blue" />
      </div>
      <ol className="relative mt-4 space-y-2">
        {roadmapNodes.map((node) => (
          <li
            key={node.label}
            className={cn(
              "flex items-center gap-3 rounded-cards border px-3.5 py-2.5 transition-colors",
              node.state === "active"
                ? "border-electric-blue/40 bg-sidebar-active/40"
                : "border-ash",
              node.state === "todo" && "opacity-55",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border-2 text-[10px] font-semibold",
                node.state === "done" &&
                  "border-vivid-green bg-vivid-green text-white",
                node.state === "active" &&
                  "border-electric-blue bg-white text-electric-blue",
                node.state === "next" && "border-smoke bg-white text-fog",
                node.state === "todo" &&
                  "border-dashed border-smoke bg-white text-fog",
              )}
              aria-hidden
            >
              {node.state === "done" ? <Check className="size-3" /> : null}
              {node.state === "active" ? (
                <span className="size-2 rounded-full bg-electric-blue" />
              ) : null}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-charcoal">
                {node.label}
              </span>
              <span className="block truncate text-[11px] text-fog">
                {node.meta}
              </span>
            </span>
            {node.state === "active" ? (
              <span className="ml-auto hidden shrink-0 rounded-full bg-electric-blue px-2.5 py-1 text-[11px] font-medium text-white sm:block">
                Kontynuuj
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function AgentView() {
  return (
    <div className="animate-view-swap">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ash bg-paper-mist px-2.5 py-1 text-[11px] font-medium text-steel">
          <FileText className="size-3" aria-hidden />
          Zadanie 7 · Procenty · Arkusz E8 2024
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar-active px-2.5 py-1 text-[11px] font-medium leading-none text-deep-sapphire">
          <Sparkles className="size-3" aria-hidden />
          Agent Examax
        </span>
      </div>
      <div className="mt-3 space-y-2.5">
        <div className="ml-auto w-fit max-w-[85%] rounded-cards rounded-br-[4px] bg-midnight-ink px-3.5 py-2.5 text-[13px] text-white">
          Dlaczego wynik to 36, a nie 24?
        </div>
        <div className="flex max-w-[92%] items-start gap-2.5">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-electric-blue text-white">
            <Bot className="size-3.5" aria-hidden />
          </span>
          <div className="space-y-1.5 rounded-cards rounded-tl-[4px] border border-ash bg-white px-3.5 py-2.5 text-[13px] text-slate">
            <p>
              Policzmy krok po kroku: 15% to{" "}
              <span className="font-geist-mono text-charcoal">15/100 = 0,15</span>.
            </p>
            <p>
              Więc <span className="font-geist-mono text-charcoal">0,15 × 240 = 36</span>.
              Wynik 24 to 10% — łatwo o tę pomyłkę przy szybkim liczeniu.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Pokaż podobne zadanie", "Wytłumacz inaczej", "Dodaj do powtórek"].map(
          (chip) => (
            <span
              key={chip}
              className="rounded-full border border-ash px-2.5 py-1 text-[11px] font-medium text-steel"
            >
              {chip}
            </span>
          ),
        )}
      </div>
      <div className="mt-3 flex h-9 items-center justify-between gap-2 rounded-inputs border border-midnight-ink px-3 text-[13px] text-fog">
        Zapytaj o to zadanie…
        <Send className="size-3.5 text-charcoal" aria-hidden />
      </div>
    </div>
  );
}

function AnalyticsView() {
  const funnel = [
    { label: "Przerobione", value: "1 246", pct: 100, className: "bg-electric-blue" },
    { label: "Poprawne", value: "1 047", pct: 84, className: "bg-lavender" },
    { label: "Opanowane", value: "38 tematów", pct: 38, className: "bg-vivid-green" },
  ];
  return (
    <div className="animate-view-swap">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Zadania", value: "1 246" },
          { label: "Skuteczność", value: "84%" },
          { label: "Seria", value: "12 dni" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between gap-2 rounded-cards border border-ash px-3.5 py-3"
          >
            <div>
              <p className="text-[11px] text-fog">{stat.label}</p>
              <p className="mt-1 text-subheading font-medium leading-none text-charcoal">
                {stat.value}
              </p>
            </div>
            <Sparkline className="hidden h-8 w-16 xl:block" />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-3 rounded-cards border border-ash p-4">
        {funnel.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-charcoal">{row.label}</span>
              <span className="font-geist-mono text-fog">{row.value}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper-mist">
              <div
                className={cn("h-full rounded-full", row.className)}
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const topBarActions: Record<HeroView, string> = {
  roadmap: "Zaplanuj tydzień",
  practice: "Nowy arkusz próbny",
  agent: "Nowa rozmowa",
  analytics: "Eksportuj raport",
};

/**
 * The hero product mockup — a 2-column app shell presented as a floating
 * panel with the 4px ring shadow. The practice view runs a looped, scripted
 * micro-demo (cursor glides, sidebar selection moves, a question is answered,
 * the streak ticks). Paused off-screen and under prefers-reduced-motion.
 */
export function HeroDashboard({ view }: { view: HeroView }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);
  const reducedMotion = useReducedMotion();

  const demoRunning = view === "practice" && inView && !reducedMotion;

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // The demo pauses in place while off-screen and resumes on return; no
  // synchronous state resets inside effects.
  useEffect(() => {
    if (!demoRunning) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current + 1) % DEMO_STEPS.length),
      DEMO_STEPS[step],
    );
    return () => window.clearTimeout(timer);
  }, [demoRunning, step]);

  const practiceSwapped = view === "practice" && step >= 3;
  const answered = view === "practice" && step >= 5;
  const activeLabel =
    view === "analytics"
      ? "Postępy"
      : view === "roadmap"
        ? "Roadmapa"
        : view === "agent"
          ? "Agent"
          : practiceSwapped
            ? "Trening"
            : "Arkusze";
  const contentTitle =
    view === "analytics"
      ? "Postępy"
      : view === "roadmap"
        ? "Roadmapa"
        : view === "agent"
          ? "Agent Examax"
          : activeLabel === "Trening"
            ? "Trening"
            : "Arkusze próbne";
  const showRipple = view === "practice" && (step === 3 || step === 5);

  return (
    <div
      ref={frameRef}
      role="img"
      aria-label="Podgląd aplikacji Examax: roadmapa nauki, trening zadań, rozmowa z agentem AI i postępy"
      className="relative overflow-hidden rounded-t-largecards bg-white text-left shadow-ring"
    >
      <div className="flex">
        {/* Icon rail */}
        <div
          aria-hidden
          className="hidden w-14 shrink-0 flex-col items-center gap-4 border-r border-ash bg-paper-mist py-4 sm:flex"
        >
          <span className="grid size-8 place-items-center rounded-buttons bg-midnight-ink">
            <svg viewBox="0 0 32 32" className="size-7" role="presentation">
              <path
                d="M10 20.5 16 9.5l6 11M12.4 16.6h7.2"
                fill="none"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="grid size-8 place-items-center rounded-buttons bg-white text-charcoal shadow-subtle">
            <Compass className="size-4" />
          </span>
          <span className="grid size-8 place-items-center text-fog">
            <Settings className="size-4" />
          </span>
          <span className="mt-auto">
            <Avatar name="Ala Wiśniewska" size="sm" />
          </span>
        </div>

        {/* Sidebar */}
        <div
          aria-hidden
          className="hidden w-52 shrink-0 border-r border-ash bg-paper-mist/60 px-3 py-4 md:block"
        >
          <p className="px-2 text-body font-semibold text-charcoal">
            Egzamin ósmoklasisty
          </p>
          <div className="mt-4 space-y-5">
            {sidebarGroups.map((group) => (
              <div key={group.heading ?? "main"}>
                {group.heading ? (
                  <p className="px-2 pb-1.5 text-[11px] font-medium text-fog">
                    {group.heading}
                  </p>
                ) : null}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = item.label === activeLabel;
                    return (
                      <li key={item.label}>
                        <span
                          className={cn(
                            "flex items-center gap-2 rounded-buttons px-2 py-1.5 text-[13px] transition-colors duration-300",
                            active
                              ? "bg-sidebar-active font-medium text-deep-sapphire"
                              : "text-slate",
                          )}
                        >
                          <item.icon className="size-3.5" strokeWidth={2} />
                          {item.label}
                          {item.badge ? (
                            <span
                              className={cn(
                                "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none transition-colors duration-300",
                                active
                                  ? "bg-electric-blue text-white"
                                  : "bg-ash text-steel",
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div aria-hidden className="min-w-0 flex-1 bg-white">
          <div className="flex items-center justify-between border-b border-ash px-5 py-3.5">
            <p
              key={contentTitle}
              className="animate-view-swap text-body font-semibold text-charcoal"
            >
              {contentTitle}
            </p>
            <span className="hidden rounded-buttons bg-midnight-ink px-3 py-1.5 text-[12px] font-medium text-white sm:inline-block">
              {topBarActions[view]}
            </span>
          </div>

          <div className="p-5">
            {view === "analytics" ? (
              <AnalyticsView />
            ) : view === "roadmap" ? (
              <RoadmapView />
            ) : view === "agent" ? (
              <AgentView />
            ) : practiceSwapped ? (
              <PracticeQuestion answered={answered} />
            ) : (
              <MockExamsTable highlightRow={step >= 1 && step < 3} />
            )}

            {view === "practice" ? (
              <div className="mt-4 hidden grid-cols-3 gap-3 md:grid">
                <MiniStat label="Zadań dzisiaj" value={answered ? "28" : "27"} pop />
                <MiniStat label="Skuteczność" value="84%" />
                <MiniStat label="Seria nauki" value={answered ? "13 dni" : "12 dni"} pop />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Synthetic cursor + click ripple (scripted demo) */}
      {demoRunning ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          <div
            className="demo-cursor absolute z-20"
            style={{ left: CURSOR_POS[step].left, top: CURSOR_POS[step].top }}
          >
            {showRipple ? (
              <span
                key={step}
                className="animate-demo-ripple absolute -left-3 -top-3 size-8 rounded-full bg-electric-blue/50"
              />
            ) : null}
            <svg
              viewBox="0 0 24 24"
              className="relative size-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            >
              <path
                d="M5 3l14 8.5-6.1 1.6L9.5 19 5 3z"
                fill="#0a0a0a"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : null}
    </div>
  );
}
