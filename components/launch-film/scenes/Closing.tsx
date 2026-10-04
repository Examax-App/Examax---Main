import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BookMarked, Languages, Sigma } from "lucide-react";
import { AccentTile } from "@/components/ui/FeaturePill";
import { CkeIcon } from "@/components/ui/CkeIcon";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { EASE, ramp } from "@/components/hero-film/motion";
import { BEATS, SCENES, TYPING, typed } from "@/components/launch-film/timeline";
import { Caret, Card, Scene, Words, bob, useArrival } from "@/components/launch-film/parts";
import { Bubble, ChartCard, ScoreCard, TaskCard } from "@/components/launch-film/pieces";
import { Lockup } from "@/components/launch-film/scenes/Opening";

/*
 * 50–60 s. Which exams, then the sign-off. Dub names its integrations as
 * tiles drifting round a line; here the official exam marks and the three
 * subjects drift round "Egzamin ósmoklasisty i matura". On the downbeat of
 * the impact, dub's closing collage: the film's own pieces, finished,
 * tilted in from the corners round the lockup, and the address typed out.
 */

const MARKS = [
  { mark: <E8Icon className="h-[70px] w-[96px]" />, label: "Ósmoklasista", x: 250, y: 190, tilt: -6 },
  { mark: <MaturaIcon className="h-[70px] w-[96px]" />, label: "Matura podstawowa", x: 1440, y: 170, tilt: 5 },
  { mark: <MaturaIcon className="h-[70px] w-[96px]" />, label: "Matura rozszerzona", x: 1500, y: 700, tilt: -4 },
  { mark: <CkeIcon className="h-[70px] w-auto" />, label: "Arkusze CKE", x: 200, y: 690, tilt: 4 },
];

const SUBJECTS = [
  { icon: Sigma, accent: "blue" as const, label: "Matematyka" },
  { icon: BookMarked, accent: "green" as const, label: "Język polski" },
  { icon: Languages, accent: "lavender" as const, label: "Język angielski" },
];

export function Exams() {
  const frame = useCurrentFrame();
  const subjects = ramp(frame, 40, 16);
  // Into the impact: everything rushes towards the viewer as the riser peaks.
  const rush = interpolate(frame, [SCENES.exams.frames - 24, SCENES.exams.frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <Scene frames={SCENES.exams.frames}>
      <AbsoluteFill style={{ transform: `scale(${1 + rush * 0.12})` }}>
        <div className="absolute inset-x-0 top-[370px] text-center font-satoshi text-[118px] font-medium leading-[1.05] tracking-[-0.02em]">
          <Words text="Egzamin ósmoklasisty" at={4} step={5} />
          <br />
          <Words text="i matura" at={16} step={5} from="#e5e5e5" to="#a3a3a3" />
        </div>
        {MARKS.map((item, i) => {
          const t = ramp(frame, BEATS.examsMarks[i], 16);
          return (
            <Card
              key={item.label}
              className="absolute flex flex-col items-center gap-4 px-10 py-8"
              style={{
                left: item.x,
                top: item.y,
                opacity: t,
                transform: `translateY(${(1 - t) * 60 + bob(frame, 8, 90, i * 25)}px) rotate(${item.tilt}deg) scale(${0.85 + t * 0.15})`,
              }}
            >
              {item.mark}
              <span className="text-[24px] font-medium">{item.label}</span>
            </Card>
          );
        })}
        <div className="absolute inset-x-0 top-[690px] flex justify-center gap-5" style={{ opacity: subjects, transform: `translateY(${(1 - subjects) * 30}px)` }}>
          {SUBJECTS.map((subject) => (
            <span key={subject.label} className="flex items-center gap-4 rounded-full border border-ash bg-white px-7 py-4 text-[28px] font-medium shadow-[0_14px_30px_-16px_rgba(0,0,0,0.25)]">
              <span className="origin-center scale-[1.7]">
                <AccentTile icon={subject.icon} accent={subject.accent} />
              </span>
              {subject.label}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

/** A finished piece, sliding in from a corner on the impact. */
function Corner({ at, from, style, children }: { at: number; from: [number, number]; style: React.CSSProperties; children: React.ReactNode }) {
  const t = useArrival(at, 18);
  return (
    <div className="absolute" style={{ ...style, opacity: Math.min(1, t * 1.6), translate: `${(1 - t) * from[0]}px ${(1 - t) * from[1]}px` }}>
      {children}
    </div>
  );
}

export function Outro() {
  const frame = useCurrentFrame();
  const lock = useArrival(2, 14);
  const url = typed(TYPING.url, frame);
  const [a, b, c, d] = BEATS.outroCards;
  return (
    <AbsoluteFill>
      {/* The collage, finished pieces round the edge */}
      <Corner at={a} from={[-300, -200]} style={{ left: -90, top: -40, transform: "rotate(-9deg) scale(0.62)", transformOrigin: "top left" }}>
        <TaskCard f={999} pickAt={0} correctAt={0} />
      </Corner>
      <Corner at={b} from={[300, -200]} style={{ right: -150, top: -10, transform: "rotate(8deg) scale(0.56)", transformOrigin: "top right" }}>
        <ChartCard f={999} tipAt={0} />
      </Corner>
      <Corner at={c} from={[-300, 220]} style={{ left: -60, bottom: 0, transform: "rotate(7deg) scale(0.58)", transformOrigin: "bottom left" }}>
        <ScoreCard f={999} />
      </Corner>
      <Corner at={d} from={[300, 220]} style={{ right: 10, bottom: 80, transform: "rotate(-6deg) scale(0.68)", transformOrigin: "bottom right" }}>
        <Card className="w-[760px] p-8">
          <Bubble from="tutor">Dokładnie tak. √Δ = 7 — teraz policz oba pierwiastki.</Bubble>
        </Card>
      </Corner>

      {/* A clearing in the middle for the name */}
      <AbsoluteFill className="bg-[radial-gradient(ellipse_42%_40%_at_50%_50%,white_55%,transparent)]" />

      <AbsoluteFill style={{ transform: `translateY(-70px) scale(${0.8 + lock * 0.2})`, opacity: Math.min(1, lock * 1.5) }}>
        <Lockup scale={0.8} />
      </AbsoluteFill>
      <div className="absolute inset-x-0 top-[600px] text-center font-satoshi text-[54px] font-medium tracking-[-0.01em]">
        <Words text="Twój egzamin zaczyna się dziś" at={22} step={4} from="#e5e5e5" to="#525252" />
      </div>
      <div
        className="absolute inset-x-0 top-[700px] flex justify-center font-inter text-[40px] font-medium text-charcoal"
        style={{ opacity: ramp(frame, TYPING.url.at - 6, 8) }}
      >
        <span className="text-silver">↳&nbsp;</span>
        {url}
        <Caret />
      </div>
    </AbsoluteFill>
  );
}
