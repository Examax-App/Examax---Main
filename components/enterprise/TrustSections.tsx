import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar1,
  Cpu,
  DatabaseBackup,
  GraduationCap,
  Lock,
  MapPin,
  MousePointer2,
  PencilLine,
  Route,
  School,
  Server,
  Timer,
  Users,
  Zap,
  BadgePercent,
  FileText,
  ListChecks,
  Gauge,
} from "lucide-react";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { Reveal } from "@/components/ui/Reveal";
import { GridPattern } from "@/components/training/GridPattern";
import { SectionHeader } from "@/components/roadmap/sections";
import { cn } from "@/lib/cn";
import { prefetchFor } from "@/lib/routes";
import type { IconComponent } from "@/lib/icon";

import zuzannaPhoto from "@/public/mockups/learner.jpg";
import kacperPhoto from "@/public/mockups/learner-kacper.jpg";
import szymonPhoto from "@/public/mockups/learner-szymon.jpg";
import majaPhoto from "@/public/mockups/learner-maja.jpg";

/*
 * The rest of /enterprise between the toolkit and the FAQ (live DOM of both
 * reference pages, 2026-10-01):
 *
 *   SecuritySection    ← dub.co/enterprise "Data security": three named
 *                        pillars, then three ruled badge cells (stacked mono
 *                        words, a ring of EU stars, a chip glyph)
 *   CommunitySection   ← dub.co/enterprise "Open source": copy on the left
 *                        (the reference's actions left out), two stacked
 *                        cells on the right
 *   EligibilitySection ← dub.co/startups "Program eligibility": a sticky
 *                        intro beside a ruled list with coloured glyphs
 *   PlatformCanvas     ← dub.co/startups "Start where great companies
 *                        excel": copy on a muted band, app tiles across a
 *                        grid and the school's tile being placed among them
 *
 * PLACEHOLDER DATA — the claims, people and figures are illustrative.
 */

/* ── Security ───────────────────────────────────────────────────────────── */

const PILLARS: Array<{ icon: IconComponent; title: string; text: string }> = [
  { icon: Server, title: "Dane w Unii Europejskiej", text: "Serwery i kopie w UE" },
  { icon: DatabaseBackup, title: "Codzienne kopie zapasowe", text: "Odtworzenie w kilka minut" },
  { icon: Lock, title: "Dostęp tylko dla szkoły", text: "Role dla dyrekcji i nauczycieli" },
];

function LearnMore({ href }: { href: string }) {
  return (
    <Link
      href={href}
      prefetch={prefetchFor(href)}
      className="focus-ring absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-ash bg-white py-1 pl-2.5 pr-1.5 font-inter text-xs font-medium text-charcoal shadow-subtle transition-colors hover:bg-canvas-muted"
    >
      Dowiedz się więcej
      <span className="grid size-4 place-items-center rounded-full bg-paper-mist">
        <ArrowUpRight className="size-2.5" strokeWidth={2.5} />
      </span>
    </Link>
  );
}

/** The ring of twelve stars, as on the EU flag, drawn in hairline grey. */
function StarRing() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-silver" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI;
        return (
          <text key={i} x={50 + Math.cos(a) * 40} y={50 + Math.sin(a) * 40} dy="0.35em" textAnchor="middle" fontSize="9" fill="currentColor">
            ★
          </text>
        );
      })}
    </svg>
  );
}

export function SecuritySection() {
  return (
    <section id="security" aria-labelledby="security-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="mx-auto max-w-[var(--page-max-width)] border-x border-ash pt-20">
        <SectionHeader
          id="security-heading"
          icon={Lock}
          eyebrow="Bezpieczeństwo danych"
          title="Dane uczniów pod ochroną"
          sub="Przetwarzamy tylko to, czego potrzebuje nauka — z szyfrowaniem w spoczynku i w transmisji, na serwerach w Unii Europejskiej."
        />
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-10 px-4 pb-14 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 80} className="flex flex-col items-center text-center">
              <pillar.icon className="size-9 text-charcoal" strokeWidth={1.25} aria-hidden />
              <h3 className="mt-5 font-medium text-charcoal">{pillar.title}</h3>
              <p className="mt-1 text-body text-fog">{pillar.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="grid grid-cols-1 divide-ash border-t border-ash max-md:divide-y md:grid-cols-3 md:divide-x">
          <div className="relative flex h-52 flex-col items-center justify-center font-geist-mono text-lg text-charcoal">
            <LearnMore href="/help" />
            <span>RODO</span>
            <span className="my-4 h-px w-16 bg-smoke" />
            <span>DPA</span>
          </div>
          <div className="relative flex h-52 items-center justify-center">
            <LearnMore href="/help" />
            <div className="relative grid size-24 place-items-center">
              <StarRing />
              <span className="font-geist-mono text-lg text-charcoal">UE</span>
            </div>
          </div>
          <div className="relative flex h-52 flex-col items-center justify-center gap-3 font-geist-mono text-sm text-charcoal">
            <Cpu className="size-7 text-silver" strokeWidth={1.25} aria-hidden />
            <span className="text-center leading-tight">
              AES
              <br />
              256-BIT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Community ──────────────────────────────────────────────────────────── */

const SHEETS = [
  { exam: "matura" as const, label: "Matura 2026", detail: "Matematyka" },
  { exam: "e8" as const, label: "Ósmoklasista 2026", detail: "Język polski" },
  { exam: "matura" as const, label: "Matura 2026", detail: "Język angielski" },
];

function SheetFan() {
  return (
    <div aria-hidden className="relative flex h-32 cursor-default select-none items-end justify-center">
      {SHEETS.map((sheet, i) => (
        <div
          key={i}
          className="absolute bottom-0 flex h-28 w-24 flex-col justify-between rounded-lg border border-ash bg-white p-2.5 shadow-md"
          style={{ transform: `translateX(${(i - 1) * 64}px) rotate(${(i - 1) * 9}deg) translateY(${Math.abs(i - 1) * 8}px)`, zIndex: i === 1 ? 2 : 1 }}
        >
          {sheet.exam === "e8" ? <E8Icon className="h-3 w-4" /> : <MaturaIcon className="h-3 w-4" />}
          <div className="flex flex-col gap-1">
            <span className="h-1 w-full rounded bg-paper-mist" />
            <span className="h-1 w-4/5 rounded bg-paper-mist" />
            <span className="h-1 w-3/5 rounded bg-paper-mist" />
          </div>
          <div>
            <p className="text-[8px] font-semibold leading-tight text-charcoal">{sheet.label}</p>
            <p className="text-[7px] text-fog">{sheet.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const TEACHERS = [
  { photo: zuzannaPhoto },
  { photo: kacperPhoto },
  { initials: "AW", tint: "from-[#bfdbfe] to-[#c4b5fd]" },
  { photo: szymonPhoto },
  { initials: "MK", tint: "from-[#fde68a] to-[#fca5a5]" },
  { photo: majaPhoto },
  { initials: "PN", tint: "from-[#bbf7d0] to-[#99f6e4]" },
  { initials: "EJ", tint: "from-[#fbcfe8] to-[#fde68a]" },
];

export function CommunitySection() {
  return (
    <section id="community" aria-labelledby="community-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="mx-auto grid max-w-[var(--page-max-width)] grid-cols-1 border-x border-ash md:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-6 py-14 sm:px-10">
          <span className="flex items-center gap-2 text-base font-medium text-fog">
            <GraduationCap className="size-4" strokeWidth={2} aria-hidden />
            Razem ze szkołami
          </span>
          <h2 id="community-heading" className="mt-3 max-w-md text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl">
            Budujemy Examax razem z nauczycielami
          </h2>
          <p className="mt-4 max-w-md text-pretty text-body-xl text-fog">
            Szkoły w pilotażu decydują, co powstaje dalej — a nowe arkusze CKE trafiają do bazy, gdy tylko zostaną opublikowane.
          </p>
        </Reveal>
        <div className="grid grid-rows-2 divide-y divide-ash border-ash max-md:border-t md:border-l">
          <Reveal className="flex flex-col items-center justify-center gap-5 px-6 py-10">
            <SheetFan />
            <p className="text-body font-medium text-charcoal">Nowe arkusze CKE w dniu publikacji</p>
          </Reveal>
          <Reveal delay={80} className="flex flex-col items-center justify-center gap-5 px-6 py-10">
            <div aria-hidden className="grid cursor-default select-none grid-cols-4 gap-3">
              {TEACHERS.map((teacher, i) => (
                <span key={i} className="relative size-10 overflow-hidden rounded-full border-2 border-white shadow-md">
                  {teacher.photo ? (
                    <Image src={teacher.photo} alt="" fill sizes="40px" className="object-cover object-[center_30%]" />
                  ) : (
                    <span className={cn("grid size-full place-items-center bg-gradient-to-br text-xs font-semibold text-charcoal/70", teacher.tint)}>
                      {teacher.initials}
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-body font-medium text-charcoal">Nauczyciele, którzy testują nowe funkcje</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Eligibility ────────────────────────────────────────────────────────── */

const WHO: Array<{ icon: IconComponent; tint: string; title: string; text: string }> = [
  { icon: School, tint: "text-electric-blue", title: "Szkoły podstawowe", text: "Klasy 7 i 8, które przygotowują się do egzaminu ósmoklasisty." },
  { icon: GraduationCap, tint: "text-tangerine", title: "Licea i technika", text: "Matura podstawowa i rozszerzona, od pierwszej do ostatniej klasy." },
  { icon: Users, tint: "text-vivid-green", title: "Szkoły językowe i korepetycje", text: "Grupy, w których nauczyciel chce widzieć postępy każdego ucznia." },
  { icon: MapPin, tint: "text-lavender", title: "Samorządy i sieci szkół", text: "Jedna licencja i wspólne raporty dla wielu placówek naraz." },
  { icon: Calendar1, tint: "text-[#ca8a04]", title: "Na cały rok szkolny", text: "Licencja trwa do egzaminu — od września do czerwca." },
];

export function EligibilitySection() {
  return (
    <section id="eligibility" aria-labelledby="eligibility-heading" className="relative border-b border-ash bg-white px-4">
      <div className="mx-auto grid max-w-[var(--page-max-width)] grid-cols-1 border-x border-ash md:grid-cols-2">
        <div className="px-6 py-14 sm:px-10 md:sticky md:top-14 md:self-start md:py-20">
          <h2 id="eligibility-heading" className="font-satoshi text-4xl font-medium text-charcoal sm:text-5xl">
            Dla kogo jest licencja
          </h2>
          <p className="mt-5 max-w-sm text-pretty text-body-xl text-fog">
            Dla każdej placówki, która przygotowuje uczniów do egzaminów CKE i chce widzieć, jak im idzie.
          </p>
        </div>
        <ul className="divide-y divide-ash border-ash md:border-l">
          {WHO.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 40} className="px-6 py-10 sm:px-10">
                <item.icon className={cn("size-6", item.tint)} strokeWidth={1.75} aria-hidden />
                <h3 className="mt-5 text-lg font-medium text-charcoal">{item.title}</h3>
                <p className="mt-1 text-body-lg text-fog">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Platform canvas ────────────────────────────────────────────────────── */

type AppTile = { label: string; icon: IconComponent; accent: Accent; col: number; row: number; href: string };

/** Placed on the reference's 80px grid, by column and row. */
const TILES: AppTile[] = [
  { label: "Śledzenie postępów", icon: BadgePercent, accent: "tangerine", col: 1, row: 1, href: "/progress" },
  { label: "Arkusze CKE", icon: FileText, accent: "sapphire", col: 3, row: 1, href: "/training#coverage" },
  { label: "Roadmapa nauki", icon: Route, accent: "blue", col: 5, row: 0, href: "/roadmap" },
  { label: "Symulacja egzaminu", icon: Timer, accent: "lavender", col: 6, row: 1, href: "/simulation" },
  { label: "Trening zadań", icon: PencilLine, accent: "green", col: 2, row: 2, href: "/training" },
  { label: "Korepetytor AI", icon: Zap, accent: "yellow", col: 5, row: 2, href: "/agents" },
  { label: "Quiz diagnostyczny", icon: ListChecks, accent: "green", col: 4, row: 3, href: "/training#diagnostic" },
  { label: "Gotowość", icon: Gauge, accent: "tangerine", col: 2, row: 4, href: "/progress" },
  { label: "Raporty", icon: Users, accent: "blue", col: 6, row: 4, href: "/progress#glance" },
];

const STEP = 80;

export function PlatformCanvas() {
  return (
    <section aria-labelledby="platform-heading" className="relative overflow-clip border-b border-ash bg-paper-mist px-4">
      <div className="relative mx-auto grid max-w-[var(--page-max-width)] grid-cols-1 border-x border-ash lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <Reveal className="relative z-10 flex flex-col justify-between gap-12 px-6 py-14 sm:px-10">
          <div>
            <h2 id="platform-heading" className="max-w-sm text-balance font-satoshi text-4xl font-medium text-charcoal sm:text-5xl">
              Cały Examax w jednej licencji
            </h2>
            <p className="mt-4 max-w-sm text-pretty text-body-xl text-fog">
              Trening, roadmapa, postępy, symulacje i Korepetytor AI — dla każdego ucznia, od pierwszego dnia pilotażu.
            </p>
          </div>
          <div>
            <p className="text-body text-fog">Poznaj produkty</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TILES.slice(0, 4).map((tile) => (
                <Link
                  key={tile.label}
                  href={tile.href}
                  className="focus-ring flex items-center gap-2 rounded-lg border border-ash bg-white py-1.5 pl-1.5 pr-3 text-body-sm font-medium text-charcoal shadow-subtle transition-colors hover:bg-canvas-muted"
                >
                  <span className={cn("grid size-6 place-items-center rounded-md border border-black/5", accentStyles[tile.accent].chip)}>
                    <tile.icon className="size-3.5" strokeWidth={2.25} aria-hidden />
                  </span>
                  {tile.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="relative h-[460px] overflow-hidden max-lg:border-t max-lg:border-ash">
          <GridPattern id="enterprise-platform-grid" size={STEP} className="inset-0 text-ash [mask-image:radial-gradient(70%_80%_at_50%_50%,black,transparent)]" />
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[560px] -translate-x-1/2 -translate-y-1/2 max-sm:scale-[0.62]">
            {TILES.map((tile, i) => (
              <Link
                key={tile.label}
                href={tile.href}
                title={tile.label}
                aria-label={tile.label}
                className={cn(
                  "focus-ring absolute grid size-[76px] place-items-center rounded-[22px] border border-black/10 shadow-[inset_0_1px_0_#ffffff80,0_10px_20px_-8px_#0000004d] transition-transform duration-200 hover:-translate-y-1 hover:scale-105",
                  accentStyles[tile.accent].chip,
                )}
                style={{ left: tile.col * STEP + 2, top: tile.row * STEP + 2, animationDelay: `${i * 60}ms` }}
              >
                <span aria-hidden className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(#ffffff59,transparent_55%)]" />
                <tile.icon className="relative size-8" strokeWidth={2.25} aria-hidden />
              </Link>
            ))}

            {/* The school's tile, being placed: a dashed slot, the tilted tile, the pointer and its pill */}
            <div aria-hidden className="absolute" style={{ left: 10, top: 3 * STEP + 2 }}>
              <span className="absolute -left-2 -top-2 size-[84px] rounded-[24px] border-2 border-dashed border-smoke" />
              <span className="relative grid size-[76px] -rotate-12 place-items-center rounded-[22px] border border-black/20 bg-[#3d3d3d] text-white shadow-[0_16px_29px_0_rgba(0,0,0,0.12)]">
                <School className="size-8" strokeWidth={2} />
              </span>
              <MousePointer2 className="absolute -right-3 top-0 size-6 fill-white text-steel drop-shadow" strokeWidth={1.25} />
              <span className="absolute left-[86px] top-6 whitespace-nowrap rounded-full border border-[#eee] bg-white px-4 py-2 text-base font-semibold text-steel shadow-[0_8px_12px_0_rgba(0,0,0,0.06)]">
                Twoja szkoła
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
