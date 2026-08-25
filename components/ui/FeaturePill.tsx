import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type Accent = "tangerine" | "green" | "lavender" | "blue";

export const accentStyles: Record<
  Accent,
  { tile: string; chip: string; text: string; border: string }
> = {
  tangerine: {
    tile: "bg-tangerine",
    chip: "bg-[#fb923c] text-[#7c2d12]",
    text: "text-tangerine",
    border: "border-tangerine",
  },
  green: {
    tile: "bg-vivid-green",
    chip: "bg-[#4ade80] text-[#14532d]",
    text: "text-vivid-green",
    border: "border-vivid-green",
  },
  lavender: {
    tile: "bg-lavender",
    chip: "bg-[#a78bfa] text-[#2e1065]",
    text: "text-lavender",
    border: "border-lavender",
  },
  blue: {
    tile: "bg-electric-blue",
    chip: "bg-[#60a5fa] text-[#1e3a8a]",
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
        "grid shrink-0 place-items-center",
        // Eyebrow chip (reference): 16px, r4, soft 400-tint fill, deep-tone
        // glyph, hairline black/5 border. Larger tiles stay solid + white.
        size === "sm"
          ? cn(
              "size-4 rounded-[4px] border border-black/5",
              accentStyles[accent].chip,
            )
          : cn("size-5 rounded-[6px] text-white", accentStyles[accent].tile),
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
