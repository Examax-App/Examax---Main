import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BrandMark } from "@/components/ui/BrandMark";
import { EASE, ramp } from "@/components/hero-film/motion";
import { BEATS, SCENES, TYPING, typed, typedEnd } from "@/components/launch-film/timeline";
import { Caret, Headline, Scene, Words, bob, useArrival } from "@/components/launch-film/parts";
import { TaskCard } from "@/components/launch-film/pieces";

/*
 * 0–10 s. The name, then the promise: dub opens on its product's tile and
 * wordmark, then "Turn your URLs into attribution engines" around a link
 * card. Here: the Examax tile and wordmark, then "Zamień arkusze CKE" around
 * a real CKE task, which folds away into a typed pill — "w Twój plan nauki".
 */

/** The tile and the wordmark, as they sit once the intro has played (the outro reuses it). */
export function Lockup({ slide = 1, reveal = 1, scale = 1 }: { slide?: number; reveal?: number; scale?: number }) {
  return (
    <div className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
      <div className="relative h-[168px] w-[740px]">
        <div
          className="absolute top-0 grid size-[168px] place-items-center rounded-[44px] bg-charcoal shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
          style={{ left: interpolate(slide, [0, 1], [286, 0]) }}
        >
          <BrandMark className="h-[74px] text-white" />
        </div>
        <span
          className="absolute left-[208px] top-1/2 font-satoshi text-[156px] font-bold leading-none tracking-[-0.03em] text-charcoal"
          style={{ clipPath: `inset(-20% ${(1 - reveal) * 100}% -20% 0)`, transform: `translate(${(1 - reveal) * -40}px, -50%)` }}
        >
          Examax
        </span>
      </div>
    </div>
  );
}

export function Intro() {
  const frame = useCurrentFrame();
  const pop = useArrival(BEATS.introTile, 12);
  const slide = ramp(frame, BEATS.introSlide, 26);
  const reveal = ramp(frame, BEATS.introSlide + 6, 26);
  return (
    <Scene frames={SCENES.intro.frames}>
      <AbsoluteFill style={{ transform: `scale(${0.6 + pop * 0.4}) translateY(${bob(frame, 3)}px)`, opacity: Math.min(1, pop * 1.5) }}>
        <Lockup slide={slide} reveal={reveal} />
      </AbsoluteFill>
      <div className="absolute inset-x-0 top-[668px] text-center font-satoshi text-[48px] font-medium tracking-[-0.01em]">
        <Words text="Nauka do egzaminu ósmoklasisty i matury" at={70} step={3} from="#e5e5e5" to="#737373" />
      </div>
    </Scene>
  );
}

export function Sheets() {
  const frame = useCurrentFrame();
  const card = useArrival(BEATS.sheetsCard);
  // The headline and the task lift away as the pill arrives.
  const away = ramp(frame, BEATS.sheetsPill - 8, 18);
  const pill = useArrival(BEATS.sheetsPill, 15);
  const text = typed(TYPING.plan, frame);

  return (
    <Scene frames={SCENES.sheets.frames}>
      <div style={{ opacity: 1 - away, transform: `translateY(${-away * 60}px)`, filter: `blur(${away * 8}px)` }}>
        <Headline top={120} className="text-[112px]">
          <Words text="Zamień arkusze CKE" at={4} step={5} />
        </Headline>
        <div className="absolute left-1/2 top-[330px]" style={{ perspective: 2400 }}>
          <TaskCard
            f={frame}
            style={{
              transform: `translateX(-50%) translateY(${(1 - card) * 260 + bob(frame, 6)}px) rotateX(${8 + (1 - card) * 22}deg) rotateZ(${-1.5 + (1 - card) * -3}deg)`,
              opacity: Math.min(1, card * 1.4),
            }}
          />
        </div>
      </div>

      {/* The pill: dub's "into attribution engines", typed */}
      <div
        className="absolute left-1/2 top-[440px] flex h-[150px] items-center rounded-[32px] border border-ash bg-canvas-muted px-16 font-satoshi text-[84px] font-medium tracking-[-0.02em] text-charcoal shadow-[inset_0_-3px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.25)]"
        style={{ opacity: Math.min(1, pill * 1.5), transform: `translateX(-50%) scale(${0.85 + pill * 0.15})` }}
      >
        {text}
        <Caret className="text-electric-blue" />
      </div>
      <div
        className="absolute inset-x-0 top-[640px] text-center font-satoshi text-[46px] font-medium"
        style={{ opacity: interpolate(frame, [typedEnd(TYPING.plan) + 4, typedEnd(TYPING.plan) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }) }}
      >
        <Words text="z zadaniami dobranymi do Ciebie" at={typedEnd(TYPING.plan) + 4} step={3} from="#e5e5e5" to="#737373" />
      </div>
    </Scene>
  );
}
