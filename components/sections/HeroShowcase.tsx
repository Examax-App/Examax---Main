"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BadgePercent, PencilLine, Route } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { HeroPlayer } from "@/components/hero-film/HeroPlayer";
import type { FilmTab } from "@/components/hero-film/timeline";
import { CornerMarks, RULE_EDGE } from "@/components/ui/CornerMarks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

type HeroTab = {
  key: FilmTab;
  label: string;
  icon: IconComponent;
  accent: Accent;
  title: string;
  description: string;
  href: string;
};

/**
 * Each tab plays its own loop of the dashboard (see `components/hero-film`),
 * and the strip opens on Roadmapa. The third tab mirrors the Product menu's
 * third card: Śledzenie postępów, with the same tangerine progress badge.
 */
const tabs: HeroTab[] = [
  {
    key: "practice",
    label: "Trening",
    icon: PencilLine,
    accent: "green",
    title: "Trening zadań",
    description: "Zadania z arkuszy CKE z natychmiastowym sprawdzaniem",
    href: "/training",
  },
  {
    key: "roadmap",
    label: "Roadmapa",
    icon: Route,
    accent: "blue",
    title: "Roadmapa nauki",
    description: "Cały egzamin rozpisany na kroki — zawsze wiesz, co dalej",
    href: "/roadmap",
  },
  {
    key: "progress",
    label: "Postępy",
    icon: BadgePercent,
    accent: "tangerine",
    title: "Śledzenie postępów",
    description: "Opanowanie i skuteczność na żywo, temat po temacie",
    href: "/progress",
  },
];


function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/**
 * How far the brackets have faded in, 0-1 over the first 260px of scroll.
 *
 * Quantised to twentieths so a scroll gesture re-renders the marks a handful
 * of times rather than on every frame.
 */
function useBracketReveal() {
  return useSyncExternalStore(
    subscribeScroll,
    () => Math.round(Math.min(window.scrollY / 260, 1) * 20) / 20,
    () => 0,
  );
}

/**
 * The hero product stage: the white notch carrying the feature tabs (keyboard
 * support, the selected pill drawn as the only bordered box), the framed
 * dashboard window whose bottom edge is cut by the band, and the dark
 * contextual card.
 *
 * The selected pill used to be a separate absolutely-positioned thumb measured
 * off the buttons' offsets. It could — and did — end up out of register with
 * the pill it was meant to be sitting under. The state it represents is now
 * carried by the button's own fill and border, so there is nothing left to
 * desync.
 */
export function HeroShowcase() {
  const [active, setActive] = useState<FilmTab>("roadmap");
  const goToScene = useCallback((key: FilmTab) => setActive(key), []);
  // When a loop has played through once, hand over to the next tab in strip
  // order, so the hero runs as one continuous preview. A click jumps to that
  // tab's loop and the cycle carries on from there.
  const advance = useCallback(
    () =>
      setActive((current) => {
        const index = tabs.findIndex((tab) => tab.key === current);
        return tabs[(index + 1) % tabs.length].key;
      }),
    [],
  );
  const tabRefs = useRef<Partial<Record<FilmTab, HTMLButtonElement | null>>>({});

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.key === active);
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === null) return;
    event.preventDefault();
    const key = tabs[next].key;
    goToScene(key);
    tabRefs.current[key]?.focus();
  };

  const activeTab = tabs.find((tab) => tab.key === active)!;
  const bracketReveal = useBracketReveal();

  return (
    <div className="col-rules relative overflow-hidden bg-paper-mist">
      {/* Crop marks where the column rules meet this band's edges. They
          fade in as the page scrolls, so the band arrives quietly rather
          than announcing itself on load. */}
      <CornerMarks offset={RULE_EDGE} progress={bracketReveal} />
      {/* White notch — a 64px plateau between two shoulders. The shoulder is
          the reference's own path (lifted from dub.co's live DOM, 85x64): a
          short ease off the top edge, a long STRAIGHT diagonal, then a short
          ease onto the plateau. The straight run is what makes it read as a
          line opening out rather than a hill; the two stacked ellipses this
          replaced dropped 78px over 100px and plunged through the middle.

          Below md the tabs wrap onto two rows, which a fixed-height silhouette
          cannot hold, so — as in the reference — the notch steps aside and
          the pills sit straight on the band. */}
      <div className="relative z-[2] flex justify-center px-4 pb-5 pt-6 md:h-16 md:p-0">
        {/* Each shoulder overlaps the plateau by 1px so no hairline can show
            at the seam. */}
        <svg
          aria-hidden
          viewBox="0 0 85 64"
          className="-mr-px hidden h-16 w-[85px] shrink-0 md:block"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
            fill="#fff"
          />
        </svg>
        <div
          role="tablist"
          aria-label="Poznaj produkt Examax"
          onKeyDown={onKeyDown}
          /* The row keeps its measured width; the pills grow to span it and
             run right up to the shoulders, whose shallow start is the air.
             It stacks above the shoulders: they overlap it by 1px, and the
             right one, painting later, would otherwise shave the end pill's
             border and shadow. */
          // Three equal columns at every width: a grid on phones, where the
          // pills would otherwise wrap, and equal flex items from md.
          className="relative z-10 grid w-full grid-cols-3 gap-1.5 md:flex md:w-[min(36rem,calc(100vw-14rem))] md:items-center md:justify-center md:gap-2 md:bg-white"
        >
          {tabs.map((tab) => {
            const selected = tab.key === active;
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[tab.key] = el;
                }}
                type="button"
                role="tab"
                id={`hero-tab-${tab.key}`}
                aria-selected={selected}
                aria-controls="hero-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => goToScene(tab.key)}
                className={cn(
                  "focus-ring group inline-flex h-[34px] min-w-0 flex-1 basis-0 cursor-pointer items-center justify-center gap-1.5 rounded-buttons border px-2 text-body leading-none transition-colors duration-200 md:gap-2 md:px-3.5 md:text-body-lg",
                  // `flex-1 basis-0`: three equal pills whatever their labels,
                  // so the strip reads as one balanced control.
                  //
                  // Only the selected pill is drawn as a box. Bordering all
                  // three turns a segmented control into three loose
                  // buttons — this single rule is what makes the group read
                  // as one object, as it does in the reference. Below md there
                  // is no white shelf behind them, so the idle pills take a
                  // hairline to stay visible against the band.
                  selected
                    ? "border-ash bg-white text-charcoal shadow-subtle"
                    : "border-ash bg-paper-mist text-steel hover:text-charcoal md:border-transparent",
                )}
              >
                {/* The icon grows a touch on hover — the only motion here. */}
                <AccentTile
                  icon={tab.icon}
                  accent={tab.accent}
                  className="transition-transform duration-200 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
                {tab.label}
              </button>
            );
          })}
        </div>
        <svg
          aria-hidden
          viewBox="0 0 85 64"
          className="-ml-px hidden h-16 w-[85px] shrink-0 md:block"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M35 45C27.6905 56.6952 13.7916 63.9997 0 64V0H85C71.2085 0 58.3095 7.30481 51 19L35 45Z"
            fill="#fff"
          />
        </svg>
      </div>

      {/* Product window — 16px top radius, bottom flush: the frame is cut by
          the band edge rather than faded, exactly as in the reference. It sits
          low in the band, so the tabs above it have room to breathe; from md
          the extra 14px makes up for the notch shrinking from 78px to 64px,
          so the window has not moved.

          The panel carries the film's own aspect ratio instead of a fixed
          height, so the Player never letterboxes and the window fills the
          content column at every width. */}
      <Container className="relative pt-9 md:pt-[50px]">
        <div
          role="tabpanel"
          id="hero-panel"
          aria-labelledby={`hero-tab-${active}`}
          className="aspect-[1200/640] w-full overflow-hidden"
        >
          <HeroPlayer tab={active} onFinished={advance} />
        </div>
      </Container>

      {/* Dark contextual card pinned to the bottom edge of the stage */}
      {/* On phones the stage is short, so the card shrinks to one line (icon,
          title, button) and leaves the film visible above it. */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2">
        <div
          key={active}
          role="status"
          aria-live="polite"
          className="animate-view-swap pointer-events-auto flex items-center gap-3 rounded-cards bg-charcoal p-2 pl-2.5 text-white shadow-md sm:gap-4 sm:rounded-largecards sm:p-3.5 sm:pl-5"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-buttons bg-white/10 sm:size-10 sm:rounded-cards">
            {/* One colour for every tab: the card is monochrome, the tab
                strip above carries the accents. */}
            <activeTab.icon className="size-4 text-white sm:size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body font-semibold leading-tight sm:text-body-lg">
              {activeTab.title}
            </p>
            <p className="hidden truncate text-body text-silver sm:block">
              {activeTab.description}
            </p>
          </div>
          <Link
            href={activeTab.href}
            className="focus-ring shrink-0 rounded-buttons bg-white px-3 py-1.5 text-body-sm font-medium leading-5 text-charcoal transition-all duration-200 hover:ring-4 hover:ring-white/20 sm:px-5 sm:py-2 sm:text-body"
          >
            Zobacz więcej
          </Link>
        </div>
      </div>
    </div>
  );
}
