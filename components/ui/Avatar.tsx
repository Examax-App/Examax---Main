import { cn } from "@/lib/cn";

const tints = [
  "bg-soft-blue text-electric-blue",
  "bg-soft-mint text-[#166534]",
  "bg-soft-violet text-lavender",
  "bg-paper-mist text-steel",
];

/**
 * Initials avatar on a soft tinted disc — no stock photography (DESIGN.md).
 *
 * `fill` takes the size of its parent, for slots sized by their container
 * (a square photo well in a fixed-height card); `square` swaps the disc for
 * the reference's 6px-radius tile.
 */
export function Avatar({
  name,
  size = "md",
  square = false,
  className,
}: {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "fill";
  square?: boolean;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tint = tints[(name.charCodeAt(0) + name.length) % tints.length];
  const sizes = {
    xs: "size-5 text-[8px]",
    sm: "size-6 text-[9px]",
    md: "size-8 text-[11px]",
    lg: "size-10 text-[13px]",
    xl: "size-11 text-[14px]",
    fill: "size-full text-[15px]",
  } as const;

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center font-semibold",
        square ? "rounded-inputs" : "rounded-full",
        sizes[size],
        tint,
        className,
      )}
    >
      {initials}
    </span>
  );
}
