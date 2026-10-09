"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { BotAvatar, type BotAvatarType } from "bot-avatars";
import { BadgePercent, LayoutDashboard, MessagesSquare, PencilLine, Route, Timer, X, Zap } from "lucide-react";
import { AccentTile, accentStyles, type Accent } from "@/components/ui/FeaturePill";
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

/*
 * The agent at the centre, wired to the rest of Examax. After 21st.dev's
 * integration card: the parts sit scattered round the hub rather than on a
 * grid, each line leaves the hub, turns once on a rounded corner and runs
 * to its part, and soft pulses run along the lines into the agent — the
 * agent taking in everything the student does. Each line keeps its own
 * rhythm, with a fresh random pause before every pulse, so they never fire
 * together or settle into a pattern.
 *
 * One treatment for every line: a hairline rail with a neutral pulse. Drawn
 * on a fixed 460 × 290 board and scaled down to fit narrower cells, so the
 * chips never collide with the lines.
 */
const BOARD = { width: 460, height: 290 };

type HubPart = {
  label: string;
  icon: IconComponent;
  accent: Accent;
  x: number;
  y: number;
  /** From under the chip to under the agent's tile; the pulse runs along it. */
  path: string;
};

/** The agent's tile spans about 205–255 × 120–170; every line ends beneath it. */
const HUB_PARTS: HubPart[] = [
  { label: "Roadmapa", icon: Route, accent: "blue", x: 92, y: 62, path: "M 92 62 H 204 Q 216 62 216 74 V 145" },
  { label: "Panel", icon: LayoutDashboard, accent: "sapphire", x: 322, y: 46, path: "M 322 46 H 256 Q 244 46 244 58 V 145" },
  { label: "Trening", icon: PencilLine, accent: "green", x: 112, y: 150, path: "M 112 150 H 230" },
  { label: "Postępy", icon: BadgePercent, accent: "tangerine", x: 392, y: 150, path: "M 392 150 H 230" },
  { label: "Symulacje", icon: Timer, accent: "lavender", x: 222, y: 256, path: "M 222 256 V 145" },
  { label: "Rozmowy", icon: MessagesSquare, accent: "yellow", x: 376, y: 230, path: "M 376 230 H 260 Q 248 230 248 218 V 145" },
];

/** Every line is measured on the same normalised length, so a pulse crosses each the same way. */
const PATH_LENGTH = 100;
const PULSE = 26;

/** How long one pulse takes to cross, and the pause before the next — both drawn fresh each time, in seconds. */
const CROSSING = { min: 2.4, spread: 0.8 };
const PAUSE = { min: 1.2, spread: 3.8 };

const between = ({ min, spread }: { min: number; spread: number }) => min + Math.random() * spread;

function HubLine({ part, index, live }: { part: HubPart; index: number; live: boolean }) {
  const gradientId = `${useId()}-pulse`;
  const pulse = useRef<SVGPathElement>(null);

  // One pulse at a time: cross the line, wait a random beat, go again. The
  // first pulse is also held back a random beat, so the lines start apart.
  useEffect(() => {
    const node = pulse.current;
    if (!live || !node) return;
    let stopped = false;
    let timer = 0;
    let crossing: AnimationPlaybackControls | undefined;
    const send = () => {
      if (stopped) return;
      crossing = animate(
        node,
        { strokeDashoffset: [PULSE, -PATH_LENGTH] },
        {
          duration: between(CROSSING),
          ease: "linear",
          onComplete: () => {
            if (!stopped) timer = window.setTimeout(send, between(PAUSE) * 1000);
          },
        },
      );
    };
    timer = window.setTimeout(send, Math.random() * 4500);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      crossing?.stop();
    };
  }, [live]);

  return (
    <>
      <motion.path
        d={part.path}
        stroke="var(--color-ash)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      />
      {live ? (
        <>
          {/* Clear at both ends and soft grey between, so the pulse fades in
              off the chip and out into the agent */}
          <defs>
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={part.x} y1={part.y} x2={BOARD.width / 2} y2={BOARD.height / 2}>
              <stop offset="0%" stopColor="var(--color-charcoal)" stopOpacity="0" />
              <stop offset="55%" stopColor="var(--color-charcoal)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-charcoal)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Parked just before the line's start until its first pulse */}
          <path
            ref={pulse}
            d={part.path}
            pathLength={PATH_LENGTH}
            stroke={`url(#${gradientId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${PULSE} ${PATH_LENGTH + PULSE}`}
            strokeDashoffset={PULSE}
          />
        </>
      ) : null}
    </>
  );
}

export function ConnectedHub() {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // The pulses run only while the board is on screen, and never for a
  // visitor who asks for less motion.
  const inView = useInView(frame);
  const reduced = useReducedMotion();
  const live = inView && !reduced;

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / BOARD.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} aria-hidden className="pointer-events-none flex size-full select-none items-center justify-center">
      <div className="relative shrink-0" style={{ width: BOARD.width, height: BOARD.height, scale }}>
        <svg viewBox={`0 0 ${BOARD.width} ${BOARD.height}`} className="absolute inset-0 size-full" fill="none">
          {HUB_PARTS.map((part, index) => (
            <HubLine key={part.label} part={part} index={index} live={live} />
          ))}
        </svg>

        {/* The agent: its mark in one white tile, with a faint ring that breathes out from it */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative rounded-xl border border-ash bg-white p-2 shadow-md">
            <span className={cn("grid size-8 place-items-center rounded-[9px] border border-black/5", accentStyles.yellow.chip)}>
              <Zap className="size-5" strokeWidth={2.5} />
            </span>
            {live ? (
              <motion.div
                className="absolute -inset-px rounded-xl border border-black/10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
              />
            ) : null}
          </div>
        </motion.div>

        {HUB_PARTS.map((part, index) => (
          <motion.span
            key={part.label}
            className="absolute flex items-center gap-2 whitespace-nowrap rounded-lg border border-ash bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-charcoal shadow-subtle"
            style={{ left: part.x, top: part.y, x: "-50%", y: "-50%" }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <AccentTile icon={part.icon} accent={part.accent} size="sm" />
            {part.label}
          </motion.span>
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
