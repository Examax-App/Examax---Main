"use client";

import { createContext, useContext } from "react";
import dynamic from "next/dynamic";

/*
 * The navbar's dropdown pictures (NavPreviews), loaded only once a visitor
 * reaches for the menus — the pointer entering the bar, or keyboard focus on
 * a trigger — instead of with every page. Each sits in a fixed slot of its
 * card (a 160px picture well, or a backdrop laid behind the copy), so the
 * panel's size never depends on them and nothing moves when they arrive.
 */

/** True once the visitor has reached for the menus; the Navbar provides it. */
export const NavPreviewsWanted = createContext(false);

const Training = dynamic(() => import("@/components/layout/NavPreviews").then((m) => m.TrainingPreview), { ssr: false });
const Roadmap = dynamic(() => import("@/components/layout/NavPreviews").then((m) => m.RoadmapPreview), { ssr: false });
const Progress = dynamic(() => import("@/components/layout/NavPreviews").then((m) => m.ProgressPreview), { ssr: false });
const Simulation = dynamic(() => import("@/components/layout/NavPreviews").then((m) => m.SimulationPreview), { ssr: false });
const AgentChat = dynamic(() => import("@/components/layout/NavPreviews").then((m) => m.AgentChatPreview), { ssr: false });

export function TrainingPreview() {
  return useContext(NavPreviewsWanted) ? <Training /> : null;
}
export function RoadmapPreview() {
  return useContext(NavPreviewsWanted) ? <Roadmap /> : null;
}
export function ProgressPreview({ color }: { color: string }) {
  return useContext(NavPreviewsWanted) ? <Progress color={color} /> : null;
}
export function SimulationPreview() {
  return useContext(NavPreviewsWanted) ? <Simulation /> : null;
}
export function AgentChatPreview() {
  return useContext(NavPreviewsWanted) ? <AgentChat /> : null;
}
