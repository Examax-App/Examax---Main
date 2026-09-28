"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { PencilLine, Route, Timer, Zap } from "lucide-react";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import zuzanna from "@/public/mockups/learner.jpg";
import kacper from "@/public/mockups/learner-kacper.jpg";
import szymon from "@/public/mockups/learner-szymon.jpg";
import maja from "@/public/mockups/learner-maja.jpg";

/** Dub's AUTO_ADVANCE_MS: each slide holds for its progress bar's four seconds. */
const ADVANCE_MS = 4000;

/*
 * Dub's customer stories become Examax's four features — there are no
 * customer stories to tell yet, and none are invented. The photos are the
 * learner photos he supplied; the tint under each is its feature's accent.
 */
const SLIDES: Array<{
  key: string;
  name: string;
  icon: IconComponent;
  accent: Accent;
  photo: StaticImageData;
  headline: string;
  href: string;
  color: string;
}> = [
  {
    key: "roadmap",
    name: "Roadmapa",
    icon: Route,
    accent: "blue",
    photo: zuzanna,
    headline: "Cały egzamin rozpisany na kroki — zawsze wiesz, co robić dziś",
    href: "/roadmap",
    color: "#2563EB",
  },
  {
    key: "training",
    name: "Trening",
    icon: PencilLine,
    accent: "green",
    photo: kacper,
    headline: "Ćwicz na prawdziwych zadaniach z arkuszy CKE, sprawdzanych od razu",
    href: "/training",
    color: "#16A34A",
  },
  {
    key: "agent",
    name: "Agenci Examax",
    icon: Zap,
    accent: "yellow",
    photo: szymon,
    headline: "Agent tłumaczy każdy błąd krok po kroku — o każdej porze",
    href: "/#agent",
    color: "#EAB308",
  },
  {
    key: "simulation",
    name: "Symulacja egzaminu",
    icon: Timer,
    accent: "lavender",
    photo: maja,
    headline: "Napisz pełny arkusz na czas, zanim zrobisz to na sali",
    href: "/simulation",
    color: "#7C3AED",
  },
];

/**
 * Dub's CustomerCarousel (dubinc/dub: app.dub.co/(auth-marketing)/
 * customer-carousel.tsx), in CSS: a 481×452 dark card; the photo settles
 * from 1.04 while the last one fades out; the copy blurs up into place; the
 * active progress bar fills in a straight line and hands over to the next
 * slide; any bar jumps to its slide.
 */
export function FeatureCarousel() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const goTo = (next: number) => setIndex(next % SLIDES.length);

  return (
    <div className="relative h-[452px] w-full max-w-[481px] overflow-hidden rounded-xl bg-charcoal">
      {/* Photos: every slide's photo is here, the active one on top */}
      {SLIDES.map((s, i) => (
        <div
          key={s.key}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-x-0 top-0 h-[360px] overflow-hidden transition-opacity duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            key={i === index ? `${s.key}-on` : s.key}
            src={s.photo}
            alt=""
            fill
            sizes="481px"
            priority={i === 0}
            className={cn("object-cover object-[center_30%]", i === index && "animate-auth-settle")}
          />
        </div>
      ))}

      {/* The photo fades into the dark base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[102px] h-[171px] bg-gradient-to-b from-charcoal/0 to-charcoal" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[103px] bg-charcoal" />

      {/* Each feature's tint, cross-fading */}
      {SLIDES.map((s, i) => (
        <div
          key={s.key}
          aria-hidden
          className="pointer-events-none absolute -inset-x-16 -bottom-8 h-[300px] -rotate-6 blur-2xl transition-opacity duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ background: `linear-gradient(to bottom, transparent 20%, ${s.color})`, opacity: i === index ? 0.5 : 0 }}
        />
      ))}

      {/* Copy */}
      <div className="absolute bottom-[60px] left-6 right-6 flex max-w-[345px] flex-col gap-6">
        <div key={slide.key} className="flex flex-col gap-3" aria-live="polite">
          <span className="animate-auth-rise flex items-center gap-2.5 [animation-delay:40ms]">
            <AccentTile icon={slide.icon} accent={slide.accent} size="lg" />
            <span className="font-satoshi text-[22px] font-bold leading-none tracking-tight text-white">{slide.name}</span>
          </span>
          <p className="animate-auth-rise text-pretty text-base font-medium leading-6 tracking-[-0.02em] text-white">{slide.headline}</p>
        </div>
        <Link
          href={slide.href}
          className="flex h-7 w-fit items-center rounded-lg border border-ash bg-white px-2.5 text-sm font-medium text-charcoal hover:bg-paper-mist"
        >
          Czytaj więcej
        </Link>
      </div>

      {/* Inner border, painted over the photo */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-xl border border-white/10" />

      {/* Progress bars: the active one fills and hands over */}
      <div className="absolute inset-x-6 bottom-6 z-20 flex items-center gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Pokaż: ${s.name}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className="group relative h-1 min-w-0 flex-1 cursor-pointer"
          >
            <div className="h-full w-full rounded-full bg-white/20 transition-colors group-hover:bg-white/30" />
            {i === index && (
              <div
                key={index}
                onAnimationEnd={() => goTo(index + 1)}
                className="absolute inset-0 origin-left animate-[auth-progress_4000ms_linear_forwards] rounded-full bg-white motion-reduce:animate-none"
                style={{ animationDuration: `${ADVANCE_MS}ms` }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
