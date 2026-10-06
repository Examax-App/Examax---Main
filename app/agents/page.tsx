import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/sections/CtaBand";
import { AgentsHero } from "@/components/agents/AgentsHero";
import { TeamSection } from "@/components/agents/TeamSection";
import { WorkSection } from "@/components/agents/WorkSection";
import { FilmSection } from "@/components/agents/FilmSection";
import { GridSection } from "@/components/roadmap/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Korepetytor AI",
  description:
    "Zespół agentów AI, który tłumaczy krok po kroku, układa sprawdziany i planuje naukę — ale każde zadanie rozwiązujesz sam.",
  path: "/agents",
  social: { description: "Korepetytor, który nie odrabia za Ciebie: prowadzi krok po kroku, aż umiesz to zrobić sam." },
});

/**
 * The Korepetytor AI route — the destination behind the navbar's
 * "Korepetytor AI" card and the footer's link (both went to the landing's
 * `#agent` band before).
 *
 * Built from his Grok Bot capture (`DesignRules/agents.png`: the team's
 * faces floating over a centred headline, the app window under it), on the
 * dub page frame the rest of the site uses. (A first set of bands —
 * comparison, abilities, mobile, Pro — was cut on 2026-10-02; the two
 * after the builder were added on 2026-10-03; the control band and half of
 * the work grid were removed the same day.)
 *
 *   hero: floating team + live window → AgentsHero
 *   your agents: builder + list       → TeamSection #team
 *   how they work: one row of two     → WorkSection #work
 *   the agent at work: Remotion film  → FilmSection #film
 *   closing band                      → CtaBand
 */
export default function AgentsPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <AgentsHero />
        <TeamSection />
        <WorkSection />
        <FilmSection />
        {/* The reference's empty ruled strip between the last band and the CTA notch */}
        <GridSection innerClassName="h-12" />
        <CtaBand
          title="Zacznij uczyć się lepiej już dziś"
          sub="W czasach AI chodzi o to, by pomagało Ci się uczyć, a nie dawało skrótu, z którego nic nie wyniesiesz."
        />
      </main>
      <Footer />
    </>
  );
}
