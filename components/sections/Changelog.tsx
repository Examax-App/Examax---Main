import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const releases = [
  {
    date: "18 sie 2026",
    title: "Agent Examax 2.0",
    description:
      "Wyjaśnienia krok po kroku z odwołaniem do Twoich wcześniejszych błędów.",
    accent: "bg-lavender",
  },
  {
    date: "4 sie 2026",
    title: "Arkusze CKE 2026",
    description:
      "Tegoroczne zadania z egzaminu ósmoklasisty i matury już w bazie treningu.",
    accent: "bg-lavender",
  },
  {
    date: "21 lip 2026",
    title: "Roadmapa matury rozszerzonej",
    description: "Matematyka na poziomie rozszerzonym rozpisana na kroki.",
    accent: "bg-lavender",
  },
  {
    date: "8 lip 2026",
    title: "Wskaźnik gotowości",
    description:
      "Jeden wynik, który pokazuje, jak blisko jesteś egzaminacyjnej formy.",
    accent: "bg-lavender",
  },
  {
    date: "24 cze 2026",
    title: "Tryb powtórek",
    description:
      "Inteligentne powtórki tematów, które właśnie zaczynasz zapominać.",
    accent: "bg-silver",
  },
];

/**
 * Release timeline — display heading beside a vertical dated list that
 * fades out at the bottom.
 */
export function Changelog() {
  return (
    <section
      aria-labelledby="changelog-heading"
      className="border-t border-ash bg-[#fafafa]"
    >
      <Container className="py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2
              id="changelog-heading"
              className="font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none"
            >
              Co nowego w Examax
            </h2>
            <p className="mt-5 max-w-sm text-body-xl text-fog">
              Nowe arkusze, mądrzejsza roadmapa i lepszy agent — co kilka
              tygodni, nie co semestr.
            </p>
            <Button href="#faq" variant="outline" className="mt-7">
              Pełna lista zmian
            </Button>
          </Reveal>

          <Reveal delay={100}>
            <ol className="mask-fade-bottom relative space-y-8 border-l border-ash pl-8">
              {releases.map((release, index) => (
                <li key={release.title} className="relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-8 top-1.5 size-2.5 -translate-x-1/2 rounded-full ring-4 ring-[#fafafa]",
                      release.accent,
                    )}
                  />
                  <p className="font-geist-mono text-[12px] uppercase tracking-[0.08em] text-fog">
                    {release.date}
                  </p>
                  <h3
                    className={cn(
                      "mt-1 text-body-xl font-semibold text-charcoal",
                      index > 2 && "text-slate",
                    )}
                  >
                    {release.title}
                  </h3>
                  <p className="mt-1 max-w-md text-body-lg text-steel">
                    {release.description}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
