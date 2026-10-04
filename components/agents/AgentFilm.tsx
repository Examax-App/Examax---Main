"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Player, type PlayerRef } from "@remotion/player";
import { BotAvatar, type BotAvatarType } from "bot-avatars";
import {
  ArrowUp,
  BookOpenCheck,
  FastForward,
  CalendarClock,
  Check,
  FileCheck2,
  Plus,
  RefreshCcw,
  Route,
  ScanSearch,
  Search,
  Timer,
} from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { AccentTile } from "@/components/ui/FeaturePill";
import { FrameAt, useFrame } from "@/components/hero-film/frame";
import { FrameBridge } from "@/components/hero-film/frame-bridge";
import { Chip, Cursor, NavHeading, Shell, StatusPill, type CursorKey } from "@/components/hero-film/kit";
import { ramp } from "@/components/hero-film/motion";
import { Frac, V } from "@/components/simulation/math";
import { SITTING } from "@/components/simulation/sitting";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * /agents' film — one Remotion composition of working with an agent, from
 * making it to a full mock exam, built from the hero film's kit (shell,
 * sidebar rows, chips, status pills, cursor, easing) like /simulation's
 * walkthrough, so it is the same application the rest of the site shows.
 * Four chapters, which the strip under it can jump between:
 *
 *   Nowy agent  the builder from this page: a face, a name, what it is for,
 *               two more permissions → "Utwórz agenta"; it joins the sidebar
 *   Rutyna      the learner asks for three sessions a week on inequalities;
 *               the agent proposes a routine → "Dodaj do roadmapy"
 *   Nauka       Monday's session: CKE's Zadanie 10 (May 2025), worked by the
 *               learner one step at a time while the agent only asks the
 *               next question — 6x² − 11x + 3 < 0, Δ = 49, (1/3, 3/2), 2/2
 *   Symulacja   Saturday: the whole paper → 42/50 in 141 minutes (the shared
 *               sitting), and the weakest topics go into the routine
 *
 * The task and its working are CKE's own (MMAP-P0_100, Zadanie 10), as in
 * /simulation's films; the sitting is the shared fixture, and its lost points
 * match the walkthrough's report.
 * PLACEHOLDER DATA — the learner, the agent's wording and the schedule are illustrative.
 */

const FPS = 60;
const WIDTH = 1200;
const HEIGHT = 640;
const s = (seconds: number) => Math.round(seconds * FPS);

/** The film's beats, in frames. */
const T = {
  pickFace: s(1.3),
  nameFocus: s(2.0),
  nameType: [s(2.15), s(3.3)],
  briefFocus: s(3.8),
  briefType: [s(3.95), s(6.2)],
  togglePick: s(6.8),
  togglePlan: s(7.4),
  create: s(8.3),
  chat: s(9.4),
  composer: s(10.7),
  type1: [s(10.85), s(12.9)],
  send1: s(13.2),
  addPlan: s(16.3),
  monday: s(17.6),
  type2: [s(19.2), s(20.4)],
  send2: s(20.7),
  type3: [s(22.7), s(23.9)],
  send3: s(24.2),
  type4: [s(26.1), s(27.1)],
  send4: s(27.4),
  saturday: s(30.2),
  startSim: s(32.0),
  /** The sitting, fast-forwarded inside the card: from the start to the hand-in. */
  lapse: [s(32.25), s(34.0)],
  handedIn: s(34.6),
  replan: s(36.6),
  fade: s(39.8),
} as const;
const LOOP = s(41.2);

export const CHAPTERS = [
  { label: "Nowy agent", icon: Plus, from: 0 },
  { label: "Rutyna", icon: CalendarClock, from: T.chat },
  { label: "Nauka", icon: BookOpenCheck, from: T.monday },
  { label: "Symulacja", icon: Timer, from: T.saturday },
] as const;

/* ── The agent being made ────────────────────────────────────────────────── */

const AGENT = {
  name: "Trener matury",
  brief: "Ćwiczy ze mną zadania z matury i sprawdza moje rozwiązania.",
  face: "flower" as BotAvatarType,
  color: "#f472b6",
};

/** The builder's faces and permissions — the same as the page's own builder (TeamSection). */
const FACES: Array<{ type: BotAvatarType; color?: string }> = [
  { type: "blob" },
  { type: "flower", color: "#f472b6" },
  { type: "ghost" },
  { type: "drop" },
  { type: "alien" },
  { type: "mech" },
  { type: "cloud" },
  { type: "pill" },
  { type: "hexagon" },
  { type: "pebble", color: "#f59e0b" },
];

const PERMISSIONS: Array<{ label: string; icon: IconComponent; detail: string; on?: number }> = [
  { label: "Tłumaczy krok po kroku", icon: BookOpenCheck, detail: "Pyta o Twój następny ruch, zamiast podawać wynik.", on: 0 },
  { label: "Sprawdza rozwiązania", icon: ScanSearch, detail: "Linijka po linijce, ze wskazaniem błędu.", on: 0 },
  { label: "Układa sprawdziany", icon: FileCheck2, detail: "Z Twoich słabych działów, oceniane jak na egzaminie." },
  { label: "Dobiera zadania CKE", icon: Search, detail: "Z oryginalnych arkuszy, do tematu, który ćwiczysz.", on: T.togglePick },
  { label: "Zmienia roadmapę", icon: CalendarClock, detail: "Przestawia plan, gdy masz mniej czasu — za Twoją zgodą.", on: T.togglePlan },
  { label: "Pilnuje powtórek", icon: RefreshCcw, detail: "Wraca z materiałem, zanim ucieknie z pamięci.", on: 0 },
];

/* ── Geometry, in composition pixels ─────────────────────────────────────── */

/** Top-left of the main panel's content area, under the 46px page header. */
const AREA = { x: 239, y: 53 };
const at = (x: number, y: number) => ({ x: AREA.x + x, y: AREA.y + y });

/** The builder: the preview on the left, the form on the right. */
const PREVIEW = { x: 30, y: 22, w: 380, h: 536 };
const FORM = { x: 440, y: 22, w: 485 };
const TILE = { y: 42, size: 34, pitch: 40 };
const NAME = { y: 114, h: 32 };
const BRIEF = { y: 180, h: 52 };
const LIST = { y: 266, row: 36 };
const CREATE = { y: 502, w: 130, h: 32 };

/** The conversation: messages stand on `CHAT_BOTTOM`; the composer sits under them. */
const CHAT_X = 30;
const CHAT_BOTTOM = 496;
const COMPOSER = { y: 512, h: 40, right: 925 };
/** A card's button sits 12px in from its left and bottom edges, the card under the agent's 22px face. */
const CARD_X = CHAT_X + 30;
const cardButton = (width: number) => at(CARD_X + 12 + width / 2, CHAT_BOTTOM - 12 - 14);

const ADD_BUTTON_W = 132;
const START_BUTTON_W = 150;

const SEND = at(COMPOSER.right - 6 - 14, COMPOSER.y + COMPOSER.h / 2);
const COMPOSER_TEXT = at(400, COMPOSER.y + COMPOSER.h / 2);

const KEYS: CursorKey[] = [
  { at: s(0.6), ...at(470, 360) },
  { at: T.pickFace, ...at(FORM.x + TILE.pitch + TILE.size / 2, TILE.y + TILE.size / 2), click: true },
  { at: T.nameFocus, ...at(FORM.x + 140, NAME.y + NAME.h / 2), click: true },
  { at: T.briefFocus, ...at(FORM.x + 160, BRIEF.y + BRIEF.h / 2), click: true },
  { at: T.togglePick, ...at(FORM.x + FORM.w - 26, LIST.y + 3 * LIST.row + LIST.row / 2), click: true },
  { at: T.togglePlan, ...at(FORM.x + FORM.w - 26, LIST.y + 4 * LIST.row + LIST.row / 2), click: true },
  { at: T.create, ...at(FORM.x + FORM.w - CREATE.w / 2, CREATE.y + CREATE.h / 2), click: true },
  { at: T.composer, ...COMPOSER_TEXT, click: true },
  { at: T.send1, ...SEND, click: true },
  { at: T.addPlan, ...cardButton(ADD_BUTTON_W), click: true },
  { at: T.type2[0] - s(0.3), ...COMPOSER_TEXT },
  { at: T.send2, ...SEND, click: true },
  { at: T.send3, ...SEND, click: true },
  { at: T.send4, ...SEND, click: true },
  { at: T.startSim, ...cardButton(START_BUTTON_W), click: true },
  { at: s(33.0), ...at(620, 330) },
];

/* ── Small pieces ────────────────────────────────────────────────────────── */

/** Text typed between two frames, a character at a time. */
function typed(text: string, frame: number, [from, to]: readonly [number, number]) {
  const t = Math.max(0, Math.min(1, (frame - from) / (to - from)));
  return text.slice(0, Math.round(t * text.length));
}

function Caret({ frame, solid }: { frame: number; solid?: boolean }) {
  const on = solid || Math.floor(frame / 32) % 2 === 0;
  return <span className="ml-px inline-block h-[14px] w-px translate-y-[2px] bg-charcoal" style={{ opacity: on ? 1 : 0 }} />;
}

/**
 * The film's small faces (sidebar, chat, tiles) are drawn once and held: at
 * 15–24px their blink is invisible, and a live canvas per chat line was the
 * film's heaviest cost on phones. The builder's large preview face stays alive.
 * Memoised: the film re-renders every frame, and a face's props never change
 * within a shot, so each one renders once instead of sixty times a second.
 */
const Face = memo(function Face({ type, color, size }: { type: BotAvatarType; color?: string; size: number }) {
  return <BotAvatar type={type} color={color} size={size} interactive={false} turn={0} paused aria-hidden />;
});

const AgentFace = memo(function AgentFace({ size }: { size: number }) {
  return <Face type={AGENT.face} color={AGENT.color} size={size} />;
});

/** The house switch, film-sized: electric blue when on. */
function Switch({ on }: { on: number }) {
  return (
    <span className="relative block h-[14px] w-[24px] shrink-0 rounded-full" style={{ background: on > 0.5 ? "#2563eb" : "#d4d4d4" }}>
      <span className="absolute top-[2px] size-[10px] rounded-full bg-white shadow-sm" style={{ left: 2 + on * 10 }} />
    </span>
  );
}

/** A row that opens from nothing, pushing what is under it down. */
function Grow({ t, children, className }: { t: number; children: React.ReactNode; className?: string }) {
  if (t <= 0) return null;
  return (
    <div className={cn("grid", className)} style={{ gridTemplateRows: `${t}fr` }}>
      <div className="min-h-0 overflow-hidden" style={{ opacity: t, transform: `translateY(${(1 - t) * 6}px)` }}>
        {children}
      </div>
    </div>
  );
}

/* ── The sidebar ─────────────────────────────────────────────────────────── */

const TEAM: Array<{ name: string; type: BotAvatarType }> = [
  { name: "Korepetytor", type: "circle" },
  { name: "Korektor", type: "clover" },
  { name: "Trener powtórek", type: "star" },
];

function SideRow({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-[26px] items-center gap-2 rounded-[7px] px-2 text-[12px] leading-none",
        on ? "bg-[#e8f1fe] text-[#1d63d8]" : "text-slate",
      )}
    >
      {children}
    </div>
  );
}

function AgentSidebar({ frame }: { frame: number }) {
  const made = ramp(frame, T.create + 6, 16);
  const routine = ramp(frame, T.addPlan + 8, 16);
  const building = frame < T.chat;
  return (
    <div>
      <p className="flex h-[34px] items-start justify-between px-2 text-[14px] font-medium leading-none text-charcoal">
        Agenci
        <Plus className="size-[13px] text-slate" strokeWidth={2} />
      </p>
      <div className="space-y-[2px]">
        <SideRow on={building}>
          <Plus className="size-[13px] shrink-0" strokeWidth={1.75} />
          Nowy agent
        </SideRow>
        <Grow t={made}>
          <SideRow on={!building}>
            <AgentFace size={15} />
            <span className="truncate">{AGENT.name}</span>
          </SideRow>
        </Grow>
        {TEAM.map((agent) => (
          <SideRow key={agent.name} on={false}>
            <Face type={agent.type} size={15} />
            <span className="truncate">{agent.name}</span>
          </SideRow>
        ))}
      </div>
      <NavHeading>Rutyny</NavHeading>
      <div className="space-y-[2px]">
        <SideRow on={false}>
          <RefreshCcw className="size-[13px] shrink-0" strokeWidth={1.75} />
          Powtórki
          <span className="ml-auto text-[10px] text-silver">codziennie</span>
        </SideRow>
        <Grow t={routine}>
          <SideRow on={false}>
            <CalendarClock className="size-[13px] shrink-0" strokeWidth={1.75} />
            Nierówności
            <span className="ml-auto text-[10px] text-silver">Pn Śr Pt</span>
          </SideRow>
        </Grow>
      </div>
    </div>
  );
}

/* ── Chapter 1: the builder ──────────────────────────────────────────────── */

function Builder({ frame }: { frame: number }) {
  const face = frame >= T.pickFace ? FACES[1] : FACES[0];
  const name = typed(AGENT.name, frame, T.nameType);
  const brief = typed(AGENT.brief, frame, T.briefType);
  const nameFocused = frame >= T.nameFocus && frame < T.briefFocus;
  const briefFocused = frame >= T.briefFocus && frame < T.togglePick - s(0.3);
  const switches = PERMISSIONS.map((p) => (p.on === undefined ? 0 : p.on === 0 ? 1 : ramp(frame, p.on, 10)));
  const pressed = frame >= T.create && frame < T.create + 8;
  const hop = frame >= T.pickFace && frame < T.pickFace + s(1.2);

  return (
    <div className="absolute inset-0">
      {/* Preview */}
      <div
        className="absolute flex flex-col items-center justify-center overflow-hidden rounded-[12px] border border-ash bg-paper-mist px-6 text-center"
        style={{ left: PREVIEW.x, top: PREVIEW.y, width: PREVIEW.w, height: PREVIEW.h }}
      >
        <div
          className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-ash)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ash)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(closest-side,black,transparent)]"
        />
        <span className="absolute left-3.5 top-3 text-[9.5px] font-medium uppercase tracking-wider text-fog">Podgląd</span>
        <div className="relative flex flex-col items-center">
          <span className="mb-1 flex translate-x-8 flex-col items-center">
            <span className="whitespace-nowrap rounded-full border border-ash bg-white px-2 py-[3px] text-[10.5px] font-medium leading-4 text-charcoal shadow-sm">
              Gotowy do pracy!
            </span>
            <span className="mt-1 size-[6px] -translate-x-1 rounded-full border border-smoke bg-white" />
            <span className="mt-0.5 size-[4px] -translate-x-2.5 rounded-full border border-smoke bg-white" />
          </span>
          {/* Alive only while it hops: a still face costs nothing, a moving one redraws its shading every frame */}
          <BotAvatar key={face.type} type={face.type} color={face.color} size={100} state={hop ? "working" : "default"} paused={!hop} interactive={false} aria-hidden />
        </div>
        <p className={cn("relative mt-3 text-[20px] font-medium", name ? "text-charcoal" : "text-silver")}>{name || "Twój agent"}</p>
        <p className={cn("relative mt-1 h-[40px] max-w-[290px] text-[12px] leading-[20px]", brief ? "text-fog" : "text-silver")}>
          {brief || "Tu pojawi się opis tego, czym się zajmuje."}
        </p>
        <div className="relative mt-3 flex max-w-[320px] flex-wrap justify-center gap-1">
          {PERMISSIONS.map((p, i) =>
            switches[i] > 0.5 ? (
              <span key={p.label} className="inline-flex items-center gap-1 rounded-[5px] border border-ash bg-white px-1.5 py-[2px] text-[10px] text-steel">
                <p.icon className="size-[10px] text-fog" strokeWidth={2} />
                {p.label}
              </span>
            ) : null,
          )}
        </div>
      </div>

      {/* Form */}
      <div className="absolute" style={{ left: FORM.x, top: FORM.y, width: FORM.w }}>
        <p className="text-[11.5px] font-medium leading-none text-steel">Twarz</p>
        <div className="absolute flex" style={{ top: TILE.y - FORM.y, gap: TILE.pitch - TILE.size }}>
          {FACES.map((option) => (
            <span
              key={option.type}
              className={cn(
                "grid place-items-center rounded-[8px] border bg-white",
                option === face ? "border-charcoal ring-1 ring-charcoal" : "border-ash",
              )}
              style={{ width: TILE.size, height: TILE.size }}
            >
              <Face type={option.type} color={option.color} size={20} />
            </span>
          ))}
        </div>

        <p className="absolute text-[11.5px] font-medium leading-none text-steel" style={{ top: NAME.y - FORM.y - 18 }}>
          Nazwa
        </p>
        <div
          className={cn("absolute flex w-full items-center rounded-[8px] border bg-white px-2.5 text-[12.5px]", nameFocused ? "border-steel ring-[3px] ring-ash/60" : "border-ash")}
          style={{ top: NAME.y - FORM.y, height: NAME.h }}
        >
          {name ? <span className="text-charcoal">{name}</span> : <span className="text-silver">Np. Trener ciągów</span>}
          {nameFocused && <Caret frame={frame} solid={frame < T.nameType[1]} />}
        </div>

        <p className="absolute text-[11.5px] font-medium leading-none text-steel" style={{ top: BRIEF.y - FORM.y - 18 }}>
          Czym ma się zajmować
        </p>
        <div
          className={cn("absolute w-full rounded-[8px] border bg-white px-2.5 py-[7px] text-[12.5px] leading-[18px]", briefFocused ? "border-steel ring-[3px] ring-ash/60" : "border-ash")}
          style={{ top: BRIEF.y - FORM.y, height: BRIEF.h }}
        >
          {brief ? <span className="text-charcoal">{brief}</span> : <span className="text-silver">Np. Ćwiczy ze mną ciągi i sprawdza moje rozwiązania.</span>}
          {briefFocused && <Caret frame={frame} solid={frame < T.briefType[1]} />}
        </div>

        <p className="absolute text-[11.5px] font-medium leading-none text-steel" style={{ top: LIST.y - FORM.y - 18 }}>
          Uprawnienia
        </p>
        <div className="absolute w-full divide-y divide-ash overflow-hidden rounded-[10px] border border-ash bg-white" style={{ top: LIST.y - FORM.y }}>
          {PERMISSIONS.map((p, i) => (
            <div key={p.label} className="flex items-center gap-2.5 px-3" style={{ height: LIST.row - (i === 0 ? 1 : 0) }}>
              <span className="grid size-[22px] shrink-0 place-items-center rounded-[6px] border border-ash bg-canvas-muted">
                <p.icon className={cn("size-[11px]", switches[i] > 0.5 ? "text-charcoal" : "text-silver")} strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-[11.5px] font-medium leading-[14px]", switches[i] > 0.5 ? "text-charcoal" : "text-fog")}>{p.label}</span>
                <span className="block truncate text-[10px] leading-[13px] text-fog">{p.detail}</span>
              </span>
              <Switch on={switches[i]} />
            </div>
          ))}
        </div>

        <span
          className="absolute right-0 inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-charcoal text-[12px] font-medium text-white"
          style={{ top: CREATE.y - FORM.y, width: CREATE.w, height: CREATE.h, transform: pressed ? "scale(0.97)" : undefined, opacity: pressed ? 0.85 : 1 }}
        >
          <Plus className="size-[13px]" strokeWidth={2.25} />
          Utwórz agenta
        </span>
      </div>
    </div>
  );
}

/* ── Chapters 2–4: the conversation ──────────────────────────────────────── */

type Card = "routine" | "task" | "check" | "sim" | "score";
type Line =
  | { at: number; kind: "agent"; text: React.ReactNode; typingFrom?: number }
  | { at: number; kind: "me"; text: string }
  | { at: number; kind: "day"; text: string }
  | { at: number; kind: "card"; card: Card; typingFrom?: number };

const ASK = "Matura 5 maja. Chcę ćwiczyć nierówności trzy razy w tygodniu.";
const STEP_1 = "6x² − 11x + 3 < 0";
const STEP_2 = "Δ = 121 − 72 = 49";
const STEP_3 = "x ∈ (1/3, 3/2)";

const LINES: Line[] = [
  { at: s(9.9), kind: "agent", text: "Cześć! W czym mogę pomóc?" },
  { at: T.send1 + 3, kind: "me", text: ASK },
  { at: s(14.7), typingFrom: s(13.5), kind: "agent", text: "Ułożyłem rutynę na nierówności. Zadania biorę z oryginalnych arkuszy CKE." },
  { at: s(15.1), kind: "card", card: "routine" },
  { at: T.monday, kind: "day", text: "Poniedziałek, 18:00" },
  { at: s(17.9), kind: "agent", text: "Czas na rutynę. Zadanie 10 z matury 2025:" },
  { at: s(18.2), kind: "card", card: "task" },
  { at: T.send2 + 3, kind: "me", text: STEP_1 },
  { at: s(21.9), typingFrom: s(21.0), kind: "agent", text: "Dobrze. Teraz wyróżnik — ile wynosi Δ?" },
  { at: T.send3 + 3, kind: "me", text: STEP_2 },
  { at: s(25.3), typingFrom: s(24.5), kind: "agent", text: "Zgadza się. Policz pierwiastki i zaznacz, gdzie parabola jest pod osią." },
  { at: T.send4 + 3, kind: "me", text: STEP_3 },
  { at: s(28.5), typingFrom: s(27.7), kind: "card", card: "check" },
  { at: T.saturday, kind: "day", text: "Sobota, 9:00" },
  { at: s(30.5), kind: "agent", text: "Gotowy na próbę? Cały arkusz, jak na maturze." },
  { at: s(30.8), kind: "card", card: "sim" },
  { at: T.handedIn, kind: "day", text: "Sobota, 11:21" },
  { at: s(35.3), typingFrom: s(34.8), kind: "card", card: "score" },
  { at: s(36.3), kind: "agent", text: "Najwięcej punktów uciekło na stereometrii i planimetrii. Dodałem je do poniedziałkowej rutyny." },
];

/** What the composer holds right now, and whether it is being typed. */
const DRAFTS: Array<{ text: string; type: readonly [number, number]; send: number }> = [
  { text: ASK, type: T.type1, send: T.send1 },
  { text: STEP_1, type: T.type2, send: T.send2 },
  { text: STEP_2, type: T.type3, send: T.send3 },
  { text: STEP_3, type: T.type4, send: T.send4 },
];

/** The points the sitting lost, by topic — the walkthrough's report, worst first. */
const LOST = [
  { topic: "Stereometria", lost: 2 },
  { topic: "Planimetria", lost: 2 },
  { topic: "Statystyka", lost: 2 },
];

function TypingDots({ frame }: { frame: number }) {
  return (
    <span className="flex h-[34px] w-fit items-center gap-[5px] rounded-[16px] rounded-bl-[6px] bg-paper-mist px-3.5">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="size-[6px] rounded-full bg-fog"
          style={{ opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((frame / FPS) * Math.PI * 2.6 - dot * 0.9)) }}
        />
      ))}
    </span>
  );
}

function CardFrame({ width, children }: { width: number; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-ash bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]" style={{ width }}>
      {children}
    </div>
  );
}

function CardButton({ width, pressed, done, children }: { width: number; pressed: boolean; done: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-[28px] items-center justify-center gap-1.5 rounded-[7px] text-[11.5px] font-medium leading-none",
        done ? "border border-ash bg-white text-steel" : "bg-charcoal text-white",
      )}
      style={{ width, transform: pressed ? "scale(0.97)" : undefined, opacity: pressed ? 0.85 : 1 }}
    >
      {done || children}
    </span>
  );
}

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const ON_DAYS = new Set(["Pn", "Śr", "Pt"]);

function RoutineCard({ frame }: { frame: number }) {
  const added = frame >= T.addPlan + 6;
  return (
    <CardFrame width={330}>
      <p className="flex h-[20px] items-center gap-2 text-[12.5px] font-medium text-charcoal">
        <CalendarClock className="size-[13px] text-slate" strokeWidth={1.75} />
        Rutyna · Nierówności kwadratowe
      </p>
      <div className="mt-[10px] grid h-[24px] grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <span
            key={day}
            className={cn(
              "grid place-items-center rounded-[6px] border text-[10.5px] font-medium",
              ON_DAYS.has(day) ? "border-charcoal text-charcoal ring-1 ring-charcoal" : "border-ash text-silver",
            )}
          >
            {day}
          </span>
        ))}
      </div>
      <p className="mt-2 h-[14px] text-[11px] leading-[14px] text-fog">18:00 · 20 min · zadania z arkuszy CKE</p>
      <div className="mt-3">
        <CardButton
          width={ADD_BUTTON_W}
          pressed={frame >= T.addPlan && frame < T.addPlan + 8}
          done={
            added ? (
              <>
                <Check className="size-[12px]" strokeWidth={2.5} />
                Dodano
              </>
            ) : null
          }
        >
          <Route className="size-[12px]" strokeWidth={2} />
          Dodaj do roadmapy
        </CardButton>
      </div>
    </CardFrame>
  );
}

function TaskCard() {
  return (
    <CardFrame width={380}>
      <p className="flex items-center gap-2 text-[11px] text-fog">
        <MaturaIcon className="h-[11px] w-[15px]" />
        Arkusz CKE · maj 2025
        <span className="ml-auto font-medium text-steel">Zadanie 10 · 0–2 pkt</span>
      </p>
      <p className="mt-2.5 text-[13.5px] leading-[22px] text-charcoal">
        Rozwiąż nierówność{" "}
        <span className="whitespace-nowrap">
          3(2<V>x</V>
          <sup>2</sup> + 1) &lt; 11<V>x</V>
        </span>
        .
      </p>
    </CardFrame>
  );
}

function CheckCard() {
  const rows: React.ReactNode[] = [
    <>
      6<V>x</V>
      <sup>2</sup> − 11<V>x</V> + 3 &lt; 0
    </>,
    <>
      Δ = 49, <V>x</V>
      <sub>1</sub> = <Frac n="1" d="3" />, <V>x</V>
      <sub>2</sub> = <Frac n="3" d="2" />
    </>,
    <>
      <V>x</V> ∈ (<Frac n="1" d="3" />, <Frac n="3" d="2" />)
    </>,
  ];
  return (
    <CardFrame width={300}>
      <p className="flex items-center justify-between text-[12.5px] font-medium text-charcoal">
        Zadanie 10
        <StatusPill status="done" label="2 / 2 pkt" />
      </p>
      <div className="mt-2 space-y-1">
        {rows.map((row, i) => (
          <p key={i} className="flex min-h-[24px] items-center gap-2 text-[12.5px] text-graphite">
            <Check className="size-[12px] shrink-0 text-[#16a34a]" strokeWidth={2.5} />
            <span>{row}</span>
          </p>
        ))}
      </div>
    </CardFrame>
  );
}

/** Minutes left on the paper's clock, as m:ss. */
function clock(minutes: number) {
  const whole = Math.max(0, minutes);
  const m = Math.floor(whole);
  const sec = Math.floor((whole - m) * 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function SimCard({ frame }: { frame: number }) {
  const started = frame >= T.startSim + 6;
  // The sitting runs at speed: tasks tick over, the bar fills, the clock
  // runs from 180:00 down to the 39 minutes left at the hand-in.
  const lapse = interpolate(frame, [T.lapse[0], T.lapse[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const task = Math.max(1, Math.round(lapse * SITTING.tasks));
  const left = SITTING.examMinutes - lapse * SITTING.minutes;
  const done = frame >= T.lapse[1] + 6;
  return (
    <CardFrame width={330}>
      <p className="flex h-[20px] items-center gap-2 text-[12.5px] font-medium text-charcoal">
        <MaturaIcon className="h-[12px] w-[16px]" />
        {SITTING.exam} · {SITTING.subject}
      </p>
      <p className="mt-1.5 h-[14px] text-[11px] leading-[14px] text-fog">
        {SITTING.level} · {SITTING.tasks} zadań · {SITTING.max} pkt · {SITTING.examMinutes} min
      </p>
      <div className="mt-3 h-[28px]">
        {!started ? (
          <CardButton width={START_BUTTON_W} pressed={frame >= T.startSim && frame < T.startSim + 8} done={null}>
            <Timer className="size-[12px]" strokeWidth={2} />
            Rozpocznij symulację
          </CardButton>
        ) : done ? (
          <span className="flex h-full items-center gap-2">
            <StatusPill status="done" label={`Oddano · ${SITTING.minutes} min`} />
          </span>
        ) : (
          <span className="flex h-full items-center gap-2.5 text-[11px] tabular-nums text-steel">
            <FastForward className="size-[12px] shrink-0 text-fog" strokeWidth={2} />
            <span className="w-[88px] shrink-0 whitespace-nowrap">
              Zadanie {task}/{SITTING.tasks}
            </span>
            <span className="h-[4px] flex-1 overflow-hidden rounded-full bg-paper-mist">
              <span className="block h-full rounded-full bg-charcoal" style={{ width: `${lapse * 100}%` }} />
            </span>
            <span className="w-[40px] shrink-0 text-right">{clock(left)}</span>
          </span>
        )}
      </div>
    </CardFrame>
  );
}

function ScoreCard({ frame, from }: { frame: number; from: number }) {
  const fill = ramp(frame, from + 6, 40);
  return (
    <CardFrame width={330}>
      <p className="flex items-center gap-2 text-[11px] text-fog">
        <MaturaIcon className="h-[11px] w-[15px]" />
        {SITTING.exam} · wynik symulacji
        <span className="ml-auto tabular-nums">{SITTING.minutes} min</span>
      </p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="text-[22px] font-semibold tabular-nums leading-none text-charcoal">
          {SITTING.score}/{SITTING.max} pkt
        </span>
        <span className="text-[13px] font-medium tabular-nums" style={{ color: SITTING.metrics[1].color }}>
          {SITTING.percent}%
        </span>
      </p>
      <div className="mt-2.5 h-[6px] overflow-hidden rounded-full bg-paper-mist">
        <div className="h-full rounded-full" style={{ width: `${SITTING.percent * fill}%`, background: SITTING.metrics[0].color }} />
      </div>
      <div className="mt-2.5 divide-y divide-ash border-t border-ash">
        {LOST.map((row) => (
          <p key={row.topic} className="flex h-[26px] items-center text-[11.5px]">
            <span className="text-steel">{row.topic}</span>
            <span className="ml-auto font-medium tabular-nums text-charcoal">−{row.lost} pkt</span>
          </p>
        ))}
      </div>
    </CardFrame>
  );
}

function LineView({ line, frame }: { line: Line; frame: number }) {
  if (line.kind === "day") {
    return <p className="py-1 text-center text-[11px] text-fog">{line.text}</p>;
  }
  if (line.kind === "me") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[440px] rounded-[16px] rounded-br-[6px] bg-charcoal px-3.5 py-2 text-[13px] leading-[20px] text-white">{line.text}</p>
      </div>
    );
  }
  const typing = line.typingFrom !== undefined && frame < line.at;
  const card =
    line.kind === "card"
      ? {
          routine: <RoutineCard frame={frame} />,
          task: <TaskCard />,
          check: <CheckCard />,
          sim: <SimCard frame={frame} />,
          score: <ScoreCard frame={frame} from={line.at} />,
        }[line.card]
      : null;
  return (
    <div className="flex items-end gap-2">
      <span className="shrink-0" style={{ width: 22, height: 22 }}>
        <AgentFace size={22} />
      </span>
      {typing ? (
        <TypingDots frame={frame} />
      ) : card ? (
        card
      ) : (
        <p className="max-w-[480px] rounded-[16px] rounded-bl-[6px] bg-paper-mist px-3.5 py-2 text-[13px] leading-[20px] text-graphite">
          {line.kind === "agent" ? line.text : null}
        </p>
      )}
    </div>
  );
}

function Conversation({ frame }: { frame: number }) {
  const draft = DRAFTS.find((d) => frame >= d.type[0] && frame < d.send + 3);
  const text = draft ? typed(draft.text, frame, draft.type) : "";
  const focused = frame >= T.composer && frame < T.send4 + s(0.4);
  const sending = DRAFTS.some((d) => frame >= d.send && frame < d.send + 8);
  const toastPlan = ramp(frame, T.addPlan + 12, 14) * (1 - ramp(frame, T.addPlan + s(2.6), 14));
  const toastReplan = ramp(frame, T.replan, 14) * (1 - ramp(frame, T.replan + s(2.8), 14));

  return (
    <div className="absolute inset-0">
      <div className="absolute flex flex-col justify-end gap-3 overflow-hidden" style={{ left: CHAT_X, right: 30, top: 0, height: CHAT_BOTTOM }}>
        {LINES.map((line, i) => {
          const from = line.kind === "agent" || line.kind === "card" ? (line.typingFrom ?? line.at) : line.at;
          return (
            <Grow key={i} t={ramp(frame, from, 14)}>
              <LineView line={line} frame={frame} />
            </Grow>
          );
        })}
      </div>

      {/* Composer */}
      <div
        className={cn(
          "absolute flex items-center gap-2.5 rounded-full border bg-white pl-1.5 pr-1.5",
          focused ? "border-smoke" : "border-ash",
        )}
        style={{ left: CHAT_X, width: COMPOSER.right - CHAT_X, top: COMPOSER.y, height: COMPOSER.h }}
      >
        <span className="grid size-[28px] shrink-0 place-items-center rounded-full bg-paper-mist text-steel">
          <Plus className="size-[14px]" strokeWidth={2} />
        </span>
        <p className="min-w-0 flex-1 truncate text-[13px] leading-5">
          {text ? <span className="text-charcoal">{text}</span> : <span className="text-silver">Napisz do: {AGENT.name}</span>}
          {focused && <Caret frame={frame} solid={Boolean(draft) && frame < (draft?.type[1] ?? 0)} />}
        </p>
        <span
          className={cn("grid size-[28px] shrink-0 place-items-center rounded-full text-white", text ? "bg-charcoal" : "bg-ash")}
          style={{ transform: sending ? "scale(0.92)" : undefined }}
        >
          <ArrowUp className="size-[14px]" strokeWidth={2.25} />
        </span>
      </div>

      {/* Toasts */}
      <Toast t={toastPlan} title="Dodano do roadmapy" detail="Nierówności · Pn, Śr, Pt · 18:00" />
      <Toast t={toastReplan} title="Roadmapa zaktualizowana" detail="+ Stereometria, Planimetria" />
    </div>
  );
}

function Toast({ t, title, detail }: { t: number; title: string; detail: string }) {
  if (t <= 0) return null;
  return (
    <div
      className="absolute right-[30px] top-[14px] flex items-center gap-2.5 rounded-[10px] border border-ash bg-white py-2 pl-2 pr-3.5 shadow-md"
      style={{ opacity: t, transform: `translateY(${(1 - t) * -8}px)` }}
    >
      <AccentTile icon={Route} accent="blue" size="sm" />
      <span>
        <span className="block text-[12px] font-medium leading-4 text-charcoal">{title}</span>
        <span className="block text-[10.5px] leading-[14px] text-fog">{detail}</span>
      </span>
    </div>
  );
}

/* ── The film ────────────────────────────────────────────────────────────── */

function Film() {
  const frame = useFrame();
  const building = frame < T.chat;
  const builder = 1 - ramp(frame, T.chat - s(0.5), 16);
  const chat = ramp(frame, T.chat, 18);
  const out = ramp(frame, T.fade, 50);

  return (
    <AbsoluteFill>
      <Shell
        framed={false}
        rail="agenci"
        sidebar={<AgentSidebar frame={frame} />}
        title={
          building ? (
            "Nowy agent"
          ) : (
            <span className="flex items-center gap-2">
              <AgentFace size={18} />
              {AGENT.name}
            </span>
          )
        }
        titleKey={building ? "build" : "chat"}
        headerRight={
          !building && frame >= T.addPlan + 6 ? (
            <Chip icon={CalendarClock} className="tabular-nums">
              Pn · Śr · Pt · 18:00
            </Chip>
          ) : undefined
        }
      >
        {builder > 0 && building && (
          <div className="absolute inset-0" style={{ opacity: builder }}>
            <Builder frame={frame} />
          </div>
        )}
        {chat > 0 && (
          <div className="absolute inset-0" style={{ opacity: chat }}>
            <Conversation frame={frame} />
          </div>
        )}
      </Shell>
      <Cursor keys={KEYS} />
      {/* The loop closes on white, and the builder comes back up out of it */}
      <div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: out * 0.9 + interpolate(frame, [0, 10], [0.9, 0], { extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
}

function Composition() {
  return (
    <AbsoluteFill>
      <FrameBridge>
        <Film />
      </FrameBridge>
    </AbsoluteFill>
  );
}

/** The still: Zadanie 10 just marked, for reduced motion and until the first frame lands. */
const POSTER_FRAME = s(29.4);

function Poster() {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-full w-full" aria-hidden>
      <foreignObject width={WIDTH} height={HEIGHT}>
        <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
          <FrameAt frame={POSTER_FRAME}>
            <Film />
          </FrameAt>
        </div>
      </foreignObject>
    </svg>
  );
}

/* ── On the page ─────────────────────────────────────────────────────────── */

/**
 * The film in its window with the chapter strip under it, as /simulation's
 * walkthrough: it plays while on screen and pauses when scrolled away; the
 * strip follows the film, and a click jumps to that chapter. No transport
 * controls. Reduced motion shows the still.
 */
export function AgentFilm() {
  const reducedMotion = useReducedMotion();
  const player = useRef<PlayerRef>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const current = player.current;
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
  }, [reducedMotion]);

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
          Praca z agentem w Examaksie: tworzenie agenta z twarzą, nazwą i uprawnieniami, rutyna nauki nierówności dodana do roadmapy, zadanie 10
          z matury 2025 rozwiązane krok po kroku — agent tylko zadaje pytania — i pełna symulacja: 42 z 50 punktów w 141 minut, a najsłabsze
          działy trafiają do rutyny.
        </figcaption>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {reducedMotion ? (
            <Poster />
          ) : (
            <>
              <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: ready ? 0 : 1 }}>
                <Poster />
              </div>
              <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: ready ? 1 : 0 }}>
                <Player
                  ref={player}
                  component={Composition}
                  durationInFrames={LOOP}
                  fps={FPS}
                  compositionWidth={WIDTH}
                  compositionHeight={HEIGHT}
                  style={{ width: "100%", height: "100%" }}
                  loop
                  controls={false}
                  clickToPlay={false}
                  doubleClickToFullscreen={false}
                  spaceKeyToPlayOrPause={false}
                  acknowledgeRemotionLicense
                  renderLoading={() => <Poster />}
                  initiallyMuted
                  numberOfSharedAudioTags={0}
                />
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
                )}
              >
                <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-[#eab308]/80" style={{ transform: `scaleX(${share})`, transformOrigin: "left" }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
