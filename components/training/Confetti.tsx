"use client";

import { useMemo } from "react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * The reference's celebration burst (dub.co/partners fires canvas-confetti
 * when a program launches and when a bounty pays out), drawn here as a few
 * dozen DOM pieces on CSS vectors — no canvas, no dependency.
 *
 * Pieces take the page's accents, not a rainbow. Seeded, so the burst is the
 * same every time and identical on server and client. Mount it (with a new
 * `key`) to fire it; reduced motion renders nothing.
 */
const COLOURS = ["#16a34a", "#4ade80", "#2563eb", "#60a5fa", "#7c3aed", "#a78bfa", "#facc15"];

function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
}

export function Confetti({
  count = 36,
  spread = 150,
  seed = 7,
  className,
}: {
  count?: number;
  /** How far, in px, the furthest pieces travel from the origin. */
  spread?: number;
  seed?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const pieces = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const distance = spread * (0.35 + random() * 0.65);
      return {
        id: index,
        dx: Math.cos(angle) * distance,
        // A little gravity: the burst settles lower than it rose.
        dy: Math.sin(angle) * distance * 0.8 + 30,
        rot: (random() - 0.5) * 720,
        width: 3 + random() * 3,
        height: 5 + random() * 4,
        round: random() > 0.6,
        colour: COLOURS[index % COLOURS.length],
        delay: random() * 120,
        duration: 1100 + random() * 700,
      };
    });
  }, [count, spread, seed]);

  if (reducedMotion) return null;

  return (
    <div aria-hidden className={className ?? "pointer-events-none absolute left-1/2 top-1/2 z-20"}>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="animate-confetti-burst absolute left-0 top-0"
          style={
            {
              width: piece.width,
              height: piece.round ? piece.width : piece.height,
              borderRadius: piece.round ? 9999 : 1,
              background: piece.colour,
              "--dx": `${piece.dx}px`,
              "--dy": `${piece.dy}px`,
              "--rot": `${piece.rot}deg`,
              "--delay": `${piece.delay}ms`,
              "--duration": `${piece.duration}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
