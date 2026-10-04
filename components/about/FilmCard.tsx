"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

import poster from "@/public/about/examax-film-poster.jpg";

/*
 * dub.co/about's video card: a 16:9 still with rounded corners, a dark
 * gradient rising from the bottom, the title in white bold Satoshi on the
 * left and a white round play button on the right that grows on hover.
 *
 * It opens Examax's launch film (components/launch-film, rendered to
 * public/about/examax-film.mp4) the way dub.co/analytics opens its demo: a
 * dialog sized to the film — the full width of the screen, or its full
 * height when the screen is wider than 16:9 — playing with sound straight
 * away, with the player's own chrome and a close button that shows on hover.
 */

const FILM = "/about/examax-film.mp4";
const TITLE = "Poznaj Examax w minutę";

export function FilmCard() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        style={{ aspectRatio: "1280 / 720" }}
        className="focus-ring group relative mx-auto block w-full max-w-screen-md cursor-pointer overflow-hidden rounded-lg bg-canvas-muted"
      >
        <Image src={poster} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" placeholder="blur" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent sm:h-32" />
        <span className="absolute bottom-8 flex w-full items-center justify-between px-8">
          <span className="max-w-xs text-balance text-left font-satoshi text-lg font-bold leading-tight text-white sm:text-xl">{TITLE}</span>
          <span className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 group-hover:scale-110 group-active:scale-95">
            <Play className="size-4 fill-current text-charcoal" aria-hidden />
          </span>
        </span>
      </button>

      {/* Portalled: the card sits inside a Reveal, whose transform would otherwise trap the fixed dialog in the card */}
      {open ? createPortal(<FilmDialog onClose={close} />, document.body) : null}
    </>
  );
}

function FilmDialog({ onClose }: { onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Hand the keyboard to the player, so space and the arrows work at once.
    panel.current?.querySelector<HTMLElement>("[role=region]")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden className="absolute inset-0 bg-white/60 backdrop-blur-md" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={TITLE}
        className="group animate-scale-in-fade absolute inset-0 m-auto size-fit overflow-hidden border border-ash bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="relative aspect-[1920/1080] w-[calc(100vw-2rem)] [@media(min-aspect-ratio:1920/1080)]:h-[calc(100dvh-2rem)] [@media(min-aspect-ratio:1920/1080)]:w-auto">
          <VideoPlayer src={FILM} poster={poster.src} title={TITLE} autoPlay className="absolute inset-0 sm:rounded-2xl" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute right-4 top-4 cursor-pointer rounded-md p-2 opacity-0 transition-opacity duration-75 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <X className="size-5 text-black/50 transition-colors duration-75 hover:text-black" />
        </button>
      </div>
    </div>
  );
}
