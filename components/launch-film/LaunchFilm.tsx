import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, SCENES, type SceneKey } from "@/components/launch-film/timeline";
import { Stage } from "@/components/launch-film/parts";
import { Intro, Sheets } from "@/components/launch-film/scenes/Opening";
import { Practice, Roadmap } from "@/components/launch-film/scenes/Learning";
import { Tutor } from "@/components/launch-film/scenes/Tutor";
import { Progress, Simulation } from "@/components/launch-film/scenes/Exam";
import { Exams, Outro } from "@/components/launch-film/scenes/Closing";

/*
 * Examax's launch film — one minute, 1920×1080 at 30 fps, with its own
 * soundtrack. Modelled on dub.co's product film (the "Watch demo" on
 * dub.co/analytics): kinetic type and floating product pieces on a white
 * grid, cut to the music.
 *
 *    0–4 s    Intro       the tile and the wordmark
 *    4–10 s   Sheets      "Zamień arkusze CKE" → "w Twój plan nauki"
 *   10–16 s   Roadmap     the mastery funnel, tilted and gliding
 *   16–24 s   Practice    Zadanie 1, answered and marked right
 *   24–34 s   Tutor       Korepetytor AI, a step at a time
 *   34–44 s   Simulation  a sitting on the clock, handed in, 42 / 50
 *   44–50 s   Progress    the year's readiness, climbing
 *   50–54 s   Exams       E8, both maturas, the subjects
 *   54–60 s   Outro       the collage, the name, examax.app
 *
 * Rendered to public/about/examax-film.mp4 by `pnpm film:render`; /about
 * plays that file. Sound: remotion/public/film/*.wav, made by
 * remotion/audio/compose.py.
 */

const SCENE_COMPONENTS: Record<SceneKey, () => React.ReactNode> = {
  intro: Intro,
  sheets: Sheets,
  roadmap: Roadmap,
  practice: Practice,
  tutor: Tutor,
  simulation: Simulation,
  progress: Progress,
  exams: Exams,
  outro: Outro,
};

export function LaunchFilm() {
  return (
    <AbsoluteFill className="overflow-hidden bg-white font-inter text-charcoal antialiased">
      <Stage />
      {(Object.keys(SCENES) as SceneKey[]).map((key) => {
        const Scene = SCENE_COMPONENTS[key];
        return (
          <Sequence key={key} from={SCENES[key].from} durationInFrames={SCENES[key].frames} name={key}>
            <Scene />
          </Sequence>
        );
      })}

      <Audio src={staticFile("film/music.wav")} volume={0.9} />
      {CUES.map((cue, i) => (
        <Sequence key={i} from={cue.at} durationInFrames={45} name={`sfx ${cue.sound}`}>
          <Audio src={staticFile(`film/${cue.sound}.wav`)} volume={cue.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
