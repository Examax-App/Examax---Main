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
        title="Wyniki pomagają wybrać kolejny krok"
        sub="Korepetytor AI pomaga zinterpretować Twoje wyniki i proponuje, co warto powtórzyć. Przypomnienia, jeśli je włączysz, pomagają utrzymać regularność."
      />
      <SignalFlow />
    </GridSection>
  );
}
