"use client";

import Link from "@/components/ui/Link";
import {
  BarChart3,
  Building2,
  CalendarDays,
  Download,
  FileSignature,
  FileText,
  Gauge,
  Headset,
  InfinityIcon,
  KeyRound,
  LayoutDashboard,
  PencilLine,
  Presentation,
  RefreshCcw,
  Route,
  Timer,
  Zap,
} from "lucide-react";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { Reveal } from "@/components/ui/Reveal";
import { Tooltip } from "@/components/ui/Tooltip";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * Two dub.co/startups bands (live DOM, 2026-10-01):
 *
 *   CoverageBand  ← "Migrated off …": four groups under grey pills, two
 *                   columns wide at the ends and one in the middle, each mark
 *                   a chip and a Satoshi word, a small tag under some
 *   OfferSection  ← "Launch today, scale with confidence": the plan box
 *                   (chip, title, "Zobacz cennik", four columns of features
 *                   with dotted tooltips) over two term cards, each a day
 *                   strip that slides to its date as it comes into view
 *
 * PLACEHOLDER DATA — the licence contents and terms are illustrative.
 */

/* ── Coverage band ──────────────────────────────────────────────────────── */

type Mark = { name: string; icon?: IconComponent; accent?: Accent; exam?: "e8" | "matura"; tag?: string };

const GROUPS: Array<{ title: string; span: string; cols: string; marks: Mark[] }> = [
  {
    title: "Dla uczniów",
    span: "lg:col-span-2",
    cols: "grid-cols-2",
    marks: [
      { name: "Roadmapa", icon: Route, accent: "blue" },
      { name: "Trening", icon: PencilLine, accent: "green" },
      { name: "Symulacje", icon: Timer, accent: "lavender" },
      { name: "Korepetytor AI", icon: Zap, accent: "yellow", tag: "Bez limitu" },
    ],
  },
  {
    title: "Dla nauczycieli",
    span: "",
    cols: "grid-cols-1",
    marks: [
      { name: "Panel klasy", icon: LayoutDashboard, accent: "sapphire" },
      { name: "Raporty", icon: BarChart3, accent: "tangerine" },
    ],
  },
  {
    title: "Dla dyrekcji",
    span: "",
    cols: "grid-cols-1",
    marks: [
      { name: "Gotowość", icon: Gauge, accent: "tangerine" },
      { name: "Eksport", icon: Download, accent: "blue" },
    ],
  },
  {
    title: "Egzaminy CKE",
    span: "lg:col-span-2",
    cols: "grid-cols-2",
    marks: [
      { name: "Ósmoklasista", exam: "e8" },
      { name: "Matura", exam: "matura" },
      { name: "Rozszerzona", exam: "matura" },
      { name: "Arkusze CKE", icon: FileText, accent: "sapphire", tag: "6 lat" },
    ],
  },
];

function MarkItem({ mark }: { mark: Mark }) {
  return (
    <li className="relative flex h-14 flex-col items-center justify-center">
      <span className="flex items-center gap-2">
        {mark.exam === "e8" ? (
          <E8Icon className="h-4 w-5" />
        ) : mark.exam === "matura" ? (
          <MaturaIcon className="h-4 w-5" />
        ) : mark.icon && mark.accent ? (
          <AccentTile icon={mark.icon} accent={mark.accent} />
        ) : null}
        <span className="whitespace-nowrap font-satoshi text-[16px] font-bold tracking-tight text-charcoal">{mark.name}</span>
      </span>
      {mark.tag ? (
        <span className="mt-1 rounded-full bg-paper-mist px-1 py-0.5 text-[8px] font-semibold uppercase leading-none text-steel">{mark.tag}</span>
      ) : null}
    </li>
  );
}

export function CoverageBand() {
  return (
    <section aria-label="Co obejmuje licencja" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="mx-auto grid max-w-[var(--page-max-width)] grid-cols-1 gap-x-2 border-x border-ash px-2 pb-4 pt-2 sm:grid-cols-2 lg:grid-cols-6">
        {GROUPS.map((group, i) => (
          <Reveal key={group.title} delay={i * 60} className={cn("flex flex-col", group.span)}>
            <span className="rounded-md bg-paper-mist py-1 text-center text-xs font-medium text-steel">{group.title}</span>
            <ul className={cn("mt-2 grid gap-x-2", group.cols)}>
              {group.marks.map((mark) => (
                <MarkItem key={mark.name} mark={mark} />
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Offer ──────────────────────────────────────────────────────────────── */

type Feature = { icon: IconComponent; label: string; tip?: string };

const COLUMNS: Array<{ heading: string; items: Feature[] }> = [
  {
    heading: "Dla uczniów",
    items: [
      { icon: Route, label: "Roadmapa do egzaminu", tip: "Cały materiał rozpisany na tygodnie aż do dnia egzaminu." },
      { icon: Timer, label: "Symulacje bez limitu", tip: "Pełne arkusze na czas, z raportem po każdym." },
      { icon: Zap, label: "Korepetytor AI", tip: "Tłumaczy zadania krok po kroku i pamięta błędy ucznia." },
      { icon: InfinityIcon, label: "Bez limitu lub własne limity", tip: "Każdy uczeń korzysta ze wszystkiego bez limitu — albo w limitach, które ustala szkoła. Przez cały rok szkolny." },
    ],
  },
  {
    heading: "Dla nauczycieli",
    items: [
      { icon: LayoutDashboard, label: "Panel klasy", tip: "Postępy, słabe działy i gotowość każdego ucznia w jednym widoku." },
      { icon: BarChart3, label: "Raporty klasowe", tip: "Wyniki klasy w podziale na działy wymagań CKE." },
      { icon: FileText, label: "Sprawdziany od AI", tip: "Zestawy zadań układane pod to, z czym klasa ma trudności." },
      { icon: RefreshCcw, label: "Przydzielanie powtórek", tip: "Jedno kliknięcie dodaje powtórkę do roadmapy całej klasy." },
    ],
  },
  {
    heading: "Dla dyrekcji",
    items: [
      { icon: Gauge, label: "Gotowość rocznika", tip: "Jedna liczba dla każdej klasy i całego rocznika, aktualna na bieżąco." },
      { icon: Building2, label: "Wiele placówek", tip: "Wspólny panel dla sieci szkół i samorządów." },
      { icon: Download, label: "Eksport wyników", tip: "Raporty do PDF i CSV — na radę pedagogiczną i dla organu prowadzącego." },
      { icon: KeyRound, label: "Logowanie SSO", tip: "Konta szkolne Google Workspace lub Microsoft 365." },
    ],
  },
  {
    heading: "Wsparcie",
    items: [
      { icon: Headset, label: "Dedykowany opiekun" },
      { icon: Presentation, label: "Szkolenie nauczycieli", tip: "Godzinne szkolenie online dla całej rady pedagogicznej." },
      { icon: FileSignature, label: "Umowa RODO", tip: "Umowa powierzenia przetwarzania danych dla placówki." },
      { icon: CalendarDays, label: "Wdrożenie w tydzień", tip: "Importujemy listy klas — uczniowie dostają loginy w kilka dni." },
    ],
  },
];

type Day = [weekday: string, date: number];

const TILE = 108;
const GAP = 16;

/**
 * The reference's day strip: a month pill over five day tiles, the strip
 * faded at both ends. As it comes into view it slides one day along and
 * the date lands in the raised white tile, with a handwritten note on it.
 * It is a picture, not a calendar: nothing in it can be selected or hovered.
 */
function DayStrip({ month, days, note }: { month: string; days: Day[]; note: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4, true);
  const current = 2;
  return (
    <div ref={ref} aria-hidden inert className="relative flex cursor-default select-none flex-col items-center pt-9">
      <span className="rounded-full bg-[linear-gradient(90deg,transparent,#dbeafe_25%,#dbeafe_75%,transparent)] px-10 py-1 text-base font-medium text-blue-600">{month}</span>
      <div className="mt-2 w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_22%,black_78%,transparent)]">
        <div
          className="flex justify-center gap-4 py-2 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${inView ? 0 : TILE + GAP}px)` }}
        >
          {days.map(([weekday, date], i) => {
            const landed = inView && i === current;
            return (
              <div
                key={i}
                className={cn(
                  "relative flex h-[130px] w-[108px] shrink-0 flex-col items-center justify-center rounded-2xl transition-[background-color,box-shadow,border-color] delay-700 duration-500",
                  landed ? "border border-ash bg-white shadow-md" : i === current + 1 ? "border border-transparent bg-paper-mist" : "border border-transparent",
                )}
              >
                <span className={cn("text-base font-medium uppercase", landed ? "text-steel" : "text-silver")}>{weekday}</span>
                <span className={cn("font-satoshi text-5xl font-medium", landed ? "text-charcoal" : i === current + 1 ? "text-fog" : "text-smoke")}>{date}</span>
                {i === current ? (
                  <span
                    className={cn(
                      "absolute bottom-2 right-2 -rotate-12 font-[cursive] text-[11px] font-semibold italic text-blue-600 transition-opacity delay-1000 duration-300",
                      landed ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {note}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TermCard({ chip, title, children, strip, delay }: { chip: string; title: string; children: React.ReactNode; strip: React.ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col overflow-hidden rounded-xl border border-ash bg-canvas-muted">
      {strip}
      <div className="px-8 pb-10 pt-12">
        <span className="rounded-md bg-ash px-1.5 py-0.5 text-xs font-medium text-slate">{chip}</span>
        <h3 className="mt-5 font-satoshi text-3xl font-medium text-charcoal">{title}</h3>
        <p className="mt-4 max-w-md text-pretty text-body-lg text-steel">{children}</p>
      </div>
    </Reveal>
  );
}

export function OfferSection() {
  return (
    <section id="offer" aria-labelledby="offer-heading" className="relative scroll-mt-14 overflow-clip border-b border-ash bg-white px-4">
      <div className="mx-auto max-w-[var(--page-max-width)] border-x border-ash px-4 pb-10 pt-20 sm:px-5">
        <Reveal className="flex flex-col items-center text-center">
          <h2 id="offer-heading" className="max-w-xl text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl md:text-5xl">
            Zacznij od pilotażu w jednej klasie
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-fog sm:text-lg">
            Jedna licencja daje uczniom pełny dostęp do Examax oraz narzędzia dla nauczycieli i dyrekcji.
          </p>
        </Reveal>

        <Reveal className="mt-14 rounded-xl border border-ash bg-canvas-muted p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-md bg-ash px-1.5 py-0.5 text-xs font-medium text-slate">Licencja</span>
            <Link
              href="/pricing"
              className="focus-ring rounded-lg border border-ash bg-white px-3 py-1.5 text-body-sm font-medium text-charcoal transition-colors hover:bg-canvas-muted"
            >
              Zobacz cennik
            </Link>
          </div>
          <h3 className="-mt-1 font-satoshi text-3xl font-medium text-charcoal">Examax dla szkół</h3>
          <p className="mt-2 text-body text-fog">Nielimitowany dostęp dla każdego ucznia — albo limity, które ustala szkoła — i narzędzia dla całej kadry w jednej rocznej licencji.</p>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h4 className="text-body font-medium text-charcoal">{column.heading}</h4>
                <ul className="mt-4 flex flex-col gap-3 text-body text-steel">
                  {column.items.map((item) => (
                    <li key={item.label} className="flex items-center gap-3">
                      <item.icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                      {item.tip ? (
                        <Tooltip content={item.tip} className="underline decoration-dotted underline-offset-2">
                          {item.label}
                        </Tooltip>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TermCard
            delay={0}
            chip="Start"
            title="30 dni za darmo"
            strip={<DayStrip month="Wrzesień 2026" note="start!" days={[["nd", 30], ["pon", 31], ["wt", 1], ["śr", 2], ["czw", 3]]} />}
          >
            Pierwsza klasa korzysta z <strong className="font-semibold text-charcoal">pełnego Examaxa</strong> — razem z panelem nauczyciela — bez opłat przez
            cały pierwszy miesiąc.
          </TermCard>
          <TermCard
            delay={80}
            chip="Do egzaminu"
            title="Stała licencja na cały okres przygotowania do egzaminu"
            strip={<DayStrip month="Maj 2027" note="matura!" days={[["nd", 2], ["pon", 3], ["wt", 4], ["śr", 5], ["czw", 6]]} />}
          >
            Cenę ustalamy na <strong className="font-semibold text-charcoal">cały rok szkolny</strong> i nie zmieniamy jej aż do egzaminu ósmoklasisty i
            matury.
          </TermCard>
        </div>
      </div>
    </section>
  );
}
