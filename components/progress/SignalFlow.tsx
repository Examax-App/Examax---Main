"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Flame,
  Gauge,
  LineChart,
  PencilLine,
  RefreshCcw,
  Route,
  Sparkles,
  Target,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * dub.co/analytics' "Turn events into opportunities", one to one (live DOM
 * and frames recorded 2026-10-01): a two-button switch with a black action
 * sits on the band's top rule, over a dotted field holding the diagram — the
 * brand box on the left, a card between two blue links, and a carousel of
 * apps on the right stepping up through a framed slot.
 *
 *   API      → Rekomendacje: a part of Examax asks about the learner's
 *              results ("Zapytanie", blue, links pointing into Examax), then
 *              the answer goes back ("Odpowiedź", green, links pointing out).
 *   Webhooks → Powiadomienia: each new result arrives as an event
 *              ("Nowe zdarzenie") and fans out below into the three places
 *              it lands — a reminder, the parent's report, the streak.
 *
 * Dub opens on webhooks; so does this.
 * PLACEHOLDER DATA — the questions and events are illustrative.
 */

type Mode = "ask" | "notify";

type Part = { label: string; icon: IconComponent; accent: Accent };

const TUTOR: Part = { label: "Korepetytor AI", icon: Zap, accent: "yellow" };
const ROADMAP: Part = { label: "Roadmapa", icon: Route, accent: "blue" };
const TRAINING: Part = { label: "Trening", icon: PencilLine, accent: "green" };
const SIMULATION: Part = { label: "Symulacja", icon: Timer, accent: "lavender" };

type Item = { part: Part; card: string; icon: IconComponent };

const ASKS: Item[] = [
  { part: TUTOR, card: "Słabe tematy z tygodnia", icon: LineChart },
  { part: ROADMAP, card: "Tempo względem planu", icon: Route },
  { part: TRAINING, card: "Tematy do powtórki", icon: RefreshCcw },
  { part: SIMULATION, card: "Gotowość do arkusza", icon: Gauge },
];

const EVENTS: Item[] = [
  { part: TRAINING, card: "Temat opanowany", icon: Target },
  { part: ROADMAP, card: "Tydzień ukończony", icon: CalendarCheck },
  { part: SIMULATION, card: "Arkusz oceniony", icon: FileCheck },
  { part: TUTOR, card: "Nowa rekomendacja", icon: Sparkles },
];

const LANDS: Array<{ label: string; icon: IconComponent; tint: string }> = [
  { label: "Przypomnienie", icon: Bell, tint: "text-[#ca8a04]" },
  { label: "Raport dla rodzica", icon: Users, tint: "text-lavender" },
  { label: "Seria", icon: Flame, tint: "text-tangerine" },
];

const MODES: Record<Mode, { label: string; icon: IconComponent; action: { label: string; href: string }; items: Item[] }> = {
  ask: { label: "Rekomendacje", icon: Sparkles, action: { label: "Poznaj Korepetytora AI", href: "/agents" }, items: ASKS },
  notify: { label: "Powiadomienia", icon: Bell, action: { label: "Ustaw przypomnienia", href: "/signup" }, items: EVENTS },
};

/** The reference's beat: a new event every three seconds; a question and its answer take a little longer. */
const BEAT: Record<Mode, number> = { ask: 3600, notify: 3000 };
/** Carousel pitch: 125% of the 80px tile, as the reference sets it. */
const PITCH = 100;

/** The reference's link: a 1px run, an arrowhead at one end, a ring at the other. */
function Connector({ direction, colour }: { direction: "in" | "out"; colour: string }) {
  const Arrow = direction === "in" ? ChevronLeft : ChevronRight;
  return (
    <div className="relative z-10 flex min-w-16 items-center self-stretch transition-colors duration-300" style={{ color: colour }}>
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <Arrow
        className={cn("absolute top-1/2 size-3 -translate-y-1/2", direction === "in" ? "left-px -translate-x-1/2" : "right-px translate-x-1/2")}
        strokeWidth={2}
      />
      <div
        className={cn(
          "absolute top-1/2 size-2 -translate-y-1/2 rounded-full border border-current bg-white",
          direction === "in" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
        )}
      />
    </div>
  );
}

function Diagram({ mode, step, answered }: { mode: Mode; step: number; answered: boolean }) {
  const { items } = MODES[mode];
  const sending = items[step % items.length];
  const blue = "#3b82f6";
  const green = "#22c55e";
  const asking = mode === "ask";
  const colour = asking && answered ? green : blue;
  const direction = asking && answered ? "out" : "in";
  const badge = asking ? (answered ? "Odpowiedź" : "Zapytanie") : "Nowe zdarzenie";
  const greenBadge = !asking || answered;

  return (
    <div className="relative flex items-center">
      {/* The brand box, where every result arrives */}
      <div className="relative rounded-[20px] border border-ash bg-white p-2">
        <div className="rounded-[12px] bg-gradient-to-b from-fog to-graphite p-px">
          <div className="flex items-center justify-center gap-2 rounded-[11px] bg-gradient-to-b from-steel to-charcoal px-6 py-[26px] text-white">
            <BrandMark className="h-6" />
            <span className="font-satoshi text-[24px] font-bold leading-8 tracking-tight">Examax</span>
          </div>
        </div>
      </div>

      <Connector direction={direction} colour={colour} />

      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full">
          <div
            key={badge}
            className={cn(
              "whitespace-nowrap rounded-lg border px-2 py-1 font-geist-mono text-sm leading-none motion-safe:animate-[fade-in_0.3s_ease-out]",
              greenBadge ? "border-[#bbf7d0] bg-[#dcfce7] text-[#166534]" : "border-[#bfdbfe] bg-[#dbeafe] text-[#1e40af]",
            )}
          >
            {badge}
          </div>
        </div>
        <div className="w-60 rounded-[16px] bg-gradient-to-b from-ash to-smoke p-px shadow-subtle">
          <div className="flex items-center gap-2 rounded-[15px] bg-white px-3 py-2">
            <div
              className={cn(
                "shrink-0 rounded-[10px] border p-1.5 transition-colors duration-300",
                colour === green ? "border-[#bbf7d0] bg-[#dcfce7] text-[#15803d]" : "border-[#bfdbfe] bg-[#dbeafe] text-[#1d4ed8]",
              )}
            >
              <sending.icon className="size-4" strokeWidth={2} />
            </div>
            <span key={sending.card} className="truncate text-sm font-medium text-graphite motion-safe:animate-[fade-in_0.3s_ease-out]">
              {sending.card}
            </span>
          </div>
        </div>

        {/* Notifications fan out below into the three places they land */}
        {mode === "notify" ? (
          <div className="absolute left-1/2 top-full w-full -translate-x-1/2">
            <div className="flex w-full flex-col items-center text-silver [--offset:-2px] motion-safe:animate-[slide-up-fade_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
              <div className="flex justify-center gap-3.5">
                {LANDS.map((land) => (
                  <div key={land.label} className="relative flex flex-col items-center" title={land.label}>
                    <div className="relative h-12 w-fit pb-1.5 pt-1">
                      <div className="h-full border-r border-dashed border-current" />
                      <ChevronDown className="absolute -bottom-0.5 left-1/2 size-3 -translate-x-1/2" strokeWidth={2} />
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-lg border border-ash bg-white">
                      <land.icon className={cn("size-5", land.tint)} strokeWidth={2} />
                    </div>
                  </div>
                ))}
              </div>
              <span className="mt-3 whitespace-nowrap font-geist-mono text-xs text-fog">Telefon · raport · seria</span>
            </div>
          </div>
        ) : null}
      </div>

      <Connector direction={direction} colour={colour} />

      {/* The carousel: the frame stays, the parts of Examax step up through it */}
      <div className="relative">
        <div className="relative h-24 w-44 rounded-[20px] border border-ash bg-white" />
        {items.map((item, index) => {
          const count = items.length;
          const offset = ((((index - step) % count) + count + 1) % count) - 1;
          return (
            <div
              key={item.card}
              className={cn(
                "absolute left-1/2 top-1/2 transition-[transform,opacity] duration-300 motion-reduce:transition-none",
                Math.abs(offset) > 1 && "opacity-0",
              )}
              style={{ transform: `translate(-50%, calc(-50% + ${offset * PITCH}px)) scale(${offset === 0 ? 1 : 0.9})` }}
            >
              <div className="h-20 w-40 rounded-[12px] bg-gradient-to-b from-paper-mist to-ash p-px shadow-subtle">
                <div className="flex size-full items-center justify-center gap-2.5 rounded-[11px] bg-white px-3">
                  <AccentTile icon={item.part.icon} accent={item.part.accent} size="lg" />
                  <span className="whitespace-nowrap font-satoshi text-[15px] font-bold tracking-tight text-charcoal">{item.part.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SignalFlow() {
  const [mode, setMode] = useState<Mode>("notify");
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();

  // One beat per item: an event steps straight through; a question waits
  // half the beat for its answer, then the next part asks.
  useEffect(() => {
    if (!inView || reduced) return;
    const beat = BEAT[mode];
    const timers: number[] = [];
    const run = () => {
      if (mode === "ask") timers.push(window.setTimeout(() => setAnswered(true), beat / 2));
      timers.push(
        window.setTimeout(() => {
          setAnswered(false);
          setStep((s) => s + 1);
          run();
        }, beat),
      );
    };
    run();
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [mode, inView, reduced]);

  function pick(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setStep(0);
    setAnswered(false);
  }

  const current = MODES[mode];

  return (
    <div ref={ref} className="relative mt-16 border-t border-ash">
      {/* The switch, sitting on the rule */}
      <div className="absolute left-1/2 top-0 z-20 w-[284px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-ash bg-white p-2 shadow-subtle">
        <div role="tablist" aria-label="Co dzieje się z wynikami" className="grid grid-cols-2 gap-2">
          {(Object.keys(MODES) as Mode[]).map((key) => {
            const item = MODES[key];
            const active = key === mode;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => pick(key)}
                className={cn(
                  "focus-ring flex h-7 items-center justify-center gap-1.5 rounded-md border text-xs transition-colors",
                  active ? "border-smoke bg-white text-charcoal shadow-subtle" : "border-ash bg-paper-mist text-steel hover:bg-ash/60",
                )}
              >
                <item.icon className="size-3.5" strokeWidth={1.75} aria-hidden />
                {item.label}
              </button>
            );
          })}
        </div>
        <Link
          href={current.action.href}
          className="focus-ring mt-2 flex h-7 w-full items-center justify-center rounded-md bg-black text-xs font-medium text-white transition-colors hover:bg-graphite"
        >
          {current.action.label}
        </Link>
      </div>

      {/* The dotted field, fading at its edges */}
      <div className="relative h-[380px] overflow-hidden sm:h-[440px]">
        <div
          aria-hidden
          className="absolute inset-4 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:16px_16px] [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent),linear-gradient(transparent,black_15%,black_85%,transparent)]"
        />
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pt-6">
          <div className="shrink-0 scale-[0.45] sm:scale-[0.8] md:scale-100">
            <Diagram mode={mode} step={step} answered={answered} />
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {mode === "ask"
            ? "Korepetytor AI, roadmapa, trening i symulacja pytają Examax o Twoje wyniki i dostają odpowiedź."
            : "Każdy nowy wynik trafia do Examaxu i stamtąd do przypomnień, raportu dla rodzica i Twojej serii."}
        </p>
      </div>
    </div>
  );
}
