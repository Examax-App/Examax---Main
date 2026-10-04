import Image from "next/image";
import { cn } from "@/lib/cn";

import agentIcon from "@/public/brand/agent-icon.png";

/**
 * The Examax agent mark.
 *
 * Like E8Icon and MaturaIcon this is a raster in a landscape ratio, fitted
 * with `object-contain` so it keeps its proportions inside whatever square box
 * the icon slot provides and the surrounding layout is unchanged.
 *
 * The glass render carries both dark edges and bright highlights, so it holds
 * its shape on paper-white surfaces and on ink alike and needs no tile behind
 * it — it goes straight into the slot, like any other mark.
 *
 * The props mirror a lucide icon's shape (`className`, plus a `strokeWidth`
 * that is accepted and ignored) so it can be passed to the same `icon={...}`
 * slots the rest of the UI uses.
 */
export function AgentIcon({
  className,
}: {
  className?: string;
  /** Accepted for lucide compatibility; a raster has no stroke. */
  strokeWidth?: number;
}) {
  return (
    <Image
      src={agentIcon}
      alt=""
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
      // Chrome, not content: it sits in nav and hero surfaces above the fold,
      // where lazy-loading would pop it in a beat late. Rendered far below the
      // 256px master, so let the optimiser serve small.
      loading="eager"
      sizes="48px"
    />
  );
}
