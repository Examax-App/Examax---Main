import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroShowcase } from "@/components/sections/HeroShowcase";
import { HeroCountdown } from "@/components/ui/ExamCountdown";

/**
 * Above-the-fold content renders at final opacity on first paint — the hero
 * is deliberately excluded from the scroll-reveal system (LCP must never be
 * gated on an IntersectionObserver).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      {/* Headline stage on the blueprint grid */}
      <div className="relative overflow-hidden bg-white">
        <div className="bg-grid mask-fade-edges absolute inset-0" aria-hidden />
        <Container className="relative flex flex-col items-center pb-20 pt-12 text-center sm:pt-16">
          <Link
            href="#agent"
            className="inline-flex items-center rounded-full border border-ash bg-white text-body font-medium text-charcoal shadow-subtle transition-all duration-200 hover:bg-paper-mist hover:shadow-sm"
          >
            <span className="py-2 pl-4 pr-3">Nowość: Agent Examax</span>
            <span className="flex items-center gap-1 border-l border-ash py-2 pl-3 pr-4 text-steel">
              Zobacz
              <ArrowUpRight className="size-3.5" aria-hidden />
            </span>
          </Link>

          <h1
            id="hero-heading"
            className="mt-8 max-w-3xl font-satoshi text-[38px] font-medium leading-[1.02] tracking-[-0.01em] text-charcoal sm:text-[56px]"
          >
            Twoje braki. Twoje zadania. Twój wynik.
          </h1>

          <p className="mt-6 max-w-xl text-body-xl text-steel">
            Examax znajduje pytania, w których się mylisz, i buduje z nich
            Twój osobisty trening przed egzaminem ósmoklasisty i&nbsp;maturą.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="#cennik" variant="primary" size="lg">
              Zacznij za darmo
            </Button>
            <Button href="#roadmapa" variant="outline" size="lg">
              Zobacz, jak działa
            </Button>
          </div>

          {/* Live countdown — the strongest emotional asset, above the fold */}
          <HeroCountdown />
        </Container>
      </div>

      {/* Product stage — tabs, swappable screenshot, contextual card */}
      <HeroShowcase />
    </section>
  );
}
