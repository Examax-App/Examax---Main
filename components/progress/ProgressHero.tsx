import { BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccentTile } from "@/components/ui/FeaturePill";
import { GridPattern } from "@/components/training/GridPattern";
import { HeroChart } from "@/components/progress/HeroChart";

/* ---------------------------------------------------------------------------
 * The /progress hero — dub.co/analytics' hero, one to one (live DOM,
 * 2026-10-01): the 60px grid and a 15% sweep behind a left-aligned pill,
 * headline, subline and two actions, and the year's chart filling the band
 * underneath, sliding up 400ms after the copy. Dub's sweep is green; this
 * one is Postępy's tangerine.
 * ------------------------------------------------------------------------- */

export function ProgressHero() {
  return (
    <section aria-labelledby="progress-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] px-4 pt-16 sm:px-12 sm:pt-20">
        {/* The column's edges, fading in as they come down */}
        <div aria-hidden className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black)]" />

        {/* The grid: one field across the column and two wings beyond it */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 opacity-80 [mask-image:linear-gradient(transparent,black)]">
          <div className="absolute inset-x-[360px] inset-y-0">
            <GridPattern id="progress-grid-left" className="bottom-0 right-full h-[600px] w-[360px] text-ash/60 [mask-image:linear-gradient(90deg,transparent,black)]" />
            <GridPattern id="progress-grid-right" className="bottom-0 left-full h-[600px] w-[360px] text-ash/60 [mask-image:linear-gradient(270deg,transparent,black)]" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden opacity-80 [mask-image:linear-gradient(transparent,black)]">
          <GridPattern id="progress-grid" className="bottom-0 left-1/2 h-[600px] w-[var(--page-max-width)] -translate-x-1/2 text-ash/60" />
        </div>

        {/* The sweep: dub's two-stop wash at 15%, in Postępy's tangerine */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-full w-[150%] opacity-15">
            <div className="size-full bg-[linear-gradient(90deg,#FDBA74,#F97316)] [mask-image:linear-gradient(transparent_25%,black)]" />
          </div>
        </div>

        {/* The year's chart, under the copy */}
        <div className="animate-slide-up-fade absolute inset-0" style={{ "--offset": "10px", "--delay": "400ms" } as React.CSSProperties}>
          <div className="absolute inset-x-0 bottom-0 h-[240px] sm:h-[320px] md:left-8 md:h-[600px]">
            <HeroChart />
          </div>
        </div>

        <div className="relative w-full max-w-[460px]">
          <span
            className="animate-slide-up-fade relative flex w-fit items-center gap-2 overflow-hidden rounded-full border border-ash bg-white px-3 py-1.5 text-xs font-medium leading-tight text-steel"
            style={{ "--offset": "10px" } as React.CSSProperties}
          >
            <AccentTile icon={BadgePercent} accent="tangerine" size="xs" />
            Śledzenie postępów
          </span>
          <h1
            id="progress-heading"
            className="animate-slide-up-fade mt-5 text-left font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]"
            style={{ "--offset": "20px", "--delay": "100ms" } as React.CSSProperties}
          >
            Widzisz, jak rośnie Twoje przygotowanie
          </h1>
          <p
            className="animate-slide-up-fade mt-5 text-pretty text-base text-steel sm:text-xl"
            style={{ "--offset": "10px", "--delay": "200ms" } as React.CSSProperties}
          >
            Zadania, quizy, lekcje i&nbsp;arkusze tworzą historię Twojej nauki. Widzisz swoje mocne strony, tematy do poprawy i&nbsp;kolejny krok przygotowań.
          </p>
        </div>
        <div
          className="animate-slide-up-fade relative mt-10 flex max-w-fit flex-wrap gap-2 sm:gap-4"
          style={{ "--offset": "5px", "--delay": "300ms" } as React.CSSProperties}
        >
          <Button href="/signup" variant="primary">
            Zacznij za darmo
          </Button>
          <Button href="#glance" variant="outline">
            Jak to działa
          </Button>
        </div>

        {/* Room for the chart under the copy */}
        <div aria-hidden className="h-64 md:h-[340px]" />
      </div>
    </section>
  );
}
