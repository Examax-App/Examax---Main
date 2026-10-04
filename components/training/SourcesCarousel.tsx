"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, ListChecks, RefreshCw } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { TaskFigure, type FigureName } from "@/components/training/TaskFigure";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { prefetchFor } from "@/lib/routes";
import type { IconComponent } from "@/lib/icon";

/* ---------------------------------------------------------------------------
 * "Skąd biorą się zadania" — dub.co/partners' "Loved by modern SaaS
 * companies", one to one in structure: a heading block between two dotted
 * wings, then a muted band holding a 2:1 carousel of stories — picture,
 * colour wash rising from the bottom, tag top right, headline and link at
 * the bottom left — with a row of pill tabs underneath.
 *
 * The reference tells customer stories. Examax has none yet (and no
 * placeholder testimonials, by standing decision), so the stories are about
 * the one thing a student has to trust here: where the tasks come from.
 * Each picture is a sheet from the archive rather than a photograph.
 * ------------------------------------------------------------------------- */

export type Story = {
  tab: string;
  icon: IconComponent;
  tag: string;
  colour: string;
  figure: FigureName;
  title: string;
  link: { href: string; label: string };
  /** The slide's picture; without one, two sheets from the archive with the figure on them. */
  picture?: React.ReactNode;
};

const STORIES: Story[] = [
  {
    tab: "Arkusze",
    icon: FileText,
    tag: "Źródło",
    colour: "#2563eb",
    figure: "rightTriangle",
    title: "Każde zadanie z arkusza CKE — z sesją, numerem i punktacją",
    link: { href: "/signup", label: "Zacznij trenować" },
  },
  {
    tab: "Punktacja",
    icon: ListChecks,
    tag: "Zasady oceniania",
    colour: "#15803d",
    figure: "bars",
    title: "Zasady oceniania przepisane kryterium po kryterium",
    link: { href: "/help", label: "Jak liczymy punkty" },
  },
  {
    tab: "Informatory",
    icon: BookOpen,
    tag: "Nowa formuła",
    colour: "#7c3aed",
    figure: "parabola",
    title: "Zadania z informatorów CKE do nowej formuły egzaminu",
    link: { href: "/help", label: "Dowiedz się więcej" },
  },
  {
    tab: "Aktualizacje",
    icon: RefreshCw,
    tag: "Co sesję",
    colour: "#1e40af",
    figure: "sequence",
    title: "Nowy rocznik trafia do bazy po każdej sesji egzaminacyjnej",
    link: { href: "/updates", label: "Zobacz aktualizacje" },
  },
];

const AUTOPLAY = 6000;

/** One printed page of a CKE sheet — the story's "photograph". */
export function SheetPage({ figure, className }: { figure: FigureName; className?: string }) {
  return (
    <div className={cn("absolute aspect-[210/297] rounded-[6px] bg-white p-[5%] shadow-2xl", className)}>
      <div className="flex items-start justify-between border-b border-ash pb-[4%]">
        {/* The sheet's letterhead block — drawn plain, since the colour wash
            over the picture would tint the official CKE mark */}
        <div className="h-[18px] w-[14%] rounded-[2px] bg-smoke sm:h-6" />
        <div className="w-[55%] space-y-1">
          <div className="h-1 w-full rounded-full bg-smoke" />
          <div className="h-1 w-3/4 rounded-full bg-ash" />
        </div>
      </div>
      <p className="mt-[6%] font-serif text-[7px] font-bold text-charcoal sm:text-[10px]">Zadanie 14. (0–2)</p>
      <div className="mt-[3%] space-y-1 sm:space-y-1.5">
        {[100, 92, 96, 60].map((width, index) => (
          <div key={index} className="h-[3px] rounded-full bg-ash sm:h-1" style={{ width: `${width}%` }} />
        ))}
      </div>
      <div className="mx-auto mt-[8%] w-[62%] text-charcoal">
        <TaskFigure name={figure} className="size-full" />
      </div>
      <div className="mt-[6%] space-y-1 sm:space-y-1.5">
        {[88, 100, 70].map((width, index) => (
          <div key={index} className="h-[3px] rounded-full bg-paper-mist sm:h-1" style={{ width: `${width}%` }} />
        ))}
      </div>
    </div>
  );
}

function Slide({ story, current }: { story: Story; current: boolean }) {
  return (
    <div
      aria-hidden={!current}
      className="relative isolate flex aspect-[1.8] w-[calc(100%-2rem)] shrink-0 select-none flex-col overflow-hidden rounded-xl bg-ash p-3 text-left text-white sm:aspect-[2] sm:p-10"
    >
      {/* The picture: sheets from the archive on the desk, unless the story brings its own */}
      <div aria-hidden className="absolute inset-0 bg-[#e9ecef]">
        {story.picture ?? (
          <>
            <SheetPage figure={story.figure} className="right-[24%] top-[8%] w-[30%] rotate-[-7deg] opacity-90" />
            <SheetPage figure={story.figure} className="right-[7%] top-[-4%] w-[34%] rotate-[4deg]" />
          </>
        )}
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(100%_100%,transparent,#0009)]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-current to-85% opacity-90" style={{ color: story.colour }} />

      <div className="relative flex h-full flex-col justify-between">
        <div className="relative flex h-6 shrink-0 items-start sm:h-8">
          <Logo inverted className="scale-90 sm:scale-100 origin-left" />
        </div>
        <div>
          <p className="relative max-w-[60%] text-balance text-base sm:text-2xl lg:text-4xl">{story.title}</p>
          <Link
            href={story.link.href}
            prefetch={prefetchFor(story.link.href)}
            tabIndex={current ? 0 : -1}
            className="group mt-2 inline-flex items-center gap-1 text-sm font-normal leading-none transition-[font-weight] hover:font-medium sm:mt-4 sm:text-base md:mt-8"
          >
            {story.link.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
      <span className="absolute right-4 top-3 rounded-full border border-white/40 px-2 py-1 text-xs text-white md:right-10 md:top-8 md:px-3 md:py-2">
        {story.tag}
      </span>
    </div>
  );
}

function DotWing({ id, side }: { id: string; side: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 h-[calc(100%-4rem)] w-[600px] -translate-y-1/2 text-black/10",
        side === "left"
          ? "right-full [mask-image:linear-gradient(90deg,transparent,black_50%)]"
          : "left-full translate-x-[12px] [mask-image:linear-gradient(270deg,transparent,black_50%)]",
      )}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * /training's band by default; /simulation passes its own heading and
 * stories (the steps of one sitting), the frame and motion unchanged.
 */
export function SourcesCarousel({
  id = "sources",
  title = "Skąd biorą się zadania",
  sub = "Nie generujemy pytań. Każde zadanie ma źródło i punktację, którą da się sprawdzić.",
  stories = STORIES,
  tail = true,
}: {
  id?: string;
  title?: string;
  sub?: string;
  stories?: Story[];
  /** The white run-out before the closing band; off when another band follows. */
  tail?: boolean;
} = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  useEffect(() => {
    if (paused || !inView || reducedMotion) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % stories.length), AUTOPLAY);
    return () => window.clearTimeout(timer);
  }, [index, paused, inView, reducedMotion, stories.length]);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative overflow-clip bg-white px-4"
    >
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-[2280px] -translate-x-1/2">
          <div className="absolute inset-x-[580px] inset-y-0">
            <DotWing id={`${id}-dots-left`} side="left" />
            <DotWing id={`${id}-dots-right`} side="right" />
          </div>
        </div>

        <Reveal className="relative mx-auto w-full max-w-[640px] px-4 text-center">
          <h2
            id={`${id}-heading`}
            className="text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl md:text-5xl md:leading-[1.2]"
          >
            {title}
          </h2>
          <p className="mt-3 text-pretty text-lg text-fog">{sub}</p>
        </Reveal>

        <div
          ref={ref}
          className="relative mt-12 border-y border-ash bg-canvas-muted py-4 sm:px-4 sm:py-8"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          role="region"
          aria-roledescription="karuzela"
          aria-label={title}
        >
          <div className="overflow-hidden">
            {/* Each step is one slide plus the 1rem gap: 100% − 1rem of the track */}
            <div
              className="flex gap-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(calc(1rem + ${index} * (1rem - 100%)))` }}
            >
              {stories.map((story, i) => (
                <Slide key={story.tab} story={story} current={i === index} />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-8 w-fit px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              {stories.map((story, i) => {
                const active = i === index;
                return (
                  <button
                    key={story.tab}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={active}
                    className="group isolate rounded-full p-0.5 sm:p-1.5"
                  >
                    <span
                      className={cn(
                        "flex h-11 w-36 items-center justify-center gap-2 rounded-full px-5 text-body font-semibold transition-colors duration-150",
                        active
                          ? "bg-charcoal text-white"
                          : "bg-canvas-muted text-charcoal group-hover:bg-paper-mist group-active:bg-ash",
                      )}
                    >
                      <story.icon className="size-4 shrink-0" strokeWidth={2} />
                      {story.tab}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Air before the closing band: the page runs on in white for a beat,
          its column rules fading out, as the reference ends its last section
          before the CTA rather than butting the carousel into it. */}
      {tail ? (
        <div aria-hidden className="relative mx-auto h-20 max-w-[var(--page-max-width)] sm:h-28">
          <div className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(black,transparent)]" />
        </div>
      ) : null}
    </section>
  );
}
