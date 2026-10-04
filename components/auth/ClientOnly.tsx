"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Dub's ClientOnly: the forms render in the browser only, so they can ask
 * for the pointer type (autofocus, canAutoFocus) and measure their animated
 * heights from the first render.
 */
export function ClientOnly({ className, children }: { className?: string; children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return <div className={className}>{hydrated ? children : null}</div>;
}
