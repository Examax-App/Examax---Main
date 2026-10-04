"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export type PillOption<T extends string> = {
  value: T;
  label: React.ReactNode;
  /** Accessible name when the label alone is not enough. */
  ariaLabel?: string;
};

/**
 * The pricing page's two switches — exam (Matura / Egzamin ósmoklasisty) and
 * billing (Miesięcznie / Rocznie) — both dub.co's ToggleGroup, read off the
 * live page: a Paper Mist track with an Ash hairline at 12px radius, and a
 * white chip with a near-invisible ring and a 3px drop that *slides* to the
 * picked segment rather than jumping. Sampled on dub.co it travels in about
 * 250ms and decelerates into place without overshoot, which is the tween below.
 *
 * `layoutId` must be unique per control on the page, so the two chips never
 * try to animate into one another.
 */
export function PillToggle<T extends string>({
  options,
  selected,
  onSelect,
  layoutId,
  size = "md",
  ariaLabel,
}: {
  options: PillOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
  layoutId: string;
  /** `md` is the exam switch; `lg` the billing switch, pinned to 40px. */
  size?: "md" | "lg";
  ariaLabel: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="relative z-0 inline-flex items-center gap-1 rounded-xl border border-ash bg-paper-mist"
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.ariaLabel}
            data-selected={isSelected}
            onClick={() => onSelect(option.value)}
            className={cn(
              "focus-ring relative flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-medium leading-none text-graphite",
              "data-[selected=false]:hover:bg-[#e5e5e5]/30",
              size === "lg" && "h-10",
              isSelected ? "z-10" : "z-[11] transition-colors hover:text-steel",
            )}
          >
            {option.label}
            {isSelected ? (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                transition={reducedMotion ? { duration: 0 } : { type: "tween", ease: "easeOut", duration: 0.25 }}
                className="absolute left-0 top-0 -z-[1] h-full w-full rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_1px_3px_0_rgba(0,0,0,0.08)]"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
