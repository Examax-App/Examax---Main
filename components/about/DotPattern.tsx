import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Dub's dot field (dub.co/about): 2px squares on a 12px grid, in a faint
 * neutral. Size and position come from the caller.
 */
export function DotPattern({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden width="100%" height="100%" className={cn("pointer-events-none absolute inset-0 text-ash/80", className)}>
      <defs>
        <pattern id={id} x="-1" y="-1" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="2" height="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} width="100%" height="100%" />
    </svg>
  );
}
