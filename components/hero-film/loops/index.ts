import { RoadmapLoop } from "@/components/hero-film/loops/RoadmapLoop";
import { PracticeLoop } from "@/components/hero-film/loops/PracticeLoop";
import { ProgressLoop } from "@/components/hero-film/loops/ProgressLoop";
import type { FilmTab } from "@/components/hero-film/timeline";

/** The loop each hero tab plays — shared by the Player's composition (HeroFilm) and the posters (HeroPoster). */
export const LOOPS: Record<FilmTab, () => React.ReactNode> = {
  roadmap: RoadmapLoop,
  practice: PracticeLoop,
  progress: ProgressLoop,
};
