"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Bot, PencilLine, Route } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { HeroDashboard, type HeroView } from "@/components/mockups/HeroDashboard";
import { cn } from "@/lib/cn";

type HeroTab = {
  key: HeroView;
  label: string;
  icon: LucideIcon;
  accent: Accent;
  title: string;
  description: string;
  href: string;
};

const tabs: HeroTab[] = [
  {
    key: "roadmap",
    label: "Roadmapa",
    icon: Route,
    accent: "tangerine",
    title: "Roadmapa nauki",
    description: "Cały egzamin rozpisany na kroki — zawsze wiesz, co dalej",
    href: "#roadmap",
  },
  {
    key: "practice",
    label: "Trening",
    icon: PencilLine,
    accent: "green",
    title: "Trening zadań",
    description: "Zadania z arkuszy CKE z natychmiastowym sprawdzaniem",
    href: "#practice",
  },
  {
    key: "agent",
    label: "Agent AI",
    icon: Bot,
    accent: "lavender",
    title: "Agent Examax",
    description: "Wyjaśnienia krok po kroku, dopasowane do Twoich błędów",
    href: "#agent",
  },
  {
    key: "analytics",
    label: "Postępy",
    icon: BarChart3,
    accent: "blue",
    title: "Śledzenie postępów",
    description: "Opanowanie tematów i gotowość do egzaminu na bieżąco",
    href: "#progress",
  },
];

const accentText: Record<Accent, string> = {
  tangerine: "text-tangerine",
  green: "text-vivid-green",
  lavender: "text-lavender",
  blue: "text-electric-blue",
};

/**
 * The hero product stage: the white notch carrying the feature tabs (sliding
 * active-pill indicator, keyboard support), the framed dashboard window whose
 * bottom edge is cut by the band, and the dark contextual card.
 */
export function HeroShowcase() {
  const [active, setActive] = useState<HeroView>("practice");
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<HeroView, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const measure = useCallback(() => {
    const el = tabRefs.current[active];
    if (!el) return;
    setIndicator({
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  }, [active]);

  useEffect(() => {
    measure();
    // Re-measure once webfonts settle and on resize — pill widths depend on both.
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

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
    setActive(key);
    tabRefs.current[key]?.focus();
  };

  const activeTab = tabs.find((tab) => tab.key === active)!;

  return (
    <div className="col-rules relative overflow-hidden bg-paper-mist">
      {/* White notch. Measured off the reference: the boundary drops 82px over
          a 100px run as a SYMMETRIC S — steepest dead-centre, easing out at
          both ends. That means the two halves must match, so the concave
          fillet (50x41) and the tab's own bottom corner are the same ellipse,
          the corner just mirrored. An asymmetric pair reads as a slope hitting
          a bump, which is exactly what it looked like before. */}
      <div className="relative z-[2] flex justify-center">
        <div
          className="relative bg-white px-10 pb-5 pt-6"
          style={{
            borderBottomLeftRadius: "50px 41px",
            borderBottomRightRadius: "50px 41px",
          }}
        >
          <span
            aria-hidden
            className="absolute right-full top-0 h-[41px] w-[50px] bg-[radial-gradient(50px_41px_at_0_100%,transparent_99.2%,#fff_99.6%)]"
          />
          <span
            aria-hidden
            className="absolute left-full top-0 h-[41px] w-[50px] bg-[radial-gradient(50px_41px_at_100%_100%,transparent_99.2%,#fff_99.6%)]"
          />
          <div
            ref={listRef}
            role="tablist"
            aria-label="Poznaj produkt Examax"
            onKeyDown={onKeyDown}
            className="relative flex flex-wrap items-center justify-center gap-2"
          >
            {indicator ? (
              <span
                aria-hidden
                className="absolute rounded-buttons bg-white shadow-subtle transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  left: indicator.left,
                  top: indicator.top,
                  width: indicator.width,
                  height: indicator.height,
                }}
              />
            ) : null}
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
                  onClick={() => setActive(tab.key)}
                  className={cn(
                    "focus-ring relative z-10 inline-flex h-[38px] items-center gap-2 rounded-buttons border border-ash px-4 text-body font-medium transition-colors duration-200",
                    selected
                      ? "bg-transparent text-charcoal"
                      : "bg-paper-mist text-steel hover:text-charcoal",
                  )}
                >
                  <AccentTile icon={tab.icon} accent={tab.accent} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product window — 16px top radius, bottom flush: the frame is cut by
          the band edge rather than faded, exactly as in the reference. */}
      <Container className="relative pt-10">
        <div
          role="tabpanel"
          id="hero-panel"
          aria-labelledby={`hero-tab-${active}`}
          className="h-[520px] overflow-hidden"
        >
          <HeroDashboard view={active} />
        </div>
      </Container>

      {/* Dark contextual card pinned to the bottom edge of the stage */}
      <div className="pointer-events-none absolute inset-x-4 bottom-6 z-20 sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2">
        <div
          key={active}
          className="animate-view-swap pointer-events-auto flex items-center gap-4 rounded-largecards bg-charcoal p-3.5 pl-5 text-white shadow-md"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-cards bg-white/10">
            <activeTab.icon
              className={cn("size-5", accentText[activeTab.accent])}
              aria-hidden
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body-lg font-semibold leading-tight">
              {activeTab.title}
            </p>
            <p className="truncate text-body text-silver">
              {activeTab.description}
            </p>
          </div>
          <Link
            href={activeTab.href}
            className="focus-ring shrink-0 rounded-buttons bg-white px-5 py-2 text-body font-medium leading-5 text-charcoal transition-all duration-200 hover:ring-4 hover:ring-white/20"
          >
            Zobacz więcej
          </Link>
        </div>
      </div>
    </div>
  );
}
