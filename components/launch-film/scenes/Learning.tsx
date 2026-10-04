import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CheckCheck, Flame, Layers } from "lucide-react";
import { Funnel } from "@/components/hero-film/kit";
import { ramp } from "@/components/hero-film/motion";
import { BEATS, SCENES } from "@/components/launch-film/timeline";
import { Card, Headline, Pointer, Scene, Words, bob, pointerAt, useArrival } from "@/components/launch-film/parts";
import { TaskCard } from "@/components/launch-film/pieces";

/*
 * 10–24 s. The plan, then the practice. Dub's funnel sequence — the
 * conversion bands drawn across a tilted board, stat cards hovering over
 * each stage while the camera glides — becomes the roadmap's mastery
 * funnel. Then the task from the opening comes back to be answered: the
 * pointer picks B and the sheet marks it right.
 */

const STAGES = [
  { color: "#3b82f6", share: "100%", label: "Tematy", value: "124" },
  { color: "#8b5cf6", share: "36%", label: "W trakcie", value: "45" },
  { color: "#2dd4bf", share: "10%", label: "Opanowane", value: "12" },
];

export function Roadmap() {
  const frame = useCurrentFrame();
  const { frames } = SCENES.roadmap;
  const glide = interpolate(frame, [0, frames], [0, 1]);
  const reveal = ramp(frame, 6, 60);

  return (
    <Scene frames={frames}>
      {/* The board, tilted, the camera sliding along it */}
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div
          className="absolute left-1/2 top-[390px]"
          style={{
            transform: `translateX(calc(-50% + ${interpolate(glide, [0, 1], [90, -90])}px)) rotateX(${24 - glide * 6}deg) rotateZ(${-6 + glide * 2}deg) scale(${1 + glide * 0.08})`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-[620px] w-[1640px] rounded-[28px] border border-ash bg-white/80 shadow-[0_60px_120px_-50px_rgba(37,99,235,0.35)]">
            {/* Column rules, as the reference's chart draws them */}
            {[1, 2].map((i) => (
              <span key={i} className="absolute inset-y-0 w-px bg-ash" style={{ left: (1640 / 3) * i }} />
            ))}
            <div className="absolute left-[20px] top-[70px] origin-top-left scale-[2]">
              <Funnel width={800} height={240} stages={STAGES} reveal={reveal} id="launch-funnel" />
            </div>
          </div>

          {/* A card over each stage */}
          {STAGES.map((stage, i) => {
            const t = arrivalAt(frame, BEATS.roadmapCards[i]);
            return (
              <Card
                key={stage.label}
                className="absolute w-[300px] px-7 py-5"
                style={{
                  left: 120 + i * 546,
                  top: -70 + i * 26,
                  opacity: Math.min(1, t * 1.5),
                  transform: `translateY(${(1 - t) * 50 + bob(frame, 5, 80, i * 20)}px) translateZ(80px) rotateZ(${[-4, 3, -2][i]}deg)`,
                }}
              >
                <span className="flex items-center gap-2 text-[22px] text-fog">
                  <span className="size-3.5 rounded-full" style={{ background: stage.color }} />
                  {stage.label}
                </span>
                <span className="mt-2 flex items-baseline gap-3">
                  <span className="font-satoshi text-[60px] font-medium leading-none">{stage.value}</span>
                  <span className="text-[22px] text-fog">{stage.share}</span>
                </span>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* The line, over a soft white so it reads against the board */}
      <div className="absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(ellipse_60%_80%_at_50%_30%,white_45%,transparent)]" />
      <Headline top={56} className="text-[92px]">
        <Words text="Roadmapa prowadzi Cię" at={58} step={4} />
        <br />
        <Words text="od pierwszego tematu do egzaminu" at={76} step={3} from="#e5e5e5" to="#a3a3a3" />
      </Headline>
    </Scene>
  );
}

/** A springy arrival at a scene-local frame, for items mapped in a loop (where hooks can't be called). */
function arrivalAt(frame: number, at: number): number {
  return interpolate(frame - at, [0, 6, 12, 18], [0, 0.75, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function Practice() {
  const frame = useCurrentFrame();
  const card = useArrival(BEATS.practiceCard);
  const pointer = pointerAt(frame, [
    { at: 44, x: 1560, y: 1010 },
    { at: BEATS.practiceClick - 4, x: 890, y: 712 },
    { at: BEATS.practiceClick, x: 890, y: 712, click: true },
    { at: BEATS.practiceClick + 30, x: 980, y: 760 },
  ]);
  const [leftAt, rightAt] = BEATS.practiceChips;
  const left = ramp(frame, leftAt, 16);
  const right = ramp(frame, rightAt, 16);

  return (
    <Scene frames={SCENES.practice.frames}>
      <Headline top={110} className="text-[96px]">
        <Words text="Ćwicz na prawdziwych zadaniach CKE" at={4} step={4} />
      </Headline>

      <div className="absolute left-1/2 top-[330px]" style={{ perspective: 2400 }}>
        <TaskCard
          f={frame}
          pickAt={BEATS.practiceClick}
          correctAt={BEATS.practiceCorrect}
          style={{
            transform: `translateX(-50%) translateY(${(1 - card) * 240 + bob(frame, 5)}px) rotateX(${4 + (1 - card) * 20}deg)`,
            opacity: Math.min(1, card * 1.4),
          }}
        />
      </div>

      {/* What happens after the answer: it's checked against CKE's marking rules, and the streak grows */}
      <Card
        className="absolute flex items-center gap-4 px-7 py-5 text-[24px] font-medium"
        style={{ left: 90, top: 760, opacity: left, transform: `translateY(${(1 - left) * 40 + bob(frame, 6, 100)}px) rotate(-4deg)` }}
      >
        <span className="grid size-12 place-items-center rounded-[14px] bg-[#dcfce7] text-[#15803d]">
          <CheckCheck className="size-7" strokeWidth={2} />
        </span>
        Sprawdzone według
        <br />
        zasad oceniania CKE
      </Card>
      <Card
        className="absolute flex items-center gap-4 px-7 py-5 text-[24px] font-medium"
        style={{ right: 100, top: 300, opacity: right, transform: `translateY(${(1 - right) * 40 + bob(frame, 6, 110, 30)}px) rotate(4deg)` }}
      >
        <span className="grid size-12 place-items-center rounded-[14px] bg-[#ffedd5] text-tangerine">
          <Flame className="size-7" strokeWidth={2} />
        </span>
        <span>
          Seria nauki
          <span className="block text-[20px] font-normal text-fog">6 dni z rzędu</span>
        </span>
      </Card>
      <Card
        className="absolute flex items-center gap-4 px-7 py-5 text-[24px] font-medium"
        style={{ right: 140, top: 820, opacity: ramp(frame, rightAt + 14, 16), transform: `translateY(${(1 - ramp(frame, rightAt + 14, 16)) * 40 + bob(frame, 5, 95, 50)}px) rotate(-2deg)` }}
      >
        <span className="grid size-12 place-items-center rounded-[14px] bg-soft-blue text-electric-blue">
          <Layers className="size-7" strokeWidth={2} />
        </span>
        <span>
          Następne: Zadanie 2.
          <span className="block text-[20px] font-normal text-fog">Potęgi i pierwiastki</span>
        </span>
      </Card>

      <Pointer {...pointer} />
    </Scene>
  );
}
