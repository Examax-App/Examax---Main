"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BookmarkCheck,
  BookMarked,
  Check,
  ChevronDown,
  ChevronLeft,
  CloudCheck,
  Languages,
  PencilLine,
  Route,
  Search,
  Sigma,
  Timer,
  TrendingUp,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { usePanelCurrent } from "@/components/sections/FeatureStage";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/**
 * The "Jak wygląda nauka w Examax" section's three pictures, one per sub-feature below
 * the band, each a template copy of the reference's API section (dub.co, read
 * off its live DOM and recorded frame by frame; captures in
 * `DesignRules/API — * _ Dub.png` and `DesignRules/dom-captures/api-section.html`):
 *
 *  - SheetFlow      ← Real-time webhooks: a carousel of CKE sheets on the
 *                     right sends each new task through a card into the
 *                     brand box on the left, and the card fans out to the
 *                     three places a task lands
 *  - KnowledgeSync  ← Deferred deep links: the reference's SVG, one solved
 *                     task feeding the student's account along three
 *                     animated routes, the phone's figures ticking up as the
 *                     dots arrive
 *  - SubjectWindow  ← Multi-language SDKs: a pill of subjects over a window
 *                     holding an exam task, switched by click with a 150ms
 *                     cross-fade
 *
 * All drawn on the 800×440 stage; FeatureStage scales it on narrow screens.
 * PLACEHOLDER DATA — the sheets, tasks and figures are illustrative.
 */

export type Exam = "matura" | "e8";

function ExamMark({ exam, className }: { exam: Exam; className?: string }) {
  return exam === "matura" ? <MaturaIcon className={className} /> : <E8Icon className={className} />;
}

/* ------------------------------------------------------------------------ */
/* 1 · Sheet flow                                                            */
/* ------------------------------------------------------------------------ */

export type Sheet = {
  exam: Exam;
  name: string;
  detail: string;
  /** The task the sheet sends through, shown in the event card. */
  task: string;
  icon: IconComponent;
};

export type FlowDestination = { label: string; icon: IconComponent; tint: string };

/**
 * One loop of the carousel, newest session first; the sheet in the centre
 * slot is the one sending. Every exam and level the platform covers passes
 * through it.
 */
const SHEETS: Sheet[] = [
  { exam: "matura", name: "Matura", detail: "Matematyka · 2026", task: "Zadanie 7 · Procenty", icon: Sigma },
  { exam: "matura", name: "Matura rozszerzona", detail: "Matematyka · 2026", task: "Zadanie 11 · Pochodne", icon: Sigma },
  { exam: "e8", name: "Ósmoklasista", detail: "Angielski · 2026", task: "Zadanie 4 · Reading", icon: Languages },
  { exam: "matura", name: "Matura", detail: "Polski · 2026", task: "Zadanie 2 · Rozprawka", icon: BookMarked },
  { exam: "e8", name: "Ósmoklasista", detail: "Matematyka · 2026", task: "Zadanie 12 · Geometria", icon: Sigma },
  { exam: "matura", name: "Matura rozszerzona", detail: "Angielski · 2026", task: "Zadanie 6 · Gramatyka", icon: Languages },
  { exam: "e8", name: "Ósmoklasista", detail: "Polski · 2026", task: "Zadanie 3 · Lektury", icon: BookMarked },
  { exam: "matura", name: "Matura", detail: "Angielski · 2026", task: "Zadanie 9 · Past Simple", icon: Languages },
];

/** Where every task lands, in the reference's integration-tile slots. */
const DESTINATIONS: FlowDestination[] = [
  { label: "Trening", icon: PencilLine, tint: "text-vivid-green" },
  { label: "Roadmapa", icon: Route, tint: "text-electric-blue" },
  { label: "Symulacja", icon: Timer, tint: "text-tangerine" },
];

/** The reference's beat: a new event every three seconds. */
const EVENT_BEAT = 3000;
/** The first event comes sooner, so it lands inside the strip's 4s dwell. */
const FIRST_EVENT = 1500;
/** Carousel pitch: 125% of the 80px card, as the reference sets it. */
const SLOT_PITCH = 100;

/**
 * The landing page shows CKE sheets flowing in; other pages pass their own
 * cards, badge and destinations (/roadmap: results reshaping the plan) and
 * keep the picture and its motion exactly as they are here.
 */
export function SheetFlow({
  items = SHEETS,
  badge = "Nowe zadanie",
  destinations = DESTINATIONS,
}: {
  items?: Sheet[];
  badge?: string;
  destinations?: FlowDestination[];
} = {}) {
  const current = usePanelCurrent();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!current || !inView || reducedMotion) return;
    let interval = 0;
    const first = window.setTimeout(() => {
      setStep((s) => s + 1);
      interval = window.setInterval(() => setStep((s) => s + 1), EVENT_BEAT);
    }, FIRST_EVENT);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [current, inView, reducedMotion]);

  const sending = items[step % items.length];

  return (
    <div ref={ref} aria-hidden className="flex size-full items-center justify-center">
      <div className="relative flex items-center">
        {/* The brand box, where every task arrives */}
        <div className="relative rounded-[20px] border border-ash bg-white p-2">
          <div className="rounded-[12px] bg-gradient-to-b from-fog to-graphite p-px">
            <div className="flex items-center justify-center gap-2 rounded-[11px] bg-gradient-to-b from-steel to-charcoal px-6 py-[26px] text-white">
              <BrandMark className="h-6" />
              <span className="font-satoshi text-[24px] font-bold leading-8 tracking-tight">Examax</span>
            </div>
          </div>
        </div>

        <Connector />

        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full">
            <div className="whitespace-nowrap rounded-lg border border-[#bbf7d0] bg-[#dcfce7] px-2 py-1 font-geist-mono text-sm leading-none text-[#166534]">
              {badge}
            </div>
          </div>
          {/* Fixed width, so a longer task never pushes the row about */}
          <div className="w-60 rounded-[16px] bg-gradient-to-b from-ash to-smoke p-px shadow-subtle">
            <div className="flex items-center gap-2 rounded-[15px] bg-white px-3 py-2">
              <div className="shrink-0 rounded-[10px] border border-[#bfdbfe] bg-[#dbeafe] p-1.5 text-[#1d4ed8]">
                <sending.icon className="size-4" strokeWidth={2} />
              </div>
              <span className="truncate text-sm font-medium text-graphite">{sending.task}</span>
            </div>
          </div>

          {/* The fan: dashed drops into the three places a task lands */}
          <div className="absolute left-1/2 top-full w-full -translate-x-1/2">
            <div className="flex w-full flex-col items-center text-silver [--offset:-2px] in-data-[current=true]:animate-[slide-up-fade_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
              <div className="flex justify-center gap-3.5">
                {destinations.map((destination) => (
                  <div key={destination.label} className="relative flex flex-col items-center">
                    <div className="relative h-12 w-fit pb-1.5 pt-1">
                      <div className="h-full border-r border-dashed border-current" />
                      <ChevronDown className="absolute -bottom-0.5 left-1/2 size-3 -translate-x-1/2" strokeWidth={2} />
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-lg border border-ash bg-white">
                      <destination.icon className={cn("size-5", destination.tint)} strokeWidth={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Connector />

        {/* The sheet carousel: the frame stays, the sheets step up through it */}
        <div className="relative">
          <div className="relative h-24 w-48 rounded-[20px] border border-ash bg-white" />
          {items.map((sheet, index) => {
            // Slot relative to the centre: 0 is sending, ±1 wait beside it,
            // the rest are parked out of sight (the reference's -250%…375%).
            const count = items.length;
            const offset = ((((index - step) % count) + count + 2) % count) - 2;
            return (
              <div
                key={index}
                className={cn(
                  "absolute left-1/2 top-1/2 transition-[transform,opacity] duration-300 motion-reduce:transition-none",
                  Math.abs(offset) > 1 && "opacity-0",
                )}
                style={{
                  transform: `translate(-50%, calc(-50% + ${offset * SLOT_PITCH}px)) scale(${offset === 0 ? 1 : 0.9})`,
                }}
              >
                <div className="h-20 w-44 rounded-[12px] bg-gradient-to-b from-paper-mist to-ash p-px shadow-subtle">
                  <div className="flex size-full items-center gap-2.5 rounded-[11px] bg-white px-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-ash bg-white">
                      <ExamMark exam={sheet.exam} className="h-3.5 w-5" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="whitespace-nowrap text-[11.5px] font-semibold leading-none text-charcoal">{sheet.name}</span>
                      <span className="whitespace-nowrap text-[10px] leading-none text-fog">{sheet.detail}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** The reference's link: a 1px run with an arrowhead into the box on its left. */
function Connector() {
  return (
    <div className="relative z-10 flex min-w-16 items-center self-stretch text-[#3b82f6]">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <ChevronLeft className="absolute left-px top-1/2 size-3 -translate-x-1/2 -translate-y-1/2" strokeWidth={2} />
      <div className="absolute right-0 top-1/2 size-2 -translate-y-1/2 translate-x-1/2 rounded-full border border-current bg-white" />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · Knowledge sync                                                        */
/* ------------------------------------------------------------------------ */

/** The reference's three routes, read off its SVG (800-wide viewBox). */
const PATH_LEFT =
  "M308.167 322.063H174.404C161.202 322.063 150.5 311.361 150.5 298.159V220.968L376.096 220.968C389.298 220.968 400 210.266 400 197.064V103.879";
const PATH_RIGHT =
  "M492.201 322.5H626.5C639.755 322.5 650.5 311.755 650.5 298.5V221L424 221C410.745 221 400 210.255 400 197V103.441";
const PATH_MIDDLE = "M400 120V740";

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const DARK = "#5e5e5e";

/** One lap of every route. */
const LOOP_SECONDS = 4;
/**
 * When each side dot first crosses into the phone, on the SVG's own clock:
 * its delay plus the share of its (reversed) route before the phone's edge.
 * Blue: 579.7 of 604.8 units; green: 578.5 of 607.3, starting at 2.66s.
 */
const SAVED_ARRIVAL = 3.83;
const PROGRESS_ARRIVAL = 6.47;

/**
 * The reference draws on 800×444 and anchors the picture to the band's
 * bottom. The phone is drawn 30 units taller here, so the whole picture sits
 * that much higher and the phone's content clears the fade.
 */
const SYNC_HEIGHT = 474;

const BASE = { saved: 248, roadmap: 64 };

function arrivalsBy(time: number, first: number) {
  return time < first ? 0 : Math.floor((time - first) / LOOP_SECONDS) + 1;
}

export function KnowledgeSync() {
  const current = usePanelCurrent();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  // useId's output is safe inside url(#…) (React 19.2 emits «_r_0_»-style ids).
  const id = useId();
  const [arrived, setArrived] = useState({ saved: 0, progress: 0 });

  // The dots are SMIL, so they keep the SVG's own clock: hold it while the
  // panel is away or off screen, and never start it under reduced motion.
  // While it runs, the phone's figures follow that clock, ticking up the
  // moment each side dot reaches the phone.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const running = current && inView && !reducedMotion;
    if (!running) {
      svg.pauseAnimations();
      return;
    }
    svg.unpauseAnimations();
    let frame = 0;
    const follow = () => {
      const time = svg.getCurrentTime();
      const saved = arrivalsBy(time, SAVED_ARRIVAL);
      const progress = arrivalsBy(time, PROGRESS_ARRIVAL);
      setArrived((prev) => (prev.saved === saved && prev.progress === progress ? prev : { saved, progress }));
      frame = window.requestAnimationFrame(follow);
    };
    frame = window.requestAnimationFrame(follow);
    return () => window.cancelAnimationFrame(frame);
  }, [current, inView, reducedMotion]);

  const roadmap = Math.min(99, BASE.roadmap + arrived.progress);

  return (
    <div
      ref={ref}
      aria-hidden
      className="flex size-full flex-col items-center justify-end overflow-hidden [mask-image:linear-gradient(black_78%,transparent)]"
    >
      <div className="relative w-[800px] shrink-0" style={{ height: SYNC_HEIGHT }}>
        <svg ref={svgRef} viewBox={`0 0 800 ${SYNC_HEIGHT}`} fill="none" className="absolute inset-0 size-full">
          <g clipPath={`url(#${id}-clip)`}>
            <path d="M400 157V197C400 210.255 389.255 221 376 221H193.5" stroke="#D4D4D4" strokeWidth="1.5" />
            <path d="M400 157V197C400 210.255 410.745 221 424 221H607" stroke="#D4D4D4" strokeWidth="1.5" />
            <path d="M150.5 264.5V298C150.5 311.255 161.245 322 174.5 322H282" stroke="#BBB" strokeWidth="1.5" />
            <path d="M650.5 265V298.5C650.5 311.755 639.755 322.5 626.5 322.5H522.5" stroke="#BBB" strokeWidth="1.5" />
            <path d="M400 133.5V294.5" stroke="#D4D4D4" strokeWidth="1.5" />

            <Traveller id={id} name="left" path={PATH_LEFT} color={BLUE} reverse />
            <Traveller id={id} name="right" path={PATH_RIGHT} color={GREEN} begin="2.66s" reverse />
            <Traveller id={id} name="middle" path={PATH_MIDDLE} color={DARK} begin="1.33s" />

            {/* The phone: the student's own account, where all three routes end */}
            <path d={`M283 318C283 304.745 293.745 294 307 294H497C510.255 294 521 304.745 521 318V${SYNC_HEIGHT}H283V318Z`} fill="#171717" />
            <path
              d={`M497 293.25C510.669 293.25 521.75 304.331 521.75 318V${SYNC_HEIGHT + 0.75}H282.25V318C282.25 304.331 293.331 293.25 307 293.25H497Z`}
              stroke="black"
              strokeWidth="1.5"
            />
            <path
              d={`M308 357.5H496C502.351 357.5 507.5 362.649 507.5 369V${SYNC_HEIGHT - 0.5}H296.5V369C296.5 362.649 301.649 357.5 308 357.5Z`}
              fill="white"
              stroke="#D4D4D4"
            />
          </g>
          <defs>
            {[
              ["left", PATH_LEFT],
              ["right", PATH_RIGHT],
              ["middle", PATH_MIDDLE],
            ].map(([name, d]) => (
              <mask key={name} id={`${id}-mask-${name}`}>
                <path d={d} fill="none" stroke="white" strokeWidth="1.5" />
              </mask>
            ))}
            {[
              ["left", BLUE],
              ["right", GREEN],
              ["middle", DARK],
            ].map(([name, color]) => (
              <radialGradient key={name} id={`${id}-glow-${name}`}>
                <stop offset="0%" stopOpacity="1" stopColor={color} />
                <stop offset="100%" stopOpacity="0" stopColor={color} />
              </radialGradient>
            ))}
            <clipPath id={`${id}-clip`}>
              <rect width="800" height={SYNC_HEIGHT} fill="white" />
            </clipPath>
          </defs>
        </svg>

        {/* The phone's chrome, at the reference's coordinates */}
        <BrandMark className="absolute left-[306px] top-[320px] h-4 text-[#fafafa]" />
        <div className="absolute left-[422px] top-[318px] flex items-center gap-3 text-[#fafafa]">
          <Search className="size-4" strokeWidth={2} />
          <Bell className="size-4" strokeWidth={2} />
          <span className="flex size-[18px] items-center justify-center rounded-full bg-white/15 text-[7.5px] font-semibold tracking-wide text-white ring-1 ring-white/20">
            AB
          </span>
        </div>

        {/* The phone's screen: what the account holds, ticking up as the dots land */}
        <div className="absolute left-[308px] top-[367px] w-[188px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[-0.02em] text-steel">Twoje postępy</span>
            <span className="flex items-center gap-1 text-[9.5px] font-medium text-fog">
              <span className="size-1.5 rounded-full bg-vivid-green" />
              Na bieżąco
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-[11px]">
            <div className="h-16 rounded-lg border border-ash bg-canvas-muted p-2.5">
              <div className="flex items-center gap-1 text-[10px] font-medium text-fog">
                <BookmarkCheck className="size-3" strokeWidth={2} />
                Zapisane
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <RollingNumber value={BASE.saved + arrived.saved} lineHeight={20} className="text-[15px] font-semibold text-charcoal" />
                <span className="text-[10px] text-fog">zadań</span>
              </div>
            </div>
            <div className="h-16 rounded-lg border border-ash bg-canvas-muted p-2.5">
              <div className="flex items-center gap-1 text-[10px] font-medium text-fog">
                <Route className="size-3" strokeWidth={2} />
                Roadmapa
              </div>
              <div className="mt-1.5 flex items-baseline">
                <RollingNumber value={roadmap} lineHeight={20} className="text-[15px] font-semibold text-charcoal" />
                <span className="text-[15px] font-semibold leading-5 text-charcoal">%</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-ash">
                <div
                  className="h-full rounded-full bg-electric-blue transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${roadmap}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* The solved task, where every route starts */}
        <div className="absolute left-[255px] top-[68px] flex h-[66px] w-[290px] items-center gap-3 rounded-[17px] border-[1.5px] border-ash bg-white px-[15px] [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.05))]">
          <div className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-transparent to-[#030712]/5 ring-1 ring-[#030712]/10">
            <div className="flex size-5 items-center justify-center rounded-full bg-black">
              <BrandMark className="h-2 text-white" />
            </div>
          </div>
          <span className="whitespace-nowrap text-sm font-semibold text-charcoal">Zadanie 12 rozwiązane</span>
          <span className="ml-auto whitespace-nowrap rounded-md border border-ash bg-white px-1.5 py-0.5 text-xs font-medium text-vivid-green">
            +2 pkt
          </span>
        </div>

        {/* On its way into the phone, the answer is saved and counted */}
        <SyncTile className="left-[106px]" icon={CloudCheck} tint="text-electric-blue" label="Zapisano" />
        <SyncTile className="left-[606px]" icon={TrendingUp} tint="text-vivid-green" label="Postęp" />
      </div>
    </div>
  );
}

/** One of the reference's travelling dots: a glow masked to its path, then the dot. */
function Traveller({
  id,
  name,
  path,
  color,
  begin,
  reverse = false,
}: {
  id: string;
  name: string;
  path: string;
  color: string;
  begin?: string;
  /** The side routes are drawn phone-first, so they run backwards. */
  reverse?: boolean;
}) {
  const motion = {
    path,
    dur: `${LOOP_SECONDS}s`,
    begin,
    repeatCount: "indefinite",
    ...(reverse ? { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" } : {}),
  };
  // Until a delayed route begins, SMIL parks the dot at the SVG's origin,
  // where it would peek into the stage's top-left corner; keep it hidden
  // until its first run.
  const reveal = begin ? <set attributeName="visibility" to="visible" begin={begin} /> : null;
  return (
    <>
      <g mask={`url(#${id}-mask-${name})`}>
        <circle r="70" fill={`url(#${id}-glow-${name})`}>
          <animateMotion {...motion} rotate="auto" />
        </circle>
      </g>
      <g visibility={begin ? "hidden" : undefined}>
        {reveal}
        <animateMotion {...motion} />
        <circle opacity="0.2" r="8" fill={color} />
        <circle r="4" fill={color} />
      </g>
    </>
  );
}

function SyncTile({
  className,
  icon: Icon,
  tint,
  label,
}: {
  className: string;
  icon: IconComponent;
  tint: string;
  label: string;
}) {
  return (
    <div
      className={cn(
        "absolute top-[177px] flex size-[88px] flex-col items-center justify-center gap-1.5 rounded-[17px] border-[1.5px] border-ash bg-white [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.05))]",
        className,
      )}
    >
      <Icon className={cn("size-8", tint)} strokeWidth={2} />
      <span className="text-[11px] font-medium leading-none text-steel">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · Subject window                                                        */
/* ------------------------------------------------------------------------ */

type SubjectTask = {
  label: string;
  icon: IconComponent;
  exam: Exam;
  sheet: string;
  number: string;
  /** The task as it is printed, formula or gap included. */
  question: React.ReactNode;
  options: string[];
  answer: number;
};

/**
 * A square root as it is printed: the sign is one stroke that runs straight
 * into the bar over the radicand, so the two always meet. Sized for the
 * question's 15px line.
 */
function Radical({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 items-stretch">
      <svg viewBox="0 0 9 20" fill="none" aria-hidden className="h-full w-[9px] shrink-0">
        <path d="M0.75 12.5L2.5 11.5L4.75 19L8.25 0.75H9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex items-end border-t-[1.25px] border-current px-px leading-none">{children}</span>
    </span>
  );
}

const SUBJECTS: SubjectTask[] = [
  {
    label: "Matematyka",
    icon: Sigma,
    exam: "matura",
    sheet: "Matura 2026 · Matematyka",
    number: "Zadanie 7",
    question: (
      <>
        Liczba{" "}
        <span className="mx-0.5 inline-flex h-6 items-center align-middle">
          (<Radical>8</Radical>
          <span className="mx-1.5">−</span>
          <Radical>2</Radical>)<span className="-mt-2.5 self-start pl-px text-[10px]">2</span>
        </span>{" "}
        jest równa
      </>
    ),
    options: ["2", "6", "10", "4√2"],
    answer: 0,
  },
  {
    label: "Polski",
    icon: BookMarked,
    exam: "e8",
    sheet: "Ósmoklasista 2026 · Język polski",
    number: "Zadanie 3",
    question: "Który środek stylistyczny zastosowano w wersie „Litwo! Ojczyzno moja! ty jesteś jak zdrowie”?",
    options: ["porównanie", "onomatopeję", "oksymoron", "hiperbolę"],
    answer: 0,
  },
  {
    label: "Angielski",
    icon: Languages,
    exam: "matura",
    sheet: "Matura 2026 · Język angielski",
    number: "Zadanie 5.2",
    question: (
      <>
        By the time we arrived at the cinema, the film <span className="inline-block w-16 border-b border-smoke" />.
      </>
    ),
    options: ["already started", "had already started", "has already started", "was already starting"],
    answer: 1,
  },
];

const LETTERS = ["A", "B", "C", "D"];

export function SubjectWindow() {
  const current = usePanelCurrent();
  const [active, setActive] = useState(0);

  return (
    <div className="size-full pt-10">
      <div className="flex size-full flex-col items-center [mask-image:linear-gradient(black_70%,transparent)]">
        <div className="flex gap-4 rounded-full bg-ash p-1.5">
          {SUBJECTS.map((subject, index) => (
            <button
              key={subject.label}
              type="button"
              aria-pressed={index === active}
              tabIndex={current ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                "focus-ring flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
                index === active ? "bg-black text-white" : "text-charcoal hover:bg-black/10",
              )}
            >
              <subject.icon className="size-4" strokeWidth={2} aria-hidden />
              {subject.label}
            </button>
          ))}
        </div>

        <div className="relative mt-2 w-full max-w-xl grow [mask-image:linear-gradient(black_80%,transparent_95%)]">
          {SUBJECTS.map((subject, index) => (
            <div
              key={subject.label}
              aria-hidden={index !== active}
              inert={index !== active}
              className={cn(
                "absolute left-0 top-0 size-full px-4 pt-4 transition-opacity duration-150 motion-reduce:transition-none",
                index !== active && "opacity-0",
              )}
            >
              <div className="flex min-h-full flex-col rounded-2xl rounded-b-none border border-b-0 border-black/20 bg-white text-left ring-4 ring-black/10">
                <div className="grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-ash px-2.5 text-sm">
                  <div className="flex items-center gap-2 px-2">
                    {[0, 1, 2].map((dot) => (
                      <div key={dot} className="size-2 rounded-full border border-black/70" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap px-2 text-sm text-fog">
                    <ExamMark exam={subject.exam} className="h-3.5 w-5" />
                    {subject.sheet}
                  </div>
                  <div className="flex justify-end">
                    <span className="rounded p-1 text-fog">
                      <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden />
                    </span>
                  </div>
                </div>

                <div className="px-6 pt-6">
                  <p className="text-xs text-fog">{subject.number} · 1 pkt</p>
                  <p className="mt-2 text-pretty text-[15px] font-medium leading-7 text-charcoal">{subject.question}</p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {subject.options.map((option, optionIndex) => {
                      const picked = optionIndex === subject.answer;
                      return (
                        <div
                          key={option}
                          className={cn(
                            "flex h-10 items-center gap-3 rounded-lg border px-3 text-sm",
                            picked ? "border-charcoal text-charcoal" : "border-ash text-steel",
                          )}
                        >
                          <span className="flex w-3.5 shrink-0 justify-center text-xs font-medium text-fog">
                            {picked ? <Check className="size-3.5 text-charcoal" strokeWidth={2.5} aria-hidden /> : LETTERS[optionIndex]}
                          </span>
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
