import Link from "next/link";
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
        title="Roadmapa ułożona pod Ciebie"
        sub="Egzamin, termin i tempo, które naprawdę masz — z tego powstaje plan, który prowadzi temat po temacie aż do egzaminu."
      />
      <div className="h-12 sm:hidden" />
      <PlanBuilder />
      <FeatureGrid
        cells={[
          {
            title: "Każdy temat to lekcja, przykłady i quiz",
            description: (
              <>
                Wyjaśnienie, przykłady krok po kroku, schematy i <Link href="/training">zadania z arkuszy CKE</Link> w jednym miejscu. Znasz już
                temat? Zrób sam quiz i idź dalej.
              </>
            ),
            cta: { label: "Dowiedz się więcej", href: "#schedule" },
            visual: <TopicPreview />,
          },
          {
            title: "Osobna roadmapa dla każdego przedmiotu",
            description: (
              <>
                Matematyka, polski i angielski — każdy przedmiot ma własny plan i <Link href="/progress">własny postęp</Link>. Ten, który goni
                najbardziej, dostaje priorytet.
              </>
            ),
            cta: { label: "Zobacz cennik", href: "/pricing" },
            visual: <SubjectRows />,
          },
          {
            title: "Plan z kilku prostych odpowiedzi",
            description: (
              <>
                Wybierasz egzamin, termin i tempo — Examax rozkłada cały materiał na tygodnie i dni. Zmienisz zdanie? Plan{" "}
                <Link href="#flexible">przelicza się sam</Link>.
              </>
            ),
            cta: { label: "Ułóż swój plan", href: "/signup" },
            visual: <PlanWizard />,
          },
          {
            title: "Diagnoza ustawia punkt startu",
            description: (
              <>
                Krótki <Link href="/training">quiz diagnostyczny</Link> sprawdza, co już umiesz. Braki trafiają na początek planu, a opanowane
                tematy — na jego koniec.
              </>
            ),
            cta: { label: "Zacznij od diagnozy", href: "/signup" },
            visual: <DiagnosticFlow />,
          },
        ]}
      />
      <MiniFeatures
        summary="Wszystko to masz od pierwszego dnia — także w darmowym planie."
        cta={{ label: "Ułóż swój plan", href: "/signup" }}
        items={[
          {
            icon: LockOpen,
            title: "Nic nie jest zablokowane",
            description: "Każdy temat jest otwarty od pierwszego dnia. Chcesz przeskoczyć dalej? Po prostu idź.",
          },
          {
            icon: RefreshCcw,
            title: "Powtórki w tle",
            description: "Stare tematy wracają same, zanim wypadną z głowy — bez dopisywania ich do listy.",
          },
          {
            icon: CalendarClock,
            title: "Zmiana terminu",
            description: "Przesuwasz datę albo masz słabszy tydzień? Plan rozkłada materiał na nowo.",
          },
          {
            icon: Smartphone,
            title: "Na każdym urządzeniu",
            description: "Ten sam plan na telefonie i komputerze — postęp synchronizuje się sam.",
          },
        ]}
      />
    </GridSection>
  );
}
