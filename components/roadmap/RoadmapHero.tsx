import { Route } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccentTile } from "@/components/ui/FeaturePill";
import { GridPattern } from "@/components/training/GridPattern";
import { TopicComposer } from "@/components/roadmap/TopicComposer";

/* ---------------------------------------------------------------------------
 * The /roadmap hero — dub.co/links' hero, one to one (live DOM, 2026-10-01):
 * pill, two-line headline, subline and two actions over the 60px grid and a
 * 15% sweep, then the working demo box sliding up 400ms behind them. Dub's
 * sweep is orange; this one is Roadmapa's blue.
 * ------------------------------------------------------------------------- */

export function RoadmapHero() {
  return (
    <section aria-labelledby="roadmap-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] px-4 pb-10 pt-16 text-center sm:px-12">
        {/* The column's edges, fading in as they come down */}
        <div aria-hidden className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black)]" />

        {/* The grid: one field across the column and two wings beyond it */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-image:linear-gradient(transparent,black)]">
          <div className="absolute inset-x-[360px] inset-y-0">
            <GridPattern id="roadmap-grid-left" className="bottom-0 right-full h-[600px] w-[360px] text-ash/60 [mask-image:linear-gradient(90deg,transparent,black)]" />
            <GridPattern id="roadmap-grid-right" className="bottom-0 left-full h-[600px] w-[360px] text-ash/60 [mask-image:linear-gradient(270deg,transparent,black)]" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden opacity-80 [mask-image:linear-gradient(transparent,black)]">
          <GridPattern id="roadmap-grid" className="bottom-0 left-1/2 h-[600px] w-[var(--page-max-width)] -translate-x-1/2 text-ash/60" />
        </div>

        {/* The sweep: dub's two-stop wash at 15%, in Roadmapa's blue */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-full w-[150%] opacity-15">
            <div className="size-full bg-[linear-gradient(90deg,#60A5FA,#2563EB)] [mask-image:linear-gradient(transparent_25%,black)]" />
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-4">
          <span
            className="animate-slide-up-fade relative flex w-fit items-center gap-2 overflow-hidden rounded-full border border-ash bg-white px-3 py-1.5 text-xs font-medium leading-tight text-steel"
            style={{ "--offset": "10px" } as React.CSSProperties}
          >
            <AccentTile icon={Route} accent="blue" size="xs" />
            Roadmapa nauki
          </span>
          <h1
            id="roadmap-heading"
            className="animate-slide-up-fade mt-5 text-center font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]"
            style={{ "--offset": "20px", "--delay": "100ms" } as React.CSSProperties}
          >
            Plan nauki ułożony pod Twój egzamin
          </h1>
          <p
            className="animate-slide-up-fade mt-5 text-pretty text-base text-steel sm:text-xl"
            style={{ "--offset": "10px", "--delay": "200ms" } as React.CSSProperties}
          >
            Wymagania egzaminu CKE rozpisane na tematy i&nbsp;tygodnie — zamiast notatek i&nbsp;plików PDF masz jeden plan od dziś do dnia egzaminu.
          </p>
        </div>
        <div
          className="animate-slide-up-fade relative mx-auto mt-10 flex max-w-fit gap-4"
          style={{ "--offset": "5px", "--delay": "300ms" } as React.CSSProperties}
        >
          <Button href="/signup" variant="primary">
            Ułóż swój plan
          </Button>
          <Button href="#plan" variant="outline">
            Jak to działa
          </Button>
        </div>

        <div className="animate-slide-up-fade relative -mx-3 mt-16" style={{ "--offset": "10px", "--delay": "400ms" } as React.CSSProperties}>
          <TopicComposer />
        </div>
      </div>
    </section>
  );
}
