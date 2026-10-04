import { cn } from "@/lib/cn";

/**
 * The reference's rule field (dub.co/partners): a 60px square pattern drawn
 * with a 2px stroke whose outer half is clipped, so every rule lands at 1px.
 * Colour comes from `text-*`; size and position from the caller, which also
 * owns the falloff mask.
 */
export function GridPattern({
  id,
  size = 60,
  className,
}: {
  /** Unique per page — SVG pattern ids are document-global. */
  id: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      width="100%"
      height="100%"
      className={cn("pointer-events-none absolute", className)}
    >
      <defs>
        <pattern id={id} x="-1" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="transparent" stroke="currentColor" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
