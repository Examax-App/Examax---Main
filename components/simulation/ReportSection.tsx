import { GridSection, SectionHeader } from "@/components/roadmap/sections";
import { ReportDashboard } from "@/components/simulation/ReportDashboard";
import { WalkthroughFilm } from "@/components/simulation/WalkthroughFilm";

/*
 * dub.co/solutions/creators' "Gain deeper audience insights" (live DOM,
 * 2026-10-02): heading and line, then the dashboard fading out at its foot.
 * Between them, the product itself: the walkthrough film of one whole
 * simulation, with its chapter strip. Dub's four-up row of small features
 * under the dashboard is left out, at his request.
 */
export function ReportSection() {
  return (
    <GridSection id="report" labelledBy="report-heading" innerClassName="pb-12 pt-20 sm:pb-16 sm:pt-24">
      <SectionHeader
        id="report-heading"
        title="Zobacz, gdzie tracisz punkty"
        sub="Po oddaniu arkusza Examax sprawdza go według zasad oceniania CKE i rozkłada wynik na działy, zadania i minuty."
      />
      <div className="px-4 pt-12">
        <WalkthroughFilm />
      </div>
      <ReportDashboard />
    </GridSection>
  );
}
