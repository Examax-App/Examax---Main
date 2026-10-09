import Link from "@/components/ui/Link";
import { CalendarClock, LockOpen, RefreshCcw, Route, Smartphone } from "lucide-react";
import { FeatureGrid, GridSection, MiniFeatures, SectionHeader } from "@/components/roadmap/sections";
import { PlanBuilder } from "@/components/roadmap/PlanBuilder";
import { DiagnosticFlow, PlanWizard, SubjectRows, TopicPreview } from "@/components/roadmap/BuilderVisuals";

/**
 * dub.co/links' "Branded short links that stand out" band: header, the
 * builder modal, a two-by-two of features and a four-up row — here, how a
 * roadmap is put together for one student.
 */
export function PlanSection() {
  return (
    <GridSection id="plan" labelledBy="plan-heading" innerClassName="pb-10 pt-20">
      <SectionHeader
        id="plan-heading"
        icon={Route}
        eyebrow="Plan nauki"
        title="Plan dopasowany do Twojego celu"
        sub="Examax pomaga ułożyć tematy egzaminu w kolejne kroki, tak aby prowadziły do wyniku, który chcesz osiągnąć."
      />
      <div className="h-12 sm:hidden" />
      <PlanBuilder />
      <FeatureGrid
        cells={[
          {
            title: "Każdy temat łączy lekcję, przykłady i quiz",
            description: (
              <>
                Wyjaśnienie, przykłady krok po kroku, schematy i <Link href="/training">zadania z arkuszy CKE</Link> w jednym
                miejscu.
              </>
            ),
            cta: { label: "Dowiedz się więcej", href: "#schedule" },
            visual: <TopicPreview />,
          },
          {
            title: "Osobna roadmapa dla każdego przedmiotu",
            description: (
              <>
                Matematyka, polski i angielski — każdy przedmiot ma własny plan i <Link href="/progress">własny postęp</Link>. Przedmiot, w którym
                masz najwięcej do nadrobienia, jest oznaczony jako priorytet.
              </>
            ),
            cta: { label: "Zobacz cennik", href: "/pricing" },
            visual: <SubjectRows />,
          },
          {
            title: "Plan nauki w kilku prostych krokach",
            description: (
              <>
                Wybierasz egzamin, termin i tempo — a plan rozkłada tematy na tygodnie i dni. Zmienisz zdanie? Plan{" "}
                <Link href="#flexible">przeliczy się na nowo</Link>.
              </>
            ),
            cta: { label: "Ułóż swój plan", href: "/signup" },
            visual: <PlanWizard />,
          },
          {
            title: "Na początek krótka diagnoza",
            description: (
              <>
                Krótki <Link href="/training">quiz diagnostyczny</Link> pokazuje, co już umiesz, a co warto nadrobić — od tego zaczyna się Twój
                plan.
              </>
            ),
            cta: { label: "Zacznij od diagnozy", href: "/signup" },
            visual: <DiagnosticFlow />,
          },
        ]}
      />
      <MiniFeatures
        summary="Kolejność, powtórki i termin — wszystko w jednym planie nauki."
        cta={{ label: "Ułóż swój plan", href: "/signup" }}
        items={[
          {
            icon: LockOpen,
            title: "Swobodna kolejność",
            description: "Zaczynasz od tematu, którego najbardziej potrzebujesz — bez czekania, aż odblokuje się kolejny.",
          },
          {
            icon: RefreshCcw,
            title: "Zaplanowane powtórki",
            description: "Przerobione tematy co jakiś czas wracają w planie jako krótkie powtórki — nie musisz sam ich dopisywać.",
          },
          {
            icon: CalendarClock,
            title: "Zmiana terminu",
            description: "Przesuwasz datę egzaminu? Plan rozkłada pozostałe tematy na nowo.",
          },
          {
            icon: Smartphone,
            title: "Na każdym urządzeniu",
            description: "Ten sam plan na telefonie i komputerze — postęp zapisuje się na Twoim koncie.",
          },
        ]}
      />
    </GridSection>
  );
}
