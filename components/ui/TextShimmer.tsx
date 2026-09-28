import { cn } from "@/lib/cn";

export type TextShimmerProps = React.ComponentProps<"span">;

/**
 * A light sweep across text, for a label that's waiting on something.
 *
 * The gradient is painted into the glyphs with `background-clip: text` and the
 * background position animates — the text itself never moves, so there's no
 * layout cost and nothing shifts around it.
 */
export function TextShimmer({ className, children, ...props }: TextShimmerProps) {
  return (
    <span
      className={cn(
        "bg-clip-text font-medium text-transparent animate-shimmer-text",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--color-fog) 35%, var(--color-charcoal) 50%, var(--color-fog) 65%)",
        backgroundSize: "200% 100%",
      }}
      {...props}
    >
      {children}
    </span>
  );
}
