import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FastForward, Send } from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { EASE, ramp } from "@/components/hero-film/motion";
import { FinishedSheet } from "@/components/simulation/FinishedSheet";
import { SITTING } from "@/components/simulation/sitting";
import { BEATS, SCENES } from "@/components/launch-film/timeline";
import { Card, Headline, Pointer, Scene, Words, bob, pointerAt, useArrival } from "@/components/launch-film/parts";
import { ChartCard, ScoreCard } from "@/components/launch-film/pieces";

/*
 * 34–50 s. The sitting and what it shows. A full paper on the clock — the
 * timer racing through the 141 minutes while Zadanie 10 is written out on
 * the squared sheet — handed in, and the report rolling up to 42 / 50.
 * Then dub's realtime dashboard, tilted and gliding: the year's progress.
 */

const EXAM_SECONDS = SITTING.examMinutes * 60;
const USED_SECONDS = SITTING.minutes * 60;

function clock(seconds: number): string {
  const left = Math.max(0, Math.round(seconds));
  return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
}

export function Simulation() {
  const frame = useCurrentFrame();
  const timer = useArrival(10);
  const sheet = useArrival(18);
  // The paper, fast-forwarded: 141 minutes between frames 30 and 150.
  const used = interpolate(frame, [30, 150], [0, USED_SECONDS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const writing = interpolate(frame, [36, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handIn = ramp(frame, BEATS.simulationClick + 4, 16);
  const score = useArrival(BEATS.simulationScore, 15);
  const pointer = pointerAt(frame, [
    { at: 120, x: 1600, y: 1040 },
    { at: BEATS.simulationClick - 4, x: 480, y: 650 },
    { at: BEATS.simulationClick, x: 480, y: 650, click: true },
    { at: BEATS.simulationClick + 20, x: 580, y: 760 },
  ]);

  return (
    <Scene frames={SCENES.simulation.frames}>
      <Headline top={96} className="text-[96px]">
        <Words text="Napisz egzamin," at={4} step={4} />{" "}
        <Words text="zanim zacznie się liczyć" at={14} step={4} from="#e5e5e5" to="#a3a3a3" />
      </Headline>

      <AbsoluteFill style={{ perspective: 2400, opacity: 1 - handIn, filter: `blur(${handIn * 10}px)` }}>
        {/* The clock */}
        <Card
          className="absolute w-[560px] p-9"
          style={{
            left: 200,
            top: 330,
            opacity: Math.min(1, timer * 1.4),
            transform: `translateY(${(1 - timer) * 200 + bob(frame, 5)}px) translateX(${-handIn * 120}px) rotateY(${16 - timer * 4}deg) rotateZ(-2deg)`,
          }}
        >
          <span className="flex items-center gap-3 text-[24px] font-medium">
            <MaturaIcon className="h-8 w-10" />
            {SITTING.exam} · {SITTING.subject}
          </span>
          <span className="mt-2 block text-[20px] text-fog">
            {SITTING.level} · {SITTING.code}
          </span>
          <span className="mt-8 block font-mono text-[104px] font-medium leading-none tracking-[-0.04em] tabular-nums">{clock(EXAM_SECONDS - used)}</span>
          <span className="mt-3 flex items-center gap-2 text-[20px] text-fog">
            <FastForward className="size-5" strokeWidth={2} />
            do końca egzaminu
          </span>
          <div className="mt-7 h-3 overflow-hidden rounded-full bg-paper-mist">
            <div className="h-full rounded-full bg-lavender" style={{ width: `${(used / EXAM_SECONDS) * 100}%` }} />
          </div>
          <span
            className="mt-8 flex h-[72px] items-center justify-center gap-3 rounded-[16px] bg-charcoal text-[26px] font-medium text-white"
            style={{ transform: `scale(${pointer.pressed ? 1 - pointer.pressed * 0.04 : 1})` }}
          >
            <Send className="size-6" strokeWidth={2} />
            Oddaj arkusz
          </span>
        </Card>

        {/* The sheet, written out line by line */}
        <div
          className="absolute"
          style={{
            left: 860,
            top: 290,
            opacity: Math.min(1, sheet * 1.4),
            transform: `translateY(${(1 - sheet) * 220 + bob(frame, 6, 100, 20)}px) translateX(${handIn * 160}px) rotateY(${-14 + sheet * 4}deg) rotateZ(2deg)`,
          }}
        >
          <Card className="relative h-[740px] w-[800px] overflow-hidden">
            {/* The hero card's sheet at its own 320px width, scaled up whole */}
            <div className="absolute left-[8px] top-[8px] h-[300px] w-[320px] origin-top-left scale-[2.4]">
              <div className="absolute inset-0" style={{ clipPath: `inset(0 0 ${(1 - writing) * 82}% 0)` }}>
                <FinishedSheet />
              </div>
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      {/* The report */}
      <div className="absolute left-1/2 top-[380px]" style={{ perspective: 2400 }}>
        <ScoreCard
          f={frame}
          at={BEATS.simulationScore + 8}
          style={{
            transform: `translateX(-50%) translateY(${(1 - score) * 200 + bob(frame, 4)}px) rotateX(${(1 - score) * 20}deg) scale(${0.9 + score * 0.1})`,
            opacity: Math.min(1, score * 1.4),
          }}
        />
      </div>
      <Pointer {...pointer} />
    </Scene>
  );
}

export function Progress() {
  const frame = useCurrentFrame();
  const { frames } = SCENES.progress;
  const card = useArrival(8);
  const glide = interpolate(frame, [0, frames], [0, 1], { easing: EASE });
  return (
    <Scene frames={frames}>
      <Headline top={96} className="text-[96px]">
        <Words text="Widzisz, jak rośnie" at={4} step={4} />{" "}
        <Words text="Twój wynik" at={16} step={4} from="#e5e5e5" to="#2563eb" />
      </Headline>
      <div className="absolute left-1/2 top-[300px]" style={{ perspective: 2200 }}>
        <ChartCard
          f={frame}
          at={10}
          tipAt={BEATS.progressTip}
          style={{
            transform: `translateX(calc(-50% + ${interpolate(glide, [0, 1], [60, -40])}px)) translateY(${(1 - card) * 240}px) rotateX(${18 - glide * 8 + (1 - card) * 14}deg) rotateZ(${-3 + glide * 2}deg) scale(${0.96 + glide * 0.06})`,
            opacity: Math.min(1, card * 1.4),
          }}
        />
      </div>
    </Scene>
  );
}
