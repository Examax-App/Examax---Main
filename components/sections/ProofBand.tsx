import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

/* PLACEHOLDER SOCIAL PROOF — none of these are real partners; swap for
   supplied wordmarks before launch. `story` marks the ones with a case study
   behind them. */
const marks: Array<{ name: string; story?: boolean }> = [
  { name: "SP 12 Gdynia", story: true },
  { name: "III LO Poznań" },
  { name: "Korepetycje ZM", story: true },
  { name: "EduLab" },
  { name: "Perspektywy" },
  { name: "Portal Uczeń" },
];

export type ProofFigure = { value: string; label: string };

/**
 * The proof band every product page opens on, directly under its hero.
 *
 * This is the reference's slot for its logo wall and its own counter band
 * folded into one: the hard numbers are the most persuasive thing on a product
 * page, so they open it rather than turning up at 40% scroll depth.
 *
 * Figures are **stated, never counted up**. A counter spends its first second
 * and a half displaying a number that is simply wrong, which is a strange
 * thing to do in the block whose whole job is to be believed — and the
 * reference states "1.5M+ events" and "$2 million" flat for the same reason.
 *
 * The figures take the page's accent (both `vivid-green` and `electric-blue`
 * clear 3:1 at 40px) while the labels sit on `fog` at the landing page's own
 * uppercase monospace step, which clears it at 12px where lowercase 11px did
 * not.
 */
export function ProofBand({
  heading,
  sub,
  figures,
  accent,
}: {
  heading: string;
  sub: string;
  figures: [ProofFigure, ProofFigure, ProofFigure];
  accent: Accent;
}) {
  return (
    <section
      aria-labelledby="proof-heading"
      className="col-rules border-t border-ash bg-canvas-muted"
    >
      <Container className="py-16 text-center">
        <Reveal>
          <h2
            id="proof-heading"
            className={cn("mx-auto max-w-lg text-charcoal", SECTION_H2)}
          >
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-body-xl text-fog">
            {sub}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            {figures.map((figure) => (
              <div key={figure.label}>
                <dd
                  className={cn(
                    "font-geist-mono text-[32px] leading-none tracking-tight tabular-nums sm:text-[40px]",
                    accentStyles[accent].text,
                  )}
                >
                  {figure.value}
                </dd>
                <dt className="mt-3 font-geist-mono text-xs uppercase tracking-[0.08em] text-fog">
                  {figure.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>

      <div className="border-t border-ash">
        <Container className="py-10">
          <Reveal>
            <p className="text-center font-geist-mono text-[11px] uppercase tracking-[0.08em] text-silver">
              Szkoły i zespoły, które testują Examax
            </p>
            <ul className="mt-6 grid grid-cols-2 items-start gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
              {marks.map((mark) => (
                <li key={mark.name} className="text-center">
                  <span className="block font-satoshi text-body font-bold tracking-tight text-fog transition-colors duration-200 hover:text-graphite">
                    {mark.name}
                  </span>
                  {mark.story ? (
                    <span className="mt-1 block font-geist-mono text-[9px] uppercase tracking-[0.12em] text-silver">
                      Historia
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
