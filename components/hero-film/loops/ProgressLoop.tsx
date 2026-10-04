"use client";

import { AbsoluteFill, interpolate } from "@/components/hero-film/anim";
import {
  BarChart3,
  CalendarDays,
  ChartLine,
  ChevronRight,
  CircleCheck,
  EllipsisVertical,
  Filter,
  ListFilter,
  MousePointerClick,
  Settings,
} from "lucide-react";
import { useFrame } from "@/components/hero-film/frame";
import { EASE, enter, pageOpacity, ramp } from "@/components/hero-film/motion";
import { s } from "@/components/hero-film/timeline";
import { AreaChart, CONTENT_W, CONTENT_X, CONTENT_Y, Chip, Cursor, Funnel, Page, Shell, Sparkline } from "@/components/hero-film/kit";
import { PROGRESS, appNav } from "@/components/hero-film/demoData";
import { cn } from "@/lib/cn";

/**
 * Śledzenie postępów — the reference's Conversion Analytics loop, beat for
 * beat.
 *
 *   0.0  Postępy arrives and the tasks curve draws
 *   2.6  the cursor comes in and scrubs the chart; the tooltip follows it
 *   4.6  click "Opanowane" → the metric underline moves, the curve redraws teal
 *   6.4  click the funnel view → the three stages grow left to right
 *   8.4  click "Przełącz na aktywność" → Aktywność: sparkline cards and the
 *        event log
 */
const T = {
  scrubFrom: s(3.1),
  scrubTo: s(3.9),
  metric: s(4.6),
  funnel: s(6.4),
  switch: s(8.4),
  events: s(8.6),
  back: s(11.5),
};

/* Geometry of the metrics card, in composition pixels. */
const CARD_Y = CONTENT_Y + 44;
const CARD_W = CONTENT_W;
const PLOT_X = CONTENT_X + 18 + 34;
const PLOT_W = CARD_W - 36 - 34 - 12;
const PLOT_H = 250;
const PLOT_Y = CARD_Y + 84 + 34;

export function ProgressLoop() {
  const frame = useFrame();
  const onEvents = frame >= T.events && frame < T.back;
  const active = onEvents ? "Aktywność" : "Postępy";

  const metricTarget = { x: CONTENT_X + 600 + 70, y: CARD_Y + 30 };
  const funnelToggle = { x: CONTENT_X + CARD_W - 30, y: CARD_Y + 84 + 18 };
  const switchChip = { x: CONTENT_X + CARD_W - 110, y: CONTENT_Y + 14 };
  const scrubY = PLOT_Y + PLOT_H * 0.45;

  return (
    <AbsoluteFill>
      <Shell nav={appNav()} active={active} title={active} titleKey={active}>
        <Analytics frame={frame} opacity={pageOpacity(frame, 0, T.events)} />
        <Events frame={frame - T.events} opacity={pageOpacity(frame, T.events, T.back)} />
      </Shell>
      <Cursor
        keys={[
          { at: s(2.6), x: 1060, y: 580 },
          { at: T.scrubFrom, x: PLOT_X + PLOT_W * 0.52, y: scrubY },
          { at: T.scrubTo, x: PLOT_X + PLOT_W * 0.66, y: scrubY - 10 },
          { at: s(4.3), x: metricTarget.x, y: metricTarget.y },
          { at: T.metric, x: metricTarget.x, y: metricTarget.y, click: true },
          { at: s(6.0), x: funnelToggle.x, y: funnelToggle.y },
          { at: T.funnel, x: funnelToggle.x, y: funnelToggle.y, click: true },
          { at: s(8.0), x: switchChip.x, y: switchChip.y },
          { at: T.switch, x: switchChip.x, y: switchChip.y, click: true },
          { at: s(9.6), x: 760, y: 420 },
        ]}
      />
    </AbsoluteFill>
  );
}

/* Postępy ----------------------------------------------------------------- */

function Analytics({ frame, opacity }: { frame: number; opacity: number }) {
  const f = frame;
  const metric = ramp(f, T.metric, 12); // 0 = Zadania, 1 = Opanowane
  const funnel = ramp(f, T.funnel, 10);
  const blueDraw = ramp(f, 14, 40);
  // The new curve starts drawing on the click itself, so it overlaps the old
  // one's fade and the chart never reads as empty.
  const tealDraw = ramp(f, T.metric, 26);

  // The scrub: the cursor's x across the plot, and the point under it.
  const scrub = interpolate(f, [T.scrubFrom - 22, T.scrubFrom, T.scrubTo, T.scrubTo + 8], [0.52, 0.52, 0.66, 0.66], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showTip = interpolate(f, [T.scrubFrom - 6, T.scrubFrom, s(4.2), s(4.4)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const values = PROGRESS.tasksCurve;
  const idx = Math.round(scrub * (values.length - 1));
  const tipValue = Math.round(values[idx] * 400);

  return (
    <Page opacity={opacity}>
      <div className="flex items-center justify-between" style={enter(f, 3)}>
        <div className="flex gap-2">
          <Chip icon={ListFilter} caret>
            Filtr
          </Chip>
          <Chip icon={CalendarDays} caret>
            Ostatnie 30 dni
          </Chip>
        </div>
        <div className="flex gap-2">
          <Chip icon={MousePointerClick} pressed={f >= T.switch && f < T.switch + 6}>
            Przełącz na aktywność
          </Chip>
          <Chip className="w-[28px] justify-center px-0">
            <EllipsisVertical className="size-[13px] text-slate" strokeWidth={1.75} />
          </Chip>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[12px] border border-ash" style={{ width: CARD_W, ...enter(f, 6) }}>
        {/* Metric tabs */}
        <div className="relative grid h-[84px] grid-cols-3 border-b border-ash">
          {PROGRESS.metrics.map((m, i) => (
            <div key={m.label} className={cn("relative px-6 pt-5", i > 0 && "border-l border-ash")}>
              {i > 0 && (
                <span className="absolute -left-[9px] top-[34px] grid size-[18px] place-items-center rounded-full border border-ash bg-white">
                  <ChevronRight className="size-[10px] text-fog" strokeWidth={2} />
                </span>
              )}
              <p className="flex items-center gap-1.5 text-[11.5px] leading-none text-fog">
                <span className="size-[7px] rounded-[2px]" style={{ backgroundColor: m.color }} />
                {m.label}
              </p>
              <p className="mt-2.5 text-[22px] font-medium leading-none tracking-[-0.01em] text-charcoal">{m.value}</p>
            </div>
          ))}
          <span className="absolute right-4 top-4 flex h-[22px] items-center rounded-[6px] bg-paper-mist p-[2px] text-[9.5px] font-medium">
            <span className="grid h-full place-items-center rounded-[4px] bg-white px-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.06)]">123</span>
            <span className="grid h-full place-items-center px-1.5 text-fog">%</span>
          </span>
          {/* Active underline, travelling from Zadania to Opanowane */}
          <span className="absolute bottom-[-1px] h-[2px] bg-charcoal" style={{ width: CARD_W / 3, left: (metric * 2 * CARD_W) / 3 }} />
        </div>

        {/* Chart */}
        <div className="relative h-[330px]">
          <span className="absolute right-4 top-3.5 flex gap-1">
            <span className={cn("grid size-[24px] place-items-center rounded-[6px] border", funnel < 0.5 ? "border-ash bg-paper-mist" : "border-transparent")}>
              <ChartLine className="size-[12px] text-slate" strokeWidth={1.75} />
            </span>
            <span className={cn("grid size-[24px] place-items-center rounded-[6px] border", funnel >= 0.5 ? "border-ash bg-paper-mist" : "border-transparent")}>
              <Filter className="size-[12px] text-slate" strokeWidth={1.75} />
            </span>
          </span>

          {/* Line view */}
          <div className="absolute inset-0" style={{ opacity: 1 - funnel }}>
            <div className="absolute left-[18px] flex flex-col justify-between text-right text-[9.5px] leading-none text-silver" style={{ top: 34, height: PLOT_H + 4, width: 26 }}>
              {PROGRESS.axis.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            <div className="absolute" style={{ left: 52, top: 34, width: PLOT_W, height: PLOT_H }}>
              {[0, 0.5, 1].map((p) => (
                <div key={p} className="absolute inset-x-0 border-t border-dashed border-ash" style={{ top: p * PLOT_H }} />
              ))}
              <div className="absolute inset-0" style={{ opacity: 1 - metric }}>
                <AreaChart id="pg-a" values={[...PROGRESS.tasksCurve]} width={PLOT_W} height={PLOT_H} color="#3b82f6" draw={blueDraw} />
              </div>
              <div className="absolute inset-0" style={{ opacity: metric }}>
                <AreaChart id="pg-b" values={[...PROGRESS.masteredCurve]} width={PLOT_W} height={PLOT_H} color="#14b8a6" draw={tealDraw} />
              </div>

              {/* Scrub line and tooltip */}
              {showTip > 0 && (
                <div className="absolute inset-y-0" style={{ left: scrub * PLOT_W, opacity: showTip }}>
                  <div className="absolute inset-y-0 w-px bg-charcoal" />
                  <div className="absolute left-2 top-[46px] w-[120px] rounded-[8px] border border-ash bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                    <p className="border-b border-ash px-2.5 py-2 text-[11px] font-medium leading-none text-charcoal">{idx + 3} mar</p>
                    <p className="flex items-center justify-between px-2.5 py-2 text-[10px] leading-none text-fog">
                      <span className="flex items-center gap-1.5">
                        <span className="size-[6px] rounded-[2px] bg-[#60a5fa]" />
                        Zadania
                      </span>
                      <span className="font-medium tabular-nums text-charcoal">{tipValue}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute flex justify-between text-[9.5px] leading-none text-silver" style={{ left: 52, top: 34 + PLOT_H + 12, width: PLOT_W }}>
              {PROGRESS.ticks.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
          </div>

          {/* Funnel view */}
          {funnel > 0 && (
            <div className="absolute inset-0" style={{ opacity: funnel }}>
              {[1, 2].map((i) => (
                <div key={i} className="absolute inset-y-0 w-px bg-ash" style={{ left: (CARD_W / 3) * i }} />
              ))}
              <div className="absolute inset-x-0 top-[30px]">
                <Funnel id="pg-f" width={CARD_W - 2} height={270} stages={[...PROGRESS.funnel]} reveal={ramp(f, T.funnel + 2, 34)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

/* Aktywność --------------------------------------------------------------- */

function Events({ frame, opacity }: { frame: number; opacity: number }) {
  const f = frame;
  return (
    <Page opacity={opacity}>
      <div className="flex items-center justify-between" style={enter(f, 2)}>
        <div className="flex gap-2">
          <Chip icon={ListFilter} caret>
            Filtr
          </Chip>
          <Chip icon={CalendarDays} caret>
            Ostatnie 30 dni
          </Chip>
        </div>
        <div className="flex gap-2">
          <Chip icon={BarChart3}>Przełącz na postępy</Chip>
          <Chip className="w-[28px] justify-center px-0">
            <EllipsisVertical className="size-[13px] text-slate" strokeWidth={1.75} />
          </Chip>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {PROGRESS.metrics.map((m, i) => (
          <div
            key={m.label}
            className={cn("flex h-[76px] items-center justify-between rounded-[12px] px-4", i === 0 ? "border-2 border-charcoal" : "border border-ash")}
            style={enter(f, 4 + i * 2)}
          >
            <div>
              <p className="text-[11.5px] leading-none text-fog">{m.label}</p>
              <p className="mt-2.5 text-[20px] font-medium leading-none text-charcoal">{m.value}</p>
            </div>
            <Sparkline id={`sp${i}`} values={[...PROGRESS.sparks[i]]} width={110} height={34} draw={ramp(f, 8 + i * 2, 30)} />
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-[12px] border border-ash" style={enter(f, 8)}>
        <div className="grid h-[32px] grid-cols-[1.1fr_1.1fr_1fr_0.9fr_0.6fr_1fr_24px] items-center border-b border-ash px-3.5 text-[11px] font-medium leading-none text-charcoal">
          <span>Data</span>
          <span>Zdarzenie</span>
          <span>Temat</span>
          <span>Przedmiot</span>
          <span>Wynik</span>
          <span>Źródło</span>
          <Settings className="size-[12px] text-slate" strokeWidth={1.75} />
        </div>
        {PROGRESS.events.map((row, i) => (
          <div
            key={row.date}
            className="grid h-[31px] grid-cols-[1.1fr_1.1fr_1fr_0.9fr_0.6fr_1fr_24px] items-center border-b border-ash/70 px-3.5 text-[11px] leading-none text-charcoal last:border-b-0"
            style={enter(f, 10 + i * 1.2, { offset: 4 })}
          >
            <span className="text-steel">{row.date}</span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="size-[12px] text-slate" strokeWidth={1.75} />
              Zadanie rozwiązane
            </span>
            <span>{row.topic}</span>
            <span className="text-steel">{row.subject}</span>
            <span className="tabular-nums">{row.score}</span>
            <span className="text-steel">{row.source}</span>
            <span className="text-silver">···</span>
          </div>
        ))}
      </div>
    </Page>
  );
}
