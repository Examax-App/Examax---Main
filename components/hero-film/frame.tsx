"use client";

import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

const FrameContext = createContext<number | null>(null);

/**
 * The film's components read their frame from here rather than calling
 * Remotion's `useCurrentFrame` directly. Inside the Player a `FrameBridge`
 * supplies it; the static poster supplies a fixed frame through `FrameAt`, so
 * the same markup renders both without a second copy of the UI.
 */
export function useFrame(): number {
  return useContext(FrameContext) ?? 0;
}

/** Publishes the current Remotion frame to the subtree. */
export function FrameBridge({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  return <FrameContext.Provider value={frame}>{children}</FrameContext.Provider>;
}

/** Pins the subtree to one frame — the poster's still. */
export function FrameAt({ frame, children }: { frame: number; children: React.ReactNode }) {
  return <FrameContext.Provider value={frame}>{children}</FrameContext.Provider>;
}
