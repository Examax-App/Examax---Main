import { cn } from "@/lib/cn";
import { AgentIcon } from "@/components/ui/AgentIcon";
import type { IconComponent } from "@/lib/icon";

export type Accent = "blue" | "green" | "lavender" | "sapphire" | "tangerine" | "yellow";

export const accentStyles: Record<
  Accent,
  { tile: string; chip: string; text: string; border: string }
> = {
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
  sapphire: {
    tile: "bg-deep-sapphire",
    chip: "bg-[#93c5fd] text-[#1e3a8a]",
    text: "text-deep-sapphire",
    border: "border-deep-sapphire",
  },
  // Dub's tangerine, the one warm accent in the token set — it carries the
  // exam simulation, which is the only feature meant to read as an event
  // rather than a study surface.
  tangerine: {
    tile: "bg-tangerine",
    chip: "bg-[#fdba74] text-[#7c2d12]",
    text: "text-tangerine",
    border: "border-tangerine",
  },
  // The agent's mark (2026-09-28, his call): a bright yellow chip with a black
  // lightning bolt, in place of the 3D bot and the raster agent icon.
  yellow: {
    tile: "bg-[#eab308]",
    chip: "bg-[#facc15] text-charcoal",
    text: "text-[#ca8a04]",
    border: "border-[#ca8a04]",
  },
};

/**
 * Small colored glyph tile — the emoji-style icon used in pills and eyebrows.
 *
 * One treatment everywhere: a soft 400-tint fill, a deep-tone glyph and a
 * hairline black/5 border. The reference gave its larger tiles a solid accent
 * fill with a white glyph instead, but that reads as a filled box with a
 * cut-out rather than as a drawn mark — the user asked (2026-08-29) for the
 * smaller chip's detail at every size, so the fill no longer varies with the
 * footprint.
 *
 * Three footprints: `xs` (16px) for the Product panel cards, where it is the
 * reference's own chip size, `sm` (20px) for eyebrows, footer rows and the
 * hero's tabs, and `lg` (26px) for roomier cards.
 */
export function AccentTile({
  icon: Icon,
  accent,
  size = "sm",
  className,
}: {
  icon: IconComponent;
  accent: Accent;
  size?: "xs" | "sm" | "lg";
  className?: string;
}) {
  // The agent mark is a raster: it cannot take the chip's `currentColor`
  // glyph treatment, and a photographic render inside a flat accent tint
  // reads as a sticker. It stands on its own at the chip's footprint instead.
  if (Icon === AgentIcon) {
    return (
      <AgentIcon
        className={cn(
          size === "lg" ? "size-[26px]" : size === "xs" ? "size-4" : "size-5",
          className,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center border border-black/5",
        accentStyles[accent].chip,
        // Every footprint keeps the glyph at about 0.6 of the tile, with the
        // radius scaled to match, so the mark is the same drawing at any size.
        size === "lg"
          ? "size-[26px] rounded-[7px]"
          : size === "xs"
            ? "size-4 rounded-[4px]"
            : "size-5 rounded-[5px]",
        className,
      )}
    >
      <Icon
        className={size === "lg" ? "size-4" : size === "xs" ? "size-2.5" : "size-3"}
        strokeWidth={2.5}
      />
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
  icon: IconComponent;
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
