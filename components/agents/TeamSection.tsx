"use client";

import { useEffect, useState } from "react";
import { BotAvatar, type BotAvatarType } from "bot-avatars";
import { ArrowRight, BookOpenCheck, CalendarClock, FileCheck2, Plus, RefreshCcw, ScanSearch, Search, Users } from "lucide-react";
import { GridSection, SectionHeader } from "@/components/roadmap/sections";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * "Your agents" — after Grok Bot's create-a-bot (x.ai/bot): agents are not
 * fixed roles, one per job. The learner makes their own. Two rows on the
 * page's hairline grid:
 *
 *   the builder   a live preview of the agent on the left (its face large,
 *                 a small thought cloud over it, its name, its brief and
 *                 what it may do); the form on the right — a small face
 *                 gallery, the name, the brief and the permissions
 *   your agents   not there until the learner makes one; each lands first,
 *                 hopping, with a thought cloud over its face, its name and
 *                 permissions, and "Napisz do niego teraz" (→ /signup)
 *
 * The faces are ones the showcase's team (AgentShowcase) does not wear, so
 * a new agent never looks like one of those profiles. Nothing is saved: the
 * builder is a preview of the product's own.
 */

type SkillKey = "explain" | "check" | "test" | "pick" | "plan" | "review";

const SKILLS: Array<{ key: SkillKey; label: string; icon: IconComponent; detail: string }> = [
  { key: "explain", label: "Tłumaczy krok po kroku", icon: BookOpenCheck, detail: "Pyta o Twój następny ruch, zamiast podawać gotowy wynik." },
  { key: "check", label: "Sprawdza rozwiązania", icon: ScanSearch, detail: "Przechodzi przez rozwiązanie i wskazuje, gdzie jest błąd." },
  { key: "test", label: "Tworzy zestawy ćwiczeń", icon: FileCheck2, detail: "Dobiera zadania do tematów, które wymagają najwięcej pracy." },
  { key: "pick", label: "Dobiera zadania CKE", icon: Search, detail: "Z oryginalnych arkuszy, do tematu, który właśnie ćwiczysz." },
  { key: "plan", label: "Pomaga dostosować roadmapę", icon: CalendarClock, detail: "Proponuje zmiany, gdy zmienia się Twój cel lub dostępny czas." },
  { key: "review", label: "Przypomina o powtórkach", icon: RefreshCcw, detail: "Pomaga wrócić do tematów, które warto utrwalić." },
];
const SKILL = Object.fromEntries(SKILLS.map((skill) => [skill.key, skill])) as Record<SkillKey, (typeof SKILLS)[number]>;

/**
 * Faces none of the showcase's agents wear. Two are recoloured so the
 * gallery does not run to three greens side by side.
 */
type Face = { type: BotAvatarType; color?: string };
const FACES: Face[] = [
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

type MyAgent = { id: string; name: string; avatar: Face; brief: string; skills: SkillKey[]; fresh?: boolean };

const FIELD =
  "w-full rounded-lg border border-ash bg-white px-3 py-2 text-body text-charcoal placeholder:text-silver focus:border-steel focus:outline-none focus:ring-4 focus:ring-ash/60";

const LABEL = "text-body-sm font-medium text-steel";

/* ── Pieces ──────────────────────────────────────────────────────────────── */

/**
 * The small thought cloud an agent wears over its head: a hairline pill with
 * two trailing bubbles that point down at the face.
 */
function ThoughtCloud({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("pointer-events-none inline-flex w-max flex-col items-center", className)}>
      <span className="whitespace-nowrap rounded-full border border-ash bg-white px-2.5 py-1 text-[12px] font-medium leading-4 text-charcoal shadow-sm">
        {children}
      </span>
      <span aria-hidden className="mt-1 size-2 -translate-x-1.5 rounded-full border border-smoke bg-white" />
      <span aria-hidden className="mt-0.5 size-1.5 -translate-x-3 rounded-full border border-smoke bg-white" />
    </span>
  );
}

/** A permission as a small hairline chip. */
function SkillChip({ skill }: { skill: SkillKey }) {
  const { icon: Icon, label } = SKILL[skill];
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-ash bg-white px-1.5 py-0.5 text-[11.5px] leading-4 text-steel">
      <Icon className="size-3 text-fog" strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}

/* ── The builder ─────────────────────────────────────────────────────────── */

/**
 * The preview's large face. It comes alive for two seconds each time a face
 * is picked (it is keyed by the face, so a new pick remounts it), then rests:
 * a moving face redraws its glossy shading every frame, which is the
 * builder's one real cost on a phone, while a resting one costs nothing.
 */
function PreviewFace({ face }: { face: Face }) {
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setAlive(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);
  return <BotAvatar type={face.type} color={face.color} size={128} paused={!alive} aria-hidden />;
}

/** The agent as it will be: face, cloud, name, brief and permissions, updating as the form changes. */
function Preview({ face, name, brief, skills }: { face: Face; name: string; brief: string; skills: SkillKey[] }) {
  return (
    <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-ash bg-canvas-muted px-6 py-12 text-center">
      {/* A faint 32px grid behind the agent, fading out towards the edges */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-ash)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ash)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      <span className="absolute left-4 top-4 text-[11px] font-medium uppercase tracking-wider text-fog">Podgląd</span>

      <div className="relative flex flex-col items-center">
        <ThoughtCloud className="mb-1 translate-x-10">Gotowy do pracy!</ThoughtCloud>
        <PreviewFace key={face.type} face={face} />
      </div>
      <p className="relative mt-4 max-w-full truncate font-satoshi text-2xl font-medium text-charcoal">{name.trim() || "Twój agent"}</p>
      <p className="relative mt-1.5 line-clamp-3 max-w-sm text-pretty text-body leading-relaxed text-fog">
        {brief.trim() || "Tu pojawi się opis tego, czym się zajmuje."}
      </p>
      <div className="relative mt-5 flex max-w-md flex-wrap justify-center gap-1">
        {skills.map((key) => (
          <SkillChip key={key} skill={key} />
        ))}
      </div>
    </div>
  );
}

function Builder({ onCreate }: { onCreate: (agent: Omit<MyAgent, "id">) => void }) {
  const [face, setFace] = useState<Face>(FACES[0]);
  const [name, setName] = useState("Trener ciągów");
  const [brief, setBrief] = useState("Codziennie ćwiczy ze mną ciągi przez 10 minut. Najpierw pyta, potem pomaga znaleźć rozwiązanie, a na końcu sprawdza mój tok myślenia.");
  const [skills, setSkills] = useState<SkillKey[]>(["explain", "check", "review"]);
  const ready = name.trim().length > 0 && skills.length > 0;

  // Keeps the list's own order, so chips never reshuffle as they are switched
  const toggle = (key: SkillKey, on: boolean) =>
    setSkills((current) => SKILLS.map((s) => s.key).filter((k) => (k === key ? on : current.includes(k))));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
      <Preview face={face} name={name} brief={brief} skills={skills} />

      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!ready) return;
          onCreate({ name: name.trim(), avatar: face, brief: brief.trim(), skills });
        }}
      >
        <div>
          <p className={LABEL}>Twarz</p>
          <div role="radiogroup" aria-label="Twarz agenta" className="mt-2 flex flex-wrap gap-1.5">
            {FACES.map((option, index) => (
              <button
                key={option.type}
                type="button"
                role="radio"
                aria-checked={face === option}
                aria-label={`Twarz ${index + 1}`}
                onClick={() => setFace(option)}
                className={cn(
                  "focus-ring grid size-10 cursor-pointer place-items-center rounded-lg border bg-white transition-[background-color,border-color,box-shadow] duration-150",
                  face === option ? "border-charcoal ring-1 ring-charcoal" : "border-ash hover:bg-canvas-muted",
                )}
              >
                <BotAvatar type={option.type} color={option.color} size={24} interactive={false} turn={0} paused aria-hidden />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="agent-name" className={LABEL}>
            Nazwa
          </label>
          <input
            id="agent-name"
            value={name}
            maxLength={28}
            onChange={(event) => setName(event.target.value)}
            placeholder="Np. Trener ciągów"
            className={cn("mt-2", FIELD)}
          />
        </div>

        <div>
          <label htmlFor="agent-brief" className={LABEL}>
            Czym ma się zajmować
          </label>
          <textarea
            id="agent-brief"
            value={brief}
            rows={3}
            maxLength={160}
            onChange={(event) => setBrief(event.target.value)}
            placeholder="Np. Ćwiczy ze mną ciągi i sprawdza moje rozwiązania."
            className={cn("mt-2 resize-none", FIELD)}
          />
        </div>

        <div>
          <p className={LABEL}>Uprawnienia</p>
          <ul className="mt-2 divide-y divide-ash rounded-xl border border-ash bg-white">
            {SKILLS.map((skill) => {
              const on = skills.includes(skill.key);
              return (
                <li key={skill.key} className="flex items-center gap-3 px-3.5 py-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md border border-ash bg-canvas-muted">
                    <skill.icon className={cn("size-3.5 transition-colors", on ? "text-charcoal" : "text-silver")} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-body-sm font-medium transition-colors", on ? "text-charcoal" : "text-fog")}>{skill.label}</span>
                    <span className="block truncate text-[12px] leading-4 text-fog">{skill.detail}</span>
                  </span>
                  <Toggle size="sm" checked={on} onChange={(next) => toggle(skill.key, next)} label={skill.label} className="cursor-pointer" />
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="submit"
          disabled={!ready}
          className="focus-ring inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 self-end rounded-lg bg-black px-5 text-body font-medium text-white ring-ash transition-all hover:ring-4 disabled:cursor-not-allowed disabled:bg-ash disabled:text-fog disabled:ring-0 sm:w-auto"
        >
          <Plus className="size-4" strokeWidth={2.25} />
          Utwórz agenta
        </button>
      </form>
    </div>
  );
}

/* ── Your agents ─────────────────────────────────────────────────────────── */

/** One agent: a thought cloud over its face, its name and permissions, and the way in. */
function AgentRow({ agent }: { agent: MyAgent }) {
  return (
    <li className="flex animate-rise flex-col gap-4 border-t border-ash pb-6 pt-12 first:border-t-0 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="relative grid size-16 shrink-0 place-items-center rounded-2xl border border-ash bg-canvas-muted">
          <ThoughtCloud className="absolute bottom-[calc(100%-6px)] left-9">W czym mogę pomóc?</ThoughtCloud>
          <BotAvatar type={agent.avatar.type} color={agent.avatar.color} size={44} state={agent.fresh ? "working" : "default"} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-body font-medium text-charcoal">{agent.name}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {agent.skills.map((key) => (
              <SkillChip key={key} skill={key} />
            ))}
          </div>
        </div>
      </div>
      <Button href="/signup" className="shrink-0">
        Napisz do niego teraz
        <ArrowRight className="size-4" strokeWidth={2} />
      </Button>
    </li>
  );
}

export function TeamSection() {
  const [agents, setAgents] = useState<MyAgent[]>([]);
  const [made, setMade] = useState(0);

  const create = (agent: Omit<MyAgent, "id">) => {
    const id = `mine-${made}`;
    setMade((n) => n + 1);
    setAgents((current) => [{ ...agent, id, fresh: true }, ...current.map((a) => ({ ...a, fresh: false }))]);
    // The new face hops while it "sets up", then rests like the others.
    window.setTimeout(() => setAgents((current) => current.map((a) => (a.id === id ? { ...a, fresh: false } : a))), 2600);
  };

  return (
    <GridSection id="team" labelledBy="team-heading" innerClassName="pt-20 sm:pt-24">
      <SectionHeader
        id="team-heading"
        icon={Users}
        eyebrow="Twoi agenci"
        title="Stwórz własnego pomocnika do nauki"
        sub="Tworzysz pomocnika do konkretnego celu: matematyki, wypracowań, angielskiego albo powtórek. Nadajesz mu zadanie, a on pomaga Ci regularnie pracować."
      />

      <div className="mt-14 border-t border-ash px-4 py-10 sm:px-12 sm:py-14">
        <Builder onCreate={create} />
      </div>

      {agents.length > 0 ? (
        <div className="border-t border-ash px-4 py-10 sm:px-12 sm:py-14">
          <p className="font-satoshi text-xl font-medium text-charcoal">Twoi agenci</p>
          <ul>
            {agents.map((agent) => (
              <AgentRow key={agent.id} agent={agent} />
            ))}
          </ul>
        </div>
      ) : null}
    </GridSection>
  );
}
