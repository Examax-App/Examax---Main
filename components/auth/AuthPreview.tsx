"use client";

import { useEffect, useRef, useState } from "react";
import { PosterScene } from "@/components/hero-film/HeroPoster";
import { HEIGHT, WIDTH, type FilmTab } from "@/components/hero-film/timeline";
import { cn } from "@/lib/cn";

/** How long each screen holds while its bar fills. */
const SLIDE_MS = 5000;

/**
 * The longest step the clock takes in one frame. After the tab was hidden or
 * the device slept, the first frame back would otherwise jump the bar (or
 * skip a slide); capped, the bar simply carries on from where it stopped.
 */
const MAX_STEP_MS = 100;

/** The still's drawn width; the composition is scaled down to it. */
const STILL_W = 860;
const SCALE = STILL_W / WIDTH;

/*
 * The three screens, in the order a learner meets them: practise on real
 * tasks, see the whole exam laid out, watch the result grow. Each one is the
 * dashboard's own still (the landing hero's poster scene), not a new
 * screen. No one-letter word ends a line (Polish typesetting): each is bound
 * to the next word with a no-break space.
 */
const SLIDES: Array<{ tab: FilmTab; name: string; headline: string; description: string }> = [
  {
    tab: "practice",
    name: "Trening",
    headline: "Ćwicz na prawdziwych zadaniach z arkuszy CKE",
    description: "Zadania z egzaminów z poprzednich lat, sprawdzane od razu, w jednej bibliotece — na Ósmoklasistę i Maturę.",
  },
  {
    tab: "roadmap",
    name: "Roadmapa",
    headline: "Cały egzamin rozpisany na kroki",
    description: "Roadmapa prowadzi od pierwszego rozdziału do dnia egzaminu — zawsze wiesz, co zrobić dziś.",
  },
  {
    tab: "progress",
    name: "Postępy",
    headline: "Zobacz, jak rośnie Twój wynik",
    description: "Opanowanie i skuteczność na żywo, temat po temacie — i ile brakuje do egzaminu.",
  },
];

/**
 * The side panel: a headline over a still of the product bleeding off the
 * panel's right and bottom edges, cycling through three screens. Three bars
 * under the copy show where it is — the active one fills over five seconds,
 * then the next screen takes over; any bar jumps to its screen, and a mouse
 * resting on the bars holds the current one.
 *
 * Built so nothing can stall or glitch on any device:
 * - the clock is requestAnimationFrame, not a CSS animation's end event, so a
 *   missed event (a hidden tab, a resize, reduced motion) can't stop it; it
 *   writes the bar's width straight to the DOM, with no render per frame;
 * - only a mouse on the bars pauses it — a pointer resting on the picture, or
 *   a tap on a touch screen, never leaves it stuck;
 * - the stills are plain HTML scaled with CSS (PosterScene), not SVG
 *   foreignObject, which renders unreliably inside fading layers; and the
 *   incoming still fades in over the outgoing one, which stays solid beneath,
 *   so the change never dims or flashes the panel.
 */
export function AuthPreview() {
  const [slide, setSlide] = useState({ index: 0, previous: -1 });
  const fills = useRef<Array<HTMLSpanElement | null>>([]);
  const paused = useRef(false);
  const { index, previous } = slide;

  useEffect(() => {
    let progress = 0;
    let last = performance.now();
    let frame = 0;
    fills.current.forEach((fill) => fill?.style.setProperty("transform", "scaleX(0)"));

    const tick = (now: number) => {
      const step = Math.min(now - last, MAX_STEP_MS);
      last = now;
      if (!paused.current) progress = Math.min(1, progress + step / SLIDE_MS);
      fills.current[index]?.style.setProperty("transform", `scaleX(${progress})`);
      if (progress >= 1) {
        setSlide({ index: (index + 1) % SLIDES.length, previous: index });
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index]);

  const show = (next: number) => setSlide((current) => (current.index === next ? current : { index: next, previous: current.index }));

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="animate-auth-rise px-8 pt-32 lg:px-14">
        {/* Every slide's copy shares one grid cell, so the block is as tall as
            the longest and the bars and screen below never jump. */}
        <div className="grid">
          {SLIDES.map((item, i) => (
            <div
              key={item.tab}
              aria-hidden={i !== index}
              className={cn("[grid-area:1/1]", i === index ? "animate-auth-rise" : "invisible")}
            >
              <h2 className="text-balance text-2xl font-semibold leading-tight text-charcoal lg:text-[28px]">{item.headline}</h2>
              <p className="mt-3 max-w-sm text-pretty text-sm leading-6 text-fog">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Only a mouse on the bars themselves holds the slide: resting the
            pointer on the picture must not look like a stuck slider. */}
        <div
          className="mt-8 flex max-w-sm gap-2"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") paused.current = true;
          }}
          onPointerLeave={() => {
            paused.current = false;
          }}
        >
          {SLIDES.map((item, i) => (
            <button
              key={item.tab}
              type="button"
              aria-label={`Pokaż: ${item.name}`}
              aria-current={i === index}
              onClick={() => show(i)}
              className="focus-ring group/bar relative flex h-4 min-w-0 flex-1 cursor-pointer items-center rounded-full"
            >
              <span className="h-[3px] w-full rounded-full bg-black/10 transition-colors group-hover/bar:bg-black/15" />
              <span
                ref={(el) => {
                  fills.current[i] = el;
                }}
                className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 origin-left rounded-full bg-charcoal"
                style={{ transform: "scaleX(0)" }}
              />
            </button>
          ))}
        </div>
      </div>

      <div aria-hidden className="relative mt-10 grow overflow-hidden">
        {/* Rests on the panel's foot; in a short panel it hangs from the top of its area and the foot is cut */}
        <div
          className="animate-auth-rise absolute left-8 top-[max(0px,calc(100%-var(--still-h)))] [animation-delay:120ms] lg:left-14"
          style={{ width: STILL_W, height: HEIGHT * SCALE, ["--still-h" as string]: `${HEIGHT * SCALE}px` }}
        >
          {/* The shadow sits on a plain box with the window's rounded top — cheaper than a filter over fading layers */}
          <div className="relative size-full rounded-t-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            {SLIDES.map((item, i) => (
              <div
                key={item.tab}
                className={cn(
                  "absolute inset-0 overflow-hidden rounded-t-[10px] [will-change:opacity]",
                  i === index
                    ? "z-20 opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                    : i === previous
                      ? "z-10 opacity-100"
                      : "z-0 opacity-0",
                )}
              >
                <div className="origin-top-left" style={{ transform: `scale(${SCALE})` }}>
                  <PosterScene tab={item.tab} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
