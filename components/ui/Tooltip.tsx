"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/** Gap between the trigger and the bubble — the reference's side offset. */
const SIDE_OFFSET = 8;
/** Keeps the bubble this far from the viewport edge. */
const EDGE = 8;

/**
 * A hover/focus tooltip, as dub.co/pricing sets its own on the dotted-underline
 * feature names (Radix, read off the live page): white, a Smoke hairline at
 * 12px radius, a soft shadow, 14px slate type centred on a 320px measure, and
 * the page's slide-up-fade at 0.4s. It opens at once and sits 8px above the
 * trigger.
 *
 * The bubble is portalled to <body> and positioned `fixed`, so the overflow
 * clipping of a card grid or a sideways-scrolling table cannot cut it off.
 * The trigger takes focus, which is how keyboard and touch users reach it.
 */
export function Tooltip({
  content,
  children,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) return;
    const anchor = trigger.getBoundingClientRect();
    const width = bubble.offsetWidth;
    const centre = anchor.left + anchor.width / 2;
    const left = Math.min(Math.max(centre - width / 2, EDGE), window.innerWidth - width - EDGE);
    setPosition({ left, top: anchor.top - SIDE_OFFSET - bubble.offsetHeight });
  }, []);

  // Measure once the bubble exists, then follow the trigger while open. A
  // scroll moves the trigger under a fixed bubble, so it is re-placed rather
  // than left behind.
  useEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  const show = () => setOpen(true);
  const hide = () => {
    setOpen(false);
    setPosition(null);
  };

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        onPointerEnter={show}
        onPointerLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(event) => event.key === "Escape" && hide()}
        className={cn("cursor-help rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-black/10", className)}
      >
        {children}
      </span>
      {open
        ? createPortal(
            <div
              ref={bubbleRef}
              id={id}
              role="tooltip"
              style={{
                left: position?.left ?? 0,
                top: position?.top ?? 0,
                // Measured before it is shown, so it never flashes at 0,0.
                visibility: position ? "visible" : "hidden",
                // Inline: .animate-slide-up-fade is unlayered CSS and would
                // outrank a utility class for the duration.
                animationDuration: "0.4s",
              }}
              className={cn(
                "pointer-events-none fixed z-[99] max-w-xs overflow-hidden rounded-cards border border-smoke bg-white px-4 py-2 text-center text-body leading-snug text-pretty text-slate shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
                position && "animate-slide-up-fade",
              )}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
