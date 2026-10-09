import { FeatureGrid, GridSection, SectionHeader } from "@/components/roadmap/sections";
import { AnswerLog, PaceChart, SessionCards, ToolScroll } from "@/components/simulation/SheetVisuals";

/*
 * dub.co/solutions/creators' "Short links are essential to creators" (live
 * DOM, 2026-10-02): a centred heading and line with no eyebrow, then the
 * two-by-two of pictures, each with its title, a line and "Learn more".
 */
export function SheetSection() {
  return (
    <GridSection id="sheet" labelledBy="sheet-heading" innerClassName="pt-20 sm:pt-24">
      <SectionHeader
        id="sheet-heading"
        title="Pełny arkusz, nie kolejny quiz"
        sub="Ten sam format, czas i zasady, które poznasz na egzaminie — żeby dzień egzaminu nie był pierwszym razem."
      />
      <div className="mt-12">
        <FeatureGrid
          cells={[
            {
              title: "Zegar jak na sali",
              description: "Czas dokładnie jak na egzaminie. Od pierwszej do ostatniej minuty pracujesz w tych samych ramach czasowych, a po zakończeniu widzisz przebieg swojego arkusza.",
              cta: { label: "Zobacz raport", href: "#report" },
              visual: <PaceChart />,
            },
            {
              title: "Narzędzia, których wolno używać",
              description: "Korzystasz tylko z narzędzi dostępnych podczas prawdziwego egzaminu — bez dodatkowych podpowiedzi i skrótów.",
              cta: { label: "Zobacz narzędzia", href: "#tools" },
              visual: <ToolScroll />,
            },
            {
              title: "Arkusze z każdej sesji",
              description: "Matura i egzamin ósmoklasisty z poprzednich lat, każdy z oryginalnym czasem i punktacją CKE. Nowe arkusze dodajemy po ich publikacji.",
              cta: { label: "Zobacz arkusze", href: "/training#coverage" },
              visual: <SessionCards />,
            },
            {
              title: "Każdy ruch zapisany",
              description: "Twoje odpowiedzi, czas pracy i wyniki zapisują się automatycznie, tworząc historię podejść i pokazując Twój progres.",
              cta: { label: "Zobacz postępy", href: "/progress" },
              visual: <AnswerLog />,
            },
          ]}
        />
      </div>
    </GridSection>
  );
}
