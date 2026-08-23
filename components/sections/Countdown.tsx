"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useDaysUntil } from "@/components/ui/ExamCountdown";
import { E8_DATE, MATURA_DATE } from "@/lib/examDates";
import { cn } from "@/lib/cn";

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
                  kind === "matura" && "bg-electric-blue font-semibold text-white",
                  kind === "e8" &&
                    "bg-sidebar-active font-semibold text-electric-blue",
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
            <span className="size-2 rounded-[3px] bg-electric-blue" aria-hidden />
            Matura — start sesji
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[3px] bg-sidebar-active ring-1 ring-inset ring-electric-blue/40" aria-hidden />
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
          <span className="size-2 rounded-full bg-[#60a5fa]" aria-hidden />
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
      className="col-rules relative overflow-hidden border-t border-ash bg-paper-mist"
    >
      <Container className="relative py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2
              id="terminy-heading"
              className="font-satoshi text-heading-lg font-medium leading-[1.15] text-charcoal sm:text-display sm:leading-[1.15]"
            >
              Do egzaminu liczy się każdy dzień
            </h2>
            <p className="mt-5 max-w-md text-body-xl text-steel">
              Nie musisz robić wszystkiego naraz. Wystarczy, że wiesz, co
              zrobić dziś — a od tego jest roadmapa.
            </p>

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
