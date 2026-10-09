import { CalendarRange, Download, Flame, LineChart, Zap } from "lucide-react";
import { FeatureGrid, GridSection, MiniFeatures, SectionHeader } from "@/components/roadmap/sections";
import { ProgressChart } from "@/components/progress/ProgressChart";
import { ShareProgress, SubjectStack } from "@/components/progress/GlanceVisuals";

/**
 * dub.co/analytics' "Success at a glance" band — header with two actions,
 * the tabbed chart, a pair of pictures and a four-up row of small features.
 */
export function GlanceSection() {
  return (
    <GridSection id="glance" labelledBy="glance-heading" innerClassName="pb-10 pt-20">
      <SectionHeader
        id="glance-heading"
        icon={LineChart}
        eyebrow="Postępy na bieżąco"
        title="Wszystko w jednym miejscu"
        sub="Rozwiązane zadania, poprawne odpowiedzi i czas nauki zapisują się automatycznie. Możesz sprawdzić, jak zmieniają się Twoje wyniki i które obszary wymagają dalszej pracy."
        actions={[
          { label: "Zacznij za darmo", href: "/signup", variant: "primary" },
          { label: "Zobacz cennik", href: "/pricing", variant: "outline" },
        ]}
      />
      <div className="-mx-px mt-12">
        <ProgressChart />
      </div>
      <div className="mt-8">
        <FeatureGrid
          cells={[
            {
              title: "Postępy, które możesz pokazać",
              description: "Udostępnij swoje wyniki rodzicowi, korepetytorowi lub nauczycielowi przez bezpieczny link. Ty decydujesz, komu pokazujesz swoje postępy.",
              cta: { label: "Załóż konto", href: "/signup" },
              visual: <ShareProgress />,
            },
            {
              title: "Każdy przedmiot i każdy temat",
              description: "Widzisz, które przedmioty opanowałeś, gdzie potrzebujesz więcej pracy i na jakich typach zadań tracisz punkty.",
              cta: { label: "Zobacz trening", href: "/training" },
              visual: <SubjectStack />,
            },
          ]}
        />
      </div>
      <MiniFeatures
        iconClassName="text-tangerine"
        summary="Twoja aktywność w Examaxie zapisuje się automatycznie — bez ręcznego uzupełniania wyników."
        cta={{ label: "Zacznij za darmo", href: "/signup" }}
        items={[
          {
            icon: CalendarRange,
            title: "Dowolny okres",
            description: "Ten tydzień, ostatni miesiąc albo wszystko od pierwszego dnia — jednym kliknięciem.",
          },
          {
            icon: Download,
            title: "Raport postępów",
            description: "Pobierz podsumowanie nauki i pokaż je nauczycielowi, rodzicowi lub korepetytorowi.",
          },
          {
            icon: Flame,
            title: "Seria i cel tygodnia",
            description: "Codzienna seria i tygodniowy cel pomagają uczyć się regularnie.",
          },
          {
            icon: Zap,
            title: "Zapytaj Korepetytora AI",
            description: "„Nad czym powinienem teraz pracować?” — Korepetytor AI przeanalizuje Twoje wyniki i pomoże wybrać kolejny krok.",
          },
        ]}
      />
    </GridSection>
  );
}
