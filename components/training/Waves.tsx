import { cn } from "@/lib/cn";

/** One wave, lifted from the reference's invoice card (dub.co/partners). */
const WAVE =
  "M0.817 11.876C8.469 5.691 16.12 -0.494 23.772 1.163C31.423 2.821 39.075 12.32 46.726 11.876C54.378 11.431 62.029 1.044 69.681 1.163C77.332 1.282 84.985 11.907 92.636 11.876C100.288 11.844 107.939 1.155 115.591 1.163C123.242 1.172 130.894 11.877 138.545 11.876C146.197 11.874 153.848 1.163 161.5 1.163C169.151 1.163 176.803 11.874 184.454 11.876C192.106 11.877 199.757 1.172 207.409 1.163C215.06 1.155 222.712 11.844 230.363 11.876C238.015 11.907 245.667 1.282 253.318 1.163C260.97 1.044 268.621 11.431 276.273 11.876C283.924 12.32 291.576 2.821 299.227 1.163C306.879 -0.494 314.53 5.691 322.182 11.876";

/**
 * The reference's wave texture: rows of one wave every 13px, each stroked
 * with a gradient from light grey into `currentColor`, so a card can tint it
 * (grey while pending, green once checked) with a colour transition.
 */
export function Waves({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 323 100" fill="none" preserveAspectRatio="none" aria-hidden className={cn("pointer-events-none", className)}>
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0.8" x2="322" y1="6" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0.09" stopColor="#E8E8E8" />
          <stop offset="1" stopColor="currentColor" className="transition-colors duration-300" />
        </linearGradient>
        <pattern id={`${id}-pattern`} x="0" y="0" width="100%" height="13" patternUnits="userSpaceOnUse">
          <path d={WAVE} stroke={`url(#${id}-stroke)`} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
    </svg>
  );
}
