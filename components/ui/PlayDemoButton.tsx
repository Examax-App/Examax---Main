"use client";

import { Play } from "lucide-react";

/**
 * The floating white "Play demo" pill that sits at the top-left of each
 * product demo panel, restarting that panel's inline animation.
 */
export function PlayDemoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute -left-2 -top-4 z-20 inline-flex items-center gap-2 rounded-full border border-ash bg-white py-2 pl-3 pr-4 text-body font-medium text-charcoal shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal motion-reduce:hover:translate-y-0"
    >
      <span className="grid size-5 place-items-center rounded-full bg-midnight-ink text-white">
        <Play className="size-2.5 fill-current" aria-hidden />
      </span>
      Play demo
    </button>
  );
}
