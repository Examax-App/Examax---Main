"use client";

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import type { PlayerRef } from "@remotion/player";
import {
  BadgePercent,
  Calculator,
  Check,
  ChevronLeft,
  CircleCheck,
  FastForward,
  FileCheck,
  Flag,
  ListChecks,
  NotebookPen,
  PencilLine,
  Route,
  Send,
  SquareFunction,
  Timer,
  Zap,
} from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { accentStyles } from "@/components/ui/FeaturePill";
import { AbsoluteFill, interpolate } from "@/components/hero-film/anim";
import { FrameAt, useFrame } from "@/components/hero-film/frame";
import { Chip, Cursor, NavHeading, NavRow, PrimaryButton, Shell, StatusPill, hovering, type CursorKey, type NavGroup } from "@/components/hero-film/kit";
import { appNav } from "@/components/hero-film/demoData";
import { ramp, tween } from "@/components/hero-film/motion";
import { Frac, Radical, Tall, V } from "@/components/simulation/math";
import { SITTING } from "@/components/simulation/sitting";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/*
 * /simulation's walkthrough — one Remotion film of a whole simulation in the
 * product, from the library to the report, built from the hero film's own
 * kit (shell, sidebar rows, chips, buttons, status pills, cursor, easing) so
 * it is the same application the landing shows.
 *
 * The landing's `#exam` film is the close-up (the pen on Zadanie 10). This
 * one is the journey, in five chapters the strip under it can jump between:
 *
 *   Wybór arkusza  the Symulacje library → Matura 2025 → its rules → start, 3·2·1
 *   Arkusz         Zadania 1–4 worked by hand (B, B, A, C) → fast-forward
 *                  through every other task's real page, closed ones marked
 *                  with the official key, open ones written, Zadanie 10
 *                  flagged → Zadanie 21 (F, P) → "Zakończ egzamin"
 *   Oddanie        the hand-in summary → "Oddaj arkusz"
 *   Sprawdzanie    the rubric marked line by line, the score rolling to 42/50
 *   Raport         score, percent, time and the margin over 30%; where the
 *                  seven points went; Korepetytor AI's next step → roadmap
 *
 * The tasks are CKE's own (MMAP-P0_100, May 2025), as in the landing film:
 * Zadanie 1, (√32 − √2)² = 18 → B; Zadanie 21, F then P. The sitting is the
 * shared fixture — handed in 141 minutes in, 42 of 50 points.
 * PLACEHOLDER DATA — the learner's earlier sittings and the topic split are illustrative.
 */

const FPS = 60;
const WIDTH = 1200;
const HEIGHT = 640;
const s = (seconds: number) => Math.round(seconds * FPS);

/**
 * Zadania 1–4, worked one by one: the answer clicked, then "Następne
 * zadanie". `correct` is the official key's answer (A = 0): B, B, A, C.
 */
const BY_HAND = [
  { task: 1, correct: 1, pick: s(8.7), next: s(9.3) },
  { task: 2, correct: 1, pick: s(10.4), next: s(11.0) },
  { task: 3, correct: 0, pick: s(12.1), next: s(12.7) },
  { task: 4, correct: 2, pick: s(13.8), next: s(14.4) },
];

/** The film's beats, in frames. */
const T = {
  pickCard: s(2.0),
  modal: s(2.15),
  start: s(5.0),
  countdown: s(5.15),
  exam: s(7.5),
  lapse: s(14.6),
  lapseEnd: s(22.4),
  pickF: s(23.5),
  pickP: s(24.5),
  finish: s(25.4),
  handIn: s(25.55),
  submit: s(28.6),
  check: s(29.6),
  report: s(36.2),
  hoverTopic: s(38.8),
  addToPlan: s(42.4),
  fade: s(48.8),
};
const LOOP = s(50.2);

export const CHAPTERS = [
  { label: "Wybór arkusza", icon: ListChecks, from: 0 },
  { label: "Arkusz", icon: PencilLine, from: T.exam },
  { label: "Oddanie", icon: Send, from: T.finish - s(0.8) },
  { label: "Sprawdzanie", icon: FileCheck, from: T.check },
  { label: "Raport", icon: BadgePercent, from: T.report },
] as const;

/* ── Geometry: the main panel's content area, in composition pixels ─────── */

/** Top-left of the main panel's content area, under the 46px page header. */
const AREA = { x: 239, y: 53 };
const at = (x: number, y: number) => ({ x: AREA.x + x, y: AREA.y + y });

/** The library's first card, the modal's start button. */
const CARD = { x: 30, y: 58, w: 285, h: 140, gap: 16 };
const MODAL = { x: 390, y: 165, w: 420, h: 292 };
const START_BUTTON = { x: MODAL.x + MODAL.w - 22 - 62, y: MODAL.y + MODAL.h - 22 - 14 };

/** The sheet card, its answer boxes and P/F table. */
const SHEET = { x: 30, y: 18, w: 600, h: 540 };
const OPTION = { x: 18, y: 156, w: 133, h: 42, gap: 10 };
const TABLE = { y: 196, row: 46, cell: 58 };
const NEXT_BUTTON = at(SHEET.x + SHEET.w - 18 - 66, SHEET.y + SHEET.h - 18 - 14);
/** The header's "Zakończ egzamin" — measured off the landing film's render, same header. */
const FINISH = { x: 1101, y: 30 };
const HAND_IN = { x: 390, y: 185, w: 420, h: 254 };
const SUBMIT_BUTTON = { x: HAND_IN.x + HAND_IN.w - 22 - 50, y: HAND_IN.y + HAND_IN.h - 22 - 14 };

/** The report's lost-points rows and its "Dodaj do roadmapy". */
const LOST_CARD = { x: 30, y: 180, w: 430 };
const NEXT_CARD = { x: 476, y: 180, w: 448, h: 318 };
const ADD_BUTTON = at(NEXT_CARD.x + 20 + 70, NEXT_CARD.y + NEXT_CARD.h - 20 - 14);

/* ── The sheet's clock ───────────────────────────────────────────────────── */

const EXAM_SECONDS = SITTING.examMinutes * 60;
/** Handed in with 39 minutes left: 141 used. */
const LEFT_AT_FINISH = (SITTING.examMinutes - SITTING.minutes) * 60;

function secondsLeft(frame: number) {
  if (frame < T.lapse) return EXAM_SECONDS - Math.max(0, (frame - T.exam) / FPS);
  const lapseStart = EXAM_SECONDS - (T.lapse - T.exam) / FPS;
  const lapseEnd = LEFT_AT_FINISH + (T.finish - T.lapseEnd) / FPS;
  if (frame < T.lapseEnd) return tween(frame, T.lapse, T.lapseEnd - T.lapse, lapseStart, lapseEnd);
  return Math.max(LEFT_AT_FINISH, lapseEnd - (frame - T.lapseEnd) / FPS);
}

function clock(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/* ── Who answers what, and when ──────────────────────────────────────────── */

/** Every task after the four worked by hand, but 21, answered while the film fast-forwards. */
const LAPSE_ORDER = Array.from({ length: SITTING.tasks }, (_, i) => i + 1).filter((task) => task > 4 && task !== 21);
const LAPSE_SLOT = (T.lapseEnd - T.lapse) / LAPSE_ORDER.length;
/** A fast-forwarded task's page arrives at its slot's start and is answered just past half-way. */
const lapseFrom = (index: number) => T.lapse + Math.round(index * LAPSE_SLOT);
const lapseAt = (index: number) => lapseFrom(index) + Math.round(LAPSE_SLOT * 0.55);

function answeredAt(task: number) {
  const byHand = BY_HAND.find((item) => item.task === task);
  if (byHand) return byHand.pick + 2;
  if (task === 21) return T.pickP + 2;
  return lapseAt(LAPSE_ORDER.indexOf(task));
}
const FLAGGED = 10;

/** The task on the page: 1–4 one after another, then whichever the fast-forward is on, then 21. */
function taskOnPage(frame: number) {
  for (const item of BY_HAND) if (frame < item.next + 6) return item.task;
  if (frame >= T.lapseEnd) return 21;
  const index = Math.min(LAPSE_ORDER.length - 1, Math.floor((frame - T.lapse) / LAPSE_SLOT));
  return LAPSE_ORDER[Math.max(0, index)];
}

/* ── Cursor ──────────────────────────────────────────────────────────────── */

const optionAt = (index: number) =>
  at(SHEET.x + OPTION.x + index * (OPTION.w + OPTION.gap) + OPTION.w / 2, SHEET.y + OPTION.y + OPTION.h / 2);
const tableCell = (row: number, letter: "P" | "F") =>
  at(SHEET.x + SHEET.w - 18 - (letter === "F" ? TABLE.cell / 2 : TABLE.cell * 1.5), SHEET.y + TABLE.y + TABLE.row * row + TABLE.row / 2);
const lostRow = (index: number) => at(LOST_CARD.x + 160, LOST_CARD.y + 64 + index * 44 + 18);

const KEYS: CursorKey[] = [
  { at: s(0.7), x: 980, y: 520 },
  { at: s(1.7), ...at(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2) },
  { at: T.pickCard, ...at(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2), click: true },
  { at: s(3.6), x: MODAL.x + 210, y: MODAL.y + 210 },
  { at: s(4.6), ...START_BUTTON },
  { at: T.start, ...START_BUTTON, click: true },
  { at: s(8.0), x: 700, y: 330 },
  // Zadania 1–4: read, pick, next
  ...BY_HAND.flatMap(({ correct, pick, next }) => {
    const option = optionAt(correct);
    return [
      { at: pick - 4, ...option },
      { at: pick, ...option, click: true },
      { at: next - 4, ...NEXT_BUTTON },
      { at: next, ...NEXT_BUTTON, click: true },
    ];
  }),
  { at: s(15.2), x: 900, y: 470 },
  { at: s(22.6), x: 860, y: 360 },
  { at: T.pickF - 4, ...tableCell(0, "F") },
  { at: T.pickF, ...tableCell(0, "F"), click: true },
  { at: T.pickP - 4, ...tableCell(1, "P") },
  { at: T.pickP, ...tableCell(1, "P"), click: true },
  { at: T.finish - 4, ...FINISH },
  { at: T.finish, ...FINISH, click: true },
  { at: T.handIn + s(1.2), x: HAND_IN.x + 200, y: HAND_IN.y + 150 },
  { at: T.submit - 4, ...SUBMIT_BUTTON },
  { at: T.submit, ...SUBMIT_BUTTON, click: true },
  { at: T.check + s(1), x: 940, y: 470 },
  { at: T.report + s(1.4), x: 560, y: 120 },
  { at: T.hoverTopic, ...lostRow(0) },
  { at: T.hoverTopic + s(1.6), ...lostRow(1) },
  { at: T.addToPlan - 4, ...ADD_BUTTON },
  { at: T.addToPlan, ...ADD_BUTTON, click: true },
  { at: T.addToPlan + s(2.3), x: 980, y: 300 },
  { at: T.fade - s(1.2), x: 1000, y: 320 },
];

/* ── Sidebars ────────────────────────────────────────────────────────────── */

/** The app's own sidebar, with Symulacje in it. */
const NAV: NavGroup[] = (() => {
  const groups = appNav();
  return [{ ...groups[0], items: [...groups[0].items, { label: "Symulacje", icon: Timer }] }, ...groups.slice(1)];
})();

function ExamSidebar({ frame }: { frame: number }) {
  const left = secondsLeft(frame);
  const answered = Array.from({ length: SITTING.tasks }, (_, i) => (frame >= answeredAt(i + 1) ? 1 : 0)).reduce<number>((a, b) => a + b, 0);
  const current = taskOnPage(frame);
  return (
    <div className="flex h-full flex-col pb-[14px]">
      <p className="flex h-[26px] items-center gap-1 px-1 text-[12px] font-medium leading-none text-slate">
        <ChevronLeft className="size-[13px]" strokeWidth={1.75} />
        Symulacja
      </p>
      <NavHeading>
        Arkusz · {SITTING.tasks} zadań
      </NavHeading>
      <div className="grid grid-cols-6 gap-[4px] px-2">
        {Array.from({ length: SITTING.tasks }, (_, i) => {
          const task = i + 1;
          const done = frame >= answeredAt(task);
          const flagged = task === FLAGGED && done;
          const on = task === current && frame < T.finish;
          return (
            <span
              key={task}
              className={cn(
                "grid h-[20px] place-items-center rounded-[5px] border text-[9px] font-medium tabular-nums",
                flagged
                  ? "border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]"
                  : done
                    ? "border-[#dbeafe] bg-[#e8f1fe] text-[#1e40af]"
                    : "border-ash bg-white text-silver",
                on && "ring-1 ring-[#1d63d8]",
              )}
            >
              {task}
            </span>
          );
        })}
      </div>
      <NavHeading>Narzędzia</NavHeading>
      <ul className="space-y-[2px]">
        <NavRow item={{ label: "Karta wzorów", icon: SquareFunction }} on={false} />
        <NavRow item={{ label: "Kalkulator", icon: Calculator }} on={false} />
        <NavRow item={{ label: "Brudnopis", icon: NotebookPen }} on={false} />
        <NavRow item={{ label: "Do sprawdzenia", icon: Flag, badge: frame >= answeredAt(FLAGGED) ? 1 : 0 }} on={false} />
      </ul>
      <div className="mt-auto space-y-3 px-2">
        <Meter label="Czas" value={`${clock(EXAM_SECONDS - left)} z 180:00`} share={(EXAM_SECONDS - left) / EXAM_SECONDS} />
        <Meter label="Rozwiązane" value={`${answered} z ${SITTING.tasks}`} share={answered / SITTING.tasks} />
      </div>
    </div>
  );
}

function Meter({ label, value, share }: { label: string; value: string; share: number }) {
  return (
    <div>
      <p className="flex justify-between text-[10px] leading-none text-fog">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </p>
      <div className="mt-[6px] h-[3px] overflow-hidden rounded-full bg-ash">
        <div className="h-full rounded-full bg-[#1d63d8]" style={{ width: `${Math.min(1, share) * 100}%` }} />
      </div>
    </div>
  );
}

/* ── Chapter 1: the library, the rules, 3·2·1 ───────────────────────────── */

/** The papers on offer, each with its real maximum off CKE's cover; earlier results in percent, since the maxima differ. */
const SHEETS = [
  { exam: "Matura 2025", month: "maj", max: 50, status: "new" as const, note: "Jeszcze nie rozwiązany" },
  { exam: "Matura 2024", month: "maj", max: 46, status: "done" as const, note: "Twój wynik: 78%" },
  { exam: "Matura 2023", month: "maj", max: 46, status: "done" as const, note: "Twój wynik: 72%" },
];

/** The dashboard's own sittings (ReportDashboard: one a month from September), newest first. */
const HISTORY = [
  { name: "Symulacja 7 · Matura 2024", score: "78%", time: "146 min", date: "14 mar" },
  { name: "Symulacja 6 · Matura 2023", score: "72%", time: "151 min", date: "8 lut" },
  { name: "Symulacja 5 · Informator CKE", score: "68%", time: "157 min", date: "11 sty" },
  { name: "Symulacja 4 · Matura 2024", score: "62%", time: "162 min", date: "7 gru" },
  { name: "Symulacja 3 · Matura 2023", score: "52%", time: "168 min", date: "9 lis" },
  { name: "Symulacja 2 · Informator CKE", score: "54%", time: "171 min", date: "12 paź" },
];

function Library({ frame }: { frame: number }) {
  const pressed = frame >= T.pickCard && frame < T.pickCard + 8;
  const hover = hovering(frame, s(1.5), T.modal + 30);
  return (
    <div className="absolute inset-0">
      <div className="absolute flex items-center gap-2" style={{ left: 30, top: 18 }}>
        <Chip caret>Matura</Chip>
        <Chip caret>Matematyka</Chip>
        <Chip caret>Poziom podstawowy</Chip>
      </div>
      <p className="absolute text-[11px] text-fog" style={{ right: 30, top: 26 }}>
        Arkusze CKE · czas i punktacja jak na egzaminie
      </p>
      {SHEETS.map((sheet, index) => (
        <div
          key={sheet.exam}
          className="absolute rounded-[10px] border border-ash bg-white p-[14px]"
          style={{
            left: CARD.x + index * (CARD.w + CARD.gap),
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            boxShadow: index === 0 && hover > 0 ? `0 6px 18px -8px rgba(0,0,0,${0.18 * hover})` : undefined,
            transform: index === 0 ? `translateY(${-hover * 2}px) scale(${pressed ? 0.985 : 1})` : undefined,
            borderColor: index === 0 && hover > 0.5 ? "#d4d4d4" : undefined,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="grid size-[26px] place-items-center rounded-full border border-ash bg-gradient-to-t from-paper-mist to-white">
                <MaturaIcon className="h-[11px] w-[14px]" />
              </span>
              <span className="text-[13px] font-semibold text-charcoal">{sheet.exam}</span>
              <span className="text-[11px] text-fog">· {sheet.month}</span>
            </span>
            <StatusPill status={sheet.status} label={sheet.status === "new" ? "Nowy" : "Rozwiązany"} />
          </div>
          <p className="mt-[10px] text-[11.5px] text-steel">
            {SITTING.subject} · {SITTING.level.toLowerCase()}
          </p>
          <div className="mt-[12px] flex gap-1.5">
            <Chip icon={Timer}>{SITTING.examMinutes} min</Chip>
            <Chip icon={ListChecks}>{sheet.max} pkt</Chip>
          </div>
          <p className="absolute bottom-[12px] left-[14px] text-[10.5px] text-fog">{sheet.note}</p>
        </div>
      ))}

      <p className="absolute text-[12px] font-medium text-charcoal" style={{ left: 30, top: 226 }}>
        Historia symulacji
      </p>
      <div className="absolute overflow-hidden rounded-[10px] border border-ash" style={{ left: 30, right: 30, top: 252 }}>
        <div className="grid grid-cols-[2.2fr_1fr_1fr_0.8fr] border-b border-ash bg-canvas-muted px-[14px] py-[9px] text-[10.5px] font-medium text-steel">
          <span>Arkusz</span>
          <span>Wynik</span>
          <span>Czas</span>
          <span>Data</span>
        </div>
        {HISTORY.map((row) => (
          <div key={row.name} className="grid grid-cols-[2.2fr_1fr_1fr_0.8fr] border-b border-ash px-[14px] py-[10px] text-[11px] text-slate last:border-0">
            <span className="font-medium text-charcoal">{row.name}</span>
            <span className="tabular-nums">{row.score}</span>
            <span className="tabular-nums">{row.time}</span>
            <span className="text-fog">{row.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RulesModal({ frame }: { frame: number }) {
  const open = ramp(frame, T.modal, 14) * (1 - ramp(frame, T.countdown, 8));
  if (open <= 0) return null;
  const pressed = frame >= T.start && frame < T.start + 8;
  const hoverStart = hovering(frame, s(4.5), T.start + 6);
  const rows = [
    ["Czas", `${SITTING.examMinutes} minut, zegar startuje od razu`],
    ["Zadania", `${SITTING.tasks} zadań, ${SITTING.max} punktów`],
    ["Narzędzia", "karta wzorów, kalkulator prosty, brudnopis"],
    ["Ocena", "według zasad oceniania CKE"],
  ];
  return (
    <div className="absolute inset-0 z-20" style={{ opacity: open }}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="absolute rounded-[12px] border border-ash bg-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.25)]"
        style={{ left: MODAL.x, top: MODAL.y, width: MODAL.w, height: MODAL.h, transform: `translateY(${(1 - open) * 8}px) scale(${0.98 + open * 0.02})` }}
      >
        <div className="flex items-center gap-2.5 border-b border-ash px-[22px] py-[16px]">
          <span className="grid size-[30px] place-items-center rounded-full border border-ash bg-gradient-to-t from-paper-mist to-white">
            <MaturaIcon className="h-[12px] w-[16px]" />
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-none text-charcoal">
              {SITTING.exam} · {SITTING.subject}
            </p>
            <p className="mt-[5px] text-[11px] leading-none text-fog">
              {SITTING.level} · arkusz {SITTING.code}
            </p>
          </div>
        </div>
        <div className="space-y-[11px] px-[22px] pt-[16px]">
          {rows.map(([label, value]) => (
            <p key={label} className="flex text-[11.5px] leading-none">
              <span className="w-[86px] shrink-0 text-fog">{label}</span>
              <span className="text-charcoal">{value}</span>
            </p>
          ))}
        </div>
        <div className="mx-[22px] mt-[18px] flex items-center justify-between rounded-[8px] border border-ash bg-canvas-muted px-3 py-[10px]">
          <span className="text-[11.5px] text-charcoal">Tryb egzaminu: bez podpowiedzi w trakcie</span>
          <span className="relative h-[16px] w-[28px] rounded-full bg-[#1d63d8]">
            <span className="absolute right-[2px] top-[2px] size-[12px] rounded-full bg-white" />
          </span>
        </div>
        <div className="absolute inset-x-[22px] bottom-[22px] flex items-center justify-end gap-2">
          <Chip>Anuluj</Chip>
          <span style={{ filter: hoverStart > 0 ? `brightness(${1 + hoverStart * 0.25})` : undefined }}>
            <PrimaryButton pressed={pressed}>Rozpocznij egzamin</PrimaryButton>
          </span>
        </div>
      </div>
    </div>
  );
}

function Countdown({ frame }: { frame: number }) {
  const shown = ramp(frame, T.countdown, 10) * (1 - ramp(frame, T.exam - 8, 10));
  if (shown <= 0) return null;
  const elapsed = (frame - T.countdown) / FPS;
  const digit = elapsed < 0.75 ? 3 : elapsed < 1.5 ? 2 : 1;
  const beat = ((frame - T.countdown) % s(0.75)) / s(0.75);
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-white/90" style={{ opacity: shown }}>
      <div className="text-center">
        <p className="text-[13px] text-fog">Egzamin zaczyna się za</p>
        <p className="mt-2 text-[72px] font-medium leading-none tabular-nums text-charcoal" style={{ opacity: 1 - beat * 0.35, transform: `scale(${1.04 - beat * 0.04})` }}>
          {digit}
        </p>
        <p className="mt-3 text-[12px] text-silver">
          {SITTING.exam} · {SITTING.subject} · {SITTING.examMinutes} min
        </p>
      </div>
    </div>
  );
}

/* ── Chapter 2: the sheet ────────────────────────────────────────────────── */

/* The paper's own tasks — MMAP-P0_100, CKE, 6 May 2025 (arkusz and zasady
   oceniania, version A, read 2026-10-02). Answers are the official key. */

type ByHand = { page: number; prompt: React.ReactNode; options: React.ReactNode[] };

const Sup = ({ children }: { children: React.ReactNode }) => <sup className="text-[0.65em]">{children}</sup>;
const Sub = ({ children }: { children: React.ReactNode }) => <sub className="text-[0.65em]">{children}</sub>;

const TASKS_BY_HAND: Record<number, ByHand> = {
  1: {
    page: 4,
    prompt: (
      <>
        Liczba{" "}
        <span className="mx-[0.15em]">
          <Tall>(</Tall>
          <Radical>32</Radical> − <Radical>2</Radical>
          <Tall>)</Tall>
          <Sup>2</Sup>
        </span>{" "}
        jest równa
      </>
    ),
    options: ["16", "18", "30", "34"],
  },
  2: {
    page: 4,
    prompt: (
      <span className="inline-flex items-center">
        Liczba&nbsp;
        <Frac
          n={
            <>
              5<Sup>12</Sup> + 5<Sup>13</Sup> + 5<Sup>14</Sup>
            </>
          }
          d={
            <>
              5<Sup>12</Sup>
            </>
          }
        />
        &nbsp;jest równa
      </span>
    ),
    options: [
      "30",
      "31",
      <>
        5<Sup>12</Sup>
      </>,
      <>
        5<Sup>27</Sup>
      </>,
    ],
  },
  3: {
    page: 5,
    prompt: (
      <>
        Liczba log<Sub>3</Sub>108 − 2log<Sub>3</Sub>2 jest równa
      </>
    ),
    options: [
      "3",
      "9",
      <>
        log<Sub>3</Sub>104
      </>,
      <>
        2log<Sub>3</Sub>54
      </>,
    ],
  },
  4: {
    page: 5,
    prompt: (
      <>
        Dla każdej liczby rzeczywistej <V>x</V> wartość wyrażenia (3<V>x</V> + 2)<Sup>2</Sup> − (2<V>x</V> − 3)<Sup>2</Sup> jest równa wartości
        wyrażenia
      </>
    ),
    options: [
      <>
        5<V>x</V>
        <Sup>2</Sup> − 5
      </>,
      <>
        5<V>x</V>
        <Sup>2</Sup> + 13
      </>,
      <>
        5<V>x</V>
        <Sup>2</Sup> + 24<V>x</V> − 5
      </>,
      <>
        5<V>x</V>
        <Sup>2</Sup> + 24<V>x</V> − 13
      </>,
    ],
  },
};

type Fast = { label: string; points: string; page: number; text: string; answer?: "A" | "B" | "C" | "D" | "FF" };

/** Tasks 5–31 but 21: each one's header, page and opening, as printed; closed ones with the key's answer. */
const FAST: Record<number, Fast> = {
  5: { label: "5", points: "0–2", page: 6, text: "Wykaż, że dla każdej nieparzystej liczby naturalnej n liczba 3n² + 2n + 7 jest podzielna przez 4." },
  6: { label: "6", points: "0–1", page: 7, text: "Dana jest nierówność 3 − 2(1 − 2x) ≥ 2x − 17. Na którym rysunku poprawnie zaznaczono na osi liczbowej zbiór wszystkich liczb rzeczywistych spełniających powyższą nierówność?", answer: "D" },
  7: { label: "7", points: "0–1", page: 8, text: "Równanie 2x(x + 3)(x² + 25) = 0 w zbiorze liczb rzeczywistych ma dokładnie", answer: "A" },
  8: { label: "8", points: "0–1", page: 8, text: "Dla każdej liczby rzeczywistej x różnej od (−2) oraz różnej od 0 wartość wyrażenia jest równa wartości wyrażenia", answer: "C" },
  9: { label: "9", points: "0–2", page: 9, text: "Zarząd firmy wydzielił z budżetu kwotę 1 200 000 złotych łącznie na projekty badawcze dla dwóch zespołów: A i B. Oblicz kwotę przyznaną zespołowi A." },
  10: { label: "10", points: "0–2", page: 10, text: "Rozwiąż nierówność 3(2x² + 1) < 11x. Zapisz obliczenia." },
  11: { label: "11", points: "0–4", page: 11, text: "Funkcja f jest określona następująco: f(x) = x + 5 dla x ∈ [−4, −2], 3 dla x ∈ (−2, 2], −3x + 9 dla x ∈ (2, 4). Uzupełnij zdania." },
  12: { label: "12.2", points: "0–1", page: 13, text: "Osią symetrii wykresu funkcji f jest prosta o równaniu", answer: "A" },
  13: { label: "13", points: "0–1", page: 14, text: "Funkcja liniowa f jest określona wzorem f(x) = (3 − m)x − 4. Funkcja f nie ma miejsca zerowego dla m równego", answer: "C" },
  14: { label: "14.1", points: "0–1", page: 15, text: "Trzeci wyraz ciągu (aₙ) jest równy", answer: "D" },
  15: { label: "15", points: "0–3", page: 16, text: "Wyznacz wartość m, dla której trzywyrazowy ciąg (2m + 11, m² + 3, 5 − m) jest arytmetyczny i malejący. Zapisz obliczenia." },
  16: { label: "16", points: "0–1", page: 17, text: "Dany jest ciąg geometryczny (aₙ) określony dla każdej liczby naturalnej n ≥ 1, w którym a₁ = 27 oraz a₂ = 9.", answer: "B" },
  17: { label: "17", points: "0–1", page: 17, text: "Kąt α jest ostry i spełnia warunek √3 tg α = 2 sin α. Cosinus kąta α jest równy", answer: "C" },
  18: { label: "18.1", points: "0–1", page: 18, text: "Tangens kąta α jest równy", answer: "D" },
  19: { label: "19", points: "0–1", page: 19, text: "Punkty A, B oraz C leżą na okręgu o środku w punkcie O. Miara kąta BCA jest równa 50°.", answer: "C" },
  20: { label: "20", points: "0–1", page: 20, text: "W trójkącie równoramiennym ABC dane są: |AC| = |BC| = 4 i |AB| = 3.", answer: "B" },
  22: { label: "22", points: "0–1", page: 22, text: "Dany jest kwadrat ABCD, w którym A = (4, −1). Przekątne tego kwadratu przecinają się w punkcie S = (1, 3).", answer: "C" },
  23: { label: "23", points: "0–1", page: 22, text: "Proste k oraz l są określone równaniami k: y = (m − 2)x + 5 oraz l: y = −4x + (m + 3).", answer: "B" },
  24: { label: "24", points: "0–1", page: 23, text: "Punkt P = (0, 0) leży na okręgu 𝒪 o środku w punkcie S = (2, 4).", answer: "B" },
  25: { label: "25", points: "0–3", page: 24, text: "Tworząca stożka ma długość 8. Kąt rozwarcia tego stożka ma miarę 120°. Oblicz objętość tego stożka. Zapisz obliczenia." },
  26: { label: "26", points: "0–1", page: 25, text: "Objętość sześcianu jest równa 729. Długość przekątnej tego sześcianu jest równa", answer: "A" },
  27: { label: "27", points: "0–1", page: 25, text: "Wszystkich liczb naturalnych trzycyfrowych nieparzystych, w których zapisie dziesiętnym występuje dokładnie jeden raz cyfra 0, jest", answer: "A" },
  28: { label: "28", points: "0–1", page: 26, text: "Doświadczenie losowe polega na dwukrotnym rzucie symetryczną sześcienną kostką do gry.", answer: "D" },
  29: { label: "29", points: "0–1", page: 26, text: "Średnia arytmetyczna siedmiu liczb: 1, 2, 3, 4, 5, x, y, jest równa 3. Suma x + y jest równa", answer: "C" },
  30: { label: "30", points: "0–2", page: 27, text: "Na diagramie przedstawiono wyniki sprawdzianu z matematyki w pewnej klasie maturalnej liczącej 24 uczniów." },
  31: { label: "31", points: "0–4", page: 28, text: "Rozważamy wszystkie prostopadłościany ABCDEFGH, w których krawędź BC ma długość 4 oraz suma długości wszystkich krawędzi wychodzących z wierzchołka B jest równa 15." },
};

function TaskBar({ label, points, page, saved, flagged }: { label: string; points: string; page: number; saved: number; flagged: boolean }) {
  return (
    <div className="flex h-[44px] items-center gap-2 border-b border-ash px-[18px]">
      <span className="text-[12.5px] font-semibold leading-none text-charcoal">Zadanie {label}.</span>
      <span className="text-[11px] leading-none text-fog">{points} pkt</span>
      {saved > 0 && (
        <span style={{ opacity: saved }}>
          <StatusPill status={flagged ? "pending" : "done"} label={flagged ? "Do sprawdzenia" : "Zapisano"} />
        </span>
      )}
      <span className="ml-auto text-[10.5px] leading-none text-silver">
        {SITTING.code} · strona {page}
      </span>
    </div>
  );
}

/** Zadania 1–4: read, the right answer clicked. */
function ClosedTask({ task, frame }: { task: number; frame: number }) {
  const { prompt, options } = TASKS_BY_HAND[task];
  const { correct, pick } = BY_HAND.find((item) => item.task === task)!;
  const hover = hovering(frame, pick - 14, pick);
  const picked = ramp(frame, pick + 2, 8);
  return (
    <>
      <p className="absolute text-[12px] leading-[18px] text-slate" style={{ left: 18, top: 62 }}>
        Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.
      </p>
      <p className="absolute text-[15px] leading-[24px] text-charcoal" style={{ left: 18, right: 18, top: 88 }}>
        {prompt}
      </p>
      <div className="absolute flex" style={{ left: OPTION.x, top: OPTION.y, gap: OPTION.gap }}>
        {options.map((option, index) => {
          const on = index === correct ? picked : 0;
          return (
            <span key={index} className="relative flex items-center gap-2.5 rounded-[8px] border border-ash px-3 text-[13px] text-charcoal" style={{ width: OPTION.w, height: OPTION.h }}>
              <span className="absolute inset-0 rounded-[7px] bg-paper-mist" style={{ opacity: index === correct ? hover * (1 - on) : 0 }} />
              <span className="absolute -inset-px rounded-[8px] border border-[#93c5fd] bg-[#eff6ff]" style={{ opacity: on }} />
              <span className="relative grid size-[19px] shrink-0 place-items-center rounded-full border border-ash bg-white text-[10px] font-medium text-fog">
                <span className="absolute -inset-px rounded-full bg-[#1d63d8]" style={{ opacity: on }} />
                <span className="relative" style={{ color: on > 0.5 ? "#fff" : undefined }}>
                  {"ABCD"[index]}
                </span>
              </span>
              <span className="relative whitespace-nowrap tabular-nums" style={{ color: on > 0.5 ? "#1d63d8" : undefined }}>
                {option}
              </span>
            </span>
          );
        })}
      </div>
      <Scratch top={226} height={258} />
    </>
  );
}

/** The squared grid CKE prints for working out. */
function Scratch({ top, height, children }: { top: number; height: number; children?: React.ReactNode }) {
  return (
    <div className="absolute overflow-hidden rounded-[6px] border border-[#dbeafe]" style={{ left: 18, right: 18, top, height }}>
      <div className="absolute inset-0 bg-[linear-gradient(#e8f0fe_1px,transparent_1px),linear-gradient(90deg,#e8f0fe_1px,transparent_1px)] bg-[size:12px_12px]" />
      <span className="absolute left-2 top-1.5 text-[9.5px] text-silver">Brudnopis</span>
      {children}
    </div>
  );
}

/** The answer card's row for a closed task: four bubbles (or P/F pairs), the key's answer filled in. */
function AnswerBubbles({ answer, marked }: { answer: NonNullable<Fast["answer"]>; marked: number }) {
  const letters = answer === "FF" ? ["P", "F", "P", "F"] : ["A", "B", "C", "D"];
  const filled = (index: number) => (answer === "FF" ? index === 1 || index === 3 : letters[index] === answer);
  return (
    <div className="absolute flex items-center gap-3" style={{ left: 18, top: 190 }}>
      <span className="text-[11px] text-fog">{answer === "FF" ? "Stwierdzenia 1 i 2" : "Odpowiedź"}</span>
      {letters.map((letter, index) => (
        <span key={index} className="relative grid size-[24px] place-items-center rounded-full border border-ash bg-white text-[10.5px] font-medium text-fog">
          <span className="absolute -inset-px rounded-full bg-[#1d63d8]" style={{ opacity: filled(index) ? marked : 0 }} />
          <span className="relative" style={{ color: filled(index) && marked > 0.5 ? "#fff" : undefined }}>
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Ink on the grid: Zadanie 10's own working; elsewhere lines of writing, too quick to read. */
function Working({ task, written }: { task: number; written: number }) {
  if (task === 10) {
    return (
      <div className="absolute left-[22px] top-[30px] space-y-[6px] text-[14px] italic leading-[22px] text-[#1e3a8a]" style={{ opacity: written }}>
        <p>
          6<V>x</V>
          <Sup>2</Sup> − 11<V>x</V> + 3 &lt; 0
        </p>
        <p>Δ = 121 − 72 = 49,&nbsp;&nbsp;√Δ = 7</p>
        <p className="inline-flex items-center">
          <V>x</V>
          <Sub>1</Sub>&nbsp;=&nbsp;
          <Frac n="1" d="3" />,&nbsp;&nbsp;
          <V>x</V>
          <Sub>2</Sub>&nbsp;=&nbsp;
          <Frac n="3" d="2" />
        </p>
        <p className="inline-flex items-center rounded-[3px] border border-[#1e3a8a]/50 px-1.5">
          <V>x</V>&nbsp;∈&nbsp;(<Frac n="1" d="3" />,&nbsp;<Frac n="3" d="2" />)
        </p>
      </div>
    );
  }
  const seed = (task * 37) % 11;
  const lines = 3 + (task % 3);
  return (
    <div className="absolute left-[22px] top-[34px] space-y-[16px]">
      {Array.from({ length: lines }, (_, line) => (
        <div key={line} className="flex items-center gap-[7px]" style={{ opacity: Math.min(1, Math.max(0, written * lines - line)) }}>
          {Array.from({ length: 3 + ((seed + line) % 4) }, (_, word) => (
            <span key={word} className="h-[3px] rounded-full bg-[#1e3a8a]/45" style={{ width: 14 + ((seed * 7 + line * 13 + word * 29) % 46) }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** A fast-forwarded task's page: as printed, answered half-way through its slot. */
function FastTask({ task, frame }: { task: number; frame: number }) {
  const data = FAST[task];
  const index = LAPSE_ORDER.indexOf(task);
  const from = lapseFrom(index);
  const marked = ramp(frame, lapseAt(index) - 4, 5);
  const written = Math.min(1, Math.max(0, (frame - from) / (LAPSE_SLOT * 0.85)));
  return (
    <>
      <p className="absolute text-[13px] leading-[20px] text-charcoal" style={{ left: 18, right: 18, top: 62 }}>
        {data.text}
      </p>
      {data.answer ? (
        <>
          <AnswerBubbles answer={data.answer} marked={marked} />
          <Scratch top={240} height={244} />
        </>
      ) : (
        <Scratch top={150} height={334}>
          <Working task={task} written={written} />
        </Scratch>
      )}
    </>
  );
}

function TaskTwentyOne({ frame }: { frame: number }) {
  const rows = [
    { text: <>Trójkąt <V>ABC</V> jest równoramienny.</>, pick: "F" as const, at: T.pickF },
    {
      text: (
        <span className="inline-flex items-center">
          Pole trójkąta&nbsp;<V>ABC</V>&nbsp;jest równe 33<Radical>3</Radical>.
        </span>
      ),
      pick: "P" as const,
      at: T.pickP,
    },
  ];
  return (
    <>
      <p className="absolute text-[12.5px] leading-[19px] text-charcoal" style={{ left: 18, right: 18, top: 62 }}>
        Dany jest trójkąt <V>ABC</V>, w którym |<V>AB</V>| = 11, |<V>BC</V>| = 12 oraz |∡<V>ABC</V>| = 60°.
      </p>
      <p className="absolute text-[12px] leading-[18px] text-slate" style={{ left: 18, right: 18, top: 110 }}>
        Oceń prawdziwość poniższych stwierdzeń. Wybierz P, jeśli stwierdzenie jest prawdziwe, albo F – jeśli jest fałszywe.
      </p>
      <div className="absolute overflow-hidden rounded-[10px] border border-ash" style={{ left: 18, right: 18, top: TABLE.y }}>
        {rows.map((row, index) => {
          const on = ramp(frame, row.at + 2, 8);
          const hover = hovering(frame, row.at - 14, row.at);
          return (
            <div key={index} className={cn("flex items-center", index > 0 && "border-t border-ash")} style={{ height: TABLE.row }}>
              <span className="flex-1 px-3 text-[12.5px] text-charcoal">{row.text}</span>
              {(["P", "F"] as const).map((letter) => {
                const picked = row.pick === letter ? on : 0;
                return (
                  <span key={letter} className="relative flex h-full items-center justify-center border-l border-ash text-[12px] font-medium text-fog" style={{ width: TABLE.cell }}>
                    <span className="absolute inset-[6px] rounded-[6px] bg-paper-mist" style={{ opacity: row.pick === letter ? hover * (1 - picked) : 0 }} />
                    <span className="absolute inset-[6px] rounded-[6px] border border-[#93c5fd] bg-[#eff6ff]" style={{ opacity: picked }} />
                    <span className="relative" style={{ color: picked > 0.5 ? "#1d63d8" : undefined }}>
                      {letter}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      <Scratch top={312} height={172} />
    </>
  );
}

function ExamPage({ frame }: { frame: number }) {
  const task = taskOnPage(frame);
  const lapse = ramp(frame, T.lapse, 10) * (1 - ramp(frame, T.lapseEnd - 6, 10));
  const nextPressed = BY_HAND.some(({ next }) => frame >= next && frame < next + 8);
  const note = ramp(frame, answeredAt(FLAGGED) + 8, 14);
  return (
    <div className="absolute inset-0">
      <div className="absolute overflow-hidden rounded-[10px] border border-ash bg-white" style={{ left: SHEET.x, top: SHEET.y, width: SHEET.w, height: SHEET.h }}>
        <TaskBar
          label={FAST[task]?.label ?? String(task)}
          points={FAST[task]?.points ?? (task === 21 || task <= 4 ? "0–1" : "0–2")}
          page={FAST[task]?.page ?? (task === 21 ? 21 : TASKS_BY_HAND[task].page)}
          saved={ramp(frame, answeredAt(task), 6)}
          flagged={task === FLAGGED}
        />
        {task <= 4 ? <ClosedTask task={task} frame={frame} /> : task === 21 ? <TaskTwentyOne frame={frame} /> : <FastTask task={task} frame={frame} />}
        <div className="absolute flex items-center gap-2" style={{ right: 18, bottom: 18 }}>
          <Chip>Poprzednie</Chip>
          <PrimaryButton pressed={nextPressed}>Następne zadanie</PrimaryButton>
        </div>
        {lapse > 0 && (
          <span className="absolute right-[18px] top-[56px] flex items-center gap-1.5 rounded-[6px] bg-charcoal px-2 py-1 text-[10.5px] font-medium text-white" style={{ opacity: lapse }}>
            <FastForward className="size-[11px]" strokeWidth={2} />
            Przewijanie ×60
          </span>
        )}
      </div>

      {/* The notes beside the sheet: Korepetytor AI files one when a task is flagged */}
      <div className="absolute rounded-[10px] border border-ash bg-white" style={{ left: SHEET.x + SHEET.w + 16, right: 30, top: SHEET.y }}>
        <p className="flex items-center gap-2 border-b border-ash px-[14px] py-[12px] text-[12px] font-medium text-charcoal">
          <NotebookPen className="size-[13px] text-slate" strokeWidth={1.75} />
          Notatki
        </p>
        <div className="space-y-2 p-[14px]">
          <p className="text-[11px] leading-[16px] text-fog">Tu trafiają Twoje notatki i zadania oznaczone do sprawdzenia.</p>
          <div className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-[10px]" style={{ opacity: note, transform: `translateY(${(1 - note) * 4}px)` }}>
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-[#c2410c]">
              <Flag className="size-[11px]" strokeWidth={2} />
              Zadanie 10
            </p>
            <p className="mt-1 text-[10.5px] leading-[15px] text-slate">Wrócić na koniec: sprawdzić znak nierówności.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HandInModal({ frame }: { frame: number }) {
  const open = ramp(frame, T.handIn, 14) * (1 - ramp(frame, T.submit + 8, 10));
  if (open <= 0) return null;
  const pressed = frame >= T.submit && frame < T.submit + 8;
  const rows = [
    { label: "Rozwiązane zadania", value: `${SITTING.tasks} z ${SITTING.tasks}` },
    { label: "Do sprawdzenia", value: "1 (zadanie 10)" },
    { label: "Pozostały czas", value: `${SITTING.examMinutes - SITTING.minutes} min` },
  ];
  return (
    <div className="absolute inset-0 z-20" style={{ opacity: open }}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="absolute rounded-[12px] border border-ash bg-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.25)]"
        style={{ left: HAND_IN.x, top: HAND_IN.y, width: HAND_IN.w, height: HAND_IN.h, transform: `translateY(${(1 - open) * 8}px)` }}
      >
        <div className="px-[22px] pt-[20px]">
          <p className="text-[15px] font-semibold text-charcoal">Oddać arkusz?</p>
          <p className="mt-1 text-[11.5px] text-fog">Po oddaniu nie wrócisz do zadań — arkusz trafi do sprawdzenia.</p>
        </div>
        <div className="mx-[22px] mt-[16px] divide-y divide-ash rounded-[8px] border border-ash">
          {rows.map((row) => (
            <p key={row.label} className="flex justify-between px-3 py-[10px] text-[11.5px]">
              <span className="text-fog">{row.label}</span>
              <span className="font-medium tabular-nums text-charcoal">{row.value}</span>
            </p>
          ))}
        </div>
        <div className="absolute inset-x-[22px] bottom-[22px] flex items-center justify-end gap-2">
          <Chip>Wróć do arkusza</Chip>
          <PrimaryButton pressed={pressed}>Oddaj arkusz</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ── Chapter 4: marking ──────────────────────────────────────────────────── */

const RUBRIC: Array<{ task: string; criterion: string; got: number; of: number }> = [
  { task: "Zadanie 1", criterion: "Odpowiedź B", got: 1, of: 1 },
  { task: "Zadanie 10", criterion: "Pierwiastki trójmianu", got: 1, of: 1 },
  { task: "Zadanie 10", criterion: "Zbiór rozwiązań nierówności", got: 1, of: 1 },
  { task: "Zadanie 21", criterion: "Ocena stwierdzeń: F, P", got: 1, of: 1 },
  { task: "Funkcje", criterion: "Wszystkie zadania działu", got: 13, of: 14 },
  { task: "Ciągi", criterion: "Wszystkie zadania działu", got: 6, of: 7 },
  { task: "Stereometria", criterion: "Wszystkie zadania działu", got: 4, of: 6 },
  { task: "Planimetria", criterion: "Wszystkie zadania działu", got: 7, of: 9 },
];

function Marking({ frame }: { frame: number }) {
  const start = T.check + s(0.4);
  const span = T.report - s(1.2) - start;
  const progress = Math.min(1, Math.max(0, (frame - start) / span));
  const score = Math.round(progress * SITTING.score);
  const checked = Math.round(progress * SITTING.tasks);
  return (
    <div className="absolute inset-0">
      <div className="absolute rounded-[10px] border border-ash bg-white" style={{ left: 30, right: 30, top: 18 }}>
        <div className="flex items-center justify-between border-b border-ash px-[18px] py-[14px]">
          <div>
            <p className="text-[13px] font-semibold text-charcoal">Sprawdzanie według zasad oceniania CKE</p>
            <p className="mt-1 text-[11px] text-fog">
              Zadanie {Math.max(1, checked)} z {SITTING.tasks} · każde kryterium osobno
            </p>
          </div>
          <p className="text-right">
            <span className="text-[26px] font-medium tabular-nums text-charcoal">{score}</span>
            <span className="text-[12px] text-fog"> / {SITTING.max} pkt</span>
          </p>
        </div>
        <div className="px-[18px] py-[14px]">
          <div className="h-[4px] overflow-hidden rounded-full bg-ash">
            <div className="h-full rounded-full bg-lavender" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="mt-[14px] divide-y divide-ash rounded-[8px] border border-ash">
            {RUBRIC.map((row, index) => {
              const shown = ramp(frame, start + Math.round((index / RUBRIC.length) * span), 12);
              const full = row.got === row.of;
              return (
                <div key={`${row.task}-${row.criterion}`} className="flex items-center gap-3 px-3 py-[11px] text-[11.5px]" style={{ opacity: 0.25 + shown * 0.75 }}>
                  <span
                    className={cn("grid size-[18px] place-items-center rounded-full", full ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fff7ed] text-[#c2410c]")}
                    style={{ opacity: shown }}
                  >
                    <Check className="size-[11px]" strokeWidth={3} />
                  </span>
                  <span className="w-[110px] font-medium text-charcoal">{row.task}</span>
                  <span className="flex-1 text-steel">{row.criterion}</span>
                  <span className={cn("font-medium tabular-nums", full ? "text-[#15803d]" : "text-[#c2410c]")} style={{ opacity: shown }}>
                    {row.got} / {row.of} pkt
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Chapter 5: the report ───────────────────────────────────────────────── */

/** The eight points of 50 that got away, by topic (ReportDashboard's split: 42 of 50). */
const LOST = [
  { topic: "Stereometria", lost: 2, of: 6 },
  { topic: "Planimetria", lost: 2, of: 9 },
  { topic: "Statystyka", lost: 2, of: 4 },
  { topic: "Funkcje", lost: 1, of: 14 },
  { topic: "Ciągi", lost: 1, of: 7 },
];

function Report({ frame }: { frame: number }) {
  const percent = SITTING.percent;
  const tiles = [
    { label: "Wynik", value: `${SITTING.score} / ${SITTING.max} pkt`, color: SITTING.metrics[0].color },
    { label: "Procent", value: `${percent}%`, color: SITTING.metrics[1].color },
    { label: "Czas", value: `${SITTING.minutes} min`, color: SITTING.metrics[2].color },
  ];
  const added = ramp(frame, T.addToPlan + 4, 12);
  const toast = ramp(frame, T.addToPlan + 10, 14) * (1 - ramp(frame, T.addToPlan + s(4.4), 14));
  const pressed = frame >= T.addToPlan && frame < T.addToPlan + 8;
  return (
    <div className="absolute inset-0">
      <div className="absolute grid grid-cols-3 gap-3" style={{ left: 30, right: 30, top: 18 }}>
        {tiles.map((tile, index) => (
          <div key={tile.label} className="rounded-[10px] border border-ash bg-white px-[16px] py-[14px]" style={{ opacity: ramp(frame, T.report + 6 + index * 6, 14) }}>
            <p className="flex items-center gap-1.5 text-[11px] text-fog">
              <span className="size-[7px] rounded-[2px]" style={{ backgroundColor: tile.color }} />
              {tile.label}
            </p>
            <p className="mt-1 text-[22px] font-medium tabular-nums text-charcoal">{tile.value}</p>
          </div>
        ))}
      </div>

      {/* The pass mark: 30%, and how far over it this sheet landed */}
      <div className="absolute rounded-[10px] border border-ash bg-white px-[16px] py-[12px]" style={{ left: 30, right: 30, top: 116, opacity: ramp(frame, T.report + 24, 14) }}>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-steel">Próg zdawalności 30%</span>
          <span className="font-medium text-[#15803d]">Zdane · {percent - 30} pkt proc. zapasu</span>
        </div>
        <div className="relative mt-[8px] h-[6px] rounded-full bg-paper-mist">
          <div className="absolute inset-y-0 left-0 rounded-full bg-[#86efac]" style={{ width: `${percent * ramp(frame, T.report + 28, 30)}%` }} />
          <div className="absolute -top-[3px] h-[12px] w-[2px] rounded-full bg-charcoal" style={{ left: "30%" }} />
        </div>
      </div>

      <div className="absolute rounded-[10px] border border-ash bg-white" style={{ left: LOST_CARD.x, top: LOST_CARD.y, width: LOST_CARD.w, opacity: ramp(frame, T.report + 34, 14) }}>
        <p className="flex items-center justify-between border-b border-ash px-[16px] py-[13px] text-[12px] font-medium text-charcoal">
          Gdzie tracisz punkty
          <span className="text-[10.5px] font-normal uppercase text-fog">Stracone</span>
        </p>
        <div className="space-y-[8px] p-[12px]">
          {LOST.map((row, index) => {
            const hover = index === 0 ? hovering(frame, T.hoverTopic, T.hoverTopic + s(1.4)) : index === 1 ? hovering(frame, T.hoverTopic + s(1.6), T.hoverTopic + s(2.8)) : 0;
            return (
              <div key={row.topic} className="relative flex h-[36px] items-center justify-between rounded-[7px] px-[10px] text-[11.5px]">
                <span className="absolute inset-y-0 left-0 rounded-[7px] bg-[#fff1e6]" style={{ width: `${(row.lost / 2) * 70 + 8}%` }} />
                <span className="absolute inset-0 rounded-[7px] ring-1 ring-[#fdba74]" style={{ opacity: hover }} />
                <span className="relative text-charcoal">{row.topic}</span>
                <span className="relative tabular-nums text-[#c2410c]">
                  −{row.lost} pkt <span className="text-fog">z {row.of}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute rounded-[10px] border border-ash bg-white" style={{ left: NEXT_CARD.x, top: NEXT_CARD.y, width: NEXT_CARD.w, height: NEXT_CARD.h, opacity: ramp(frame, T.report + 42, 14) }}>
        <p className="flex items-center gap-2 border-b border-ash px-[16px] py-[13px] text-[12px] font-medium text-charcoal">
          <span className={cn("grid size-[18px] place-items-center rounded-[5px] border border-black/5", accentStyles.yellow.chip)}>
            <Zap className="size-[11px]" strokeWidth={2.25} />
          </span>
          Następny krok od Korepetytora AI
        </p>
        <div className="p-[16px]">
          <p className="text-[12px] leading-[18px] text-slate">
            Najwięcej punktów uciekło na <span className="font-medium text-charcoal">stereometrii</span>,{" "}
            <span className="font-medium text-charcoal">planimetrii</span> i <span className="font-medium text-charcoal">statystyce</span>. Proponuję
            trzy powtórki na ten tydzień, zanim napiszesz kolejny arkusz.
          </p>
          <div className="mt-[14px] space-y-[8px]">
            {["Stereometria · bryły i przekroje", "Planimetria · trójkąty i okręgi", "Statystyka · średnia i mediana"].map((item, index) => {
              const tick = ramp(frame, T.addToPlan + 8 + index * 5, 10);
              return (
                <p key={item} className="flex items-center gap-2 rounded-[7px] border border-ash px-[10px] py-[8px] text-[11.5px] text-charcoal">
                  <span className="relative grid size-[16px] place-items-center rounded-full border border-ash">
                    <span className="absolute inset-0 grid place-items-center rounded-full bg-[#1d63d8] text-white" style={{ opacity: tick }}>
                      <Check className="size-[10px]" strokeWidth={3} />
                    </span>
                  </span>
                  {item}
                </p>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-[20px] left-[20px] flex items-center gap-2">
          <span className="relative inline-grid">
            <span style={{ gridArea: "1 / 1", opacity: 1 - added }}>
              <PrimaryButton pressed={pressed}>
                <Route className="size-[12px]" strokeWidth={2} />
                Dodaj do roadmapy
              </PrimaryButton>
            </span>
            <span className="inline-flex h-[28px] items-center gap-1.5 rounded-[7px] border border-[#bbf7d0] bg-[#f0fdf4] px-3 text-[11.5px] font-medium text-[#15803d]" style={{ gridArea: "1 / 1", opacity: added }}>
              <CircleCheck className="size-[12px]" strokeWidth={2} />
              Dodano do roadmapy
            </span>
          </span>
        </div>
      </div>

      {toast > 0 && (
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[9px] bg-charcoal px-3.5 py-2.5 text-[11.5px] text-white shadow-lg" style={{ bottom: 18 + toast * 8, opacity: toast }}>
          <CircleCheck className="size-[13px] text-[#86efac]" strokeWidth={2} />3 powtórki w Twojej roadmapie na ten tydzień
        </div>
      )}
    </div>
  );
}

/* ── The film ────────────────────────────────────────────────────────────── */

function Walkthrough() {
  const frame = useFrame();
  const inExam = frame >= T.exam && frame < T.check;
  const library = 1 - ramp(frame, T.exam - 4, 6);
  const exam = ramp(frame, T.exam - 4, 10) * (1 - ramp(frame, T.check - 6, 8));
  const marking = ramp(frame, T.check, 12) * (1 - ramp(frame, T.report - 8, 8));
  const report = ramp(frame, T.report, 12);
  const out = ramp(frame, T.fade, 50);
  const finishPressed = frame >= T.finish && frame < T.finish + 8;

  const title = inExam ? (
    <span className="flex items-center gap-2">
      <MaturaIcon className="h-[12px] w-[16px]" />
      {SITTING.exam} · {SITTING.subject}
      <span className="rounded-[5px] border border-ash px-1.5 py-[3px] text-[10px] font-normal text-fog">{SITTING.level}</span>
    </span>
  ) : frame < T.exam ? (
    "Symulacje"
  ) : frame < T.report ? (
    "Sprawdzanie arkusza"
  ) : (
    "Wynik symulacji"
  );
  const titleKey = inExam ? "exam" : frame < T.exam ? "library" : frame < T.report ? "check" : "report";

  return (
    <AbsoluteFill>
      <Shell
        framed={false}
        nav={NAV}
        active="Symulacje"
        sidebar={inExam ? <ExamSidebar frame={frame} /> : undefined}
        title={title}
        titleKey={titleKey}
        headerRight={
          inExam ? (
            <div className="flex items-center gap-2">
              <Chip icon={Timer} className="tabular-nums">
                {clock(secondsLeft(frame))}
              </Chip>
              <PrimaryButton pressed={finishPressed}>Zakończ egzamin</PrimaryButton>
            </div>
          ) : frame >= T.report ? (
            <div className="flex items-center gap-2">
              <Chip>
                <MaturaIcon className="h-[10px] w-[13px]" />
                Arkusz CKE · maj 2025
              </Chip>
              <PrimaryButton>Nowa symulacja</PrimaryButton>
            </div>
          ) : undefined
        }
      >
        {library > 0 && frame < T.exam + 6 && (
          <div className="absolute inset-0" style={{ opacity: library }}>
            <Library frame={frame} />
          </div>
        )}
        {exam > 0 && inExam && (
          <div className="absolute inset-0" style={{ opacity: exam }}>
            <ExamPage frame={frame} />
          </div>
        )}
        {marking > 0 && frame >= T.check && frame < T.report && (
          <div className="absolute inset-0" style={{ opacity: marking }}>
            <Marking frame={frame} />
          </div>
        )}
        {report > 0 && frame >= T.report && (
          <div className="absolute inset-0" style={{ opacity: report }}>
            <Report frame={frame} />
          </div>
        )}
      </Shell>
      <RulesModal frame={frame} />
      <Countdown frame={frame} />
      <HandInModal frame={frame} />
      <Cursor keys={KEYS} />
      {/* The loop closes on white, and the library comes back up out of it */}
      <div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: out * 0.9 + interpolate(frame, [0, 10], [0.9, 0], { extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
}

/** Remotion arrives with the Player, once the film is near the screen (see hero-film/FilmPlayer.tsx). */
const FilmPlayer = lazy(() => import("@/components/hero-film/FilmPlayer").then((m) => ({ default: m.FilmPlayer })));

/** The still: the report, mid-way, for reduced motion and until the first frame lands. */
const POSTER_FRAME = T.hoverTopic;

function Poster() {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-full w-full" aria-hidden>
      <foreignObject width={WIDTH} height={HEIGHT}>
        <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
          <FrameAt frame={POSTER_FRAME}>
            <Walkthrough />
          </FrameAt>
        </div>
      </foreignObject>
    </svg>
  );
}

/* ── On the page ─────────────────────────────────────────────────────────── */

/**
 * The film in its window with the chapter strip under it. It plays while on
 * screen and pauses when scrolled away; the strip follows the film, and a
 * click jumps to that chapter. No transport controls — the strip is the
 * control, as under the hero. Reduced motion shows the report's still.
 */
export function WalkthroughFilm() {
  const reducedMotion = useReducedMotion();
  const player = useRef<PlayerRef>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState(0);
  const [near, setNear] = useState(false);
  // The Player mounts late (lazily, near the screen), so the effect below waits for it, not for the first render.
  const [mounted, setMounted] = useState<PlayerRef | null>(null);
  const attach = useCallback((node: PlayerRef | null) => {
    player.current = node;
    setMounted(node);
  }, []);

  // Fetch the Player only once the film is within 600px of the screen.
  useEffect(() => {
    const el = stage.current;
    if (!el || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const current = mounted;
    const el = stage.current;
    if (!current || !el) return;
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? current.play() : current.pause()), { threshold: 0.25 });
    observer.observe(el);
    // The strip needs the frame for its chapter and progress line, not every
    // frame: a third of the film's rate keeps it smooth without re-rendering at 60fps.
    const onFrame = ({ detail }: { detail: { frame: number } }) => {
      setReady(true);
      setFrame((last) => (detail.frame < last || detail.frame - last >= 3 ? detail.frame : last));
    };
    current.addEventListener("frameupdate", onFrame);
    return () => {
      observer.disconnect();
      current.removeEventListener("frameupdate", onFrame);
    };
  }, [mounted]);

  const chapter = CHAPTERS.reduce((found, item, index) => (frame >= item.from ? index : found), 0);
  const jump = useCallback((index: number) => {
    const current = player.current;
    if (!current) return;
    current.seekTo(CHAPTERS[index].from);
    current.play();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <figure ref={stage} className="relative aspect-[1200/640] select-none overflow-hidden rounded-2xl border border-ash bg-ash shadow-md">
        <figcaption className="sr-only">
          Cała symulacja w Examaksie: wybór arkusza CKE z matury z matematyki (maj 2025) i zasady egzaminu, rozwiązywanie zadań na czas, oddanie
          arkusza, sprawdzanie według zasad oceniania CKE i raport — 42 z 50 punktów w 141 minut, stracone punkty według działów i powtórki
          dodane do roadmapy.
        </figcaption>
        <div aria-hidden inert className="pointer-events-none absolute inset-0">
          {reducedMotion ? (
            <Poster />
          ) : (
            <>
              <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: ready ? 0 : 1 }}>
                <Poster />
              </div>
              <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: ready ? 1 : 0 }}>
                {near ? (
                  <Suspense fallback={null}>
                    <FilmPlayer ref={attach} film={Walkthrough} durationInFrames={LOOP} fps={FPS} width={WIDTH} height={HEIGHT} poster={() => <Poster />} />
                  </Suspense>
                ) : null}
              </div>
            </>
          )}
        </div>
      </figure>

      {!reducedMotion && (
        <div role="tablist" aria-label="Rozdziały filmu" className="mt-5 grid grid-cols-2 gap-1.5 sm:flex sm:justify-center sm:gap-2">
          {CHAPTERS.map((item, index) => {
            const selected = index === chapter;
            const end = index + 1 < CHAPTERS.length ? CHAPTERS[index + 1].from : LOOP;
            const share = selected ? Math.min(1, Math.max(0, (frame - item.from) / (end - item.from))) : 0;
            return (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => jump(index)}
                className={cn(
                  "focus-ring relative inline-flex h-[34px] items-center justify-center gap-2 overflow-hidden rounded-buttons border px-3.5 text-body leading-none transition-colors duration-200",
                  selected ? "border-ash bg-white text-charcoal shadow-subtle" : "border-transparent bg-paper-mist text-steel hover:text-charcoal",
                  index === CHAPTERS.length - 1 && "max-sm:col-span-2",
                )}
              >
                <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-lavender/80" style={{ transform: `scaleX(${share})`, transformOrigin: "left" }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
