"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Dub's ClientOnly: the forms render in the browser only, because they read
 * the last-used sign-in method from localStorage and must not flash the
 * default arrangement first.
 */
export function ClientOnly({ className, children }: { className?: string; children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return <div className={className}>{hydrated ? children : null}</div>;
}
