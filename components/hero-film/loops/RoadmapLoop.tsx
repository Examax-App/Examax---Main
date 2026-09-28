"use client";

import { AbsoluteFill } from "remotion";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  ListFilter,
  NotebookText,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Unlock,
} from "lucide-react";
import { useFrame } from "@/components/hero-film/frame";
import { enter, pageOpacity, ramp } from "@/components/hero-film/motion";
import { s } from "@/components/hero-film/timeline";
import {
  AreaChart,
  CONTENT_X,
  CONTENT_Y,
  Chip,
  Cursor,
  Page,
  PrimaryButton,
  Roll,
  Shell,
  StatusFlip,
  StatusPill,
  hovering,
  navPoint,
} from "@/components/hero-film/kit";
import { ROADMAP, appNav } from "@/components/hero-film/demoData";

/**
 * Roadmapa — the reference's Partner Program loop, beat for beat.
 *
 *   0.0  Roadmapa arrives: date range, the mastery chart drawing, today's tasks
 *   2.4  the cursor comes in and settles on "Powtórz błędne zadania"
 *   3.4  click → Powtórki: the review queue and the topic table
 *   5.9  click "Powtórz wszystkie" → the four topics flip to Opanowane, the
 *        scores and counters roll, the sidebar badge counts down
 *   8.4  back to Roadmapa; the page clears and the loop begins again
 */
const T = {
  click1: s(3.4),
  powtorki: s(3.6),
  click2: s(5.9),
  flip: s(6.1),
  click3: s(8.6),
  back: s(8.8),
};

const TASK_ICONS = [RefreshCcw, NotebookText, Unlock];
const SHORTCUT_ICONS = [FileText, CalendarDays, TrendingUp];

export function RoadmapLoop() {
  const frame = useFrame();
  const onReview = frame >= T.powtorki && frame < T.back;
  const reviewed = frame >= T.flip + 4 * 4 + 6;
  const nav = appNav(reviewed ? 0 : ROADMAP.review.pending);
  const active = onReview ? "Powtórki" : "Roadmapa";

  const taskRow = { x: CONTENT_X + 596 + 90, y: CONTENT_Y + 44 + 58 };
  const reviewButton = { x: CONTENT_X + 380, y: CONTENT_Y + 30 };
  const overview = navPoint(nav, "Roadmapa");

  return (
    <AbsoluteFill>
      <Shell
        nav={nav}
        active={active}
        title={active}
        titleKey={active}
      >
        <Overview frame={frame} opacity={pageOpacity(frame, 0, T.powtorki)} taskHover={hovering(frame, s(3.0), T.click1)} />
        <Review frame={frame - T.powtorki} opacity={pageOpacity(frame, T.powtorki, T.back)} flip={T.flip - T.powtorki} pressed={frame >= T.click2 && frame < T.click2 + 6} />
      </Shell>
      <Cursor
        keys={[
          { at: s(2.4), x: 1040, y: 560 },
          { at: s(3.1), x: taskRow.x, y: taskRow.y },
          { at: T.click1, x: taskRow.x, y: taskRow.y, click: true },
          { at: s(5.4), x: reviewButton.x, y: reviewButton.y },
          { at: T.click2, x: reviewButton.x, y: reviewButton.y, click: true },
          { at: s(8.1), x: overview.x, y: overview.y },
          { at: T.click3, x: overview.x, y: overview.y, click: true },
        ]}
      />
    </AbsoluteFill>
  );
}

/* Roadmapa (overview) ----------------------------------------------------- */

function Overview({ frame, opacity, taskHover }: { frame: number; opacity: number; taskHover: number }) {
  // After the loop comes back, the overview restarts from empty — the
  // frames here are loop-absolute, so the stagger replays each lap.
  const f = frame;
  return (
    <Page opacity={opacity}>
      <div style={enter(f, 3)}>
        <Chip icon={CalendarDays} caret>
          Ostatnie 30 dni
        </Chip>
      </div>

      <div className="mt-4 grid grid-cols-[580px_1fr] gap-4">
        {/* Mastery card */}
        <div className="h-[296px] rounded-[12px] border border-ash p-[18px]" style={enter(f, 7)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-1 text-[12px] leading-none text-fog">
                {ROADMAP.mastery.label}
                <ChevronDown className="size-3" strokeWidth={1.75} />
              </p>
              <p className="mt-2 text-[24px] font-medium leading-none tracking-[-0.01em] text-charcoal">
                {ROADMAP.mastery.value}
              </p>
            </div>
            <Chip>Pokaż wszystko</Chip>
          </div>
          <div className="mt-5 flex gap-3">
            <div className="flex h-[176px] flex-col justify-between pb-[2px] text-right text-[9.5px] leading-none text-silver">
              {["100%", "75%", "50%", "25%", "0%"].map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            <div className="relative h-[176px] flex-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="absolute inset-x-0 border-t border-dashed border-ash" style={{ top: `${i * 25}%` }} />
              ))}
              <div className="absolute inset-x-0 top-[6px]">
                <AreaChart id="rm" values={[...ROADMAP.curve]} width={484} height={164} color="#2563eb" draw={ramp(f, 12, 42)} />
              </div>
            </div>
          </div>
          <div className="ml-[42px] mt-2 flex justify-between text-[9.5px] leading-none text-silver">
            <span>{ROADMAP.range[0]}</span>
            <span>{ROADMAP.range[1]}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Today */}
          <div className="rounded-[12px] border border-ash px-[14px] pb-[8px] pt-[14px]" style={enter(f, 10)}>
            <p className="text-[12px] font-medium leading-none text-charcoal">Na dziś</p>
            <ul className="mt-2">
              {ROADMAP.today.map((task, i) => {
                const Icon = TASK_ICONS[i];
                return (
                  <li
                    key={task.label}
                    className="-mx-1.5 flex h-[38px] items-center gap-2.5 rounded-[8px] px-1.5 text-[11.5px] text-charcoal"
                    style={{ backgroundColor: i === 0 ? `rgba(0,0,0,${0.035 * taskHover})` : undefined }}
                  >
                    <Icon className="size-[13px] text-slate" strokeWidth={1.75} />
                    {task.label}
                    <span className="ml-auto grid h-[22px] min-w-[22px] place-items-center rounded-[6px] bg-[#eff6ff] px-1.5 text-[10.5px] font-medium tabular-nums text-[#1d63d8]">
                      {task.count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Shortcuts */}
          <div className="rounded-[12px] border border-ash px-[14px] pb-[10px] pt-[14px]" style={enter(f, 13)}>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium leading-none text-charcoal">Skróty</p>
              <Chip icon={Sparkles}>Dostosuj</Chip>
            </div>
            <ul className="mt-1.5 space-y-1">
              {ROADMAP.shortcuts.map((item, i) => {
                const Icon = SHORTCUT_ICONS[i];
                return (
                  <li key={item.label} className="flex h-[40px] items-center gap-2.5">
                    <span className="grid size-[28px] place-items-center rounded-[7px] border border-ash">
                      <Icon className="size-[13px] text-slate" strokeWidth={1.75} />
                    </span>
                    <span className="leading-none">
                      <span className="block text-[11.5px] font-medium text-charcoal">{item.label}</span>
                      <span className="mt-1 block text-[10px] text-silver">{item.meta}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Lower cards, cut by the window's bottom edge as in the reference */}
      <div className="mt-4 grid grid-cols-3 gap-4" style={enter(f, 16)}>
        {["Najmocniejsze tematy", "Źródła zadań", "Ostatnie sesje"].map((heading) => (
          <div key={heading} className="h-[140px] rounded-[12px] border border-ash px-[14px] pt-[14px]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium leading-none text-charcoal">{heading}</p>
              <Chip>Pokaż</Chip>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* Powtórki ---------------------------------------------------------------- */

function Review({ frame, opacity, flip, pressed }: { frame: number; opacity: number; flip: number; pressed: boolean }) {
  const f = frame;
  const pendingIndex = (i: number) => ROADMAP.topics.slice(0, i).filter((t) => t.status === "pending").length;
  return (
    <Page opacity={opacity}>
      {/* Queue summary, the reference's pending / paid pair */}
      <div className="grid grid-cols-2 overflow-hidden rounded-[12px] border border-ash bg-canvas-muted" style={enter(f, 2)}>
        <div className="flex items-start justify-between border-r border-ash px-4 py-3.5">
          <div>
            <p className="text-[11px] leading-none text-fog">Do powtórki</p>
            <p className="mt-2 text-[19px] font-medium leading-none text-charcoal">
              <Roll frame={f} at={flip} from={String(ROADMAP.review.pending)} to="0" />{" "}
              {f >= flip + 8 ? "tematów" : "tematy"}
            </p>
          </div>
          <PrimaryButton pressed={pressed}>Powtórz wszystkie</PrimaryButton>
        </div>
        <div className="flex items-start justify-between px-4 py-3.5">
          <div>
            <p className="text-[11px] leading-none text-fog">Opanowane</p>
            <p className="mt-2 text-[19px] font-medium leading-none text-charcoal">
              <Roll frame={f} at={flip + 10} from={ROADMAP.review.mastered.from} to={ROADMAP.review.mastered.to} /> tematów
            </p>
          </div>
          <Chip>Raport</Chip>
        </div>
      </div>

      <div className="mt-4" style={enter(f, 4)}>
        <Chip icon={ListFilter} caret>
          Filtr
        </Chip>
      </div>

      <div className="mt-3.5 overflow-hidden rounded-[12px] border border-ash" style={enter(f, 6)}>
        <div className="grid h-[32px] grid-cols-[1.6fr_1fr_1fr_0.8fr_0.6fr] items-center border-b border-ash px-3.5 text-[11px] font-medium leading-none text-charcoal">
          <span>Temat</span>
          <span>Dział</span>
          <span>Status</span>
          <span>Ostatnio</span>
          <span className="text-right">Wynik</span>
        </div>
        {ROADMAP.topics.map((row, i) => {
          const pending = row.status === "pending";
          const k = pendingIndex(i);
          const at = flip + k * 4;
          return (
            <div
              key={row.topic}
              className="grid h-[34px] grid-cols-[1.6fr_1fr_1fr_0.8fr_0.6fr] items-center border-b border-ash/70 px-3.5 text-[11px] leading-none text-charcoal last:border-b-0"
              style={enter(f, 7 + i * 1.5, { offset: 4 })}
            >
              <span className="font-medium">{row.topic}</span>
              <span className="text-steel">{row.unit}</span>
              <span>
                {pending ? <StatusFlip frame={f} flipAt={at} from="pending" to="done" /> : <StatusPill status="done" />}
              </span>
              <span className="text-silver">{pending && f >= at ? "Dzisiaj" : pending ? "3 dni temu" : "Tydzień temu"}</span>
              <span className="text-right tabular-nums">
                {pending ? <Roll frame={f} at={at + 2} from={row.score} to={ROADMAP.reviewed[k]} /> : row.score}
              </span>
            </div>
          );
        })}
      </div>
    </Page>
  );
}
