import type { ComponentType } from "react";

/**
 * Anything the UI can drop into an `icon={...}` slot.
 *
 * The lucide set covers almost everything, but the agent mark is a raster
 * (components/ui/AgentIcon), so the slots it flows through are typed by the
 * props they actually pass rather than by LucideIcon. Every lucide icon
 * satisfies this shape, so existing call sites are unaffected.
 */
export type IconComponent = ComponentType<{
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}>;
