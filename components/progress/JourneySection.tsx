import { Filter } from "lucide-react";
import { FeatureGrid, GridSection, SectionHeader } from "@/components/roadmap/sections";
import { MasteryFunnel } from "@/components/progress/MasteryFunnel";
import { ExamaxTiles, LearnerInsight } from "@/components/progress/JourneyVisuals";

/**
 * dub.co/analytics' "Visualize your journey" band — header with two actions,
 * the funnel under its link card, and a pair of pictures.
 */
export function JourneySection() {
  return (
    <GridSection id="journey" labelledBy="journey-heading" innerClassName="pt-20">
      <SectionHeader
        id="journey-heading"
        icon={Filter}
        eyebrow="Opanowanie tematów"
        title="Od pierwszej próby do opanowania"
        sub="Widzisz, ile tematów z roadmapy już przerobiłeś i ile naprawdę opanowałeś — bez zgadywania, co jeszcze zostało."
        actions={[
          { label: "Zacznij za darmo", href: "/signup", variant: "primary" },
          { label: "Zobacz roadmapę", href: "/roadmap", variant: "outline" },
        ]}
      />
      <MasteryFunnel />
      <FeatureGrid
        cells={[
          {
            title: "Cała historia nauki w profilu",
            description: "Ile dni od diagnozy do pierwszego arkusza, jaki masz średni wynik i co zrobiłeś ostatnio — w jednym miejscu.",
            cta: { label: "Załóż konto", href: "/signup" },
            visual: <LearnerInsight />,
          },
          {
            title: "Liczy się wszystko, co robisz",
            description: "Trening, roadmapa, symulacje i rozmowy z Korepetytorem AI zasilają te same statystyki — nic nie trzeba przepisywać.",
            cta: { label: "Poznaj Examax", href: "/" },
            visual: <ExamaxTiles />,
          },
        ]}
      />
    </GridSection>
  );
}
