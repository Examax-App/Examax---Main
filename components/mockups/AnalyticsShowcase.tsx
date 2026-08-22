"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  CircleAlert,
  Languages,
  MousePointerClick,
  RefreshCcw,
  Sigma,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Sparkline } from "@/components/ui/Sparkline";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const stats = [
  { label: "Zadania", value: "1 246" },
  { label: "Skuteczność", value: "84%" },
  { label: "Tematy opanowane", value: "38" },
];

type FeedRow = {
  icon: LucideIcon;
  event: string;
  set: string;
  subjectIcon: LucideIcon;
  topic: string;
};

const feed: FeedRow[] = [
  { icon: MousePointerClick, event: "Rozpoczęto sesję", set: "Matematyka · Arkusz CKE 2024", subjectIcon: Sigma, topic: "Procenty" },
  { icon: CheckCircle2, event: "Poprawna odpowiedź", set: "Matematyka · Arkusz CKE 2024", subjectIcon: Sigma, topic: "Równania" },
  { icon: CircleAlert, event: "Zapisano błąd", set: "Język polski · Lektury", subjectIcon: BookOpen, topic: "Środki stylistyczne" },
  { icon: Brain, event: "Temat opanowany", set: "Matematyka · Roadmapa", subjectIcon: Sigma, topic: "Wyrażenia algebraiczne" },
  { icon: CheckCircle2, event: "Poprawna odpowiedź", set: "Język angielski · Quiz 12", subjectIcon: Languages, topic: "Środki językowe" },
  { icon: RefreshCcw, event: "Powtórka ukończona", set: "Język angielski · Słówka", subjectIcon: Languages, topic: "Praca i zawody" },
];

/** Tapered band between two stage heights, mirroring the reference Sankey. */
function segment(
  x0: number,
  x1: number,
  top0: number,
  top1: number,
  bottom0: number,
  bottom1: number,
) {
  const mx = (x0 + x1) / 2;
  return `M ${x0},${top0} C ${mx},${top0} ${mx},${top1} ${x1},${top1} L ${x1},${bottom1} C ${mx},${bottom1} ${mx},${bottom0} ${x0},${bottom0} Z`;
}

const seg1 = segment(0, 213, 10, 21, 160, 149);
const seg2 = segment(213, 427, 21, 59, 149, 111);
const seg3 = segment(427, 640, 59, 71, 111, 99);

const funnelChips = [
  { label: "100%", left: "16%" },
  { label: "84%", left: "50%" },
  { label: "38%", left: "84%" },
];

/**
 * Analytics showcase — an animated mastery funnel (flowing gradient bands
 * with a sweeping sheen and percentage badges) above a study event feed
 * whose rows stream in one at a time on a loop.
 */
export function AnalyticsShowcase() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [visibleRows, setVisibleRows] = useState(3);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setVisibleRows((current) =>
        current >= feed.length + 2 ? 3 : current + 1,
      );
    }, 950);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  const shownRows = reducedMotion
    ? feed.length
    : Math.min(visibleRows, feed.length);

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">

      <div
        role="img"
        aria-label="Podgląd analityki Examax: lejek opanowania od przerobionych zadań do opanowanych tematów, nad strumieniem zdarzeń z nauki"
      >
        <div className="rounded-largecards border border-ash bg-white p-3 shadow-ring">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between gap-2 rounded-cards border border-ash px-4 py-3"
              >
                <div>
                  <p className="text-[12px] text-fog">{stat.label}</p>
                  <p className="mt-1 text-heading-sm font-medium leading-none text-charcoal">
                    {stat.value}
                  </p>
                </div>
                <Sparkline className="hidden h-9 w-20 sm:block" />
              </div>
            ))}
          </div>

          {/* Mastery funnel */}
          <div className="relative mt-3">
            <svg viewBox="0 0 640 170" className="w-full" aria-hidden>
              <defs>
                <linearGradient id="funnel-1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#6d28d9" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="funnel-2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
                <linearGradient id="funnel-3" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#c4b5fd" />
                  <stop offset="1" stopColor="#ddd6fe" />
                </linearGradient>
                <linearGradient id="funnel-sheen-fill" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <clipPath id="funnel-clip">
                  <path d={seg1} />
                  <path d={seg2} />
                  <path d={seg3} />
                </clipPath>
                <filter id="funnel-blur" x="-20%" y="-40%" width="140%" height="180%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>
              {/* Soft glow underlay */}
              <g filter="url(#funnel-blur)" opacity="0.3">
                <path d={seg1} fill="url(#funnel-1)" />
                <path d={seg2} fill="url(#funnel-2)" />
                <path d={seg3} fill="url(#funnel-3)" />
              </g>
              <path d={seg1} fill="url(#funnel-1)" />
              <path d={seg2} fill="url(#funnel-2)" opacity="0.92" />
              <path d={seg3} fill="url(#funnel-3)" opacity="0.92" />
              <g clipPath="url(#funnel-clip)">
                <rect
                  className="animate-funnel-sheen"
                  x="0"
                  y="0"
                  width="160"
                  height="170"
                  fill="url(#funnel-sheen-fill)"
                />
              </g>
            </svg>
            {funnelChips.map((chip) => (
              <span
                key={chip.label}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ash bg-white px-2.5 py-1 font-geist-mono text-[12px] font-medium text-charcoal shadow-subtle"
                style={{ left: chip.left }}
                aria-hidden
              >
                {chip.label}
              </span>
            ))}
            <div
              aria-hidden
              className="mt-1 flex justify-between px-1 text-[11px] font-medium uppercase tracking-[0.1em] text-fog"
            >
              <span>Przerobione</span>
              <span>Poprawne</span>
              <span>Opanowane</span>
            </div>
          </div>
        </div>

        {/* Streaming event feed */}
        <ul className="mask-fade-bottom mt-4 h-56 space-y-2 overflow-hidden">
          {feed.slice(0, shownRows).map((row, index) => (
            <li
              key={`${row.event}-${row.topic}`}
              className={cn(
                "animate-view-swap grid grid-cols-[1fr_auto] items-center gap-3 rounded-cards border border-ash bg-white px-4 py-3 text-[13px] shadow-subtle sm:grid-cols-[1.2fr_1.1fr_0.8fr]",
                index === feed.length - 1 && "opacity-50",
              )}
            >
              <span className="flex items-center gap-2.5 font-medium text-charcoal">
                <row.icon className="size-4 text-steel" aria-hidden />
                {row.event}
              </span>
              <span className="hidden items-center gap-2 text-steel sm:flex">
                <span
                  className="grid size-4 place-items-center rounded-[5px] bg-midnight-ink text-white"
                  aria-hidden
                >
                  <row.subjectIcon className="size-2.5" />
                </span>
                {row.set}
              </span>
              <span className="flex items-center justify-end gap-2 text-steel sm:justify-start">
                <span className="rounded-full bg-paper-mist px-2 py-0.5 text-[11px] font-medium text-slate">
                  {row.topic}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
