import Image from "next/image";
import { cn } from "@/lib/cn";

import examE8 from "@/public/brand/exam-e8.png";

/**
 * The official Egzamin Ósmoklasisty (E8) mark.
 *
 * A raster in a landscape 1.44:1 ratio, where the icons around it are square
 * lucide glyphs. `object-contain` fits it inside whatever square box the slot
 * gives it, so it keeps its proportions and the card's layout is unchanged.
 *
 * The props mirror a lucide icon's shape (`className`, plus a `strokeWidth`
 * that is accepted and ignored) so it can be passed to the same `icon={...}`
 * slots the rest of the UI uses.
 */
export function E8Icon({ className }: { className?: string }) {
  return (
    <Image
      src={examE8}
      alt=""
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
      // Nav chrome, and small: eager beats a late pop-in, and the optimiser
      // serves a variant sized to the slot rather than the 256px master.
      loading="eager"
      sizes="48px"
    />
  );
}
