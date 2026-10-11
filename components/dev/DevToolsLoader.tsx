"use client";

import dynamic from "next/dynamic";

/*
 * Loads the Examax dev panel in the browser only. app/layout.tsx renders
 * this when NODE_ENV is "development"; in a production build that branch is
 * gone, and with it this import and the panel's code.
 */
const DevTools = dynamic(() => import("@/components/dev/DevTools").then((module) => module.DevTools), { ssr: false });

export function DevToolsLoader() {
  return <DevTools />;
}
