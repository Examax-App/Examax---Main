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
        sub="Ten sam arkusz, ten sam czas i te same narzędzia co na sali — żeby w dniu egzaminu format był Ci już znany."
      />
      <div className="mt-12">
        <FeatureGrid
          cells={[
            {
              title: "Zegar jak na sali",
              description: "Czas biegnie tak jak na egzaminie — 180 minut na maturze z matematyki. Po oddaniu widzisz, jak zbierałeś punkty minuta po minucie.",
              cta: { label: "Zobacz raport", href: "#report" },
              visual: <PaceChart />,
            },
            {
              title: "Narzędzia, których wolno używać",
              description: "Pióro, gumka, brudnopis, karta wzorów i prosty kalkulator — dokładnie to, co masz na sali, i nic ponad to.",
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
              description: "Odpowiedzi, notatki i rysunki zapisują się automatycznie, a dziennik arkusza pokazuje, co i kiedy zrobiłeś — nawet gdy zamkniesz kartę.",
              cta: { label: "Zobacz postępy", href: "/progress" },
              visual: <AnswerLog />,
            },
          ]}
        />
      </div>
    </GridSection>
  );
}
