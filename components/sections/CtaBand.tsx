import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/** Dub's notch piece: a flat top, then a steep S-curve down to the band. */
const NOTCH = "M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z";

function NotchSide({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 85 64"
      fill="none"
      aria-hidden
      className={
        mirrored
          ? "h-full w-auto shrink-0 -translate-x-px translate-y-px -scale-x-100 overflow-visible"
          : "h-full w-auto shrink-0 translate-x-px translate-y-px overflow-visible"
      }
    >
      <rect x="0" y="0" width="85" height="1" fill="currentColor" transform="translate(0, -1)" />
      <path d={NOTCH} fill="currentColor" />
    </svg>
  );
}

/**
 * The closing band above the footer — dub.co's own, one to one
 * (`DesignRules/CTA band _ Dub.png`, markup read off the live page):
 * near-black, Dub's conic colour wash blended in at 30%, a 60px grid that
 * fades out downward and toward the edges, and at the top the white notch —
 * a 64px-deep tongue of the page above, up to 700px wide, whose sides fall
 * away in a steep curve. Heading, a line, and two buttons: white, and
 * frosted white on the dark.
 *
 * Dub closes the band with review stars; those need real ratings, so they
 * are left out rather than invented.
 */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="relative bg-charcoal px-4">
      {/* Dub's colour wash, blended into the dark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 mix-blend-overlay">
        <div className="absolute -inset-[40px] bg-[conic-gradient(from_-81deg,#3A8BFD_-72deg,#855AFC_33deg,#F00_70deg,#EAB308_136deg,#5CFF80_214deg,#00FFF9_259deg,#3A8BFD_288deg,#855AFC_393deg)] blur-[30px]" />
      </div>

      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        {/* The column's edges, and the grid, both fading as they go down */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 border-x border-white/5 [mask-image:linear-gradient(black,transparent)]" />
          <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
            <svg
              className="pointer-events-none absolute inset-0 text-white/15 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent),radial-gradient(black,transparent)]"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern id="cta-band-grid" x="-1" y="-1" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="transparent" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect fill="url(#cta-band-grid)" width="100%" height="100%" />
            </svg>
          </div>
        </div>

        {/* The notch: the white page above, reaching down into the band */}
        <div
          aria-hidden
          className="relative top-0 z-0 mx-auto flex h-16 max-w-[min(700px,calc(100vw-2rem))] -translate-y-px items-start justify-center text-white"
        >
          <NotchSide />
          <div className="relative z-10 h-[calc(100%+1px)] min-w-0 grow bg-current" />
          <NotchSide mirrored />
        </div>

        <div className="relative flex flex-col items-center px-4 pb-32 pt-24 text-center">
          <Reveal>
            <h2 id="cta-heading" className="max-w-lg text-balance font-satoshi text-4xl font-medium text-canvas-muted sm:text-5xl">
              Do egzaminu liczy się każdy dzień
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 max-w-[560px] text-pretty text-lg font-medium text-silver sm:text-xl">
              Zacznij teraz. 5&nbsp;minut dziennie i&nbsp;zobaczysz niesamowite zmiany.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link
                href="/signup"
                className="focus-ring flex h-10 items-center justify-center rounded-lg border border-ash bg-white px-5 text-center text-sm font-medium text-charcoal ring-white/20 transition-all hover:ring"
              >
                Zacznij za darmo
              </Link>
              <Link
                href="/pricing"
                className="focus-ring flex h-10 items-center justify-center rounded-lg border border-transparent bg-white/20 px-5 text-center text-sm font-medium text-white ring-white/10 backdrop-blur-sm transition-all hover:ring"
              >
                Zobacz cennik
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
