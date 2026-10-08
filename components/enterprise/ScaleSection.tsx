"use client";

import NumberFlow from "@number-flow/react";
import { CircleCheck, Clock, Headset, KeyRound, Mail, Phone, Presentation, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { GoogleGlyph, MicrosoftGlyph } from "@/components/auth/pieces";
import { BrandMark } from "@/components/ui/BrandMark";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/roadmap/sections";
import { monotonePath } from "@/components/progress/curve";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * dub.co/enterprise's "Scalability" band (live DOM, 2026-10-01): the header,
 * a 5-rule chart with mono labels whose three lines draw in left to right,
 * a tooltip card pinned on one point, three mono figures that count up,
 * then dub's two cells — its Slack support thread and its SSO diagram —
 * each given the full width here (the thread joined by the opiekun's contact
 * card), captioned by an icon title and a line rather than a button.
 *
 * Dub's lines are clicks, leads and sales over time; these are three
 * classes' average readiness from September to May.
 * PLACEHOLDER DATA — the classes, figures and people are illustrative.
 */

const SERIES = [
  { label: "Klasa 3a", color: "#3B82F6", values: [30, 31, 37, 44, 46, 45, 52, 61, 66, 69, 74, 82, 88] },
  { label: "Klasa 3b", color: "#A855F7", values: [30, 30, 34, 39, 41, 41, 47, 53, 57, 58, 62, 70, 79] },
  { label: "Klasa 3c", color: "#2DD4BF", values: [30, 30, 32, 34, 35, 34, 38, 42, 46, 49, 52, 55, 61] },
];
const TICKS = [20, 40, 60, 80, 100];
/** The point the tooltip is pinned to, as the reference pins its own. */
const PINNED = 10;

function ReadinessChart() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35, true);
  const W = 640;
  const H = 280;
  const left = 56;
  const x = (i: number) => left + (i / (SERIES[0].values.length - 1)) * (W - left - 8);
  const y = (v: number) => 12 + (1 - (v - 20) / 80) * (H - 24);
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[720px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label="Średnia gotowość trzech klas od września do maja: 88%, 79% i 61%">
        {TICKS.map((tick) => (
          <g key={tick}>
            <line x1={left} x2={W - 8} y1={y(tick)} y2={y(tick)} stroke="#e5e5e5" />
            <text x={left - 14} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-silver font-geist-mono text-[11px]">
              {tick}%
            </text>
          </g>
        ))}
        {SERIES.map((series, s) => (
          <path
            key={series.label}
            d={monotonePath(series.values.map((v, i) => [x(i), y(v)] as const))}
            fill="none"
            stroke={series.color}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            className="transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none"
            style={{ strokeDashoffset: inView ? 0 : 1, transitionDelay: `${s * 120}ms` }}
          />
        ))}
        {SERIES.map((series) => (
          <circle
            key={series.label}
            cx={x(PINNED)}
            cy={y(series.values[PINNED])}
            r={3.5}
            fill={series.color}
            className={cn("transition-opacity delay-[1400ms] duration-300", inView ? "opacity-100" : "opacity-0")}
          />
        ))}
      </svg>
      <div
        aria-hidden
        className={cn(
          "absolute hidden w-max whitespace-nowrap rounded-lg border border-ash bg-white p-3 shadow-subtle transition-[opacity,transform] delay-[1500ms] duration-300 sm:block",
          inView ? "opacity-100" : "translate-y-1 opacity-0",
        )}
        style={{ left: `${(x(PINNED) / W) * 100 + 2}%`, top: `${(y(SERIES[0].values[PINNED]) / H) * 100 - 2}%` }}
      >
        <p className="mb-2 text-xs font-medium text-steel">Kwiecień · gotowość</p>
        <div className="flex flex-col gap-1.5">
          {SERIES.map((series) => (
            <div key={series.label} className="flex items-center justify-between gap-6 text-sm">
              <span className="flex items-center gap-2 text-steel">
                <span className="size-3 rounded-[3px] opacity-80" style={{ background: series.color }} />
                {series.label}
              </span>
              <span className="font-geist-mono tabular-nums text-charcoal">{series.values[PINNED]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** PLACEHOLDER FIGURES — swap for real ones before launch. */
const FIGURES: Array<{ label: string; value: number; suffix: string }> = [
  { label: "Zadań CKE w bazie", value: 4800, suffix: "+" },
  { label: "Arkuszy egzaminacyjnych", value: 120, suffix: "+" },
  { label: "Dostępność platformy", value: 99.9, suffix: "%" },
];

function Figures() {
  const { ref, inView } = useInView<HTMLDivElement>(0.5, true);
  return (
    <div ref={ref} className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
      {FIGURES.map((figure) => (
        <div key={figure.label} className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-medium uppercase tracking-wide text-steel">{figure.label}</span>
          <span className="font-geist-mono text-2xl text-charcoal sm:text-[28px]">
            <NumberFlow value={inView ? figure.value : 0} locales="pl-PL" format={{ maximumFractionDigits: 1 }} />
            {figure.suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

const THREAD = [
  { initials: "AW", name: "Anna Wiśniewska", staff: true, time: "9:12", text: "Klasa 2b jest już dodana — uczniowie mają loginy na kontach szkolnych." },
  { initials: "MK", name: "Marta Kowalczyk", staff: false, time: "9:20", text: "Dziękuję! Pierwsze osoby już robią diagnozę." },
  { initials: "AW", name: "Anna Wiśniewska", staff: true, time: "9:24", text: "Szkolenie dla rady pedagogicznej: czwartek, 14:00. Link wyślę dzień wcześniej." },
];

/** The school's own channel with its opiekun: a thread, and the composer under it. */
function SupportThread() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-canvas-muted p-1.5">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-ash bg-white px-4 py-3 shadow-subtle">
        <span className="flex items-center gap-2.5">
          <span className="grid size-5 place-items-center rounded-[5px] bg-charcoal text-white">
            <BrandMark className="h-2.5" />
          </span>
          <span className="font-semibold text-graphite">
            <span className="text-fog">#</span> lo5-krakow-examax
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-fog">
          <Users className="size-3.5" strokeWidth={1.75} />3
        </span>
      </div>
      <div className="flex flex-col gap-4 px-3 pb-3 pt-4">
        {THREAD.map((message, i) => (
          <div key={i} className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#e0e7ff] to-[#fce7f3] text-xs font-semibold text-slate">
              {message.initials}
            </span>
            <div className="leading-tight">
              <p className="flex items-center gap-1.5">
                <span className="text-base font-semibold text-charcoal">{message.name}</span>
                {message.staff ? <span className="rounded bg-paper-mist px-1 py-0.5 text-[10px] font-medium leading-none text-steel">Examax</span> : null}
                <span className="text-sm text-fog">{message.time}</span>
              </p>
              <p className="mt-0.5 text-body text-steel">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-lg border border-ash bg-white px-3 py-2.5 text-body text-silver">Napisz do #lo5-krakow-examax</div>
    </div>
  );
}

const CONTACT: Array<{ icon: IconComponent; label: string; value: string }> = [
  { icon: Clock, label: "Odpowiedź", value: "do 2 godzin" },
  { icon: Phone, label: "Telefon", value: "pn–pt, 8:00–16:00" },
  { icon: Presentation, label: "Szkolenie rady", value: "czwartek, 14:00" },
  { icon: CircleCheck, label: "Wdrożenie", value: "3 z 4 klas" },
];

/** The opiekun the school gets: who they are, and how fast they answer. */
function ContactCard() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-canvas-muted p-1.5">
      <div className="flex items-center gap-3 rounded-lg border border-ash bg-white px-4 py-3.5 shadow-subtle">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#e0e7ff] to-[#fce7f3] text-sm font-semibold text-slate">
          AW
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-vivid-green" />
        </span>
        <span className="leading-tight">
          <span className="block font-semibold text-charcoal">Anna Wiśniewska</span>
          <span className="text-sm text-fog">Opiekunka szkoły · dostępna</span>
        </span>
      </div>
      <dl className="flex flex-col px-3 pb-3 pt-2">
        {CONTACT.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 border-b border-ash py-2.5 text-body last:border-0">
            <dt className="flex items-center gap-2.5 text-fog">
              <row.icon className="size-4" strokeWidth={1.75} />
              {row.label}
            </dt>
            <dd className="font-medium text-charcoal">{row.value}</dd>
          </div>
        ))}
      </dl>
      <span className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-charcoal py-2.5 text-body font-medium text-white">
        <Mail className="size-4" strokeWidth={1.75} />
        Napisz do opiekunki
      </span>
    </div>
  );
}

const PROVIDERS: Array<{ label: string; mark: React.ReactNode }> = [
  { label: "Microsoft 365", mark: <MicrosoftGlyph className="size-8" /> },
  { label: "Google Workspace", mark: <GoogleGlyph className="size-8" /> },
  { label: "SAML / SSO", mark: <KeyRound className="size-8 text-charcoal" strokeWidth={1.75} /> },
  { label: "Listy klas", mark: <Users className="size-8 text-charcoal" strokeWidth={1.75} /> },
];

/**
 * The reference's diagram, given the full width: the school's domain feeds a
 * rail above, a drop and a dot run into each sign-in tile, and the rail below
 * carries them on into Examax.
 */
function SignInDiagram() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <span className="rounded-full border border-ash bg-white px-3 py-1 font-geist-mono text-xs text-steel shadow-subtle">@lo5.krakow.pl</span>
      <span className="h-6 w-px bg-ash" />
      <div className="relative grid grid-cols-2 gap-x-6 gap-y-8 py-6 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-0 sm:py-10">
        <div className="absolute -inset-x-16 top-0 h-px bg-ash [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] max-sm:hidden" />
        <div className="absolute -inset-x-16 bottom-0 h-px bg-ash [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] max-sm:hidden" />
        {PROVIDERS.map((provider) => (
          <div key={provider.label} className="relative flex flex-col items-center">
            <span className="absolute -top-10 h-8 w-px bg-ash max-sm:hidden" />
            <span className="absolute -top-2.5 size-1.5 rounded-full bg-smoke max-sm:hidden" />
            <div className="grid size-20 place-items-center rounded-2xl border border-ash bg-white shadow-md">{provider.mark}</div>
            <span className="mt-3 whitespace-nowrap text-sm font-medium text-steel">{provider.label}</span>
            <span className="absolute -bottom-10 h-8 w-px bg-ash max-sm:hidden" />
          </div>
        ))}
      </div>
      <span className="h-6 w-px bg-ash" />
      <span className="flex items-center gap-2 rounded-full bg-charcoal py-1 pl-1 pr-3 text-xs font-medium text-white shadow-md">
        <span className="grid size-5 place-items-center rounded-full bg-white text-charcoal">
          <BrandMark className="h-2.5" />
        </span>
        Konta uczniów w Examax
      </span>
    </div>
  );
}

/** A full-width cell: the picture across the page, then an icon title and a line under it. */
function Cell({ icon: Icon, title, text, children }: { icon: IconComponent; title: string; text: string; children: React.ReactNode }) {
  return (
    <Reveal className="flex flex-col gap-10 px-4 py-10 sm:px-10 sm:py-14">
      <div aria-hidden inert className="cursor-default select-none">
        {children}
      </div>
      <div className="max-w-2xl">
        <h3 className="flex items-center gap-2 font-medium text-charcoal">
          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
          {title}
        </h3>
        <p className="mt-2 text-pretty text-body text-fog">{text}</p>
      </div>
    </Reveal>
  );
}

export function ScaleSection() {
  return (
    <section id="scale" aria-labelledby="scale-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="mx-auto max-w-[var(--page-max-width)] border-x border-ash pt-20">
        <SectionHeader
          id="scale-heading"
          icon={TrendingUp}
          eyebrow="Skala szkoły"
          title="Od pojedynczej klasy do całej sieci placówek"
          sub="Dyrekcja widzi gotowość każdej klasy, a nauczyciel — każdego ucznia."
        />
        <div className="mt-14 px-4">
          <ReadinessChart />
        </div>
        <Figures />
        <div className="mt-16 divide-y divide-ash border-t border-ash">
          <Cell
            icon={Headset}
            title="Wsparcie wdrożeniowe"
            text="Dedykowany opiekun na wspólnym kanale, szkolenie dla rady pedagogicznej i wdrożenie bez ręcznego przepisywania list uczniów."
          >
            <div className="grid gap-5 md:h-[340px] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <SupportThread />
              <ContactCard />
            </div>
          </Cell>
          <Cell
            icon={ShieldCheck}
            title="Logowanie kontem szkoły"
            text="Uczniowie i nauczyciele logują się kontami Microsoft 365 albo Google Workspace, a listy klas synchronizują się same."
          >
            <div className="md:h-[340px]">
              <SignInDiagram />
            </div>
          </Cell>
        </div>
      </div>
    </section>
  );
}
