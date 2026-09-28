import { FrameAt } from "@/components/hero-film/frame";
import { LOOPS } from "@/components/hero-film/HeroFilm";
import { HEIGHT, POSTER_FRAME, WIDTH, type FilmTab } from "@/components/hero-film/timeline";

/**
 * A tab's still: its loop pinned to the moment the first page has arrived and
 * before the cursor comes in. It ships in the server HTML, so the hero shows
 * the product before any Remotion JavaScript lands, and it is what a
 * reduced-motion visitor sees.
 *
 * It reuses the loop itself, so there is no second copy of this UI. The
 * composition is drawn at its own pixel size inside an SVG viewBox, which
 * scales it to the container exactly as the Player does — no script needed.
 */
export function HeroPoster({ tab }: { tab: FilmTab }) {
  const Loop = LOOPS[tab];
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-full w-full" aria-hidden>
      <foreignObject width={WIDTH} height={HEIGHT}>
        <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
          <FrameAt frame={POSTER_FRAME[tab]}>
            <Loop />
          </FrameAt>
        </div>
      </foreignObject>
    </svg>
  );
}
