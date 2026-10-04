"use client";

import { BotAvatar, type BotAvatarType } from "bot-avatars";
import { BadgePercent, PencilLine, Route, Timer, X } from "lucide-react";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The two pictures in WorkSection's grid, after two of the cards under
 * Grok Bot's window (DesignRules/agents.png), drawn in dub's light build —
 * white cards on hairlines, a soft drop shadow, fading out at the foot:
 *
 *   "Grok Bot works where you work"  → ConnectedHub   (the agent and the rest of Examax)
 *   "Show a Bot how it's done"       → RoutineCard    (a weekly routine the agent keeps)
 *
 * The faces are the showcase team's (AgentShowcase), so the agents here are
 * the ones the hero's window shows.
 */

const CARD = "rounded-xl border border-ash bg-white shadow-[0_20px_20px_0_#00000017]";

function Face({ type, size }: { type: BotAvatarType; size: number }) {
  return <BotAvatar type={type} size={size} interactive={false} turn={0} aria-hidden />;
}

/* ── Works where you learn ───────────────────────────────────────────────── */

type HubPart = { label: string; icon: IconComponent; accent: Accent; x: number; y: number; path: string };

/** Coordinates on a 400 × 290 board; the agent sits at its centre. */
const HUB_PARTS: HubPart[] = [
  { label: "Trening", icon: PencilLine, accent: "green", x: 88, y: 52, path: "M88 70 C88 128 128 145 170 145" },
  { label: "Roadmapa", icon: Route, accent: "blue", x: 312, y: 52, path: "M312 70 C312 128 272 145 230 145" },
  { label: "Postępy", icon: BadgePercent, accent: "tangerine", x: 88, y: 238, path: "M88 220 C88 162 128 145 170 145" },
  { label: "Symulacja", icon: Timer, accent: "lavender", x: 312, y: 238, path: "M312 220 C312 162 272 145 230 145" },
];

export function ConnectedHub() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="flex size-full items-center justify-center">
      <div className="relative aspect-[400/290] w-full max-w-[400px]">
        <svg viewBox="0 0 400 290" className="absolute inset-0 size-full" fill="none">
          {HUB_PARTS.map((part) => (
            <path key={part.label} d={part.path} stroke="var(--color-ash)" strokeWidth="1.5" strokeDasharray="4 4" />
          ))}
          {!reduced
            ? HUB_PARTS.map((part, index) => (
                <circle key={part.label} r="3" className="fill-charcoal">
                  <animateMotion path={part.path} dur="3.2s" begin={`${index * 0.8}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                </circle>
              ))
            : null}
        </svg>

        {/* The agent, on a faint yellow glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute -inset-8 rounded-full bg-[#facc15] opacity-20 blur-2xl" />
          <div className="relative grid size-[60px] place-items-center rounded-2xl border border-ash bg-white shadow-md">
            <Face type="circle" size={40} />
          </div>
        </div>

        {HUB_PARTS.map((part) => (
          <span
            key={part.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-ash bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-charcoal shadow-subtle"
            style={{ left: `${(part.x / 400) * 100}%`, top: `${(part.y / 290) * 100}%` }}
          >
            <AccentTile icon={part.icon} accent={part.accent} size="sm" />
            {part.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── A routine it keeps ──────────────────────────────────────────────────── */

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const ON_DAYS = new Set(["Pn", "Śr", "Pt"]);

export function RoutineCard() {
  return (
    <div aria-hidden className="pointer-events-none size-full [mask-image:linear-gradient(black_72%,transparent)]">
      <div className={cn(CARD, "mx-auto flex max-w-[400px] cursor-default flex-col gap-4 p-4")}>
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium text-charcoal">Nowa rutyna</h4>
          <span className="flex size-6 items-center justify-center rounded-md border border-ash text-fog">
            <X className="size-3.5" strokeWidth={2} />
          </span>
        </div>

        <div>
          <span className="text-sm font-medium text-graphite">Agent</span>
          <div className="mt-1.5 flex w-fit items-center gap-2 rounded-lg border border-smoke bg-white py-1 pl-1.5 pr-2.5">
            <Face type="star" size={20} />
            <span className="text-xs font-medium text-graphite">Trener powtórek</span>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-graphite">Dni</span>
          <div className="mt-1.5 grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <span
                key={day}
                className={cn(
                  "grid h-7 place-items-center rounded-md border text-xs font-medium",
                  ON_DAYS.has(day) ? "border-charcoal text-charcoal ring-1 ring-charcoal" : "border-ash text-fog",
                )}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-sm font-medium text-graphite">Godzina</span>
            <div className="mt-1.5 rounded-lg border border-smoke px-2 py-1 text-xs tabular-nums text-graphite">18:00</div>
          </div>
          <div>
            <span className="text-sm font-medium text-graphite">Czas</span>
            <div className="mt-1.5 rounded-lg border border-smoke px-2 py-1 text-xs tabular-nums text-graphite">20 min</div>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-graphite">Zadanie</span>
          <div className="mt-1.5 rounded-lg border border-smoke px-2 py-1 text-xs text-graphite">Powtórka: funkcja liniowa i ciągi — 5 zadań z arkuszy CKE</div>
        </div>
      </div>
    </div>
  );
}
