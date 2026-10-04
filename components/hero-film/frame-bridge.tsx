"use client";

import { useCurrentFrame } from "remotion";
import { FrameContext } from "@/components/hero-film/frame";

/**
 * Publishes the current Remotion frame to the subtree (see `useFrame` in
 * frame.tsx). Used inside Players only, so Remotion stays out of the posters.
 */
export function FrameBridge({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  return <FrameContext.Provider value={frame}>{children}</FrameContext.Provider>;
}
