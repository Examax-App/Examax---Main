import { cn } from "@/lib/cn";

/**
 * The Examax wordmark. The conic spectrum gradient is reserved for the brand
 * mark only — never for UI elements (see DESIGN.md).
 */
export function Logo({
  inverted = false,
  /** The nav drops the icon tile — the reference sets a bare wordmark there. */
  mark = true,
  className,
}: {
  inverted?: boolean;
  mark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {mark ? (
        <span
          aria-hidden
          className="grid size-5 place-items-center rounded-[6px] bg-midnight-ink"
        >
          <svg viewBox="0 0 32 32" className="size-5" role="presentation">
            <defs>
              <linearGradient
                id="examax-spectrum"
                x1="0"
                y1="0"
                x2="32"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#3a8bfd" />
                <stop offset="0.5" stopColor="#855afc" />
                <stop offset="1" stopColor="#ff5f5f" />
              </linearGradient>
            </defs>
            <path
              d="M10 20.5 16 9.5l6 11M12.4 16.6h7.2"
              fill="none"
              stroke="url(#examax-spectrum)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
      <span
        className={cn(
          "font-satoshi text-[20px] font-bold leading-none tracking-tight",
          inverted ? "text-white" : "text-midnight-ink",
        )}
      >
        examax
      </span>
    </span>
  );
}
