"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChartSpline,
  CircleCheck,
  Equal,
  FileCheck,
  Flame,
  GraduationCap,
  ListChecks,
  Percent,
  RotateCcw,
  Sigma,
  Target,
  Timer,
  Triangle,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { TaskFigure } from "@/components/training/TaskFigure";
import { Waves } from "@/components/training/Waves";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

import learnerPhoto from "@/public/mockups/learner.jpg";
import kacperPhoto from "@/public/mockups/learner-kacper.jpg";

/**
 * The "Trening na autopilocie" section's three pictures, each a template copy
 * of the matching cell of dub.co/partners' "Revenue on autopilot" (read off
 * its live DOM and recorded frame by frame on 2026-09-30):
 *
 *  - QueueScroll     ← Flexible reward structure: rule cards drifting up
 *                      behind one fixed, lifted card
 *  - TutorChat       ← Dual-sided incentives: a chat that pops in bubble by
 *                      bubble, a link preview in the middle
 *  - ReadinessOrbit  ← Partner referral rewards: a portrait, a rolling
 *                      figure and an event pill that keeps changing
 *
 * PLACEHOLDER DATA — the topics, figures and messages are illustrative.
 */

/* ------------------------------------------------------------------------ */
/* 1 · Queue                                                                */
/* ------------------------------------------------------------------------ */

type Rule = { icon: IconComponent; tag: string; text: React.ReactNode };

const Hi = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-electric-blue">{children}</strong>
);

const RULES: Rule[] = [
  {
    icon: Target,
    tag: "5 zadań",
    text: (
      <>
        Rozwiąż <Hi>5 zadań</Hi> z tematu <strong className="font-semibold">Procenty</strong>
      </>
    ),
  },
  {
    icon: RotateCcw,
    tag: "powtórka",
    text: (
      <>
        Wróć do <strong className="font-semibold">Równań</strong> <Hi>za 2 dni</Hi>, zanim wylecą z głowy
      </>
    ),
  },
  {
    icon: Timer,
    tag: "na czas",
    text: (
      <>
        Arkusz <Hi>2024</Hi> w <strong className="font-semibold">125 minut</strong>
      </>
    ),
  },
];

/** The reference's lifted card, a five-step soft shadow copied as is. */
const LIFT =
  "0 1.84px 4.6px #00000008, 0 8.28px 8.28px #00000008, 0 19.31px 11.95px #00000005, 0 34.02px 13.79px #00000000, 0 53.33px 14.71px #00000000";

function RuleCard({ rule, lifted = false }: { rule: Rule; lifted?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-lg border border-ash bg-white px-2.5 py-3.5",
        lifted ? "scale-[1.15]" : "opacity-70",
      )}
      style={lifted ? { boxShadow: LIFT } : undefined}
    >
      <div className="flex w-full items-start justify-between">
        <div className="rounded-full border border-ash p-1 text-charcoal">
          <rule.icon className="size-3" strokeWidth={2} />
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] leading-none text-slate",
            lifted ? "bg-paper-mist py-1" : "border-[0.5px] border-[#bbf7d0] bg-soft-mint",
          )}
        >
          {!lifted ? <ListChecks className="size-2.5 text-vivid-green" strokeWidth={2.25} /> : null}
          <span className="font-medium">{rule.tag}</span>
        </div>
      </div>
      <span className="text-[9px] text-charcoal">{rule.text}</span>
    </div>
  );
}

export function QueueScroll() {
  const stack = [...RULES, ...RULES];
  return (
    <div
      aria-hidden
      inert
      className="size-full overflow-hidden [mask-image:linear-gradient(transparent,black,black,transparent)]"
    >
      <div className="relative mx-auto size-full max-w-sm px-6">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="animate-infinite-scroll-y flex flex-col gap-2 pt-2"
            style={{ "--scroll": "-100%", "--scroll-duration": "30s" } as React.CSSProperties}
          >
            {stack.map((rule, index) => (
              <RuleCard key={index} rule={rule} />
            ))}
          </div>
        ))}
        <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 px-6">
          <RuleCard
            lifted
            rule={{
              icon: Zap,
              tag: "Dziś",
              text: (
                <>
                  Zacznij od <strong className="font-semibold">Funkcji</strong> — tracisz tu{" "}
                  <Hi>4 pkt</Hi> <strong className="font-semibold">na każdym arkuszu</strong>
                </>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · Tutor chat                                                           */
/* ------------------------------------------------------------------------ */

/** The reference's beat: each message 800ms after the last, dots first. */
const MESSAGE_GAP = 800;

function pop(delay: number, fromScale: number) {
  return {
    "--from-scale": fromScale,
    animation: `scale-in-fade 100ms ease-in-out ${delay}ms both`,
  } as React.CSSProperties;
}

/** Korepetytor AI's mark — the yellow chip with the black bolt — as a round avatar. */
function TutorAvatar() {
  return (
    <span className="grid size-5 place-items-center rounded-full border border-black/5 bg-[#facc15] text-charcoal">
      <Zap className="size-3" strokeWidth={2.5} />
    </span>
  );
}

function LearnerAvatar() {
  return (
    <span className="relative block size-5 overflow-hidden rounded-full">
      <Image src={learnerPhoto} alt="" fill sizes="20px" className="object-cover object-[center_30%]" />
    </span>
  );
}

function Message({
  index,
  side,
  children,
}: {
  index: number;
  side: "tutor" | "learner";
  children: React.ReactNode;
}) {
  const start = index * MESSAGE_GAP;
  const tutor = side === "tutor";
  const tone = tutor ? "bg-graphite text-[#fafafa]" : "bg-paper-mist text-slate";
  return (
    <div className={cn("flex items-end gap-4 pb-1", !tutor && "flex-row-reverse")}>
      <div style={pop(start, 1)}>{tutor ? <TutorAvatar /> : <LearnerAvatar />}</div>
      <div className="relative grow">
        <div
          className={cn("absolute bottom-0 size-3 rounded-full", tutor ? "-left-1" : "-right-1", tone)}
          style={pop(start + 100, 0.25)}
        />
        <div
          className={cn("absolute -bottom-px size-1.5 rounded-full", tutor ? "-left-2.5" : "-right-2.5", tone)}
          style={pop(start + 50, 0.25)}
        />
        <div
          className={cn(
            "relative isolate grow overflow-hidden rounded-xl",
            tutor ? "origin-bottom-left" : "origin-bottom-right",
          )}
          style={pop(start + 150, 0.9)}
        >
          {children}
        </div>
      </div>
      <div className="size-5 shrink-0" />
    </div>
  );
}

export function TutorChat() {
  const { ref, inView: played } = useInView<HTMLDivElement>(0.4, true);

  return (
    <div ref={ref} aria-hidden inert className="size-full overflow-hidden">
      <div className="relative mx-auto flex size-full max-w-72 flex-col justify-end gap-2">
        {played ? (
          <>
            <Message index={0} side="tutor">
              <div className="bg-graphite px-2.5 py-2 text-xs text-[#fafafa]">
                Podwyżkę liczysz od starej ceny, nie od nowej. Masz tu podobne zadanie:
              </div>
            </Message>
            <Message index={1} side="tutor">
              {/* The link preview: the task's own card, as a share image */}
              <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-t-xl bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_100%,#bbf7d0_0%,#dbeafe_35%,transparent_70%)]" />
                <div className="relative flex h-full items-center justify-between gap-3 px-3.5">
                  <div className="min-w-0">
                    <p className="text-[8px] font-medium uppercase tracking-wide text-fog">Zadanie 11 · Procenty</p>
                    <p className="mt-1 text-[13px] font-medium leading-tight text-charcoal">
                      Cena wzrosła
                      <br />o 20%. Ile kosztuje?
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-charcoal">
                      <BrandMark className="h-2" />
                      <span className="font-satoshi text-[9px] font-bold">Examax</span>
                    </div>
                  </div>
                  <div className="grid size-16 shrink-0 place-items-center rounded-lg border border-ash bg-white/80 text-graphite">
                    <TaskFigure name="percent" className="size-12" />
                  </div>
                </div>
              </div>
              <div className="bg-graphite px-2.5 py-2">
                <div className="flex flex-col text-[10px] leading-tight">
                  <span className="font-semibold text-[#e5e5e5]">examax.app/zadanie/11</span>
                  <span className="text-[#e5e5e5] max-lg:hidden">Podobne zadanie · Arkusz CKE 2023</span>
                </div>
              </div>
            </Message>
            <Message index={2} side="learner">
              <div className="bg-paper-mist px-2.5 py-2 text-xs text-slate">DZIĘKI, JUŻ WIEM!!</div>
            </Message>
          </>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · Readiness                                                            */
/* ------------------------------------------------------------------------ */

const ORBIT: IconComponent[] = [Percent, Triangle, ChartSpline, Sigma, Equal, GraduationCap];

const EVENTS: Array<{ icon: IconComponent; label: string }> = [
  { icon: CircleCheck, label: "Zadanie poprawne" },
  { icon: Flame, label: "Seria 5 dni" },
  { icon: GraduationCap, label: "Temat opanowany" },
  { icon: FileCheck, label: "Arkusz ukończony" },
];

const START = 64;
/** Steps per loop: the orbit, eight events, then the fade before restarting. */
const STEPS = 11;
const TICK = 1100;

export function ReadinessOrbit() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => setStep((s) => (s + 1) % STEPS), TICK);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  // Reduced motion: hold the loop's middle frame.
  const s = reducedMotion ? 5 : step;
  const orbiting = s === 0;
  const counting = s >= 1 && s <= STEPS - 2;
  const event = Math.max(0, s - 1);
  const value = START + (counting ? event : STEPS - 3);

  return (
    <div ref={ref} aria-hidden inert className="relative flex size-full flex-col items-center pt-6">
      <Waves id="readiness-waves" className="absolute left-1/2 top-4 h-[150px] w-[320px] -translate-x-1/2 text-[#e5e5e5] [mask-image:radial-gradient(50%_50%,black,transparent)]" />

      <div className="relative size-[104px]">
        {ORBIT.map((Icon, index) => {
          const angle = (index / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 88;
          const y = Math.sin(angle) * 70;
          return (
            <span
              key={index}
              className="absolute left-1/2 top-1/2 -ml-4 -mt-4 grid size-8 place-items-center rounded-full border border-ash bg-white text-graphite shadow-subtle transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: orbiting ? `translate(${x}px, ${y}px) scale(1)` : "translate(0, 0) scale(0.3)",
                opacity: orbiting ? 1 : 0,
                transitionDelay: orbiting ? `${index * 60}ms` : "0ms",
              }}
            >
              <Icon className="size-3.5" strokeWidth={2} />
            </span>
          );
        })}
        <span className="relative z-10 block size-full overflow-hidden rounded-full border-4 border-white shadow-md">
          <Image src={kacperPhoto} alt="" fill sizes="104px" className="object-cover object-[center_25%]" />
        </span>
      </div>

      <div
        className={cn(
          "mt-3 flex flex-col items-center transition-opacity duration-500",
          counting ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-body text-fog">Gotowość do egzaminu</span>
        <span className="flex items-baseline text-[28px] font-semibold text-graphite">
          <RollingNumber value={value} lineHeight={34} />%
        </span>
        <div className="relative mt-2 h-8 w-[164px]">
          {EVENTS.map((item, index) => {
            const on = counting && event % EVENTS.length === index;
            return (
              <div
                key={item.label}
                className={cn(
                  "absolute inset-0 flex items-center justify-between rounded-lg border border-ash bg-white px-2.5 shadow-subtle transition-[transform,opacity] duration-300",
                  on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
              >
                <span className="flex items-center gap-1.5 text-[10px] text-charcoal">
                  <item.icon className="size-3 text-graphite" strokeWidth={2} />
                  {item.label}
                </span>
                <span className="text-[10px] font-medium text-vivid-green">+1%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
