import { FeatureGrid, GridSection, SectionHeader } from "@/components/roadmap/sections";
import { AppStill, ResultStack, SheetFilters, SittingCard } from "@/components/simulation/ToolsVisuals";

/*
 * dub.co/solutions/creators' "Powerful features at scale" (live DOM,
 * 2026-10-02): heading and line, then the second two-by-two.
 */
export function ToolsSection() {
  return (
    <GridSection id="tools" labelledBy="tools-heading" innerClassName="pt-20 sm:pt-24">
      <SectionHeader
        id="tools-heading"
        title="Wszystkie podejścia w jednym miejscu"
        sub="Od pierwszej próbnej symulacji do ostatniej przed egzaminem — każdy arkusz, wynik i notatka zostają zapisane na Twoim koncie."
      />
      <div className="mt-12">
        <FeatureGrid
          cells={[
            {
              title: "Filtry zadań",
              description: "Zawęź wyniki do arkusza, działu albo typu zadania — albo pokaż tylko te, przy których straciłeś punkty.",
              cta: { label: "Zobacz postępy", href: "/progress" },
              visual: <SheetFilters />,
            },
            {
              title: "Przejrzysty arkusz",
              description: "Mapa zadań, zegar i narzędzia po lewej, arkusz na środku, karta wzorów obok — wszystko na jednym ekranie.",
              cta: { label: "Zobacz w akcji", href: "/#exam" },
              visual: <AppStill />,
            },
            {
              title: "Wszystkie arkusze razem",
              description: "Wyniki ze wszystkich symulacji w jednym zestawieniu: arkusze, działy i typy zadań, od najmocniejszych do najsłabszych.",
              cta: { label: "Zobacz postępy", href: "/progress" },
              visual: <ResultStack />,
            },
            {
              title: "Historia każdego podejścia",
              description: "Każda symulacja ma swoją kartę: kiedy zaczęła się i skończyła, jak poszła i co działo się na arkuszu.",
              cta: { label: "Zacznij za darmo", href: "/signup" },
              visual: <SittingCard />,
            },
          ]}
        />
      </div>
    </GridSection>
  );
}
