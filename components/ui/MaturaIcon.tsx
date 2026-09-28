import Image from "next/image";
import { cn } from "@/lib/cn";

import examMatura from "@/public/brand/exam-matura.png";

/**
 * The Matura exam mark.
 *
 * Like E8Icon this is a raster in a landscape ratio, fitted with
 * `object-contain` so it keeps its proportions inside whatever square box the
 * icon slot provides and the card's layout is unchanged.
 */
export function MaturaIcon({ className }: { className?: string }) {
  return (
    <Image
      src={examMatura}
      alt=""
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
      loading="eager"
      sizes="48px"
    />
  );
}
