import { cn } from "@/lib/cn";

/** Column-rule offset — the same edge the `.col-rules` hairlines sit on. */
export const RULE_EDGE = "max(0px, calc(50% - var(--page-max-width) / 2))";

/**
 * Crop marks at the four corners of a block — the reference's measured-page
 * detail, and the reason its bands read as drawn on a grid rather than simply
 * stacked.
 *
 * Two hairline arms per corner, never a full border: the point is to say where
 * a block's edges *are* without boxing it in, so the marks can sit on content
 * that deliberately bleeds past them.
 *
 * `offset` moves the marks in from the container's own edges. A full-bleed band
 * passes {@link RULE_EDGE} so its ticks land exactly where the page's column
 * hairlines already run; a block that ends at its own edges leaves it at 0.
 *
 * The parent must be positioned.
 */
export function CornerMarks({
  offset = "0px",
  progress = 1,
  tint = "from-electric-blue/45 to-lavender/45",
  inset = "inset-0",
  className,
}: {
  /** Horizontal inset for the marks, as a CSS length. */
  offset?: string;
  /** 0–1 reveal, for bands that fade their marks in on scroll. */
  progress?: number;
  /** Tailwind gradient stops for the arms — the block's own accent. */
  tint?: string;
  /** Tailwind inset for the mark frame — negative values stand it off the block. */
  inset?: string;
  className?: string;
}) {
  const corners = [
    { key: "tl", side: { left: offset }, edge: "top-0", arm: "left-0 top-0" },
    { key: "tr", side: { right: offset }, edge: "top-0", arm: "right-0 top-0" },
    { key: "bl", side: { left: offset }, edge: "bottom-0", arm: "left-0 bottom-0" },
    { key: "br", side: { right: offset }, edge: "bottom-0", arm: "right-0 bottom-0" },
  ];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-[1] motion-reduce:opacity-100",
        inset,
        className,
      )}
      style={{ opacity: progress }}
    >
      {corners.map((corner) => (
        <span
          key={corner.key}
          className={cn("absolute size-3.5", corner.edge)}
          style={corner.side}
        >
          <span
            className={cn(
              "absolute h-px w-3.5 bg-gradient-to-r",
              tint,
              corner.arm,
            )}
          />
          <span
            className={cn(
              "absolute h-3.5 w-px bg-gradient-to-b",
              tint,
              corner.arm,
            )}
          />
        </span>
      ))}
    </div>
  );
}
