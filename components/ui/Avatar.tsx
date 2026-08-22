import { cn } from "@/lib/cn";

const tints = [
  "bg-soft-mint text-vivid-green",
  "bg-[#fde8d8] text-tangerine",
  "bg-[#ece2fb] text-lavender",
  "bg-sidebar-active text-electric-blue",
  "bg-paper-mist text-steel",
];

/** Initials avatar on a soft tinted disc — no stock photography (DESIGN.md). */
export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
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
    lg: "size-12 text-body",
  } as const;

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        sizes[size],
        tint,
        className,
      )}
    >
      {initials}
    </span>
  );
}
