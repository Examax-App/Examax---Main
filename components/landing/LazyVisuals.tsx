"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";

/*
 * The landing page's interactive pictures — the product mockups, the agent
 * chat window and the simulation film — as lazy islands. Every heading, line
 * and link around them is still rendered on the server; only the pictures'
 * code waits. Each one holds a box of exactly its own size until it is
 * within 600px of the screen, then loads, so a visitor scrolling down never
 * meets an empty frame and nothing on the page moves.
 *
 * Loading them up front was most of the landing page's JavaScript: on a
 * phone it delayed the first paint and blocked the main thread for pictures
 * nobody had scrolled to yet.
 */

/** Renders `children` once the box is near the screen; until then, the empty box. */
function NearScreen({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {near ? children : null}
    </div>
  );
}

/* ── Feature stage pictures: each fills the stage's fixed 800 × 440 slot ── */

const STAGE_SLOT = "size-full";

const QuestionRowsLazy = dynamic(() => import("@/components/mockups/PracticeStage").then((m) => m.QuestionRows), { ssr: false });
const TopicTilesLazy = dynamic(() => import("@/components/mockups/PracticeStage").then((m) => m.TopicTiles), { ssr: false });
const NewSetLazy = dynamic(() => import("@/components/mockups/PracticeStage").then((m) => m.NewSet), { ssr: false });
const ProgressFunnelLazy = dynamic(() => import("@/components/mockups/ProgressStage").then((m) => m.ProgressFunnel), { ssr: false });
const LiveProgressLazy = dynamic(() => import("@/components/mockups/ProgressStage").then((m) => m.LiveProgress), { ssr: false });
const ProgressProfileLazy = dynamic(() => import("@/components/mockups/ProgressStage").then((m) => m.ProgressProfile), { ssr: false });
const TopicFeedLazy = dynamic(() => import("@/components/mockups/ReadinessStage").then((m) => m.TopicFeed), { ssr: false });
const WeakSpotsLazy = dynamic(() => import("@/components/mockups/ReadinessStage").then((m) => m.WeakSpots), { ssr: false });
const ReadinessDashboardLazy = dynamic(() => import("@/components/mockups/ReadinessStage").then((m) => m.ReadinessDashboard), { ssr: false });
const SheetFlowLazy = dynamic(() => import("@/components/mockups/PlatformStage").then((m) => m.SheetFlow), { ssr: false });
const KnowledgeSyncLazy = dynamic(() => import("@/components/mockups/PlatformStage").then((m) => m.KnowledgeSync), { ssr: false });
const SubjectWindowLazy = dynamic(() => import("@/components/mockups/PlatformStage").then((m) => m.SubjectWindow), { ssr: false });

export function QuestionRows() {
  return <NearScreen className={STAGE_SLOT}><QuestionRowsLazy /></NearScreen>;
}
export function TopicTiles() {
  return <NearScreen className={STAGE_SLOT}><TopicTilesLazy /></NearScreen>;
}
export function NewSet() {
  return <NearScreen className={STAGE_SLOT}><NewSetLazy /></NearScreen>;
}
export function ProgressFunnel() {
  return <NearScreen className={STAGE_SLOT}><ProgressFunnelLazy /></NearScreen>;
}
export function LiveProgress() {
  return <NearScreen className={STAGE_SLOT}><LiveProgressLazy /></NearScreen>;
}
export function ProgressProfile() {
  return <NearScreen className={STAGE_SLOT}><ProgressProfileLazy /></NearScreen>;
}
export function TopicFeed() {
  return <NearScreen className={STAGE_SLOT}><TopicFeedLazy /></NearScreen>;
}
export function WeakSpots() {
  return <NearScreen className={STAGE_SLOT}><WeakSpotsLazy /></NearScreen>;
}
export function ReadinessDashboard() {
  return <NearScreen className={STAGE_SLOT}><ReadinessDashboardLazy /></NearScreen>;
}
export function SheetFlow() {
  return <NearScreen className={STAGE_SLOT}><SheetFlowLazy /></NearScreen>;
}
export function KnowledgeSync() {
  return <NearScreen className={STAGE_SLOT}><KnowledgeSyncLazy /></NearScreen>;
}
export function SubjectWindow() {
  return <NearScreen className={STAGE_SLOT}><SubjectWindowLazy /></NearScreen>;
}

/* ── The two large pictures: the same outer box as each component's own ── */

const AgentShowcaseLazy = dynamic(() => import("@/components/mockups/AgentShowcase").then((m) => m.AgentShowcase), { ssr: false });
const SimulationShowcaseLazy = dynamic(() => import("@/components/mockups/SimulationShowcase").then((m) => m.SimulationShowcase), { ssr: false });

/** The agent window: 1000px wide at most, 600px tall — AgentShowcase's own frame. */
export function AgentShowcase() {
  return (
    <NearScreen className={cn("mx-auto min-h-[600px] w-full max-w-[1000px]")}>
      <AgentShowcaseLazy />
    </NearScreen>
  );
}

/** The simulation film: 1000px wide at most, in the film's 1200:640 frame — SimulationShowcase's own. */
export function SimulationShowcase() {
  return (
    <NearScreen className="mx-auto aspect-[1200/640] w-full max-w-[1000px]">
      <SimulationShowcaseLazy />
    </NearScreen>
  );
}
