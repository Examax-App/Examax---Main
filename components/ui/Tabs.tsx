"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Underline tabs from the reference list pages ("Custom domains / Default
 * domains") — active tab gets charcoal text and a 2px near-black underline.
 */
export function UnderlineTabs({
  tabs,
  initialIndex = 0,
  onChange,
  className,
}: {
  tabs: string[];
  initialIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}) {
  const [active, setActive] = useState(initialIndex);

  return (
    <div
      role="tablist"
      className={cn("flex gap-6 border-b border-ash", className)}
    >
      {tabs.map((tab, index) => {
        const selected = index === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              setActive(index);
              onChange?.(index);
            }}
            className={cn(
              "-mb-px border-b-2 pb-2.5 pt-1 text-body-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal",
              selected
                ? "border-midnight-ink text-charcoal"
                : "border-transparent text-fog hover:text-charcoal",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Segmented pill control ("Active / Archived", "Domain / Folder") — bordered
 * container, white active segment.
 */
export function Segmented({
  options,
  initialIndex = 0,
  onChange,
  className,
}: {
  options: string[];
  initialIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}) {
  const [active, setActive] = useState(initialIndex);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-buttons border border-ash bg-white p-0.5",
        className,
      )}
    >
      {options.map((option, index) => {
        const selected = index === active;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              setActive(index);
              onChange?.(index);
            }}
            className={cn(
              "rounded-[6px] px-3 py-1.5 text-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal",
              selected
                ? "border border-ash bg-white text-charcoal shadow-subtle"
                : "border border-transparent text-steel hover:text-charcoal",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
