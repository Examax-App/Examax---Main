import { Clock, PencilLine, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DisplayCards, type DisplayCardItem } from "@/components/ui/DisplayCards";
import { AccentTile } from "@/components/ui/FeaturePill";
import { Reveal } from "@/components/ui/Reveal";
import { SpinNumber } from "@/components/ui/SpinNumber";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

/** How many times cheaper than tutoring the front card claims — his figure. */
const TIMES_CHEAPER = 4;

/** The stack, back to front: tutoring, Examax, and how much cheaper — no prices, a ratio. */
const CARDS: DisplayCardItem[] = [
  {
    icon: Clock,
    accent: "tangerine",
    title: "Korepetycje",
    description: "Płacisz za każdą godzinę z korepetytorem",
    date: "Co tydzień od nowa",
  },
  {
    icon: PencilLine,
    accent: "blue",
    title: "Examax Pro",
    description: "Zadania CKE, roadmapa i Korepetytor AI — każdego dnia",
    date: "Uczysz się sam, kiedy chcesz",
  },
  {
    icon: PiggyBank,
    accent: "green",
    title: "Oszczędzasz",
    description: (
      <>
        Nawet{" "}
        <span className="font-semibold text-vivid-green">
          <SpinNumber value={TIMES_CHEAPER} />×
        </span>{" "}
        taniej niż korepetycje
      </>
    ),
    date: "Przez cały rok szkolny",
  },
];

/**
 * Examax against classic tutoring: tutoring buys an hour of someone else's
 * time, Examax is the student's own practice — and costs a fraction of it.
 *
 * One band: eyebrow, heading, sub and CTAs on the left, and beside them the
 * skewed card stack (`ui/DisplayCards`) that tells the cost at a glance. The
 * savings breakdown, the closing line and the comparison table were removed
 * at his request.
 */
export function TutoringCompare() {
  return (
    <section id="value" aria-labelledby="value-heading" className="border-t border-ash bg-white">
      <div className="col-rules">
        <Container className="grid items-center gap-16 py-20 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-2.5 text-[12px] font-medium leading-5 text-steel">
              <AccentTile icon={PiggyBank} accent="green" size="sm" />
              Examax czy korepetycje
            </div>
            <h2 id="value-heading" className={cn("mt-3 max-w-xl text-charcoal", SECTION_H2)}>
              Godzina mija. Umiejętności zostają.
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-body-xl text-fog">
              Zamiast płacić za kolejne korepetycje, zainwestuj w&nbsp;system, który pracuje razem z&nbsp;Tobą każdego dnia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup" variant="primary" size="lg">
                Zacznij za darmo
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                Zobacz cennik
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120} className="flex justify-center py-10 lg:justify-start lg:pl-8">
            {/* The fan is wider than a phone; scaled there, not clipped, so the hover lift stays whole. */}
            <div className="max-sm:scale-[0.82]">
              <DisplayCards items={CARDS} className="-translate-x-6 sm:-translate-x-12" />
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
