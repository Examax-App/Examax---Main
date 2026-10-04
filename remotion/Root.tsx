import { Composition } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { LaunchFilm } from "@/components/launch-film/LaunchFilm";
import { FILM } from "@/components/launch-film/timeline";
import "./film.css";

loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

export function RemotionRoot() {
  return (
    <Composition
      id="LaunchFilm"
      component={LaunchFilm}
      durationInFrames={FILM.frames}
      fps={FILM.fps}
      width={FILM.width}
      height={FILM.height}
    />
  );
}
