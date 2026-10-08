import { Flag } from "lucide-react";
import { FeatureCell, GridSection, SectionHeader } from "@/components/roadmap/sections";
import { EventStream } from "@/components/progress/EventStream";
import { FilterMarquee, TutorNote } from "@/components/progress/LiveVisuals";

/**
 * dub.co/analytics' "See it as it happens" band — header, the stat cards
 * over the events table (a topic opens its history in a side sheet), then
 * the filters cell beside the tinted panel where dub quotes a customer.
 */
export function LiveSection() {
  return (
    <GridSection id="live" labelledBy="live-heading" innerClassName="pt-20">
      <SectionHeader
        id="live-heading"
        icon={Flag}
        eyebrow="Historia nauki"
        title="Widzisz to na bieżąco"
        sub="Każda odpowiedź, lekcja i quiz z wynikiem i godziną. Kliknij temat, żeby zobaczyć całą jego historię."
      />
      <EventStream />
      <div className="grid grid-cols-1 divide-ash border-t border-ash max-md:divide-y md:grid-cols-2 md:divide-x">
        <FeatureCell
          cell={{
            title: "Szczegółowe filtry",
            description: "Zawęź historię do przedmiotu, działu, typu zadania albo okresu i sprawdź, gdzie tracisz najwięcej punktów.",
            cta: { label: "Zobacz trening", href: "/training" },
            visual: <FilterMarquee />,
          }}
        />
        <TutorNote />
      </div>
    </GridSection>
  );
}
