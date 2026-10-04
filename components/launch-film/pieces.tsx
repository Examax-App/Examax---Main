import { interpolate, interpolateColors } from "remotion";
import { Check, Sparkles } from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { AreaChart, Roll } from "@/components/hero-film/kit";
import { ramp } from "@/components/hero-film/motion";
import { Radical } from "@/components/simulation/math";
import { SITTING } from "@/components/simulation/sitting";
import { Card } from "@/components/launch-film/parts";
import { cn } from "@/lib/cn";

/*
 * The product pieces the film is built from, drawn at film size. Each takes
 * its frame as a prop rather than reading the clock, so the closing collage
 * can show them as they end up.
 *
 * The task is CKE's own: Zadanie 1 of the May 2025 basic maths paper
 * (MMAP-P0_100) — (√32 − √2)² = (3√2)² = 18, answer B — the same task the
 * landing's film works through. The result is the shared sitting fixture.
 */

const OPTIONS = [
  { key: "A", value: "16" },
  { key: "B", value: "18" },
  { key: "C", value: "30" },
  { key: "D", value: "34" },
];

/** Zadanie 1, with B picked at `pickAt` and marked right at `correctAt` (never, if left out). */
export function TaskCard({ f, pickAt = Infinity, correctAt = Infinity, className, style }: { f: number; pickAt?: number; correctAt?: number; className?: string; style?: React.CSSProperties }) {
  const picked = ramp(f, pickAt, 6);
  const right = ramp(f, correctAt, 10);
  return (
    <Card className={cn("w-[980px] p-10", className)} style={style}>
      <div className="flex items-center justify-between border-b border-ash pb-5">
        <span className="flex items-center gap-3 text-[24px] font-medium">
          <MaturaIcon className="h-8 w-10" />
          {SITTING.exam} · {SITTING.subject}
        </span>
        <span className="rounded-[10px] bg-paper-mist px-3 py-1.5 font-mono text-[19px] text-fog">{SITTING.code}</span>
      </div>
      <div className="mt-7 flex items-center justify-between">
        <p className="text-[30px] font-semibold">Zadanie 1. (0–1)</p>
        <span
          className="flex items-center gap-2 rounded-[12px] bg-[#dcfce7] px-4 py-2 text-[22px] font-semibold text-[#166534]"
          style={{ opacity: right, transform: `scale(${0.8 + right * 0.2})` }}
        >
          <Check className="size-6" strokeWidth={3} />
          Poprawnie · +1 pkt
        </span>
      </div>
      <p className="mt-3 text-[22px] text-fog">Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.</p>
      <p className="mt-5 flex items-center text-[34px]">
        Liczba&nbsp;(<Radical>32</Radical>&nbsp;−&nbsp;<Radical>2</Radical>)<sup className="text-[0.6em]">2</sup>&nbsp;jest równa
      </p>
      <div className="mt-8 grid grid-cols-4 gap-4">
        {OPTIONS.map((option) => {
          const isB = option.key === "B";
          const border = isB ? interpolateColors(right, [0, 1], [interpolateColors(picked, [0, 1], ["#e5e5e5", "#2563eb"]), "#16a34a"]) : "#e5e5e5";
          const fill = isB ? interpolateColors(right, [0, 1], [interpolateColors(picked, [0, 1], ["#ffffff", "#eff6ff"]), "#f0fdf4"]) : "#ffffff";
          return (
            <div key={option.key} className="flex h-[92px] items-center gap-4 rounded-[16px] border-2 px-5" style={{ borderColor: border, background: fill }}>
              <span
                className="grid size-11 place-items-center rounded-full text-[20px] font-semibold"
                style={{ background: isB ? interpolateColors(right, [0, 1], [interpolateColors(picked, [0, 1], ["#f5f5f5", "#2563eb"]), "#16a34a"]) : "#f5f5f5", color: isB && picked > 0.5 ? "#fff" : "#525252" }}
              >
                {option.key}
              </span>
              <span className="text-[32px] font-medium">{option.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/** The report's headline: score, percent and time rolling in from `at`, the bar filling to 84% past the 30% mark. */
export function ScoreCard({ f, at = 0, className, style }: { f: number; at?: number; className?: string; style?: React.CSSProperties }) {
  const fill = interpolate(f, [at + 6, at + 46], [0, SITTING.percent], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <Card className={cn("w-[1040px] p-10", className)} style={style}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-3 text-[24px] font-medium">
          <MaturaIcon className="h-8 w-10" />
          Raport · {SITTING.exam} · {SITTING.subject}
        </span>
        <span className="rounded-[10px] bg-paper-mist px-3 py-1.5 text-[19px] text-fog">{SITTING.level}</span>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-5">
        {SITTING.metrics.map((metric, i) => (
          <div key={metric.label} className="rounded-[18px] border border-ash p-6">
            <span className="flex items-center gap-2 text-[20px] text-fog">
              <span className="size-3 rounded-full" style={{ background: metric.color }} />
              {metric.label}
            </span>
            <span className="mt-3 flex items-baseline gap-2">
              <Roll frame={f} at={at + i * 4} from={metric.from} to={metric.to} className="font-satoshi text-[64px] font-medium leading-none" />
              {metric.unit ? <span className="text-[22px] text-fog">{metric.unit}</span> : null}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-9">
        <div className="h-4 overflow-hidden rounded-full bg-paper-mist">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#2563eb)]" style={{ width: `${fill}%` }} />
        </div>
        <div className="absolute -top-2 h-8 w-[3px] rounded-full bg-charcoal" style={{ left: `${SITTING.passMark * 100}%` }} />
        <div className="mt-4 flex justify-between text-[19px] text-fog">
          <span style={{ marginLeft: `calc(${SITTING.passMark * 100}% - 70px)` }}>Próg zdania 30%</span>
          <span className="font-medium text-charcoal">{Math.round(fill)}%</span>
        </div>
      </div>
    </Card>
  );
}

/** Readiness through the school year — PLACEHOLDER figures, the same learner /progress shows. */
const READINESS = [0.18, 0.22, 0.21, 0.3, 0.34, 0.33, 0.41, 0.46, 0.44, 0.52, 0.57, 0.55, 0.62, 0.66, 0.64, 0.72];
const MONTHS = ["wrz", "paź", "lis", "gru", "sty", "lut", "mar", "kwi"];
const TABS = [
  { label: "Zadania", from: "  0", to: "720", unit: "" },
  { label: "Poprawne", from: "  0", to: "550", unit: "" },
  { label: "Czas nauki", from: "   0", to: "2148", unit: "min" },
];

/** The progress chart: three tabs rolling up, the readiness line drawing from `at`, a tooltip pinned at the end. */
export function ChartCard({ f, at = 0, tipAt = Infinity, className, style }: { f: number; at?: number; tipAt?: number; className?: string; style?: React.CSSProperties }) {
  const tip = ramp(f, tipAt, 12);
  return (
    <Card className={cn("w-[1280px] overflow-hidden", className)} style={style}>
      <div className="grid grid-cols-3 border-b border-ash">
        {TABS.map((tab, i) => (
          <div key={tab.label} className={cn("px-9 py-7", i > 0 && "border-l border-ash", i === 0 && "relative")}>
            <span className="text-[20px] text-fog">{tab.label}</span>
            <span className="mt-2 flex items-baseline gap-2">
              <Roll frame={f} at={at + 6 + i * 5} from={tab.from} to={tab.to} className="font-satoshi text-[54px] font-medium leading-none" />
              {tab.unit ? <span className="text-[20px] text-fog">{tab.unit}</span> : null}
            </span>
            {i === 0 ? <span className="absolute inset-x-0 bottom-0 h-[3px] bg-charcoal" /> : null}
          </div>
        ))}
      </div>
      <div className="relative px-9 pb-8 pt-10">
        {/* Drawn at half size and scaled, so the line is as heavy as the product's at film size */}
        <div className="h-[300px] w-[1200px]">
          <div className="origin-top-left scale-[2]">
            <AreaChart values={READINESS} width={600} height={150} color="#2563eb" draw={ramp(f, at + 10, 70)} id="launch-readiness" />
          </div>
        </div>
        <div className="mt-4 flex justify-between text-[18px] text-silver">
          {MONTHS.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        <div
          className="absolute right-[36px] top-[22px] rounded-[14px] border border-ash bg-white px-5 py-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.2)]"
          style={{ opacity: tip, transform: `translateY(${(1 - tip) * 10}px)` }}
        >
          <span className="block text-[18px] text-fog">Kwiecień</span>
          <span className="mt-1 flex items-center gap-2 text-[22px] font-medium">
            <span className="size-3 rounded-full bg-electric-blue" />
            Gotowość 72%
          </span>
        </div>
        <span
          className="absolute size-5 rounded-full border-[3px] border-electric-blue bg-white"
          style={{ left: 36 + 1200 - 10, top: 40 + (1 - 0.72) * 300 - 10, opacity: tip }}
        />
      </div>
    </Card>
  );
}

/** One chat bubble: the learner's on the right in ink, the tutor's on the left on paper. */
export function Bubble({ from, children, style, className }: { from: "learner" | "tutor"; children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={cn("flex", from === "learner" ? "justify-end" : "justify-start", className)} style={style}>
      {from === "tutor" ? (
        <span className="mr-4 mt-1 grid size-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ede9fe,#dbeafe)] text-lavender">
          <Sparkles className="size-6" strokeWidth={2} />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[720px] rounded-[22px] px-7 py-5 text-[26px] leading-[1.45]",
          from === "learner" ? "rounded-br-[8px] bg-charcoal text-white" : "rounded-tl-[8px] border border-ash bg-canvas-muted text-charcoal",
        )}
      >
        {children}
      </div>
    </div>
  );
}
