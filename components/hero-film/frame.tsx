"use client";

import { createContext, useContext } from "react";

/** Exported for FrameBridge (frame-bridge.tsx), which feeds it from the Player. */
export const FrameContext = createContext<number | null>(null);

/**
 * The film's components read their frame from here rather than calling
 * Remotion's `useCurrentFrame` directly. Inside the Player a `FrameBridge`
 * (frame-bridge.tsx — kept apart so this file, which the server-rendered
 * posters use, never pulls in Remotion) supplies it; the static poster supplies a fixed frame through `FrameAt`, so
 * the same markup renders both without a second copy of the UI.
 */
export function useFrame(): number {
  return useContext(FrameContext) ?? 0;
}

/** Pins the subtree to one frame — the poster's still. */
export function FrameAt({ frame, children }: { frame: number; children: React.ReactNode }) {
  return <FrameContext.Provider value={frame}>{children}</FrameContext.Provider>;
}
