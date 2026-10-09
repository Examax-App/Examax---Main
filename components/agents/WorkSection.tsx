import Link from "@/components/ui/Link";
import { Workflow } from "lucide-react";
import { FeatureGrid, GridSection, SectionHeader } from "@/components/roadmap/sections";
import { ConnectedHub, RoutineCard } from "@/components/agents/WorkVisuals";

/**
 * How the agents work — the band after the builder. The house feature grid
 * (dub.co/links', as /roadmap and /progress run it), one row deep, carrying
 * two of the cards under Grok Bot's window: it works where you learn, and
 * keeps a routine.
 */
export function WorkSection() {
  return (
    <GridSection id="work" labelledBy="work-heading" innerClassName="pt-20 sm:pt-24">
      <SectionHeader
        id="work-heading"
        icon={Workflow}
        eyebrow="Jak pracują"
        title="Znają Twój postęp, więc od razu wiedzą, gdzie jesteś"
        sub="Pomocnicy korzystają z Twojego treningu, roadmapy i postępów, więc nie musisz za każdym razem zaczynać od początku. Zadania nadal rozwiązujesz sam."
      />
      <div className="mt-14">
        <FeatureGrid
          cells={[
            {
              title: "Pracuje tam, gdzie się uczysz",
              description: (
                <>
                  Agent widzi Twój <Link href="/training">trening</Link>, roadmapę i postępy. Nie musisz niczego przeklejać ani tłumaczyć od nowa —
                  wie, nad czym pracujesz.
                </>
              ),
              cta: { label: "Zobacz trening", href: "/training" },
              visual: <ConnectedHub />,
            },
            {
              title: "Pomaga uczyć się regularnie",
              description: (
                <>
                  Ustal czas nauki, a Examax pomoże przygotować kolejne sesje i dopasować <Link href="/roadmap">plan</Link>, gdy coś się
                  zmieni.
                </>
              ),
              cta: { label: "Zobacz roadmapę", href: "/roadmap" },
              visual: <RoutineCard />,
            },
          ]}
        />
      </div>
    </GridSection>
  );
}
