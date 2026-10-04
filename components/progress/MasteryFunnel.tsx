"use client";

import { useEffect, useRef, useState } from "react";
import { CornerDownRight, Layers } from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/*
 * dub.co/analytics' "Visualize your journey", one to one in build (live DOM
 * and hover recorded 2026-10-01): a link card sitting on the funnel's top
 * edge, then three equal columns, each band easing from its stage's height
 * down to the next one's, drawn three times — solid, then 8px and 16px wider
 * at 30% and 15% — in blue, violet and teal. Pointing at a column tints it and
 * moves the tooltip there with the stage's share and count.
 *
 * Dub follows clicks to leads to sales; this follows the roadmap's topics to
 * the ones worked through and the ones mastered.
 * PLACEHOLDER DATA — an illustrative Matura roadmap.
 */

const STAGES = [
  { label: "Tematy", value: 124, color: "#2563EB", swatch: "text-blue-500/50" },
  { label: "Przerobione", value: 86, color: "#7C3AED", swatch: "text-violet-600/50" },
  { label: "Opanowane", value: 52, color: "#2DD4BF", swatch: "text-teal-400/50" },
] as const;

/** The reference's plot is 370px tall; the widest band spans 258 of it. */
const TALL = 370;
const WIDEST = 129;
const LAYERS = [
  { grow: 0, opacity: 1 },
  { grow: 8, opacity: 0.3 },
  { grow: 16, opacity: 0.15 },
];

const share = (value: number) => `${Math.round((value / STAGES[0].value) * 100)}%`;

/** One column's band: flat, an S-curve from this stage's height to the next one's, flat again. */
function band(x0: number, width: number, centre: number, from: number, to: number) {
  const a = x0 + width * 0.05;
  const b = x0 + width * 0.95;
  const mid = x0 + width / 2;
  const f = (value: number) => Math.round(value * 100) / 100;
  return [
    `M${f(x0)},${f(centre - from)}L${f(a)},${f(centre - from)}`,
    `C${f(mid)},${f(centre - from)} ${f(mid)},${f(centre - to)} ${f(b)},${f(centre - to)}`,
    `L${f(x0 + width)},${f(centre - to)}L${f(x0 + width)},${f(centre + to)}L${f(b)},${f(centre + to)}`,
    `C${f(mid)},${f(centre + to)} ${f(mid)},${f(centre + from)} ${f(a)},${f(centre + from)}`,
    `L${f(x0)},${f(centre + from)}Z`,
  ].join("");
}

export function MasteryFunnel() {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1078, height: TALL });
  const [active, setActive] = useState(0);
  const { ref: seen, inView } = useInView<HTMLDivElement>(0.3, true);

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
  const column = width / STAGES.length;
  const centre = height / 2;
  const half = (value: number) => (value / STAGES[0].value) * WIDEST * (height / TALL);
  const stage = STAGES[active];

  return (
    <div ref={seen} className="-mx-px mb-8 mt-12">
      <div className="relative pt-10 [mask-image:linear-gradient(black_80%,transparent)]">
        {/* The reference's link card, sitting on the funnel's top edge */}
        <div className="absolute left-1/2 top-0 z-10 w-[min(416px,calc(100%-32px))] -translate-x-1/2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-ash bg-white p-3 shadow-subtle">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-ash bg-gradient-to-t from-paper-mist to-white">
                <MaturaIcon className="h-3.5 w-5" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-base font-medium leading-tight text-charcoal">Roadmapa · Matematyka</span>
                <span className="flex items-center gap-1 text-sm text-fog">
                  <CornerDownRight className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                  <span className="truncate">Matura 2027, rozszerzona</span>
                </span>
              </div>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-md border border-ash bg-paper-mist px-2 py-1 text-sm text-steel sm:flex">
              <Layers className="size-3.5" strokeWidth={1.75} aria-hidden />
              124 tematy
            </span>
          </div>
        </div>

        <div className="relative rounded-xl border border-ash bg-white">
          <div ref={box} className="relative h-[240px] sm:h-[370px]">
            <svg width={width} height={height} className="block" role="img" aria-label={STAGES.map((item) => `${item.label}: ${item.value}`).join(", ")}>
              {STAGES.map((item, index) => {
                const x0 = index * column;
                const next = STAGES[Math.min(index + 1, STAGES.length - 1)];
                return (
                  <g key={item.label}>
                    <rect
                      x={x0}
                      width={column}
                      height={height}
                      className={cn("transition-colors", index === active ? "fill-blue-600/5" : "fill-transparent")}
                      onPointerEnter={() => setActive(index)}
                      onPointerDown={() => setActive(index)}
                    />
                    {index > 0 ? <line x1={x0} x2={x0} y1={0} y2={height} className="stroke-black/5 sm:stroke-black/10" /> : null}
                    <g
                      className={cn("pointer-events-none origin-center [transform-box:fill-box]", inView ? "motion-safe:animate-band-grow" : "opacity-0 motion-reduce:opacity-100")}
                      style={{ color: item.color, animationDelay: `${index * 120}ms` }}
                    >
                      {LAYERS.map((layer) => (
                        <path
                          key={layer.grow}
                          d={band(x0, column, centre, half(item.value) + layer.grow, half(next.value) + layer.grow)}
                          fill="currentColor"
                          opacity={layer.opacity}
                        />
                      ))}
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip: the pointed-at stage's share and count */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition-[left] duration-300 ease-out"
              style={{ left: active * column + Math.min(column * 0.29, 100) }}
            >
              <div className="w-max rounded-lg border border-ash bg-white text-sm shadow-subtle">
                <div className="border-b border-ash px-4 py-3 text-charcoal">{stage.label}</div>
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="flex items-center gap-2 text-steel">
                    <span className={cn("size-2 rounded-sm bg-current shadow-[inset_0_0_0_1px_#00000019]", stage.swatch)} />
                    {share(stage.value)}
                  </span>
                  <span className="font-medium text-charcoal tabular-nums">{stage.value}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
