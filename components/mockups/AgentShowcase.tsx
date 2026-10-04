"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp, Check, PanelRight, Plus, Search, X } from "lucide-react";
import { BorderBeam } from "border-beam";
import { BotAvatar, type BotAvatarType } from "bot-avatars";
import { TextShimmer } from "@/components/ui/TextShimmer";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * The Agent section's picture: the learner's team of agents in one window,
 * after Grok Bot's own (x.ai/bot, read off its live page and
 * `DesignRules/Agent window _ Grok Bot.png`) — a sidebar of agents, each with
 * its last line and time, and the open conversation beside it. Drawn in the
 * light palette of this page, not Grok's grey.
 *
 * Every agent is its own tutor with one job. Each has a question waiting in
 * the composer; nothing plays until the visitor clicks Send. The reply then
 * arrives the way a person's would — the row says "Pisze…", the agent
 * thinks, and its messages land one at a time, unhurried.
 * Reduced motion shows each reply finished, the moment it is sent.
 * PLACEHOLDER COPY — the learner, tasks and figures are illustrative.
 */

/* ------------------------------------------------------------------------ */
/* Messages                                                                  */
/* ------------------------------------------------------------------------ */

type AgentKey = "checker" | "tutor" | "planner" | "navigator" | "examiner" | "coach" | "team";

/** A line of a checklist: done or missed, a bold key, then what happened. */
type Row = { key: string; value: string; missed?: boolean };

type Item =
  | { kind: "text"; text: React.ReactNode; from?: AgentKey }
  | { kind: "list"; rows: Row[]; from?: AgentKey }
  | { kind: "card"; card: "working" | "score"; from?: AgentKey };

type Agent = {
  key: AgentKey;
  name: string;
  /** One body per agent; a group shows its members. */
  avatar: BotAvatarType | BotAvatarType[];
  time: string;
  preview: string;
  history: Item[];
  prompt: string;
  reply: Item[];
  replyPreview: string;
};

function Formula({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap font-geist-mono text-[13px]">{children}</span>;
}

const AGENTS: Agent[] = [
  {
    key: "checker",
    name: "Korektor",
    avatar: "clover",
    time: "18:42",
    preview: "Wrzuć zadanie, sprawdzę je linijka po linijce.",
    history: [{ kind: "text", text: "Cześć Adam! Wrzuć zadanie, a sprawdzę je linijka po linijce." }],
    prompt: "Sprawdzisz zadanie 12? Wyszło mi x = 3,5, a w odpowiedziach jest 5.",
    reply: [
      { kind: "text", text: "Mam je. Pomyliłeś się w drugiej linijce — przy mnożeniu nawiasu." },
      { kind: "card", card: "working" },
      {
        kind: "text",
        text: (
          <>
            Liczba przed nawiasem mnoży <b className="font-semibold">każdy</b> wyraz: <Formula>2(x − 3) = 2x − 6</Formula>.
            Dorzuciłem 3 podobne zadania do Twojej kolejki.
          </>
        ),
      },
    ],
    replyPreview: "Dorzuciłem 3 podobne zadania do Twojej kolejki.",
  },
  {
    key: "tutor",
    name: "Korepetytor",
    avatar: "circle",
    time: "Wczoraj",
    preview: "Logarytmy ogarnięte. Jutro wracamy do delty?",
    history: [{ kind: "text", text: "Logarytmy ogarnięte. Jutro wracamy do delty?" }],
    prompt: "Wytłumacz mi deltę na przykładzie, bo nie łapię, po co się ją liczy.",
    reply: [
      { kind: "text", text: "Delta mówi, ile rozwiązań ma równanie kwadratowe. Weźmy x² − 5x + 6 = 0:" },
      {
        kind: "list",
        rows: [
          { key: "Wzór", value: "Δ = b² − 4ac" },
          { key: "Liczymy", value: "Δ = 25 − 24 = 1" },
          { key: "Wynik", value: "Δ > 0, więc dwa rozwiązania: x = 2 i x = 3" },
        ],
      },
      { kind: "text", text: "Podstaw oba i sprawdź. Pokazać jeszcze, co się dzieje, gdy Δ < 0?" },
    ],
    replyPreview: "Pokazać jeszcze, co się dzieje, gdy Δ < 0?",
  },
  {
    key: "planner",
    name: "Agent maturalny",
    avatar: "cat",
    time: "pon.",
    preview: "Do matury zostało 21 dni. Zrobimy plan?",
    history: [{ kind: "text", text: "Do matury zostało 21 dni. Zrobimy plan?" }],
    prompt: "Zostały mi 3 tygodnie. Od czego zacząć, żeby zdobyć najwięcej punktów?",
    reply: [
      { kind: "text", text: "Najwięcej zyskasz tam, gdzie teraz tracisz punkty. Przejrzałem Twoje arkusze:" },
      {
        kind: "list",
        rows: [
          { key: "Tydzień 1", value: "funkcja kwadratowa · tracisz tu 6 pkt" },
          { key: "Tydzień 2", value: "ciągi i procenty · szybkie punkty" },
          { key: "Tydzień 3", value: "dwa arkusze na czas" },
        ],
      },
      { kind: "text", text: "Plan jest już w Twojej roadmapie. Szacuję wzrost z 68% do 81%." },
    ],
    replyPreview: "Plan jest już w Twojej roadmapie.",
  },
  {
    key: "navigator",
    name: "Nawigator",
    avatar: "triangle",
    time: "17:10",
    preview: "Ciągi masz na 64%. Zostajemy przy nich?",
    history: [{ kind: "text", text: "Ciągi masz na 64%. Zostajemy przy nich w tym tygodniu?" }],
    prompt: "Mam mało czasu w tym tygodniu. Przestawisz mi roadmapę?",
    reply: [
      { kind: "text", text: "Jasne. Masz 4 godziny do niedzieli, więc przestawiłem kolejność:" },
      {
        kind: "list",
        rows: [
          { key: "Ciągi", value: "przed geometrię · krótsze, szybciej dobijesz" },
          { key: "Bryły", value: "na przyszły tydzień" },
          { key: "Procenty", value: "15 min powtórki w czwartek" },
        ],
      },
      { kind: "text", text: "Roadmapa zaktualizowana. Nic nie przepadło, zmieniła się tylko kolejność." },
    ],
    replyPreview: "Roadmapa zaktualizowana.",
  },
  {
    key: "examiner",
    name: "Egzaminator",
    avatar: "droid",
    time: "12:06",
    preview: "Arkusz próbny gotowy. 170 minut, bez podpowiedzi.",
    history: [{ kind: "text", text: "Arkusz próbny gotowy: 170 minut, bez podpowiedzi. Powodzenia." }],
    prompt: "Oddaję arkusz. Sprawdzisz według zasad CKE?",
    reply: [
      { kind: "text", text: "Sprawdzone według kluczy CKE, zadanie po zadaniu:" },
      { kind: "card", card: "score" },
      { kind: "text", text: "Najwięcej uciekło w zadaniu 31 — zabrakło uzasadnienia. Rozpisałem je krok po kroku." },
    ],
    replyPreview: "Rozpisałem zadanie 31 krok po kroku.",
  },
  {
    key: "coach",
    name: "Trener powtórek",
    avatar: "star",
    time: "9:30",
    preview: "5 tematów czeka dziś na powtórkę.",
    history: [{ kind: "text", text: "Dzień dobry! 5 tematów czeka dziś na powtórkę." }],
    prompt: "Co powinienem dziś powtórzyć, jeśli mam pół godziny?",
    reply: [
      { kind: "text", text: "Wybrałem to, co zaczyna Ci uciekać z głowy:" },
      {
        kind: "list",
        rows: [
          { key: "Procenty", value: "5 zadań · 10 min" },
          { key: "Ciągi", value: "3 zadania · 10 min" },
          { key: "Logarytmy", value: "fiszki · 5 min" },
        ],
      },
      { kind: "text", text: "Razem 25 minut. Przypomnieć Ci o 18:00?" },
    ],
    replyPreview: "Razem 25 minut. Przypomnieć o 18:00?",
  },
  {
    key: "team",
    name: "Zespół maturalny",
    avatar: ["clover", "circle", "cat"],
    time: "11:06",
    preview: "Korektor, Korepetytor i Agent maturalny są tutaj.",
    history: [{ kind: "text", text: "Jesteśmy tu we trzech. Wrzuć, co mamy przejrzeć.", from: "planner" }],
    prompt: "Przejrzyjcie razem mój ostatni arkusz.",
    reply: [
      { kind: "text", text: "Trzy błędy rachunkowe, wszystkie przy nawiasach. Zaznaczyłem je.", from: "checker" },
      { kind: "text", text: "Dołożę krótką lekcję o mnożeniu nawiasów — 10 minut.", from: "tutor" },
      { kind: "text", text: "Wstawiłem ją do planu na jutro, przed nowym arkuszem.", from: "planner" },
    ],
    replyPreview: "Wstawiłem ją do planu na jutro.",
  },
];

const byKey = Object.fromEntries(AGENTS.map((a) => [a.key, a])) as Record<AgentKey, Agent>;

/** The team as /agents presents it — the same names and faces as this window, never a second list. */
export const AGENT_ROSTER = AGENTS.map(({ key, name, avatar }) => ({ key, name, avatar }));

/* ------------------------------------------------------------------------ */
/* Timing, in milliseconds from Send — unhurried on purpose                  */
/* ------------------------------------------------------------------------ */

const TICK = 50;
const THINK = 900;
const FIRST = THINK + 2600;
const GAP = 2400;

const replyAt = (i: number) => FIRST + i * GAP;
const endOf = (agent: Agent) => replyAt(agent.reply.length - 1) + 300;

/* ------------------------------------------------------------------------ */
/* Pieces                                                                    */
/* ------------------------------------------------------------------------ */

const GROUP_SPOTS = (size: number, small: number) => [
  { left: (size - small) / 2, top: -1 },
  { left: -1, top: size - small + 1 },
  { left: size - small + 1, top: size - small + 1 },
];

/**
 * An agent's face. It is always alive: the library's resting animation while
 * the agent is idle (looking about, the odd hop), its working one during a
 * task. Never paused — freezing a canvas mid-hop is what made them stop.
 * Off-screen canvases pause themselves, so this costs nothing out of view.
 */
function Face({
  avatar,
  size,
  working = false,
  seed = 0,
}: {
  avatar: Agent["avatar"];
  size: number;
  working?: boolean;
  seed?: number;
}) {
  if (Array.isArray(avatar)) {
    // A group: its members huddled in the one slot, as the reference draws it.
    // Like a single face, it sits on its own layer (see below).
    const small = Math.round(size * 0.58);
    const spots = GROUP_SPOTS(size, small);
    return (
      <span aria-hidden className="relative z-[1] block shrink-0" style={{ width: size, height: size }}>
        {avatar.map((type, i) => (
          <span key={type} className="absolute" style={spots[i]}>
            <BotAvatar type={type} size={small} interactive={false} seed={(seed + i / 3) % 1} />
          </span>
        ))}
      </span>
    );
  }
  // The canvas is half again the face's size and spills past its box (the
  // library's negative margins) to leave room for the hop. Its own layer keeps
  // anything painted after it — a bubble, the next row — from covering that.
  return (
    <span className="relative z-[1] inline-flex shrink-0">
      <BotAvatar
        type={avatar}
        size={size}
        state={working ? "working" : "default"}
        interactive={false}
        seed={seed}
        aria-hidden
      />
    </span>
  );
}

const BUBBLE = "w-fit max-w-[88%] rounded-2xl bg-paper-mist px-4 py-2.5 text-[14px] leading-[22px] text-charcoal";

function Checklist({ rows }: { rows: Row[] }) {
  return (
    <div className={BUBBLE}>
      {rows.map((row) => (
        <div key={row.key} className="flex items-baseline gap-1.5">
          {row.missed ? (
            <X className="size-3.5 shrink-0 translate-y-0.5 text-[#dc2626]" strokeWidth={2.5} />
          ) : (
            <Check className="size-3.5 shrink-0 translate-y-0.5" strokeWidth={2.5} />
          )}
          <span>
            <b className="font-semibold">{row.key}</b>
            <ArrowRight className="mx-1 inline size-3.5 -translate-y-px text-steel" strokeWidth={2} />
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A card in the thread, the reference's "Computer" block: a title over its body. */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-paper-mist p-3">
      <div className="px-1">
        <span className="text-[14px] font-semibold text-charcoal">{title}</span>
      </div>
      <div className="mt-2 overflow-hidden rounded-xl border border-ash bg-white">{children}</div>
    </div>
  );
}

const WORKING = [
  { n: 1, text: "2(x − 3) = 4" },
  { n: 2, text: "2x − 3 = 4", wrong: true },
  { n: 2, text: "2x − 6 = 4" },
  { n: 3, text: "x = 5", final: true },
];

function WorkingCard() {
  return (
    <Card title="Zadanie 12">
      {WORKING.map((line, i) => (
        <div
          key={i}
          className={cn(
            "flex h-8 items-center gap-3 border-ash px-3 [&:not(:first-child)]:border-t",
            line.wrong && "bg-[#fef2f2]",
          )}
        >
          <span className="w-2 text-[11px] tabular-nums text-silver">{line.n}</span>
          <span
            className={cn(
              "font-geist-mono text-[12px]",
              line.wrong ? "text-[#dc2626] line-through decoration-[#dc2626]/60" : "text-charcoal",
            )}
          >
            {line.text}
          </span>
          {line.wrong && <span className="ml-auto text-[10px] font-medium text-[#dc2626]">Błąd</span>}
          {line.final && <Check className="ml-auto size-3.5 text-[#16a34a]" strokeWidth={2.25} />}
        </div>
      ))}
    </Card>
  );
}

const SCORE_PARTS = [
  { label: "Zadania zamknięte", score: "18/20" },
  { label: "Zadania otwarte", score: "16/26" },
];

function ScoreCard() {
  return (
    <Card title="Arkusz próbny · Matura">
      <div className="px-3 py-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[20px] font-semibold tabular-nums text-charcoal">34/46 pkt</span>
          <span className="text-[13px] font-medium tabular-nums text-[#ca8a04]">74%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-mist">
          <div className="h-full w-[74%] rounded-full bg-charcoal" />
        </div>
      </div>
      {SCORE_PARTS.map((part) => (
        <div key={part.label} className="flex h-8 items-center border-t border-ash px-3 text-[12px]">
          <span className="text-steel">{part.label}</span>
          <span className="ml-auto font-medium tabular-nums text-charcoal">{part.score}</span>
        </div>
      ))}
    </Card>
  );
}

function Message({ item, group }: { item: Item; group: boolean }) {
  const body =
    item.kind === "text" ? (
      <p className={BUBBLE}>{item.text}</p>
    ) : item.kind === "list" ? (
      <Checklist rows={item.rows} />
    ) : item.card === "working" ? (
      <WorkingCard />
    ) : (
      <ScoreCard />
    );
  // In a group each message carries its sender, as a group chat does.
  if (!group || !item.from) return body;
  const sender = byKey[item.from];
  return (
    <div className="flex items-end gap-2">
      <Face avatar={sender.avatar} size={24} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="px-1 text-[11px] font-medium text-fog">{sender.name}</span>
        {body}
      </div>
    </div>
  );
}

/** Space that opens smoothly, so the thread grows rather than jumps. */
function Arrive({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        show ? "grid-rows-[1fr] translate-y-0 opacity-100" : "grid-rows-[0fr] translate-y-1 opacity-0",
      )}
    >
      {/* Clipped only while closed: once open, a hopping face may spill out. */}
      <div className={cn("min-h-0", show ? "overflow-visible" : "overflow-hidden")}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The sidebar's width                                                       */
/* ------------------------------------------------------------------------ */

/** Folded: a rail of faces. Below FULL the rows no longer fit their text. */
const RAIL = 68;
const FULL = 200;
const WIDE = 380;
const START = 272;

const clampWidth = (w: number) => Math.min(WIDE, Math.max(RAIL, w));
/** Where a drag settles: the rail, or wherever it was let go. */
const settle = (w: number) => (w < FULL ? RAIL : clampWidth(w));

/** The learner, as initials — no stock photography (DESIGN.md). */
function Learner({ withName }: { withName: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-ash bg-white text-[10px] font-semibold text-steel">
        AB
      </span>
      {withName && <span className="truncate text-[13px] text-charcoal">Adam Borowicz</span>}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* The window                                                                */
/* ------------------------------------------------------------------------ */

export function AgentShowcase() {
  const [activeKey, setActiveKey] = useState<AgentKey>("checker");
  // Each agent keeps its own clock, so a reply is where it was left.
  const [clocks, setClocks] = useState<Partial<Record<AgentKey, number>>>({});
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(START);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; w: number } | null>(null);
  const rail = width < FULL;

  const agent = byKey[activeKey];
  const group = Array.isArray(agent.avatar);
  const t = clocks[activeKey];
  const sent = t !== undefined;
  const end = endOf(agent);
  const running = sent && t < end;

  useEffect(() => {
    if (!running || !inView) return;
    const timer = window.setInterval(() => {
      setClocks((c) => ({ ...c, [activeKey]: (c[activeKey] ?? 0) + TICK }));
    }, TICK);
    return () => window.clearInterval(timer);
  }, [running, inView, activeKey]);

  // The newest line stays in view, as in any chat.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: sent ? "smooth" : "auto" });
  }, [t, activeKey, sent]);

  const send = () => {
    if (!sent) setClocks((c) => ({ ...c, [activeKey]: reducedMotion ? end : 0 }));
  };

  const shown = sent ? agent.reply.filter((_, i) => t >= replyAt(i)).length : 0;
  const thinking = sent && t >= THINK && shown < agent.reply.length;
  // Who speaks next — in a group, the member about to reply.
  const next = agent.reply[Math.min(shown, agent.reply.length - 1)];
  const speaker = group && next.from ? byKey[next.from] : agent;

  /** A row's last line and time, as the sidebar shows it. */
  const status = (a: Agent) => {
    const ct = clocks[a.key];
    if (ct === undefined) return { preview: a.preview, time: a.time, typing: false };
    if (ct < endOf(a)) return { preview: "Pisze…", time: "teraz", typing: true };
    return { preview: a.replyPreview, time: "teraz", typing: false };
  };
  const dayLabel = agent.time === "Wczoraj" || agent.time === "pon." ? agent.time : `Dziś, ${agent.time}`;

  // The sidebar follows the pointer while its edge is held, then settles:
  // let go narrow and it folds to the rail.
  const onGrab = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, w: width };
    setDragging(true);
  };
  const onDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current) setWidth(clampWidth(drag.current.w + event.clientX - drag.current.x));
  };
  const onLetGo = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    setWidth((w) => settle(w));
  };
  const onEdgeKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 64 : 24;
    if (event.key === "ArrowLeft") setWidth((w) => settle(w - step));
    else if (event.key === "ArrowRight") setWidth((w) => clampWidth(Math.max(w + step, w < FULL ? FULL : 0)));
    else if (event.key === "Enter") setWidth((w) => (w < FULL ? START : RAIL));
    else return;
    event.preventDefault();
  };

  return (
    <div ref={ref} className="mx-auto w-full max-w-[1000px] select-none">
      <figure className="flex h-[600px] overflow-hidden rounded-2xl border border-ash bg-white shadow-md">
        <figcaption className="sr-only">
          Zespół agentów Examax: wybierz agenta z listy i wyślij pytanie, a agent odpowie w rozmowie.
        </figcaption>

        {/* The team — its right edge drags to resize, down to a rail */}
        <aside
          className={cn(
            "relative hidden shrink-0 flex-col border-r border-ash bg-canvas-muted md:flex",
            !dragging && "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          )}
          style={{ width }}
        >
          <div className={cn("flex h-12 shrink-0 items-center px-4", rail ? "justify-center" : "justify-between")}>
            {!rail && (
              <span aria-hidden className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-3 rounded-full border border-smoke bg-white" />
                ))}
              </span>
            )}
            <button
              type="button"
              aria-label="Nowy agent"
              className="flex size-7 cursor-pointer items-center justify-center rounded-md text-steel transition-colors hover:bg-ash/50 hover:text-charcoal"
            >
              <Plus className="size-4" strokeWidth={1.75} />
            </button>
          </div>
          <div className={cn(rail ? "flex justify-center" : "px-3")}>
            {rail ? (
              <button
                type="button"
                aria-label="Szukaj"
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-ash bg-white text-silver transition-colors hover:text-steel"
              >
                <Search className="size-4" strokeWidth={1.75} />
              </button>
            ) : (
              <div className="flex h-9 items-center gap-2 rounded-lg border border-ash bg-white px-2.5 text-[13px] text-silver">
                <Search className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">Szukaj</span>
              </div>
            )}
          </div>
          <div
            role="tablist"
            aria-label="Twoi agenci"
            aria-orientation="vertical"
            className={cn("mt-2 flex flex-col gap-0.5", rail ? "items-center px-1.5" : "px-2")}
          >
            {AGENTS.map((a, i) => {
              const selected = a.key === activeKey;
              const s = status(a);
              return (
                <button
                  key={a.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={rail ? a.name : undefined}
                  title={rail ? a.name : undefined}
                  onClick={() => setActiveKey(a.key)}
                  className={cn(
                    "flex cursor-pointer items-center rounded-xl text-left transition-colors duration-200",
                    rail ? "p-1.5" : "gap-3 px-2.5 py-2",
                    selected ? "bg-ash/60" : "hover:bg-ash/35",
                  )}
                >
                  <Face avatar={a.avatar} size={32} working={selected && running} seed={i / AGENTS.length} />
                  {!rail && (
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[14px] leading-5 text-charcoal">{a.name}</span>
                        <span className="shrink-0 text-[11px] leading-4 text-fog">{s.time}</span>
                      </span>
                      <span className="block truncate text-[12px] leading-4 text-fog">
                        {s.typing ? <TextShimmer className="font-normal">Pisze…</TextShimmer> : s.preview}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className={cn("mt-auto flex py-3", rail ? "justify-center" : "px-4")}>
            <Learner withName={!rail} />
          </div>

          {/* The edge: a hairline that darkens under the pointer */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Zmień szerokość listy agentów"
            aria-valuemin={RAIL}
            aria-valuemax={WIDE}
            aria-valuenow={Math.round(width)}
            tabIndex={0}
            onPointerDown={onGrab}
            onPointerMove={onDrag}
            onPointerUp={onLetGo}
            onPointerCancel={onLetGo}
            onDoubleClick={() => setWidth((w) => (w < FULL ? START : RAIL))}
            onKeyDown={onEdgeKey}
            className="group absolute inset-y-0 -right-1.5 z-10 w-3 cursor-col-resize touch-none outline-none"
          >
            <span
              className={cn(
                "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors duration-150",
                dragging ? "bg-steel" : "bg-transparent group-hover:bg-smoke group-focus-visible:bg-steel",
              )}
            />
          </div>
        </aside>

        {/* The conversation */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-ash px-4">
            <Face avatar={agent.avatar} size={22} working={running && !group} seed={0.5} />
            <span className="text-[14px] font-medium text-charcoal">{agent.name}</span>
            <PanelRight aria-hidden className="ml-auto size-4 text-fog" strokeWidth={1.75} />
          </div>

          {/* On a phone the sidebar folds into a row of faces */}
          <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-ash px-3 py-3 [scrollbar-width:none] md:hidden">
            {AGENTS.map((a) => (
              <button
                key={a.key}
                type="button"
                aria-label={a.name}
                aria-pressed={a.key === activeKey}
                onClick={() => setActiveKey(a.key)}
                className={cn(
                  "flex shrink-0 cursor-pointer rounded-full p-1 transition-colors",
                  a.key === activeKey ? "bg-ash/60" : "hover:bg-ash/35",
                )}
              >
                <Face avatar={a.avatar} size={28} />
              </button>
            ))}
          </div>

          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pb-4 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <span className="mt-auto self-center text-[12px] text-fog">{dayLabel}</span>
            {agent.history.map((item, i) => (
              <Message key={`h${i}`} item={item} group={group} />
            ))}

            <Arrive show={sent}>
              <div className="flex justify-end">
                <p className="w-fit max-w-[80%] rounded-2xl bg-charcoal px-4 py-2.5 text-[14px] leading-[22px] text-white">
                  {agent.prompt}
                </p>
              </div>
            </Arrive>

            {agent.reply.map((item, i) => (
              <Fragment key={`r${i}`}>
                <Arrive show={i < shown}>
                  <Message item={item} group={group} />
                </Arrive>
              </Fragment>
            ))}

            <Arrive show={thinking}>
              <div className="flex items-center gap-2.5 py-1">
                <Face avatar={speaker.avatar} size={28} working />
                <TextShimmer className="text-[13px] font-normal">
                  {group ? `${speaker.name} myśli…` : "Myśli…"}
                </TextShimmer>
              </div>
            </Arrive>
          </div>

          {/* The composer: the question is set, only Send is live. The beam
              rides it while it waits. */}
          <div className="shrink-0 px-5 pb-5">
            <BorderBeam
              size="md"
              colorVariant="colorful"
              theme="light"
              strength={0.9}
              active={!sent && inView && !reducedMotion}
            >
              <div className="flex items-center gap-2.5 rounded-full border border-ash bg-white py-2 pl-2 pr-2">
                <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper-mist text-steel">
                  <Plus className="size-4" strokeWidth={2} />
                </span>
                <p className="min-w-0 flex-1 cursor-default truncate text-[14px] leading-5">
                  {sent ? (
                    <span className="text-silver">Napisz do: {agent.name}</span>
                  ) : (
                    <span className="text-charcoal">{agent.prompt}</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={send}
                  disabled={sent}
                  aria-label={`Wyślij pytanie do: ${agent.name}`}
                  className={cn(
                    "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-[background-color,transform] duration-200 active:scale-95 disabled:cursor-default",
                    sent ? "bg-paper-mist text-silver" : "bg-charcoal text-white hover:bg-graphite",
                  )}
                >
                  <ArrowUp className="size-4" strokeWidth={2} />
                </button>
              </div>
            </BorderBeam>
          </div>
        </div>
      </figure>
    </div>
  );
}
