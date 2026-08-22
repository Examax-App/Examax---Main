"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Likely first days of the May 2027 CKE session. Deliberately approximate —
 * the section carries an explicit "orientacyjne" footnote, and the exact
 * timetable is announced by CKE.
 */
const MATURA_DATE = new Date(2027, 4, 4);
const E8_DATE = new Date(2027, 4, 11);

function daysUntil(target: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000));
}

function subscribeToNothing() {
  return () => {};
}

/**
 * Client-clock value with a null server snapshot: the server (and first
 * hydration pass) renders a placeholder, the real number appears right after
 * hydration — no mismatch, no setState-in-effect.
 */
function useDaysUntil(target: Date) {
  return useSyncExternalStore(
    subscribeToNothing,
    () => daysUntil(target),
    () => null,
  );
}

/** Count-up from ~92% of the target once the number scrolls into view. */
function AnimatedDays({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || !inView || startedRef.current) return;
    startedRef.current = true;
    const start = Math.round(value * 0.92);
    const duration = 1200;
    const startedAt = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {reducedMotion ? value : display}
    </span>
  );
}

/* May 2027: May 1st is a Saturday → 5 leading blanks in a Monday-first grid. */
const MAY_OFFSET = 5;
const MAY_DAYS = 31;
const WEEKDAY_LABELS = ["pn", "wt", "śr", "cz", "pt", "so", "nd"];

function dayKind(day: number): "matura" | "e8" | "holiday" | "plain" {
  if (day >= 4 && day <= 7) return "matura";
  if (day >= 11 && day <= 13) return "e8";
  if (day === 1 || day === 3) return "holiday";
  return "plain";
}

function CalendarCard({
  maturaDays,
  e8Days,
}: {
  maturaDays: number | null;
  e8Days: number | null;
}) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-largecards border border-ash bg-white p-5 shadow-ring sm:p-6">
        <div className="flex items-baseline justify-between">
          <p className="font-satoshi text-heading-sm font-bold tracking-tight text-charcoal">
            Maj 2027
          </p>
          <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-fog">
            Sesja CKE
          </p>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {WEEKDAY_LABELS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "pb-1 text-[10px] font-medium uppercase tracking-[0.08em]",
                index >= 5 ? "text-silver" : "text-fog",
              )}
            >
              {label}
            </span>
          ))}
          {Array.from({ length: MAY_OFFSET }).map((_, index) => (
            <span key={`blank-${index}`} aria-hidden />
          ))}
          {Array.from({ length: MAY_DAYS }, (_, index) => {
            const day = index + 1;
            const kind = dayKind(day);
            const weekend = (MAY_OFFSET + index) % 7 >= 5;
            return (
              <span
                key={day}
                className={cn(
                  "relative grid aspect-square place-items-center rounded-buttons text-[12px] tabular-nums",
                  kind === "matura" &&
                    "bg-sidebar-active font-semibold text-deep-sapphire",
                  kind === "e8" && "bg-soft-mint font-semibold text-[#166534]",
                  kind === "holiday" && "text-silver",
                  kind === "plain" && (weekend ? "text-silver" : "text-steel"),
                )}
              >
                {day}
                {kind === "holiday" ? (
                  <span
                    className="absolute bottom-0.5 size-1 rounded-full bg-[#dc2626]/60"
                    aria-hidden
                  />
                ) : null}
              </span>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-ash pt-3.5 text-[11px] text-steel">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[3px] bg-sidebar-active ring-1 ring-inset ring-deep-sapphire/30" aria-hidden />
            Matura — start sesji
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[3px] bg-soft-mint ring-1 ring-inset ring-vivid-green/40" aria-hidden />
            Egzamin ósmoklasisty
          </span>
        </div>
      </div>

      {/* Floating countdown chips */}
      <div className="animate-float absolute -left-4 -top-4 sm:-left-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-2 text-[12px] font-medium text-charcoal shadow-md">
          <span className="size-2 rounded-full bg-electric-blue" aria-hidden />
          Matura ·{" "}
          <span className="font-geist-mono tabular-nums">
            {maturaDays === null ? "—" : `za ${maturaDays} dni`}
          </span>
        </span>
      </div>
      <div className="animate-float-delayed absolute -bottom-4 -right-3 sm:-right-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-2 text-[12px] font-medium text-charcoal shadow-md">
          <span className="size-2 rounded-full bg-vivid-green" aria-hidden />
          E8 ·{" "}
          <span className="font-geist-mono tabular-nums">
            {e8Days === null ? "—" : `za ${e8Days} dni`}
          </span>
        </span>
      </div>
    </div>
  );
}

/**
 * The urgency band: live day-counters to the May 2027 CKE session beside a
 * calendar card with the exam windows marked. Replaces vanity metrics with
 * the one number every student already feels.
 */
export function Countdown() {
  const maturaDays = useDaysUntil(MATURA_DATE);
  const e8Days = useDaysUntil(E8_DATE);

  return (
    <section
      id="terminy"
      aria-labelledby="terminy-heading"
      className="relative overflow-hidden border-t border-ash bg-paper-mist"
    >
      <Container className="relative py-16 sm:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2
              id="terminy-heading"
              className="font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none"
            >
              Do egzaminu liczy się każdy dzień
            </h2>
            <p className="mt-5 max-w-md text-body-xl text-steel">
              Nie musisz robić wszystkiego naraz. Wystarczy, że wiesz, co
              zrobić dziś — a od tego jest roadmapa.
            </p>

            <dl className="mt-10 space-y-8">
              <div>
                <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-steel">
                  Dni do matury
                </dt>
                <dd className="mt-2 font-geist-mono text-heading font-medium leading-none text-tangerine sm:text-heading-lg">
                  {maturaDays === null ? "—" : <AnimatedDays value={maturaDays} />}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-steel">
                  Dni do egzaminu ósmoklasisty
                </dt>
                <dd className="mt-2 font-geist-mono text-heading font-medium leading-none text-tangerine sm:text-heading-lg">
                  {e8Days === null ? "—" : <AnimatedDays value={e8Days} />}
                </dd>
              </div>
            </dl>

            <p className="mt-8 text-[12px] text-fog">
              Terminy orientacyjne — oficjalny harmonogram ogłasza CKE.
            </p>

            <Button href="#cennik" variant="primary" className="mt-6">
              Zacznij dziś
            </Button>
          </Reveal>

          <Reveal delay={120}>
            <CalendarCard maturaDays={maturaDays} e8Days={e8Days} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
