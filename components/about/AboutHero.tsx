import { FileCheck2, GraduationCap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * dub.co/about's hero (live DOM, 2026-10-02): no texture, the column's edges
 * fading in as they come down, and one large Satoshi sentence with three
 * glowing gradient chips set into it before the words they illustrate. Each
 * chip sits a little rotated, lifts 8px on hover, and carries a soft blur of
 * its own gradient behind it. The line under it and the single black button
 * rise in after the heading, 100ms and 400ms behind.
 *
 * Dub's chips are violet-blue (team), green (links) and orange-amber (the
 * chart). Here they mark the learner, the exam (Trening's green) and the
 * result (Postępy's orange), so they still read as the product's own colours.
 */

type Chip = { icon: IconComponent; gradient: string; tilt: string };

const CHIPS = {
  learner: { icon: GraduationCap, gradient: "bg-gradient-to-br from-violet-600 from-30% to-blue-600 text-blue-600", tilt: "rotate-[15deg]" },
  exam: { icon: FileCheck2, gradient: "bg-gradient-to-r from-green-600 to-green-300 text-green-500", tilt: "" },
  result: { icon: TrendingUp, gradient: "bg-gradient-to-br from-orange-600 to-amber-500 text-amber-500", tilt: "-rotate-[20deg]" },
} satisfies Record<string, Chip>;

function HeadingChip({ chip }: { chip: Chip }) {
  const Icon = chip.icon;
  return (
    <span className="group relative mx-0.5 inline-block align-baseline">
      <span aria-hidden className={cn("absolute inset-x-0 inset-y-1/3 opacity-80 blur-[20px]", chip.gradient)} />
      <span
        aria-hidden
        className={cn(
          "relative inline-flex -translate-y-[0.07em] items-center justify-center rounded-full p-2 transition-transform duration-300 group-hover:-translate-y-2 md:p-2.5",
          chip.gradient,
          chip.tilt,
        )}
      >
        <span className="absolute -inset-1 rounded-full border border-current opacity-30" />
        <Icon className="relative size-4 text-white drop-shadow-sm sm:size-6 md:size-8" strokeWidth={1.75} />
        <span className="absolute inset-0 rounded-full border border-black/5" />
      </span>
    </span>
  );
}

export function AboutHero() {
  return (
    <section aria-labelledby="about-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)]">
        {/* The column's edges, fading in as they come down */}
        <div aria-hidden className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black)]" />

        <div className="relative px-2.5 py-16 text-center">
          <div className="mx-auto max-w-[420px] sm:max-w-[500px] md:max-w-[660px]">
            <h1
              id="about-heading"
              className="animate-slide-up-fade mt-5 text-pretty text-center font-satoshi text-4xl font-medium !leading-tight text-charcoal sm:text-5xl"
              style={{ "--offset": "20px" } as React.CSSProperties}
            >
              Przygotuj się <HeadingChip chip={CHIPS.learner} /> do egzaminów CKE w&nbsp;jednym miejscu — <HeadingChip chip={CHIPS.exam} /> rozwiązuj
              zadania, <HeadingChip chip={CHIPS.result} /> rozumiej swoje błędy i&nbsp;widzisz, co zrobić dalej.
            </h1>
            <p
              className="animate-slide-up-fade mx-auto mt-5 w-full max-w-md text-pretty text-xl text-fog"
              style={{ "--delay": "100ms" } as React.CSSProperties}
            >
              Budujemy miejsce, w którym każdy uczeń może przygotować się do egzaminu z jasnym planem — od pierwszej diagnozy do ostatniego arkusza.
            </p>
            <div
              className="animate-slide-up-fade relative mx-auto mt-10 flex max-w-fit"
              style={{ "--offset": "5px", "--delay": "400ms" } as React.CSSProperties}
            >
              <Button href="/contact">Centrum pomocy</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
