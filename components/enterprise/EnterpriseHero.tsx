"use client";

import Image, { type StaticImageData } from "next/image";
import NumberFlow, { type Format } from "@number-flow/react";
import { Link2, MousePointer2, Percent, School, Ticket, Users, FileCheck, Gauge } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandMark";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

import zuzannaPhoto from "@/public/mockups/learner.jpg";
import kacperPhoto from "@/public/mockups/learner-kacper.jpg";
import szymonPhoto from "@/public/mockups/learner-szymon.jpg";
import majaPhoto from "@/public/mockups/learner-maja.jpg";

/*
 * The /enterprise hero — dub.co/startups' hero, one to one in build (live
 * DOM, 2026-10-01; `DesignRules/forInstitutions.png`, left page):
 *
 *   copy     pill, two-line headline, a line ending in a bold offer, actions
 *   canvas   from 464px down on large screens: dub's 18 ellipses on a
 *            1080×512 field, four soft colour washes (peach, pink, mint,
 *            blue), two rows of cards drifting sideways on each side, and a
 *            frosted 1px column in the middle holding the one big card
 *
 * Dub's side cards are partners with their revenue and payouts; here they
 * are students with their readiness and tasks solved, and a class badge
 * where dub has a flag. Dub's "Acme" card is the school: its banner, its
 * crest being placed (dashed ring, pointer, "Twoja szkoła" pill), two
 * offer buttons with hover pills, and three figures that count up while
 * their sparklines draw in.
 *
 * PLACEHOLDER DATA — the school, students and figures are illustrative.
 */

/* ── Side cards ─────────────────────────────────────────────────────────── */

type Student = { name: string; badge: string; readiness: number; tasks: string; photo?: StaticImageData; tint?: string };

const TINTS = [
  "from-[#fde68a] to-[#fca5a5]",
  "from-[#bfdbfe] to-[#c4b5fd]",
  "from-[#bbf7d0] to-[#99f6e4]",
  "from-[#fbcfe8] to-[#fde68a]",
  "from-[#c7d2fe] to-[#a5f3fc]",
];

const STUDENTS: Student[] = [
  { name: "Zuzanna N.", badge: "3c", readiness: 82, tasks: "1,2 tys.", photo: zuzannaPhoto },
  { name: "Antoni M.", badge: "8a", readiness: 64, tasks: "860" },
  { name: "Kacper L.", badge: "8b", readiness: 77, tasks: "1,1 tys.", photo: kacperPhoto },
  { name: "Lena K.", badge: "3a", readiness: 88, tasks: "1,6 tys." },
  { name: "Ignacy W.", badge: "2b", readiness: 59, tasks: "540" },
  { name: "Szymon W.", badge: "3c", readiness: 71, tasks: "930", photo: szymonPhoto },
  { name: "Hanna P.", badge: "8a", readiness: 91, tasks: "1,8 tys." },
  { name: "Franciszek D.", badge: "3b", readiness: 66, tasks: "720" },
  { name: "Maja Z.", badge: "3a", readiness: 85, tasks: "1,4 tys.", photo: majaPhoto },
  { name: "Oliwia S.", badge: "8b", readiness: 73, tasks: "990" },
];

/** Readiness in the colour of its band, as the score chips elsewhere on the site. */
const tone = (value: number) => (value >= 80 ? "text-[#16a34a]" : value >= 65 ? "text-[#ca8a04]" : "text-[#ea580c]");

function StudentCard({ student, index }: { student: Student; index: number }) {
  const initials = student.name.split(" ").map((part) => part[0]).join("");
  return (
    <div className="relative flex h-full w-full flex-col items-start gap-2 rounded-xl bg-white p-1 pb-2 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06),0px_2px_4px_0px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-150 ease-out hover:z-10 hover:scale-[1.03] hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_4px_8px_-2px_rgba(0,0,0,0.1),0px_8px_16px_-6px_rgba(0,0,0,0.08)]">
      <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-lg">
        {student.photo ? (
          <Image src={student.photo} alt="" fill sizes="120px" className="object-cover object-[center_30%]" />
        ) : (
          <div className={cn("grid size-full place-items-center bg-gradient-to-br", TINTS[index % TINTS.length])}>
            <span className="font-satoshi text-3xl font-bold text-charcoal/70">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.05)]" />
        {/* The reference's flag notch, holding the class instead */}
        <div className="absolute -left-2 -top-2 flex items-center rounded-br-xl bg-white pb-[5px] pl-[12px] pr-[6px] pt-[11px]">
          <span className="rounded-sm bg-paper-mist px-1 text-[9px] font-semibold leading-3 text-steel">{student.badge}</span>
        </div>
      </div>
      <div className="flex w-full shrink-0 items-start gap-1 whitespace-nowrap">
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-[9px] font-medium leading-[1.3] text-silver">Gotowość</span>
          <span className={cn("text-xs font-semibold leading-[1.3]", tone(student.readiness))}>{student.readiness}%</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-[9px] font-medium leading-[1.3] text-silver">Zadania</span>
          <span className="text-xs font-semibold leading-[1.3] text-steel">{student.tasks}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * One drifting row: five cards, drawn twice so the loop never shows a seam;
 * each copy travels its own width. Left rows drift right, right rows left.
 */
function CardRow({ offset, reverse, duration }: { offset: number; reverse?: boolean; duration: number }) {
  const row = Array.from({ length: 5 }, (_, i) => STUDENTS[(offset + i) % STUDENTS.length]);
  return (
    <div
      className={cn(
        "-my-4 h-[211.5px] w-[416px] overflow-hidden py-4",
        reverse ? "[mask-image:linear-gradient(90deg,transparent,black_12%)]" : "[mask-image:linear-gradient(270deg,transparent,black_12%)]",
      )}
    >
      <div className="flex h-full w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className={cn(
              "grid h-full w-[726.65px] shrink-0 grid-cols-5 gap-5 pr-5 [--scroll:-100%] motion-safe:animate-infinite-scroll",
              reverse && "[animation-direction:reverse]",
            )}
            style={{ "--scroll-duration": `${duration}s` } as React.CSSProperties}
          >
            {row.map((student, i) => (
              <StudentCard key={`${copy}-${i}`} student={student} index={offset + i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── The school card ────────────────────────────────────────────────────── */

const FIGURES: Array<{ icon: IconComponent; label: string; value: number; format?: Format; spark: string }> = [
  { icon: Users, label: "Uczniowie", value: 412, spark: "M1 20 C15 24 25 10 35 14 S55 22 65 12 S85 18 99 6" },
  { icon: FileCheck, label: "Rozwiązane zadania", value: 48213, spark: "M1 24 C12 22 22 16 32 18 S52 8 64 12 S84 4 99 3" },
  { icon: Gauge, label: "Średnia gotowość", value: 0.71, format: { style: "percent" }, spark: "M1 18 C14 22 24 14 36 16 S56 10 66 13 S86 9 99 5" },
];

const PILL = "whitespace-nowrap rounded-full border border-[#eee] bg-white shadow-[0px_4px_4px_-1px_rgba(0,0,0,0.04),0px_8px_12px_0px_rgba(0,0,0,0.06)]";

function OfferButton({ icon: Icon, hint }: { icon: IconComponent; hint: string }) {
  return (
    <div className="group relative">
      <a
        href="#offer"
        aria-label={hint}
        className="focus-ring flex size-10 items-center justify-center rounded-xl bg-ash/30 transition-colors hover:bg-ash/60"
      >
        <Icon className="size-[18px] text-steel" strokeWidth={1.5} />
      </a>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 origin-bottom -translate-x-1/2 scale-95 opacity-0 transition-[transform,opacity] duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100">
        <div className={cn(PILL, "px-3 py-1.5")}>
          <span className="text-xs font-semibold tracking-[-0.24px] text-steel">{hint}</span>
        </div>
      </div>
    </div>
  );
}

function SchoolCard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2, true);
  return (
    <div ref={ref} className="relative flex h-[587px] w-[346px] shrink-0 flex-col rounded-[18px] bg-canvas-muted p-2 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_1px_2px_-1px_rgba(0,0,0,0.08),0px_2px_4px_0px_rgba(0,0,0,0.06)]">
      {/* The banner: Examax's own spectrum, fanned into rays */}
      <div className="relative h-[123px] shrink-0 overflow-hidden rounded-[13px] border border-black/5">
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_115%,#2563eb,#7c3aed,#db2777,#ea580c,#facc15,#16a34a,#0891b2,#2563eb)]" />
        <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg_at_50%_115%,#ffffff2e_0deg_2deg,transparent_2deg_6deg)] blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_0%,#ffffff40,transparent_70%)]" />
      </div>

      {/* The crest being placed: an empty dashed ring, the puck lifted off it, the pointer */}
      <div className="absolute left-[20px] top-[95px] size-[68px] rounded-full bg-canvas-muted" />
      <svg viewBox="0 0 62 62" fill="none" aria-hidden className="absolute left-[23px] top-[98px] size-[62px] text-smoke">
        <circle cx="31" cy="32" r="26" stroke="currentColor" strokeWidth="3" strokeDasharray="6 8" strokeLinecap="round" />
      </svg>
      <div
        className={cn(
          "absolute left-[49px] top-[81px] flex size-[68px] items-center justify-center overflow-hidden rounded-full border border-black/20 bg-[#3d3d3d] text-white shadow-[0px_16px_29px_0px_rgba(0,0,0,0.1),0px_9px_15px_0px_rgba(0,0,0,0.07),0px_5px_7px_0px_rgba(0,0,0,0.06)] transition-transform delay-300 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          inView ? "translate-x-0 translate-y-0 -rotate-[13deg]" : "-translate-x-6 translate-y-4 rotate-0",
        )}
      >
        <div className="absolute inset-0 rounded-full bg-[linear-gradient(#a0a0a0,#3a3a3a)] opacity-70 mix-blend-soft-light" />
        <School className="relative size-7" strokeWidth={2} />
      </div>
      <MousePointer2
        aria-hidden
        className={cn(
          "absolute left-[100px] top-[76px] size-6 fill-white text-steel drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-transform delay-300 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          inView ? "translate-x-0 translate-y-0" : "-translate-x-6 translate-y-4",
        )}
        strokeWidth={1.25}
      />
      <div
        className={cn(
          PILL,
          "absolute left-[118px] top-[46px] flex items-center px-4 py-2 transition-[opacity,transform] delay-500 duration-500",
          inView ? "opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <span className="text-base font-semibold leading-6 tracking-[-0.32px] text-steel">Twoja szkoła</span>
      </div>

      <div className="relative mt-8 flex flex-col gap-4 px-3.5">
        {/* The card is a picture of the school's dashboard; only the two offer buttons are real. */}
        <div inert className="flex flex-col">
          <p className="text-2xl font-semibold leading-8 tracking-[-0.48px] text-graphite">LO nr 5</p>
          <p className="flex items-center gap-1 text-[15px] font-medium leading-[1.4] tracking-[-0.3px] text-silver">
            <Link2 className="size-3 -rotate-45" strokeWidth={2} aria-hidden />
            examax.app/lo5-krakow
          </p>
        </div>
        <div className="absolute right-3.5 top-2 flex items-center gap-1.5">
          <OfferButton icon={Ticket} hint="Licencja dla 412 uczniów" />
          <OfferButton icon={Percent} hint="30 dni pilotażu gratis" />
        </div>

        <div inert className="flex flex-col overflow-hidden rounded-xl bg-white">
          {FIGURES.map((figure, i) => (
            <div key={figure.label}>
              {i > 0 ? <div className="mx-5 h-px bg-[#f3f3f3]" /> : null}
              <div className="flex w-full items-center gap-3 py-4 pl-3 pr-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ash/30">
                    <figure.icon className="size-4 text-steel" strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-1 flex-col whitespace-nowrap">
                    <span className="-mb-0.5 text-sm font-medium tracking-[-0.28px] text-silver">{figure.label}</span>
                    <NumberFlow
                      value={inView ? figure.value : 0}
                      format={figure.format}
                      locales="pl-PL"
                      className="text-lg font-semibold tracking-[-0.36px] text-steel"
                    />
                  </div>
                </div>
                <svg viewBox="0 0 100 32" className="h-8 w-full max-w-[100px]" fill="none" aria-hidden>
                  <defs>
                    <linearGradient id={`school-stroke-${i}`} x1="0" x2="1">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id={`school-fill-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${figure.spark} L99 32 L1 32 Z`}
                    fill={`url(#school-fill-${i})`}
                    className={cn("transition-opacity delay-700 duration-700", inView ? "opacity-100" : "opacity-0")}
                  />
                  <path
                    d={figure.spark}
                    stroke={`url(#school-stroke-${i})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    className="transition-[stroke-dashoffset] duration-1000 ease-out"
                    style={{ strokeDashoffset: inView ? 0 : 1, transitionDelay: `${300 + i * 150}ms` }}
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── The hero ───────────────────────────────────────────────────────────── */

const ELLIPSES_LEFT: Array<[number, number]> = [[501.5, 39], [463, 77.5], [418.5, 122], [371.5, 169], [327, 213.5], [284, 256.5], [247, 293.5], [206.5, 334], [120, 420.5]];

export function EnterpriseHero() {
  return (
    <section aria-labelledby="enterprise-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative mx-auto flex w-full max-w-[var(--page-max-width)] flex-col items-center overflow-clip border-x border-ash bg-gradient-to-b from-white to-canvas-muted px-4 pt-16">
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
          <span
            className="animate-slide-up-fade flex w-fit items-center gap-2 rounded-full border border-ash bg-white px-3 py-1.5 text-xs font-medium leading-tight text-steel"
            style={{ "--offset": "10px" } as React.CSSProperties}
          >
            <BrandMark className="h-3 text-charcoal" />
            Examax dla szkół
          </span>
          <h1
            id="enterprise-heading"
            className="animate-slide-up-fade mt-6 max-w-2xl text-balance text-center font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]"
            style={{ "--offset": "20px" } as React.CSSProperties}
          >
            Przygotowanie do egzaminów dla całej szkoły
          </h1>
          <p
            className="animate-slide-up-fade mt-6 max-w-xl text-balance text-lg text-steel sm:text-xl"
            style={{ "--offset": "10px", "--delay": "150ms" } as React.CSSProperties}
          >
            Plan nauki, zadania CKE i wyniki uczniów&nbsp;— z&nbsp;panelem dla nauczycieli i&nbsp;dyrekcji.{" "}
            <span className="font-semibold text-slate">Pierwszy miesiąc pilotażu za darmo.</span>
          </p>
          <div
            className="animate-slide-up-fade relative mt-10 flex justify-center gap-2 sm:gap-4"
            style={{ "--offset": "5px", "--delay": "300ms" } as React.CSSProperties}
          >
            <Button href="#trial" variant="primary">
              Umów rozmowę
            </Button>
            <Button href="/contact" variant="outline">
              Umów prezentację
            </Button>
          </div>
        </div>

        {/* In the flow under the copy at every size, so a longer heading pushes the picture down
            instead of running into it. Its last 109px (the card's foot) are cut by the section's clip. */}
        <div className="relative mt-14 h-[512px] w-full lg:mt-20">
          {/* The ellipse field */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[512px] bg-white">
            <svg viewBox="0 0 1081 513" className="absolute inset-0 size-full text-ash" preserveAspectRatio="xMidYMid slice" fill="none">
              {ELLIPSES_LEFT.map(([cx, rx]) => (
                <g key={cx}>
                  <ellipse cx={cx} cy="256.5" rx={rx} ry="256" stroke="currentColor" />
                  <ellipse cx={1081 - cx} cy="256.5" rx={rx} ry="256" stroke="currentColor" />
                </g>
              ))}
              <rect x="0.5" y="0.5" width="1080" height="512" stroke="currentColor" />
            </svg>
          </div>
          {/* The four washes */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-[102px] h-[614px] [mask-image:linear-gradient(transparent,black_17%)]"
            style={{
              background:
                "radial-gradient(780px 640px at 8% 58%, rgba(255,153,102,0.2), transparent 72%), radial-gradient(660px 600px at 32% 72%, rgba(255,120,180,0.1), transparent 72%), radial-gradient(720px 620px at 68% 66%, rgba(96,220,160,0.16), transparent 72%), radial-gradient(780px 640px at 94% 58%, rgba(96,160,255,0.2), transparent 72%)",
            }}
          />

          {/* The students, drifting on both sides */}
          <div aria-hidden className="absolute right-1/2 top-[67px] mr-[173.5px] hidden md:block">
            <div className="flex flex-col gap-5">
              <CardRow offset={0} reverse duration={70} />
              <CardRow offset={5} reverse duration={84} />
            </div>
          </div>
          <div aria-hidden className="absolute left-1/2 top-[67px] ml-[172.5px] hidden md:block">
            <div className="flex flex-col gap-5">
              <CardRow offset={3} duration={76} />
              <CardRow offset={8} duration={90} />
            </div>
          </div>

          {/* The frosted column and the school's card */}
          <div
            className="animate-slide-up-fade absolute left-1/2 top-0 origin-top -translate-x-1/2 border border-ash bg-white/30 p-4 backdrop-blur-md max-[400px]:scale-[0.88]"
            style={{ "--offset": "20px", "--delay": "400ms" } as React.CSSProperties}
          >
            <SchoolCard />
          </div>
        </div>
      </div>
    </section>
  );
}
