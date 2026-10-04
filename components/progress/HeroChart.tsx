"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, GraduationCap } from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { SUBJECTS, type SubjectKey } from "@/components/progress/events";
import { SubjectMark } from "@/components/progress/SubjectMark";
import { month } from "@/components/progress/time";
import { cn } from "@/lib/cn";

import learnerPhoto from "@/public/mockups/learner.jpg";

/*
 * The /progress hero's chart — dub.co/analytics' hero, one to one (live DOM
 * and hover recorded 2026-10-01, `DesignRules/dom-captures/analytics-hero.html`):
 * three monthly lines rising across the band behind the copy, fading in from
 * the left, a mono axis on the left edge, and a tooltip that follows the
 * pointer from month to month. Under the tooltip, some months carry a second
 * card — the reference's top countries, then its customer; here the month's
 * subjects, then the learner herself with that month's readiness and streak.
 *
 * Dub plots clicks, leads and sales; this plots one learner's year: tasks
 * answered, answered correctly, and correct without a hint. It dips at
 * Christmas and over the summer, and climbs into the new school year.
 * PLACEHOLDER DATA — the learner and her figures are illustrative.
 */

const FIRST_MONTH = new Date(2025, 9, 1);
const MONTHS = 13;
const monthAt = (index: number) => new Date(FIRST_MONTH.getFullYear(), FIRST_MONTH.getMonth() + index, 1);

const SERIES = [
  { label: "Zadania", color: "#3B82F6", values: [210, 260, 230, 300, 290, 360, 410, 380, 440, 300, 520, 690, 790] },
  { label: "Poprawne", color: "#A855F7", values: [125, 160, 145, 200, 195, 250, 295, 275, 330, 225, 400, 545, 640] },
  { label: "Bez podpowiedzi", color: "#14B8A6", values: [50, 70, 65, 95, 100, 135, 170, 165, 205, 140, 265, 380, 460] },
] as const;

/** Each month's tasks by subject, for the months that show them (Mar–Jun). */
const SUBJECT_SPLIT: Partial<Record<number, Record<SubjectKey, number>>> = {
  5: { math: 170, polish: 110, english: 80 },
  6: { math: 190, polish: 125, english: 95 },
  7: { math: 175, polish: 120, english: 85 },
  8: { math: 205, polish: 135, english: 100 },
};

/** The learner, from July on: her readiness and streak at the end of each month. */
const LEARNER: Partial<Record<number, { readiness: string; streak: string }>> = {
  9: { readiness: "61%", streak: "4 dni" },
  10: { readiness: "66%", streak: "12 dni" },
  11: { readiness: "72%", streak: "21 dni" },
};

/**
 * The reference's scale, at its 600px height: a value of 800 reaches the top
 * and the axis is labelled from 100 to 400 across the lower half.
 */
const TOP = 800;
const TICKS = [100, 200, 300, 400];
/** The month the tooltip rests on — the last whole one; the line runs on into this month. */
const RESTING = 11;
const LEFT = 32;
const TOOLTIP_WIDTH = 192;

function SubjectsCard({ split }: { split: Record<SubjectKey, number> }) {
  const max = Math.max(...Object.values(split));
  return (
    <div className="hidden rounded-lg border border-smoke bg-white p-3 md:block">
      <div className="flex items-center gap-2 text-xs font-medium text-slate">
        <BookOpen className="size-3.5 text-fog" strokeWidth={2} aria-hidden />
        Przedmioty
      </div>
      <div className="mt-2.5 flex flex-col gap-1">
        {(Object.keys(split) as SubjectKey[]).map((key) => (
          <div key={key} className="relative flex items-center gap-2 px-1.5 py-1 text-[11px] leading-none text-steel">
            <div aria-hidden className="absolute inset-y-0 left-0 rounded bg-black/5" style={{ width: `${(split[key] / max) * 100}%` }} />
            <SubjectMark subject={key} className="relative" />
            <span className="relative">{SUBJECTS[key].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The reference's customer card, as the Product menu draws the same learner. */
function LearnerCard({ readiness, streak }: { readiness: string; streak: string }) {
  const rows = [
    { label: "Gotowość", value: readiness },
    { label: "Seria nauki", value: streak },
  ];
  return (
    <div className="hidden overflow-hidden rounded-lg border border-smoke bg-white py-0.5 md:block">
      <div className="px-3 py-2.5">
        <div className="flex justify-between gap-2">
          <span className="relative size-11 overflow-hidden rounded-full bg-paper-mist">
            <Image src={learnerPhoto} alt="" fill sizes="44px" loading="eager" className="object-cover object-[center_30%]" />
          </span>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-slate">
              <GraduationCap className="size-3.5" strokeWidth={1.8} aria-hidden />
              Matura
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-ash bg-white px-1.5 py-0.5 text-xs text-slate">
              {/* Polish flag, drawn: white over red. */}
              <span aria-hidden className="flex h-2.5 w-3 flex-col overflow-hidden rounded-sm border-[0.5px] border-black/15">
                <span className="flex-1 bg-white" />
                <span className="flex-1 bg-[#dc143c]" />
              </span>
              PL
            </span>
          </div>
        </div>
        <div className="mt-4 text-[13px] font-medium text-charcoal">Zuzanna Nowakowska</div>
        <div className="mt-px text-xs text-fog">zuzanna@examax.app</div>
      </div>
      <div className="flex flex-col gap-2.5 border-t border-smoke px-3 pb-2.5 pt-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 text-xs leading-none">
            <span className="truncate font-medium text-silver">{row.label}</span>
            <span className="text-steel">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroChart() {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1048, height: 600 });
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: Math.round(entry.contentRect.width), height: Math.round(entry.contentRect.height) }),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const step = (width - LEFT) / (MONTHS - 1);
  const x = (index: number) => LEFT + index * step;
  /** The reference's mapping, scaled to the band's height: 800 at the top, 0 just below the bottom edge. */
  const y = (value: number) => (height * (640 - value * (640 / TOP))) / 600;

  const shown = hover ?? RESTING;
  const pointX = x(shown);
  const ys = SERIES.map((series) => y(series.values[shown]));
  const left = pointX + 17 + TOOLTIP_WIDTH <= width ? pointX + 17 : pointX - 17 - TOOLTIP_WIDTH;
  const top = Math.max(0, ys[0] - 16);
  const barCentre = (ys[0] + ys[2]) / 2;
  const barHeight = (ys[2] - ys[0]) * 1.33;

  const split = SUBJECT_SPLIT[shown];
  const learner = LEARNER[shown];

  function onPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const index = Math.round((event.clientX - rect.left - LEFT) / step);
    setHover(Math.min(Math.max(index, 0), RESTING));
  }

  return (
    <div ref={box} className="size-full">
      <div className="relative size-full">
        <svg
          width={width}
          height={height}
          className="block touch-pan-y"
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`Postępy w ostatnim roku: ${SERIES.map((series) => `${series.label.toLowerCase()} ${series.values[RESTING]}`).join(", ")} we wrześniu`}
        >
          <defs>
            <linearGradient id={`${id}-fade`} x2="1" y2="0">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.4" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id={`${id}-lines`} maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill={`url(#${id}-fade)`} />
            </mask>
            <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.1" stopColor="white" stopOpacity="1" />
              <stop offset="0.9" stopColor="white" stopOpacity="1" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id={`${id}-bar-mask`} maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill={`url(#${id}-bar)`} />
            </mask>
          </defs>

          {/* The axis: every other label drops out on narrow screens, as the reference's do */}
          <g className="font-geist-mono text-xs">
            {TICKS.map((value, index) => (
              <text key={value} x={22} y={y(value)} fill="currentColor" className={index % 2 ? "text-transparent sm:text-silver" : "text-silver"}>
                {value}
              </text>
            ))}
          </g>

          <g mask={`url(#${id}-lines)`}>
            {SERIES.map((series) => (
              <path
                key={series.label}
                d={series.values.map((value, index) => `${index ? "L" : "M"}${x(index)},${y(value)}`).join("")}
                fill="none"
                stroke={series.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* The month's bar and its three points, sliding with the pointer */}
          <rect
            x={pointX - 1}
            y={barCentre - barHeight / 2}
            width={2}
            height={Math.max(barHeight, 0)}
            fill="#14B8A633"
            mask={`url(#${id}-bar-mask)`}
            className="transition-[x,y,height] duration-300"
          />
          {SERIES.map((series, index) => (
            <circle
              key={series.label}
              cx={0}
              cy={0}
              r={4}
              strokeWidth={2}
              stroke={series.color}
              fill="#fafafa"
              className="transition-transform duration-300"
              style={{ transform: `translate(${pointX}px, ${ys[index]}px)` }}
            />
          ))}
        </svg>

        {/* The tooltip, and the month's second card under it */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 flex w-48 flex-col gap-1 transition-transform duration-300"
          style={{ transform: `translate(${left}px, ${top}px)` }}
        >
          <div className="rounded-lg border border-smoke bg-white">
            <div className="p-1.5">
              <div className="hidden items-center gap-2 rounded border border-ash bg-paper-mist p-2 text-xs font-medium leading-none text-steel sm:flex">
                <MaturaIcon className="h-2.5 w-3.5" />
                Matura 2027
              </div>
              <div className="mt-1 px-1.5 pb-0.5 text-[0.8125rem] font-medium text-steel sm:mt-2">{month(monthAt(shown))}</div>
            </div>
            <div className="flex flex-col gap-2 border-t border-smoke p-3">
              {SERIES.map((series) => (
                <div key={series.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-sm border border-black/20 bg-current opacity-70" style={{ color: series.color }} />
                    <span className="text-xs font-medium leading-none text-fog">{series.label}</span>
                  </div>
                  <span className="text-xs leading-none text-charcoal tabular-nums">{series.values[shown]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={cn("relative", !split && !learner && "hidden")}>
            {split ? <SubjectsCard key={`s${shown}`} split={split} /> : null}
            {learner ? <LearnerCard key="learner" {...learner} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
