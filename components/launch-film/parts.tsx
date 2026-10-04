import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, ramp } from "@/components/hero-film/motion";
import { cn } from "@/lib/cn";

/*
 * The launch film's vocabulary, after dub.co's own product film
 * (assets.dub.co/misc/dub-conversions.mp4, studied frame by frame on
 * 2026-10-02): a white field with a faint grid, big Satoshi lines whose
 * words arrive one at a time — soft and grey, then sharp and black — and
 * product pieces that float in space on soft shadows, tilted in 3D, while
 * the camera drifts past them.
 */

/** The field behind every scene: white, a faint 80px grid, fading out towards the edges. */
export function Stage() {
  const frame = useCurrentFrame();
  const drift = (frame * 0.15) % 80;
  return (
    <AbsoluteFill className="bg-white">
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(#efefef 1.5px, transparent 1.5px), linear-gradient(90deg, #efefef 1.5px, transparent 1.5px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `${-drift}px ${-drift / 2}px`,
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
}

/**
 * A line whose words arrive one by one: each fades and lifts in out of a
 * blur, grey at first, then darkens to ink — dub's kinetic type.
 */
export function Words({
  text,
  at = 0,
  step = 4,
  from = "#c4c4c4",
  to = "#171717",
  className,
  style,
}: {
  text: string;
  at?: number;
  step?: number;
  from?: string;
  to?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  return (
    <span className={cn("inline-block", className)} style={style}>
      {text.split(" ").map((word, i) => {
        const t = ramp(frame, at + i * step, 14);
        const ink = ramp(frame, at + i * step + 5, 18);
        return (
          <span
            key={i}
            className="inline-block whitespace-pre"
            style={{
              opacity: t,
              transform: `translateY(${(1 - t) * 0.28}em)`,
              filter: `blur(${(1 - t) * 10}px)`,
              color: interpolateColors(ink, [0, 1], [from, to]),
            }}
          >
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

/** A display line, centred near the top of the frame. */
export function Headline({ children, top = 150, className }: { children: React.ReactNode; top?: number; className?: string }) {
  return (
    <div className={cn("absolute inset-x-0 z-20 text-center font-satoshi font-medium leading-[1.08] tracking-[-0.02em]", className)} style={{ top }}>
      {children}
    </div>
  );
}

/** A floating product piece: white, hairline edge, a deep soft shadow. */
export function Card({ className, style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-ash bg-white font-inter text-charcoal shadow-[0_40px_80px_-30px_rgba(0,0,0,0.22),0_4px_14px_rgba(0,0,0,0.05)]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * Every scene's envelope: it leaves over its last frames, softening,
 * shrinking a touch and fading, so the next one can arrive on the downbeat.
 */
export function Scene({ frames, children }: { frames: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [frames - 12, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: `blur(${out * 12}px)`, transform: `scale(${1 - out * 0.03})` }}>{children}</AbsoluteFill>
  );
}

/** A springy arrival from below, for cards: 0 → 1. */
export function useArrival(at: number, damping = 16): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass: 0.9, stiffness: 120 } });
}

/** The text caret, blinking at the usual half-second. */
export function Caret({ className }: { className?: string }) {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 15) % 2 === 0;
  return <span className={cn("ml-[0.04em] inline-block w-[0.06em] translate-y-[0.1em] bg-current", className)} style={{ height: "1em", opacity: on ? 1 : 0 }} />;
}

/** A slow idle float, so nothing in the film ever sits perfectly still. */
export function bob(frame: number, amount = 6, period = 90, phase = 0): number {
  return Math.sin(((frame + phase) / period) * Math.PI * 2) * amount;
}

/** The product pointer, at film size (the hero film's arrowhead, scaled up). */
export function Pointer({ x, y, pressed = 0, opacity = 1 }: { x: number; y: number; pressed?: number; opacity?: number }) {
  const path = "M3.4 3.3 15.8 7.6 10.9 9.5 8 15.6Z";
  return (
    <svg
      viewBox="0 0 20 20"
      width="46"
      height="46"
      className="pointer-events-none absolute left-0 top-0 z-50"
      style={{
        transform: `translate(${x - 7}px, ${y - 7}px) scale(${1 - pressed * 0.14})`,
        transformOrigin: "7px 7px",
        opacity,
        filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.22)) drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
      }}
    >
      <path d={path} fill="none" stroke="#fff" strokeWidth="4.2" strokeLinejoin="round" />
      <path d={path} fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Where the pointer is at `frame`, gliding between keyframes with the hero
 * film's ease, plus how far a click has pressed it (0–1).
 */
export function pointerAt(frame: number, keys: Array<{ at: number; x: number; y: number; click?: boolean }>) {
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame >= a.at) {
      const t = interpolate(frame, [a.at, b.at], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
    }
  }
  const pressed = keys.reduce((acc, k) => {
    if (!k.click) return acc;
    const d = frame - k.at;
    if (d < 0 || d >= 10) return acc;
    return Math.max(acc, d < 4 ? d / 4 : 1 - (d - 4) / 6);
  }, 0);
  const first = keys[0].at;
  const last = keys[keys.length - 1].at;
  const opacity =
    interpolate(frame, [first - 10, first], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [last + 14, last + 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { x, y, pressed, opacity };
}
