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
    accent: "lavender",
    title: "Roadmapa nauki",
    description: "Cały egzamin rozpisany na kroki — zawsze wiesz, co dalej",
    href: "#roadmapa",
  },
  {
    key: "practice",
    label: "Trening",
    icon: PencilLine,
    accent: "tangerine",
    title: "Trening zadań",
    description: "Zadania z arkuszy CKE z natychmiastowym sprawdzaniem",
    href: "#trening",
  },
  {
    key: "agent",
    label: "Agent AI",
    icon: Bot,
    accent: "blue",
    title: "Agent Examax",
    description: "Wyjaśnienia krok po kroku, dopasowane do Twoich błędów",
    href: "#agent",
  },
  {
    key: "analytics",
    label: "Postępy",
    icon: BarChart3,
    accent: "green",
    title: "Śledzenie postępów",
    description: "Opanowanie tematów i gotowość do egzaminu na bieżąco",
    href: "#postepy",
  },
];

const accentText: Record<Accent, string> = {
  tangerine: "text-tangerine",
  green: "text-vivid-green",
  lavender: "text-lavender",
  blue: "text-electric-blue",
};

const accentBorder: Record<Accent, string> = {
  tangerine: "rgba(234, 88, 12, 0.35)",
  green: "rgba(22, 163, 74, 0.35)",
  lavender: "rgba(124, 58, 237, 0.35)",
  blue: "rgba(37, 99, 235, 0.35)",
};

/**
 * The hero product stage: the white shelf with real feature tabs (sliding
 * active-pill indicator, keyboard support), the swappable dashboard shot,
 * and the dark contextual card pinned to the bottom edge of the stage.
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
    <div className="relative overflow-hidden bg-gradient-to-br from-[#fafafa] via-[#f7f7f7] to-[#f0f6f1]">
      <div className="bg-grid mask-fade-bottom absolute inset-0" aria-hidden />

      {/* White shelf carrying the tabs */}
      <div className="relative mx-auto -mt-px max-w-4xl rounded-b-[40px] bg-white px-6 pb-5 pt-1">
        <div
          ref={listRef}
          role="tablist"
          aria-label="Poznaj produkt Examax"
          onKeyDown={onKeyDown}
          className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {indicator ? (
            <span
              aria-hidden
              className="absolute rounded-full border bg-white shadow-subtle transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: indicator.left,
                top: indicator.top,
                width: indicator.width,
                height: indicator.height,
                borderColor: accentBorder[activeTab.accent],
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
                  "relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-body font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal",
                  selected ? "text-charcoal" : "text-steel hover:text-charcoal",
                )}
              >
                <AccentTile icon={tab.icon} accent={tab.accent} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product shot */}
      <Container className="relative pt-12">
        <div
          role="tabpanel"
          id="hero-panel"
          aria-labelledby={`hero-tab-${active}`}
          className="-mb-12 sm:-mb-20"
        >
          <HeroDashboard view={active} />
        </div>
      </Container>

      {/* Dark contextual card pinned to the bottom edge of the stage */}
      <div className="pointer-events-none absolute inset-x-4 bottom-5 z-20 sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2">
        <div
          key={active}
          className="animate-view-swap pointer-events-auto flex items-center gap-4 rounded-largecards bg-midnight-ink/95 p-3.5 pl-5 text-white shadow-md backdrop-blur"
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
            className="shrink-0 rounded-buttons bg-white px-4 py-2 text-body font-medium text-charcoal transition-all duration-200 hover:bg-ash hover:shadow-subtle"
          >
            Zobacz więcej
          </Link>
        </div>
      </div>
    </div>
  );
}
