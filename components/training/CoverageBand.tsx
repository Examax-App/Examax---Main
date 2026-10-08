"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarClock, CircleCheck, ListChecks, PencilLine, RefreshCcw, Route, Zap } from "lucide-react";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Reveal } from "@/components/ui/Reveal";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/* ---------------------------------------------------------------------------
 * The grey stats band — dub.co/partners' "Battle-tested tracking and payouts
 * infrastructure", one to one in structure: a 400px picture cut by a 90%
 * fade, the heading block, then three mono figures in the accent's two dark
 * shades, rolling up from zero as they come into view.
 *
 * The reference's picture is a dotted globe with "New referral sale" cards
 * dropping into a stack beside it. Examax's audience is one country, so the
 * globe becomes a dotted map of Poland; the cards are what students across
 * the country are doing on Examax right now — new roadmaps, task sets,
 * lessons, reviews, mastered topics — and each one's city lights up as it
 * lands.
 *
 * PLACEHOLDER DATA — the figures and the feed are illustrative.
 * ------------------------------------------------------------------------- */

/** Poland's border, simplified to ~60 points (lon, lat). */
const BORDER: Array<[number, number]> = [
  [14.22, 53.93], [14.9, 54.06], [15.9, 54.24], [16.7, 54.57], [17.6, 54.78],
  [18.35, 54.83], [18.62, 54.65], [18.55, 54.42], [18.95, 54.37], [19.63, 54.44],
  [20.4, 54.39], [21.3, 54.33], [22.2, 54.35], [22.79, 54.36], [23.35, 54.24],
  [23.5, 53.97], [23.62, 53.62], [23.9, 53.2], [23.88, 52.92], [23.65, 52.62],
  [23.2, 52.32], [23.55, 52.1], [23.65, 51.72], [23.9, 51.37], [24.12, 51.07],
  [23.95, 50.75], [23.55, 50.44], [23.2, 50.3], [22.72, 49.95], [22.62, 49.55],
  [22.9, 49.1], [22.56, 49.08], [22.0, 49.24], [21.55, 49.43], [21.0, 49.39],
  [20.47, 49.42], [20.08, 49.2], [19.78, 49.2], [19.5, 49.55], [19.18, 49.43],
  [18.85, 49.52], [18.58, 49.9], [18.08, 50.0], [17.7, 50.12], [17.2, 50.38],
  [16.9, 50.45], [16.6, 50.2], [16.25, 50.5], [16.35, 50.66], [15.95, 50.72],
  [15.5, 50.8], [15.0, 51.02], [14.82, 51.36], [14.72, 51.62], [14.6, 51.98],
  [14.72, 52.25], [14.55, 52.62], [14.15, 52.84], [14.4, 53.25], [14.25, 53.7],
];

const MAP = { width: 378, height: 358, spacing: 8.5 };
const LON0 = 14.0;
const LAT0 = 54.95;
const SCALE_Y = 60;
const SCALE_X = SCALE_Y * Math.cos((52 * Math.PI) / 180);

function project([lon, lat]: [number, number]): [number, number] {
  return [(lon - LON0) * SCALE_X, (LAT0 - lat) * SCALE_Y];
}

const OUTLINE = BORDER.map(project);

function inside(x: number, y: number) {
  let hit = false;
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i];
    const [xj, yj] = OUTLINE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Every dot as one zero-length stroke with a round cap: one path, not a thousand circles. */
const DOTS = (() => {
  let d = "";
  for (let y = MAP.spacing / 2; y < MAP.height; y += MAP.spacing) {
    for (let x = MAP.spacing / 2; x < MAP.width; x += MAP.spacing) {
      if (inside(x, y)) d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    }
  }
  return d;
})();

type City = { name: string; at: [number, number] };

const CITIES: Record<string, City> = {
  gdansk: { name: "Gdańsk", at: [18.65, 54.35] },
  szczecin: { name: "Szczecin", at: [14.55, 53.43] },
  poznan: { name: "Poznań", at: [16.93, 52.41] },
  warszawa: { name: "Warszawa", at: [21.01, 52.23] },
  bialystok: { name: "Białystok", at: [23.16, 53.13] },
  lodz: { name: "Łódź", at: [19.46, 51.76] },
  wroclaw: { name: "Wrocław", at: [17.04, 51.11] },
  lublin: { name: "Lublin", at: [22.57, 51.25] },
  krakow: { name: "Kraków", at: [19.94, 50.06] },
  olsztyn: { name: "Olsztyn", at: [20.49, 53.78] },
  rzeszow: { name: "Rzeszów", at: [22.0, 50.04] },
  katowice: { name: "Katowice", at: [19.02, 50.26] },
};

/**
 * What students across the country are doing right now — building
 * roadmaps, putting task sets together, finishing lessons and reviews,
 * mastering topics — one card per event, each in its area's chip colour.
 */
type Activity = {
  city: keyof typeof CITIES;
  icon: IconComponent;
  accent: Accent;
  action: string;
  stat: { label: string; value: string };
};

const FEED: Activity[] = [
  { city: "krakow", icon: Route, accent: "blue", action: "Nowa roadmapa", stat: { label: "Plan", value: "31 tygodni" } },
  { city: "gdansk", icon: PencilLine, accent: "green", action: "Nowy zestaw zadań", stat: { label: "Temat", value: "Procenty" } },
  { city: "warszawa", icon: CircleCheck, accent: "green", action: "Temat opanowany", stat: { label: "Temat", value: "Funkcje" } },
  { city: "wroclaw", icon: ListChecks, accent: "green", action: "Quiz diagnostyczny", stat: { label: "Tematy", value: "24" } },
  { city: "lublin", icon: RefreshCcw, accent: "blue", action: "Powtórka zrobiona", stat: { label: "Seria", value: "12 dni" } },
  { city: "poznan", icon: CalendarClock, accent: "lavender", action: "Plan przeliczony", stat: { label: "Do egzaminu", value: "30 tyg." } },
  { city: "bialystok", icon: BookOpen, accent: "blue", action: "Lekcja ukończona", stat: { label: "Temat", value: "Lektury" } },
  { city: "katowice", icon: PencilLine, accent: "green", action: "Nowy zestaw zadań", stat: { label: "Temat", value: "Logarytmy" } },
  { city: "szczecin", icon: Route, accent: "blue", action: "Nowa roadmapa", stat: { label: "Plan", value: "26 tygodni" } },
  { city: "lodz", icon: Zap, accent: "yellow", action: "Pytanie do Korepetytora", stat: { label: "Temat", value: "Parabola" } },
  { city: "olsztyn", icon: CircleCheck, accent: "green", action: "Temat opanowany", stat: { label: "Temat", value: "Trapez" } },
  { city: "rzeszow", icon: RefreshCcw, accent: "blue", action: "Powtórka zrobiona", stat: { label: "Seria", value: "7 dni" } },
];

const CARD_PITCH = 84;
const CARDS = 4;
const BEAT = 2200;

function FeedCard({ item }: { item: Activity }) {
  return (
    <div className="rounded-lg border border-ash bg-white p-1.5 shadow-subtle">
      <div className="flex items-center gap-1.5 px-1 pb-1.5 pt-0.5">
        <AccentTile icon={item.icon} accent={item.accent} size="xs" />
        <span className="truncate text-[11px] font-semibold text-charcoal">{item.action}</span>
        <span className="ml-auto shrink-0 text-[9px] text-silver">teraz</span>
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-md bg-canvas-muted px-2 py-1.5">
        <div className="flex flex-col">
          <span className="text-[10px] text-fog">Miasto</span>
          <span className="truncate text-[10px] font-semibold text-graphite">{CITIES[item.city].name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-fog">{item.stat.label}</span>
          <span className="truncate text-[10px] font-semibold text-graphite">{item.stat.value}</span>
        </div>
      </div>
    </div>
  );
}

function CoverageMap() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(CARDS);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => setCount((c) => c + 1), BEAT);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  // Newest on top: the stack grows downwards and the oldest falls out below.
  const shown = Array.from({ length: CARDS + 1 }, (_, k) => count - k).filter((i) => i >= 0);
  const latest = FEED[count % FEED.length];
  const [px, py] = project(CITIES[latest.city].at);

  return (
    <div ref={ref} aria-hidden inert className="relative size-full">
      {/* The map, where the reference has its globe: dots only */}
      <div
        className="absolute left-[8%] top-[40px] md:left-[14%]"
        style={{ width: MAP.width, height: MAP.height }}
      >
        <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="size-full overflow-visible">
          <path d={DOTS} stroke="#262626" strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" />
          <g key={count} transform={`translate(${px} ${py})`}>
            <circle r="5" className="animate-map-ping fill-vivid-green [transform-box:fill-box] [transform-origin:center]" />
            <circle r="4" className="fill-vivid-green" stroke="white" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* The feed: each checked answer drops in on top */}
      <div className="absolute right-0 top-[72px] w-[184px] md:right-[8%]" style={{ height: CARDS * CARD_PITCH }}>
        {shown.map((index) => {
          const position = count - index;
          return (
            <div
              key={index}
              className={cn(
                "absolute inset-x-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                position === 0 && "animate-slide-up-fade",
                position >= CARDS && "opacity-0",
              )}
              style={
                {
                  transform: `translateY(${position * CARD_PITCH}px)`,
                  "--offset": "-12px",
                } as React.CSSProperties
              }
            >
              <FeedCard item={FEED[index % FEED.length]} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FIGURES = [
  { value: 18420, label: "zadań z arkuszy w bazie" },
  { value: 41, label: "arkuszy CKE w treningu" },
  { value: 11, label: "roczników egzaminów, od 2015" },
];

function Figures() {
  const { ref, inView: shown } = useInView<HTMLDivElement>(0.4, true);

  return (
    <div ref={ref} className="grid w-full max-w-[700px] grid-cols-1 gap-8 md:grid-cols-3">
      {FIGURES.map((figure) => (
        <div key={figure.label} className="flex flex-col place-content-center items-center gap-2.5">
          <RollingNumber
            value={shown ? figure.value : 0}
            lineHeight={48}
            className="font-geist-mono text-4xl font-medium text-[#14532d] sm:text-5xl"
          />
          <span className="text-base text-[#15803d] sm:text-xs">{figure.label}</span>
        </div>
      ))}
    </div>
  );
}

export function CoverageBand() {
  return (
    <section
      id="coverage"
      aria-labelledby="coverage-heading"
      className="relative overflow-clip border-b border-ash bg-canvas-muted px-4"
    >
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash pb-24">
        <div className="relative mx-auto flex w-full max-w-[900px] flex-col px-4">
          <div className="-mt-8 hidden h-[400px] w-full grow overflow-hidden [mask-image:linear-gradient(black_90%,transparent)] sm:block">
            <CoverageMap />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-between gap-16 text-center">
            <Reveal className="mx-auto mt-24 w-full max-w-[580px] sm:mt-8">
              <h2
                id="coverage-heading"
                className="text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl"
              >
                Cała baza CKE, sprawdzana w sekundę
              </h2>
              <p className="mt-3 text-pretty text-lg text-fog">
                Zadania z arkuszy od 2015 roku, każde z zasadami oceniania — i
                każda odpowiedź sprawdzona od razu,{" "}
                <span className="font-medium italic">o każdej porze</span>.
              </p>
            </Reveal>
            <Figures />
          </div>
        </div>
      </div>
    </section>
  );
}
