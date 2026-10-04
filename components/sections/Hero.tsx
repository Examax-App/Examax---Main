import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroShowcase } from "@/components/sections/HeroShowcase";

/**
 * Above-the-fold content never waits on an IntersectionObserver: the stack is
 * animated by the reference's pure-CSS slide-up-fade, staggered with
 * animation-delay and `fill-mode: both`, so it is impossible to strand at
 * opacity 0.
 *
 * Reference metrics: the 1080px frame is `py-20 px-12`, the text column is
 * `max-w-2xl` (672px), and the badge → h1 → sub gaps are both 20px.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <div className="col-rules relative overflow-hidden bg-white">
        {/* Square grid, very faint and masked so it dies out well before the
            section edges (reference). */}
        <div className="bg-hero-grid absolute inset-0" aria-hidden />

        <div className="relative mx-auto w-full max-w-[1080px] px-6 py-14 sm:px-12">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
            <Link
              href="/updates#start-examax"
              style={{ "--offset": "10px" } as React.CSSProperties}
              className="animate-slide-up-fade inline-flex items-center divide-x divide-smoke rounded-full border border-smoke bg-white text-xs font-medium text-charcoal drop-shadow-sm transition-colors duration-75 hover:bg-canvas-muted"
            >
              <span className="py-1.5 pl-4 pr-3">Start platformy Examax</span>
              <span className="flex items-center gap-1 py-1.5 pl-3 pr-4 text-steel">
                Zobacz
                <ArrowUpRight className="size-3" aria-hidden />
              </span>
            </Link>

            <h1
              id="hero-heading"
              style={{ "--delay": "100ms", "--offset": "20px" } as React.CSSProperties}
              className="animate-slide-up mt-5 text-pretty font-satoshi text-4xl font-medium leading-[1.15] text-charcoal sm:text-5xl"
            >
              Twoje braki. Twoje zadania. Twój wynik.
            </h1>

            <p
              style={{ "--delay": "200ms", "--offset": "20px" } as React.CSSProperties}
              className="animate-slide-up mt-5 text-xl leading-7 text-steel"
            >
              Examax znajduje pytania, w których się mylisz, i buduje z nich
              Twój osobisty trening przed egzaminem ósmoklasisty i&nbsp;maturą.
            </p>

            <div
              style={{ "--delay": "300ms", "--offset": "20px" } as React.CSSProperties}
              className="animate-slide-up-fade mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Button href="/signup" variant="primary">
                Zacznij za darmo
              </Button>
              <Button href="#roadmap" variant="outline">
                Zobacz, jak działa
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product stage — tabs on the white notch, swappable screenshot */}
      <HeroShowcase />
    </section>
  );
}
