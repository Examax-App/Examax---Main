import Image from "next/image";
import { cn } from "@/lib/cn";

import examCke from "@/public/brand/exam-cke.png";

/**
 * The official Centralna Komisja Egzaminacyjna mark: the yellow block with
 * the white "CKE", from cke.gov.pl.
 *
 * Like E8Icon and MaturaIcon it is a raster, here in a portrait ratio,
 * fitted with `object-contain` so it keeps its proportions in whatever box
 * the slot gives it.
 */
export function CkeIcon({ className }: { className?: string }) {
  return (
    <Image
      src={examCke}
      alt=""
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
      loading="eager"
      sizes="32px"
    />
  );
}
