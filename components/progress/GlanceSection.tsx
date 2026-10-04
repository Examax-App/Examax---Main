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
        eyebrow="Postępy na żywo"
        title="Postęp jak na dłoni"
        sub="Każde zadanie, poprawna odpowiedź i minuta nauki trafiają do statystyk od razu. Widzisz, jak idzie dziś — i jak szło na początku miesiąca."
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
              title: "Postępy, którymi się dzielisz",
              description: "Jeden link pokazuje Twoje wyniki rodzicowi, korepetytorowi albo nauczycielowi — bez zakładania konta i bez zrzutów ekranu.",
              cta: { label: "Załóż konto", href: "/signup" },
              visual: <ShareProgress />,
            },
            {
              title: "Każdy przedmiot, dział i typ zadania",
              description: "Widzisz, który przedmiot ciągnie wynik w górę, który dział jeszcze kuleje i na jakim typie zadań tracisz najwięcej punktów.",
              cta: { label: "Zobacz trening", href: "/training" },
              visual: <SubjectStack />,
            },
          ]}
        />
      </div>
      <MiniFeatures
        iconClassName="text-tangerine"
        summary="Wszystko, co robisz w Examaxie, liczy się do postępów samo — bez ręcznego wpisywania."
        cta={{ label: "Zacznij za darmo", href: "/signup" }}
        items={[
          {
            icon: CalendarRange,
            title: "Dowolny okres",
            description: "Ten tydzień, ostatni miesiąc albo wszystko od pierwszego dnia — jednym kliknięciem.",
          },
          {
            icon: Download,
            title: "Raport w PDF",
            description: "Pobierz podsumowanie postępów i pokaż je w szkole albo na korepetycjach.",
          },
          {
            icon: Flame,
            title: "Seria i cel tygodnia",
            description: "Codzienna seria i tygodniowy cel pomagają zamienić naukę w nawyk.",
          },
          {
            icon: Zap,
            title: "Zapytaj Korepetytora AI",
            description: "„Jak mi poszło w tym tygodniu?” — odpowiedź z Twoich własnych wyników.",
          },
        ]}
      />
    </GridSection>
  );
}
