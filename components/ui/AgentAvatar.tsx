"use client";

import {
  BotAvatar,
  type BotAvatarProps,
  type BotAvatarState,
  type BotAvatarType,
} from "bot-avatars";

import { TextShimmer } from "@/components/ui/TextShimmer";
import { cn } from "@/lib/cn";

export type AgentStatus = "idle" | "working" | "sleeping";

const STATUSES: Record<AgentStatus, { state: BotAvatarState; label: string }> = {
  idle: { state: "default", label: "Gotowy" },
  working: { state: "working", label: "Pracuje…" },
  sleeping: { state: "sleeping", label: "Uśpiony" },
};

export type AgentAvatarProps = Omit<React.ComponentProps<"span">, "color"> & {
  /** One of the eighteen bodies. Give each agent its own and keep it. */
  type?: BotAvatarType;
  status?: AgentStatus;
  /** Shown beside the avatar. Leave it out for the avatar alone. */
  name?: string;
  /** Replaces the status line for the current status, e.g. what it's doing. */
  statusLabel?: string;
  /** Pixels. The canvas reserves exactly this square, hops included. */
  size?: number;
  /** Adds a mouth that changes with the status. */
  mouth?: boolean;
  /** Any other `BotAvatar` prop — colour, shading, jump tuning. */
  avatarProps?: Omit<BotAvatarProps, "type" | "state" | "size" | "face">;
};

/**
 * An AI agent's face. The avatar is a live canvas that looks around when idle,
 * hops while it works and dozes when asleep — the motion carries the status on
 * its own, and the text line is there for anyone who isn't looking.
 *
 * Every status label sits in the same grid cell, so the line is as wide as the
 * longest one and a status change never nudges what's beside it. They
 * cross-fade through a slight blur so it reads as one label changing, not two
 * overlapping. The canvas paints after mount, so this is safe to render from a
 * server component and the box is reserved from the first paint.
 *
 * The root is a `<span>` (inline-flex) rather than a `<div>`, so the avatar can
 * sit inside running text — a paragraph cannot contain a `<div>`.
 */
export function AgentAvatar({
  type = "clover",
  status = "idle",
  name,
  statusLabel,
  size = 48,
  mouth = false,
  avatarProps,
  className,
  ...props
}: AgentAvatarProps) {
  const labelFor = (key: AgentStatus) =>
    key === status && statusLabel ? statusLabel : STATUSES[key].label;

  return (
    <span className={cn("inline-flex items-center gap-3", className)} {...props}>
      <BotAvatar
        type={type}
        state={STATUSES[status].state}
        size={size}
        face={mouth ? "mouth" : "eyes"}
        // With a name beside it the text says everything; without one the
        // canvas keeps its own per-state label ("Clover bot, working").
        aria-hidden={name ? true : undefined}
        {...avatarProps}
      />
      {name ? (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-body font-medium text-charcoal">
            {name}
          </span>
          <span className="sr-only" aria-live="polite">
            {labelFor(status)}
          </span>
          <span aria-hidden className="grid text-caption">
            {(Object.keys(STATUSES) as AgentStatus[]).map((key) => {
              const active = key === status;
              const Label = key === "working" ? TextShimmer : "span";
              return (
                <Label
                  key={key}
                  className={cn(
                    "col-start-1 row-start-1 truncate",
                    // TextShimmer paints its own gradient into the glyphs.
                    key !== "working" && "text-steel",
                    "transition-[opacity,filter] duration-200 ease-snap",
                    active ? "opacity-100 blur-0" : "opacity-0 blur-[2px]",
                  )}
                >
                  {labelFor(key)}
                </Label>
              );
            })}
          </span>
        </span>
      ) : null}
    </span>
  );
}
