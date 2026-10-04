import { Sparkles } from "lucide-react";
import { GridSection, SectionHeader } from "@/components/roadmap/sections";
import { SignalFlow } from "@/components/progress/SignalFlow";

/**
 * dub.co/analytics' "Turn events into opportunities" band — the header, then
 * the switch on the band's rule over the dotted field and its diagram.
 */
export function NextSection() {
  return (
    <GridSection id="next" labelledBy="next-heading" innerClassName="pt-20">
      <SectionHeader
        id="next-heading"
        icon={Sparkles}
        eyebrow="Rekomendacje i przypomnienia"
        title="Każdy wynik podpowiada, co dalej"
        sub="Korepetytor AI czyta Twoje wyniki i mówi, co powtórzyć. Przypomnienia pilnują serii, zanim ją stracisz."
      />
      <SignalFlow />
    </GridSection>
  );
}
