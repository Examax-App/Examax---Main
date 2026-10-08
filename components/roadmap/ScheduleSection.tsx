import Link from "@/components/ui/Link";
import { CalendarCheck, CalendarRange, FileText, Zap } from "lucide-react";
import { FeatureGrid, GridSection, MiniFeatures, SectionHeader } from "@/components/roadmap/sections";
import { PlanChart } from "@/components/roadmap/PlanChart";
import { ModulePage, PathStill, StageStack, WeekTable } from "@/components/roadmap/ScheduleVisuals";

/**
 * dub.co/links' "Success at a glance" band — header with two actions, the
 * tabbed chart, a two-by-two and a three-up row. Dub shows analytics here;
 * this band shows the plan itself: what each week holds until the exam, and
 * how the roadmap looks from the inside.
 */
export function ScheduleSection() {
  return (
    <GridSection id="schedule" labelledBy="schedule-heading" innerClassName="pb-10 pt-20">
      <SectionHeader
        id="schedule-heading"
        icon={CalendarRange}
        eyebrow="Plan do egzaminu"
        title="Tydzień po tygodniu, aż do maja"
        sub="Widzisz, ile tematów, lekcji i zadań czeka w każdym tygodniu — plan zwalnia na święta i ferie, a w kwietniu przechodzi na arkusze."
        actions={[
          { label: "Ułóż swój plan", href: "/signup", variant: "primary" },
          { label: "Zobacz cennik", href: "/pricing", variant: "outline" },
        ]}
      />
      <div className="w-full bg-gradient-to-b from-white to-canvas-muted px-4 pt-12 sm:mt-12">
        <PlanChart />
      </div>
      <FeatureGrid
        cells={[
          {
            title: "Cała ścieżka w jednym widoku",
            description: "Roadmapa pokazuje, gdzie jesteś, co masz już za sobą i co jest następne — bez szukania po zeszytach.",
            cta: { label: "Załóż konto", href: "/signup" },
            visual: <PathStill />,
          },
          {
            title: "Rok podzielony na etapy",
            description: "Każdy etap ma własny zakres i własny cel, więc maj nie jest jednym wielkim nadrabianiem.",
            cta: { label: "Dowiedz się więcej", href: "#plan" },
            visual: <StageStack />,
          },
          {
            title: "Każdy temat to pełny moduł",
            description: (
              <>
                Wprowadzenie, wyjaśnienie, przykłady, schematy, techniki zapamiętywania i <Link href="/training">zadania CKE</Link> — z własnym
                procentem ukończenia.
              </>
            ),
            cta: { label: "Zobacz trening", href: "/training" },
            visual: <ModulePage />,
          },
          {
            title: "Tydzień rozpisany na dni",
            description: "Co dziś, co jutro i ile to zajmie. Każda sesja ma temat, rodzaj i czas, więc wiesz, kiedy skończysz.",
            cta: { label: "Ułóż swój plan", href: "/signup" },
            visual: <WeekTable />,
          },
        ]}
      />
      <MiniFeatures
        summary="Plan, Korepetytor AI i zadania CKE działają razem — co tydzień."
        cta={{ label: "Zacznij za darmo", href: "/signup" }}
        items={[
          {
            icon: Zap,
            title: "Korepetytor AI w planie",
            description: "Napisz, co chcesz zmienić — Korepetytor AI zaproponuje nowy układ tematów, a Ty decydujesz, czy go przyjąć.",
          },
          {
            icon: FileText,
            title: "Zadania CKE w każdym temacie",
            description: "Każdy temat kończy się zadaniami z arkuszy — tymi samymi, które ćwiczysz w treningu.",
          },
          {
            icon: CalendarCheck,
            title: "Podsumowanie tygodnia",
            description: "W niedzielę dostajesz krótkie podsumowanie: co zrobione i co przechodzi na kolejny tydzień.",
          },
        ]}
      />
    </GridSection>
  );
}
