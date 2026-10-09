import Image from "next/image";
import {
  CircleCheck,
  Flag,
  LayoutDashboard,
  MessageSquare,
  PauseCircle,
  RefreshCcw,
  Send,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { FeatureCell, FeatureGrid, GridSection, SectionHeader } from "@/components/roadmap/sections";
import { cn } from "@/lib/cn";

import zuzannaPhoto from "@/public/mockups/learner.jpg";
import kacperPhoto from "@/public/mockups/learner-kacper.jpg";
import szymonPhoto from "@/public/mockups/learner-szymon.jpg";

/*
 * dub.co/startups' "The partner program stack" (live DOM, 2026-10-01): a
 * centred header (the reference's action left out), then a two-up and a three-up of
 * pictures with copy and a quiet "Dowiedz się więcej" under each.
 *
 *   Flexible reward structure   → AssignStack   (a review set for the class)
 *   1-click global payouts      → AssignmentSend (a task set going out to chosen students)
 *   Embedded referral dashboard → TeacherPanel  (the class panel)
 *   Automated risk monitoring   → AttentionCard (a student who needs help)
 *   Partner referral rewards    → ClassOrbit    (the class goal, together)
 *
 * PLACEHOLDER DATA — the classes, students and figures are illustrative.
 */

const CARD_SHADOW = "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_0_rgba(0,0,0,0.04)]";

function Avatars({ count }: { count: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] py-0.5 pl-0.5 pr-1.5 text-[10px] font-medium text-[#166534]">
      <span className="flex -space-x-1.5">
        {[zuzannaPhoto, kacperPhoto, szymonPhoto].map((photo, i) => (
          <span key={i} className="relative size-4 overflow-hidden rounded-full border border-white">
            <Image src={photo} alt="" fill sizes="16px" className="object-cover" />
          </span>
        ))}
      </span>
      {count}
    </span>
  );
}

function AssignStack() {
  const faint = (text: React.ReactNode, count: string) => (
    <div className={cn("mx-6 rounded-lg bg-white px-4 py-3 text-xs text-silver", CARD_SHADOW)}>
      <div className="flex items-center justify-between">
        <RefreshCcw className="size-3.5" strokeWidth={1.75} />
        <Avatars count={count} />
      </div>
      <p className="mt-2">{text}</p>
    </div>
  );
  return (
    <div aria-hidden inert className="flex h-full select-none flex-col justify-center gap-2 [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]">
      {faint(<>Powtórka: <span className="text-blue-400">Ciągi</span> dla klasy 3a do środy</>, "+24")}
      <div className={cn("relative z-10 rounded-xl bg-white px-4 py-4 text-sm", "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_10px_20px_-6px_rgba(0,0,0,0.12)]")}>
        <div className="flex items-center justify-between">
          <span className="grid size-7 place-items-center rounded-md border border-ash text-steel">
            <UsersRound className="size-4" strokeWidth={1.75} />
          </span>
          <span className="rounded-md bg-paper-mist px-1.5 py-0.5 text-xs text-steel">Cała klasa</span>
        </div>
        <p className="mt-4 text-graphite">
          Powtórka: <span className="font-semibold text-blue-600">Funkcja kwadratowa</span> dla <span className="font-semibold">klasy 3c</span> do piątku
        </p>
      </div>
      {faint(<>Sprawdzian próbny: <span className="text-blue-400">Planimetria</span> za 2 tygodnie</>, "+28")}
    </div>
  );
}

/** The students the set went to, and how many of its tasks each has solved. */
const ASSIGNED = [
  { name: "Julia Nowak", done: 12 },
  { name: "Kacper Lewandowski", done: 9 },
  { name: "Szymon Wójcik", done: 4 },
  { name: "Maja Zielińska", done: 0 },
];
const SET_SIZE = 12;

function AssignmentSend() {
  return (
    <div aria-hidden inert className="flex h-full select-none flex-col items-center [mask-image:linear-gradient(black_70%,transparent)]">
      <div className="flex rounded-xl border border-ash bg-white p-1.5">
        {[
          { label: "Zestaw", value: "Planimetria" },
          { label: "Zadania CKE", value: String(SET_SIZE) },
        ].map((stat, i) => (
          <div key={stat.label} className={cn("flex items-center gap-2 px-3 py-1.5", i === 0 && "border-r border-ash")}>
            <span className="text-left text-[11px] leading-tight text-fog">
              {stat.label}
              <span className="block text-sm font-medium text-charcoal">{stat.value}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="h-6 w-px bg-ash" />
      <span className="flex items-center gap-2 rounded-lg bg-charcoal px-3 py-1.5 text-sm font-medium text-white shadow-md">
        <span className="grid size-5 place-items-center rounded-full bg-white text-charcoal">
          <BrandMark className="h-2.5" />
        </span>
        Zadanie wysłane · {ASSIGNED.length} uczniów
      </span>
      <div className="h-4 w-px bg-ash" />
      <div className="flex w-[90%] flex-col gap-1.5">
        {ASSIGNED.map((row) => (
          <div key={row.name} className={cn("flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-steel", CARD_SHADOW)}>
            <span>{row.name}</span>
            <span className={cn("flex items-center gap-1.5 tabular-nums", row.done === SET_SIZE ? "text-vivid-green" : "text-fog")}>
              {row.done === SET_SIZE ? <CircleCheck className="size-3" strokeWidth={2} /> : <Send className="size-3" strokeWidth={1.75} />}
              {row.done}/{SET_SIZE}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherPanel() {
  const bars = [62, 74, 58, 81, 69, 88, 77];
  return (
    <div aria-hidden inert className="h-full select-none overflow-hidden [mask-image:linear-gradient(black_75%,transparent)]">
      <div className="rounded-lg border border-ash bg-white p-3 text-[10px] text-steel">
        <div className="flex items-center gap-3">
          <span className="grid size-4 place-items-center rounded bg-charcoal text-white">
            <BrandMark className="h-2" />
          </span>
          {["Panel", "Klasy", "Raporty", "Ustawienia"].map((tab, i) => (
            <span key={tab} className={cn(i === 1 ? "rounded bg-paper-mist px-1.5 py-0.5 font-medium text-charcoal" : "text-fog")}>
              {tab}
            </span>
          ))}
        </div>
        <div className="mt-3 rounded-md bg-[linear-gradient(135deg,#eff6ff,#f5f3ff)] p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-charcoal">Klasa 3c · Matematyka</p>
              <p className="mt-1 text-fog">24 uczniów · matura 2027</p>
            </div>
            <span className="grid size-8 place-items-center rounded-full bg-charcoal text-white shadow-md">
              <BrandMark className="h-3" />
            </span>
          </div>
          <div className="mt-3 flex h-12 items-end gap-1.5">
            {bars.map((bar, i) => (
              <span key={i} className="flex-1 rounded-t-sm bg-blue-500/70" style={{ height: `${bar}%` }} />
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "Gotowość", value: "71%" },
            { label: "Aktywni dziś", value: "18" },
            { label: "Do powtórki", value: "4 działy" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-md border border-ash p-2">
              <p className="text-fog">{stat.label}</p>
              <p className="mt-0.5 text-xs font-medium text-charcoal">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AttentionCard() {
  const rows = [
    { icon: TriangleAlert, label: "Brak aktywności od 6 dni", count: null, tone: "" },
    { icon: PauseCircle, label: "Powtórki zaległe", count: "3", tone: "bg-paper-mist text-steel" },
    { icon: CircleCheck, label: "Tematy opanowane", count: "12", tone: "bg-[#dcfce7] text-[#166534]" },
    { icon: Flag, label: "Słaby dział: Funkcje", count: "41%", tone: "bg-[#fee2e2] text-[#b91c1c]" },
  ];
  return (
    <div aria-hidden inert className="mx-auto flex h-full w-full max-w-[250px] select-none items-center">
      <div className="w-full rounded-xl border border-ash bg-canvas-muted p-1.5">
        <p className={cn("flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-base font-medium text-charcoal", CARD_SHADOW)}>
          <span className="relative size-6 overflow-hidden rounded-full">
            <Image src={szymonPhoto} alt="" fill sizes="24px" className="object-cover" />
          </span>
          Szymon Wójcik
        </p>
        <div className="mt-1.5 flex flex-col gap-1.5">
          {rows.map((row) => (
            <div key={row.label} className={cn("flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-steel", CARD_SHADOW)}>
              <span className="flex items-center gap-2">
                <row.icon className="size-3.5 text-fog" strokeWidth={1.75} />
                {row.label}
              </span>
              {row.count ? <span className={cn("rounded px-1.5 text-[11px] font-medium tabular-nums", row.tone)}>{row.count}</span> : null}
            </div>
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-xs font-medium">
          <span className="rounded-lg bg-ash/60 py-2 text-center text-charcoal">Przydziel powtórkę</span>
          <span className={cn("flex items-center justify-center gap-1 rounded-lg bg-white py-2 text-charcoal", CARD_SHADOW)}>
            <MessageSquare className="size-3" strokeWidth={2} />
            Napisz
          </span>
        </div>
      </div>
    </div>
  );
}

const ORBIT = [
  { initials: "LK", tint: "from-[#bfdbfe] to-[#c4b5fd]" },
  { photo: kacperPhoto },
  { initials: "HP", tint: "from-[#bbf7d0] to-[#99f6e4]" },
  { photo: szymonPhoto },
  { initials: "AM", tint: "from-[#fde68a] to-[#fca5a5]" },
  { initials: "OS", tint: "from-[#fbcfe8] to-[#fde68a]" },
  { initials: "FD", tint: "from-[#c7d2fe] to-[#a5f3fc]" },
  { initials: "IW", tint: "from-[#e9d5ff] to-[#bfdbfe]" },
];

/** The reference's ring of faces round one, turning slowly; each face stays upright. */
function ClassOrbit() {
  return (
    <div aria-hidden inert className="relative grid h-full select-none place-items-center">
      <div className="absolute size-[200px] rounded-full border border-dashed border-ash" />
      <div className="absolute size-[200px] motion-safe:animate-[spin_60s_linear_infinite]">
        {ORBIT.map((item, i) => {
          const angle = (i / ORBIT.length) * 2 * Math.PI;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 -ml-4 -mt-4 size-8"
              style={{ transform: `translate(${Math.cos(angle) * 100}px, ${Math.sin(angle) * 100}px)` }}
            >
              <span className="relative block size-full overflow-hidden rounded-full border-2 border-white shadow-md motion-safe:animate-[spin_60s_linear_infinite_reverse]">
                {item.photo ? (
                  <Image src={item.photo} alt="" fill sizes="32px" className="object-cover" />
                ) : (
                  <span className={cn("grid size-full place-items-center bg-gradient-to-br text-[10px] font-semibold text-charcoal/70", item.tint)}>{item.initials}</span>
                )}
              </span>
            </span>
          );
        })}
      </div>
      <div className="relative flex flex-col items-center">
        <span className="relative size-20 overflow-hidden rounded-full border-4 border-white shadow-lg">
          <Image src={zuzannaPhoto} alt="" fill sizes="80px" className="object-cover object-[center_30%]" />
        </span>
        <span className="mt-2 rounded-full border border-ash bg-white px-2.5 py-1 text-xs font-medium text-charcoal shadow-subtle">Cel klasy: 500 zadań</span>
      </div>
    </div>
  );
}

export function ToolkitSection() {
  return (
    <GridSection id="toolkit" labelledBy="toolkit-heading" innerClassName="pt-20">
      <SectionHeader
        id="toolkit-heading"
        icon={LayoutDashboard}
        eyebrow="Panel nauczyciela"
        title="Panel nauczyciela"
        sub="Widzisz postępy uczniów, najważniejsze braki i tematy, które warto przećwiczyć z klasą."
      />
      <div className="mt-12">
        <FeatureGrid
          cells={[
            {
              title: "Powtórki dla całej klasy",
              description: "Przydzielasz temat całej klasie albo wybranym uczniom — trafia prosto do ich roadmapy, z terminem.",
              cta: { label: "Zobacz roadmapę", href: "/roadmap" },
              visual: <AssignStack />,
            },
            {
              title: "Zadania dla wybranych uczniów",
              description: "Wysyłasz zestaw zadań CKE konkretnym uczniom i widzisz, kto już go rozwiązał — bez zbierania kartek i sprawdzania ręcznie.",
              cta: { label: "Zobacz trening", href: "/training" },
              visual: <AssignmentSend />,
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 divide-ash border-t border-ash max-md:divide-y md:grid-cols-3 md:divide-x">
        <FeatureCell
          cell={{
            title: "Panel klasy",
            description: "Gotowość, aktywność i działy do powtórki każdej klasy, w jednym miejscu i na bieżąco.",
            cta: { label: "Zobacz postępy", href: "/progress" },
            visual: <TeacherPanel />,
          }}
        />
        <FeatureCell
          delay={80}
          cell={{
            title: "Uczniowie, którzy potrzebują uwagi",
            description: "Examax pomaga znaleźć uczniów, którzy potrzebują dodatkowego wsparcia, zanim problemy pojawią się na egzaminie.",
            cta: { label: "Zobacz trening", href: "/training" },
            visual: <AttentionCard />,
          }}
        />
        <FeatureCell
          delay={160}
          cell={{
            title: "Wspólny cel klasy",
            description: "Klasa ustala cel tygodnia, a każdy widzi, ile brakuje — nauka w grupie zamiast samotnej powtórki.",
            cta: { label: "Zobacz roadmapę", href: "/roadmap" },
            visual: <ClassOrbit />,
          }}
        />
      </div>
    </GridSection>
  );
}
