"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/*
 * dub.co/about's globe (its page bundle, read 2026-10-02): a cobe dotted
 * globe in white with a warm glow, turning 0.002 rad a frame. It can be
 * dragged sideways and springs to wherever it is let go. The canvas fades
 * out below its middle, so only the top of the sphere shows over the
 * section heading. A round flag sits on every place the team lives, tilted
 * a few degrees, and blinks out while that side of the globe is turned away.
 *
 * The cobe options are dub's own. Examax is made in Poland, so there is one
 * flag, and the globe starts turned to face it.
 */

type Place = { name: string; location: [number, number]; nudge: { x: number; y: number; rotation: number } };

const PLACES: Place[] = [{ name: "Polska", location: [52.07, 19.48], nudge: { x: 0, y: -10, rotation: -7 } }];

/** The rotation that brings a longitude to the front of the globe (cobe's projection, solved for x = 0). */
const facing = (longitude: number) => (3 * Math.PI) / 2 - (longitude * Math.PI) / 180;

/** Dub's projection of a place onto the canvas, as fractions of its size, and whether it faces the viewer. */
function project([lat, lon]: [number, number], phi: number, theta = 0) {
  const a = (lat * Math.PI) / 180;
  const b = (lon * Math.PI) / 180 - Math.PI;
  const cosA = Math.cos(a);
  const point = [-cosA * Math.cos(b) * 0.85, 0.85 * Math.sin(a), cosA * Math.sin(b) * 0.85];
  const ct = Math.cos(theta);
  const cp = Math.cos(phi);
  const st = Math.sin(theta);
  const sp = Math.sin(phi);
  const x = cp * point[0] + sp * point[2];
  const y = sp * st * point[0] + ct * point[1] - cp * st * point[2];
  const z = -sp * ct * point[0] + st * point[1] + cp * ct * point[2];
  return { x: (x + 1) / 2, y: (-y + 1) / 2, visible: z >= 0 || x * x + y * y >= 0.64 };
}

/** Dub's drag spring (react-spring: mass 1, tension 280, friction 60), stepped once a frame. */
const TENSION = 280;
const FRICTION = 60;
const SPIN = 0.002;

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flagRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const drag = useRef<{ start: number | null; movement: number; target: number }>({ start: null, movement: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = canvas.offsetWidth || 440;
    const onResize = () => {
      width = canvas.offsetWidth || width;
    };
    window.addEventListener("resize", onResize);

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi: facing(PLACES[0].location[1]),
      theta: 0,
      dark: 0,
      diffuse: 1.35,
      scale: 1,
      mapSamples: 17000,
      mapBrightness: 5,
      baseColor: [1, 1, 1],
      markerColor: [238 / 255, 88 / 255, 12 / 255],
      offset: [0, 0],
      glowColor: [252 / 255, 242 / 255, 227 / 255],
      opacity: 0.9,
      markers: [],
    });

    let spin = facing(PLACES[0].location[1]);
    let offset = 0;
    let velocity = 0;
    let frame = 0;
    let onScreen = true;

    const draw = () => {
      if (!still) spin += SPIN;
      // Spring the drag offset towards where the pointer has taken it
      const dt = 1 / 60;
      velocity += (TENSION * (drag.current.target - offset) - FRICTION * velocity) * dt;
      offset += velocity * dt;
      const phi = spin + offset;
      globe.update({ phi, width, height: width });

      PLACES.forEach((place, index) => {
        const flag = flagRefs.current[index];
        if (!flag) return;
        const { x, y, visible } = project(place.location, phi);
        flag.style.left = `${x * 100}%`;
        flag.style.top = `${y * 100}%`;
        flag.style.opacity = visible ? "1" : "0";
      });

      frame = onScreen ? window.requestAnimationFrame(draw) : 0;
    };
    frame = window.requestAnimationFrame(draw);

    // Stop drawing while the globe is off screen; pick up where it left off
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !frame) frame = window.requestAnimationFrame(draw);
    });
    observer.observe(canvas);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, []);

  const release = (event: React.PointerEvent) => {
    drag.current.start = null;
    (event.currentTarget as HTMLElement).style.cursor = "";
  };

  return (
    <div
      className="relative aspect-square w-full cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={(event) => {
        drag.current.start = event.clientX - drag.current.movement;
        event.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        const { start } = drag.current;
        if (start === null) return;
        const movement = event.clientX - start;
        drag.current.movement = movement;
        drag.current.target = event.pointerType === "touch" ? movement / 100 : movement / 200;
      }}
      onPointerUp={release}
      onPointerLeave={release}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="aspect-square w-full [mask-image:linear-gradient(to_bottom,black_0%,black_30%,transparent_60%,transparent_100%)]"
      />
      <div aria-hidden className="absolute inset-0 overflow-visible">
        {PLACES.map((place, index) => (
          <span
            key={place.name}
            ref={(node) => {
              flagRefs.current[index] = node;
            }}
            className="absolute size-8 select-none overflow-hidden rounded-full bg-white p-0.5 opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.14)] ring-1 ring-black/5"
            style={{
              transform: `translate(calc(-50% + ${place.nudge.x}px), calc(-50% + ${place.nudge.y}px)) rotate(${place.nudge.rotation}deg)`,
              transition: "opacity 150ms ease",
            }}
          >
            <PolishFlag />
          </span>
        ))}
      </div>
    </div>
  );
}

/** The flag of Poland as a disc: white over red. */
function PolishFlag() {
  return (
    <svg viewBox="0 0 32 32" className="size-full rounded-full">
      <title>Polska</title>
      <rect width="32" height="16" fill="#ffffff" />
      <rect y="16" width="32" height="16" fill="#dc143c" />
      <circle cx="16" cy="16" r="15.5" fill="none" stroke="rgba(0,0,0,0.08)" />
    </svg>
  );
}
