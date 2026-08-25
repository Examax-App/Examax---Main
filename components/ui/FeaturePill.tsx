import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type Accent = "tangerine" | "green" | "lavender" | "blue";

export const accentStyles: Record<
  Accent,
  { tile: string; text: string; border: string }
> = {
  tangerine: {
    tile: "bg-tangerine",
    text: "text-tangerine",
    border: "border-tangerine",
  },
  green: {
    tile: "bg-vivid-green",
    text: "text-vivid-green",
    border: "border-vivid-green",
  },
  lavender: {
    tile: "bg-lavender",
    text: "text-lavender",
    border: "border-lavender",
  },
  blue: {
    tile: "bg-electric-blue",
    text: "text-electric-blue",
    border: "border-electric-blue",
  },
};

/** Small colored glyph tile — the emoji-style icon used in pills and eyebrows. */
export function AccentTile({
  icon: Icon,
  accent,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  accent: Accent;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center text-white",
        size === "sm" ? "size-4 rounded-[4px]" : "size-5 rounded-[6px]",
        accentStyles[accent].tile,
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-2.5" : "size-3"} strokeWidth={2.5} />
    </span>
  );
}

/**
 * Pill feature tag — the system's signature decorative element.
 * Transparent/white background, one colored glyph, 9999px radius.
 */
export function FeaturePill({
  icon,
  accent,
  label,
  active = false,
}: {
  icon: LucideIcon;
  accent: Accent;
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-body font-medium text-charcoal",
        active ? "border border-ash bg-white shadow-subtle" : "bg-white/60",
      )}
    >
      <AccentTile icon={icon} accent={accent} />
      {label}
    </span>
  );
}
