import Link from "@/components/ui/Link";
import { ShieldCheck } from "lucide-react";
import { CtaBandFrame } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";

/*
 * The /enterprise close — dub.co/enterprise's "Get an enterprise trial",
 * without its form, on the same band every page closes with (the dark field,
 * the colour wash, the fading grid and the notch): an icon, the heading, one
 * line and two actions — a call through the contact page, or straight to
 * our inbox.
 */
export function TrialBand() {
  return (
    <CtaBandFrame id="trial" labelledBy="trial-heading">
      <div className="relative flex flex-col items-center px-4 pb-32 pt-24 text-center">
        <Reveal className="flex flex-col items-center">
          <ShieldCheck className="size-8 text-white" strokeWidth={1.5} aria-hidden />
          <h2 id="trial-heading" className="mt-6 max-w-lg text-balance font-satoshi text-4xl font-medium text-canvas-muted sm:text-5xl">
            Wypróbuj Examax w swojej szkole
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 max-w-[560px] text-pretty text-lg font-medium text-silver sm:text-xl">
            Pokażemy panel nauczyciela, ustalimy zakres pilotażu i odpowiemy na pytania o dane uczniów — w ciągu jednego dnia roboczego.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="focus-ring flex h-10 items-center justify-center rounded-lg border border-ash bg-white px-5 text-center text-sm font-medium text-charcoal ring-white/20 transition-all hover:ring"
            >
              Umów rozmowę
            </Link>
            <a
              href="mailto:pomoc@examax.app"
              className="focus-ring flex h-10 items-center justify-center rounded-lg border border-transparent bg-white/20 px-5 text-center text-sm font-medium text-white ring-white/10 backdrop-blur-sm transition-all hover:ring"
            >
              Skontaktuj się
            </a>
          </div>
        </Reveal>
      </div>
    </CtaBandFrame>
  );
}
