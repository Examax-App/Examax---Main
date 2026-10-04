import { PlayCircle } from "lucide-react";
import { GridSection, SectionHeader } from "@/components/roadmap/sections";
import { AgentFilm } from "@/components/agents/AgentFilm";

/**
 * The agent at work, start to finish — the film band that closes /agents,
 * set as /simulation's #report sets its walkthrough: the centred header,
 * then the film in its window with the chapter strip under it.
 */
export function FilmSection() {
  return (
    <GridSection id="film" labelledBy="film-heading" innerClassName="pb-16 pt-20 sm:pb-20 sm:pt-24">
      <SectionHeader
        id="film-heading"
        icon={PlayCircle}
        eyebrow="Zobacz w akcji"
        title="Od pierwszej wiadomości do arkusza"
        sub="Tworzysz agenta, ustalasz rutynę, uczysz się krok po kroku i sprawdzasz się na pełnej maturze."
      />
      <div className="mt-12 px-4 sm:mt-14 sm:px-10">
        <AgentFilm />
      </div>
    </GridSection>
  );
}
