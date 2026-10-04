"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Maximize, Minimize, Pause, PictureInPicture2, Play, RotateCcw, Settings, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * A video with dub's player chrome (the "Watch demo" dialog on
 * dub.co/analytics, media-chrome's Sutro theme): no native controls, a dark
 * gradient rising behind one row along the bottom — play, sound, time, the
 * timeline, then speed, picture-in-picture and fullscreen on the right. The
 * row fades away a moment after the pointer stops while the film plays, and
 * stays while it is paused.
 *
 * Keyboard, as on every major player: space or K plays and pauses, ← → jump
 * five seconds, J L ten, M mutes, F toggles fullscreen.
 */

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const IDLE_MS = 2200;

function time(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const CONTROL =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-white/90 transition-colors duration-75 hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70";

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  className,
}: {
  src: string;
  poster?: string;
  /** Read out for the video and its controls. */
  title: string;
  autoPlay?: boolean;
  className?: string;
}) {
  const shell = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const idle = useRef<number | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [speedMenu, setSpeedMenu] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [awake, setAwake] = useState(true);
  const [hover, setHover] = useState<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const showControls = !playing || awake || speedMenu || scrubbing;

  const wake = useCallback(() => {
    setAwake(true);
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setAwake(false), IDLE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(idle.current), []);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused || v.ended) void v.play();
    else v.pause();
  }, []);

  const seekBy = useCallback((delta: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = shell.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Autoplay with sound: the dialog opens on a click, so the browser allows it.
  // If it refuses anyway, fall back to muted rather than sitting on a black frame.
  useEffect(() => {
    const v = video.current;
    if (!v || !autoPlay) return;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      void v.play().catch(() => undefined);
    });
  }, [autoPlay]);

  const fractionAt = (clientX: number) => {
    const rect = bar.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  const scrubTo = (clientX: number) => {
    const v = video.current;
    if (!v || !v.duration) return;
    v.currentTime = fractionAt(clientX) * v.duration;
    setCurrent(v.currentTime);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("[role=menu]")) return;
    const key = event.key.toLowerCase();
    const handled = [" ", "k", "arrowleft", "arrowright", "j", "l", "m", "f"];
    if (!handled.includes(key)) return;
    // Space and Enter on a focused button belong to that button.
    if (key === " " && target.tagName === "BUTTON") return;
    event.preventDefault();
    wake();
    if (key === " " || key === "k") toggle();
    else if (key === "arrowleft") seekBy(-5);
    else if (key === "arrowright") seekBy(5);
    else if (key === "j") seekBy(-10);
    else if (key === "l") seekBy(10);
    else if (key === "m" && video.current) video.current.muted = !video.current.muted;
    else if (key === "f") toggleFullscreen();
  };

  const played = duration ? current / duration : 0;

  return (
    <div
      ref={shell}
      role="region"
      aria-label={title}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onPointerMove={wake}
      onPointerLeave={() => playing && setAwake(false)}
      className={cn("group/player relative overflow-hidden bg-black outline-none", !showControls && "cursor-none", className)}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        aria-label={title}
        onClick={toggle}
        onDoubleClick={toggleFullscreen}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
          wake();
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
        onTimeUpdate={(event) => {
          if (!scrubbing) setCurrent(event.currentTarget.currentTime);
        }}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onProgress={(event) => {
          const v = event.currentTarget;
          if (v.buffered.length && v.duration) setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
        }}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        onRateChange={(event) => setSpeed(event.currentTarget.playbackRate)}
        className="block size-full cursor-pointer bg-white object-contain"
      />

      {/* The chrome */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="pointer-events-auto relative flex items-center gap-1 px-3 pb-3 pt-8 text-white sm:gap-2 sm:px-5 sm:pb-4">
          <button type="button" onClick={toggle} aria-label={ended ? "Odtwórz ponownie" : playing ? "Pauza" : "Odtwórz"} className={CONTROL}>
            {ended ? <RotateCcw className="size-5" /> : playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (video.current) video.current.muted = !video.current.muted;
            }}
            aria-label={muted ? "Włącz dźwięk" : "Wycisz"}
            className={CONTROL}
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <span className="shrink-0 px-1 font-mono text-xs tabular-nums text-white/90 sm:text-[13px]">
            {time(current)} / {time(duration)}
          </span>

          {/* The timeline */}
          <div
            ref={bar}
            role="slider"
            tabIndex={0}
            aria-label="Postęp filmu"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            aria-valuetext={`${time(current)} z ${time(duration)}`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setScrubbing(true);
              scrubTo(event.clientX);
            }}
            onPointerMove={(event) => {
              setHover(fractionAt(event.clientX));
              if (scrubbing) scrubTo(event.clientX);
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId);
              setScrubbing(false);
            }}
            onPointerLeave={() => setHover(null)}
            className="group/bar relative mx-1 flex h-8 min-w-0 flex-1 cursor-pointer touch-none items-center outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/25 transition-[height] duration-150 group-hover/bar:h-1.5">
              <div className="absolute inset-y-0 left-0 bg-white/35" style={{ width: `${buffered * 100}%` }} />
              <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${played * 100}%` }} />
            </div>
            <span
              aria-hidden
              className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100"
              style={{ left: `${played * 100}%`, opacity: scrubbing ? 1 : undefined }}
            />
            {hover !== null && duration ? (
              <span
                aria-hidden
                className="absolute bottom-full mb-1 -translate-x-1/2 rounded-md bg-black/80 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-white"
                style={{ left: `${hover * 100}%` }}
              >
                {time(hover * duration)}
              </span>
            ) : null}
          </div>

          {/* Speed */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSpeedMenu((open) => !open)}
              aria-label="Prędkość odtwarzania"
              aria-haspopup="menu"
              aria-expanded={speedMenu}
              className={CONTROL}
            >
              <Settings className={cn("size-5 transition-transform duration-300", speedMenu && "rotate-45")} />
            </button>
            {speedMenu ? (
              <div role="menu" aria-label="Prędkość odtwarzania" className="absolute bottom-full right-0 mb-2 w-36 overflow-hidden rounded-lg bg-black/85 py-1 text-[13px] text-white shadow-lg backdrop-blur">
                {SPEEDS.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    role="menuitemradio"
                    aria-checked={rate === speed}
                    onClick={() => {
                      if (video.current) video.current.playbackRate = rate;
                      setSpeedMenu(false);
                      // The item is about to unmount; keep the shortcuts working.
                      shell.current?.focus();
                    }}
                    className="flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left hover:bg-white/15"
                  >
                    {rate === 1 ? "Normalna" : `${rate.toString().replace(".", ",")}×`}
                    {rate === speed ? <Check className="size-3.5" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              const v = video.current;
              if (!v) return;
              if (document.pictureInPictureElement) void document.exitPictureInPicture();
              else void v.requestPictureInPicture?.().catch(() => undefined);
            }}
            aria-label="Obraz w obrazie"
            className={cn(CONTROL, "hidden sm:grid")}
          >
            <PictureInPicture2 className="size-5" />
          </button>
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Zamknij pełny ekran" : "Pełny ekran"} className={CONTROL}>
            {fullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
