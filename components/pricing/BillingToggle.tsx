"use client";

import { cn } from "@/lib/cn";
import { YEARLY_DISCOUNT_NOTE } from "@/lib/pricing";

/**
 * Monthly / yearly switch — a segmented pill on a Paper track: 40px segments at
 * the cards' radius, a white chip marking the live one, and the yearly saving
 * carried as a Soft Blue badge.
 *
 * The label colour deliberately does not change between states: the chip moves,
 * not the type, so both segments stay equally legible and only the surface
 * tells you which one is live.
 *
 * Every value here is a token — no literal colours, radii or sizes.
 */
const SEGMENT =
  "focus-ring relative flex h-10 cursor-pointer items-center gap-2 rounded-cards px-3 text-body-sm font-medium text-graphite transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

/** The moving chip. Sits under the label via -z-10 inside the segment. */
const CHIP =
  "absolute inset-0 -z-10 rounded-cards bg-canvas-white shadow-subtle";

export function BillingToggle({
  yearly,
  onChange,
  className,
}: {
  yearly: boolean;
  onChange: (yearly: boolean) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // inline-flex, not flex: the control hugs its two segments rather than
        // stretching to the width of the band it is dropped into.
        "inline-flex items-center gap-1 rounded-cards border border-ash bg-paper-mist",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!yearly}
        className={cn(SEGMENT, "isolate")}
      >
        {!yearly ? <span aria-hidden className={CHIP} /> : null}
        Miesięcznie
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={yearly}
        className={cn(SEGMENT, "isolate")}
      >
        {yearly ? <span aria-hidden className={CHIP} /> : null}
        Rocznie
        <span className="rounded-full bg-soft-blue px-2 text-body-sm font-medium text-deep-sapphire">
          {YEARLY_DISCOUNT_NOTE}
        </span>
      </button>
    </div>
  );
}
